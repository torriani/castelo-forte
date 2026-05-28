#!/usr/bin/env node
/**
 * render-culto-casa-isabel.mjs
 *
 * Renderiza todos os slides de carrossel + frases de um culto multiplicado
 * usando o template Casa de Isabel (bege papel, Inter + Playfair italic, logo canto).
 *
 * Uso:
 *   node scripts/render-culto-casa-isabel.mjs <pasta-carrosseis> <arquivo-frases.json> <pasta-out-img>
 */

import { chromium } from '/Users/castelofortefloripa/claude/legacy/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const PASTA_CARROSSEIS = args[0];
const FRASES_JSON = args[1];
const OUT_IMG_BASE = args[2];

if (!PASTA_CARROSSEIS || !FRASES_JSON || !OUT_IMG_BASE) {
  console.error('Uso: node render-culto-casa-isabel.mjs <pasta-carrosseis> <frases.json> <pasta-out>');
  process.exit(1);
}

const ROOT = '/Users/castelofortefloripa/claude/legacy';
const LOGO = `${ROOT}/squads/workspace/businesses/igreja-castelo-forte/brand/logo-castelo-forte-oficial.png`;
const OUT_CARR = `${OUT_IMG_BASE}/carrosseis`;
const OUT_FRASES = `${OUT_IMG_BASE}/frases`;
fs.mkdirSync(OUT_CARR, { recursive: true });
fs.mkdirSync(OUT_FRASES, { recursive: true });

const logoB64 = `data:image/png;base64,${fs.readFileSync(LOGO).toString('base64')}`;

const BG = '#efefef';
const TXT = '#153247';
const TXT_SUAVE = '#5a6068';

// ============================================================
// Helpers
// ============================================================

function esc(s) {
  if (s === undefined || s === null) return '';
  return String(s);
}

// Aplica italic Playfair na "accent_word" dentro do texto
function italicizeAccent(text, accent) {
  if (!accent || !text) return esc(text);
  const re = new RegExp(`(${accent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i');
  return esc(text).replace(re, '<em>$1</em>');
}

// ============================================================
// TEMPLATES Casa de Isabel
// ============================================================

const baseStyle = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1080px;height:1350px;background:${BG};color:${TXT};font-family:'Inter',sans-serif;padding:120px 80px;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;text-align:center;overflow:hidden}
  .logo{position:absolute;top:48px;right:48px;width:170px;height:auto;opacity:.85}
  .logo img{width:100%;height:auto;object-fit:contain;display:block}
  .bloco{max-width:880px;width:100%}
  .divider{width:1px;height:40px;background:${TXT};opacity:.3;margin:24px auto}
  em{font-family:'Playfair Display',serif;font-style:italic;font-weight:500}
`;

const fontsLink = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,500;1,600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">`;

function htmlWrap(extra, body) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${fontsLink}<style>${baseStyle}${extra}</style></head><body><div class="logo"><img src="${logoB64}"></div>${body}</body></html>`;
}

// CAPA: headline grande mesclando Inter + Playfair italic
function tplCapa(headline, accent_word) {
  const h = italicizeAccent(headline, accent_word);
  return htmlWrap(`
    .h{font-family:'Inter',sans-serif;font-weight:700;font-size:64px;line-height:1.14;letter-spacing:-1.4px;text-align:center}
    .h em{font-weight:500}
    .bloco{padding:0 20px}
  `, `<div class="bloco"><div class="h">${h}</div></div>`);
}

// INTERNA: titulo + divider + sub (usado pra texto-midnight, texto-off, triade)
function tplInterna(titulo, sub, accent_word) {
  const t = italicizeAccent(titulo, accent_word);
  return htmlWrap(`
    .titulo{font-family:'Inter',sans-serif;font-weight:700;font-size:52px;line-height:1.16;letter-spacing:-1px;margin-bottom:8px}
    .titulo em{font-weight:500}
    .sub{font-family:'Inter',sans-serif;font-size:24px;line-height:1.55;font-weight:400;color:${TXT_SUAVE};max-width:760px;margin:0 auto}
    .sub em{color:${TXT}}
  `, `<div class="bloco"><div class="titulo">${t}</div>${sub ? `<div class="divider"></div><div class="sub">${esc(sub)}</div>` : ''}</div>`);
}

// TRIADE: personagem em italic + headline_resto + sub
function tplTriade(personagem, headline_resto, sub) {
  return htmlWrap(`
    .titulo{font-family:'Inter',sans-serif;font-weight:700;font-size:52px;line-height:1.16;letter-spacing:-1px;margin-bottom:8px}
    .titulo em{font-weight:500}
    .sub{font-family:'Inter',sans-serif;font-size:24px;line-height:1.55;font-weight:400;color:${TXT_SUAVE};max-width:760px;margin:0 auto}
  `, `<div class="bloco"><div class="titulo"><em>${esc(personagem)}</em> ${esc(headline_resto)}</div>${sub ? `<div class="divider"></div><div class="sub">${esc(sub)}</div>` : ''}</div>`);
}

// VERSO: ref + versiculo italic
function tplVerso(versiculo, referencia) {
  return htmlWrap(`
    .ref{font-family:'JetBrains Mono',monospace;font-size:20px;letter-spacing:3px;text-transform:uppercase;color:${TXT};font-weight:600;opacity:.65;margin-bottom:42px}
    .v{font-family:'Playfair Display',serif;font-style:italic;font-weight:500;font-size:48px;line-height:1.24;color:${TXT};max-width:880px}
  `, `<div class="ref">${esc(referencia)}</div><div class="v">"${esc(versiculo)}"</div>`);
}

// CTA
function tplCta(intro, marca, data, igreja) {
  return htmlWrap(`
    .intro{font-family:'Inter',sans-serif;font-size:24px;line-height:1.5;font-weight:400;color:${TXT_SUAVE};max-width:680px;margin-bottom:24px}
    .marca{font-family:'Inter',sans-serif;font-weight:700;font-size:120px;line-height:.92;letter-spacing:-4px;color:${TXT};text-transform:uppercase;margin-bottom:24px}
    .data-cta{font-family:'Inter',sans-serif;font-weight:700;font-size:36px;line-height:1.1;letter-spacing:-.5px;color:${TXT}}
    .igreja{font-family:'Inter',sans-serif;font-size:18px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:${TXT_SUAVE};margin-top:14px}
  `, `<div class="intro">${esc(intro)}</div><div class="marca">${esc(marca)}</div><div class="divider"></div><div class="data-cta">${esc(data)}</div><div class="igreja">${esc(igreja)}</div>`);
}

// FRASE única
function tplFrase(texto, fonte) {
  return htmlWrap(`
    .frase{font-family:'Inter',sans-serif;font-weight:600;font-size:54px;line-height:1.22;letter-spacing:-1px}
    .frase em{font-weight:500}
    .ref{font-family:'JetBrains Mono',monospace;font-size:16px;letter-spacing:3px;text-transform:uppercase;color:${TXT};font-weight:600;opacity:.65}
  `, `<div class="bloco"><div class="frase">${esc(texto)}</div><div class="divider"></div><div class="ref">${esc(fonte)}</div></div>`);
}

// ============================================================
// Mapeia slide JSON pro template Casa Isabel
// ============================================================

function renderSlideHtml(s) {
  switch (s.tipo) {
    case 'capa':
      return tplCapa(s.headline || '', s.accent_word || '');
    case 'texto-midnight':
    case 'texto-off':
      return tplInterna(s.headline || '', s.body || '', s.accent_word || '');
    case 'triade':
      return tplTriade(s.personagem || '', s.headline_resto || '', s.sub || '');
    case 'verso':
      return tplVerso(s.versiculo || '', s.referencia || '');
    case 'cta':
      return tplCta(
        s.intro || 'Tudo que Deus tem pra te dar começa em uma única palavra.',
        s.marca || 'Em Cristo',
        s.data || 'Domingo · 07.06 · 09h',
        s.igreja || 'Igreja Castelo Forte'
      );
    default:
      return tplInterna(s.headline || s.tipo, s.body || '', s.accent_word || '');
  }
}

// ============================================================
// Render
// ============================================================

async function render(page, html, outPath) {
  await page.setContent(html, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1350 } });
}

// ============================================================
// Main
// ============================================================

const arquivos = fs.readdirSync(PASTA_CARROSSEIS).filter(f => f.endsWith('.json')).sort();
const carrosseis = arquivos.map(f => JSON.parse(fs.readFileSync(path.join(PASTA_CARROSSEIS, f), 'utf-8')));
const frases = JSON.parse(fs.readFileSync(FRASES_JSON, 'utf-8'));

console.log(`\n🎨 Casa de Isabel render`);
console.log(`   ${carrosseis.length} carrosseis × ${carrosseis[0].slides.length} slides = ${carrosseis.reduce((a,c) => a+c.slides.length, 0)} slides`);
console.log(`   ${frases.length} frases\n`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });

// === Carrosseis ===
let totalRendered = 0;
for (const c of carrosseis) {
  const dir = `${OUT_CARR}/${c.id}`;
  fs.mkdirSync(dir, { recursive: true });
  process.stdout.write(`  ${c.id} (${c.titulo.substring(0, 50)}): `);

  for (let i = 0; i < c.slides.length; i++) {
    const s = c.slides[i];
    const html = renderSlideHtml(s);
    const num = String(i + 1).padStart(2, '0');
    const outPath = `${dir}/slide-${num}-${s.tipo}.png`;
    await render(page, html, outPath);
    process.stdout.write('.');
    totalRendered++;
  }
  console.log(` ✓ ${c.slides.length} slides`);
}

// === Frases ===
console.log(`\n💎 Frases:\n`);
for (let i = 0; i < frases.length; i++) {
  const f = frases[i];
  const num = String(i + 1).padStart(2, '0');
  const outPath = `${OUT_FRASES}/frase-${num}.png`;
  await render(page, tplFrase(f.texto, f.fonte), outPath);
  console.log(`  ✓ F${num} (${f.fonte})`);
}

await browser.close();
console.log(`\n✅ ${totalRendered} slides de carrossel renderizados em ${OUT_CARR}`);
console.log(`✅ ${frases.length} frases renderizadas em ${OUT_FRASES}\n`);
