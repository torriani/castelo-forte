# Monitor Daily — Monitoramento Diario de Concorrentes

## Task Anatomy

- **task_name:** Monitor Daily
- **executor:** daily-monitor (Tier 1)
- **elicit:** false
- **description:** Executar ciclo completo de monitoramento diario — scraping, deteccao de trends e mapeamento de oportunidades
- **pre_conditions:**
  - Lista de concorrentes configurada (5-10 perfis)
  - Acesso a Apify Instagram scraper operacional
  - Baseline de 7+ dias de dados historicos
- **post_conditions:**
  - Relatorio diario gerado (monitoring-report-YYYY-MM-DD.md)
  - Trends classificados com confianca >= 70%
  - Oportunidades rankeadas por urgencia
  - Handoff para content-suggester com dados estruturados
- **veto_conditions:**
  - Falha no scraping de mais de 50% dos concorrentes — nao avancar com dados incompletos
  - Baseline insuficiente (menos de 7 dias) — usar classificacao conservadora
  - Dados inconsistentes entre fases — nao gerar relatorio com dados conflitantes
- **completion_criteria:**
  - Dados coletados de >= 50% dos concorrentes
  - Trends classificados (trend / noise / oportunidade sazonal)
  - Top 5 oportunidades com contexto e justificativa
  - Relatorio salvo e handoff realizado

## Elicitation (Setup Inicial)

Na primeira execucao ou quando nao houver configuracao previa, coletar:

1. **"Quais concorrentes monitorar?"** — Coletar lista de 5-10 handles do Instagram (ex: @handle1, @handle2)
2. **"Qual seu nicho/mercado?"** — Para contextualizar deteccao de trends
3. **"Qual a frequencia desejada?"** — Diaria (default), 2x por dia, ou sob demanda
4. **"Quais metricas priorizar?"** — Engagement rate, saves, shares, comments (default: todas)
5. **"Tem baseline historico?"** — Se ja monitorou antes, carregar dados existentes. Se nao, informar que os primeiros 7 dias serao de coleta de baseline.
6. **"Quer alertas automaticos?"** — Se engagement de concorrente ultrapassa X% do baseline, gerar alerta imediato

Configuracao salva em `data/monitor-config.yaml` para execucoes futuras.

## Steps

### 1. Scrape Concorrentes

- Executar Apify Instagram scraper nos concorrentes configurados
- Coletar posts das ultimas 24h com engagement (likes, comments, saves, shares)
- Extrair captions e hashtags

### 2. Detectar Trends

- Calcular baseline de engagement dos ultimos 7 dias por concorrente
- Comparar posts das ultimas 24h contra baseline
- Identificar topicos com engagement acima de 30% do baseline
- Classificar: trend / noise / oportunidade sazonal
- Filtrar falsos positivos (post viral unico vs tendencia real)

### 3. Mapear Oportunidades

- Cruzar trends com historico de posts publicados (30 dias)
- Identificar gaps (trends sem post nosso) e oportunidades de reforco
- Rankear por urgencia (trend velocity + gap size)

### 4. Gerar Relatorio

- Consolidar top 5 oportunidades com justificativa
- Incluir trends detectados, metricas de concorrentes, baseline atualizado
- Salvar monitoring-report-YYYY-MM-DD.md
- Handoff para @content-suggester

## Output Example

```
## MONITORING REPORT — 2026-03-29

### Resumo Executivo
- Concorrentes monitorados: 8/10 (80%)
- Posts coletados ultimas 24h: 23
- Trends detectados: 3 (2 confirmados, 1 sazonal)
- Oportunidades identificadas: 5

### Trends Detectados

| # | Topico | Confianca | Tipo | Evidencia |
|---|--------|-----------|------|-----------|
| 1 | Precificacao premium | 85% | Trend | 4 posts, engagement +52% vs baseline |
| 2 | Anti-consistencia | 78% | Trend | 3 posts, engagement +38% vs baseline |
| 3 | Retrospectiva trimestral | 72% | Sazonal | 2 posts, fim de trimestre |

### Top 5 Oportunidades

| # | Oportunidade | Urgencia | Gap | Acao Sugerida |
|---|-------------|----------|-----|---------------|
| 1 | Precificacao premium | ALTA | 14 dias sem post | Carrossel Imperial 10 slides |
| 2 | Anti-consistencia | ALTA | Nunca coberto | Carrossel Crenca 7 slides |
| 3 | Retrospectiva Q1 | MEDIA | Sazonal (3 dias) | Carrossel Historia 10 slides |
| 4 | Bastidores metodo | MEDIA | 21 dias sem post | Stories sequencia |
| 5 | Case de resultado | BAIXA | 7 dias sem post | Reels Storytelling |

### Handoff → @content-suggester
Dados estruturados entregues para geracao de sugestoes diarias.
```

### Veto Conditions

- id: "CONT_MONITOR_DAILY_001"
  condition: "Lista de concorrentes nao configurada"
  check: "Verificar se monitor-config.yaml existe com pelo menos 5 concorrentes"
  result: "VETO - BLOCK. Executar setup inicial de monitoramento antes de rodar ciclo diario"
  rationale: "Monitoramento sem lista de concorrentes nao tem dados para comparar"

- id: "CONT_MONITOR_DAILY_002"
  condition: "Baseline insuficiente (menos de 7 dias de dados historicos)"
  check: "Verificar se existem dados de pelo menos 7 dias para calculo de baseline"
  result: "VETO - BLOCK. Usar classificacao conservadora e informar que baseline ainda esta sendo construido"
  rationale: "Sem baseline, deteccao de trends gera falsos positivos com alta frequencia"

### Completion Criteria

- [ ] Dados coletados de >= 50% dos concorrentes configurados
- [ ] Trends classificados com confianca >= 70% (trend / noise / oportunidade sazonal)
- [ ] Top 5 oportunidades rankeadas por urgencia com contexto e justificativa
- [ ] Relatorio diario salvo e handoff para content-suggester realizado
