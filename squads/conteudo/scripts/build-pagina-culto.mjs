#!/usr/bin/env node
/**
 * build-pagina-culto.mjs
 *
 * Gera HTML da pagina do culto usando o padrao EXATO de
 * /conteudo/maio/conteudo/carrosseis/ e /frases-autorais/:
 * - Carrosseis: bloco branco + grid de PNGs (slides)
 * - Frases: peca-grid com peca-card thumbs
 * - Modal/lightbox pra ampliar imagem ao clicar
 * - Botao "copiar carrossel" e "copiar frase"
 * - Zero hashtag
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const PASTA = args[0];
const FRASES_JSON = args[1];
const OUTPUT = args[2];

function getOpt(name, def = '') {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
}

const TITULO = getOpt('titulo', 'Culto');
const PASTOR = getOpt('pastor', 'Pastor');
const DATA = getOpt('data', '');
const DURACAO = getOpt('duracao', '');
const YOUTUBE = getOpt('youtube', '');
const THUMB = getOpt('thumb', '');
const IMG_BASE = getOpt('img-base', '/img/culto');

function esc(s) {
  if (s === undefined || s === null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Texto plano pra copia (sem hashtag — usuario pediu)
function slideToText(s, n) {
  const parts = [`[Slide ${n}]`];
  if (s.headline) parts.push(s.headline);
  if (s.headline_resto) parts.push(`${s.personagem || ''} ${s.headline_resto}`.trim());
  if (s.body) parts.push(s.body);
  if (s.sub) parts.push(s.sub);
  if (s.versiculo) parts.push(`"${s.versiculo}" — ${s.referencia || ''}`);
  if (s.intro) parts.push(s.intro);
  if (s.marca) parts.push(`${s.marca}\n${s.data || ''}\n${s.igreja || ''}`);
  return parts.join('\n');
}

function carrosselToText(c) {
  const header = `${c.titulo}\n\n`;
  const slides = c.slides.map((s, i) => slideToText(s, i + 1)).join('\n\n');
  // Sem hashtag — limpar legenda
  let legenda = c.legenda_instagram || '';
  legenda = legenda.replace(/#\S+/g, '').replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return header + slides + (legenda ? `\n\n---\n${legenda}` : '');
}

// Carrega dados
const arquivos = fs.readdirSync(PASTA).filter(f => f.endsWith('.json')).sort();
const carrosseis = arquivos.map(f => JSON.parse(fs.readFileSync(path.join(PASTA, f), 'utf-8')));
const frases = FRASES_JSON && fs.existsSync(FRASES_JSON) ? JSON.parse(fs.readFileSync(FRASES_JSON, 'utf-8')) : [];

console.log(`[build] ${carrosseis.length} carrosseis, ${frases.length} frases`);

// Render carrossel block (padrao da campanha Em Cristo, mas com 10 slides)
function renderCarrosselBlock(c) {
  // Lista de paths pra navegação no lightbox
  const slidePaths = c.slides.map((s, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `${IMG_BASE}/carrosseis/${c.id}/slide-${num}-${s.tipo}.png`;
  });
  const galleryId = c.id;
  const galleryJson = JSON.stringify(slidePaths).replace(/"/g, '&quot;');

  const slidesHtml = c.slides.map((s, i) => {
    const n = i + 1;
    const imgPath = slidePaths[i];
    return `<div class="slide" onclick="openGallery('${galleryId}', ${i})"><div class="badge">${n}/${c.slides.length}</div><img src="${imgPath}" alt="${esc(c.id)} slide ${n}" loading="lazy"></div>`;
  }).join('\n      ');

  const textoCopia = carrosselToText(c).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  let legenda = c.legenda_instagram || '';
  legenda = legenda.replace(/#\S+/g, '').replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  const legendaCopia = legenda.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

  return `
<div class="carrossel-block" id="${c.id.toLowerCase()}" data-gallery="${galleryId}" data-slides='${JSON.stringify(slidePaths)}' data-title="${esc(c.titulo)}">
  <div class="head">
    <div>
      <div class="num"><span class="id">${esc(c.id)}</span>${esc(c.titulo)}</div>
      <div class="tema">${esc(c.hook)}</div>
    </div>
    <div class="head-actions">
      <div class="info">${esc(c.tipo)} · ${esc(c.versiculo_base)}</div>
      <button class="btn-copy" onclick="copyText(this, \`${textoCopia}\`)">Copiar carrossel</button>
    </div>
  </div>
  <div class="carrossel-slides">
    ${slidesHtml}
  </div>
  ${legenda ? `
  <details class="legenda-block">
    <summary>Legenda do Instagram</summary>
    <div class="legenda-content">
      <pre>${esc(legenda)}</pre>
      <button class="btn-copy small" onclick="copyText(this, \`${legendaCopia}\`)">Copiar legenda</button>
    </div>
  </details>` : ''}
</div>
`;
}

// Render frase (padrao peca-card)
function renderFraseCard(f, i) {
  const num = String(i + 1).padStart(2, '0');
  const imgPath = `${IMG_BASE}/frases/frase-${num}.png`;
  const textoCopia = esc(f.texto).replace(/`/g, '\\`');
  let legenda = f.legenda_instagram || '';
  legenda = legenda.replace(/#\S+/g, '').replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  const legendaCopia = legenda.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  return `
<div class="peca-card" id="f-${num}">
  <div class="thumb" onclick="openLightbox('${imgPath}')"><img src="${imgPath}" alt="Frase ${num}" loading="lazy"></div>
  <div class="meta">
    <div class="day">F${num}</div>
    <div class="date">${esc(f.fonte)}</div>
  </div>
  <div class="card-actions">
    <button class="btn-copy small" onclick="copyText(this, \`${textoCopia}\`)">Copiar texto</button>
  </div>
  ${legenda ? `
  <details class="legenda-block">
    <summary>▸ Legenda do Instagram</summary>
    <div class="legenda-content">
      <pre>${esc(legenda)}</pre>
      <button class="btn-copy small" onclick="copyText(this, \`${legendaCopia}\`)">Copiar legenda</button>
    </div>
  </details>` : ''}
</div>
`;
}

const totalSlides = carrosseis.reduce((a, c) => a + c.slides.length, 0);

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(TITULO)} · ${esc(PASTOR)} · Castelo Forte</title>
<link rel="icon" href="/img/logo-castelo-forte.png" type="image/png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Archivo+Black&family=Playfair+Display:ital,wght@0,400;1,400;1,500&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/conteudo/maio/_shared.css">
<style>
  /* Hero do culto */
  .culto-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 32px;
    align-items: center;
  }
  @media (max-width: 800px) { .culto-hero { grid-template-columns: 1fr; } }
  .culto-hero .arte { aspect-ratio: 16/9; background: var(--ink); overflow: hidden; border-radius: 4px; }
  .culto-hero .arte img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .culto-hero .kicker { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 2.5px; color: var(--glory); text-transform: uppercase; margin-bottom: 16px; }
  .culto-hero h1 { font-family: 'Playfair Display', serif; font-weight: 500; font-size: 44px; letter-spacing: -.5px; line-height: 1.1; color: var(--midnight); margin-bottom: 16px; }
  .culto-hero h1 em { font-style: italic; font-weight: 500; color: var(--midnight); }
  .culto-hero .pastor { font-family: 'Playfair Display', serif; font-style: italic; font-size: 22px; color: var(--midnight); margin-bottom: 8px; }
  .culto-hero .data { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--muted); letter-spacing: 1.5px; }
  .culto-hero .yt-link { display: inline-block; margin-top: 20px; padding: 10px 18px; background: var(--ink); color: var(--parchment); font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 4px; transition: all .2s; }
  .culto-hero .yt-link:hover { background: var(--glory); color: var(--ink); }

  .stats-bar { display: flex; gap: 32px; padding: 20px 28px; background: #fff; border: 1px solid var(--line); border-radius: 4px; margin-bottom: 40px; flex-wrap: wrap; }
  .stat .n { font-family: 'Archivo Black', sans-serif; font-size: 32px; color: var(--midnight); line-height: 1; }
  .stat .l { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-top: 4px; }

  .section-title { font-family: 'Playfair Display', serif; font-weight: 500; font-size: 30px; letter-spacing: -.5px; color: var(--midnight); margin: 48px 0 4px; padding-bottom: 12px; border-bottom: 1px solid rgba(21,50,71,.15); }
  .section-title em { font-style: italic; font-weight: 500; }
  .section-sub { color: var(--muted); font-size: 14px; margin-bottom: 24px; }

  /* Carrossel block — head com actions */
  .carrossel-block .head { flex-wrap: wrap; gap: 12px; }
  .carrossel-block .head-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
  .carrossel-block .head .num { font-family: 'Playfair Display', serif; font-weight: 500; font-size: 22px; letter-spacing: -.3px; color: var(--midnight); line-height: 1.2; }
  .carrossel-block .head .num .id { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: var(--muted); text-transform: uppercase; display: block; margin-bottom: 4px; }
  .carrossel-block .head .tema { font-family: 'Playfair Display', serif; font-style: italic; font-size: 15px; color: var(--muted); margin-top: 8px; }

  /* Slides grid: 10 colunas no desktop */
  .carrossel-slides { grid-template-columns: repeat(10, 1fr) !important; }
  @media (max-width: 1200px) { .carrossel-slides { grid-template-columns: repeat(5, 1fr) !important; } }
  @media (max-width: 700px) { .carrossel-slides { grid-template-columns: repeat(3, 1fr) !important; } }
  .carrossel-slides .slide { cursor: pointer; transition: transform .2s; }
  .carrossel-slides .slide:hover { transform: scale(1.05); z-index: 2; box-shadow: 0 8px 20px rgba(0,0,0,.2); }

  /* Botoes copiar */
  .btn-copy {
    background: var(--ink); color: var(--parchment); border: none;
    padding: 8px 16px; font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; cursor: pointer; border-radius: 3px;
    transition: all .2s;
  }
  .btn-copy:hover { background: var(--glory); color: var(--ink); }
  .btn-copy.copied { background: #075057; color: #fff; }
  .btn-copy.small { padding: 6px 12px; font-size: 10px; }

  .legenda-block { margin-top: 18px; padding: 14px 18px; background: var(--off); border-radius: 4px; border: 1px solid var(--line); }
  .legenda-block summary { cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: var(--midnight); text-transform: uppercase; }
  .legenda-content { margin-top: 12px; }
  .legenda-block pre { font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.6; color: var(--midnight); white-space: pre-wrap; word-break: break-word; margin-bottom: 12px; }

  /* Peca card (frases) com botao copiar */
  .peca-card .thumb { cursor: pointer; transition: opacity .2s; }
  .peca-card .thumb:hover { opacity: .85; }
  .peca-card .card-actions { padding: 0 16px 16px; }
  .peca-card .meta .date { font-family: 'Playfair Display', serif; font-style: italic; font-size: 13px; color: var(--glory); letter-spacing: 0; max-width: 60%; text-align: right; line-height: 1.2; }

  /* Lightbox */
  .lightbox { display: none; position: fixed; inset: 0; background: rgba(10, 22, 40, .96); z-index: 1000; align-items: center; justify-content: center; padding: 40px; }
  .lightbox.active { display: flex; flex-direction: column; }
  .lightbox-img-wrap { display: flex; align-items: center; justify-content: center; flex: 1; width: 100%; max-height: calc(100vh - 120px); }
  .lightbox img { max-width: 90%; max-height: 100%; box-shadow: 0 20px 60px rgba(0,0,0,.6); border-radius: 4px; }
  .lightbox-close { position: absolute; top: 20px; right: 24px; color: #fff; font-size: 28px; cursor: pointer; background: none; border: none; line-height: 1; padding: 8px; }
  .lightbox-close:hover { color: var(--glory); }
  .lightbox-info { color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; padding: 16px; text-align: center; opacity: .85; }
  .lightbox-info .gtitle { font-family: 'Playfair Display', serif; font-style: italic; font-size: 16px; color: var(--glory); letter-spacing: 0; text-transform: none; margin-bottom: 4px; }
  .lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,.1); color: #fff; border: none; width: 56px; height: 56px; border-radius: 50%; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s; }
  .lightbox-nav:hover { background: var(--glory); color: var(--ink); }
  .lightbox-nav.prev { left: 24px; }
  .lightbox-nav.next { right: 24px; }
  .lightbox-nav:disabled { opacity: .25; cursor: not-allowed; }
  @media (max-width: 700px) {
    .lightbox-nav { width: 44px; height: 44px; font-size: 20px; }
    .lightbox-nav.prev { left: 8px; }
    .lightbox-nav.next { right: 8px; }
  }
</style>
</head>
<body class="has-sidebar">

<nav class="main-menu">
  <div class="menu-inner">
    <ul>
      <li><a href="/conteudo/">Hub</a></li>
      <li><a href="/conteudo/cultos/" class="active">Cultos</a></li>
      <li><a href="/conteudo/campanhas/">Campanhas</a></li>
    </ul>
  </div>
</nav>

<nav class="sub-menu">
  <div class="menu-inner">
    <div class="sidebar-brand">
      <div class="logo-mini"><img src="/img/logo-oficial.png" alt="Castelo Forte"></div>
      <div class="brand-text">
        Castelo Forte
        <small>Jurerê · SC</small>
      </div>
    </div>
    <span class="sub-label">Con<em>teúdo</em></span>
    <ul>
      <li><a href="/conteudo/">Hub</a></li>
      <li><a href="/conteudo/cultos/" class="active">Cultos</a></li>
      <li><a href="/conteudo/campanhas/">Campanhas</a></li>
    </ul>
    <span class="sub-label" style="margin-top:8px">${esc(TITULO).split(':')[0]}</span>
    <ul>
      <li><a href="#carrosseis" class="active">Carrosséis</a></li>
      <li><a href="#frases">Frases</a></li>
      <li><a href="${esc(YOUTUBE)}" target="_blank">YouTube ↗</a></li>
    </ul>
  </div>
</nav>

<main class="page">

<div class="culto-hero">
  <div class="arte">${THUMB ? `<img src="${esc(THUMB)}" alt="${esc(TITULO)}">` : ''}</div>
  <div class="info">
    <div class="kicker">Pregação · Castelo Forte Floripa</div>
    <h1>${esc(TITULO)}</h1>
    <div class="pastor">${esc(PASTOR)}</div>
    <div class="data">${esc(DATA)}${DURACAO ? ' · ' + esc(DURACAO) : ''}</div>
    ${YOUTUBE ? `<a href="${esc(YOUTUBE)}" target="_blank" class="yt-link">▶ Assistir no YouTube</a>` : ''}
  </div>
</div>

<div class="stats-bar">
  <div class="stat"><div class="n">${carrosseis.length + frases.length}</div><div class="l">Peças Totais</div></div>
  <div class="stat"><div class="n">${carrosseis.length}</div><div class="l">Carrosséis</div></div>
  <div class="stat"><div class="n">${totalSlides}</div><div class="l">Slides</div></div>
  <div class="stat"><div class="n">${frases.length}</div><div class="l">Frases</div></div>
</div>

<h2 class="section-title" id="carrosseis">Carros<em>séis</em></h2>
<div class="section-sub">${carrosseis.length} carrosséis · template Casa de Isabel · ${totalSlides} slides · clique num slide pra ampliar (use ← → pra navegar)</div>

${carrosseis.map(renderCarrosselBlock).join('\n')}

${frases.length > 0 ? `
<h2 class="section-title" id="frases">Fra<em>ses</em></h2>
<div class="section-sub">${frases.length} frases prontas · template Casa de Isabel · clique pra ampliar</div>

<div class="peca-grid">
${frases.map(renderFraseCard).join('\n')}
</div>
` : ''}

</main>

<footer>
  <strong>Castelo Forte</strong> · Igreja em Jurerê · Pastor Israel Anijar
</footer>

<div class="lightbox" id="lightbox">
  <button class="lightbox-close" onclick="closeLightbox()">✕</button>
  <button class="lightbox-nav prev" onclick="navGallery(-1)" id="nav-prev">‹</button>
  <button class="lightbox-nav next" onclick="navGallery(1)" id="nav-next">›</button>
  <div class="lightbox-img-wrap"><img id="lightbox-img" src="" alt=""></div>
  <div class="lightbox-info">
    <div class="gtitle" id="lightbox-title"></div>
    <div id="lightbox-counter"></div>
  </div>
</div>

<script>
let currentGallery = null;
let currentIndex = 0;
let currentTitle = '';

function openLightbox(src) {
  // Frase ou imagem solta — sem navegação
  currentGallery = [src];
  currentIndex = 0;
  currentTitle = '';
  renderLightbox();
}

function openGallery(galleryId, index) {
  const block = document.querySelector('.carrossel-block[data-gallery="' + galleryId + '"]');
  if (!block) return;
  currentGallery = JSON.parse(block.getAttribute('data-slides'));
  currentTitle = block.getAttribute('data-title') || '';
  currentIndex = index;
  renderLightbox();
}

function renderLightbox() {
  if (!currentGallery || currentGallery.length === 0) return;
  document.getElementById('lightbox-img').src = currentGallery[currentIndex];
  document.getElementById('lightbox-title').textContent = currentTitle;
  document.getElementById('lightbox-counter').textContent = currentGallery.length > 1
    ? (currentIndex + 1) + ' / ' + currentGallery.length
    : '';
  document.getElementById('nav-prev').disabled = currentIndex === 0;
  document.getElementById('nav-next').disabled = currentIndex === currentGallery.length - 1;
  document.getElementById('nav-prev').style.display = currentGallery.length > 1 ? 'flex' : 'none';
  document.getElementById('nav-next').style.display = currentGallery.length > 1 ? 'flex' : 'none';
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function navGallery(dir) {
  if (!currentGallery) return;
  const next = currentIndex + dir;
  if (next < 0 || next >= currentGallery.length) return;
  currentIndex = next;
  renderLightbox();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
  currentGallery = null;
}

document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-img-wrap')) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navGallery(-1);
  if (e.key === 'ArrowRight') navGallery(1);
});

function copyText(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = '✓ Copiado!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1800);
  });
}
</script>
</body>
</html>
`;

fs.writeFileSync(OUTPUT, html);
console.log(`[build] ✓ ${OUTPUT}`);
