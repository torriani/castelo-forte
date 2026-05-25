import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lê do .env raiz (../../../../../.env) ou de env vars do shell
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('ERRO: defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env raiz');
  console.error('Ver docs/SETUP.md');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Ler SQL e executar via rpc
const sqlFile = fs.readFileSync(path.join(__dirname, '001_carrossel_tables.sql'), 'utf-8');

// Separar em statements individuais (dividir por ;)
const statements = sqlFile
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Encontrados ${statements.length} statements`);

// Executar cada statement via rpc (usando pg_query)
for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  const preview = stmt.substring(0, 80).replace(/\n/g, ' ');

  try {
    const { data, error } = await supabase.rpc('', { query: stmt });
    if (error) {
      // Tentar via fetch direta ao pg
      console.log(`[${i+1}] Tentando via REST... ${preview}`);
    } else {
      console.log(`[${i+1}] OK: ${preview}`);
    }
  } catch (e) {
    console.log(`[${i+1}] Skip RPC: ${preview}`);
  }
}

// Abordagem alternativa: testar se as tabelas já existem tentando SELECT
console.log('\n--- Verificando acesso às tabelas ---');

const { data: templates, error: err1 } = await supabase.from('carrossel_templates').select('*');
console.log('carrossel_templates:', err1 ? `ERRO: ${err1.message}` : `OK (${templates?.length} rows)`);

const { data: brands, error: err2 } = await supabase.from('carrossel_brands').select('*');
console.log('carrossel_brands:', err2 ? `ERRO: ${err2.message}` : `OK (${brands?.length} rows)`);
