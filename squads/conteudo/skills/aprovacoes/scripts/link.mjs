// /aprovacoes-link {cliente} [--corrigidos]
import { sb, PUBLIC_BASE_URL } from "./_supabase.mjs";

const cliente = process.argv[2];
const corrigidos = process.argv.includes("--corrigidos");
if (!cliente) {
  console.error("uso: node link.mjs {cliente} [--corrigidos]");
  process.exit(1);
}

const { data, error } = await sb.from("aprovacao_clientes").select("*").eq("slug", cliente).maybeSingle();
if (error || !data) {
  console.error("cliente não encontrado:", cliente);
  process.exit(1);
}

const url =
  `${PUBLIC_BASE_URL}/aprovar/?cliente=${data.slug}&token=${data.token_aprovador}` +
  (corrigidos ? "&corrigidos=1" : "");

console.log(`\nLink mágico (${data.nome}):\n`);
console.log(url);
console.log("\n");
