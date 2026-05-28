# ARQUITETURA — Visão Geral

Entenda como tudo se conecta antes de mexer em qualquer coisa.

---

## Visão de 30 segundos

```
┌─────────────────────────────────────────────────────────────┐
│  CLAUDE CODE (você + agentes)                               │
│                                                             │
│  @content-chief                                             │
│      │                                                      │
│      ├─→ @carousel-creator → cria carrossel                 │
│      ├─→ @reels-creator → cria reels                        │
│      ├─→ @stories-strategist → cria stories                 │
│      ├─→ @strategist → planeja campanha                     │
│      └─→ @content-validator → valida (Anti-IA + Oráculo)    │
│                                                             │
│  Lê SEMPRE:                                                 │
│  • workspace/businesses/igreja-castelo-forte/brand/voice/   │
│  • squads/conteudo/data/regras-inviolaveis.md                         │
│  • squads/conteudo/checklists/filtro-anti-ia.md                       │
│                                                             │
│  Grava SEMPRE em:                                           │
│  • outputs/{tipo}/{slug}/              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PIPELINE DE PUBLICAÇÃO (cron: 08:00 + 19:00 BRT)          │
│                                                             │
│  publisher.mjs                                              │
│      │                                                      │
│      ├─→ Lê fila (publicar/NN-data-slug/)                   │
│      ├─→ Roda filtro Anti-IA (BLOQUEIA se falhar)           │
│      ├─→ Upload PNG → Supabase Storage                      │
│      ├─→ Cria container Instagram (Meta Graph API)          │
│      ├─→ Publica container                                  │
│      └─→ Move pra publicado/                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  Instagram (@castelofortefloripa)
```

---

## Camadas

### 1. Squad (motor) — `squads/conteudo/`
Código + agentes + templates + regras. **Reutilizável**, não tem dados de cliente.

```
squads/conteudo/
├── CLAUDE.md              # contrato Claude Code
├── ARCHITECTURE.md        # arquitetura interna
├── agents/                # 13 agentes especializados
├── data/                  # frameworks, regras, padrões universais
├── templates/             # 9 templates de carrossel
├── checklists/            # filtros (anti-IA, oráculo)
├── scripts/               # render, upload, publish, validate
├── tasks/                 # tasks executáveis
├── workflows/             # workflows multi-step
└── app/image-generator/   # gerador PNG (Node + Sharp)
```

### 2. Workspace (contexto) — `workspace/`
Dados específicos da Castelo Forte. Voice DNA, brand, campanhas em planejamento.

```
workspace/businesses/igreja-castelo-forte/
├── brand/
│   ├── voice/             # tom de voz, expressões, anti-padrões
│   ├── identidade.md      # cores, tipografia
│   └── (outros)
├── campaigns/             # campanhas em andamento (não os outputs)
│   └── em-cristo-antecipacao/
└── README.md
```

### 3. Outputs (entregas) — `outputs/`
Tudo que foi produzido. Tem 2 sub-camadas:
- **Texto** (Git): MDs, JSONs, briefs
- **Mídia** (Supabase Archive): PNGs, MP4s, assets pesados

```
outputs/
├── PLANO-CAMPANHA-COMPLETA.md        # texto no Git
├── HANDOFF.md
├── FORMATOS-DE-CONTEUDO.md
├── campanhas/                        # textos no Git, PNGs no Archive
├── inteligencia/                     # textos no Git
├── multiplicar/                      # textos no Git, PNGs no Archive
├── conteudo-cultos/
└── reunioes/
```

### 4. Apps (produtos) — `apps/`
Aplicações que rodam (UI, cron, deploys).

```
apps/
├── conteudo/                         # portal Vercel (HTML/CSS/JS estático)
│   ├── index.html
│   ├── aprovar/                      # interface do aprovador externo
│   ├── admin/                        # painel admin
│   ├── conteudo/                     # material publicável
│   ├── assets/, img/                 # 1750 imagens
│   └── vercel.json
└── publisher-instagram/              # cron de publicação automática
    ├── publisher.mjs
    ├── publicar/                     # fila pendente
    ├── publicado/                    # já publicados
    └── logs/
```

### 5. Documentação humana — `docs/`
Os manuais que você está lendo. **Não tem código aqui.**

---

## Sistema de agentes (mais detalhes)

### Tier 0 — Orquestrador
**`@content-chief`** — Imperador. Diagnostica, recomenda, delega. **NÃO cria conteúdo.**

Workflow típico:
```
você diz: "preciso de algo sobre fé na crise"
   ↓
content-chief: "qual o objetivo? atrair / mudar percepção / esquentar / vender?"
   ↓
você responde
   ↓
content-chief prescreve: "Carrossel 10 slides, Tipo Crença, Framework Abertura Curiosa"
   ↓
content-chief delega: @carousel-creator
   ↓
carousel-creator escreve → @content-validator valida → PNG renderiza
```

### Tier 1 — Criadores
Cada um especializado num formato:
- `@carousel-creator` — carrosseis
- `@reels-creator` — roteiros de Reels
- `@stories-strategist` — sequências de Stories
- `@print-tweet-creator` — reflexão estilo X/Twitter
- `@strategist` — campanhas E1-E8
- `@positioning-expert` — bio, CLC, StoryAds
- `@competitor-analyst` — análise de concorrentes

### Tier 2 — Operação
- `@content-planner` — calendário editorial
- `@content-repurposer` — adapta entre formatos (carrossel → reels)
- `@content-validator` — **gatekeeper**, Layer 0 (Anti-IA) + Layer 1 (Oráculo) + Layer 2 (tom)

### Especiais
- `@publishing-manager` (se ativo) — gestão de publicação

---

## Sistema de validação em 3 camadas

Todo texto gerado passa por:

```
texto criado
    │
    ▼
┌────────────────────────────────────┐
│ LAYER 0 — Filtro Anti-IA           │ ← BLOQUEANTE
│ • Script grep determinístico       │   (sem aprovação,
│ • Detecta: travessão, sequências   │    publisher.mjs
│   genéricas, jargão IA, etc        │    rejeita)
└────────────────────────────────────┘
    │ passou
    ▼
┌────────────────────────────────────┐
│ LAYER 1 — Oráculo de formato       │ ← score >= 80%
│ • Checklist por formato            │
│ • Carrossel: 8 critérios           │
│ • Reels: 6 critérios               │
└────────────────────────────────────┘
    │ aprovado
    ▼
┌────────────────────────────────────┐
│ LAYER 2 — Tom Castelo Forte        │
│ • Voice DNA aplicado?              │
│ • Anti-padrões respeitados?        │
│ • Expressões assinatura presentes? │
└────────────────────────────────────┘
    │ aprovado
    ▼
PRONTO PRA PUBLICAR
```

O `@content-validator` é o agente que orquestra essas 3 camadas.

---

## Sistema de archive (mídia pesada)

### Por que separar Git e mídia?
Git versiona linha-a-linha. PNG/MP4 viram blob binário gigante. 835MB de mídia no repo:
- Faria `git clone` levar 20+ minutos
- Cada `git pull` traria megabytes de blob inúteis
- GitHub rejeitaria arquivos individuais >100MB

**Solução:** texto vai pro Git, mídia vai pro Supabase Storage. Sob demanda.

### Como funciona
```
Supabase Bucket (carrossel-images)
└── castelo-forte-archive/
    ├── campanhas/
    │   └── em-cristo-antecipacao/
    │       ├── carrossel-01.png
    │       ├── carrossel-02.png
    │       └── ...
    ├── inteligencia/
    ├── multiplicar/
    ├── vercel-deploy/
    └── (outras pastas)
```

Scripts:
- `upload-archive.mjs` — sobe pasta local
- `list-archive.mjs` — lista o que existe
- `pull-archive.mjs` — baixa pasta sob demanda

Detalhes em `docs/ARCHIVE.md`.

---

## Sistema de publicação

### Componentes
1. **`publisher.mjs`** — script Node que faz upload + Graph API call
2. **Supabase Storage** — hosting temporário do PNG (Meta API precisa URL pública)
3. **Meta Graph API** — endpoint de criação e publicação de containers
4. **LaunchAgent macOS** — cron que dispara o publisher nos horários
5. **Filtro Anti-IA** — gate bloqueante antes de qualquer publicação

### Fluxo de 1 publicação
```
LaunchAgent (08:00 BRT)
   ↓
publisher.mjs
   ↓
loadQueue() → encontra post #N na janela
   ↓
validateAntiIA(legenda.md) → exit 0?
   │
   ├─ exit != 0: BLOQUEIA, notifica, marca failed
   │
   └─ exit 0: uploadToSupabase(post.png) → URL pública
       ↓
       graphPost(/{IG_ID}/media, {image_url, caption}) → container_id
       ↓
       aguarda container ficar FINISHED (polling 30x a cada 2s)
       ↓
       graphPost(/{IG_ID}/media_publish, {creation_id}) → media_id
       ↓
       archive(post, result) → move pra publicado/
```

### Janela de execução
Cada post é publicado se o **horário agora** estiver em [`scheduled_at - 5min`, `scheduled_at + 10min`]. Se passou, ele fica esperando próxima execução do publisher (e se a janela passar, marca como failed e nunca publica).

---

## Quem grava onde

| Quem | O que grava | Onde |
|---|---|---|
| `@content-chief` | Nada (só direciona) | — |
| `@carousel-creator` | Carrosseis | `outputs/{tipo}/{slug}/` |
| `@reels-creator` | Roteiros | `outputs/reels/{slug}/` |
| `@content-validator` | Score de validação | `outputs/{tipo}/{slug}/validacao.md` |
| `publisher.mjs` | Logs + result.json | `apps/publisher-instagram/{logs,publicado}/` |
| `upload-archive.mjs` | PNGs/MP4s pesados | Supabase `castelo-forte-archive/` |

---

## Quem lê o quê

Antes de criar QUALQUER peça, os agentes leem:

| Camada | Arquivos |
|---|---|
| **Universal (squad)** | `data/regras-inviolaveis.md`, `data/tipos-de-post.md`, `data/frameworks-copy.md`, `checklists/filtro-anti-ia.md` |
| **Cliente (workspace)** | `voice/nucleo.md`, `voice/expression.md`, `voice/aberturas-poderosas.md`, `voice/anti-padroes.md` |
| **Contexto (outputs)** | `PLANO-CAMPANHA-COMPLETA.md`, `HANDOFF.md`, peças anteriores da mesma campanha |

---

## Dependências externas

| Serviço | Para que | Custo |
|---|---|---|
| **Claude Code** | Operação do squad | Plano Anthropic |
| **Supabase Storage** | Hosting de mídia (archive + publicações) | Free tier + uso |
| **Meta Graph API** | Publicar no Instagram | Grátis |
| **Gemini API** (opcional) | Geração de imagens IA | Grátis até 500/dia |
| **OpenRouter** (opcional) | Modelos alternativos | Pay-per-use |
| **Apify** (opcional) | Scraping de concorrentes | Free tier + uso |

---

## Convenção de nomes

| Tipo | Padrão | Exemplo |
|---|---|---|
| Slug de campanha | `kebab-case` | `em-cristo-antecipacao` |
| Pasta de post na fila | `NN-YYYY-MM-DD-HHMM-slug` | `15-2026-05-25-1900-domingo-pentecostes` |
| Slug de peça | `kebab-case` curto | `feso-na-crise` |
| Branch Git | `tipo/breve-descricao` | `voice/tom-mais-suave` |
| Commit | `tipo(escopo): descricao` | `voice(castelo): suaviza tom semana santa` |

---

## Próximas leituras

- Operação dia a dia: `docs/USO.md`
- Como criar conteúdo: `docs/CRIAR-CONTEUDO.md`
- Como publicar: `docs/PUBLICAR.md`
- Como alterar: `docs/ALTERAR.md`
- Erros comuns: `docs/TROUBLESHOOTING.md`
