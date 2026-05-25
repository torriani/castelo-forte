# Trend Detection Rules

> Regras para classificar movimentacoes detectadas pelo daily-monitor.
> Cada sinal coletado passa por este filtro antes de gerar acao.

---

## Classificacoes

### TREND
- **Definicao:** Topico com engagement 30%+ acima da media em 3+ contas na mesma semana
- **Confianca:** MEDIA
- **Janela de acao:** 5-10 dias
- **Acao recomendada:** Avaliar fit com posicionamento. Se positivo, criar conteudo com angulo proprio.

### NOISE
- **Definicao:** Pico de engagement em apenas 1 conta
- **Confianca:** BAIXA
- **Janela de acao:** Nenhuma
- **Acao recomendada:** Ignorar. Registrar para correlacao futura. Pode ser anomalia (post viral pontual, colaboracao, impulsionamento pago).

### SAZONAL
- **Definicao:** Mesmo topico performou bem no mesmo periodo do ano anterior
- **Confianca:** ALTA
- **Janela de acao:** Planejar com 2-4 semanas de antecedencia
- **Acao recomendada:** Incluir no calendario editorial. Preparar conteudo antes do pico.
- **Exemplos:** Black Friday, volta as aulas, fim de ano, datas comemorativas do nicho.

### SATURADO
- **Definicao:** 5+ concorrentes postaram sobre o tema nos ultimos 7 dias
- **Confianca:** ALTA (de que o tema ja foi explorado)
- **Janela de acao:** Evitar ou diferenciar
- **Acao recomendada:** NAO publicar sobre o tema a menos que tenha angulo radicalmente diferente. Esperar 2-3 semanas para revisitar com perspectiva unica.

### OPORTUNIDADE
- **Definicao:** Trend detectado + zero posts nossos sobre o topico
- **Confianca:** MEDIA-ALTA
- **Janela de acao:** 3-7 dias
- **Acao recomendada:** Criar brief imediato. Priorizar no calendario semanal.

### URGENTE
- **Definicao:** Oportunidade + trending ascendente nos ultimos 2 dias (janela fechando)
- **Confianca:** ALTA
- **Janela de acao:** 24-48 horas
- **Acao recomendada:** Prioridade maxima. Interromper calendario se necessario. Publicar dentro de 48h.

---

## Arvore de Decisao

```
Sinal detectado pelo daily-monitor
|
+-- Engagement subiu 30%+ vs media 7 dias?
|   |
|   +-- NAO --> Registrar e ignorar (NOISE potencial)
|   |
|   +-- SIM --> Em quantas contas?
|       |
|       +-- 1 conta --> NOISE
|       |
|       +-- 2 contas --> OBSERVAR (re-avaliar em 3 dias)
|       |
|       +-- 3+ contas --> TREND confirmado
|           |
|           +-- Mesmo topico performou bem no mesmo periodo do ano anterior?
|           |   +-- SIM --> SAZONAL
|           |   +-- NAO --> continuar
|           |
|           +-- 5+ concorrentes ja postaram nos ultimos 7 dias?
|           |   +-- SIM --> SATURADO
|           |   +-- NAO --> continuar
|           |
|           +-- Temos posts sobre esse topico?
|               +-- SIM --> TREND (monitorar performance do nosso)
|               +-- NAO --> OPORTUNIDADE
|                   |
|                   +-- Trending subindo nos ultimos 2 dias?
|                       +-- SIM --> URGENTE
|                       +-- NAO --> OPORTUNIDADE (janela normal)
```

---

## Regras de Prioridade

| Classificacao | Prioridade | Tempo de Resposta |
|---------------|-----------|-------------------|
| URGENTE | P0 - Maxima | 24-48h |
| OPORTUNIDADE | P1 - Alta | 3-7 dias |
| TREND | P2 - Media | 5-10 dias |
| SAZONAL | P3 - Planejada | 2-4 semanas antes |
| SATURADO | P4 - Evitar | Nao publicar |
| NOISE | P5 - Ignorar | Nenhuma acao |

---

## Validacao de Trend

Antes de agir sobre um TREND ou OPORTUNIDADE, validar:

1. **Fit com posicionamento:** O topico esta alinhado com nosso nucleo? (ver `data/nucleo.md`)
2. **Fit com audiencia:** Nossa audiencia se importa com isso?
3. **Angulo disponivel:** Temos um angulo unico ou seria mais do mesmo?
4. **Recurso disponivel:** Temos capacidade de criar conteudo de qualidade a tempo?
5. **Risco de saturacao:** Quantos mais concorrentes provavelmente vao publicar?

**Se 3+ validacoes negativas:** Rebaixar para NOISE independente da classificacao.

---

## Integracao

- **monitoring-signals.md:** Fornece os dados brutos e thresholds
- **benchmark-database.md:** Fornece medias de referencia para comparacao
- **performance-patterns.md:** Recebe trends confirmados para correlacao com performance propria
- **content-chief:** Recebe classificacoes URGENTE e OPORTUNIDADE como input de planejamento
