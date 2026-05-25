#!/usr/bin/env node
// list-archive.mjs — lista conteúdo do bucket Supabase 'castelo-forte-archive'
//
// Uso:
//   node squads/conteudo/scripts/list-archive.mjs                       # raiz (pastas top-level)
//   node squads/conteudo/scripts/list-archive.mjs campanhas             # dentro de campanhas/
//   node squads/conteudo/scripts/list-archive.mjs campanhas/em-cristo   # mais fundo

import { loadEnv, listBucket, humanSize, BUCKET, ARCHIVE_ROOT } from './archive-common.mjs';

const subPrefix = process.argv[2] || '';
const fullPrefix = subPrefix ? `${ARCHIVE_ROOT}/${subPrefix}` : ARCHIVE_ROOT;
const env = loadEnv();

console.log(`Bucket: ${BUCKET}`);
console.log(`Pasta archive: ${ARCHIVE_ROOT}/${subPrefix}`);
console.log('');

const items = await listBucket(env, fullPrefix);

if (!items.length) {
  console.log('(vazio - nenhum item neste prefixo)');
  process.exit(0);
}

const folders = items.filter(i => i.id === null);
const files = items.filter(i => i.id !== null);

if (folders.length) {
  console.log(`PASTAS (${folders.length}):`);
  for (const f of folders) console.log(`  ${f.name}/`);
  console.log('');
}

if (files.length) {
  console.log(`ARQUIVOS (${files.length}):`);
  const totalBytes = files.reduce((s, f) => s + (f.metadata?.size || 0), 0);
  for (const f of files.slice(0, 50)) {
    const size = humanSize(f.metadata?.size || 0);
    console.log(`  ${f.name.padEnd(60)} ${size.padStart(10)}`);
  }
  if (files.length > 50) console.log(`  ... e mais ${files.length - 50} arquivos`);
  console.log('');
  console.log(`Total nesta pasta: ${humanSize(totalBytes)}`);
}
