#!/usr/bin/env node
/**
 * pre-approval-check.mjs
 *
 * Hook pre-commit para o CRM de aprovações Castelo Forte.
 * Plugar antes do conteúdo entrar na fila de aprovação do operador.
 *
 * Uso (CLI):
 *   node pre-approval-check.mjs --content-id PT-035 --content-file posts/PT-035.md
 *
 * Uso (lib):
 *   import { checkBeforeApproval } from './pre-approval-check.mjs';
 *   const result = await checkBeforeApproval({ text, contentId });
 *
 * Output JSON:
 *   {
 *     contentId: "PT-035",
 *     status: "APPROVED" | "BLOCKED",
 *     antiIaScore: 87,
 *     violations: [...],
 *     blockedReasons: [...],
 *     authorFeedback: "..."
 *   }
 *
 * Exit codes:
 *   0 = aprovado, pode entrar na fila
 *   1 = bloqueado, retornar ao autor com feedback
 *   2 = erro técnico
 */

import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { argv, exit, stdout } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VALIDATOR = path.resolve(__dirname, 'anti-ia-structural.mjs');

// Thresholds — operador pode ajustar
const MAX_VIOLATIONS_TO_BLOCK = 0;  // Zero tolerância em regex
const RECOMMENDED_LLM_SCORE = 85;   // Crítico LLM (não roda neste hook — só regex)

function runValidator(filePath) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [VALIDATOR, '--json', filePath]);
    let stdoutData = '';
    let stderrData = '';
    proc.stdout.on('data', d => { stdoutData += d.toString(); });
    proc.stderr.on('data', d => { stderrData += d.toString(); });
    proc.on('close', code => {
      try {
        const result = JSON.parse(stdoutData);
        resolve({ ...result, exitCode: code });
      } catch (e) {
        reject(new Error(`Validador falhou: ${stderrData || e.message}`));
      }
    });
  });
}

function buildAuthorFeedback(violations) {
  if (violations.length === 0) return '';
  const byCategory = {};
  for (const v of violations) {
    byCategory[v.cat] = byCategory[v.cat] || [];
    byCategory[v.cat].push(v);
  }
  const lines = [
    `Olá — seu conteúdo foi bloqueado pelo filtro Anti-IA Castelo Forte antes de entrar na fila de aprovação.`,
    ``,
    `Violações encontradas (${violations.length} no total):`,
    ``,
  ];
  for (const [cat, items] of Object.entries(byCategory)) {
    lines.push(`▸ ${cat} (${items.length}x)`);
    for (const v of items.slice(0, 3)) {  // máximo 3 exemplos por categoria
      const loc = v.col ? `linha ${v.line}` : (v.line ? `linha ${v.line}` : 'estrutura');
      const matched = v.match ? `"${v.match}" — ` : '';
      lines.push(`  ${loc}: ${matched}${v.rationale}`);
    }
    if (items.length > 3) lines.push(`  ...e mais ${items.length - 3} ocorrência(s)`);
    lines.push('');
  }
  lines.push(`Consulte o STYLEBOOK.md para reescrita:`);
  lines.push(`/Users/castelofortemandaqui/claude/legacy/outputs/antiia/STYLEBOOK.md`);
  lines.push(``);
  lines.push(`Após corrigir, ressubmeta. Conteúdo só entra na fila quando aprovado.`);
  return lines.join('\n');
}

export async function checkBeforeApproval({ text, contentId, contentFile }) {
  let targetFile = contentFile;

  if (text && !contentFile) {
    const tmpFile = `/tmp/anti-ia-check-${contentId || Date.now()}.md`;
    const { writeFileSync } = await import('node:fs');
    writeFileSync(tmpFile, text);
    targetFile = tmpFile;
  }

  if (!targetFile) {
    throw new Error('Forneça contentFile OU text');
  }

  const result = await runValidator(targetFile);
  const violations = result.findings || [];

  const status = violations.length > MAX_VIOLATIONS_TO_BLOCK ? 'BLOCKED' : 'APPROVED';
  const blockedReasons = status === 'BLOCKED'
    ? [...new Set(violations.map(v => v.cat))]
    : [];

  return {
    contentId: contentId || path.basename(targetFile, path.extname(targetFile)),
    status,
    violationCount: violations.length,
    violations,
    blockedReasons,
    authorFeedback: status === 'BLOCKED' ? buildAuthorFeedback(violations) : '',
    nextStep: status === 'BLOCKED'
      ? 'Retornar ao autor com feedback. Não enviar para fila de aprovação.'
      : 'Liberar para fila de aprovação do operador.',
  };
}

function parseArgs() {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--content-id') args.contentId = argv[++i];
    else if (a === '--content-file') args.contentFile = argv[++i];
    else if (a === '--json') args.json = true;
    else if (!a.startsWith('--')) args.contentFile = a;
  }
  return args;
}

async function main() {
  const args = parseArgs();
  if (!args.contentFile) {
    stdout.write('Uso: node pre-approval-check.mjs --content-id ID --content-file arquivo.md\n');
    exit(2);
  }
  try {
    const result = await checkBeforeApproval(args);
    if (args.json) {
      stdout.write(JSON.stringify(result, null, 2) + '\n');
    } else {
      stdout.write(`[${result.contentId}] ${result.status}`);
      if (result.violationCount) stdout.write(` (${result.violationCount} violações)`);
      stdout.write('\n');
      if (result.authorFeedback) stdout.write('\n' + result.authorFeedback + '\n');
      stdout.write('\nPróximo passo: ' + result.nextStep + '\n');
    }
    exit(result.status === 'APPROVED' ? 0 : 1);
  } catch (e) {
    stdout.write(`Erro: ${e.message}\n`);
    exit(2);
  }
}

if (import.meta.url === `file://${argv[1]}`) {
  main();
}
