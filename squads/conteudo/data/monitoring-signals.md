# Monitoring Signals

> Sinais e thresholds que o daily-monitor deve rastrear para detectar tendencias,
> oportunidades e alertas de fadiga no ecossistema de concorrentes.

---

## Metricas por Post de Concorrente

Cada post rastreado deve coletar:

| Metrica | Fonte | Prioridade |
|---------|-------|------------|
| Likes | API / scraping | ALTA |
| Comments | API / scraping | ALTA |
| Saves | Estimado (proxy: engagement rate - likes - comments) | MEDIA |
| Shares | Estimado (proxy: sends per reach) | MEDIA |
| Reach estimado | Calculado: (likes / engagement_rate_media) | MEDIA |
| Tipo de post | Manual / classificacao | ALTA |
| Formato | Carrossel / Reels / Single / Stories | ALTA |
| Topico/tema | Classificacao automatica | ALTA |
| Hashtags usadas | Scraping | BAIXA |
| Horario de publicacao | Timestamp | MEDIA |

---

## Frequencia de Coleta

| Categoria | Concorrentes | Frequencia | Justificativa |
|-----------|-------------|------------|---------------|
| Top 5 | Concorrentes diretos, mesma audiencia | 1x/dia | Deteccao rapida de trends |
| Secundarios | Concorrentes adjacentes, nichos proximos | 2x/semana | Monitoramento de movimentacao |
| Inspiracionais | Contas fora do nicho com alta performance | 1x/semana | Benchmarks criativos |

**Top 5 concorrentes:** definidos no arquivo de configuracao do squad. Revisados mensalmente.

---

## Thresholds de Alerta

### TREND
- **Trigger:** Engagement sobe 30%+ vs media dos ultimos 7 dias
- **Em quantas contas:** 3+ contas na mesma semana
- **Acao:** Registrar topico + formato. Avaliar oportunidade de criacao.

### TREND FORTE
- **Trigger:** Engagement sobe 50%+ vs media dos ultimos 30 dias
- **Em quantas contas:** 2+ contas
- **Acao:** Alerta imediato para content-chief. Priorizar criacao.

### EMERGENTE
- **Trigger:** Topico novo aparece em 3+ concorrentes na mesma semana
- **Condicao:** Topico nao existia no radar antes (primeira ocorrencia)
- **Acao:** Classificar como oportunidade. Verificar se temos conteudo sobre.

### FADIGA DE AUDIENCIA
- **Trigger:** Queda de engagement 20%+ vs media dos ultimos 14 dias
- **Em quem:** Na NOSSA conta (nao concorrentes)
- **Acao:** Revisar proporcao de conteudo. Verificar repeticao de temas. Considerar mudanca de formato.

### SATURADO
- **Trigger:** 5+ concorrentes postaram sobre o mesmo tema nos ultimos 7 dias
- **Acao:** Evitar publicar sobre o tema OU encontrar angulo radicalmente diferente.

### OPORTUNIDADE
- **Trigger:** Trend detectado + zero posts nossos sobre o topico
- **Acao:** Criar brief para content-chief com dados do trend.

### URGENTE
- **Trigger:** Oportunidade detectada + trending ascendente nos ultimos 2 dias
- **Acao:** Janela de oportunidade fechando. Prioridade maxima de criacao.

---

## Armazenamento de Dados

| Dado | Local | Retencao |
|------|-------|----------|
| Metricas brutas | `data/monitoring/raw/` | 90 dias |
| Alertas disparados | `data/monitoring/alerts/` | Indefinido |
| Trends confirmados | `data/monitoring/trends/` | Indefinido |
| Snapshots de concorrentes | `data/monitoring/snapshots/` | 30 dias |

---

## Integracao com Outros Sistemas

- **trend-detection-rules.md:** Usa os thresholds deste arquivo para classificar trends
- **performance-patterns.md:** Compara nossos dados com os trends detectados
- **benchmark-database.md:** Atualiza benchmarks com dados reais de concorrentes
- **content-chief:** Recebe alertas de OPORTUNIDADE e URGENTE para priorizar criacao
