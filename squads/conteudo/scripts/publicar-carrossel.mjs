#!/usr/bin/env node
/**
 * publicar-carrossel.mjs — Upload + Publicação no Instagram
 *
 * Pipeline completo:
 * 1. Upload PNGs para Supabase Storage (URLs públicas)
 * 2. Cria containers de imagem na Graph API
 * 3. Publica como carrossel no Instagram
 *
 * Uso:
 *   node scripts/publicar-carrossel.mjs <pasta-com-pngs> --caption "legenda aqui"
 *   node scripts/publicar-carrossel.mjs <pasta-com-pngs> --caption-file <arquivo.txt>
 *   node scripts/publicar-carrossel.mjs <pasta-com-pngs> --dry-run (só faz upload, não publica)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Carregar .env
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const IG_ACCOUNT = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

// ═══════════════════════════════════════════════════════════════
// SUPABASE STORAGE — Upload
// ═══════════════════════════════════════════════════════════════

async function uploadToSupabase(filePath, remotePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/carrosseis/${remotePath}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': mimeType,
      'x-upsert': 'true',
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload falhou: ${res.status} ${err}`);
  }

  // URL pública
  return `${SUPABASE_URL}/storage/v1/object/public/carrosseis/${remotePath}`;
}

// ═══════════════════════════════════════════════════════════════
// INSTAGRAM GRAPH API — Publicação
// ═══════════════════════════════════════════════════════════════

async function createImageContainer(imageUrl) {
  const res = await fetch(`https://graph.facebook.com/v21.0/${IG_ACCOUNT}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      is_carousel_item: true,
      access_token: IG_TOKEN,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`IG error: ${JSON.stringify(data.error)}`);
  return data.id;
}

async function createCarouselContainer(childrenIds, caption) {
  const res = await fetch(`https://graph.facebook.com/v21.0/${IG_ACCOUNT}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'CAROUSEL',
      children: childrenIds.join(','),
      caption: caption,
      access_token: IG_TOKEN,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`IG carousel error: ${JSON.stringify(data.error)}`);
  return data.id;
}

async function publishMedia(containerId) {
  const res = await fetch(`https://graph.facebook.com/v21.0/${IG_ACCOUNT}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: containerId,
      access_token: IG_TOKEN,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`IG publish error: ${JSON.stringify(data.error)}`);
  return data.id;
}

async function checkContainerStatus(containerId) {
  const res = await fetch(
    `https://graph.facebook.com/v21.0/${containerId}?fields=status_code&access_token=${IG_TOKEN}`
  );
  const data = await res.json();
  return data.status_code;
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║  publicar-carrossel — Upload + Publicação no Instagram      ║
╚══════════════════════════════════════════════════════════════╝

Uso:
  node scripts/publicar-carrossel.mjs <pasta-pngs> [opções]

Opções:
  --caption "texto"      Legenda do post
  --caption-file <path>  Ler legenda de arquivo
  --dry-run              Só upload, não publica no IG
  --folder <nome>        Nome da pasta no Supabase (default: nome da pasta local)

Exemplo:
  node scripts/publicar-carrossel.mjs carrosseis/png/p1-carrossel-04/ --caption "Meu post"
  node scripts/publicar-carrossel.mjs carrosseis/png/p1-carrossel-04/ --caption-file legenda.txt
`);
    process.exit(0);
  }

  // Validar config
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('✗ SUPABASE_URL ou SUPABASE_SERVICE_KEY não configurados no .env');
    process.exit(1);
  }
  if (!IG_TOKEN || !IG_ACCOUNT) {
    console.error('✗ INSTAGRAM_ACCESS_TOKEN ou INSTAGRAM_BUSINESS_ACCOUNT_ID não configurados no .env');
    process.exit(1);
  }

  const inputDir = path.resolve(args[0]);
  const dryRun = args.includes('--dry-run');
  const folderName = args.includes('--folder')
    ? args[args.indexOf('--folder') + 1]
    : path.basename(inputDir);

  // Caption
  let caption = '';
  if (args.includes('--caption')) {
    caption = args[args.indexOf('--caption') + 1];
  } else if (args.includes('--caption-file')) {
    const captionFile = args[args.indexOf('--caption-file') + 1];
    caption = fs.readFileSync(captionFile, 'utf-8').trim();
  }

  // Pegar PNGs
  const pngFiles = fs.readdirSync(inputDir)
    .filter(f => f.endsWith('.png'))
    .sort();

  if (pngFiles.length === 0) {
    console.error(`✗ Nenhum PNG encontrado em: ${inputDir}`);
    process.exit(1);
  }

  console.log(`\n📤 Publicando carrossel com ${pngFiles.length} slides`);
  console.log(`📁 Pasta: ${inputDir}`);
  console.log(`☁️  Supabase: carrosseis/${folderName}/`);
  if (dryRun) console.log(`⚠️  DRY RUN — não vai publicar no Instagram\n`);
  else console.log(`📷 Instagram: @castelofortemandaqui\n`);

  // STEP 1: Upload para Supabase
  console.log('━━━ Step 1: Upload para Supabase Storage ━━━');
  const publicUrls = [];

  for (const file of pngFiles) {
    const localPath = path.join(inputDir, file);
    const remotePath = `${folderName}/${file}`;
    try {
      const url = await uploadToSupabase(localPath, remotePath);
      publicUrls.push(url);
      console.log(`  ✓ ${file} → ${url}`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
      process.exit(1);
    }
  }

  console.log(`\n✅ ${publicUrls.length} imagens no Supabase\n`);

  if (dryRun) {
    console.log('URLs públicas:');
    publicUrls.forEach((url, i) => console.log(`  S${i + 1}: ${url}`));
    console.log('\n⚠️  Dry run — não publicou no Instagram.');
    process.exit(0);
  }

  // STEP 2: Criar containers no Instagram
  console.log('━━━ Step 2: Criar containers no Instagram ━━━');
  const containerIds = [];

  for (let i = 0; i < publicUrls.length; i++) {
    try {
      const containerId = await createImageContainer(publicUrls[i]);
      containerIds.push(containerId);
      console.log(`  ✓ S${i + 1} → container ${containerId}`);
      // Rate limit
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`  ✗ S${i + 1}: ${err.message}`);
      process.exit(1);
    }
  }

  // STEP 3: Aguardar containers ficarem prontos
  console.log('\n━━━ Step 3: Aguardando processamento ━━━');
  for (const id of containerIds) {
    let status = 'IN_PROGRESS';
    let attempts = 0;
    while (status === 'IN_PROGRESS' && attempts < 30) {
      await new Promise(r => setTimeout(r, 2000));
      status = await checkContainerStatus(id);
      attempts++;
    }
    if (status !== 'FINISHED') {
      console.error(`  ✗ Container ${id} ficou em status: ${status}`);
      process.exit(1);
    }
  }
  console.log('  ✓ Todos os containers prontos');

  // STEP 4: Criar carrossel
  console.log('\n━━━ Step 4: Criar carrossel ━━━');
  const carouselId = await createCarouselContainer(containerIds, caption);
  console.log(`  ✓ Carrossel criado: ${carouselId}`);

  // Aguardar carrossel ficar pronto
  let carouselStatus = 'IN_PROGRESS';
  let attempts = 0;
  while (carouselStatus === 'IN_PROGRESS' && attempts < 30) {
    await new Promise(r => setTimeout(r, 2000));
    carouselStatus = await checkContainerStatus(carouselId);
    attempts++;
  }

  // STEP 5: Publicar
  console.log('\n━━━ Step 5: Publicar ━━━');
  const postId = await publishMedia(carouselId);
  console.log(`  ✓ PUBLICADO! Post ID: ${postId}`);
  console.log(`\n✅ Carrossel publicado com sucesso no Instagram!`);
  console.log(`   https://www.instagram.com/p/${postId}/`);
}

main().catch(err => {
  console.error(`\n✗ Erro: ${err.message}`);
  process.exit(1);
});
