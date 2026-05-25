# Castelo Forte — Contexto Automático

Este repositório é o **centro operacional da Igreja Castelo Forte**. Contém apps, squads de inteligência (agentes), dados da igreja e tudo que é produzido.

**Cliente único:** `igreja-castelo-forte` (@castelofortemandaqui).

---

## Squads disponíveis (ativam via @ direto)

Os agentes carregam automaticamente quando você abre Claude Code aqui. Ative pelo nome:

| Comando | Agente | Quando usar |
|---|---|---|
| `@content-chief` | Imperador do squad, orquestrador | **Sempre comece por aqui pra criar conteúdo** |
| `@carousel-creator` | Cria carrosseis (1-10 slides) | Direto se já sabe que é carrossel |
| `@reels-creator` | Roteiros de Reels (15-90s) | Direto se já sabe que é reels |
| `@stories-strategist` | Sequências de Stories | Direto se já sabe que é stories |
| `@print-tweet-creator` | Print-tweets (reflexão 3-12 linhas) | Direto se é frase de reflexão |
| `@strategist` | Campanhas E1-E8 multi-formato | Lançamento, semana temática |
| `@positioning-expert` | Bio, CLC, StoryAds | Posicionamento de marca |
| `@competitor-analyst` | Análise de outras igrejas | Inteligência competitiva |
| `@content-planner` | Calendário editorial | Planejamento de feed |
| `@content-repurposer` | Adapta carrossel → reels → stories | Reaproveitar peça aprovada |
| `@content-validator` | **Gatekeeper Anti-IA + Oráculo** | Validar texto pronto |

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
