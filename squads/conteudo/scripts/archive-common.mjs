// Helper compartilhado entre upload-archive, list-archive, pull-archive.
// Carrega .env, valida Supabase, expõe utilitários.

import { readFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Este arquivo mora em squads/conteudo/scripts/, raiz do repo são 3 níveis acima
export const REPO_ROOT = resolve(__dirname, '..', '..', '..');

export function parseEnv(txt) {
  const out = {};
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

export function loadEnv() {
  const envPath = join(REPO_ROOT, '.env');
  if (!existsSync(envPath)) {
    console.error('ERRO: .env não encontrado em', envPath);
    console.error('Copie .env.example para .env e preencha as credenciais Supabase.');
    process.exit(1);
  }
  const env = parseEnv(readFileSync(envPath, 'utf-8'));
  // Aceita SUPABASE_SERVICE_ROLE_KEY (nome novo) ou SUPABASE_SERVICE_KEY (legado)
  if (!env.SUPABASE_SERVICE_ROLE_KEY && env.SUPABASE_SERVICE_KEY) {
    env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_KEY;
  }
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
  const missing = required.filter(k => !env[k]);
  if (missing.length) {
    console.error('ERRO: variáveis ausentes no .env:', missing.join(', '));
    console.error('Necessário: SUPABASE_URL + (SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_SERVICE_KEY)');
    process.exit(1);
  }
  return env;
}

// Reusa o bucket Supabase existente do projeto.
// Arquivos do archive ficam sob a "pasta" virtual `castelo-forte-archive/` dentro do bucket
// pra ficar separado de `instagram-posts/` (que o publisher.mjs usa).
export const BUCKET = process.env.SUPABASE_ARCHIVE_BUCKET || 'carrossel-images';
export const ARCHIVE_ROOT = 'castelo-forte-archive';

export async function listBucket(env, prefix = '') {
  const url = `${env.SUPABASE_URL}/storage/v1/object/list/${BUCKET}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prefix,
      limit: 10000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase list falhou (${res.status}): ${text}`);
  }
  return res.json();
}

export async function uploadFile(env, localPath, remotePath, bytes) {
  const url = `${env.SUPABASE_URL}/storage/v1/object/${BUCKET}/${remotePath}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type': contentTypeFor(localPath),
      'x-upsert': 'true',
    },
    body: bytes,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload falhou (${res.status}) para ${remotePath}: ${text}`);
  }
}

export async function downloadFile(env, remotePath) {
  const url = `${env.SUPABASE_URL}/storage/v1/object/${BUCKET}/${remotePath}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Download falhou (${res.status}) para ${remotePath}: ${text}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

export function contentTypeFor(path) {
  const ext = path.toLowerCase().split('.').pop();
  const map = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    mp3: 'audio/mpeg',
    pdf: 'application/pdf',
    md: 'text/markdown',
    json: 'application/json',
    yaml: 'application/yaml',
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
  };
  return map[ext] || 'application/octet-stream';
}

export function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}
