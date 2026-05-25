/**
 * B-23: Pipeline de indexação do squad conteúdo para RAG
 *
 * Extrai ~45 arquivos do squad (data/ + checklists/) → gera chunks → embeddings → Supabase
 *
 * Uso: npx tsx scripts/index-squad-rag.ts
 *
 * Requer:
 *   - VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local
 *   - OPENROUTER_API_KEY no .env.local (para embeddings via OpenRouter)
 *   - Tabela `squad_knowledge` no Supabase (ver migration abaixo)
 *
 * Migration SQL (executar no Supabase SQL Editor):
 *
 *   -- Habilitar pgvector
 *   create extension if not exists vector;
 *
 *   create table if not exists squad_knowledge (
 *     id uuid primary key default gen_random_uuid(),
 *     source_file text not null,
 *     chunk_index int not null,
 *     title text,
 *     content text not null,
 *     category text not null, -- 'data', 'checklist', 'agent', 'task'
 *     tags text[] default '{}',
 *     embedding vector(1536),
 *     token_count int default 0,
 *     created_at timestamptz default now(),
 *     updated_at timestamptz default now(),
 *     unique(source_file, chunk_index)
 *   );
 *
 *   -- Indice para busca por similaridade
 *   create index if not exists idx_squad_knowledge_embedding
 *     on squad_knowledge using ivfflat (embedding vector_cosine_ops) with (lists = 10);
 *
 *   -- Funcao de busca
 *   create or replace function match_squad_knowledge(
 *     query_embedding vector(1536),
 *     match_threshold float default 0.7,
 *     match_count int default 5
 *   )
 *   returns table (
 *     id uuid,
 *     source_file text,
 *     title text,
 *     content text,
 *     category text,
 *     tags text[],
 *     similarity float
 *   )
 *   language plpgsql
 *   as $$
 *   begin
 *     return query
 *     select
 *       sk.id,
 *       sk.source_file,
 *       sk.title,
 *       sk.content,
 *       sk.category,
 *       sk.tags,
 *       1 - (sk.embedding <=> query_embedding) as similarity
 *     from squad_knowledge sk
 *     where 1 - (sk.embedding <=> query_embedding) > match_threshold
 *     order by sk.embedding <=> query_embedding
 *     limit match_count;
 *   end;
 *   $$;
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Carregar .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY obrigatorios no .env.local');
  process.exit(1);
}

if (!GEMINI_KEY) {
  console.error('GEMINI_API_KEY obrigatorio no .env.local para gerar embeddings');
  process.exit(1);
}

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// Diretorios do squad para indexar
const SQUAD_ROOT = path.resolve(__dirname, '../../../../../squads/conteudo');
const INDEX_DIRS: { dir: string; category: string }[] = [
  { dir: path.join(SQUAD_ROOT, 'data'), category: 'data' },
  { dir: path.join(SQUAD_ROOT, 'checklists'), category: 'checklist' },
];

// Configuracao de chunking
const MAX_CHUNK_TOKENS = 500; // ~500 tokens por chunk
const CHUNK_OVERLAP = 50; // overlap em chars

interface Chunk {
  sourceFile: string;
  chunkIndex: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  tokenCount: number;
}

// Estimar tokens (aproximacao: 1 token ~ 4 chars em portugues)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Extrair titulo do markdown
function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}

// Extrair tags do conteudo
function extractTags(content: string, filename: string): string[] {
  const tags: string[] = [];

  // Tag do filename
  const slug = path.basename(filename, '.md');
  tags.push(slug);

  // Tags de categorias conhecidas
  const keywords = ['imperial', 'polemico', 'crenca', 'hook', 'cta', 'reels', 'stories', 'carrossel', 'copy', 'oraculo'];
  for (const kw of keywords) {
    if (content.toLowerCase().includes(kw) || slug.includes(kw)) {
      tags.push(kw);
    }
  }

  return [...new Set(tags)];
}

// Dividir conteudo em chunks
function chunkContent(content: string, maxTokens: number): string[] {
  const chunks: string[] = [];

  // Dividir por secoes markdown (## ou ---)
  const sections = content.split(/\n(?=##\s)|(?:\n---\n)/);

  let currentChunk = '';
  for (const section of sections) {
    const sectionTokens = estimateTokens(section);
    const currentTokens = estimateTokens(currentChunk);

    if (currentTokens + sectionTokens <= maxTokens) {
      currentChunk += (currentChunk ? '\n\n' : '') + section;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }

      // Se a secao e maior que maxTokens, dividir por paragrafos
      if (sectionTokens > maxTokens) {
        const paragraphs = section.split(/\n\n+/);
        currentChunk = '';
        for (const para of paragraphs) {
          if (estimateTokens(currentChunk) + estimateTokens(para) <= maxTokens) {
            currentChunk += (currentChunk ? '\n\n' : '') + para;
          } else {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = para;
          }
        }
      } else {
        currentChunk = section;
      }
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(c => c.length > 20); // ignorar chunks muito curtos
}

// Gerar embedding via Google Gemini (text-embedding-004)
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${GEMINI_BASE}/models/text-embedding-004:embedContent?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text: text.substring(0, 8000) }] },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini Embedding error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data?.embedding?.values || [];
}

// Upsert no Supabase
async function upsertChunk(chunk: Chunk, embedding: number[]): Promise<void> {
  const body = {
    source_file: chunk.sourceFile,
    chunk_index: chunk.chunkIndex,
    title: chunk.title,
    content: chunk.content,
    category: chunk.category,
    tags: chunk.tags,
    embedding: embedding,
    token_count: chunk.tokenCount,
    updated_at: new Date().toISOString(),
  };

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/squad_knowledge?on_conflict=source_file,chunk_index`,
    {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY!,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Supabase upsert error ${response.status}: ${err}`);
  }
}

// Limpar chunks antigos de um arquivo
async function cleanupOldChunks(sourceFile: string, maxChunkIndex: number): Promise<void> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/squad_knowledge?source_file=eq.${encodeURIComponent(sourceFile)}&chunk_index=gt.${maxChunkIndex}`,
    {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY!,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  if (!response.ok) {
    console.warn(`Aviso: falha ao limpar chunks antigos de ${sourceFile}`);
  }
}

// Pipeline principal
async function indexSquad(): Promise<void> {
  console.log('=== Carrossel Studio — Indexacao RAG do Squad Conteudo ===\n');

  const allChunks: Chunk[] = [];

  // Coletar arquivos
  for (const { dir, category } of INDEX_DIRS) {
    if (!fs.existsSync(dir)) {
      console.warn(`Diretorio nao encontrado: ${dir}`);
      continue;
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    console.log(`${category}/: ${files.length} arquivos`);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const relativePath = `squads/conteudo/${category}/${file}`;
      const title = extractTitle(content) || path.basename(file, '.md');
      const tags = extractTags(content, file);
      const chunks = chunkContent(content, MAX_CHUNK_TOKENS);

      chunks.forEach((chunkContent, i) => {
        allChunks.push({
          sourceFile: relativePath,
          chunkIndex: i,
          title: i === 0 ? title : `${title} (parte ${i + 1})`,
          content: chunkContent,
          category,
          tags,
          tokenCount: estimateTokens(chunkContent),
        });
      });
    }
  }

  console.log(`\nTotal: ${allChunks.length} chunks de ${INDEX_DIRS.reduce((acc, d) => {
    const dir = d.dir;
    return acc + (fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.md')).length : 0);
  }, 0)} arquivos\n`);

  // Processar chunks
  let success = 0;
  let errors = 0;

  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    process.stdout.write(`[${i + 1}/${allChunks.length}] ${chunk.sourceFile} #${chunk.chunkIndex}... `);

    try {
      const embedding = await generateEmbedding(chunk.content);
      await upsertChunk(chunk, embedding);
      success++;
      console.log('OK');
    } catch (err: any) {
      errors++;
      console.error(`ERRO: ${err.message}`);
    }

    // Rate limiting: 50ms entre requests
    await new Promise(r => setTimeout(r, 50));
  }

  // Cleanup: para cada arquivo, remover chunks com index > max
  const fileMaxIndex = new Map<string, number>();
  for (const chunk of allChunks) {
    const current = fileMaxIndex.get(chunk.sourceFile) ?? -1;
    if (chunk.chunkIndex > current) {
      fileMaxIndex.set(chunk.sourceFile, chunk.chunkIndex);
    }
  }
  for (const [file, maxIdx] of fileMaxIndex) {
    await cleanupOldChunks(file, maxIdx);
  }

  console.log(`\n=== Resultado ===`);
  console.log(`Sucesso: ${success}`);
  console.log(`Erros: ${errors}`);
  console.log(`Total chunks no banco: ${success}`);
}

indexSquad().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
