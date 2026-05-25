// Injeta <script src="/assets/sub-menu.js"></script> em todas as paginas de /conteudo/maio/
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(
  process.env.HOME,
  "claude/apps/conteudo/conteudo/maio",
);

const FILES = [
  "index.html",
  "calendario/index.html",
  "inteligencia/index.html",
  "carrosseis/index.html",
  "frases/index.html",
  "reels/index.html",
  "templates/index.html",
  "plano/index.html",
];

const TAG = '<script defer src="/assets/sub-menu.js"></script>';

for (const rel of FILES) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) continue;
  let html = fs.readFileSync(full, "utf8");
  if (html.includes('/assets/sub-menu.js')) {
    console.log(`[noop] ${rel}`);
    continue;
  }
  html = html.replace("</body>", `${TAG}\n</body>`);
  fs.writeFileSync(full, html);
  console.log(`[ok] ${rel}`);
}
