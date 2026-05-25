# Track Performance — Tracking de Metricas Pos-Publicacao

## Task Anatomy

- **task_name:** Track Performance
- **executor:** performance-tracker (Tier 2)
- **elicit:** true
- **description:** Coletar metricas pos-publicacao (24h/48h/7d), detectar padroes e alimentar learning loop
- **pre_conditions:**
  - Post publicado ha pelo menos 24h
  - Acesso a Instagram Graph API (ig-mcp) ou dados manuais
- **post_conditions:**
  - Metricas coletadas e armazenadas
  - Padroes detectados e registrados em data/performance-patterns.md
  - Heuristicas atualizadas em data/learned-heuristics.md (se aplicavel)
- **veto_conditions:**
  - Coletar metricas antes de 24h (dados ainda instáveis)
  - Registrar padrao com base em menos de 5 posts do mesmo tipo
  - Atualizar heuristica sem evidencia de pelo menos 3 observacoes consistentes
- **completion_criteria:**
  - Metricas coletadas nos 3 checkpoints (24h, 48h, 7d)
  - Comparacao com benchmark por tipo de post
  - Padroes detectados com evidencia
  - Learning loop atualizado se novo padrao confirmado

## Steps

### 1. Coletar Metricas

Perguntar ao usuario:
1. **Qual post analisar?** (link, titulo ou data de publicacao)

Coletar via ig-mcp ou manualmente:
- Impressoes, alcance, engagement (likes, comments, saves, shares)
- Taxa de engagement (engagement / alcance)
- Metricas de stories relacionados (se aplicavel)

### 2. Comparar com Benchmark

- Carregar data/benchmark-database.md
- Comparar metricas contra benchmark por tipo de post e framework
- Classificar performance: ACIMA / NA MEDIA / ABAIXO do benchmark

### 3. Detectar Padroes

- Comparar com posts anteriores do mesmo tipo
- Identificar variaveis que correlacionam com performance superior
- Registrar observacao em data/performance-patterns.md

### 4. Atualizar Learning Loop

- Se padrao confirmado (3+ observacoes consistentes): atualizar data/learned-heuristics.md
- Se anomalia detectada: registrar para investigacao futura
- Gerar resumo para @content-chief

## Output Example

```
## PERFORMANCE REPORT — "Cobrar barato e autossabotagem"
Publicado: 2026-03-22 | Tipo: Imperial | Framework: Abertura Curiosa | 10 slides

### Metricas

| Checkpoint | Impressoes | Alcance | Engagement | Saves | Shares |
|-----------|-----------|---------|------------|-------|--------|
| 24h | 4.200 | 3.800 | 312 | 89 | 24 |
| 48h | 6.100 | 5.400 | 478 | 142 | 38 |
| 7d | 11.300 | 9.200 | 724 | 201 | 52 |

### Benchmark (Imperial + Abertura Curiosa, ultimos 90d)

| Metrica | Este Post | Benchmark | Delta | Status |
|---------|----------|-----------|-------|--------|
| Engagement Rate | 7.9% | 4.2% | +88% | ACIMA |
| Save Rate | 2.2% | 1.8% | +22% | ACIMA |
| Share Rate | 0.6% | 0.4% | +50% | ACIMA |

### Padroes Detectados
1. Posts sobre precificacao tem engagement 2x acima da media (observacao #4 — CONFIRMADO)
2. Hook com comparacao numerica ("R$297 vs R$5.000") tem save rate 35% superior

### Learning Loop
- Heuristica atualizada: "Posts sobre precificacao com hook de comparacao numerica performam 2x acima do benchmark" (4 observacoes, confianca ALTA)
- Padrao registrado em data/performance-patterns.md
- Heuristica adicionada em data/learned-heuristics.md

### Handoff → @content-chief
Recomendacao: Priorizar tema "precificacao" nas proximas sugestoes diarias.
```

### Veto Conditions

- id: "CONT_TRACK_PERFORMANCE_001"
  condition: "Post publicado ha menos de 24h (dados ainda instaveis)"
  check: "Verificar se o post tem pelo menos 24h desde a publicacao"
  result: "VETO - BLOCK. Aguardar ate completar 24h antes de coletar metricas"
  rationale: "Metricas antes de 24h flutuam muito — analise prematura gera padroes falsos"

- id: "CONT_TRACK_PERFORMANCE_002"
  condition: "Padrao registrado com base em menos de 5 posts do mesmo tipo"
  check: "Verificar se existem pelo menos 5 posts do mesmo tipo para confirmar padrao"
  result: "VETO - BLOCK. Registrar como observacao (nao padrao confirmado) se menos de 5 posts"
  rationale: "Padroes com amostra pequena tem baixa confianca e podem induzir decisoes erradas"

### Completion Criteria

- [ ] Metricas coletadas nos 3 checkpoints (24h, 48h, 7d) com comparacao ao benchmark
- [ ] Performance classificada (ACIMA / NA MEDIA / ABAIXO) por tipo de post e framework
- [ ] Padroes detectados com evidencia de pelo menos 3 observacoes consistentes
- [ ] Learning loop atualizado se novo padrao confirmado (heuristicas e performance-patterns)
