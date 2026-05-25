// Injeta data-aprovacao + CSS/JS do widget nas paginas de conteudo do Castelo Forte
// Idempotente.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.env.HOME, "claude/apps/conteudo");

const HEAD_INJECT = `
<link rel="stylesheet" href="/assets/aprovacao/inline.css">
`;
const BODY_INJECT = `
<script type="module" src="/assets/aprovacao/inline.js"></script>
`;

function processFile(file, identExtractor) {
  if (!fs.existsSync(file)) {
    console.log(`[skip] ${file} nao existe`);
    return;
  }
  let html = fs.readFileSync(file, "utf8");
  const orig = html;

  // injeta CSS no head se ainda nao tem
  if (!html.includes('href="/assets/aprovacao/inline.css"')) {
    html = html.replace("</head>", `${HEAD_INJECT}</head>`);
  }
  // injeta JS antes do </body>
  if (!html.includes('src="/assets/aprovacao/inline.js"')) {
    html = html.replace("</body>", `${BODY_INJECT}</body>`);
  }

  // injeta data-aprovacao em cada bloco
  html = identExtractor(html);

  if (html !== orig) {
    fs.writeFileSync(file, html);
    console.log(`[ok] ${path.relative(ROOT, file)}`);
  } else {
    console.log(`[noop] ${path.relative(ROOT, file)}`);
  }
}

// CARROSSEIS — match <div class="carrossel-block" id="dia-XX">
processFile(path.join(ROOT, "conteudo/maio/carrosseis/index.html"), (html) =>
  html.replace(
    /<div class="carrossel-block"\s+id="(dia-\d+)"(?!\s+data-aprovacao)/g,
    (_m, dia) => `<div class="carrossel-block" id="${dia}" data-aprovacao="carrossel-${dia}"`,
  ),
);

// FRASES — tem que descobrir o padrao no arquivo
// Vamos fazer pra frases-literais e autorais separadamente
const literaisFile = path.join(ROOT, "conteudo/maio/conteudo/frases-literais/index.html");
const autoraisFile = path.join(ROOT, "conteudo/maio/conteudo/frases-autorais/index.html");

function injectFrases(file, prefix) {
  processFile(file, (html) => {
    // padrao real: <div class="peca-card" id="p-NN">
    html = html.replace(
      /<div class="peca-card"\s+id="p-(\d+)"(?!\s+data-aprovacao)/g,
      (_m, n) => `<div class="peca-card" id="p-${n}" data-aprovacao="${prefix}-${n}"`,
    );
    return html;
  });
}
injectFrases(literaisFile, "frase-literal");
injectFrases(autoraisFile, "frase-autoral");

console.log("\nFeito.");
