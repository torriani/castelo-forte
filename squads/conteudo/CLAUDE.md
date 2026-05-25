# Squad Conteúdo — Castelo Forte

Este arquivo carrega automaticamente toda vez que o Claude Code abre dentro de `squads/conteudo/` ou subpasta. Define como o squad funciona, onde estão as coisas, e como executar cada fluxo.

**Cliente único deste repositório:** `igreja-castelo-forte` (@castelofortemandaqui).

Tudo neste repo é dedicado à Igreja Castelo Forte. Outputs sempre vão para `outputs/...`.

---

## O que este squad faz

Cria e publica conteúdo de Instagram para a **Igreja Castelo Forte**. Pipeline completo: briefing → copy → arte (PNG) → publicação automática.

**Outputs vão para:** `outputs/` (NUNCA gravar dentro de `squads/conteudo/`).

**Workspace do cliente:** `workspace/businesses/igreja-castelo-forte/` (brand, voice DNA, identidade, campanhas).

---

## Os 3 fluxos principais

### 1. Criar arte (print-tweet / quote card)

Gerador de imagem: `squads/conteudo/app/image-generator/generate.mjs`

```bash
cd squads/conteudo/app/image-generator
node generate.mjs --batch <arquivo.json> --output <pasta-saida>/
```

- Formato do JSON: `{ defaultTemplate, meta, slides: [{ template, title, body }] }`
- `body` aceita `**negrito**` (linha inteira em negrito; o parser quebra linhas longas mantendo o bold)
- Limite de ~40 caracteres por linha antes de quebrar
- Para corrigir uma arte existente: editar o `body` no JSON, rodar o gerador apontando saída pro mesmo PNG (sobrescreve in-place)

### 2. Criar carrossel

Comando: ative `@content-chief` e use `*carrossel`, ou siga `squads/conteudo/tasks/create-carousel.md`.

Renderização sem LLM: `squads/conteudo/scripts/render-carrossel.mjs`
```bash
node squads/conteudo/scripts/render-carrossel.mjs <arquivo.md> --template <modelo>
```

**Catálogo canônico:** `squads/conteudo/templates/catalog.yaml`. Preview navegável em `squads/conteudo/templates/CATALOGO.html`.

**Comandos do Content Chief:**
- `*templates` — lista todos os templates do catálogo
- `*templates igreja-castelo-forte` — filtra pelos templates definidos em `workspace/businesses/igreja-castelo-forte/brand/templates.yaml` (se existir)

### 3. Publicar no Instagram

**Pipeline pronto em** `apps/publisher-instagram/`

**Como funciona:**
- `publisher.mjs` — pega o próximo post da fila, faz upload pro Supabase Storage, publica via Meta Graph API
- LaunchAgent `com.castelo-forte.instagram-publisher` (configurar no setup) roda automaticamente nos horários definidos
- Posts ficam em `publicar/NN-YYYY-MM-DD-HHMM-slug/` (cada um com `post.png` + `post.json` + `legenda.md`)
- Após publicar, move para `publicado/` e salva `result.json` com `media_id`

**Slash commands disponíveis:**
- `/publicar-status` — status da fila
- `/publicar-log` — log do dia
- `/publicar-agora N` — força publicação manual do post #N
- `/publicar-pause` — desativa o cron
- `/publicar-resume` — reativa o cron
- `/publicar` — skill de publicação manual de post avulso (com dry-run + aprovação)

**Credenciais:** configurar em `apps/publisher-instagram/.env` (ver `.env.example`).

**Documentação completa:** `apps/publisher-instagram/README.md` e `docs/PUBLICAR.md`.

---

## Sistema de agentes

Entry point: `@content-chief`.

| Tier | Agente | Função |
|------|--------|--------|
| 0 | content-chief | Orquestrador, diagnostica e delega |
| 1 | carousel-creator | Cria carrosséis |
| 1 | reels-creator | Cria roteiros de Reels |
| 1 | stories-strategist | Cria sequências de Stories |
| 1 | print-tweet-creator | Cria print-tweets (reflexão, 3-12 linhas) |
| 1 | strategist | Campanhas E1-E8 |
| 1 | positioning-expert | Bio, CLC, StoryAds |
| 1 | competitor-analyst | Análise de concorrentes |
| 2 | content-planner | Calendário editorial |
| 2 | content-repurposer | Adapta conteúdo entre formatos |
| 2 | content-validator | Valida pelo Oráculo (score >= 80%) |

Arquitetura completa: `squads/conteudo/ARCHITECTURE.md`.

---

## Dados de referência

### Universal (mecânica do squad)
- `squads/conteudo/data/tipos-de-post.md` — 7 tipos narrativos
- `squads/conteudo/data/frameworks-copy.md` — 9 frameworks de abordagem
- `squads/conteudo/data/regras-inviolaveis.md` — regras de execução
- `squads/conteudo/data/padrao-dopamine-ladder.md` — progressão emocional
- `squads/conteudo/data/REGRA-DNA-CLIENTE.md` — NON-NEGOTIABLE: como carregar DNA verbal antes de criar peça

### DNA verbal da Castelo Forte (workspace)
**SEMPRE** carregar antes de criar conteúdo:
- `workspace/businesses/igreja-castelo-forte/brand/voice/nucleo.md` — tom de voz
- `workspace/businesses/igreja-castelo-forte/brand/voice/expression.md` — frases assinatura
- `workspace/businesses/igreja-castelo-forte/brand/voice/aberturas-poderosas.md` — hooks
- `workspace/businesses/igreja-castelo-forte/brand/voice/anti-padroes.md` — o que a igreja NUNCA diz
- `workspace/businesses/igreja-castelo-forte/brand/content-guardrails.yaml` (se existir)

### Histórico de outputs (no Git)
- `outputs/PLANO-CAMPANHA-COMPLETA.md` — plano mestre
- `outputs/HANDOFF.md` — handoff entre operadores
- `outputs/FORMATOS-DE-CONTEUDO.md` — formatos catalogados
- `outputs/conteudo-cultos/` — material por culto
- `outputs/campanhas/` — campanhas (só MDs)
- `outputs/inteligencia/` — pesquisa e análise (só MDs)

### Histórico de mídia (Supabase Archive)
Carrosseis publicados, PNGs, MP4s e outros assets pesados ficam no Supabase Storage (bucket `castelo-forte-archive`). Para baixar sob demanda:

```bash
node squads/conteudo/scripts/list-archive.mjs                            # lista o que existe
node squads/conteudo/scripts/pull-archive.mjs --campanha em-cristo-antecipacao   # baixa uma campanha
```

Ver `docs/ARCHIVE.md`.

---

## Regras de conteúdo (NUNCA violar)

- **FILTRO ANTI-IA UNIVERSAL (Layer 0, veto bloqueante):** TODO texto gerado por qualquer agente passa pelo `squads/conteudo/checklists/filtro-anti-ia.md` ANTES (camada 1) e DEPOIS (§9 TESTE FINAL, camada 2). O `@content-validator` é o guardião. Compliance binário: 1 violação = reprovação total.
- **VALIDAÇÃO MECÂNICA OBRIGATÓRIA:** Antes de entregar qualquer output com texto, rodar `squads/conteudo/scripts/validate-anti-ia.sh <arquivo> [--html|--json]`. Exit 0 = aprovado. Exit 1 = corrigir e rodar de novo até passar.
- Todo conteúdo user-facing em **português brasileiro** com acentuação completa (á, é, ç, ã, õ, ê, í, ó, ú). Escrever sem acento é erro grave.
- **NUNCA usar travessão (—, –)** em nenhum texto gerado. Substituir por vírgula, ponto, dois pontos, parênteses ou quebra de linha.
- Outputs SEMPRE em `outputs/`, nunca dentro de `squads/conteudo/`.
- Antes de marcar arte como pronta, conferir que o PNG renderizou (não só que o JSON está válido).

---

## Convenção da fila de publicação

Cada post na fila é uma pasta: `NN-YYYY-MM-DD-HHMM-slug/`
- `NN` = ordem (01, 02...)
- `YYYY-MM-DD-HHMM` = data/hora de publicação (BRT)
- `slug` = identificador curto

Dentro: `post.png` (imagem), `post.json` (body + meta), `legenda.md` (caption do Instagram).

Para adicionar post à fila: criar a pasta com os 3 arquivos, apagar `queue.json` (regenera sozinho).

---

## Documentação humana (LEIA PRIMEIRO se for novo no squad)

- **Setup primeiro dia:** `docs/SETUP.md`
- **Manual de uso:** `docs/USO.md`
- **Como criar conteúdo:** `docs/CRIAR-CONTEUDO.md`
- **Como publicar:** `docs/PUBLICAR.md`
- **Como editar voice/brand/templates/agents:** `docs/ALTERAR.md`
- **Arquitetura geral:** `docs/ARQUITETURA.md`
- **Erros comuns:** `docs/TROUBLESHOOTING.md`
- **Sistema de archive (mídia histórica):** `docs/ARCHIVE.md`
