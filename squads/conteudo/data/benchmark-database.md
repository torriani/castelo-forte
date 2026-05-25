# Benchmark Database

> Benchmarks de referencia para avaliacao de performance.
> Valores iniciais baseados em medias do mercado brasileiro (marketing digital, infoprodutos, mentorias).
> O performance-tracker atualiza com dados reais da conta conforme posts sao publicados.

---

## Por Formato

| Formato | Engagement Rate Medio | Alcance (% seguidores) | Saves (% reach) | Shares (% reach) |
|---------|----------------------|----------------------|-----------------|-------------------|
| Carrossel | 3-5% | 25-40% | 3-5% | 1-3% |
| Reels | 4-8% | 40-80% | 1-3% | 2-5% |
| Stories | 2-4% | 5-15% | N/A | 0.5-2% |
| Single Image | 1-3% | 15-25% | 1-2% | 0.5-1% |

**Nota:** Reels tem alcance significativamente maior para nao-seguidores. Carrosseis tem maior taxa de saves.

---

## Por Tipo de Post

| Tipo | Engagement Rate | Melhor Metrica | Pior Metrica |
|------|----------------|----------------|--------------|
| Imperial | 4-6% | Shares, comentarios polemicos | Saves (conteudo nao "salvavel") |
| Polemico | 5-8% | Comentarios, shares, alcance | Saves, follows |
| Crenca | 3-5% | Saves, shares | Comentarios (menos debate) |
| Curiosidade | 4-6% | Watch time, saves | Shares (conteudo mais pessoal) |
| Historia | 3-5% | Comentarios, DMs | Shares (conteudo intimo) |
| Problema | 3-5% | Saves, follows | Viralidade |
| Oferta | 2-4% | Cliques, DMs, conversao | Alcance organico, likes |

**Nota:** Engagement rate de posts de Oferta e naturalmente menor, mas compensado pela conversao direta.

---

## Por Tamanho do Carrossel

| Slides | Engagement Rate | Tempo Medio de Visualizacao | Melhor Para |
|--------|----------------|---------------------------|-------------|
| 3 slides | Variavel (2-5%) | 15-25s | Antes/depois, comparacoes rapidas |
| 5 slides | MELHOR (4-6%) | 30-45s | Frameworks, listas curtas |
| 7 slides | BOM (3-5%) | 45-60s | Conteudo educativo, storytelling |
| 10 slides | OK (3-4%) | 60-90s | Guias completos, historias longas |

**Sweet spot:** 5-7 slides. Suficiente para entregar valor sem perder atencao.

---

## Por Horario de Publicacao

| Faixa | Horario | Engagement Relativo | Melhor Formato |
|-------|---------|--------------------|-|
| Manha cedo | 7h - 9h | ALTO | Carrosseis educativos, posts motivacionais |
| Manha | 9h - 12h | MEDIO | Single posts, stories |
| Almoco | 12h - 14h | MEDIO-ALTO | Carrosseis, reels curtos |
| Tarde | 14h - 17h | MEDIO-BAIXO | Stories, conteudo leve |
| Noite | 19h - 21h | PICO | Reels, posts emocionais, ofertas |
| Noite tardia | 21h - 23h | MEDIO | Stories intimos, bastidores |

**Nota:** Horario de PICO (19h-21h) tem mais alcance mas tambem mais competicao.

---

## Por Nivel de Consciencia da Audiencia

| Nivel | Alcance | Engagement | Conversao | Melhor Formato |
|-------|---------|-----------|-----------|----------------|
| Inconsciente | ALTO | ALTO | BAIXO | Reels virais, posts polemicos |
| Consciente do problema | MEDIO-ALTO | MEDIO-ALTO | MEDIO | Carrosseis educativos, historias |
| Consciente da solucao | MEDIO | MEDIO | MEDIO-ALTO | Comparacoes, frameworks |
| Consciente do produto | BAIXO-MEDIO | MEDIO | ALTO | Ofertas, depoimentos, provas |
| Pronto para comprar | BAIXO | BAIXO | MUITO ALTO | CTA direto, escassez, DM |

**Regra pratica:**
- Quanto mais inconsciente, maior o alcance e menor a conversao
- Quanto mais consciente, menor o alcance e maior a conversao
- Equilibrar o calendario entre os niveis (ver `data/planejamento-consciencia.md`)

---

## Benchmarks por Tamanho de Conta

| Seguidores | Engagement Rate Medio | Alcance Organico (% base) |
|------------|----------------------|--------------------------|
| 0 - 1K | 5-10% | 40-60% |
| 1K - 5K | 4-7% | 30-50% |
| 5K - 10K | 3-5% | 25-40% |
| 10K - 50K | 2-4% | 20-35% |
| 50K - 100K | 1.5-3% | 15-25% |
| 100K+ | 1-2.5% | 10-20% |

**Nota:** Engagement rate cai naturalmente com crescimento da base. O que importa e manter ou superar a media do seu tier.

---

## Como Interpretar os Benchmarks

### Post e "Winner" quando:
- Engagement rate 50%+ acima da media do formato
- Saves 2x acima da media
- Shares 2x acima da media
- Reach 50%+ acima da media

### Post e "Loser" quando:
- Engagement rate 50%+ abaixo da media do formato
- Reach 50%+ abaixo da media
- Zero saves e zero shares

### Post e "Normal" quando:
- Metricas dentro de 1 desvio padrao da media

---

## Atualizacao

Este arquivo e atualizado de duas formas:

1. **Manual:** Revisao trimestral com dados de relatorios do mercado
2. **Automatica:** O performance-tracker injeta medias reais da conta conforme dados acumulam

**Prioridade:** Dados reais da conta sempre prevalecem sobre medias do mercado.

---

## Integracao

- **monitoring-signals.md:** Usa benchmarks para definir thresholds de alerta
- **trend-detection-rules.md:** Compara trends com benchmarks para priorizar
- **performance-patterns.md:** Dados reais que eventualmente substituem estes benchmarks
- **content-chief:** Usa benchmarks para definir metas por post
