# Architecture — Squad Conteudo

## Tier Distribution

```
                    ┌─────────────────┐
         Tier 0     │  content-chief  │  Orchestrador
                    └────────┬────────┘
                             │ diagnostica + direciona
            ┌────────────────┼────────────────────────────┐
            │                │                            │
     ┌──────┴──────┐  ┌─────┴──────┐  ┌────────────┐  ┌──┴───────────────┐
T1   │carousel-    │  │reels-      │  │stories-    │  │strategist       │
     │creator      │  │creator     │  │strategist  │  │(E1-E8)          │
     └─────────────┘  └────────────┘  └────────────┘  └─────────────────┘
            │                │                │
     ┌──────┴──────┐  ┌─────┴──────┐  ┌──────┴──────┐
T1   │positioning- │  │competitor- │  │             │
     │expert       │  │analyst     │  │             │
     └─────────────┘  └────────────┘  └─────────────┘
            │                │                │
     ┌──────┴──────┐  ┌─────┴──────┐  ┌──────┴──────┐
T2   │content-     │  │content-    │  │content-     │
     │planner      │  │repurposer  │  │validator    │
     └─────────────┘  └────────────┘  └─────────────┘
```

## Agent Roles

| Tier | Agent | Role | Entrada | Saida |
|------|-------|------|---------|-------|
| 0 | content-chief | Orchestrador | Briefing do usuario | Diagnostico + delegacao |
| 1 | carousel-creator | Criador | Config (6 params) | Carrossel completo |
| 1 | reels-creator | Criador | Config (6 params) | Roteiro de Reels |
| 1 | stories-strategist | Criador | Config (tipo + intencao) | Sequencia de Stories |
| 1 | strategist | Estrategista | Objetivo + periodo | Campanha E1-E8 |
| 1 | positioning-expert | Posicionamento | Perfil + nicho | Bio/CLC/StoryAds |
| 1 | competitor-analyst | Pesquisador | Perfis alvo | Analise comparativa |
| 2 | content-planner | Planejador | Avatar + objetivos | Calendario + ideias |
| 2 | content-repurposer | Adaptador | Conteudo existente | Formatos derivados |
| 2 | content-validator | Validador | Peca criada | Score + feedback |

## Data Dependencies

```
agents/content-chief.md
  └── data/nucleo.md
  └── data/expression.md
  └── data/tipos-de-post.md
  └── data/frameworks-copy.md
  └── data/aberturas-poderosas.md
  └── data/regras-inviolaveis.md

agents/carousel-creator.md
  └── data/nucleo.md
  └── data/expression.md
  └── data/tipos-de-post.md
  └── data/frameworks-copy.md
  └── data/aberturas-poderosas.md
  └── data/hooks-bank.md
  └── data/cta-bank.md
  └── data/regras-inviolaveis.md
  └── data/cliches-proibidos.md
  └── data/swipe-posts.md

agents/reels-creator.md
  └── data/nucleo.md
  └── data/reels-framework.md
  └── data/reels-imperial.md
  └── data/reels-patterns.md
  └── data/reels-swipefile.md
  └── data/hooks-bank.md

agents/content-validator.md
  └── checklists/oraculo-posts.md
  └── checklists/oraculo-reels.md
  └── checklists/content-rules.md
```

## Workflow Flows

### wf-create-content (peca unica)
```
content-chief → [creator agent] → content-validator → output
```

### wf-campaign (multi-formato)
```
content-chief → strategist → carousel-creator ─┐
                            → reels-creator    ├→ content-validator → output
                            → stories-strategist┘
```

### wf-multiplicar (1 → 30+)
```
ingest-pillar → content-chief (routing) → carousel-creator (carrosseis)
                                        → reels-creator (roteiros)
                                        → stories-strategist (stories)
                                        → carousel-creator (frases impacto)
                                        → content-validator (validacao)
```

## Sources

| Fonte | Cobertura | Agents Primarios |
|-------|-----------|-----------------|
| AGENTE IMPERADOR | Posts, hooks, CTAs, Oraculo | carousel-creator, content-chief, content-validator |
| AGENTE BLAZE | Reels, 6 blocos, 7 padroes | reels-creator |
| BRANDCONTENT | 9 frameworks copy, 5 aberturas | carousel-creator, content-chief |
