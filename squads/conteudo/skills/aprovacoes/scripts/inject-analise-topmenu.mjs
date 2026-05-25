// Injeta link "Análise" no menu top de todas as páginas
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(
  process.env.HOME,
  "claude/apps/conteudo",
);

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (e.name.endsWith(".html")) files.push(full);
  }
  return files;
}

const files = walk(ROOT);
let changed = 0;

for (const f of files) {
  let html = fs.readFileSync(f, "utf8");
  const orig = html;

  // só toca em arquivos que têm o menu top
  if (!html.includes('<nav class="main-menu">')) continue;

  // se já tem o link Análise, pula
  if (/href="\/conteudo\/maio\/analise\/"[^>]*>An[áa]lise</.test(html)) continue;

  // injeta o <li> entre Cultos e Campanhas (ou no fim do <ul>)
  html = html.replace(
    /(<nav class="main-menu">[\s\S]*?<ul>)([\s\S]*?)(<\/ul>)/,
    (m, ini, conteudo, fim) => {
      // tenta inserir depois do link de "Campanhas"
      const novoConteudo = conteudo.includes('href="/conteudo/maio/analise/"')
        ? conteudo
        : conteudo + '\n      <li><a href="/conteudo/maio/analise/">Análise</a></li>\n    ';
      return ini + novoConteudo + fim;
    },
  );

  if (html !== orig) {
    fs.writeFileSync(f, html);
    changed++;
    console.log(`[ok] ${path.relative(ROOT, f)}`);
  }
}

console.log(`\n${changed} arquivos atualizados.`);
