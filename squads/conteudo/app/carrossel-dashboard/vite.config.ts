import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Raiz dos outputs de copies
const OUTPUTS_ROOT = path.resolve(__dirname, '../../../../outputs/copys');

// Rate limiting para geracao de imagens
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minuto
const RATE_LIMIT_MAX = 5; // max 5 geracoes por minuto

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  // Limpar timestamps antigos
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT_MAX) {
    return false; // limite atingido
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

// ============ Gemini API helpers ============
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// Rotacao de keys entre 3 contas Gemini
let geminiKeyIndex = 0;
function getGeminiKey(): string | undefined {
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter(Boolean) as string[];

  if (keys.length === 0) return undefined;

  const key = keys[geminiKeyIndex % keys.length];
  geminiKeyIndex++;
  return key;
}

async function geminiGenerateContent(systemPrompt: string, userPrompt: string, temperature = 0.8): Promise<string> {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error('GEMINI_API_KEY nao configurada');

  const response = await fetch(`${GEMINI_BASE}/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { temperature, maxOutputTokens: 4000 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function geminiEmbed(text: string): Promise<number[]> {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error('GEMINI_API_KEY nao configurada');

  const response = await fetch(`${GEMINI_BASE}/models/text-embedding-004:embedContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text: text.substring(0, 8000) }] },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini Embed ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data?.embedding?.values || [];
}

function imageGenerationPlugin() {
  return {
    name: 'image-generation-api',
    configureServer(server: any) {
      // POST /api/generate-image — gera imagem via Gemini
      server.middlewares.use('/api/generate-image', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') return next();

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(Buffer.from(chunk));
          }
          const body = JSON.parse(Buffer.concat(chunks).toString());

          if (!body.prompt || typeof body.prompt !== 'string') {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Campo "prompt" obrigatorio.' }));
            return;
          }

          const clientIp = req.socket?.remoteAddress || 'unknown';
          if (!checkRateLimit(clientIp)) {
            res.statusCode = 429;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Limite de geracoes atingido. Aguarde 1 minuto.' }));
            return;
          }

          const apiKey = getGeminiKey();
          if (!apiKey) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'GEMINI_API_KEY nao configurada no servidor.' }));
            return;
          }

          // Gemini imagen via generateContent com responseModalities
          const geminiRes = await fetch(`${GEMINI_BASE}/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: `Generate an image: ${body.prompt}` }] }],
              generationConfig: {
                responseModalities: ['IMAGE', 'TEXT'],
              },
            }),
          });

          if (!geminiRes.ok) {
            const errData = await geminiRes.text();
            console.error('Gemini image error:', geminiRes.status, errData);
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Erro ao gerar imagem: ${geminiRes.statusText}` }));
            return;
          }

          const data = await geminiRes.json();
          const parts = data?.candidates?.[0]?.content?.parts || [];

          // Procurar inline image data
          for (const part of parts) {
            if (part?.inlineData?.mimeType?.startsWith('image/')) {
              const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ imageUrl: dataUrl }));
              return;
            }
          }

          // Fallback: procurar URL no texto
          const textContent = parts.map((p: any) => p.text || '').join('');
          const urlMatch = textContent.match(/https?:\/\/[^\s"'\]]+\.(png|jpg|jpeg|webp|gif)/i);
          if (urlMatch) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ imageUrl: urlMatch[0] }));
            return;
          }

          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Nao foi possivel gerar a imagem. Tente outro prompt.' }));

        } catch (err: any) {
          console.error('Erro no endpoint /api/generate-image:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Erro interno: ${err.message}` }));
        }
      });
    },
  };
}

// ============ REGRAS BASE (comuns a todos os tipos) ============
const REGRAS_BASE = `REGRAS INVIOLAVEIS:
- Slide 1 (Hook): Max 15 palavras. Contraintuitivo. Choque cerebral. NUNCA perguntas. NUNCA emojis.
- Cada slide deve ter funcao psicologica clara
- Progressao emocional: Reptiliano (1-3) -> Limbico (4-6) -> Neocortex (7-10)
- Ultimo slide: CTA Imperial. Comando moral + palavra-chave.
- Tom dominante, sem ser arrogante
- Sem emojis. Sem hashtags. Sem "Voce sabia que..."
- Frases curtas e impactantes
- Cada slide: 1 ideia, 1 emocao, 1 acao

ADAPTACAO POR TAMANHO:
- 3 slides: Hook -> Argumento -> CTA
- 5 slides: Hook -> Build-up -> Climax -> Resolucao -> CTA
- 7 slides: Hook -> 2 Build-up -> Climax -> Nova crenca -> Resolucao -> CTA
- 10 slides: Estrutura completa do tipo escolhido

Retorne APENAS um JSON array com os textos dos slides. Sem markdown, sem explicacao.
Formato: ["texto slide 1", "texto slide 2", ..., "texto slide N"]`;

// ============ PROMPTS POR TIPO DE POST (B-19) ============
const PROMPTS_POR_TIPO: Record<string, string> = {
  imperial: `Voce e um copywriter especialista em carrosseis IMPERIAIS de Instagram.
Estilo: Doutrinario. Narrativa completa que doutrina, envolve e colapsa objecoes.
Tom: Dominante, autoritario mas nao arrogante. Voce SABE, nao "acha".
Estrutura: Declaracao imperial -> Evidencias -> Doutrinacao -> Nova crenca -> Comando moral.
Hook: Afirmacao ABSOLUTA que contradiz senso comum. Sem perguntas.
CTA: Comando moral. "Salve isso se voce...", "Siga quem...", "Compartilhe com quem precisa ouvir".

${REGRAS_BASE}`,

  polemico: `Voce e um copywriter especialista em carrosseis POLEMICOS de Instagram.
Estilo: Controverso. Polarizar audiencia, criar inimigos e aliados.
Tom: Provocativo, desafiador, sem medo de desagradar.
Estrutura: Provocacao -> Inimigo comum -> Evidencia incomoda -> Polarizacao -> Chamada a acao.
Hook: Ataque direto a crenca popular. "X esta te destruindo e voce nao sabe."
CTA: Convite para o "lado certo". "Se voce entendeu, siga. Se nao, volte pro rebanho."

${REGRAS_BASE}`,

  crenca: `Voce e um copywriter especialista em carrosseis de CRENCA de Instagram.
Estilo: Revelador. Trocar sistema de crencas. Desconstruir e reconstruir.
Tom: Conspirador gentil. "Vou te contar algo que ninguem fala."
Estrutura: Crenca atual -> Evidencia contra -> Revelacao -> Nova crenca -> Ponte para acao.
Hook: "Tudo que te ensinaram sobre X esta errado." / "A mentira que te contaram sobre X."
CTA: Convite para adotar nova crenca. "Comece hoje a pensar diferente sobre..."

${REGRAS_BASE}`,

  problema: `Voce e um copywriter especialista em carrosseis de PROBLEMA de Instagram.
Estilo: Empatico. Amplificar percepcao do problema. Da dor a solucao.
Tom: Empatetico mas direto. Voce ENTENDE a dor e tem a saida.
Estrutura: Sintoma -> Problema real -> Consequencia -> Caminho -> Primeiro passo.
Hook: Descrever sintoma que audiencia reconhece imediatamente.
CTA: Primeiro passo concreto. "Comece por...", "O primeiro passo e..."

${REGRAS_BASE}`,

  curiosidade: `Voce e um copywriter especialista em carrosseis de CURIOSIDADE de Instagram.
Estilo: Misterioso. Despertar obsessao. Suspense, revelacao, acao.
Tom: Intrigante, provocando necessidade de saber mais.
Estrutura: Mistério -> Pistas -> Build-up -> Revelacao -> Implicacao.
Hook: Criar buraco de informacao. "O que X sabe que voce nao sabe."
CTA: Satisfazer parcialmente e criar novo loop. "Quer o restante? Link na bio."

${REGRAS_BASE}`,

  historia: `Voce e um copywriter especialista em carrosseis de HISTORIA de Instagram.
Estilo: Intimo. Conexao profunda. Identificacao e transformacao.
Tom: Vulneravel, autentico, humano.
Estrutura: Cenario -> Conflito -> Ponto de virada -> Aprendizado -> Mensagem universal.
Hook: Cena vivida. "Eram 3h da manha quando...", "Naquele dia eu descobri..."
CTA: Convite para compartilhar propria historia. "Marca alguem que precisa ler isso."

${REGRAS_BASE}`,

  oferta: `Voce e um copywriter especialista em carrosseis de OFERTA de Instagram.
Estilo: Confiante. Venda imediata. Quebrar objecoes e comandar compra.
Tom: Seguro, direto, sem rodeios. Voce TEM a solucao.
Estrutura: Problema urgente -> Solucao -> Prova -> Oferta -> Escassez -> CTA.
Hook: Resultado concreto. "Como [resultado] em [prazo] sem [objecao]."
CTA: Comando direto de compra. "Link na bio. Vagas limitadas.", "Clica no link agora."

${REGRAS_BASE}`,
};

// ============ ORACULO — Validacao de qualidade (B-20) ============
const ORACULO_RULES = {
  hookMaxWords: 15,
  hookBannedPatterns: [
    /^voce sabia/i, /^ja pensou/i, /^imagine/i, /\?$/, // Sem perguntas no hook
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/u, // Sem emojis
  ],
  slideBannedPatterns: [
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/u, // Sem emojis
    /#\w+/, // Sem hashtags
  ],
  ctaRequired: true,
  minSlideLength: 10,
  maxSlideLength: 300,
};

function validateWithOraculo(slides: string[], postType: string): { approved: boolean; issues: string[]; score: number } {
  const issues: string[] = [];
  let score = 100;

  if (slides.length === 0) {
    return { approved: false, issues: ['Nenhum slide gerado'], score: 0 };
  }

  // Hook validation
  const hook = slides[0];
  const hookWords = hook.split(/\s+/).length;
  if (hookWords > ORACULO_RULES.hookMaxWords) {
    issues.push(`Hook com ${hookWords} palavras (max ${ORACULO_RULES.hookMaxWords})`);
    score -= 15;
  }
  for (const pattern of ORACULO_RULES.hookBannedPatterns) {
    if (pattern.test(hook)) {
      issues.push(`Hook contem padrao proibido: ${pattern.source}`);
      score -= 10;
    }
  }

  // Slide validation
  slides.forEach((slide, i) => {
    if (slide.length < ORACULO_RULES.minSlideLength) {
      issues.push(`Slide ${i + 1} muito curto (${slide.length} chars)`);
      score -= 5;
    }
    if (slide.length > ORACULO_RULES.maxSlideLength) {
      issues.push(`Slide ${i + 1} muito longo (${slide.length} chars, max ${ORACULO_RULES.maxSlideLength})`);
      score -= 5;
    }
    for (const pattern of ORACULO_RULES.slideBannedPatterns) {
      if (pattern.test(slide)) {
        issues.push(`Slide ${i + 1} contem padrao proibido: ${pattern.source}`);
        score -= 5;
      }
    }
  });

  // CTA check (ultimo slide)
  const lastSlide = slides[slides.length - 1].toLowerCase();
  const ctaSignals = ['siga', 'salve', 'compartilhe', 'link', 'clique', 'comece', 'marca', 'comente', 'envie'];
  const hasCta = ctaSignals.some(s => lastSlide.includes(s));
  if (!hasCta) {
    issues.push('Ultimo slide nao parece ter CTA claro');
    score -= 10;
  }

  score = Math.max(0, score);
  return { approved: score >= 70, issues, score };
}

// System prompt por tipo (B-19)
function getSystemPrompt(postType: string): string {
  return PROMPTS_POR_TIPO[postType] || PROMPTS_POR_TIPO.imperial;
}

function carouselGenerationPlugin() {
  return {
    name: 'carousel-generation-api',
    configureServer(server: any) {
      server.middlewares.use('/api/generate-carousel', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') {
          return next();
        }

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(Buffer.from(chunk));
          }
          const body = JSON.parse(Buffer.concat(chunks).toString());

          const { headline, fatos, cta, postType, slideCount, useRag = false } = body;

          if (!headline || !fatos) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Campos "headline" e "fatos" obrigatorios.' }));
            return;
          }

          // Rate limiting
          const clientIp = req.socket?.remoteAddress || 'unknown';
          if (!checkRateLimit(clientIp)) {
            res.statusCode = 429;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Limite de geracoes atingido. Aguarde 1 minuto.' }));
            return;
          }

          if (!getGeminiKey()) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'GEMINI_API_KEY nao configurada.' }));
            return;
          }

          // RAG: buscar contexto relevante do squad (B-22)
          let ragContext = '';
          let ragUsed = false;
          if (useRag) {
            try {
              const supabaseUrl = process.env.VITE_SUPABASE_URL;
              const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
              if (supabaseUrl && supabaseKey) {
                const queryEmb = await geminiEmbed(`${headline} ${fatos}`);
                if (queryEmb.length > 0) {
                  const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/match_squad_knowledge`, {
                    method: 'POST',
                    headers: {
                      'apikey': supabaseKey,
                      'Authorization': `Bearer ${supabaseKey}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      query_embedding: queryEmb,
                      match_threshold: 0.65,
                      match_count: 5,
                    }),
                  });
                  if (rpcRes.ok) {
                    const matches = await rpcRes.json();
                    if (matches.length > 0) {
                      ragContext = '\n\nCONTEXTO DO SQUAD (use como referencia de qualidade e estilo):\n' +
                        matches.map((m: any) => `[${m.source_file}] ${m.content}`).join('\n---\n');
                      ragUsed = true;
                    }
                  }
                }
              }
            } catch (ragErr) {
              console.warn('RAG fallback (sem contexto):', ragErr);
            }
          }

          const userPrompt = `Crie um carrossel de ${slideCount || 10} slides no estilo ${postType || 'imperial'}.

HEADLINE/TEMA: ${headline}

FATOS E ARGUMENTOS:
${fatos}

${cta ? `CTA DESEJADO: ${cta}` : 'Crie um CTA Imperial adequado.'}
${ragContext}
Retorne APENAS o JSON array com os textos. Exemplo: ["Slide 1...", "Slide 2...", ...]`;

          let content: string;
          try {
            content = await geminiGenerateContent(
              getSystemPrompt(postType || 'imperial'),
              userPrompt,
              0.8,
            );
          } catch (err: any) {
            console.error('Gemini generation error:', err);
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Erro na API Gemini: ${err.message}` }));
            return;
          }

          // Extrair JSON array da resposta
          let slides: string[] = [];
          try {
            // Tentar parse direto
            slides = JSON.parse(content);
          } catch {
            // Tentar extrair JSON de dentro de markdown
            const jsonMatch = content.match(/\[[\s\S]*?\]/);
            if (jsonMatch) {
              try {
                slides = JSON.parse(jsonMatch[0]);
              } catch {
                // Fallback: separar por linhas
                slides = content
                  .split(/\n+/)
                  .map((s: string) => s.replace(/^["'\d.\-\s]+/, '').replace(/["',]+$/, '').trim())
                  .filter((s: string) => s.length > 5);
              }
            } else {
              slides = content
                .split(/\n{2,}/)
                .map((s: string) => s.trim())
                .filter((s: string) => s.length > 5);
            }
          }

          if (!Array.isArray(slides) || slides.length === 0) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'IA nao retornou slides validos.', raw: content }));
            return;
          }

          // Validar com Oraculo (B-20)
          const oraculo = validateWithOraculo(slides, postType || 'imperial');

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            slides,
            postType: postType || 'imperial',
            oraculo,
            ragUsed,
          }));

        } catch (err: any) {
          console.error('Erro no endpoint /api/generate-carousel:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Erro interno: ${err.message}` }));
        }
      });
    },
  };
}

// ============ Admin Mode (B-21) ============
function adminModePlugin() {
  return {
    name: 'admin-mode-api',
    configureServer(server: any) {
      // GET /api/admin/status — retorna se esta em modo admin (local)
      server.middlewares.use('/api/admin/status', (_req: any, res: any) => {
        const isLocal = process.env.ADMIN_MODE === 'true' || process.env.NODE_ENV !== 'production';
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          isAdmin: isLocal,
          mode: isLocal ? 'local' : 'online',
          features: {
            localCopies: isLocal,
            squadRules: isLocal ? '100%' : '85%',
            selectTab: isLocal,
            claudeCode: isLocal,
          },
        }));
      });

      // GET /api/admin/prompts — listar prompts por tipo (admin)
      server.middlewares.use('/api/admin/prompts', (req: any, res: any) => {
        if (req.method !== 'GET') return;
        const prompts = Object.entries(PROMPTS_POR_TIPO).map(([type, prompt]) => ({
          type,
          prompt: prompt.substring(0, 200) + '...',
          fullLength: prompt.length,
        }));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ prompts }));
      });
    },
  };
}

// ============ RAG Plugin (B-22) ============
function ragPlugin() {
  return {
    name: 'rag-api',
    configureServer(server: any) {
      // POST /api/rag/query — buscar contexto relevante do squad
      server.middlewares.use('/api/rag/query', async (req: any, res: any, next: any) => {
        if (req.method !== 'POST') return next();

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(Buffer.from(chunk));
          }
          const body = JSON.parse(Buffer.concat(chunks).toString());
          const { query, matchCount = 5, threshold = 0.7 } = body;

          if (!query) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Campo "query" obrigatorio' }));
            return;
          }

          const supabaseUrl = process.env.VITE_SUPABASE_URL;
          const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

          if (!getGeminiKey() || !supabaseUrl || !supabaseKey) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'GEMINI_API_KEY ou credenciais Supabase nao configuradas' }));
            return;
          }

          // 1. Gerar embedding da query via Gemini
          let queryEmbedding: number[];
          try {
            queryEmbedding = await geminiEmbed(query);
          } catch (embErr: any) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Erro ao gerar embedding: ${embErr.message}` }));
            return;
          }

          if (!queryEmbedding || queryEmbedding.length === 0) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Embedding vazio' }));
            return;
          }

          // 2. Buscar chunks similares no Supabase via RPC
          const rpcResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/match_squad_knowledge`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query_embedding: queryEmbedding,
              match_threshold: threshold,
              match_count: matchCount,
            }),
          });

          if (!rpcResponse.ok) {
            const errText = await rpcResponse.text();
            console.error('Supabase RPC error:', errText);
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Erro ao buscar no banco', detail: errText }));
            return;
          }

          const matches = await rpcResponse.json();

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            matches,
            count: matches.length,
            query: query.substring(0, 100),
          }));

        } catch (err: any) {
          console.error('RAG query error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Erro interno: ${err.message}` }));
        }
      });

      // GET /api/rag/stats — estatisticas do indice
      server.middlewares.use('/api/rag/stats', async (_req: any, res: any) => {
        try {
          const supabaseUrl = process.env.VITE_SUPABASE_URL;
          const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

          if (!supabaseUrl || !supabaseKey) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ indexed: false, count: 0 }));
            return;
          }

          const countRes = await fetch(
            `${supabaseUrl}/rest/v1/squad_knowledge?select=id&limit=1`,
            {
              method: 'HEAD',
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Prefer': 'count=exact',
              },
            }
          );

          const totalCount = parseInt(countRes.headers.get('content-range')?.split('/')[1] || '0', 10);

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            indexed: totalCount > 0,
            count: totalCount,
          }));
        } catch {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ indexed: false, count: 0 }));
        }
      });
    },
  };
}

function carouselApiPlugin() {
  return {
    name: 'carousel-api',
    configureServer(server: any) {
      // GET /api/browse — arvore de clientes/campanhas/carrosseis
      server.middlewares.use('/api/browse', (_req: any, res: any) => {
        try {
          const tree: any[] = [];

          if (!fs.existsSync(OUTPUTS_ROOT)) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ clients: [] }));
            return;
          }

          const clients = fs.readdirSync(OUTPUTS_ROOT, { withFileTypes: true })
            .filter(d => d.isDirectory());

          for (const client of clients) {
            const clientPath = path.join(OUTPUTS_ROOT, client.name);
            const campaigns: any[] = [];

            const campaignDirs = fs.readdirSync(clientPath, { withFileTypes: true })
              .filter(d => d.isDirectory());

            for (const campaign of campaignDirs) {
              const carrosseisPath = path.join(clientPath, campaign.name, 'carrosseis');

              if (!fs.existsSync(carrosseisPath)) continue;

              const files = fs.readdirSync(carrosseisPath, { withFileTypes: true })
                .filter(f => f.isFile() && f.name.endsWith('.md'))
                .map(f => ({
                  name: f.name.replace('.md', ''),
                  file: f.name,
                  path: `${client.name}/${campaign.name}/carrosseis/${f.name}`,
                  hasImages: fs.existsSync(
                    path.join(carrosseisPath, f.name.replace('.md', ''))
                  )
                }));

              if (files.length > 0) {
                campaigns.push({
                  name: campaign.name,
                  carousels: files
                });
              }
            }

            if (campaigns.length > 0) {
              tree.push({
                name: client.name,
                campaigns
              });
            }
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ clients: tree }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      // GET /api/carousel?path=client/campaign/carrosseis/file.md
      server.middlewares.use('/api/carousel', (req: any, res: any) => {
        try {
          const url = new URL(req.url, 'http://localhost');
          const filePath = url.searchParams.get('path');

          if (!filePath) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'path param required' }));
            return;
          }

          const fullPath = path.join(OUTPUTS_ROOT, filePath);

          if (!fs.existsSync(fullPath)) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'file not found' }));
            return;
          }

          const content = fs.readFileSync(fullPath, 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ content, path: filePath }));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  };
}

export default defineConfig({
  server: {
    port: 3050,
    host: '0.0.0.0',
  },
  plugins: [react(), carouselApiPlugin(), imageGenerationPlugin(), carouselGenerationPlugin(), adminModePlugin(), ragPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-export': ['html-to-image', 'jszip'],
        }
      }
    }
  }
});
