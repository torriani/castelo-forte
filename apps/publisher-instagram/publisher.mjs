#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync, renameSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';

const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [0, 30_000, 90_000];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function notifyMac(title, message) {
  try {
    const safe = (s) => String(s).replace(/"/g, '\\"');
    const script = `display notification "${safe(message)}" with title "${safe(title)}" sound name "Basso"`;
    execFile('osascript', ['-e', script], () => {});
  } catch {}
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLICAR = join(__dirname, 'publicar');
const PUBLICADO = join(__dirname, 'publicado');
const LOGS = join(__dirname, 'logs');
const QUEUE_PATH = join(__dirname, 'queue.json');

const env = parseEnv(readFileSync(join(__dirname, '.env'), 'utf-8'));
const TOKEN = env.INSTAGRAM_ACCESS_TOKEN;
const IG_ID = env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const API_VERSION = env.GRAPH_API_VERSION || 'v21.0';
const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_KEY;
const SUPABASE_BUCKET = env.SUPABASE_BUCKET || 'carrossel-images';
const SUPABASE_FOLDER = env.SUPABASE_FOLDER || 'instagram-posts';

function parseEnv(txt) {
  const out = {};
  for (const line of txt.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

function nowIso() { return new Date().toISOString(); }

function log(msg) {
  if (!existsSync(LOGS)) mkdirSync(LOGS, { recursive: true });
  const line = `[${nowIso()}] ${msg}`;
  console.log(line);
  const file = join(LOGS, `publisher-${new Date().toISOString().slice(0, 10)}.log`);
  writeFileSync(file, line + '\n', { flag: 'a' });
}

async function withRetry(fn, label) {
  let lastErr;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (attempt > 1) {
      const wait = RETRY_DELAYS_MS[attempt - 1];
      log(`Retry ${attempt}/${MAX_ATTEMPTS} para "${label}" em ${wait/1000}s...`);
      await sleep(wait);
    }
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      log(`Tentativa ${attempt}/${MAX_ATTEMPTS} falhou em "${label}": ${e.message}`);
    }
  }
  throw lastErr;
}

function loadQueue() {
  if (!existsSync(QUEUE_PATH)) return rebuildQueue();
  return JSON.parse(readFileSync(QUEUE_PATH, 'utf-8'));
}

function rebuildQueue() {
  const folders = readdirSync(PUBLICAR).filter(f => statSync(join(PUBLICAR, f)).isDirectory()).sort();
  const queue = { posts: [] };
  for (const folder of folders) {
    const m = folder.match(/^(\d+)-(\d{4}-\d{2}-\d{2})-(\d{2})(\d{2})-(.+)$/);
    if (!m) continue;
    queue.posts.push({
      n: parseInt(m[1]),
      folder,
      scheduled_at: `${m[2]}T${m[3]}:${m[4]}:00-03:00`,
      slug: m[5],
      status: 'pending',
      attempts: 0,
    });
  }
  writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
  return queue;
}

function saveQueue(queue) { writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2)); }

function findDuePost(queue) {
  const now = Date.now();
  for (const p of queue.posts) {
    if (p.status !== 'pending') continue;
    const scheduled = new Date(p.scheduled_at).getTime();
    const fiveMinBefore = scheduled - 5 * 60 * 1000;
    const tenMinAfter = scheduled + 10 * 60 * 1000;
    if (now >= fiveMinBefore && now <= tenMinAfter) return p;
  }
  return null;
}

async function uploadToSupabase(pngPath, postFolder) {
  const fileBytes = readFileSync(pngPath);
  const remotePath = `${SUPABASE_FOLDER}/${postFolder}.png`;
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${SUPABASE_BUCKET}/${remotePath}`;
  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'apikey': SUPABASE_KEY,
      'Content-Type': 'image/png',
      'x-upsert': 'true',
    },
    body: fileBytes,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase upload falhou (${res.status}): ${text}`);
  }
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${remotePath}`;
  log(`Upload Supabase OK: ${publicUrl}`);
  return publicUrl;
}

async function graphPost(path, params) {
  const url = `https://graph.facebook.com/${API_VERSION}/${path}`;
  const body = new URLSearchParams({ ...params, access_token: TOKEN });
  const res = await fetch(url, { method: 'POST', body });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(`Graph error: ${JSON.stringify(json)}`);
  return json;
}

async function graphGet(path, params = {}) {
  const url = new URL(`https://graph.facebook.com/${API_VERSION}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set('access_token', TOKEN);
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(`Graph error: ${JSON.stringify(json)}`);
  return json;
}

// ─── GATE ANTI-IA ─────────────────────────────────────────────────────────
// Roda squads/conteudo/scripts/validate-anti-ia.sh no legenda.md + post.json.
// Bloqueia publicacao se script retornar exit code != 0.
// Bypass: --skip-anti-ia (apenas em emergencia, gera log de override).
// Resolve relativo a raiz do repo: este arquivo mora em
// apps/publisher-instagram/, subir 2 niveis -> raiz repo.
const REPO_ROOT = join(__dirname, '..', '..');
const VALIDATE_SCRIPT = join(REPO_ROOT, 'squads', 'conteudo', 'scripts', 'validate-anti-ia.sh');

function validateAntiIA(filePath, mode) {
  if (!existsSync(VALIDATE_SCRIPT)) {
    log(`AVISO: script anti-IA nao encontrado em ${VALIDATE_SCRIPT} — pulando gate (verifique squads/conteudo)`);
    return { passed: true, skipped: true };
  }
  try {
    const args = mode ? `"${filePath}" ${mode}` : `"${filePath}"`;
    const output = execSync(`bash "${VALIDATE_SCRIPT}" ${args}`, { encoding: 'utf-8' });
    return { passed: true, output };
  } catch (err) {
    return { passed: false, output: err.stdout?.toString() || err.message };
  }
}

async function publishOne(post, opts = {}) {
  const folder = join(PUBLICAR, post.folder);
  const pngPath = join(folder, 'post.png');
  const legendaPath = join(folder, 'legenda.md');
  const postJsonPath = join(folder, 'post.json');
  if (!existsSync(pngPath)) throw new Error(`PNG not found: ${pngPath}`);
  if (!existsSync(legendaPath)) throw new Error(`legenda not found: ${legendaPath}`);

  let caption = readFileSync(legendaPath, 'utf-8');
  caption = caption.replace(/^#.*$/m, '').trim();
  if (caption.length > 2200) caption = caption.slice(0, 2200);

  // ═══ GATE ANTI-IA (bloqueante, exceto com --skip-anti-ia) ═══════════════
  if (!opts.skipAntiIA) {
    log('Rodando filtro anti-IA na legenda...');
    const legendaCheck = validateAntiIA(legendaPath);
    if (!legendaCheck.passed) {
      const msg = `BLOQUEADO pelo filtro anti-IA — legenda.md de #${post.n} ${post.slug} violou regras.\n${legendaCheck.output}`;
      log(msg);
      notifyMac('Publisher bloqueado', `Post #${post.n} reprovado no filtro anti-IA`);
      throw new Error(msg);
    }
    if (existsSync(postJsonPath)) {
      log('Rodando filtro anti-IA no post.json...');
      const postCheck = validateAntiIA(postJsonPath, '--json');
      if (!postCheck.passed) {
        const msg = `BLOQUEADO pelo filtro anti-IA — post.json de #${post.n} ${post.slug} violou regras.\n${postCheck.output}`;
        log(msg);
        notifyMac('Publisher bloqueado', `Post #${post.n} reprovado no filtro anti-IA`);
        throw new Error(msg);
      }
    }
    log('Filtro anti-IA: APROVADO');
  } else {
    log(`AVISO: --skip-anti-ia ativo, gate bypassed para #${post.n}`);
  }

  log(`Publicando post #${post.n}: ${post.slug}`);

  if (opts.dryRun) {
    log(`DRY RUN — image=${pngPath}, caption_chars=${caption.length}`);
    return { dryRun: true, captionPreview: caption.slice(0, 200) };
  }

  log('Upload da imagem pro Supabase Storage...');
  const imageUrl = await withRetry(() => uploadToSupabase(pngPath, post.folder), 'upload Supabase');

  log('Criando container Instagram...');
  const container = await withRetry(
    () => graphPost(`${IG_ID}/media`, { image_url: imageUrl, caption }),
    'criar container IG',
  );
  log(`Container criado: ${container.id}`);

  log('Aguardando container ficar FINISHED...');
  for (let i = 0; i < 30; i++) {
    await sleep(2000);
    const status = await withRetry(
      () => graphGet(container.id, { fields: 'status_code,status' }),
      'status container',
    );
    if (status.status_code === 'FINISHED') break;
    if (status.status_code === 'ERROR') throw new Error(`Container error: ${status.status}`);
    log(`  status: ${status.status_code}`);
  }

  log('Publicando container...');
  const published = await withRetry(
    () => graphPost(`${IG_ID}/media_publish`, { creation_id: container.id }),
    'publish container',
  );
  log(`Publicado! Media ID: ${published.id}`);

  return { mediaId: published.id, containerId: container.id, imageUrl, publishedAt: nowIso() };
}

function archive(post, result) {
  if (!existsSync(PUBLICADO)) mkdirSync(PUBLICADO, { recursive: true });
  const src = join(PUBLICAR, post.folder);
  const dst = join(PUBLICADO, post.folder);
  renameSync(src, dst);
  writeFileSync(join(dst, 'result.json'), JSON.stringify({ ...result, post }, null, 2));
  log(`Movido para publicado/: ${post.folder}`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  const skipAntiIA = args.includes('--skip-anti-ia');
  const onlyN = args.find(a => a.startsWith('--only='))?.split('=')[1];

  const queue = loadQueue();

  if (!onlyN) {
    let resetCount = 0;
    for (const p of queue.posts) {
      if (p.status === 'failed') {
        log(`Resetando post #${p.n} (${p.slug}) de failed -> pending para nova tentativa.`);
        p.status = 'pending';
        delete p.last_error;
        resetCount++;
      }
    }
    if (resetCount > 0) saveQueue(queue);
  }

  let target;
  if (onlyN) {
    target = queue.posts.find(p => String(p.n) === String(onlyN));
    if (!target) { log(`Post #${onlyN} nao encontrado.`); process.exit(1); }
    if (target.status === 'failed') {
      log(`Post #${onlyN} estava failed. Resetando para pending.`);
      target.status = 'pending';
      delete target.last_error;
      saveQueue(queue);
    }
    if (target.status !== 'pending' && !force) { log(`Post #${onlyN} ja foi publicado.`); process.exit(0); }
  } else {
    target = findDuePost(queue);
    if (!target) { log('Nenhum post na janela de publicacao agora.'); return; }
  }

  try {
    target.attempts++;
    const result = await publishOne(target, { dryRun, skipAntiIA });
    if (dryRun) { log(`[DRY RUN] Concluido para #${target.n}.`); return; }
    target.status = 'published';
    target.published_at = nowIso();
    target.media_id = result.mediaId;
    saveQueue(queue);
    archive(target, result);
  } catch (e) {
    log(`ERRO publicando #${target.n} apos ${MAX_ATTEMPTS} tentativas: ${e.message}`);
    target.status = 'failed';
    target.last_error = e.message;
    saveQueue(queue);
    notifyMac(
      `Publisher Instagram falhou (#${target.n})`,
      `${target.slug}: ${e.message.slice(0, 120)}`,
    );
    process.exit(1);
  }
}

main().catch(e => { log(`FATAL: ${e.message}`); process.exit(1); });
