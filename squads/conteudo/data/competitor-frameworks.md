# FRAMEWORKS DE ANÁLISE DE CONCORRENTES

## VISÃO GERAL

Sistema de pesquisa e análise de concorrentes para gerar insights de conteúdo.
Funciona para mercados BR e US. Usa scraping, transcrição e análise de padrões.

---

## ETAPA 1: MAPEAMENTO DE CONCORRENTES

### Critérios de Seleção
- Mesmo nicho/mercado
- Audiência de 10k a 500k seguidores (sweet spot)
- Conteúdo ativo (postaram nos últimos 30 dias)
- Resultados visíveis (engajamento alto, comentários com intenção de compra)

### Dados a Coletar por Concorrente
| Campo | Descrição |
|-------|-----------|
| Nome/Handle | @usuário no Instagram/TikTok/YouTube |
| Plataformas | Onde está ativo |
| Seguidores | Número por plataforma |
| Frequência | Posts/semana |
| Formatos | Carrossel, Reel, Story, Live, Post único |
| Nicho | Especificidade do posicionamento |
| Oferta | O que vende (mentoria, curso, serviço) |
| Ticket | Faixa de preço (se visível) |
| Tom de voz | Provocativo, educativo, inspiracional, técnico |
| Diferencial | O que faz diferente da maioria |

---

## ETAPA 2: COLETA DE CONTEÚDO TOP

### Métricas de Performance (por plataforma)

**Instagram:**
- Likes / seguidores ratio (benchmark: >3% = bom, >5% = viral)
- Comentários com intenção ("quanto custa?", "como funciona?", "quero")
- Saves (indicador de valor percebido)
- Shares (indicador de viralidade)

**YouTube/Reels:**
- Views / subscribers ratio
- Retenção média (se disponível)
- Comentários engajados vs spam

**TikTok:**
- Views / followers ratio
- Completion rate (vídeos assistidos até o final)
- Stitches e duets (engajamento criativo)

### O que Coletar
- Top 10 posts por engajamento (últimos 90 dias)
- Top 5 reels por views
- Hooks dos posts mais engajados
- Estrutura dos carrosséis que mais performaram
- CTAs que geraram mais respostas

---

## ETAPA 3: TRANSCRIÇÃO E ANÁLISE

### Para Vídeos (Reels/YouTube)
1. Transcrever áudio completo
2. Identificar estrutura usada (BLAZE? PCS? Outro?)
3. Marcar: Hook (0-3s), Retenção, Conteúdo, CTA
4. Anotar: Padrão viral usado, tom, ritmo, edição

### Para Carrosséis
1. Copiar texto de cada slide
2. Identificar tipo de post (Imperial, Crença, Problema, etc)
3. Identificar framework de copy usado
4. Anotar: Hook, progressão emocional, CTA

### Para Stories
1. Capturar sequência completa
2. Identificar estratégia (E4, E6, E7, E8?)
3. Anotar: Enquetes, CTAs, palavras-chave

---

## ETAPA 4: EXTRAÇÃO DE PADRÕES

### Matriz de Análise
| Dimensão | O que Analisar | Output |
|----------|---------------|--------|
| Hooks | Que tipo de hook mais performa? | Top 10 hooks adaptáveis |
| Estrutura | Qual estrutura de post mais engaja? | Templates replicáveis |
| Tom | Qual tom gera mais engajamento? | Guia de tom adaptado |
| CTA | Qual CTA gera mais conversão? | Templates de CTA |
| Formato | Carrossel vs Reel vs Story — qual performa melhor? | Recomendação de mix |
| Frequência | Quantas vezes por semana os melhores postam? | Calendário sugerido |
| Temas | Quais temas geram mais engajamento? | Banco de ideias |

### Métricas de Comparação
- Engagement rate médio do concorrente vs nosso
- Tipo de conteúdo que mais performa (por formato)
- Gaps: O que eles fazem que a gente não faz?
- Oportunidades: O que ninguém está fazendo no nicho?

---

## ETAPA 5: GERAÇÃO DE CONTEÚDO BASEADO EM INSIGHTS

### Processo
1. Pegar top 10 conteúdos do concorrente
2. Identificar o PRINCÍPIO por trás do sucesso (não copiar, entender)
3. Adaptar pro tom Castelo Forte/Imperador
4. Gerar 3 variações usando frameworks próprios (7 tipos de post + 9 frameworks copy)
5. Validar pelo Oráculo

### Regras
- NUNCA copiar conteúdo — adaptar o princípio
- SEMPRE aplicar tom Imperador/Castelo Forte na adaptação
- SEMPRE validar pelo Oráculo antes de publicar
- Creditar inspiração se for caso óbvio

---

## FERRAMENTAS DISPONÍVEIS

| Ferramenta | Uso |
|------------|-----|
| Apify | Scrape Instagram/TikTok/YouTube — posts, métricas, comentários |
| Playwright | Screenshots de perfis, navegação web |
| EXA | Pesquisa web complementar sobre concorrentes |
| Transcrição | Extrair texto de vídeos (via áudio → texto) |

---

## CONFIGURAÇÃO APIFY PARA ANÁLISE DE CONCORRENTES

### Passo 1: Escolher o Actor Correto

| Plataforma | Actor Recomendado | Actor ID |
|------------|-------------------|----------|
| Instagram (posts) | Instagram Post Scraper | `apify/instagram-post-scraper` |
| Instagram (perfil) | Instagram Profile Scraper | `apify/instagram-profile-scraper` |
| Instagram (comentários) | Instagram Comment Scraper | `apify/instagram-comment-scraper` |
| TikTok | TikTok Scraper | `clockworks/tiktok-scraper` |
| YouTube | YouTube Scraper | `bernardo/youtube-scraper` |

### Passo 2: Configuração do Instagram Post Scraper

**Input básico para coletar posts de um concorrente:**
```json
{
  "username": ["@handle_do_concorrente"],
  "resultsLimit": 50,
  "resultsType": "posts",
  "searchType": "user",
  "addParentData": true
}
```

**Campos retornados úteis:**
- `likesCount` — número de curtidas
- `commentsCount` — número de comentários
- `timestamp` — data do post
- `caption` — texto/legenda completa
- `type` — carrossel, reel, imagem única
- `url` — link direto do post
- `videoViewCount` — views (se reel)

### Passo 3: Configuração do Instagram Profile Scraper

**Input para coletar dados do perfil:**
```json
{
  "usernames": ["handle1", "handle2", "handle3"],
  "resultsLimit": 5
}
```

**Campos retornados úteis:**
- `followersCount` — seguidores
- `followsCount` — seguindo
- `postsCount` — total de posts
- `biography` — bio do perfil
- `externalUrl` — link da bio
- `isVerified` — selo de verificação

### Passo 4: Fluxo Completo de Análise

```
1. search-actors → buscar "instagram scraper"
2. fetch-actor-details → ver schema de input do Actor escolhido
3. call-actor → executar com os parâmetros acima
4. get-actor-output → coletar resultados
5. Analisar dados com a Matriz de Análise (Etapa 4)
```

### Passo 5: Análise dos Dados Coletados

**Calcular métricas-chave:**
```
Engagement Rate = (likes + comentários) / seguidores * 100
Save Rate = saves / alcance * 100 (quando disponível)
Viral Score = shares / alcance * 100 (quando disponível)
```

**Ordenar posts por performance:**
1. Pegar todos os posts coletados
2. Calcular engagement rate de cada um
3. Ordenar do maior pro menor
4. Analisar Top 10: que tipo de hook? Que formato? Que tom? Que CTA?
5. Identificar padrões repetidos nos top performers

### Passo 6: Dicas Práticas

- **Frequência:** Rodar scraping 1x por mês por concorrente (dados ficam salvos no Apify)
- **Volume:** Coletar últimos 50-100 posts para ter amostra significativa
- **Comentários:** Coletar top 20 comentários dos posts mais engajados para identificar intenção de compra
- **Comparação:** Montar planilha comparativa com 3-5 concorrentes lado a lado
- **Custo:** Instagram Post Scraper consome ~0.25 USD por 100 posts no plano Apify
- **Limite:** Respeitar rate limits — não rodar mais de 3 scrapers simultâneos na mesma plataforma

---

## TEMPLATE DE RELATÓRIO POR CONCORRENTE

```markdown
# Análise: @[handle]

## Dados Gerais
- Plataforma: Instagram / TikTok / YouTube
- Seguidores: [N]
- Frequência: [N] posts/semana
- Nicho: [especificidade]
- Oferta: [o que vende]
- Tom: [descrição]

## Top 5 Conteúdos (por engajamento)
1. [tipo] — [hook] — [likes/comments/saves]
2. ...

## Padrões Identificados
- Hook dominante: [tipo]
- Estrutura mais usada: [tipo]
- CTA mais eficaz: [tipo]
- Formato mais performante: [carrossel/reel/story]

## Insights Aplicáveis
1. [insight + como adaptar pro nosso estilo]
2. ...

## Conteúdos Sugeridos (baseados na análise)
1. [ideia adaptada]
2. ...
```

---

## CONTENT GAP ANALYSIS — Análise de Lacunas de Conteúdo

### O que é Content Gap Analysis

É o processo de identificar o que concorrentes fazem no conteúdo que você NÃO faz, e vice-versa. O objetivo é encontrar oportunidades inexploradas para se posicionar de forma única.

### Distinção Fundamental: Concorrente de PRODUTO vs Concorrente de CONTEÚDO

| Tipo | Definição | Exemplo |
|------|-----------|---------|
| Concorrente de PRODUTO | Vende a mesma coisa para o mesmo público | Outro mentor que vende mentoria de marketing digital |
| Concorrente de CONTEÚDO | Compete pela ATENÇÃO do mesmo público, mesmo vendendo outra coisa | Um canal de produtividade que atrai o mesmo avatar |

**Por que isso importa:**
- Concorrentes de PRODUTO competem por venda direta
- Concorrentes de CONTEÚDO competem por atenção e autoridade
- Você precisa analisar AMBOS para ter vantagem real
- Muitas vezes, os concorrentes de conteúdo são mais perigosos porque roubam atenção antes de você vender

### Como Identificar Content Gaps Sistematicamente

#### Passo 1: Mapear o que eles fazem
Para cada concorrente (3-5), catalogar:
- Formatos usados (carrossel, reel, story, live, post único)
- Temas recorrentes (top 10 assuntos)
- Tom de voz dominante
- Tipo de CTA mais usado
- Frequência de postagem

#### Passo 2: Classificar por dimensão

| Dimensão | Pergunta-chave |
|----------|---------------|
| Formato | Que formato eles usam que eu NÃO uso? |
| Tema | Que temas eles cobrem que eu NÃO cubro? |
| Tom | Que tom eles adotam que eu NÃO adoto? |
| Profundidade | Eles vão mais fundo ou mais raso que eu? |
| Frequência | Eles postam mais ou menos que eu? |
| CTA | Que tipos de CTA eles usam que eu NÃO uso? |
| Plataforma | Em que plataformas eles estão que eu NÃO estou? |

#### Passo 3: Montar a Matriz de Gap

| Dimensão | Eu Faço | Concorrente A | Concorrente B | GAP |
|----------|---------|---------------|---------------|-----|
| Carrosséis | Sim | Sim | Sim | - |
| Reels | Pouco | Muito | Médio | GAP |
| Lives | Não | Sim | Não | GAP |
| Storytelling | Sim | Não | Sim | - |
| Polêmica | Sim | Não | Não | VANTAGEM |

#### Passo 4: Priorizar os Gaps

Nem todo gap vale a pena preencher. Priorize usando:

| Critério | Peso |
|----------|------|
| Alinhamento com meu posicionamento | Alto |
| Demanda do meu avatar | Alto |
| Facilidade de execução | Médio |
| Impacto potencial em vendas | Alto |
| Diferenciação real | Médio |

#### Passo 5: Transformar Gaps em Conteúdo

Para cada gap prioritário:
1. Definir o tema/formato que vai preencher o gap
2. Adaptar ao tom imperial/Castelo Forte
3. Criar 3-5 peças de conteúdo piloto
4. Testar por 2-4 semanas
5. Medir performance vs baseline
6. Decidir: escalar, iterar ou descartar

### Oportunidades Comuns de Gap

| Gap Comum | O que Fazer |
|-----------|------------|
| Concorrentes só educam | Criar conteúdo que PROVOCA e VENDE |
| Ninguém faz Reels longos | Testar Storytelling 40-60s |
| Todos usam tom suave | Apostar no tom imperial/brutal |
| Ninguém mostra bastidores | Criar sequência de stories de bastidores |
| Todos vendem igual | Criar ofertas com tensão e escassez real |
| Ninguém segmenta | Criar conteúdo específico para ICP |
| Todos postam diário | Postar menos, mas com mais impacto |
| Ninguém usa prova social | Criar conteúdo baseado em cases/resultados |

### Frequência de Revisão

- **Mensal:** Verificar top 10 posts dos concorrentes
- **Trimestral:** Refazer a matriz de gap completa
- **Semestral:** Reavaliar lista de concorrentes (novos entrantes, saídas)
