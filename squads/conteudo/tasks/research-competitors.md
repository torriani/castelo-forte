# Pesquisar Concorrentes (BR + US)

name: research-competitors
executor: competitor-analyst
description: Pesquisa de concorrentes nos mercados BR e US — pipeline completo de mapeamento, coleta e ranking de conteudo
elicit: true
pre_conditions:
  - Frameworks de analise de concorrentes disponiveis em data/competitor-frameworks.md
  - Banco de hooks disponivel em data/hooks-bank.md para comparacao
  - Acesso a Apify Instagram scraper operacional (para coleta automatizada)

## INPUTS

- **Nicho/mercado:** area de atuacao (obrigatorio)
- **Plataformas:** Instagram, TikTok, YouTube (obrigatorio)
- **Mercados:** BR, US ou ambos (default: ambos)
- **Quantidade de concorrentes:** quantos mapear (default: 5-10)
- **Concorrentes conhecidos:** handles/nomes ja identificados (opcional)
- **Faixa de seguidores:** sweet spot desejado (default: 10k-500k)

## STEPS

1. Coletar nicho e plataformas alvo
2. DEFINIR: Listar criterios de selecao (mesmo nicho, audiencia ativa, conteudo recente)
3. MAPEAR: Identificar concorrentes por mercado (BR + US)
4. Coletar dados por concorrente: handle, seguidores, frequencia, formatos, oferta, tom, diferencial
5. COLETAR: Top 10 posts por engajamento (ultimos 90 dias) de cada concorrente
6. Extrair hooks, estruturas e CTAs dos posts mais engajados
7. RANQUEAR: Ordenar concorrentes por relevancia e performance
8. Gerar relatorio por concorrente no template padrao
9. Identificar gaps e oportunidades no nicho
10. Entregar analise consolidada com insights aplicaveis

## VETO CONDITIONS

- Se nao tem nicho definido → NAO executar, perguntar
- Se pesquisa so tem BR ou so US → Completar com o outro mercado
- Se dados sao superficiais (so nome e seguidores) → Aprofundar analise
- Se nao identifica padroes entre concorrentes → Analisar mais posts
- Se nao sugere insights aplicaveis → Adicionar recomendacoes praticas
- Se copia conteudo em vez de adaptar principios → Corrigir abordagem

## OUTPUT EXAMPLE

```
PESQUISA DE CONCORRENTES — [Nicho]
Data: [data]
Mercados: BR + US

CONCORRENTES MAPEADOS:

BR:
1. @handle1 — 45k seguidores — Carrosssel + Reels — Tom provocativo
2. @handle2 — 120k seguidores — Reels + Stories — Tom educativo
[...]

US:
1. @handle_us1 — 200k followers — Carousels — Provocative
2. @handle_us2 — 80k followers — Reels — Authority-based
[...]

TOP INSIGHTS:
1. Hooks que mais performam no nicho: [padrao identificado]
2. Formato dominante: [carrossel/reels/stories]
3. Tom que mais engaja: [provocativo/educativo/autoridade]
4. Gap identificado: [o que ninguem faz]
5. Oportunidade: [o que podemos fazer diferente]

RANKING POR RELEVANCIA:
| # | Handle | Mercado | Relevancia | Por que |
|---|--------|---------|------------|---------|
| 1 | @x     | BR      | Alta       | [motivo] |
[...]

PROXIMOS PASSOS:
- Analisar top 3 em profundidade (task: analyze-competitor)
- Transcrever videos dos top performers (task: transcribe-content)
- Gerar conteudo baseado nos insights
```

## COMPLETION CRITERIA

- Concorrentes mapeados em BR e US
- Dados completos por concorrente (handle, seguidores, formatos, tom, oferta)
- Top posts identificados por engajamento
- Padroes de hooks, estruturas e CTAs extraidos
- Ranking por relevancia com justificativa
- Gaps e oportunidades identificados
- Insights aplicaveis ao conteudo do usuario
- Relatorio no template padrao (conforme data/competitor-frameworks.md)

## Output Example

```
## PESQUISA DE CONCORRENTES — Nicho: Mentoria Digital

Mercados: BR (5) + US (3) | Periodo: ultimos 30 dias

### Ranking BR
| # | Handle | Seguidores | Eng. Medio | Top Post (tema) |
|---|--------|-----------|-----------|-----------------|
| 1 | @mentorpedro | 45k | 3.2% | "Precificacao premium" |
| 2 | @escaladigital | 32k | 2.8% | "Funil de vendas sem trafego" |
| 3 | @mentoriapro | 28k | 2.1% | "3 erros de mentor iniciante" |

### Ranking US
| # | Handle | Seguidores | Eng. Medio | Top Post (tema) |
|---|--------|-----------|-----------|-----------------|
| 1 | @coachscale | 120k | 4.1% | "Premium pricing mindset" |
| 2 | @mentorbiz | 85k | 3.5% | "Stop trading time for money" |

### Padroes Detectados
- Formato dominante: Carrossel 10 slides (70% dos top posts)
- Hook dominante: Pergunta provocativa (45%)
- Tema quente: Precificacao premium (aparece em 4/8 concorrentes)

Pronto para analise profunda via *analyze-competitor
```

## REFERENCES

references:
  - data/competitor-frameworks.md
  - data/hooks-bank.md
  - data/tipos-de-post.md
  - data/frameworks-copy.md

### Veto Conditions

- id: "CONT_RESEARCH_COMPETITORS_001"
  condition: "Nicho de mercado nao definido para pesquisa"
  check: "Verificar se nicho e plataformas-alvo estao especificados nos inputs"
  result: "VETO - BLOCK. Solicitar nicho e plataformas antes de iniciar mapeamento"
  rationale: "Pesquisa sem nicho definido retorna concorrentes irrelevantes e dados dispersos"

- id: "CONT_RESEARCH_COMPETITORS_002"
  condition: "Pesquisa cobrindo apenas 1 mercado (so BR ou so US)"
  check: "Verificar se ambos os mercados (BR + US) estao representados na pesquisa"
  result: "VETO - BLOCK. Completar pesquisa com o mercado faltante antes de entregar"
  rationale: "Insights de um unico mercado limitam a visao — US tem padroes avancados que inspiram estrategia"

### Completion Criteria

- [ ] Concorrentes mapeados em BR e US com dados completos (handle, seguidores, formatos, tom, oferta)
- [ ] Top posts identificados por engajamento com padroes de hooks, estruturas e CTAs extraidos
- [ ] Ranking por relevancia com justificativa e gaps/oportunidades identificados
- [ ] Insights aplicaveis e acionaveis no conteudo do usuario (nao teoricos)
