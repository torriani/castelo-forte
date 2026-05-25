// aplica SQL via management API do Supabase (sem precisar de pg/psql)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

if (!PROJECT_REF || !SERVICE_KEY) {
  console.error("faltam SUPABASE_PROJECT_REF/SUPABASE_SERVICE_KEY no .env");
  process.exit(1);
}

const sqlPath = process.argv[2] || path.join(__dirname, "..", "migrations", "001_schema.sql");
const sql = fs.readFileSync(sqlPath, "utf8");

// usa endpoint pg-meta public via service_role
const url = `${SUPABASE_URL}/pg/query`;

async function run() {
  // tenta endpoint padrao do pg-meta interno (so funciona com cookies de dashboard)
  // alternativa: usar /rest/v1/rpc com funcao customizada -- mas precisamos rodar DDL
  // melhor: SQL via Edge Functions, mas nao tem.
  // solucao: Management API /v1/projects/{ref}/database/query (so funciona com PAT)
  const mgmtUrl = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;
  // PAT necessario - vamos pegar do supabase CLI
  const PAT = process.env.SUPABASE_ACCESS_TOKEN;
  if (!PAT) {
    console.error("precisa de SUPABASE_ACCESS_TOKEN (PAT) no .env ou env");
    process.exit(2);
  }
  const r = await fetch(mgmtUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const txt = await r.text();
  console.log("status:", r.status);
  console.log(txt.slice(0, 2000));
  if (!r.ok) process.exit(3);
}

run().catch((e) => {
  console.error(e);
  process.exit(99);
});
