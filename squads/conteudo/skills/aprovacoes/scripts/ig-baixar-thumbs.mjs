// Baixa thumbnails dos posts do Instagram e salva em vercel-deploy/img/ig-{cliente}/
// Atualiza thumbnail_url no banco apontando pro path local
import fs from "node:fs";
import path from "node:path";
import { sb } from "./_supabase.mjs";

const cliente = process.argv[2] || "castelo-forte";
const SLUG_DIR = cliente.replace(/[^a-z0-9-]/gi, "");
const OUT_DIR = path.resolve(
  process.env.HOME,
  `claude/apps/conteudo/img/ig-${SLUG_DIR}`,
);
fs.mkdirSync(OUT_DIR, { recursive: true });

const { data: posts } = await sb
  .from("ig_posts")
  .select("id, thumbnail_url, tipo")
  .eq("cliente_slug", cliente)
  .order("posted_at", { ascending: false });

console.log(`[thumbs] ${posts?.length || 0} posts pra baixar`);

let baixados = 0, falhas = 0;
for (const p of posts || []) {
  if (!p.thumbnail_url || p.thumbnail_url.startsWith("/img/")) { continue; }
  const localFile = `${p.id}.jpg`;
  const fullPath = path.join(OUT_DIR, localFile);
  const publicPath = `/img/ig-${SLUG_DIR}/${localFile}`;
  try {
    const r = await fetch(p.thumbnail_url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120" },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    fs.writeFileSync(fullPath, buf);
    await sb.from("ig_posts").update({ thumbnail_url: publicPath }).eq("id", p.id);
    baixados++;
    process.stdout.write(".");
  } catch (e) {
    falhas++;
    process.stdout.write("x");
  }
}
console.log(`\n[thumbs] ${baixados} baixados, ${falhas} falhas`);
console.log(`[thumbs] salvos em ${OUT_DIR}`);
