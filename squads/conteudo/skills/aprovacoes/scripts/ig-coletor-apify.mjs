// Coletor de Instagram via Apify (plano B quando não tem Graph API)
// uso: node ig-coletor-apify.mjs castelo-forte [handle]
import { sb } from "./_supabase.mjs";

const cliente = process.argv[2] || "castelo-forte";
const handleArg = process.argv[3]; // opcional, sobrescreve o username da conta
// 4° argumento opcional: numero max de posts (default 30)
const LIMITE = parseInt(process.argv[4] || "30", 10);

const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!APIFY_TOKEN) {
  // tenta ler do .env do squad
  const fs = await import("node:fs");
  const path = await import("node:path");
  const envFile = path.resolve(process.env.HOME, "claude/squads/conteudo/.env");
  if (fs.existsSync(envFile)) {
    const txt = fs.readFileSync(envFile, "utf8");
    const m = txt.match(/APIFY_TOKEN=(.+)/);
    if (m) process.env.APIFY_TOKEN = m[1].trim();
  }
}
const TOKEN = process.env.APIFY_TOKEN;
if (!TOKEN) { console.error("[apify] sem APIFY_TOKEN"); process.exit(1); }

// pega/atualiza username do cliente
let { data: conta } = await sb.from("ig_contas").select("*").eq("cliente_slug", cliente).maybeSingle();
const handle = handleArg || conta?.username || cliente.replace(/-/g, "");

if (!conta) {
  // cria registro mínimo (sem token de Graph API)
  await sb.from("ig_contas").insert({
    cliente_slug: cliente,
    business_id: "APIFY-" + handle,
    access_token: "APIFY",
    username: handle,
  });
} else if (handleArg && conta.username !== handleArg) {
  await sb.from("ig_contas").update({ username: handleArg }).eq("cliente_slug", cliente);
}

console.log(`[apify] scrapeando @${handle}…`);

// 1ª chamada: ator de profile (pega metadados do perfil)
const profileUrl = `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${TOKEN}&timeout=120`;
const profR = await fetch(profileUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ usernames: [handle] }),
});
const profData = await profR.json();
const perfil = (profData || [])[0] || {};
console.log(`[apify] @${perfil.username || handle} · ${perfil.followersCount || "?"} seguidores · ${perfil.postsCount || "?"} posts totais`);

// 2ª chamada: ator de scraper (puxa N posts)
const postsUrl = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${TOKEN}&timeout=300`;
const postsResp = await fetch(postsUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    directUrls: [`https://www.instagram.com/${handle}/`],
    resultsType: "posts",
    resultsLimit: LIMITE,
    addParentData: false,
  }),
});
if (!postsResp.ok) {
  const txt = await postsResp.text();
  console.error(`[apify] erro posts ${postsResp.status}:`, txt.slice(0, 500));
  process.exit(2);
}
const latestPosts = await postsResp.json();
if (!Array.isArray(latestPosts)) {
  console.error("[apify] resposta inesperada", latestPosts);
  process.exit(3);
}
console.log(`[apify] ${latestPosts.length} posts retornados`);

let inseridos = 0, atualizados = 0;
for (const p of latestPosts) {
  const id = p.id || p.shortCode;
  if (!id) continue;
  const tipo = p.type === "Sidecar" ? "CAROUSEL_ALBUM" :
               p.type === "Video" ? (p.productType === "clips" ? "REELS" : "VIDEO") :
               "IMAGE";
  const thumb = p.displayUrl || p.images?.[0] || null;
  const row = {
    id: String(id),
    cliente_slug: cliente,
    tipo,
    caption: p.caption || null,
    media_url: p.videoUrl || p.displayUrl || null,
    thumbnail_url: thumb,
    permalink: p.url || (p.shortCode ? `https://www.instagram.com/p/${p.shortCode}/` : null),
    posted_at: p.timestamp || null,
  };
  const { data: ex } = await sb.from("ig_posts").select("id").eq("id", row.id).maybeSingle();
  if (ex) {
    await sb.from("ig_posts").update(row).eq("id", row.id);
    atualizados++;
  } else {
    await sb.from("ig_posts").insert(row);
    inseridos++;
  }

  // métricas via scrape (Apify não traz alcance/impressões — privadas)
  await sb.from("ig_post_metrics").insert({
    post_id: row.id,
    curtidas: p.likesCount ?? 0,
    comentarios: p.commentsCount ?? 0,
    compartilhamentos: 0,        // apify não traz
    salvamentos: 0,              // apify não traz (privado)
    alcance: 0,                  // privado
    impressoes: 0,               // privado
    visualizacoes: p.videoViewCount ?? p.videoPlayCount ?? 0,
    raw: { source: "apify", likes: p.likesCount, comments: p.commentsCount, views: p.videoViewCount },
  });
}

await sb.from("ig_contas").update({ ultima_sincronizacao: new Date().toISOString() }).eq("cliente_slug", cliente);

console.log(`[apify] ok — ${inseridos} novos, ${atualizados} atualizados`);
console.log(`[apify] aviso: alcance/salvamentos/compartilhamentos ficam zerados (Instagram não expõe via scrape — só Graph API)`);
