// Atualiza sub-menu de todas as paginas /conteudo/maio/ pra nova hierarquia:
// Dashboard | Calendario | Inteligencia | Carrosseis | Frases | Reels | Templates | Plano
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(
  process.env.HOME,
  "claude/apps/conteudo/conteudo/maio",
);

const NEW_SUBMENU = (active) => `
    <ul>
      <li><a href="/conteudo/maio/" ${active === "dashboard" ? 'class="active"' : ""}>Dashboard</a></li>
      <li><a href="/conteudo/maio/calendario/" ${active === "calendario" ? 'class="active"' : ""}>Calendário</a></li>
      <li><a href="/conteudo/maio/inteligencia/" ${active === "inteligencia" ? 'class="active"' : ""}>Inteligência</a></li>
      <li><a href="/conteudo/maio/analise/" ${active === "analise" ? 'class="active"' : ""}>Análise</a></li>
      <li><a href="/conteudo/maio/carrosseis/" ${active === "carrosseis" ? 'class="active"' : ""}>Carrosséis</a></li>
      <li><a href="/conteudo/maio/frases/" ${active === "frases" ? 'class="active"' : ""}>Frases</a></li>
      <li><a href="/conteudo/maio/reels/" ${active === "reels" ? 'class="active"' : ""}>Reels</a></li>
      <li><a href="/conteudo/maio/templates/" ${active === "templates" ? 'class="active"' : ""}>Templates</a></li>
      <li><a href="/conteudo/maio/plano/" ${active === "plano" ? 'class="active"' : ""}>Plano</a></li>
    </ul>
`;

const PAGES = [
  { file: "index.html", active: "dashboard" },
  { file: "calendario/index.html", active: "calendario" },
  { file: "inteligencia/index.html", active: "inteligencia" },
  { file: "carrosseis/index.html", active: "carrosseis" },
  { file: "frases/index.html", active: "frases" },
  { file: "reels/index.html", active: "reels" },
  { file: "templates/index.html", active: "templates" },
  { file: "plano/index.html", active: "plano" },
  { file: "conteudo/index.html", active: "carrosseis" }, // legado
  { file: "conteudo/carrosseis/index.html", active: "carrosseis" }, // legado
  { file: "conteudo/frases-literais/index.html", active: "frases" }, // legado
  { file: "conteudo/frases-autorais/index.html", active: "frases" }, // legado
];

let alterados = 0;
for (const p of PAGES) {
  const full = path.join(ROOT, p.file);
  if (!fs.existsSync(full)) continue;
  let html = fs.readFileSync(full, "utf8");
  const orig = html;
  // substitui o <ul> dentro do <nav class="sub-menu">
  html = html.replace(
    /(<nav class="sub-menu">[\s\S]*?)<ul>[\s\S]*?<\/ul>/,
    (_m, prefix) => `${prefix}${NEW_SUBMENU(p.active).trim()}`,
  );
  if (html !== orig) {
    fs.writeFileSync(full, html);
    alterados++;
    console.log(`[ok] ${p.file}`);
  } else {
    console.log(`[noop] ${p.file}`);
  }
}
console.log(`\n${alterados} arquivos atualizados.`);
