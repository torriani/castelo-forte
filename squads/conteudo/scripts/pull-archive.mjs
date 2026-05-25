#!/usr/bin/env node
// pull-archive.mjs — baixa pasta do bucket Supabase pra local
//
// Uso:
//   node squads/conteudo/scripts/pull-archive.mjs <prefixo-remoto> [--out <pasta-destino>]
//
// Exemplos:
//   node squads/conteudo/scripts/pull-archive.mjs campanhas/em-cristo-antecipacao
//   node squads/conteudo/scripts/pull-archive.mjs multiplicar --out outputs/multiplicar
//   node squads/conteudo/scripts/pull-archive.mjs inteligencia/concorrentes-igrejas

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { loadEnv, listBucket, downloadFile, humanSize, REPO_ROOT, ARCHIVE_ROOT } from './archive-common.mjs';

const args = process.argv.slice(2);
const prefix = args[0];
if (!prefix) {
  console.error('Uso: node pull-archive.mjs <prefixo-remoto> [--out <pasta-destino>]');
  console.error('Use list-archive.mjs primeiro pra ver o que existe.');
  process.exit(1);
}

const outIdx = args.indexOf('--out');
const outBase = outIdx >= 0
  ? resolve(args[outIdx + 1])
  : join(REPO_ROOT, 'outputs', 'igreja-castelo-forte', prefix);

const env = loadEnv();

const fullPrefix = `${ARCHIVE_ROOT}/${prefix}`;

console.log(`Prefixo remoto: ${fullPrefix}/`);
console.log(`Destino local : ${outBase}`);
console.log('');

async function walkRemote(currentPrefix) {
  const items = await listBucket(env, currentPrefix);
  const out = [];
  for (const it of items) {
    if (it.id === null) {
      const sub = currentPrefix ? `${currentPrefix}/${it.name}` : it.name;
      out.push(...await walkRemote(sub));
    } else {
      const fp = currentPrefix ? `${currentPrefix}/${it.name}` : it.name;
      out.push({ path: fp, size: it.metadata?.size || 0 });
    }
  }
  return out;
}

console.log('Listando arquivos remotos...');
const files = await walkRemote(fullPrefix);
const totalBytes = files.reduce((s, f) => s + f.size, 0);
console.log(`Encontrados ${files.length} arquivos, ${humanSize(totalBytes)}`);
console.log('');

if (!files.length) {
  console.log('Nada pra baixar. Confira o prefixo com list-archive.mjs.');
  process.exit(0);
}

let downloaded = 0;
let failed = 0;
let bytesDone = 0;
const start = Date.now();

for (const f of files) {
  const relInsidePrefix = f.path.slice(fullPrefix.length + 1);
  const localPath = join(outBase, relInsidePrefix);
  const dir = dirname(localPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  try {
    const bytes = await downloadFile(env, f.path);
    writeFileSync(localPath, bytes);
    downloaded++;
    bytesDone += f.size;
    const pct = totalBytes > 0 ? ((bytesDone / totalBytes) * 100).toFixed(1) : '100';
    const elapsedS = ((Date.now() - start) / 1000).toFixed(0);
    process.stdout.write(`\r[${pct}%] ${downloaded}/${files.length} (${humanSize(bytesDone)}/${humanSize(totalBytes)}) - ${elapsedS}s   `);
  } catch (e) {
    failed++;
    process.stdout.write('\n');
    console.error(`FALHA: ${f.path} - ${e.message}`);
  }
}

process.stdout.write('\n\n');
console.log(`Concluído: ${downloaded} ok, ${failed} falhas em ${Math.round((Date.now() - start) / 1000)}s.`);
console.log(`Arquivos salvos em: ${outBase}`);
if (failed > 0) process.exit(1);
