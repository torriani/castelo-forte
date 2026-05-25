// /aprovacoes-publicar {cliente}
// Escaneia portal do cliente, faz upsert dos posts no Supabase
import fs from "node:fs";
import path from "node:path";
import { sb } from "./_supabase.mjs";

const cliente = process.argv[2];
if (!cliente) {
  console.error("uso: node publicar.mjs {cliente}");
  process.exit(1);
}

const DISCOVERY = {
  "castelo-forte": discoverCasteloForte,
};

if (!DISCOVERY[cliente]) {
  console.error(`cliente desconhecido: ${cliente}. Suportados: ${Object.keys(DISCOVERY).join(", ")}`);
  process.exit(1);
}

const PORTAL_ROOT = path.resolve(
  process.env.HOME,
  "claude/apps/conteudo",
);

function discoverCasteloForte() {
  const posts = [];
  let ordem = 0;

  // 21 carrosseis (cf-carrosseis/dia-NN/*.png)
  const carrosselsRoot = path.join(PORTAL_ROOT, "img/cf-carrosseis");
  if (fs.existsSync(carrosselsRoot)) {
    const dias = fs.readdirSync(carrosselsRoot).filter((d) => d.startsWith("dia-")).sort();
    for (const dia of dias) {
      const dir = path.join(carrosselsRoot, dia);
      const slides = fs.readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
      if (!slides.length) continue;
      posts.push({
        identificador: `carrossel-${dia}`,
        titulo: `Carrossel ${dia.replace("dia-", "Dia ")}`,
        tipo: "carrossel",
        imagens: slides.map((s) => `/img/cf-carrosseis/${dia}/${s}`),
        legenda: null,
        ordem: ordem++,
      });
    }
  }

  // 21 frases literais
  const literaisRoot = path.join(PORTAL_ROOT, "img/cf-frases-literais");
  if (fs.existsSync(literaisRoot)) {
    const fs2 = fs.readdirSync(literaisRoot).filter((f) => f.endsWith(".png")).sort();
    for (const f of fs2) {
      const num = f.match(/frase-(\d+)/)?.[1] || "00";
      posts.push({
        identificador: `frase-literal-${num}`,
        titulo: `Frase literal · ${num}`,
        tipo: "frase-literal",
        imagens: [`/img/cf-frases-literais/${f}`],
        legenda: null,
        ordem: ordem++,
      });
    }
  }

  // 21 frases autorais
  const autoraisRoot = path.join(PORTAL_ROOT, "img/cf-frases-autorais");
  if (fs.existsSync(autoraisRoot)) {
    const fs2 = fs.readdirSync(autoraisRoot).filter((f) => f.endsWith(".png")).sort();
    for (const f of fs2) {
      const num = f.match(/frase-(\d+)/)?.[1] || "00";
      posts.push({
        identificador: `frase-autoral-${num}`,
        titulo: `Frase autoral · ${num}`,
        tipo: "frase-autoral",
        imagens: [`/img/cf-frases-autorais/${f}`],
        legenda: null,
        ordem: ordem++,
      });
    }
  }

  return posts;
}

async function main() {
  const posts = DISCOVERY[cliente]();
  console.log(`[aprovacoes] descobertos ${posts.length} posts para ${cliente}`);

  let inseridos = 0;
  let atualizados = 0;
  for (const p of posts) {
    const { data: existente } = await sb
      .from("aprovacao_posts")
      .select("id, imagens, titulo, ordem")
      .eq("cliente_slug", cliente)
      .eq("identificador", p.identificador)
      .maybeSingle();

    if (existente) {
      const novasImgs = JSON.stringify(p.imagens);
      const oldImgs = JSON.stringify(existente.imagens || []);
      if (novasImgs !== oldImgs || existente.titulo !== p.titulo || existente.ordem !== p.ordem) {
        await sb
          .from("aprovacao_posts")
          .update({ imagens: p.imagens, titulo: p.titulo, ordem: p.ordem, tipo: p.tipo, legenda: p.legenda })
          .eq("id", existente.id);
        atualizados++;
      }
    } else {
      const { error } = await sb.from("aprovacao_posts").insert({ ...p, cliente_slug: cliente });
      if (error) {
        console.error(`erro insert ${p.identificador}:`, error.message);
      } else {
        inseridos++;
      }
    }
  }

  console.log(`[aprovacoes] ${inseridos} inseridos, ${atualizados} atualizados`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
