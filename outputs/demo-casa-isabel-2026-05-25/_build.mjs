#!/usr/bin/env node
// Build dos HTMLs da demo Casa de Isabel
// Lê logo em base64 e gera os 8 slides com texto preenchido

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const LOGO_PATH = path.join(ROOT, 'workspace/businesses/igreja-castelo-forte/brand/logo-castelo-forte-oficial.png');
const LOGO_B64 = `data:image/png;base64,${fs.readFileSync(LOGO_PATH).toString('base64')}`;

const BG = '#efefef';
const TXT = '#153247';
const TXT_SUAVE = '#5a6068';

const FONTS_LINK = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,500;1,600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">`;

const baseStyle = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1080px;height:1350px;background:${BG};color:${TXT};font-family:'Inter',sans-serif;padding:120px 80px;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;text-align:center;overflow:hidden}
  .logo{position:absolute;top:48px;right:48px;width:170px;height:auto;opacity:.85}
  .logo img{width:100%;height:auto;object-fit:contain;display:block}
  .bloco{max-width:880px;width:100%}
  .divider{width:1px;height:40px;background:${TXT};opacity:.3;margin:24px auto}
  em{font-family:'Playfair Display',serif;font-style:italic;font-weight:500}
`;

function wrap(extra, body) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS_LINK}<style>${baseStyle}${extra}</style></head><body><div class="logo"><img src="${LOGO_B64}"></div>${body}</body></html>`;
}

const tplCapa = (h) => wrap(
  `.h{font-family:'Inter',sans-serif;font-weight:700;font-size:64px;line-height:1.14;letter-spacing:-1.4px}.h em{font-weight:500}`,
  `<div class="bloco" style="padding:0 20px"><div class="h">${h}</div></div>`
);

const tplInterna = (titulo, sub) => wrap(
  `.titulo{font-family:'Inter',sans-serif;font-weight:700;font-size:52px;line-height:1.16;letter-spacing:-1px;margin-bottom:8px}.titulo em{font-weight:500}.sub{font-family:'Inter',sans-serif;font-size:24px;line-height:1.55;font-weight:400;color:${TXT_SUAVE};max-width:760px;margin:0 auto}.sub strong{color:${TXT};font-weight:600}`,
  `<div class="bloco"><div class="titulo">${titulo}</div>${sub ? `<div class="divider"></div><div class="sub">${sub}</div>` : ''}</div>`
);

const tplVerso = (versiculo, ref) => wrap(
  `.ref{font-family:'JetBrains Mono',monospace;font-size:20px;letter-spacing:3px;text-transform:uppercase;color:${TXT};font-weight:600;opacity:.65;margin-bottom:42px}.v{font-family:'Playfair Display',serif;font-style:italic;font-weight:500;font-size:48px;line-height:1.24;color:${TXT};max-width:880px}`,
  `<div class="ref">${ref}</div><div class="v">"${versiculo}"</div>`
);

const tplCta = (intro, marca, data, igreja) => wrap(
  `.intro{font-family:'Inter',sans-serif;font-size:24px;line-height:1.5;font-weight:400;color:${TXT_SUAVE};max-width:680px;margin-bottom:24px}.marca{font-family:'Inter',sans-serif;font-weight:700;font-size:120px;line-height:.92;letter-spacing:-4px;color:${TXT};text-transform:uppercase;margin-bottom:24px}.marca em{text-transform:none;font-family:'Playfair Display',serif;font-style:italic;font-weight:500}.data-cta{font-family:'Inter',sans-serif;font-weight:700;font-size:36px;line-height:1.1;letter-spacing:-.5px;color:${TXT}}.igreja{font-family:'Inter',sans-serif;font-size:18px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:${TXT_SUAVE};margin-top:14px}`,
  `<div class="intro">${intro}</div><div class="marca">${marca}</div><div class="divider"></div><div class="data-cta">${data}</div><div class="igreja">${igreja}</div>`
);

const tplFrase = (texto, ref) => wrap(
  `.frase{font-family:'Inter',sans-serif;font-weight:600;font-size:54px;line-height:1.22;letter-spacing:-1px}.frase em{font-weight:500}.ref{font-family:'JetBrains Mono',monospace;font-size:16px;letter-spacing:3px;text-transform:uppercase;color:${TXT};font-weight:600;opacity:.65}`,
  `<div class="bloco"><div class="frase">${texto}</div><div class="divider"></div><div class="ref">${ref}</div></div>`
);

// ============================================================
// CONTEÚDO — Voice DNA Castelo Forte preservado (com acentos!)
// ============================================================

const slides = {
  // 2 FRASES (T11 castelo-forte-frase)
  'slide-01-frase-reinar.html': tplFrase(
    'Você não foi chamado pra <em>sobreviver</em>. Foi chamado pra reinar.',
    'Romanos 5.17'
  ),
  'slide-02-frase-palavra.html': tplFrase(
    'Onde a Palavra entra, o <em>impossível</em> sai.',
    'Hebreus 4.12'
  ),

  // 1 CARROSSEL T10 (castelo-forte-editorial) — Filho não mendiga herança
  'slide-03-capa.html': tplCapa(
    'Filho não <em>mendiga</em> herança. Recebe.'
  ),
  'slide-04-interna-1.html': tplInterna(
    'Você está tentando <em>alcançar</em> o que já te pertence.',
    'Você ora pedindo o que foi entregue na cruz. Você jejua por uma posição que já é sua desde antes do mundo existir. Você briga no espírito por um território que <strong>já foi conquistado</strong>.'
  ),
  'slide-05-interna-2.html': tplInterna(
    'Mendigo vive de <em>esmola</em>. Filho vive de herança.',
    'Existe uma diferença entre esperar que Deus te dê alguma coisa e reconhecer que <strong>Ele já te deu tudo em Cristo</strong>. A primeira postura te mantém ajoelhado pedindo. A segunda te coloca em pé pra ocupar.'
  ),
  'slide-06-interna-3.html': tplInterna(
    'A questão não é se Deus <em>quer</em> te dar. É se você já sabe quem você é.',
    'Filho de Rei não pede vaga de emprego no próprio palácio. Filho de Rei reina. E reinar começa por <strong>enxergar quem você é</strong> debaixo do nome do Pai.'
  ),
  'slide-07-verso.html': tplVerso(
    'Assim, você já não é mais escravo, mas filho. E, se é filho, também é herdeiro por Deus.',
    'Gálatas 4.7'
  ),
  'slide-08-cta.html': tplCta(
    'Domingo, 19h. Vem ocupar a posição que sempre foi sua.',
    'Em <em>Cristo</em>',
    'Domingo · 19h',
    'Igreja Castelo Forte · Jurerê'
  ),
};

for (const [filename, html] of Object.entries(slides)) {
  fs.writeFileSync(path.join(__dirname, filename), html);
  console.log(`✓ ${filename}`);
}

console.log(`\n${Object.keys(slides).length} HTMLs gerados em ${__dirname}`);
