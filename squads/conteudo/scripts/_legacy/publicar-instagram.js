#!/usr/bin/env node
// Publicar carrossel no Instagram via Graph API
// Usage: node publicar-instagram.js --images "slide1.jpg,slide2.jpg" --caption "texto" [--dry-run]

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SQUAD_ROOT = resolve(__dirname, '..');

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
    // Remove aspas envolventes
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
    } else if (argv[i] === '--dry-run') {
      args.dryRun = true;
    }
  }
  return args;
}

// ── Upload imgBB ─────────────────────────────────────────────

async function uploadToImgbb(imagePath, apiKey) {
  const absolutePath = resolve(imagePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Imagem nao encontrada: ${absolutePath}`);
  }
  const base64 = readFileSync(absolutePath).toString('base64');
  const body = new URLSearchParams({ image: base64 });
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body,
  });
  if (!res.ok) {
    throw new Error(`Falha no upload imgBB [${res.status}]: ${await res.text()}`);
  }
  const json = await res.json();
  return json.data.url;
}

// ── Instagram Graph API ──────────────────────────────────────

const IG_BASE = 'https://graph.facebook.com/v21.0';

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
    throw new Error('Parametro --images obrigatorio (ex: --images "slide1.jpg,slide2.jpg")');
  }
  if (!caption) {
    throw new Error('Parametro --caption obrigatorio');
  }
  if (images.length < 2 || images.length > 10) {
    throw new Error(`Instagram exige entre 2 e 10 imagens para carrossel (recebido: ${images.length})`);
  }
  if (caption.length > 2200) {
    throw new Error(`Legenda excede limite de 2200 caracteres do Instagram (recebido: ${caption.length})`);
  }

  const { IMGBB_API_KEY, INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID } = process.env;

  if (!IMGBB_API_KEY) {
    throw new Error('IMGBB_API_KEY nao configurada. Adicione ao arquivo .env ou exporte no terminal.');
  }
  if (!INSTAGRAM_ACCESS_TOKEN) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN nao configurado. Obtenha em https://developers.facebook.com/docs/instagram-api/');
  }
  if (!INSTAGRAM_BUSINESS_ACCOUNT_ID) {
    throw new Error('INSTAGRAM_BUSINESS_ACCOUNT_ID nao configurado. Adicione ao arquivo .env ou exporte no terminal.');
  }

  console.log(`Enviando ${images.length} imagem(ns) para imgBB...`);
  const imageUrls = [];
  for (let i = 0; i < images.length; i++) {
    const url = await uploadToImgbb(images[i], IMGBB_API_KEY);
    imageUrls.push(url);
    console.log(`  [${i + 1}/${images.length}] ${url}`);
  }

  console.log('\nCriando containers no Instagram...');
  const childIds = [];
  for (const url of imageUrls) {
    const id = await createChildContainer(INSTAGRAM_BUSINESS_ACCOUNT_ID, url, INSTAGRAM_ACCESS_TOKEN);
    childIds.push(id);
  }
  console.log(`  IDs: ${childIds.join(', ')}`);

  console.log('\nAguardando processamento dos containers...');
  for (const id of childIds) {
    await pollUntilFinished(id, INSTAGRAM_ACCESS_TOKEN);
  }
  console.log('  Todos os containers prontos.');

  console.log('\nCriando container do carrossel...');
  const carouselId = await createCarouselContainer(
    INSTAGRAM_BUSINESS_ACCOUNT_ID, childIds, caption, INSTAGRAM_ACCESS_TOKEN
  );
  await pollUntilFinished(carouselId, INSTAGRAM_ACCESS_TOKEN);
  console.log(`  ID do carrossel: ${carouselId}`);

  if (dryRun) {
    const result = {
      status: 'dry_run',
      carousel_container_id: carouselId,
      child_ids: childIds,
      image_urls: imageUrls,
      caption_length: caption.length,
      timestamp: new Date().toISOString(),
    };
    console.log('\nDRY RUN completo — publicacao final nao executada.');
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log('\nPublicando no Instagram...');
  const postId = await publishMedia(INSTAGRAM_BUSINESS_ACCOUNT_ID, carouselId, INSTAGRAM_ACCESS_TOKEN);
  const permalink = await getPermalink(postId, INSTAGRAM_ACCESS_TOKEN);

  const result = {
    status: 'published',
    post_id: postId,
    post_url: permalink,
    child_ids: childIds,
    image_count: images.length,
    caption_length: caption.length,
    timestamp: new Date().toISOString(),
  };

  console.log('\nPublicado com sucesso!');
  console.log(JSON.stringify(result, null, 2));
}

main().catch(err => {
  console.error(`\nErro: ${err.message}`);
  process.exit(1);
});
