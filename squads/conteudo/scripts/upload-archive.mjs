#!/usr/bin/env node
// upload-archive.mjs — sobe pasta local pro bucket Supabase 'castelo-forte-archive'
//
// Uso:
//   node squads/conteudo/scripts/upload-archive.mjs <pasta-local> [--prefix <prefixo-remoto>]
//
// Exemplos:
//   node squads/conteudo/scripts/upload-archive.mjs /Users/castelofortemandaqui/claude/outputs/campanhas --prefix campanhas
//   node squads/conteudo/scripts/upload-archive.mjs ./outputs/multiplicar --prefix multiplicar

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, resolve, basename } from 'path';
import { loadEnv, uploadFile, humanSize, ARCHIVE_ROOT } from './archive-common.mjs';

const args = process.argv.slice(2);
const localPath = args[0];
if (!localPath) {
  console.error('Uso: node upload-archive.mjs <pasta-local> [--prefix <prefixo>]');
  process.exit(1);
}

const prefixIdx = args.indexOf('--prefix');
const remotePrefix = prefixIdx >= 0 ? args[prefixIdx + 1] : basename(resolve(localPath));
const dryRun = args.includes('--dry-run');

const env = loadEnv();
const absLocal = resolve(localPath);

console.log(`Origem local : ${absLocal}`);
console.log(`Prefixo remoto: ${remotePrefix}/`);
if (dryRun) console.log('MODO: dry-run (só lista, não sobe)');
console.log('');

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === '.DS_Store' || name === 'node_modules' || name === '.git') continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push({ path: full, size: st.size });
  }
  return out;
}

const files = walk(absLocal);
const totalBytes = files.reduce((s, f) => s + f.size, 0);

console.log(`Total: ${files.length} arquivos, ${humanSize(totalBytes)}`);
console.log('');

if (dryRun) {
  for (const f of files.slice(0, 20)) {
    const rel = relative(absLocal, f.path);
    console.log(`  ${remotePrefix}/${rel}  (${humanSize(f.size)})`);
  }
  if (files.length > 20) console.log(`  ... e mais ${files.length - 20} arquivos`);
  process.exit(0);
}

let uploaded = 0;
let failed = 0;
let bytesDone = 0;
const start = Date.now();

for (const f of files) {
  const rel = relative(absLocal, f.path).split('/').join('/');
  const remotePath = `${ARCHIVE_ROOT}/${remotePrefix}/${rel}`;
  const bytes = readFileSync(f.path);
  try {
    await uploadFile(env, f.path, remotePath, bytes);
    uploaded++;
    bytesDone += f.size;
    const pct = ((bytesDone / totalBytes) * 100).toFixed(1);
    const elapsedS = ((Date.now() - start) / 1000).toFixed(0);
    process.stdout.write(`\r[${pct}%] ${uploaded}/${files.length} (${humanSize(bytesDone)}/${humanSize(totalBytes)}) - ${elapsedS}s   `);
  } catch (e) {
    failed++;
    process.stdout.write('\n');
    console.error(`FALHA: ${remotePath} - ${e.message}`);
  }
}

process.stdout.write('\n\n');
console.log(`Concluído: ${uploaded} ok, ${failed} falhas, ${humanSize(bytesDone)} em ${Math.round((Date.now() - start) / 1000)}s.`);
if (failed > 0) process.exit(1);
