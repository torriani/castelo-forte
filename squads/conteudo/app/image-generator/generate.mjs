#!/usr/bin/env node
/**
 * Image Generator — Squad Conteúdo
 * Gera imagens PNG a partir de templates + texto estruturado
 *
 * Uso:
 *   node generate.mjs --template twitter-branco --input slides.json --output ./output/
 *   node generate.mjs --template twitter-black --title "Frase bold" --body "Texto regular"
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ═══════════════════════════════════════════════════════════════
// CONFIGURAÇÃO DOS TEMPLATES
// ═══════════════════════════════════════════════════════════════

const TEMPLATES_DIR = join(__dirname, 'templates');
const FONTS_DIR = join(__dirname, 'fonts');

// Carregar fontes como base64 para SVG
const INTER_BOLD_B64 = readFileSync(join(FONTS_DIR, 'Inter-Bold.ttf')).toString('base64');
const INTER_REGULAR_B64 = readFileSync(join(FONTS_DIR, 'Inter-Regular.ttf')).toString('base64');
const PTSERIF_BOLD_B64 = readFileSync(join(FONTS_DIR, 'PTSerif-Bold.ttf')).toString('base64');
const PTSERIF_REGULAR_B64 = readFileSync(join(FONTS_DIR, 'PTSerif-Regular.ttf')).toString('base64');

// Configurações de layout por template
const TEMPLATE_CONFIG = {
  'twitter-branco': {
    file: 'twitter-branco-base.png',
    width: 1080,
    height: 1350,
    textColor: '#0f1419',
    bodyColor: '#0f1419',
    handleColor: '#536471',
    titleFont: 'InterBold',
    bodyFont: 'InterRegular',
    titleSize: 48,
    bodySize: 42,
    textX: 100,
    textY: 510,
    textWidth: 880,
    lineHeight: 1.45,
    bodyGap: 30,
    centerVertically: true,
    renderHeader: {
      name: 'operador da Castelo Forte',
      handle: '@castelofortefloripa',
      avatar: join(__dirname, 'assets/avatar-juliano.jpg'),
      verified: true,
      nameSize: 38,
      handleSize: 30,
      avatarSize: 96,
      gapBelow: 50,
    },
    imageArea: { x: 70, y: null, width: 940, height: 400 },
  },
  'twitter-black': {
    file: 'twitter-black-base.png',
    width: 1080,
    height: 1350,
    textColor: '#E7E9EA',
    bodyColor: '#E7E9EA',
    handleColor: '#71767B',
    titleFont: 'InterBold',
    bodyFont: 'InterRegular',
    titleSize: 48,
    bodySize: 42,
    textX: 100,
    textY: 510,
    textWidth: 880,
    lineHeight: 1.45,
    bodyGap: 30,
    centerVertically: true,
    renderHeader: {
      name: 'operador da Castelo Forte',
      handle: '@castelofortefloripa',
      avatar: join(__dirname, 'assets/avatar-juliano.jpg'),
      verified: true,
      nameSize: 38,
      handleSize: 30,
      avatarSize: 96,
      gapBelow: 50,
    },
    imageArea: { x: 70, y: null, width: 940, height: 400 },
  },
  'post-imagem-capa': {
    file: 'post-imagem-capa.png',
    width: 1080,
    height: 1350,
    textColor: '#FFFFFF',
    bodyColor: '#CCCCCC',
    titleFont: 'PTSerifBold',
    bodyFont: 'InterRegular',
    titleSize: 56,
    bodySize: 28,
    textX: 540, // centro horizontal (text-anchor: middle)
    textY: 830, // ~65% da altura — parte inferior
    textWidth: 920,
    lineHeight: 1.2,
    bodyGap: 20,
    textAlign: 'center',
    imageArea: { x: 0, y: 0, width: 1080, height: 1350 }, // foto fullscreen
    imageOverlay: true, // gradient escuro na parte inferior
  },
  'post-imagem-interna-foto': {
    file: 'post-imagem-interna-foto.png',
    width: 1080,
    height: 1350,
    textColor: '#1a1a1a',
    bodyColor: '#444444',
    titleFont: 'InterBold',
    bodyFont: 'InterRegular',
    titleSize: 40,
    bodySize: 28,
    textX: 80,
    textY: 740,
    textWidth: 920,
    lineHeight: 1.35,
    bodyGap: 20,
    imageArea: { x: 60, y: 80, width: 960, height: 620 },
  },
  'post-imagem-interna-texto': {
    file: 'post-imagem-interna-texto.png',
    width: 1080,
    height: 1350,
    textColor: '#1a1a1a',
    bodyColor: '#444444',
    titleFont: 'PTSerifBold',
    bodyFont: 'InterRegular',
    titleSize: 44,
    bodySize: 28,
    textX: 80,
    textY: 320, // mais centralizado verticalmente
    textWidth: 920,
    lineHeight: 1.4,
    bodyGap: 36,
    lastParaBold: true, // último parágrafo em bold
    imageArea: null,
  },
};

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES DE TEXTO → SVG
// ═══════════════════════════════════════════════════════════════

function wrapText(text, fontSize, maxWidth, charsPerLine) {
  // Estimativa de caracteres por linha baseada no fontSize e largura
  const avgCharWidth = fontSize * 0.52;
  const maxChars = charsPerLine || Math.floor(maxWidth / avgCharWidth);

  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > maxChars && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function parseBoldSegments(line) {
  // Parse **bold** or *bold* dentro de uma linha
  const segments = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: line.slice(lastIndex, match.index), bold: false });
    }
    segments.push({ text: match[1] || match[2], bold: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) {
    segments.push({ text: line.slice(lastIndex), bold: false });
  }
  if (segments.length === 0) {
    segments.push({ text: line, bold: false });
  }
  return segments;
}

function computeTextBlockHeight(config, title, body) {
  const { titleSize, bodySize, textWidth, lineHeight, bodyGap } = config;
  const titleLines = title ? wrapText(title, titleSize, textWidth) : [];
  let normalizedBody = body ? body.replace(/\\n/g, '\n') : '';
  if (!normalizedBody.includes('\n')) normalizedBody = normalizedBody.replace(/\. /g, '.\n\n');
  const bodyBlocks = normalizedBody
    ? normalizedBody.split(/\n\n+/).map(b => b.split('\n').filter(l => l.trim())).filter(b => b.length > 0)
    : [];
  let h = 0;
  for (const _ of titleLines) h += titleSize * lineHeight;
  if (titleLines.length > 0 && bodyBlocks.length > 0) h += bodyGap;
  for (let p = 0; p < bodyBlocks.length; p++) {
    for (const line of bodyBlocks[p]) {
      const wrapped = wrapText(line, bodySize, textWidth);
      for (const _ of wrapped) h += bodySize * lineHeight;
    }
    if (p < bodyBlocks.length - 1) h += bodySize * 1.2;
  }
  return h;
}

function createTextSvg(config, title, body, width, height, forcedStartY = null) {
  const { textColor, bodyColor, titleSize, bodySize, textX, textY, textWidth, lineHeight, bodyGap } = config;
  const textAlign = config.textAlign || 'left';
  const titleFont = config.titleFont || 'InterBold';
  const bodyFont = config.bodyFont || 'InterRegular';
  const lastParaBold = config.lastParaBold || false;
  const anchor = textAlign === 'center' ? 'middle' : 'start';

  // Resolver família de fonte para o título
  const titleFontFamily = titleFont.startsWith('PTSerif')
    ? 'PTSerifBold, PT Serif, serif'
    : 'InterBold, Inter, sans-serif';

  // Wrap title
  const titleLines = title ? wrapText(title, titleSize, textWidth) : [];

  // Wrap body: aceita literal \\n e respeita a estrutura do autor
  // \n\n (duplo) = bloco separado (espaço grande entre)
  // \n (único) = quebra de linha dentro do mesmo bloco (sem espaço grande)
  // Se não houver \n no body, força quebra em ". " (retrocompatibilidade)
  let normalizedBody = body ? body.replace(/\\n/g, '\n') : '';
  if (!normalizedBody.includes('\n')) {
    normalizedBody = normalizedBody.replace(/\. /g, '.\n\n');
  }

  // Quebra primeiro em blocos (separados por \n\n), depois cada bloco em linhas (\n)
  const bodyBlocks = normalizedBody
    ? normalizedBody.split(/\n\n+/).map(b => b.split('\n').filter(l => l.trim())).filter(b => b.length > 0)
    : [];

  // Agrupar linhas por bloco (para saber qual é o último e gerenciar espaços)
  const paragraphGroups = [];
  for (const block of bodyBlocks) {
    const blockLines = [];
    for (const line of block) {
      // Detectar linha inteira em negrito: **texto**
      const fullBoldMatch = line.match(/^\*\*(.+)\*\*$/);
      if (fullBoldMatch) {
        // Wrap o conteúdo sem os asteriscos, marca cada linha resultante como bold
        const wrapped = wrapText(fullBoldMatch[1], bodySize, textWidth);
        for (const w of wrapped) blockLines.push({ text: w, fullBold: true });
      } else {
        const wrapped = wrapText(line, bodySize, textWidth);
        for (const w of wrapped) blockLines.push({ text: w, fullBold: false });
      }
    }
    paragraphGroups.push(blockLines);
  }

  // Flatten com marcador de bloco (espaço grande SÓ entre blocos diferentes)
  const allBodyLines = [];
  for (let p = 0; p < paragraphGroups.length; p++) {
    const isLastPara = (p === paragraphGroups.length - 1);
    for (const lineEntry of paragraphGroups[p]) {
      allBodyLines.push({ text: lineEntry.text, isLastPara, fullBold: lineEntry.fullBold });
    }
    if (!isLastPara) allBodyLines.push({ text: '', isLastPara: false, fullBold: false }); // espaço entre blocos
  }

  // Gerar SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <style>
      @font-face {
        font-family: 'InterBold';
        src: url('data:font/truetype;base64,${INTER_BOLD_B64}') format('truetype');
        font-weight: bold;
      }
      @font-face {
        font-family: 'InterRegular';
        src: url('data:font/truetype;base64,${INTER_REGULAR_B64}') format('truetype');
        font-weight: normal;
      }
      @font-face {
        font-family: 'PTSerifBold';
        src: url('data:font/truetype;base64,${PTSERIF_BOLD_B64}') format('truetype');
        font-weight: bold;
      }
      @font-face {
        font-family: 'PTSerifRegular';
        src: url('data:font/truetype;base64,${PTSERIF_REGULAR_B64}') format('truetype');
        font-weight: normal;
      }
    </style>
  </defs>`;

  // Gradient overlay para editorial capa (texto branco sobre foto)
  if (config.imageOverlay) {
    svg += `
  <defs>
    <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="black" stop-opacity="0"/>
      <stop offset="50%" stop-color="black" stop-opacity="0.1"/>
      <stop offset="75%" stop-color="black" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.8"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#overlay)"/>`;
  }

  // Calcular altura total do bloco de texto (titulo + body)
  // pra centralizar verticalmente quando centerVertically: true
  let textBlockHeight = 0;
  for (const _ of titleLines) textBlockHeight += titleSize * lineHeight;
  if (titleLines.length > 0 && allBodyLines.length > 0) textBlockHeight += bodyGap;
  for (const lineObj of allBodyLines) {
    if (lineObj.text === '') textBlockHeight += bodySize * 1.2;
    else textBlockHeight += bodySize * lineHeight;
  }

  // Posicionamento vertical do texto:
  // 1) Se forcedStartY foi passado (header dinamico ja calculou a posicao), usa ele
  // 2) Senao, se centerVertically: calcula centro com base apenas no textBlockHeight
  // 3) Caso contrario: usa textY estatico
  let currentY;
  if (forcedStartY !== null) {
    currentY = forcedStartY;
  } else if (config.centerVertically) {
    const headerHeight = config.headerHeight || 0;
    const totalBlockHeight = headerHeight + textBlockHeight;
    const blockTopY = Math.max(40, (height - totalBlockHeight) / 2);
    currentY = blockTopY + headerHeight;
  } else {
    currentY = textY;
  }

  // Renderizar título
  for (const line of titleLines) {
    currentY += titleSize * lineHeight;
    svg += `\n  <text x="${textX}" y="${currentY}"
      font-family="${titleFontFamily}"
      font-weight="bold"
      font-size="${titleSize}px"
      text-anchor="${anchor}"
      fill="${textColor}">${escapeXml(line)}</text>`;
  }

  // Gap entre título e body
  if (titleLines.length > 0 && allBodyLines.length > 0) {
    currentY += bodyGap;
  }

  // Renderizar body
  for (const lineObj of allBodyLines) {
    if (lineObj.text === '') {
      currentY += bodySize * 1.2; // espaço entre blocos (\n\n no JSON) — maior que linha normal
      continue;
    }
    currentY += bodySize * lineHeight;

    // Último parágrafo em bold se configurado, OU linha marcada como fullBold
    const forceBodyBold = (lastParaBold && lineObj.isLastPara) || lineObj.fullBold;
    const lineFont = forceBodyBold ? 'InterBold, Inter, sans-serif' : 'InterRegular, Inter, sans-serif';
    const lineWeight = forceBodyBold ? 'bold' : 'normal';
    const lineColor = forceBodyBold ? textColor : bodyColor;

    const segments = parseBoldSegments(lineObj.text);
    if (segments.length === 1 && !segments[0].bold && !forceBodyBold) {
      svg += `\n  <text x="${textX}" y="${currentY}"
        font-family="InterRegular, Inter, sans-serif"
        font-weight="normal"
        font-size="${bodySize}px"
        text-anchor="${anchor}"
        fill="${bodyColor}">${escapeXml(segments[0].text)}</text>`;
    } else if (forceBodyBold && segments.length === 1) {
      svg += `\n  <text x="${textX}" y="${currentY}"
        font-family="${lineFont}"
        font-weight="${lineWeight}"
        font-size="${bodySize}px"
        text-anchor="${anchor}"
        fill="${lineColor}">${escapeXml(segments[0].text)}</text>`;
    } else {
      svg += `\n  <text x="${textX}" y="${currentY}" font-size="${bodySize}px" text-anchor="${anchor}">`;
      for (const seg of segments) {
        const font = seg.bold || forceBodyBold ? 'InterBold' : 'InterRegular';
        const weight = seg.bold || forceBodyBold ? 'bold' : 'normal';
        const color = seg.bold || forceBodyBold ? textColor : bodyColor;
        svg += `<tspan font-family="${font}, Inter, sans-serif" font-weight="${weight}" fill="${color}">${escapeXml(seg.text)}</tspan>`;
      }
      svg += `</text>`;
    }
  }

  svg += '\n</svg>';
  return svg;
}

// ═══════════════════════════════════════════════════════════════
// GERADOR PRINCIPAL
// ═══════════════════════════════════════════════════════════════

async function generateImage({ template, title, body, imagePath, outputPath }) {
  const config = TEMPLATE_CONFIG[template];
  if (!config) {
    throw new Error(`Template "${template}" não encontrado. Disponíveis: ${Object.keys(TEMPLATE_CONFIG).join(', ')}`);
  }

  const templatePath = join(TEMPLATES_DIR, config.file);
  if (!existsSync(templatePath)) {
    throw new Error(`Arquivo de template não encontrado: ${templatePath}`);
  }

  const { width, height } = config;

  // 1. Carregar template base
  let pipeline = sharp(templatePath);

  // 2. Se tem imagem, compor na área de imagem
  const composites = [];

  if (imagePath && config.imageArea) {
    const area = config.imageArea;
    try {
      const imgBuffer = await sharp(imagePath)
        .resize(area.width, area.height, { fit: 'cover' })
        .toBuffer();

      const imageY = area.y !== null ? area.y : 0;
      composites.push({
        input: imgBuffer,
        left: area.x,
        top: imageY,
      });
    } catch (e) {
      console.warn(`Aviso: Não foi possível carregar imagem "${imagePath}": ${e.message}`);
    }
  }

  // 3. Renderizar header dinamico (avatar + nome + handle + verificado)
  //    quando renderHeader esta definido na config do template.
  //    O header e o texto sao compostos juntos como UM bloco unico
  //    centralizado verticalmente no canvas.
  let headerTopY = null;
  if (config.renderHeader) {
    const h = config.renderHeader;
    const textBlockHeight = computeTextBlockHeight(config, title || '', body || '');
    const totalBlockHeight = h.avatarSize + h.gapBelow + textBlockHeight;
    headerTopY = Math.max(60, Math.round((height - totalBlockHeight) / 2));

    // Avatar circular
    if (h.avatar && existsSync(h.avatar)) {
      const avatarBuffer = await sharp(h.avatar)
        .resize(h.avatarSize, h.avatarSize, { fit: 'cover' })
        .composite([{
          input: Buffer.from(
            `<svg width="${h.avatarSize}" height="${h.avatarSize}"><circle cx="${h.avatarSize/2}" cy="${h.avatarSize/2}" r="${h.avatarSize/2}" fill="white"/></svg>`
          ),
          blend: 'dest-in',
        }])
        .png()
        .toBuffer();
      composites.push({
        input: avatarBuffer,
        left: config.textX,
        top: headerTopY,
      });
    }

    // Nome + handle + verificado via SVG
    const nameTextX = config.textX + h.avatarSize + 18;
    const nameY = headerTopY + h.nameSize + 10;
    const handleY = nameY + h.handleSize + 8;
    const verifiedSize = Math.round(h.nameSize * 0.7);
    const headerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <style>
          @font-face {
            font-family: 'InterBold';
            src: url('data:font/truetype;base64,${INTER_BOLD_B64}') format('truetype');
            font-weight: bold;
          }
          @font-face {
            font-family: 'InterRegular';
            src: url('data:font/truetype;base64,${INTER_REGULAR_B64}') format('truetype');
            font-weight: normal;
          }
        </style>
      </defs>
      <text x="${nameTextX}" y="${nameY}"
        font-family="InterBold, Inter, sans-serif"
        font-weight="bold"
        font-size="${h.nameSize}px"
        fill="${config.textColor}">${escapeXml(h.name)}</text>
      ${h.verified ? `<g transform="translate(${nameTextX + Math.round(h.name.length * h.nameSize * 0.45) + 6}, ${nameY - Math.round(verifiedSize * 0.95)})">
        <circle cx="${verifiedSize/2}" cy="${verifiedSize/2}" r="${verifiedSize/2}" fill="#1D9BF0"/>
        <path d="M ${verifiedSize*0.28} ${verifiedSize*0.52} L ${verifiedSize*0.45} ${verifiedSize*0.7} L ${verifiedSize*0.72} ${verifiedSize*0.36}" stroke="white" stroke-width="${verifiedSize*0.13}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>` : ''}
      <text x="${nameTextX}" y="${handleY}"
        font-family="InterRegular, Inter, sans-serif"
        font-weight="normal"
        font-size="${h.handleSize}px"
        fill="${config.handleColor || '#536471'}">${escapeXml(h.handle)}</text>
    </svg>`;
    composites.push({
      input: Buffer.from(headerSvg),
      left: 0,
      top: 0,
    });
  }

  // 4. Gerar SVG do texto (centralizacao usa textStartY se header foi renderizado)
  const textStartY = headerTopY !== null && config.renderHeader
    ? headerTopY + config.renderHeader.avatarSize + config.renderHeader.gapBelow
    : null;
  const textSvg = createTextSvg(config, title || '', body || '', width, height, textStartY);
  composites.push({
    input: Buffer.from(textSvg),
    left: 0,
    top: 0,
  });

  // 4. Compor tudo
  const result = await pipeline
    .composite(composites)
    .png({ quality: 95 })
    .toBuffer();

  // 5. Salvar
  const outDir = dirname(outputPath);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  writeFileSync(outputPath, result);

  return outputPath;
}

// ═══════════════════════════════════════════════════════════════
// GERADOR EM LOTE (a partir de JSON)
// ═══════════════════════════════════════════════════════════════

async function generateBatch(inputJsonPath, outputDir) {
  const data = JSON.parse(readFileSync(inputJsonPath, 'utf-8'));

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const results = [];
  for (let i = 0; i < data.slides.length; i++) {
    const slide = data.slides[i];
    const template = slide.template || data.defaultTemplate || 'twitter-branco';
    const outputPath = join(outputDir, `slide-${String(i + 1).padStart(2, '0')}.png`);

    console.log(`  Gerando slide ${i + 1}/${data.slides.length}: ${template} → ${outputPath}`);

    await generateImage({
      template,
      title: slide.title || '',
      body: slide.body || '',
      imagePath: slide.image || null,
      outputPath,
    });

    results.push(outputPath);
  }

  return results;
}

// ═══════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    console.log(`
Gerador de Imagens — Squad Conteúdo

USO:
  # Gerar um slide avulso:
  node generate.mjs --template twitter-branco --title "Título bold" --body "Texto body" --output ./slide.png

  # Gerar um slide com imagem:
  node generate.mjs --template twitter-branco --title "Título" --body "Texto" --image ./foto.jpg --output ./slide.png

  # Gerar em lote a partir de JSON:
  node generate.mjs --batch ./slides.json --output ./output/

TEMPLATES DISPONÍVEIS:
  twitter-branco          Twitter style, fundo branco
  twitter-black           Twitter style, fundo preto
  post-imagem-capa        Editorial com área de imagem no topo + título serifado
  post-imagem-interna-foto Editorial com foto no topo + texto
  post-imagem-interna-texto Editorial só texto

FORMATO DO JSON (--batch):
  {
    "defaultTemplate": "twitter-branco",
    "slides": [
      { "title": "Título bold", "body": "Texto do corpo" },
      { "title": "Outro título", "body": "Outro body", "template": "twitter-black" },
      { "title": "Com imagem", "body": "Texto", "image": "./foto.jpg", "template": "twitter-branco" }
    ]
  }
`);
    return;
  }

  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx >= 0 ? args[idx + 1] : null;
  };

  // Modo batch
  const batchPath = getArg('--batch');
  if (batchPath) {
    const outputDir = getArg('--output') || './output';
    console.log(`Gerando em lote: ${batchPath} → ${outputDir}`);
    const results = await generateBatch(batchPath, outputDir);
    console.log(`\n${results.length} imagens geradas com sucesso!`);
    return;
  }

  // Modo avulso
  const template = getArg('--template') || 'twitter-branco';
  const title = getArg('--title') || '';
  const body = getArg('--body') || '';
  const imagePath = getArg('--image') || null;
  const outputPath = getArg('--output') || './slide.png';

  console.log(`Gerando: ${template} → ${outputPath}`);
  await generateImage({ template, title, body, imagePath, outputPath });
  console.log('Imagem gerada com sucesso!');
}

// Exportar para uso programático
export { generateImage, generateBatch, TEMPLATE_CONFIG };

// Executar se chamado diretamente
main().catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
