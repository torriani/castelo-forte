import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ws from "ws";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error("[aprovacoes] faltam SUPABASE_URL/SUPABASE_SERVICE_KEY no .env");
  process.exit(1);
}

export const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws },
});

export const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "https://castelo-forte-ten.vercel.app";
