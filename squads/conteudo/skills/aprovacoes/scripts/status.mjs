// /aprovacoes-status {cliente}
import { sb } from "./_supabase.mjs";

const cliente = process.argv[2];
if (!cliente) {
  console.error("uso: node status.mjs {cliente}");
  process.exit(1);
}

const { data: posts } = await sb
  .from("aprovacao_posts")
  .select("id, identificador, titulo, tipo")
  .eq("cliente_slug", cliente)
  .order("ordem");
const { data: decisoes } = await sb.from("aprovacao_decisoes").select("*");
const decByPost = Object.fromEntries((decisoes || []).map((d) => [d.post_id, d]));

let pend = 0, aprov = 0, ajust = 0, rep = 0, corr = 0;
const pendCorr = [];
for (const p of posts || []) {
  const d = decByPost[p.id];
  if (!d) pend++;
  else if (d.status === "aprovado") aprov++;
  else if (d.status === "ajustar") {
    ajust++;
    if (d.corrigido) corr++;
    else pendCorr.push({ ...p, status: d.status, observacao: d.observacao, aprovador: d.nome_aprovador });
  } else if (d.status === "reprovado") {
    rep++;
    if (d.corrigido) corr++;
    else pendCorr.push({ ...p, status: d.status, observacao: d.observacao, aprovador: d.nome_aprovador });
  }
}

console.log(`\n=== APROVAÇÕES · ${cliente} ===`);
console.log(`Total: ${posts?.length || 0}`);
console.log(`  pendentes:  ${pend}`);
console.log(`  aprovados:  ${aprov}`);
console.log(`  ajustar:    ${ajust}`);
console.log(`  reprovados: ${rep}`);
console.log(`  ----`);
console.log(`  já corrigidos: ${corr}`);
console.log("");
if (pendCorr.length) {
  console.log(`--- Aguardando correção (${pendCorr.length}) ---`);
  for (const p of pendCorr) {
    console.log(`  [${p.status.toUpperCase()}] ${p.identificador} — ${p.titulo}`);
    if (p.aprovador) console.log(`    aprovador: ${p.aprovador}`);
    if (p.observacao) console.log(`    "${p.observacao}"`);
  }
} else {
  console.log("nada pendente de correção.");
}
