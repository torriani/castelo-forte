// /aprovacoes-corrigir {cliente}
// Lista os reprovados nao-corrigidos e gera relatorio markdown que o Claude Code usa
// pra aplicar correcoes manuais. Apos correcao manual, rodar com --marcar {id} pra marcar como corrigido.

import fs from "node:fs";
import path from "node:path";
import { sb } from "./_supabase.mjs";

const cliente = process.argv[2];
const marcarId = process.argv.includes("--marcar") ? process.argv[process.argv.indexOf("--marcar") + 1] : null;
const marcarErr = process.argv.includes("--erro") ? process.argv[process.argv.indexOf("--erro") + 1] : null;

if (!cliente) {
  console.error("uso: node corrigir.mjs {cliente}");
  console.error("     node corrigir.mjs {cliente} --marcar {post_id}");
  console.error("     node corrigir.mjs {cliente} --marcar {post_id} --erro 'mensagem'");
  process.exit(1);
}

if (marcarId) {
  const update = { corrigido: !marcarErr, erro_correcao: marcarErr || null };
  const { error } = await sb.from("aprovacao_decisoes").update(update).eq("post_id", marcarId);
  if (error) {
    console.error("erro:", error.message);
    process.exit(1);
  }
  console.log(`[aprovacoes] ${marcarErr ? "marcado erro" : "marcado corrigido"}: ${marcarId}`);
  process.exit(0);
}

const { data: posts } = await sb
  .from("aprovacao_posts")
  .select("id, identificador, titulo, tipo, imagens, legenda")
  .eq("cliente_slug", cliente);
const { data: decisoes } = await sb
  .from("aprovacao_decisoes")
  .select("*")
  .in("status", ["ajustar", "reprovado"])
  .eq("corrigido", false);

const postsById = Object.fromEntries((posts || []).map((p) => [p.id, p]));
const itens = (decisoes || [])
  .map((d) => ({ ...d, post: postsById[d.post_id] }))
  .filter((x) => x.post);

if (!itens.length) {
  console.log(`[aprovacoes] nada para corrigir em ${cliente}.`);
  process.exit(0);
}

const linhas = [];
linhas.push(`# Fila de correção — ${cliente}`);
linhas.push(`Gerado em ${new Date().toISOString()}`);
linhas.push("");
linhas.push(`${itens.length} itens para corrigir.\n`);

itens.forEach((it, i) => {
  linhas.push(`## ${i + 1}. ${it.post.titulo} (${it.post.tipo}) — ${it.status.toUpperCase()}`);
  linhas.push(`- post_id: ${it.post.id}`);
  linhas.push(`- identificador: ${it.post.identificador}`);
  linhas.push(`- aprovador: ${it.nome_aprovador || "?"} <${it.email_aprovador || "?"}>`);
  linhas.push(`- imagens:`);
  (it.post.imagens || []).forEach((src) => linhas.push(`  - ${src}`));
  linhas.push(`- observação do aprovador:`);
  linhas.push(`  > ${it.observacao || "(sem observação)"}`);
  linhas.push("");
  linhas.push(`Quando terminar de corrigir este item, rodar:`);
  linhas.push("```bash");
  linhas.push(`node ${path.resolve(import.meta.dirname || ".", "corrigir.mjs")} ${cliente} --marcar ${it.post.id}`);
  linhas.push("```");
  linhas.push("");
});

const outPath = path.resolve(
  process.env.HOME,
  `claude/apps/conteudo/.aprovacoes-fila-${cliente}.md`,
);
fs.writeFileSync(outPath, linhas.join("\n"));
console.log(`[aprovacoes] fila gerada: ${outPath}`);
console.log(`[aprovacoes] ${itens.length} itens. Aplica correção manual peça por peça e depois marca cada um com --marcar {post_id}.`);
console.log(`[aprovacoes] quando terminar tudo, faz redeploy: cd vercel-deploy && vercel --prod --yes`);
