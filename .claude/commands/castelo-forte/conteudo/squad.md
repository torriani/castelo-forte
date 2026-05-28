---
description: "Mostra status e capacidades do squad de conteúdo Castelo Forte"
---

Você está no repositório **Castelo Forte**. O usuário quer saber qual squad está ativo e o que ele pode fazer.

Mostre **exatamente isto** (formatado bonito):

# Squad Conteúdo — Castelo Forte (ATIVO)

**Cliente:** Igreja Castelo Forte (@castelofortefloripa)
**Localização:** ~/claude/castelo-forte/squads/conteudo/
**Repositório:** github.com/torriani/castelo-forte

## Slash commands deste repo

**Fluxos (`castelo-forte:conteudo:*`):**
```
/castelo-forte:conteudo:squad         ← você acabou de rodar este
/castelo-forte:conteudo:criar         ← criar carrossel, reels, stories
/castelo-forte:conteudo:multiplicar   ← multiplicar live/aula em 30+ peças
/castelo-forte:conteudo:validar       ← validar texto Anti-IA + Oráculo
/castelo-forte:conteudo:portal        ← operações portal de aprovação
```

**Apps (`castelo-forte:apps:*`):**
```
/castelo-forte:apps:conteudo:dev      ← sobe portal local em http://localhost:8080
```

## Agentes — ative via slash command ou `@nome`

Cada agente tem slash command próprio no padrão `/castelo-forte:conteudo:<nome>` que ativa a persona completa. Alternativa: `@nome-curto` ou `@castelo-forte:conteudo:nome-completo`.

### Tier 0 — Orquestrador
- `/castelo-forte:conteudo:content-chief` — Imperador do squad, comece por aqui

### Tier 1 — Criadores (4)
- `/castelo-forte:conteudo:carousel-creator` — Carrosseis 1-10 slides
- `/castelo-forte:conteudo:reels-creator` — Roteiros de Reels 15-90s
- `/castelo-forte:conteudo:stories-strategist` — Sequências de Stories
- `/castelo-forte:conteudo:print-tweet-creator` — Reflexões 3-12 linhas

### Tier 1 — Estrategistas (3)
- `/castelo-forte:conteudo:strategist` — Campanhas E1-E8 multi-formato
- `/castelo-forte:conteudo:content-suggester` — Munição diária data-driven
- `/castelo-forte:conteudo:positioning-expert` — Bio, CLC, StoryAds, 21 dias

### Tier 1 — Pesquisa e Operação (3)
- `/castelo-forte:conteudo:competitor-analyst` — Análise de outras igrejas
- `/castelo-forte:conteudo:daily-monitor` — Sentinela diária de concorrentes
- `/castelo-forte:conteudo:publishing-manager` — Pipeline render + publish

### Tier 2 — Suporte (4)
- `/castelo-forte:conteudo:content-planner` — Calendário editorial
- `/castelo-forte:conteudo:content-repurposer` — Adapta entre formatos
- `/castelo-forte:conteudo:content-validator` — Gatekeeper Anti-IA + Oráculo
- `/castelo-forte:conteudo:performance-tracker` — Métricas pós-publicação

## Regras inegociáveis
1. **Filtro Anti-IA v3.7** (`squads/conteudo/scripts/validate-anti-ia.sh`)
2. **Teologia do Reino** como combustível da copy
3. **Voice DNA Castelo Forte** carregado SEMPRE antes de criar
4. NUNCA usar travessão (—, –)
5. Português brasileiro com acentuação completa
6. Outputs em `outputs/`, nunca em `squads/`

## Manuais
- `docs/MANUAL.html` (visual, abra no browser)
- `docs/SETUP.md`
- `docs/CRIAR-CONTEUDO.md`
- `docs/PORTAL.md`
- `docs/PUBLICAR.md`
- `docs/ALTERAR.md`
- `docs/TROUBLESHOOTING.md`
