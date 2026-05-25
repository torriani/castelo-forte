// Lê o markdown da campanha Em Cristo e popula a coluna `legenda` dos 21 carrosseis
import fs from "node:fs";
import path from "node:path";
import { sb } from "./_supabase.mjs";

const MD = path.resolve(
  process.env.HOME,
  "claude/outputs/multiplicar/efesios-encarnado/CAMPANHA-ANTECIPACAO-21-DIAS.md",
);
const txt = fs.readFileSync(MD, "utf8");

// quebra por ### #NN — ... —
const re = /^### #(\d{2}) — (.+?) — (.+?)$/gm;
const blocos = [];
let m, posAnt = -1, tituloAnt = null, numAnt = null, dataAnt = null;
while ((m = re.exec(txt)) !== null) {
  if (posAnt >= 0) {
    blocos.push({ num: numAnt, data: dataAnt, titulo: tituloAnt, conteudo: txt.slice(posAnt, m.index) });
  }
  posAnt = m.index + m[0].length;
  numAnt = m[1];
  dataAnt = m[2].trim();
  tituloAnt = m[3].trim();
}
if (posAnt >= 0) {
  // último bloco vai até proxima ## (ou fim)
  const corte = txt.indexOf("\n## ", posAnt);
  blocos.push({ num: numAnt, data: dataAnt, titulo: tituloAnt, conteudo: corte >= 0 ? txt.slice(posAnt, corte) : txt.slice(posAnt) });
}

console.log(`[importar] ${blocos.length} blocos identificados`);

function montaLegenda(b) {
  // extrai partes do conteudo (premissa, triade, sintese, aplicacao, cta+verso)
  const c = b.conteudo;
  const seg = (label) => {
    const r = new RegExp(`\\*\\*\\[\\d+\\] ${label}\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*\\[|\\n---|$)`, "i");
    const mm = c.match(r);
    return mm ? mm[1].trim() : "";
  };
  const premissa = seg("PREMISSA");
  const triade = seg("TR.ADE"); // tríade
  const sintese = seg("S.NTESE"); // síntese
  const aplicacao = seg("APLICA..O"); // aplicação
  const cta = seg("CTA \\+ VERSO");

  const partes = [];
  if (premissa) partes.push(premissa);
  if (triade) partes.push("");
  if (triade) partes.push(triade);
  if (sintese) {
    partes.push("");
    partes.push(sintese);
  }
  if (aplicacao) {
    partes.push("");
    partes.push(aplicacao);
  }
  if (cta) {
    partes.push("");
    partes.push(cta);
  }
  partes.push("");
  partes.push("---");
  partes.push("#emcristo #efésios #casteloforte #jurere #igreja");
  return partes.join("\n").trim();
}

let updated = 0;
for (const b of blocos) {
  const legenda = montaLegenda(b);
  const identificador = `carrossel-dia-${b.num}`;
  const { error, count } = await sb
    .from("aprovacao_posts")
    .update({ legenda })
    .eq("cliente_slug", "castelo-forte")
    .eq("identificador", identificador)
    .select("id", { count: "exact" });
  if (error) {
    console.error(`  erro ${identificador}:`, error.message);
  } else {
    console.log(`  ${identificador} ← ${legenda.length} chars`);
    updated += count || 0;
  }
}
console.log(`\n[importar] ${updated} carrosseis atualizados`);
