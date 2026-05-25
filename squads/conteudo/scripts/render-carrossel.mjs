#!/usr/bin/env node
/**
 * render-carrossel.mjs
 *
 * Renderiza carrosséis a partir de markdown + template + imagens Pexels.
 * Zero LLM — 100% mecânico.
 *
 * Uso:
 *   node scripts/render-carrossel.mjs <arquivo.md> --template <modelo> [--output <pasta>] [--carrossel <numero>]
 *
 * Exemplos:
 *   node scripts/render-carrossel.mjs copys/v2-carrosseis-01-10.md --template modelo-01
 *   node scripts/render-carrossel.mjs copys/v2-carrosseis-01-10.md --template modelo-01 --carrossel 3
 *   node scripts/render-carrossel.mjs copys/v2-carrosseis-01-10.md --template twitter-dark --output ./saida
 *
 * Templates disponíveis:
 *   modelo-01, modelo-02, modelo-05, claude-01, claude-02, claude-05, twitter-dark, twitter-light, imperial
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Carregar .env automaticamente
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════════

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';
const TEMPLATES_DIR = path.join(ROOT, 'templates/carousel');
const DEFAULT_OUTPUT = path.join(ROOT, '../../outputs/multiplicar');

// ═══════════════════════════════════════════════════════════════
// ASSETS CONHECIDOS (logos, marcas, pessoas — sem precisar buscar)
// ═══════════════════════════════════════════════════════════════

const KNOWN_ASSETS = {
  // Logos de ferramentas/marcas
  'claude code': { type: 'logo', color: '#D97757', name: 'Claude Code' },
  'claude': { type: 'logo', color: '#D97757', name: 'Claude' },
  'anthropic': { type: 'logo', color: '#D97757', name: 'Anthropic' },
  'playwright': { type: 'logo', color: '#2EAD33', name: 'Playwright' },
  'chatgpt': { type: 'logo', color: '#74AA9C', name: 'ChatGPT' },
  'openai': { type: 'logo', color: '#000000', name: 'OpenAI' },
  'github': { type: 'logo', color: '#333333', name: 'GitHub' },
  'vercel': { type: 'logo', color: '#000000', name: 'Vercel' },
  'supabase': { type: 'logo', color: '#3ECF8E', name: 'Supabase' },
  'whatsapp': { type: 'logo', color: '#25D366', name: 'WhatsApp' },
  'instagram': { type: 'logo', color: '#E4405F', name: 'Instagram' },
  'canva': { type: 'logo', color: '#00C4CC', name: 'Canva' },

  // Pessoas públicas (buscar na web, não no Pexels)
  'trump': { type: 'person', search: 'Donald Trump portrait official', name: 'Donald Trump' },
  'elon musk': { type: 'person', search: 'Elon Musk portrait', name: 'Elon Musk' },
  'steve jobs': { type: 'person', search: 'Steve Jobs portrait keynote', name: 'Steve Jobs' },
  'gary halbert': { type: 'person', search: 'Gary Halbert copywriter', name: 'Gary Halbert' },
  'dan kennedy': { type: 'person', search: 'Dan Kennedy marketing', name: 'Dan Kennedy' },
  'eugene schwartz': { type: 'person', search: 'Eugene Schwartz advertising', name: 'Eugene Schwartz' },
  'david ogilvy': { type: 'person', search: 'David Ogilvy advertising portrait', name: 'David Ogilvy' },
  'gary bencivenga': { type: 'person', search: 'Gary Bencivenga copywriter', name: 'Gary Bencivenga' },
  'alex hormozi': { type: 'person', search: 'Alex Hormozi portrait', name: 'Alex Hormozi' },
  'russell brunson': { type: 'person', search: 'Russell Brunson portrait', name: 'Russell Brunson' },
};

// Detectar se o texto menciona algo conhecido
function detectKnownAsset(text) {
  const lower = text.toLowerCase();
  for (const [key, asset] of Object.entries(KNOWN_ASSETS)) {
    if (lower.includes(key)) {
      return { key, ...asset };
    }
  }
  return null;
}

// Palavras-chave por contexto (extração automática sem LLM)
const KEYWORD_MAP = {
  'computador': 'laptop computer dark room technology',
  'notebook': 'laptop opening morning workspace',
  'tela': 'computer screen glowing dark',
  'café': 'coffee cup laptop morning work',
  'código': 'programming code screen dark',
  'commit': 'code programming terminal',
  'agente': 'artificial intelligence robot automation',
  'automação': 'automation technology robot hand',
  'playwright': 'browser automation screen multiple windows',
  'dashboard': 'analytics dashboard data graphs screen',
  'token': 'data analytics dashboard metrics',
  'freelancer': 'freelancer frustrated working computer',
  'equipe': 'team working office computers',
  'copy': 'writing typewriter creative desk',
  'copywriter': 'vintage typewriter books desk',
  'halbert': 'vintage typewriter letter writing',
  'kennedy': 'speaking podium authority business',
  'schwartz': 'books library study knowledge',
  'ogilvy': 'advertising billboard creative',
  'debate': 'debate discussion meeting people',
  'diagnóstico': 'magnifying glass analysis audit',
  'nota': 'grade score analysis report',
  'página': 'website landing page screen',
  'whatsapp': 'smartphone messaging typing fast',
  'mensagem': 'phone message chat communication',
  'velocidade': 'speed fast motion blur',
  'orquestrador': 'orchestra conductor maestro',
  'chefe': 'leadership director control room',
  'fluxo': 'flowchart diagram workflow whiteboard',
  'instrução': 'blueprint plan strategy diagram',
  'delegação': 'hourglass time efficiency laptop',
  'resultado': 'success achievement target goal',
  'construir': 'building construction architecture',
  'império': 'skyline city building power',
  'mágica': 'light abstract technology glow',
  'infraestrutura': 'server room data center technology',
  'operação': 'control room operations center',
  'prova': 'evidence proof data chart',
  'venda': 'sales business handshake deal',
  'oferta': 'presentation business pitch meeting',
  'clonagem': 'mirror reflection digital twin',
  'cérebro': 'brain neural network artificial intelligence',
  'manual': 'hands manual work crafting',
  'repetitivo': 'assembly line factory repetitive',
  'liberar': 'freedom open sky breaking free',
  'precisão': 'precision target bullseye accuracy',
};

// ═══════════════════════════════════════════════════════════════
// PARSER DE MARKDOWN
// ═══════════════════════════════════════════════════════════════

function parseMarkdown(content) {
  const carrosseis = [];
  const blocks = content.split(/^## Carrossel \d+/m);
  const headers = content.match(/^## Carrossel \d+ — .+$/gm) || [];

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    const block = blocks[i + 1];
    if (!block) continue;

    const num = header.match(/Carrossel (\d+)/)?.[1];
    const titulo = header.match(/— (.+)$/)?.[1] || '';

    // Extrair tipo, framework, tom, intenção
    const tipo = block.match(/\*\*Tipo:\*\* (.+)/)?.[1] || '';
    const framework = block.match(/\*\*Framework:\*\* (.+)/)?.[1] || '';
    const tom = block.match(/\*\*Tom:\*\* (.+)/)?.[1] || '';
    const intencao = block.match(/\*\*Intenção:\*\* (.+)/)?.[1] || '';

    // Extrair hooks
    const hooks = [];
    const hookMatches = block.match(/- \[(VIRAL|IMPERIAL)\] "(.+)"/g) || [];
    for (const h of hookMatches) {
      const m = h.match(/\[(VIRAL|IMPERIAL)\] "(.+)"/);
      if (m) hooks.push({ type: m[1], text: m[2] });
    }

    // Extrair slides
    const slides = [];
    const slideMatches = block.match(/### Slide \d+.*\n([\s\S]*?)(?=### Slide|\n### Caption|### S1_HOOKS|$)/g) || [];

    for (const sm of slideMatches) {
      const numMatch = sm.match(/### Slide (\d+)/);
      const slideNum = numMatch ? parseInt(numMatch[1]) : 0;

      // Slide 1 (Hook) — pegar só o título
      if (slideNum === 1) {
        const hookText = sm.match(/### Slide 1 \(Hook\) — (.+)/)?.[1] || hooks[0]?.text || '';
        slides.push({ num: 1, type: 'hook', text: hookText, body: '' });
        continue;
      }

      // Slide 10 (CTA) — pegar primeira opção
      if (slideNum === 10) {
        const ctaMatch = sm.match(/- \[PROVOCAÇÃO\] "(.+)"/);
        const ctaText = ctaMatch ? ctaMatch[1] : 'Comenta para começar';
        slides.push({ num: 10, type: 'cta', text: ctaText, body: '' });
        continue;
      }

      // Slides internos (2-9)
      const lines = sm.split('\n').filter(l => l.trim() && !l.startsWith('###'));
      const text = lines.join(' ').trim();
      slides.push({ num: slideNum, type: 'content', text, body: '' });
    }

    // Extrair caption
    const captionMatch = block.match(/### Caption Sugerida\n([\s\S]*?)(?=### Sugestões|---)/);
    const caption = captionMatch ? captionMatch[1].trim() : '';

    carrosseis.push({
      num: parseInt(num),
      titulo,
      tipo,
      framework,
      tom,
      intencao,
      hooks,
      slides,
      caption,
    });
  }

  return carrosseis;
}

// ═══════════════════════════════════════════════════════════════
// BUSCA DE IMAGENS (Pexels API — sem LLM)
// ═══════════════════════════════════════════════════════════════

function extractKeywords(text) {
  const lower = text.toLowerCase();
  const found = [];

  for (const [keyword, searchTerms] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) {
      found.push(searchTerms);
    }
  }

  // Se não achou nada, usar as primeiras 3 palavras significativas
  if (found.length === 0) {
    const words = text.split(/\s+/)
      .filter(w => w.length > 4)
      .slice(0, 3)
      .join(' ');
    found.push(words + ' technology');
  }

  return found[0]; // Retorna o primeiro match
}

async function searchPexels(query, perPage = 5) {
  if (!PEXELS_API_KEY) {
    console.log(`  ⚠ Sem PEXELS_API_KEY — gerando placeholder para: "${query}"`);
    return [];
  }

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=portrait&size=large`;
    const res = await fetch(url, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    const data = await res.json();
    return data.photos || [];
  } catch (err) {
    console.error(`  ✗ Erro buscando Pexels: ${err.message}`);
    return [];
  }
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    const stats = fs.statSync(destPath);
    return stats.size > 10000; // > 10KB
  } catch (err) {
    console.error(`  ✗ Erro baixando imagem: ${err.message}`);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// BUSCA NA WEB (Google Images / fallback para pessoas e marcas)
// ═══════════════════════════════════════════════════════════════

async function searchWebImages(query) {
  console.log(`  🌐 Web image search: "${query}"`);
  try {
    // DuckDuckGo instant answer API (sem key, sem LLM)
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&iax=images&ia=images`;
    const res = await fetch(ddgUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
    });
    const data = await res.json();

    // DDG retorna Image field se tiver resultado direto
    if (data.Image) {
      return { url: data.Image.startsWith('http') ? data.Image : `https://duckduckgo.com${data.Image}`, source: 'ddg' };
    }

    // Tentar Unsplash como fallback (sem API, direct URL)
    const unsplashUrl = `https://source.unsplash.com/1080x1350/?${encodeURIComponent(query)}`;
    return { url: unsplashUrl, source: 'unsplash-random' };
  } catch (err) {
    console.error(`  ✗ Erro na busca web: ${err.message}`);
    return null;
  }
}

async function fetchImageForSlide(slideText, carrosselNum, slideNum, outputDir) {
  const imgName = `c${String(carrosselNum).padStart(2, '0')}-s${String(slideNum).padStart(2, '0')}.jpg`;
  const imgPath = path.join(outputDir, 'images', imgName);

  // Se já existe, pula
  if (fs.existsSync(imgPath)) {
    console.log(`  ✓ Imagem já existe: ${imgName}`);
    return { name: imgName, source: 'cache' };
  }

  // 1. Verificar se menciona algo conhecido (pessoa, marca, logo)
  const knownAsset = detectKnownAsset(slideText);

  if (knownAsset) {
    if (knownAsset.type === 'person') {
      // Pessoa pública → buscar na web, não no Pexels
      console.log(`  👤 Pessoa detectada: ${knownAsset.name}`);

      // 1. Buscar na web primeiro (DDG / Unsplash)
      const webResult = await searchWebImages(knownAsset.search);
      if (webResult?.url) {
        const ok = await downloadImage(webResult.url, imgPath);
        if (ok) {
          console.log(`  ✓ Baixada (${webResult.source}): ${imgName} — ${knownAsset.name}`);
          return { name: imgName, source: webResult.source, asset: knownAsset.name };
        }
      }

      // 2. Fallback: Pexels com termos relacionados
      const pexelsPhotos = await searchPexels(knownAsset.search);
      if (pexelsPhotos.length > 0) {
        const photoUrl = pexelsPhotos[0].src?.large2x || pexelsPhotos[0].src?.large || pexelsPhotos[0].src?.original;
        if (photoUrl) {
          const ok = await downloadImage(photoUrl, imgPath);
          if (ok) {
            console.log(`  ✓ Baixada (Pexels fallback): ${imgName} — ${knownAsset.name}`);
            return { name: imgName, source: 'pexels', asset: knownAsset.name };
          }
        }
      }

      // 3. Último fallback: Unsplash random
      const unsplashUrl = `https://source.unsplash.com/1080x1350/?${encodeURIComponent(knownAsset.search)}`;
      const unsplashOk = await downloadImage(unsplashUrl, imgPath);
      if (unsplashOk) {
        console.log(`  ✓ Baixada (Unsplash random): ${imgName} — ${knownAsset.name}`);
        return { name: imgName, source: 'unsplash', asset: knownAsset.name };
      }

      console.log(`  ✗ Não conseguiu imagem para ${knownAsset.name}. Busque manualmente.`);
      return { name: imgName, source: 'manual', asset: knownAsset.name };

    } else if (knownAsset.type === 'logo') {
      // Logo/marca → gerar SVG ou indicar asset local
      console.log(`  🏷  Marca detectada: ${knownAsset.name} (cor: ${knownAsset.color})`);
      return { name: imgName, source: 'logo', asset: knownAsset };
    }
  }

  // 2. Busca padrão no Pexels
  const keywords = extractKeywords(slideText);
  console.log(`  🔍 Pexels: "${keywords}" → ${imgName}`);

  const photos = await searchPexels(keywords);

  if (photos.length > 0) {
    const photoUrl = photos[0].src?.large2x || photos[0].src?.large || photos[0].src?.original;
    if (photoUrl) {
      const ok = await downloadImage(photoUrl, imgPath);
      if (ok) {
        console.log(`  ✓ Baixada (Pexels): ${imgName} — ${photos[0].photographer}`);
        return { name: imgName, source: 'pexels', photographer: photos[0].photographer };
      }
    }
  }

  // 3. Fallback: busca na web
  console.log(`  ⚠ Nada no Pexels. Gerando URLs de busca alternativa...`);
  const webResults = await searchWeb(keywords);
  console.log(`    Pexels: ${webResults.pexelsUrl}`);
  console.log(`    Unsplash: ${webResults.unsplashUrl}`);
  console.log(`    Google (CC): ${webResults.searchUrl}`);

  return { name: imgName, source: 'manual', urls: webResults };
}

// ═══════════════════════════════════════════════════════════════
// GERADOR DE IMAGEM PLACEHOLDER (sem API)
// ═══════════════════════════════════════════════════════════════

// Detectar se imagem provavelmente tem rosto humano (por keywords)
const PERSON_KEYWORDS = [
  'pessoa', 'homem', 'mulher', 'profissional', 'freelancer', 'equipe',
  'time', 'mentorado', 'cliente', 'você', 'eu ', 'abri', 'voltei',
  'minha', 'olhei', 'sentei', 'tomando café', 'no teclado', 'trabalha',
  'contratei', 'social media', 'estagiário', 'dono',
];

function needsFaceSwap(slideText) {
  const lower = slideText.toLowerCase();

  // Não fazer face swap em pessoas conhecidas
  for (const [key, asset] of Object.entries(KNOWN_ASSETS)) {
    if (lower.includes(key) && asset.type === 'person') {
      return false;
    }
  }

  // Detectar se o texto sugere presença de pessoa
  for (const kw of PERSON_KEYWORDS) {
    if (lower.includes(kw)) return true;
  }
  return false;
}

function generateImageManifest(carrossel, outputDir) {
  const manifest = {
    carrossel: carrossel.num,
    titulo: carrossel.titulo,
    slides: [],
  };

  for (const slide of carrossel.slides) {
    const keywords = extractKeywords(slide.text);
    const faceSwap = needsFaceSwap(slide.text);
    manifest.slides.push({
      slide: slide.num,
      text: slide.text.substring(0, 80) + '...',
      keywords,
      searchUrl: `https://www.pexels.com/search/${encodeURIComponent(keywords)}/`,
      image: `c${String(carrossel.num).padStart(2, '0')}-s${String(slide.num).padStart(2, '0')}.jpg`,
      needsFaceSwap: faceSwap,
      faceSwapNote: faceSwap ? '→ Substituir rosto por face_reference do visual-identity.yaml via Nano Banana' : null,
    });
  }

  return manifest;
}

// ═══════════════════════════════════════════════════════════════
// TEMPLATES HTML
// ═══════════════════════════════════════════════════════════════

const TEMPLATE_CONFIGS = {
  'modelo-01': {
    name: 'Modelo 01 — Editorial Magazine',
    brand: 'igreja-castelo-forte',
    hookStyle: 'fullbleed-serif',
    colors: {
      bg_light: '#f5f5f5',
      bg_dark: '#040416',
      text_dark: '#040416',
      text_light: '#f5f5f5',
      accent: '#2B7DE1',
      subtitle: '#2B7DE1',
      highlight: '#fcffd5',
      destaque_bg: '#2B7DE1',
    },
  },
  'modelo-05': {
    name: 'Modelo 05 — Sci-Fi Noise',
    brand: 'igreja-castelo-forte',
    hookStyle: 'noise-uppercase',
    colors: {
      bg_dark: '#343434',
      text_light: '#fff',
      accent: '#2B7DE1',
      subtitle: '#DDE4EC',
      secondary_bg: '#003A70',
    },
  },
  'twitter-dark': {
    name: 'Twitter Dark',
    brand: 'igreja-castelo-forte',
    hookStyle: 'tweet-impact',
    colors: {
      bg: '#000',
      text: '#fff',
      accent: '#2B7DE1',
      handle: '#DDE4EC',
    },
  },
  'claude-01': {
    name: 'Claude Code 01 — Editorial Magazine',
    brand: 'claude-code',
    hookStyle: 'fullbleed-serif',
    colors: {
      bg_light: '#FAF9F5',
      bg_dark: '#141413',
      text_dark: '#3D3929',
      text_light: '#FAF9F5',
      accent: '#D97757',
      subtitle: '#D97757',
      highlight: '#D97757',
      destaque_bg: '#D97757',
    },
  },
  'claude-02': {
    name: 'Claude Code 02 — Dark Editorial',
    brand: 'claude-code',
    hookStyle: 'fixture-uppercase',
    colors: {
      bg_dark: '#141413',
      bg_light: '#FAF9F5',
      text_dark: '#3D3929',
      text_light: '#FAF9F5',
      accent: '#D97757',
      subtitle: '#B0AEA5',
    },
  },
  'claude-05': {
    name: 'Claude Code 05 — Warm Noise',
    brand: 'claude-code',
    hookStyle: 'noise-warm',
    colors: {
      bg_dark: '#141413',
      bg_light: '#FAF9F5',
      text_light: '#FAF9F5',
      accent: '#D97757',
      subtitle: '#B0AEA5',
      secondary_bg: '#5C2E1A',
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║  render-carrossel — Renderizador de Carrosséis (Zero LLM)  ║
╚══════════════════════════════════════════════════════════════╝

Uso:
  node scripts/render-carrossel.mjs <arquivo.md> --template <modelo> [opções]

Templates:
  modelo-01      Editorial Magazine (Castelo Forte)
  modelo-05      Sci-Fi Noise (Castelo Forte)
  twitter-dark   Twitter Dark (Castelo Forte)
  claude-01      Claude Code Editorial Magazine
  claude-02      Claude Code Dark Editorial
  claude-05      Claude Code Warm Noise

Opções:
  --template <nome>     Template a usar (obrigatório)
  --output <pasta>      Pasta de saída (default: outputs/multiplicar)
  --carrossel <num>     Renderizar apenas 1 carrossel específico
  --manifest-only       Só gerar manifesto de imagens (sem baixar)
  --no-images           Gerar HTML sem buscar imagens (placeholders)

Variáveis de ambiente:
  PEXELS_API_KEY        Chave da API Pexels (gratuita: pexels.com/api)

Exemplos:
  node scripts/render-carrossel.mjs copys/v2.md --template modelo-01
  node scripts/render-carrossel.mjs copys/v2.md --template claude-01 --carrossel 3
  node scripts/render-carrossel.mjs copys/v2.md --template twitter-dark --manifest-only
`);
    process.exit(0);
  }

  const mdFile = args[0];
  const templateName = args[args.indexOf('--template') + 1];
  const outputDir = args.includes('--output') ? args[args.indexOf('--output') + 1] : DEFAULT_OUTPUT;
  const singleCarrossel = args.includes('--carrossel') ? parseInt(args[args.indexOf('--carrossel') + 1]) : null;
  const manifestOnly = args.includes('--manifest-only');
  const noImages = args.includes('--no-images');

  // Validações
  if (!fs.existsSync(mdFile)) {
    console.error(`✗ Arquivo não encontrado: ${mdFile}`);
    process.exit(1);
  }

  if (!templateName || !TEMPLATE_CONFIGS[templateName]) {
    console.error(`✗ Template inválido: ${templateName}`);
    console.error(`  Disponíveis: ${Object.keys(TEMPLATE_CONFIGS).join(', ')}`);
    process.exit(1);
  }

  const config = TEMPLATE_CONFIGS[templateName];
  console.log(`\n🎨 Template: ${config.name}`);
  console.log(`📄 Arquivo: ${mdFile}`);

  // Parse markdown
  const content = fs.readFileSync(mdFile, 'utf-8');
  const carrosseis = parseMarkdown(content);
  console.log(`📦 ${carrosseis.length} carrosséis encontrados\n`);

  // Filtrar se pediu apenas 1
  const toRender = singleCarrossel
    ? carrosseis.filter(c => c.num === singleCarrossel)
    : carrosseis;

  if (toRender.length === 0) {
    console.error(`✗ Carrossel ${singleCarrossel} não encontrado`);
    process.exit(1);
  }

  // Criar pasta de output
  const carrosselDir = path.join(outputDir, templateName);
  const imagesDir = path.join(outputDir, 'images');
  fs.mkdirSync(carrosselDir, { recursive: true });
  fs.mkdirSync(imagesDir, { recursive: true });

  // Processar cada carrossel
  for (const carrossel of toRender) {
    console.log(`\n━━━ Carrossel ${String(carrossel.num).padStart(2, '0')} — ${carrossel.titulo} ━━━`);

    // Gerar manifesto de imagens
    const manifest = generateImageManifest(carrossel, outputDir);

    if (manifestOnly) {
      const manifestPath = path.join(carrosselDir, `carrossel-${String(carrossel.num).padStart(2, '0')}-manifest.json`);
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log(`  📋 Manifesto salvo: ${manifestPath}`);

      // Mostrar URLs de busca para o usuário
      console.log(`\n  Imagens para buscar manualmente:`);
      for (const s of manifest.slides) {
        console.log(`    S${s.slide}: ${s.searchUrl}`);
      }
      continue;
    }

    // Buscar imagens
    if (!noImages) {
      console.log(`  🖼  Buscando imagens...`);
      for (const slide of carrossel.slides) {
        await fetchImageForSlide(slide.text, carrossel.num, slide.num, outputDir);
        // Rate limit: 200 req/h no Pexels = 1 a cada 18s, mas na prática é mais rápido
        await new Promise(r => setTimeout(r, 500));
      }
    }

    console.log(`  ✓ Carrossel ${carrossel.num} processado`);
  }

  console.log(`\n✅ Concluído. Output em: ${carrosselDir}`);

  if (!PEXELS_API_KEY && !noImages && !manifestOnly) {
    console.log(`\n⚠  Sem PEXELS_API_KEY configurada.`);
    console.log(`   Para buscar imagens automaticamente:`);
    console.log(`   1. Crie conta grátis em pexels.com/api`);
    console.log(`   2. export PEXELS_API_KEY="sua-chave"`);
    console.log(`   3. Rode novamente\n`);
    console.log(`   Alternativa: use --manifest-only para ver URLs de busca manual`);
  }
}

main().catch(console.error);
