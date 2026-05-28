#!/usr/bin/env node
// Publicar no Instagram via Graph API usando Supabase Storage (substituto do imgBB)
// Suporta carrossel (2-10 imagens) E single image (print tweet, quote card)
//
// Usage:
//   node publicar-instagram-supabase.mjs --images "img1.png,img2.png" --caption "texto" [--dry-run]
//   node publicar-instagram-supabase.mjs --images "tweet.png" --caption "texto" [--dry-run]   # single
//
// Fluxo:
//   1. Upload das imagens para bucket Supabase 'carrossel-images' (temporário)
//   2. Publica no Instagram via Graph API
//   3. Deleta as imagens do Supabase após publicação (cleanup)

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '/Users/castelofortefloripa/claude/squads/conteudo/app/carrossel-dashboard/node_modules/@supabase/supabase-js/dist/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SQUAD_ROOT = resolve(__dirname, '..');
const BUCKET = 'carrossel-images';
const UPLOAD_FOLDER = 'instagram-publish-temp';

// ── Carregar .env ────────────────────────────────────────────

function loadEnvFile() {
  const envPath = resolve(SQUAD_ROOT, '.env');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

// ── Parse args ───────────────────────────────────────────────

function parseArgs(argv) {
  const args = { images: [], caption: '', dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--images' && i + 1 < argv.length) {
      args.images = argv[++i].split(',').map(s => s.trim()).filter(Boolean);
    } else if (argv[i] === '--caption' && i + 1 < argv.length) {
      args.caption = argv[++i];
    } else if (argv[i] === '--caption-file' && i + 1 < argv.length) {
      args.caption = readFileSync(resolve(argv[++i]), 'utf-8').trim();
    } else if (argv[i] === '--dry-run') {
      args.dryRun = true;
    }
  }
  return args;
}

// ── Upload Supabase ──────────────────────────────────────────

async function uploadToSupabase(supabase, imagePath) {
  const absolutePath = resolve(imagePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Imagem nao encontrada: ${absolutePath}`);
  }

  const fileBuffer = readFileSync(absolutePath);
  const ext = (basename(absolutePath).split('.').pop() || 'png').toLowerCase();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const filename = `${timestamp}-${random}.${ext}`;
  const storagePath = `${UPLOAD_FOLDER}/${filename}`;

  const contentType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType,
      cacheControl: '60',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Falha no upload Supabase: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return { url: data.publicUrl, storagePath };
}

async function deleteFromSupabase(supabase, storagePaths) {
  if (!storagePaths.length) return;
  const { error } = await supabase.storage.from(BUCKET).remove(storagePaths);
  if (error) {
    console.warn(`  Aviso: falha ao deletar do Supabase: ${error.message}`);
  } else {
    console.log(`  ${storagePaths.length} imagem(ns) removida(s) do Supabase.`);
  }
}

// ── Instagram Graph API ──────────────────────────────────────

const IG_BASE = 'https://graph.facebook.com/v21.0';

async function createSingleImageContainer(userId, imageUrl, caption, accessToken) {
  const params = new URLSearchParams({
    image_url: imageUrl,
    caption,
    access_token: accessToken,
  });
  const res = await fetch(`${IG_BASE}/${userId}/media?${params}`, { method: 'POST' });
  if (!res.ok) {
    throw new Error(`Falha ao criar container single [${res.status}]: ${await res.text()}`);
  }
  return (await res.json()).id;
}

async function createChildContainer(userId, imageUrl, accessToken) {
  const params = new URLSearchParams({
    image_url: imageUrl,
    is_carousel_item: 'true',
    access_token: accessToken,
  });
  const res = await fetch(`${IG_BASE}/${userId}/media?${params}`, { method: 'POST' });
  if (!res.ok) {
    throw new Error(`Falha ao criar container filho [${res.status}]: ${await res.text()}`);
  }
  return (await res.json()).id;
}

async function getContainerStatus(containerId, accessToken) {
  const params = new URLSearchParams({ fields: 'status_code', access_token: accessToken });
  const res = await fetch(`${IG_BASE}/${containerId}?${params}`);
  if (!res.ok) {
    throw new Error(`Falha ao verificar status [${res.status}]: ${await res.text()}`);
  }
  return (await res.json()).status_code;
}

async function pollUntilFinished(containerId, accessToken, timeoutMs = 60_000, intervalMs = 3_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const status = await getContainerStatus(containerId, accessToken);
    if (status === 'FINISHED') return;
    if (status === 'ERROR') throw new Error(`Container ${containerId} entrou em estado ERROR`);
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error(`Container ${containerId} excedeu timeout de ${timeoutMs}ms`);
}

async function createCarouselContainer(userId, childIds, caption, accessToken) {
  const params = new URLSearchParams({
    media_type: 'CAROUSEL_ALBUM',
    children: childIds.join(','),
    caption,
    access_token: accessToken,
  });
  const res = await fetch(`${IG_BASE}/${userId}/media?${params}`, { method: 'POST' });
  if (!res.ok) {
    throw new Error(`Falha ao criar container do carrossel [${res.status}]: ${await res.text()}`);
  }
  return (await res.json()).id;
}

async function publishMedia(userId, containerId, accessToken) {
  const params = new URLSearchParams({ creation_id: containerId, access_token: accessToken });
  const res = await fetch(`${IG_BASE}/${userId}/media_publish?${params}`, { method: 'POST' });
  if (!res.ok) {
    throw new Error(`Falha ao publicar [${res.status}]: ${await res.text()}`);
  }
  return (await res.json()).id;
}

async function getPermalink(mediaId, accessToken) {
  const params = new URLSearchParams({ fields: 'permalink', access_token: accessToken });
  const res = await fetch(`${IG_BASE}/${mediaId}?${params}`);
  if (!res.ok) return null;
  const json = await res.json();
  return json.permalink ?? null;
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  loadEnvFile();

  const { images, caption, dryRun } = parseArgs(process.argv);

  // Validacoes
  if (!images.length) {
    throw new Error('Parametro --images obrigatorio (ex: --images "slide1.png,slide2.png")');
  }
  if (!caption) {
    throw new Error('Parametro --caption obrigatorio');
  }
  if (images.length > 10) {
    throw new Error(`Instagram aceita no maximo 10 imagens (recebido: ${images.length})`);
  }
  if (caption.length > 2200) {
    throw new Error(`Legenda excede limite de 2200 caracteres do Instagram (recebido: ${caption.length})`);
  }

  const {
    NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_KEY,
    SUPABASE_URL,
    INSTAGRAM_ACCESS_TOKEN,
    INSTAGRAM_BUSINESS_ACCOUNT_ID,
  } = process.env;

  const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL nao configurada no .env');
  }
  if (!SUPABASE_SERVICE_KEY) {
    throw new Error('SUPABASE_SERVICE_KEY nao configurada no .env');
  }
  if (!INSTAGRAM_ACCESS_TOKEN) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN nao configurado no .env');
  }
  if (!INSTAGRAM_BUSINESS_ACCOUNT_ID) {
    throw new Error('INSTAGRAM_BUSINESS_ACCOUNT_ID nao configurado no .env');
  }

  const supabase = createClient(supabaseUrl, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const isSingle = images.length === 1;
  const uploadedPaths = [];

  console.log(`Tipo de publicacao: ${isSingle ? 'Single image (print tweet/quote)' : `Carrossel (${images.length} imagens)`}`);
  console.log(`Enviando ${images.length} imagem(ns) para Supabase...`);

  const imageUrls = [];
  for (let i = 0; i < images.length; i++) {
    const { url, storagePath } = await uploadToSupabase(supabase, images[i]);
    imageUrls.push(url);
    uploadedPaths.push(storagePath);
    console.log(`  [${i + 1}/${images.length}] ${url}`);
  }

  try {
    let containerId;
    let childIds = [];

    if (isSingle) {
      console.log('\nCriando container single image...');
      containerId = await createSingleImageContainer(
        INSTAGRAM_BUSINESS_ACCOUNT_ID, imageUrls[0], caption, INSTAGRAM_ACCESS_TOKEN
      );
      console.log(`  ID: ${containerId}`);

      console.log('\nAguardando processamento...');
      await pollUntilFinished(containerId, INSTAGRAM_ACCESS_TOKEN);
      console.log('  Pronto.');
    } else {
      console.log('\nCriando containers filhos...');
      for (const url of imageUrls) {
        const id = await createChildContainer(INSTAGRAM_BUSINESS_ACCOUNT_ID, url, INSTAGRAM_ACCESS_TOKEN);
        childIds.push(id);
      }
      console.log(`  IDs: ${childIds.join(', ')}`);

      console.log('\nAguardando processamento dos containers filhos...');
      for (const id of childIds) {
        await pollUntilFinished(id, INSTAGRAM_ACCESS_TOKEN);
      }

      console.log('\nCriando container do carrossel...');
      containerId = await createCarouselContainer(
        INSTAGRAM_BUSINESS_ACCOUNT_ID, childIds, caption, INSTAGRAM_ACCESS_TOKEN
      );
      await pollUntilFinished(containerId, INSTAGRAM_ACCESS_TOKEN);
      console.log(`  ID do carrossel: ${containerId}`);
    }

    if (dryRun) {
      const result = {
        status: 'dry_run',
        type: isSingle ? 'single' : 'carousel',
        container_id: containerId,
        child_ids: childIds,
        image_urls: imageUrls,
        caption_length: caption.length,
        timestamp: new Date().toISOString(),
      };
      console.log('\nDRY RUN completo — publicacao final nao executada.');
      console.log(JSON.stringify(result, null, 2));
      console.log('\nLimpando imagens temporarias do Supabase...');
      await deleteFromSupabase(supabase, uploadedPaths);
      return;
    }

    console.log('\nPublicando no Instagram...');
    const postId = await publishMedia(INSTAGRAM_BUSINESS_ACCOUNT_ID, containerId, INSTAGRAM_ACCESS_TOKEN);
    const permalink = await getPermalink(postId, INSTAGRAM_ACCESS_TOKEN);

    const result = {
      status: 'published',
      type: isSingle ? 'single' : 'carousel',
      post_id: postId,
      post_url: permalink,
      child_ids: childIds,
      image_count: images.length,
      caption_length: caption.length,
      timestamp: new Date().toISOString(),
    };

    console.log('\nPublicado com sucesso!');
    console.log(JSON.stringify(result, null, 2));

    console.log('\nLimpando imagens temporarias do Supabase...');
    await deleteFromSupabase(supabase, uploadedPaths);
  } catch (err) {
    console.error(`\nErro durante publicacao: ${err.message}`);
    console.log('Limpando imagens temporarias do Supabase...');
    await deleteFromSupabase(supabase, uploadedPaths);
    throw err;
  }
}

main().catch(err => {
  console.error(`\nErro: ${err.message}`);
  process.exit(1);
});
