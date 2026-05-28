# Castelo Forte — Contexto Automático

Este repositório é o **centro operacional da Igreja Castelo Forte**. Contém apps, squads de inteligência (agentes), dados da igreja e tudo que é produzido.

**Cliente único:** `igreja-castelo-forte` (@castelofortefloripa).

---

## Squads disponíveis (ativam via @ direto)

## Slash commands (/) — namespace castelo-forte:conteudo

Quando der `/` no Claude Code aqui, esses comandos aparecem identificados:

| Comando | O que faz |
|---|---|
| `/castelo-forte:conteudo:squad` | Mostra status e capacidades deste squad (comece por aqui se em dúvida) |
| `/castelo-forte:conteudo:criar` | Cria conteúdo novo (carrossel, reels, stories) |
| `/castelo-forte:conteudo:multiplicar` | Multiplica live/aula em 30+ peças |
| `/castelo-forte:conteudo:validar` | Valida texto pelo Anti-IA v3.7 + Oráculo |
| `/castelo-forte:conteudo:portal` | Operações do portal de aprovação |

## Agentes (@) — namespace castelo-forte:conteudo

Ative pelo nome direto (curto) ou pelo namespace completo:

| Curto | Namespace completo | Quando usar |
|---|---|---|
| `@content-chief` | `@castelo-forte:conteudo:content-chief` | **Imperador, comece aqui** |
| `@carousel-creator` | `@castelo-forte:conteudo:carousel-creator` | Carrosseis 1-10 slides |
| `@reels-creator` | `@castelo-forte:conteudo:reels-creator` | Reels 15-90s |
| `@stories-strategist` | `@castelo-forte:conteudo:stories-strategist` | Sequências de Stories |
| `@print-tweet-creator` | `@castelo-forte:conteudo:print-tweet-creator` | Reflexões 3-12 linhas |
| `@strategist` | `@castelo-forte:conteudo:strategist` | Campanhas E1-E8 |
| `@positioning-expert` | `@castelo-forte:conteudo:positioning-expert` | Bio, CLC, StoryAds |
| `@competitor-analyst` | `@castelo-forte:conteudo:competitor-analyst` | Análise concorrentes |
| `@content-planner` | `@castelo-forte:conteudo:content-planner` | Calendário editorial |
| `@content-repurposer` | `@castelo-forte:conteudo:content-repurposer` | Adapta entre formatos |
| `@content-validator` | `@castelo-forte:conteudo:content-validator` | **Gatekeeper Anti-IA + Oráculo** |

---

## Estrutura

```
castelo-forte/
├── apps/                          ← aplicações
│   ├── conteudo/                  ← portal Vercel (aprovação + admin)
│   └── publisher-instagram/       ← cron Instagram automático
├── squads/conteudo/               ← squad de copy (motor)
├── workspace/                     ← dados da igreja
└── outputs/                       ← histórico produzido
```

**Detalhes do squad:** `squads/conteudo/CLAUDE.md`
**Manuais humanos:** `docs/SETUP.md`, `docs/CRIAR-CONTEUDO.md`, `docs/PORTAL.md`

---

## Regras inegociáveis (TODO conteúdo deve seguir)

### 1. Filtro Anti-IA universal (Layer 0, BLOQUEANTE)
Antes de entregar qualquer texto, validar:
```bash
bash squads/conteudo/scripts/validate-anti-ia.sh <arquivo>
```
- Exit 0 = aprovado
- Exit 1 = reprovado (corrigir, rodar de novo)
- Sem aprovação, o publisher Instagram **BLOQUEIA publicação**.

### 2. Voice DNA da Castelo Forte (SEMPRE carregar antes de criar)
- `workspace/businesses/igreja-castelo-forte/brand/voice/nucleo.md` — tom de voz
- `workspace/businesses/igreja-castelo-forte/brand/voice/expression.md` — expressões assinatura
- `workspace/businesses/igreja-castelo-forte/brand/voice/anti-padroes.md` — o que NUNCA dizer

### 3. Teologia do Reino (padrão de escrita)
Toda copy carrega a teologia do reino conforme `nucleo.md`. Arquétipos: Mago/Cuidador/Criador. Pilares: identidade, chamado, sobrenatural, formação.

### 4. NUNCA usar travessão (—, –)
Substituir por vírgula, ponto, dois pontos, parênteses ou quebra de linha. Travessão denuncia IA.

### 5. Português brasileiro completo
Acentuação obrigatória (á, é, ç, ã, õ, ê, í, ó, ú). Escrever sem acento = erro grave.

### 6. Outputs vão pra `outputs/`, NUNCA dentro de `squads/`

### 7. PADRÃO ÚNICO DE ARTE: CASA DE ISABEL
Toda arte (carrossel, frase, quote) DEVE seguir o padrão Casa de Isabel:
- Fundo off-white `#efefef` · Texto midnight `#153247` · Body cinza `#5a6068`
- Fonte: **Inter 700** (headline) + **Playfair Display italic 500** (ênfase em palavra-chave)
- Logo Castelo Forte no canto superior direito (170px, opacity 0.85)
- Divider 1px vertical entre headline e body
- **NUNCA usar:** orange (`#fe5b06`) como acento, Archivo Black UPPERCASE, fundos escuros/coloridos como variantes
- Referência visual: `outputs/demo-casa-isabel-2026-05-25/`
- Templates: `squads/conteudo/templates/carousel/castelo-forte-{editorial,frase}/`
- Detalhes: `squads/conteudo/CLAUDE.md` (seção PADRÃO ÚNICO DE ARTE)

---

## Fluxos rápidos

| Quero... | Comando |
|---|---|
| Criar carrossel | `@content-chief` → `*briefing` |
| Criar reels | `@content-chief` → `*reels` |
| Multiplicar 1 live em 30+ peças | `@content-chief` → `*multiplicar` |
| Validar texto pronto | `@content-validator` |
| Ver status fila Instagram | `/publicar-status` |
| Publicar AGORA (avulso) | `/publicar` |
| Sincronizar portal de aprovação | `node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/publicar.mjs castelo-forte` |

---

## Primeira vez no projeto?

Leia `docs/SETUP.md` e siga o passo a passo (30-45min).

Depois consulte:
- `docs/USO.md` — referência de comandos
- `docs/CRIAR-CONTEUDO.md` — fluxos de criação
- `docs/PORTAL.md` — portal de aprovação
- `docs/PUBLICAR.md` — pipeline Instagram
- `docs/ALTERAR.md` — editar voice/brand/agentes
- `docs/ARQUITETURA.md` — visão geral
- `docs/TROUBLESHOOTING.md` — erros comuns
- `docs/ARCHIVE.md` — mídia histórica no Supabase
