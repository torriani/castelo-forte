// Coletor de métricas do Instagram via Graph API
// Roda no LaunchAgent (04:00 e 18:00) ou manualmente
// uso: node ig-coletor.mjs castelo-forte

import { sb } from "./_supabase.mjs";

const cliente = process.argv[2] || "castelo-forte";

const { data: conta, error: errConta } = await sb
  .from("ig_contas")
  .select("*")
  .eq("cliente_slug", cliente)
  .maybeSingle();

if (errConta) { console.error(errConta); process.exit(1); }
if (!conta) {
  console.error(`[ig] sem conta cadastrada pro cliente "${cliente}".`);
  console.error("  cadastra: insert into ig_contas (cliente_slug, business_id, access_token, username) values (...)");
  process.exit(2);
}

const TOKEN = conta.access_token;
const IG_ID = conta.business_id;
const API = "https://graph.facebook.com/v23.0";

async function gql(path, params = {}) {
  const url = new URL(`${API}/${path}`);
  url.searchParams.set("access_token", TOKEN);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url);
  const j = await r.json();
  if (j.error) throw new Error(`${path}: ${j.error.message}`);
  return j;
}

console.log(`[ig] coletando últimos 30 posts de @${conta.username || cliente}…`);

// últimos 30 posts
const camposPost = "id,media_type,media_product_type,media_url,thumbnail_url,permalink,caption,timestamp";
const lista = await gql(`${IG_ID}/media`, { fields: camposPost, limit: 30 });

let inseridos = 0, atualizados = 0, metricasOK = 0, metricasErro = 0;

for (const p of lista.data || []) {
  const tipo = p.media_product_type === "REELS" ? "REELS" : p.media_type;
  const row = {
    id: p.id,
    cliente_slug: cliente,
    tipo,
    caption: p.caption || null,
    media_url: p.media_url || null,
    thumbnail_url: p.thumbnail_url || p.media_url || null,
    permalink: p.permalink || null,
    posted_at: p.timestamp || null,
  };

  const { data: existente } = await sb.from("ig_posts").select("id").eq("id", p.id).maybeSingle();
  if (existente) {
    await sb.from("ig_posts").update(row).eq("id", p.id);
    atualizados++;
  } else {
    await sb.from("ig_posts").insert(row);
    inseridos++;
  }

  // métricas — depende do tipo (REELS tem views, IMAGE não)
  const metricsByTipo = {
    IMAGE: "likes,comments,saved,shares,reach",
    VIDEO: "likes,comments,saved,shares,reach,plays",
    CAROUSEL_ALBUM: "likes,comments,saved,shares,reach",
    REELS: "likes,comments,saved,shares,reach,views",
  };
  const metricasPedidas = metricsByTipo[tipo] || "likes,comments,saved,reach";

  try {
    const ins = await gql(`${p.id}/insights`, { metric: metricasPedidas });
    const mp = {};
    for (const item of ins.data || []) {
      mp[item.name] = item.values?.[0]?.value ?? 0;
    }
    await sb.from("ig_post_metrics").insert({
      post_id: p.id,
      curtidas: mp.likes ?? 0,
      comentarios: mp.comments ?? 0,
      compartilhamentos: mp.shares ?? 0,
      salvamentos: mp.saved ?? 0,
      alcance: mp.reach ?? 0,
      impressoes: mp.impressions ?? 0,
      visualizacoes: mp.views ?? mp.plays ?? 0,
      raw: mp,
    });
    metricasOK++;
  } catch (e) {
    console.warn(`  metricas falharam pra ${p.id}: ${e.message}`);
    metricasErro++;
  }
}

await sb.from("ig_contas").update({ ultima_sincronizacao: new Date().toISOString() }).eq("cliente_slug", cliente);

console.log(`[ig] ok — ${inseridos} novos, ${atualizados} atualizados; métricas: ${metricasOK} ok / ${metricasErro} erro.`);
