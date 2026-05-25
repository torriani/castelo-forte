# Suggest Daily — Sugestao Diaria de Conteudo

## Task Anatomy

- **task_name:** Suggest Daily
- **executor:** content-suggester (Tier 1)
- **elicit:** true
- **description:** Gerar 3 sugestoes diarias de carrossel baseadas em dados de monitoramento + performance historica
- **pre_conditions:**
  - Relatorio de monitoramento disponivel (monitoring-report-YYYY-MM-DD.md)
  - Dados de performance historica atualizados (data/performance-patterns.md)
- **post_conditions:**
  - 3 sugestoes rankeadas por ROI previsto
  - Cada sugestao com configuracao completa (tema, tipo, framework, intencao)
  - Handoff para content-chief para aprovacao
- **veto_conditions:**
  - Sugestao sem fundamentacao em dados reais (trend, gap ou padrao historico)
  - Relatorio de monitoramento ausente ou com mais de 24h
  - Sugestoes que violem proporcao 50/25/25 (Tensao/Alinhamento/Demonstracao)
- **completion_criteria:**
  - 3 sugestoes geradas com configuracao completa
  - Cada sugestao tem justificativa rastreavel a dado real
  - Ranking por ROI previsto calculado
  - Proporcao de conteudo respeitada

## Steps

### 1. Carregar Dados

- Ler relatorio diario do @daily-monitor
- Ler data/performance-patterns.md (historico interno)
- Ler data/learned-heuristics.md (heuristicas aprendidas)
- Identificar sinais prioritarios (trends urgentes, gaps criticos)

### 2. Gerar Sugestoes

Perguntar ao usuario:
1. **Tem preferencia de tema ou intencao para hoje?** (ou deixar 100% data-driven)

Para cada sugestao:
- Definir tema, tipo de post, framework de copy, intencao, nivel de consciencia
- Calcular ROI previsto com base em padroes historicos
- Incluir justificativa (qual dado fundamenta a sugestao)

### 3. Rankear e Apresentar

- Rankear por ROI previsto (maior primeiro)
- Apresentar as 3 sugestoes com resumo visual
- Aguardar aprovacao do usuario

### 4. Handoff

- Entregar sugestoes aprovadas para @content-chief com briefing completo
- Registrar no historico para feedback loop futuro

## Output Example

```
## SUGESTOES DIARIAS — 2026-03-29

### #1 — ROI Previsto: 8.2/10
- **Tema:** "Cobrar barato e estrategia de sobrevivencia"
- **Tipo:** Imperial | **Framework:** Abertura Curiosa | **Tamanho:** 10 slides
- **Intencao:** Consciencia | **Consciencia Schwartz:** Nivel 2
- **Justificativa:** Trend detectado: 3 concorrentes postaram sobre precificacao nas ultimas 48h com engagement 45% acima do baseline. Gap: nenhum post nosso sobre precificacao nos ultimos 14 dias.
- **ROI base:** Posts tipo Imperial + Abertura Curiosa tem engagement medio de 4.2% (historico 90d)

### #2 — ROI Previsto: 7.5/10
- **Tema:** "Consistencia sem estrategia e barulho"
- **Tipo:** Crenca | **Framework:** Segredo Revelado | **Tamanho:** 7 slides
- **Intencao:** Consciencia | **Consciencia Schwartz:** Nivel 3
- **Justificativa:** Padrao historico: posts tipo Crenca no formato 7 slides tem 35% mais saves. Oportunidade sazonal: inicio de semana = audiencia receptiva a provocacao.
- **ROI base:** Posts Crenca tem save rate medio de 6.1% (top 20% do feed)

### #3 — ROI Previsto: 6.8/10
- **Tema:** "O erro fatal de quem posta todo dia"
- **Tipo:** Polemico | **Framework:** Problema/Solucao | **Tamanho:** 5 slides
- **Intencao:** Atracao | **Consciencia Schwartz:** Nivel 1
- **Justificativa:** Reforco de trend: topico "frequencia vs estrategia" em alta. Heuristica aprendida: posts polemicos curtos (5 slides) tem share rate 2x maior que longos.
- **ROI base:** Posts Polemicos curtos: share rate medio 3.8%

---
Qual sugestao aprovar? (1, 2, 3, todas, ou modificar)
```

### Veto Conditions

- id: "CONT_SUGGEST_DAILY_001"
  condition: "Relatorio de monitoramento ausente ou desatualizado (> 24h)"
  check: "Verificar se monitoring-report do dia existe e tem menos de 24h"
  result: "VETO - BLOCK. Executar monitor-daily antes de gerar sugestoes"
  rationale: "Sugestoes sem dados atualizados sao baseadas em achismo, nao em evidencia"

- id: "CONT_SUGGEST_DAILY_002"
  condition: "Sugestao sem fundamentacao em dados reais (trend, gap ou padrao historico)"
  check: "Verificar se cada sugestao tem justificativa rastreavel a dado concreto"
  result: "VETO - BLOCK. Adicionar fundamentacao com dado real antes de apresentar sugestao"
  rationale: "Sugestoes sem evidencia nao permitem calcular ROI previsto com confianca"

### Completion Criteria

- [ ] 3 sugestoes geradas com configuracao completa (tema, tipo, framework, intencao)
- [ ] Cada sugestao com justificativa rastreavel a dado real (trend, gap ou padrao)
- [ ] Ranking por ROI previsto calculado com base em padroes historicos
- [ ] Proporcao 50/25/25 de conteudo respeitada nas sugestoes
