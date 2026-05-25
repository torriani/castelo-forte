import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const email = process.argv[2] || "juliano@castelo-forte.com.br";
const password = process.argv[3] || "100a123";

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { role: "admin" },
});

if (error) {
  if (error.message.includes("already") || error.code === "email_exists") {
    console.log("usuario ja existia, atualizando senha…");
    const { data: list } = await supabase.auth.admin.listUsers();
    const u = list.users.find((u) => u.email === email);
    if (u) {
      const { error: upErr } = await supabase.auth.admin.updateUserById(u.id, { password });
      if (upErr) {
        console.error("erro update:", upErr);
        process.exit(1);
      }
      console.log("ok atualizado:", u.id, email);
      process.exit(0);
    }
  }
  console.error(error);
  process.exit(1);
}
console.log("ok criado:", data.user.id, email);
