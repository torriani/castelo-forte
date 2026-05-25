#!/usr/bin/env node
// build-catalogo.mjs
// Gera templates/CATALOGO.html lendo:
//   - templates/catalog.yaml (todos os templates oficiais)
//   - workspace/businesses/*/brand/templates.yaml (mapas por cliente)
// Zero deps. Parser YAML simples adequado ao formato canônico do squad.

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SQUAD_ROOT = resolve(__dirname, '..');
const WORKSPACE_BUSINESSES = resolve(SQUAD_ROOT, '../workspace/businesses');
const CATALOG_PATH = join(SQUAD_ROOT, 'templates/catalog.yaml');
const OUTPUT_PATH = join(SQUAD_ROOT, 'templates/CATALOGO.html');

// ---------- YAML parser mínimo (suficiente para os yamls deste squad) ----------
function parseYAML(text) {
  const lines = text.split('\n');
  const root = {};
  const stack = [{ indent: -1, node: root, key: null }];

  const inlineArray = (val) => {
    const inner = val.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((s) => stripQuotes(s.trim()));
  };
  const stripQuotes = (s) => {
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
      return s.slice(1, -1);
    }
    return s;
  };
  const parseScalar = (val) => {
    val = val.trim();
    if (val === '') return null;
    if (val.startsWith('[') && val.endsWith(']')) return inlineArray(val);
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (/^-?\d+$/.test(val)) return parseInt(val, 10);
    return stripQuotes(val);
  };

  for (let raw of lines) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const m = raw.match(/^(\s*)(.*)$/);
    const indent = m[1].length;
    let content = m[2];
    if (content.includes(' #')) content = content.split(' #')[0].trim();

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].node;

    // Item de array "- valor" ou "- chave: valor"
    if (content.startsWith('- ')) {
      const item = content.slice(2).trim();
      if (!Array.isArray(parent.__list)) parent.__list = [];
      if (item.includes(':')) {
        // objeto inline tipo "- chave: valor" — não usamos no formato atual
        const obj = {};
        const [k, ...rest] = item.split(':');
        obj[k.trim()] = parseScalar(rest.join(':'));
        parent.__list.push(obj);
      } else {
        parent.__list.push(stripQuotes(item));
      }
      continue;
    }

    const colonIdx = content.indexOf(':');
    if (colonIdx === -1) continue;
    const key = content.slice(0, colonIdx).trim();
    const value = content.slice(colonIdx + 1);

    if (value.trim() === '') {
      const node = {};
      parent[key] = node;
      stack.push({ indent, node, key });
    } else {
      parent[key] = parseScalar(value);
    }
  }

  // Converter __list em arrays normais
  const fixLists = (obj) => {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      if (Array.isArray(obj.__list)) return obj.__list;
      for (const k of Object.keys(obj)) obj[k] = fixLists(obj[k]);
    }
    return obj;
  };
  return fixLists(root);
}

// ---------- Coletar dados ----------
function loadCatalog() {
  const raw = readFileSync(CATALOG_PATH, 'utf8');
  const data = parseYAML(raw);
  const templates = data.templates || {};
  const families = data.families || {};
  return { templates, families };
}

function loadClients() {
  const clients = {};
  if (!existsSync(WORKSPACE_BUSINESSES)) return clients;
  const entries = readdirSync(WORKSPACE_BUSINESSES);
  for (const slug of entries) {
    const dir = join(WORKSPACE_BUSINESSES, slug);
    if (!statSync(dir).isDirectory()) continue;
    if (slug.startsWith('.')) continue;
    const yamlPath = join(dir, 'brand/templates.yaml');
    if (!existsSync(yamlPath)) {
      clients[slug] = { configured: false };
      continue;
    }
    try {
      const data = parseYAML(readFileSync(yamlPath, 'utf8'));
      clients[slug] = {
        configured: true,
        default: data.default || null,
        permitidos: Array.isArray(data.permitidos) ? data.permitidos : [],
        notas: Array.isArray(data.notas) ? data.notas : [],
      };
    } catch (e) {
      clients[slug] = { configured: false, error: e.message };
    }
  }
  return clients;
}

// ---------- Render HTML ----------
function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function familyColor(fam) {
  const map = {
    imperial: '#5a3a8a',
    twitter: '#1a6a8a',
    claude: '#a04a2a',
    'castelo-forte': '#c9551e',
  };
  return map[fam] || '#444';
}

function renderCard(id, tpl, clientDefaults) {
  const isDefaultFor = Object.entries(clientDefaults)
    .filter(([, c]) => c.configured && c.default === id)
    .map(([slug]) => slug);
  const usedBy = Object.entries(clientDefaults)
    .filter(([, c]) => c.configured && Array.isArray(c.permitidos) && c.permitidos.includes(id))
    .map(([slug]) => slug);

  const fam = tpl.family || 'outros';
  const showcase = tpl.showcase || '';
  const showcaseRel = showcase.replace(/^templates\//, '');
  const tags = Array.isArray(tpl.tags) ? tpl.tags : [];
  const layouts = Array.isArray(tpl.layouts) ? tpl.layouts : null;
  const aliases = Array.isArray(tpl.aliases) ? tpl.aliases : [];

  return `
  <div class="card" data-fam="${escapeHtml(fam)}" data-id="${escapeHtml(id)}" data-clients="${escapeHtml(usedBy.join(','))}">
    <div class="meta">
      <span class="id" style="background:${familyColor(fam)}">${escapeHtml(id)}</span><span class="title">${escapeHtml(tpl.title || tpl.name || id)}</span>
      <div class="family">Família: ${escapeHtml(fam)}${tpl.slides ? ' · ' + tpl.slides + ' slides' : ''}${layouts ? ' · ' + layouts.length + ' layouts' : ''}</div>
      <div class="desc">${escapeHtml(tpl.description || '')}</div>
      ${aliases.length ? `<div class="aliases">Aliases: ${aliases.map((a) => `<code>${escapeHtml(a)}</code>`).join(', ')}</div>` : ''}
      ${isDefaultFor.length ? `<div class="badge default">DEFAULT: ${isDefaultFor.map(escapeHtml).join(', ')}</div>` : ''}
      ${usedBy.length ? `<div class="badge">Usado por: ${usedBy.map(escapeHtml).join(', ')}</div>` : ''}
      ${tags.length ? `<div class="tags">${tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
    </div>
    ${showcase ? `<iframe src="${escapeHtml(showcaseRel)}" loading="lazy"></iframe>` : '<div class="no-preview">sem showcase</div>'}
    <div class="actions">
      ${showcase ? `<a href="${escapeHtml(showcaseRel)}" target="_blank">abrir ↗</a>` : ''}
      <code>name: ${escapeHtml(tpl.name || '')}</code>
    </div>
  </div>`;
}

function renderHTML({ templates, families }, clients) {
  const total = Object.keys(templates).length;
  const famCount = {};
  for (const t of Object.values(templates)) {
    const f = t.family || 'outros';
    famCount[f] = (famCount[f] || 0) + 1;
  }

  // botões família
  const famButtons = ['all', ...Object.keys(famCount)]
    .map((f) => {
      const count = f === 'all' ? total : famCount[f];
      const label = f === 'all' ? `Todos (${total})` : `${f} (${count})`;
      return `<button class="${f === 'all' ? 'active' : ''}" data-fam="${escapeHtml(f)}">${escapeHtml(label)}</button>`;
    })
    .join('');

  // botões cliente
  const clientSlugs = Object.keys(clients).sort();
  const clientButtons = [
    `<button class="active" data-client="all">Todos clientes</button>`,
    ...clientSlugs.map((slug) => {
      const c = clients[slug];
      const mark = c.configured ? '✓' : '⚠';
      const tip = c.configured ? `${(c.permitidos || []).length} templates · default: ${c.default || 'nenhum'}` : 'sem templates.yaml';
      const disabled = c.configured ? '' : 'disabled';
      return `<button data-client="${escapeHtml(slug)}" ${disabled} title="${escapeHtml(tip)}">${mark} ${escapeHtml(slug)}</button>`;
    }),
  ].join('');

  const cards = Object.entries(templates)
    .map(([id, tpl]) => renderCard(id, tpl, clients))
    .join('\n');

  // Linha de aviso pros clientes sem templates.yaml
  const unconfigured = clientSlugs.filter((s) => !clients[s].configured);
  const warning = unconfigured.length
    ? `<div class="warn">⚠ Sem templates.yaml: <b>${unconfigured.map(escapeHtml).join(', ')}</b>. Crie <code>workspace/businesses/{cliente}/brand/templates.yaml</code> espelhando o do castelo-forte.</div>`
    : '';

  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');

  return `<!doctype html>
<html lang="pt-br">
<head>
<meta charset="utf-8" />
<title>Catálogo de Templates — Squad Conteúdo</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin:0; background:#0a0a0a; color:#eee; font:14px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif; }
  header { position:sticky; top:0; background:#000; padding:18px 28px; border-bottom:1px solid #222; z-index:10; }
  header h1 { margin:0 0 4px; font-size:18px; font-weight:600; }
  header p { margin:0; color:#888; font-size:13px; }
  .filters { padding:14px 28px 0; }
  .filters .row { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px; align-items:center; }
  .filters .label { font-size:11px; color:#666; text-transform:uppercase; letter-spacing:0.08em; min-width:80px; }
  .filters button { background:#111; border:1px solid #222; color:#ccc; padding:6px 14px; border-radius:6px; font-size:12px; cursor:pointer; transition:all .12s; }
  .filters button:hover:not(:disabled) { border-color:#555; }
  .filters button.active { background:#fff; color:#000; border-color:#fff; }
  .filters button:disabled { opacity:0.3; cursor:not-allowed; }
  .warn { margin:14px 28px 0; padding:10px 14px; background:#2a1a0a; border:1px solid #5a3a1a; border-radius:6px; font-size:12px; color:#c89a5a; }
  .warn code { font-family:"SF Mono",monospace; color:#fff; }
  .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(440px, 1fr)); gap:20px; padding:24px 28px 40px; }
  .card { background:#111; border:1px solid #222; border-radius:8px; overflow:hidden; display:flex; flex-direction:column; transition:border-color .15s; }
  .card:hover { border-color:#444; }
  .card.hidden { display:none; }
  .meta { padding:14px 16px; border-bottom:1px solid #222; }
  .id { display:inline-block; color:#fff; padding:3px 9px; border-radius:4px; font-weight:600; font-size:12px; margin-right:8px; letter-spacing:0.03em; }
  .title { font-weight:600; font-size:14px; display:inline; }
  .family { font-size:11px; color:#999; text-transform:uppercase; letter-spacing:0.05em; margin-top:6px; }
  .desc { font-size:12px; color:#aaa; margin-top:6px; line-height:1.45; }
  .aliases { font-size:11px; color:#777; margin-top:6px; }
  .aliases code { background:#1a1a1a; padding:1px 5px; border-radius:3px; font-family:"SF Mono",monospace; color:#9cf; }
  .badge { display:inline-block; margin-top:8px; margin-right:6px; padding:2px 8px; background:#1a2a3a; color:#9cf; border-radius:3px; font-size:11px; }
  .badge.default { background:#1a3a1a; color:#9fc; }
  .tags { margin-top:8px; display:flex; gap:6px; flex-wrap:wrap; }
  .tag { background:#1a1a1a; color:#777; font-size:10px; padding:2px 8px; border-radius:3px; }
  iframe { width:100%; height:520px; border:0; background:#fff; }
  .no-preview { padding:40px; text-align:center; color:#444; background:#0a0a0a; }
  .actions { padding:10px 16px; display:flex; gap:14px; border-top:1px solid #222; font-size:12px; }
  .actions a { color:#4af; text-decoration:none; }
  .actions code { color:#888; font-family:"SF Mono",monospace; font-size:11px; }
  footer { padding:14px 28px; color:#444; font-size:11px; text-align:center; border-top:1px solid #1a1a1a; }
</style>
</head>
<body>
<header>
  <h1>Catálogo de Templates — Squad Conteúdo</h1>
  <p>${total} templates oficiais. Use o ID (ex: <code>T03</code>) ao pedir um carrossel.</p>
</header>

<div class="filters">
  <div class="row"><span class="label">Família</span>${famButtons}</div>
  <div class="row"><span class="label">Cliente</span>${clientButtons}</div>
</div>

${warning}

<div class="grid" id="grid">
${cards}
</div>

<footer>Gerado em ${now} · <code>scripts/build-catalogo.mjs</code></footer>

<script>
  let activeFam = 'all';
  let activeClient = 'all';

  function applyFilters() {
    document.querySelectorAll('.card').forEach((c) => {
      const famOk = activeFam === 'all' || c.dataset.fam === activeFam;
      const clientOk = activeClient === 'all' || (c.dataset.clients || '').split(',').includes(activeClient);
      c.classList.toggle('hidden', !(famOk && clientOk));
    });
  }

  document.querySelectorAll('.filters [data-fam]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filters [data-fam]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFam = btn.dataset.fam;
      applyFilters();
    });
  });

  document.querySelectorAll('.filters [data-client]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      document.querySelectorAll('.filters [data-client]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeClient = btn.dataset.client;
      applyFilters();
    });
  });
</script>
</body>
</html>
`;
}

// ---------- Run ----------
function main() {
  console.log('📖 Lendo catalog.yaml...');
  const catalog = loadCatalog();
  const tplCount = Object.keys(catalog.templates).length;
  console.log(`   ${tplCount} templates encontrados`);

  console.log('📖 Lendo workspace/businesses/*/brand/templates.yaml...');
  const clients = loadClients();
  const configured = Object.entries(clients).filter(([, c]) => c.configured);
  const unconfigured = Object.entries(clients).filter(([, c]) => !c.configured);
  console.log(`   ${configured.length} clientes configurados: ${configured.map(([s]) => s).join(', ')}`);
  if (unconfigured.length) {
    console.log(`   ${unconfigured.length} sem templates.yaml: ${unconfigured.map(([s]) => s).join(', ')}`);
  }

  console.log('🛠  Gerando CATALOGO.html...');
  const html = renderHTML(catalog, clients);
  writeFileSync(OUTPUT_PATH, html, 'utf8');
  console.log(`✅ ${OUTPUT_PATH}`);
}

main();
