#!/usr/bin/env node
/**
 * anti-ia-validate.mjs
 *
 * Validador automático Castelo Forte Anti-IA — implementa a Parte 2 (denylist regex)
 * e detectores estruturais leves do STYLEBOOK.md.
 *
 * Uso:
 *   echo "texto" | node anti-ia-validate.mjs
 *   node anti-ia-validate.mjs caminho/do/arquivo.md
 *   node anti-ia-validate.mjs --json caminho/do/arquivo.md
 *
 * Exit codes:
 *   0 = aprovado (zero violações)
 *   1 = reprovado (violações encontradas)
 *   2 = erro técnico (arquivo não lido, etc)
 */

import { readFileSync, appendFileSync, existsSync } from 'node:fs';
import { argv, stdin, stdout, exit } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIT_LOG = path.resolve(__dirname, '../audit-log.yaml');

const RULES = [
  // 2.1 Verbos de marketing oco
  { re: /\bpotencializ\w+/gi, cat: 'verbo-oco', rationale: 'Verbo oco de palestra. Diga o que aumenta especificamente.' },
  { re: /\balavanc(a|ar|am|ou|ava)\w*/gi, cat: 'verbo-oco', rationale: 'Marketing dos anos 2010. Use "multiplica" + número.' },
  { re: /\bele(va|var|vamos|vou|vam) (a|o|seu|sua|nossa|nosso)\b/gi, cat: 'verbo-oco', rationale: 'Verbo IA. Use "aumenta", "melhora" + dado.' },
  { re: /\brevolucion\w+/gi, cat: 'verbo-oco', rationale: 'Hipérbole vazia. Descreva a mudança real.' },
  { re: /\bempodera(r|m|do|da)?\b/gi, cat: 'verbo-oco', rationale: 'Verbo de manifesto. Use "te dá", "deixa você" + verbo concreto.' },
  { re: /\bdesbloque(ar|ia|io|amos|ou)\w*/gi, cat: 'verbo-oco', rationale: 'Verbo de coach IA. Diga o que se ganha.' },
  { re: /\bdestrava(r|m|mos|ndo|do)?\b/gi, cat: 'verbo-oco', rationale: 'Mesmo problema. Diga o resultado.' },
  { re: /\bmaximiz\w+/gi, cat: 'verbo-oco', rationale: 'Verbo genérico. Use número.' },
  { re: /\botimiz\w+/gi, cat: 'verbo-oco', rationale: 'Verbo genérico. Diga o que melhora.' },

  // 2.2 Adjetivos de marketing oco
  { re: /\brobust(o|a|os|as)\b/gi, cat: 'adj-oco', rationale: 'Vazio. Cite o que ele suporta.' },
  { re: /\bescal[áa]vel\b/gi, cat: 'adj-oco', rationale: 'Termo genérico de SaaS.' },
  { re: /\binovador(a|es|as)?\b/gi, cat: 'adj-oco', rationale: 'Vazio. Diga o que é diferente.' },
  { re: /\bdisruptiv(o|a|os|as)\b/gi, cat: 'adj-oco', rationale: 'Vazio. Idem.' },
  { re: /\bdata.?driven\b/gi, cat: 'adj-oco', rationale: 'Cite o dado.' },
  { re: /\borientad(o|a|os|as)\s+a\s+dados\b/gi, cat: 'adj-oco', rationale: 'Cite o dado.' },
  { re: /\bde\s+ponta\b/gi, cat: 'adj-oco', rationale: 'Marketing 2005.' },
  { re: /\bde\s+classe\s+mundial\b/gi, cat: 'adj-oco', rationale: 'Marketing 2005.' },
  { re: /\bexcepcional\b/gi, cat: 'adj-oco', rationale: 'Pede evidência que falta.' },
  { re: /\bextraordin[áa]ri(o|a|os|as)\b/gi, cat: 'adj-oco', rationale: 'Pede evidência que falta.' },
  { re: /\bincr[íi]vel\b/gi, cat: 'adj-oco', rationale: 'Adjetivo de IA. Diga o que faz ser.' },
  { re: /\bpoderos(o|a|os|as)\b/gi, cat: 'adj-oco', rationale: 'Hollow positive. Use número.' },

  // 2.3 Conectivos metronômicos
  { re: /\bademais\b/gi, cat: 'conectivo', rationale: 'Conectivo formal. Use "E", "Também".' },
  { re: /\boutrossim\b/gi, cat: 'conectivo', rationale: 'Idem.' },
  { re: /\bem\s+suma\b/gi, cat: 'conectivo', rationale: 'Closer preguiçoso. Cortar.' },
  { re: /\bem\s+s[íi]ntese\b/gi, cat: 'conectivo', rationale: 'Idem.' },
  { re: /\bem\s+resumo\b/gi, cat: 'conectivo', rationale: 'Idem.' },
  { re: /\bconcluindo\b/gi, cat: 'conectivo', rationale: 'Idem.' },
  { re: /\bpara\s+finalizar\b/gi, cat: 'conectivo', rationale: 'Idem.' },

  // 2.4 Throat-clearing
  { re: /\bvamos?\s+falar\s+sobre\b/gi, cat: 'throat-clearing', rationale: 'Não fala, faz.' },
  { re: /\bdeixa\s+eu\s+(te\s+)?(contar|explicar|mostrar)\b/gi, cat: 'throat-clearing', rationale: 'Permissão desnecessária.' },
  { re: /\bquero\s+compartilhar\b/gi, cat: 'throat-clearing', rationale: 'Idem.' },
  { re: /\bhoje\s+em\s+dia\b/gi, cat: 'throat-clearing', rationale: 'Genérico.' },
  { re: /\bno\s+mundo\s+de\s+hoje\b/gi, cat: 'throat-clearing', rationale: 'Genérico.' },
  { re: /\bnos\s+dias\s+atuais\b/gi, cat: 'throat-clearing', rationale: 'Genérico.' },
  { re: /\bcomo\s+todos\s+sabem\b/gi, cat: 'throat-clearing', rationale: 'Mentira retórica.' },
  { re: /\bse\s+voc[êe]\s+est[áa]\s+lendo\s+isso\b/gi, cat: 'throat-clearing', rationale: 'Manjado.' },

  // 2.5 Pontuação
  { re: /—/g, cat: 'travessao', rationale: 'Travessão banido (L11 + CLAUDE.md global). Use ponto, vírgula, dois pontos ou parênteses.' },
  { re: /&mdash;|&#8212;|&#x2014;/gi, cat: 'travessao', rationale: 'Travessão HTML banido.' },
  { re: / -- /g, cat: 'travessao', rationale: 'Dois hífens — pior que travessão. Pontuação real.' },

  // §23.1 — Stolen-engineer diction PT-BR (Impeccable adaptado)
  { re: /\balavanc(a|ar|am|ou|ava|agem)\b/gi, cat: 'stolen-engineer', rationale: 'Engenharia financeira vazando pro marketing. Diga o que multiplica e por quanto.' },
  { re: /\bleverage\b/gi, cat: 'stolen-engineer', rationale: 'Anglicismo de engenharia. "Multiplicar", "usar a favor".' },
  { re: /\bponto\s+de\s+inflex[ãa]o\b/gi, cat: 'stolen-engineer', rationale: 'Estatística vazando. Descreva a virada com exemplo.' },
  { re: /\bpivotal\b/gi, cat: 'stolen-engineer', rationale: 'Hollow positive. "Central", "decide tudo".' },
  { re: /\bownership\b/gi, cat: 'stolen-engineer', rationale: 'Internal jargon. "Quem responde por isso".' },
  { re: /\bdeliverable\b/gi, cat: 'stolen-engineer', rationale: 'Internal jargon. "O que tem que entregar".' },
  { re: /\bstakeholders?\b/gi, cat: 'stolen-engineer', rationale: 'Termo de gestão em copy. "Quem decide", "quem paga".' },
  { re: /\bthroughput\b/gi, cat: 'stolen-engineer', rationale: 'Eval-team. Número de leads/dia, conversões/semana.' },
  { re: /\bbottleneck\b/gi, cat: 'stolen-engineer', rationale: 'Engenharia. "Onde trava", "o gargalo é".' },

  // §23.2 — Internal jargon vazando PT-BR
  { re: /\bentregabilidade\b/gi, cat: 'internal-jargon', rationale: 'Termo de e-mail marketing. "Chega na caixa de entrada".' },
  { re: /\bescalabilidade\b/gi, cat: 'internal-jargon', rationale: 'Termo de SaaS em copy. "Funciona com 10, 100 ou 10 mil".' },
  { re: /\bader[êe]ncia\b/gi, cat: 'internal-jargon', rationale: 'RH/consultoria em copy. "Quem combina com isso".' },
  { re: /\bconsumir\s+(conteudo|conteúdo|um\s+podcast|um\s+video)/gi, cat: 'internal-jargon', rationale: 'Termo de mídia. "Ler", "assistir", "ouvir".' },
  { re: /\bexperi[êe]ncia\s+do\s+usu[áa]rio\b/gi, cat: 'internal-jargon', rationale: 'Termo de design em copy de venda. "Como o cliente sente isso".' },
  { re: /\bjourney\b/gi, cat: 'internal-jargon', rationale: 'UX vazando em PT-BR. Cortar.' },
  { re: /\bfunnel\b/gi, cat: 'internal-jargon', rationale: 'UX vazando. "O caminho da venda", "o que acontece antes da compra".' },

  // §23.3 — Verbos genéricos faltantes da fusão (transformar)
  { re: /\btransform(a|ar|ando)\s+(sua|seu|seus|suas|resultados|vidas?|negocios?|neg[óo]cios?)\b/gi, cat: 'verbo-oco', rationale: 'Verbo IA pra esconder falta de detalhe. Diga o que muda especificamente.' },
];

// Detectores estruturais
function detectNegationPivot(lines) {
  const findings = [];
  const re1 = /\bn[ãa]o\s+é\s+\w+[.,]\s*[ÉéEe]/gi;          // "Não é X. É Y"
  const re2 = /\bn[ãa]o\s+é\s+(só|apenas)\s+.+,\s*é\b/gi;   // "Não é só X, é Y"
  let count = 0;
  lines.forEach((line, i) => {
    if (re1.test(line) || re2.test(line)) {
      count++;
      findings.push({ line: i + 1, snippet: line.trim().slice(0, 120), cat: 'negation-pivot', rationale: 'Negation pivot. Lei L1: máximo 1 ocorrência por post. Reescreva como afirmação direta.' });
      re1.lastIndex = 0; re2.lastIndex = 0;
    }
  });
  if (count > 1) {
    findings.push({ line: 0, snippet: `[texto inteiro]`, cat: 'negation-pivot-excess', rationale: `Negation pivot apareceu ${count} vezes no mesmo texto. Limite: 1.` });
  }
  return findings;
}

function detectAnaphora(lines) {
  const findings = [];
  // Limpa: remove vazias, tira marcadores de lista do começo (1. , 2. , - , * )
  const cleaned = lines
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .map(l => l.replace(/^(\d+[.)]\s+|[-*•]\s+)/, ''));

  for (let i = 0; i <= cleaned.length - 3; i++) {
    // Captura os 2 primeiros tokens reais (ignora número/marker já removido)
    const tok = s => s.split(/\s+/).slice(0, 2).join(' ').toLowerCase().replace(/[.,!?;:"]/g, '');
    const a = tok(cleaned[i]);
    const b = tok(cleaned[i + 1]);
    const c = tok(cleaned[i + 2]);

    if (a && a.length >= 2 && a === b && b === c) {
      // Lista de evidência legítima: cada linha tem número DISTINTO (valores, datas, %)
      const numbers = [cleaned[i], cleaned[i + 1], cleaned[i + 2]]
        .map(l => (l.match(/\d[\d.,]*/g) || []).join('|'));
      const allHaveDistinctNumbers = numbers.every(n => n.length > 0) &&
        new Set(numbers).size === 3;

      if (!allHaveDistinctNumbers) {
        findings.push({
          line: i + 1,
          snippet: `${cleaned[i].slice(0, 60)} / ${cleaned[i + 1].slice(0, 60)} / ${cleaned[i + 2].slice(0, 60)}`,
          cat: 'anafora-repetitiva',
          rationale: `3 linhas seguidas começando com "${a}". Lei L10 + L3. Lista é para coisas distintas; anáfora longa cheira a IA.`
        });
      }
    }
  }
  return findings;
}

function detectUniformParagraphLength(text) {
  const paras = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
  if (paras.length < 4) return [];
  const lengths = paras.map(p => p.split(/\s+/).length);
  const min = Math.min(...lengths);
  const max = Math.max(...lengths);
  if (max < min * 2 && paras.length >= 4) {
    return [{
      line: 0,
      snippet: `${paras.length} parágrafos com tamanho uniforme (${min}-${max} palavras)`,
      cat: 'paragrafo-uniforme',
      rationale: 'Lei L7 + Padrão P4. Ritmo monótono. Injete 1 parágrafo bem curto (3-5 palavras) ou bem longo (20+).'
    }];
  }
  return [];
}

// §28 — Hook de carrossel: REMOVIDO em v3.5
// A regra mecânica "1 ponto final" gerava falso positivo em hooks humanos legítimos
// (ex: "Em 15 minutos fiz X. Carmem não acreditou" — 2 pontos mas pinta cena viva).
// A avaliação de "hook humano vs hook IA" é semântica, não mecânica.
// Vai pro crítico LLM (Fase 2) avaliar na dimensão "Cena viva" do §25.
function detectHookViolation(text, contentType) {
  return [];
}

// Auto-detecta tipo pelo nome do arquivo: CR-* = carousel, PT-* = print-tweet
function inferContentType(filePath) {
  if (!filePath) return 'unknown';
  const basename = filePath.split('/').pop() || '';
  if (/^CR-/i.test(basename)) return 'carousel';
  if (/^PT-/i.test(basename)) return 'print-tweet';
  return 'unknown';
}

function validate(text, contentType = 'unknown') {
  const lines = text.split('\n');
  const findings = [];

  // Regex denylist
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      const matches = [...line.matchAll(rule.re)];
      for (const m of matches) {
        findings.push({
          line: i + 1,
          col: (m.index ?? 0) + 1,
          match: m[0],
          snippet: line.trim().slice(0, 120),
          cat: rule.cat,
          rationale: rule.rationale,
        });
      }
    }
  });

  // Detectores estruturais
  findings.push(...detectNegationPivot(lines));
  findings.push(...detectAnaphora(lines));
  findings.push(...detectUniformParagraphLength(text));
  findings.push(...detectHookViolation(text, contentType));

  return findings;
}

function formatHuman(findings) {
  if (findings.length === 0) {
    stdout.write('\x1b[32m✓ APROVADO — zero violações anti-IA detectadas.\x1b[0m\n');
    return 0;
  }
  stdout.write(`\x1b[31m✗ REPROVADO — ${findings.length} violação(ões) anti-IA detectada(s):\x1b[0m\n\n`);
  const byCategory = {};
  for (const f of findings) {
    byCategory[f.cat] = byCategory[f.cat] || [];
    byCategory[f.cat].push(f);
  }
  for (const [cat, items] of Object.entries(byCategory)) {
    stdout.write(`\x1b[33m[${cat}] ${items.length} ocorrência(s)\x1b[0m\n`);
    for (const f of items) {
      const loc = f.col ? `linha ${f.line}, col ${f.col}` : (f.line ? `linha ${f.line}` : 'estrutura');
      const matched = f.match ? `"${f.match}" ` : '';
      stdout.write(`  ${loc}: ${matched}→ ${f.snippet}\n`);
      stdout.write(`    \x1b[2m${f.rationale}\x1b[0m\n`);
    }
    stdout.write('\n');
  }
  stdout.write(`Consulte checklists/filtro-anti-ia.md (§3, §15-§19) para reescrita.\n`);
  return 1;
}

function formatJson(findings) {
  const out = {
    status: findings.length === 0 ? 'APPROVED' : 'REJECTED',
    count: findings.length,
    findings,
  };
  stdout.write(JSON.stringify(out, null, 2) + '\n');
  return findings.length === 0 ? 0 : 1;
}

function appendAuditTrail({ contentPath, contentText, findings, contentId }) {
  try {
    const status = findings.length === 0 ? 'APPROVED' : 'REJECTED';
    const violations_by_cat = {};
    for (const f of findings) {
      violations_by_cat[f.cat] = (violations_by_cat[f.cat] || 0) + 1;
    }
    const words = contentText.trim().split(/\s+/).filter(Boolean).length;
    const entry = `
- timestamp: "${new Date().toISOString()}"
  content_id: "${contentId || (contentPath ? path.basename(contentPath, path.extname(contentPath)) : 'inline')}"
  content_path: "${contentPath || 'stdin'}"
  content_chars: ${contentText.length}
  content_words: ${words}
  layer_0_regex:
    validator: "anti-ia-structural.mjs"
    status: ${status}
    violation_count: ${findings.length}
    violations_by_category:
${Object.entries(violations_by_cat).map(([k, v]) => `      ${k}: ${v}`).join('\n') || '      {}'}
`;
    appendFileSync(AUDIT_LOG, entry, 'utf-8');
  } catch (e) {
    // Audit é não-bloqueante — falha de log não pode quebrar a validação
    process.stderr.write(`[audit] Warning: failed to append audit entry: ${e.message}\n`);
  }
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf-8');
}

async function main() {
  const args = argv.slice(2);
  const jsonMode = args.includes('--json');
  const noAudit = args.includes('--no-audit');
  const typeArg = args.find(a => a.startsWith('--type='));
  const explicitType = typeArg ? typeArg.split('=')[1] : null;
  const filteredArgs = args.filter(a => a !== '--json' && a !== '--no-audit' && !a.startsWith('--type='));
  let text = '';
  let contentPath = null;

  try {
    if (filteredArgs.length > 0) {
      contentPath = filteredArgs[0];
      text = readFileSync(contentPath, 'utf-8');
    } else if (!stdin.isTTY) {
      text = await readStdin();
    } else {
      stdout.write('Uso: node anti-ia-structural.mjs [--json] [--no-audit] [--type=carousel|print-tweet] arquivo.md\n');
      stdout.write('     echo "texto" | node anti-ia-structural.mjs [--json] [--type=carousel]\n');
      exit(2);
    }
  } catch (e) {
    stdout.write(`Erro lendo input: ${e.message}\n`);
    exit(2);
  }

  const contentType = explicitType || inferContentType(contentPath);
  const findings = validate(text, contentType);

  // Audit trail (não-bloqueante)
  if (!noAudit) {
    appendAuditTrail({ contentPath, contentText: text, findings });
  }

  const code = jsonMode ? formatJson(findings) : formatHuman(findings);
  exit(code);
}

main();
