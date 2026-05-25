// Remove tags <link rel="icon"> de todas as paginas /conteudo/maio/
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(
  process.env.HOME,
  "claude/apps/conteudo/conteudo/maio",
);

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith(".html")) {
      let html = fs.readFileSync(full, "utf8");
      const orig = html;
      // remove <link rel="icon" ...>
      html = html.replace(/<link[^>]*rel=["']icon["'][^>]*>\s*\n?/gi, "");
      // remove <link rel="shortcut icon" ...>
      html = html.replace(/<link[^>]*rel=["']shortcut icon["'][^>]*>\s*\n?/gi, "");
      if (html !== orig) {
        fs.writeFileSync(full, html);
        console.log(`[ok] ${path.relative(ROOT, full)}`);
      }
    }
  }
}

walk(ROOT);
console.log("\nfavicons removidos.");
