# Analisar Concorrente em Profundidade

name: analyze-competitor
executor: competitor-analyst
description: Analise profunda de padroes de conteudo de um concorrente especifico — hooks, estruturas, CTAs, tom e insights aplicaveis
elicit: true
pre_conditions:
  - Dados de monitoramento atualizados (research-competitors executado)
  - Top posts do concorrente coletados com dados de engajamento
  - Frameworks de analise de concorrentes disponiveis em data/competitor-frameworks.md
  - Tipos de post e frameworks de copy disponiveis em data/ para comparacao

## INPUTS

- **Handle do concorrente:** @usuario (obrigatorio)
- **Plataforma principal:** Instagram, TikTok, YouTube (obrigatorio)
- **Nicho:** area de atuacao do concorrente (obrigatorio)
- **Top posts coletados:** lista de conteudos mais engajados (obrigatorio — da task research-competitors)
- **Transcricoes disponiveis:** textos de videos ja transcritos (opcional — da task transcribe-content)
- **Nosso nicho:** para comparacao e adaptacao (opcional)

## STEPS

1. Receber dados do concorrente e top posts
2. Analisar hooks dos posts mais engajados — identificar padrao dominante
3. Analisar estrutura dos carrosseis — tipo de post e framework de copy usado
4. Analisar CTAs — qual tipo gera mais conversao
5. Analisar tom de voz — provocativo, educativo, autoritario, inspiracional
6. Analisar formatos — carrossel vs reels vs stories, qual performa melhor
7. Analisar frequencia e timing — quantas vezes por semana, horarios
8. Identificar temas recorrentes que geram mais engajamento
9. Extrair principios (nao copiar conteudo) adaptaveis pro tom imperial
10. Gerar 5 conteudos inspirados nos principios identificados
11. Entregar relatorio completo no template padrao

## VETO CONDITIONS

- Se nao tem handle e top posts → NAO executar, rodar research-competitors primeiro
- Se analise copia conteudo em vez de extrair principios → Reescrever
- Se nao gera conteudo adaptado → Sempre entregar pecas aplicaveis
- Se insights sao superficiais ("posts bons", "engajamento alto") → Aprofundar com dados
- Se conteudo gerado nao segue tom imperial → Reescrever
- Se nao valida pelo oraculo → Validar cada peca

## OUTPUT EXAMPLE

```
ANALISE PROFUNDA — @handle
Plataforma: Instagram
Nicho: [nicho]
Seguidores: [N]
Frequencia: [N] posts/semana

TOP 5 CONTEUDOS:
1. [tipo] — "[hook]" — [likes/comments/saves]
2. [tipo] — "[hook]" — [likes/comments/saves]
[...]

PADROES IDENTIFICADOS:

Hooks:
- Padrao dominante: Afirmacao contraintuitiva (70% dos top posts)
- Formato: "Pare de [X]" / "[Numero] coisas que [Y]"

Estrutura:
- Tipo de post mais usado: Polemico (40%), Crenca (30%)
- Framework: Contraste antes/depois (60%)

CTAs:
- Mais eficaz: "Salva + comenta [palavra]" (3x mais engajamento)
- Menos eficaz: "Link na bio" (baixa conversao)

Tom:
- Provocativo com autoridade (nao educativo)
- Frases curtas, diretas, sem rodeios

GAPS VS NOSSO CONTEUDO:
1. [gap identificado + recomendacao]
2. [gap identificado + recomendacao]

5 CONTEUDOS INSPIRADOS (adaptados pro tom imperial):
1. Carrossel: "[hook adaptado]" — baseado no principio [X]
2. Reels: "[roteiro adaptado]" — baseado no principio [Y]
[...]
```

## COMPLETION CRITERIA

- Analise completa dos top posts com dados de engajamento
- Padroes de hooks, estrutura, CTAs e tom identificados
- Gaps vs nosso conteudo mapeados
- 5 conteudos inspirados nos principios (nao copias)
- Conteudos gerados no tom imperial e validados pelo oraculo
- Relatorio no template padrao (conforme data/competitor-frameworks.md)
- Insights acionaveis (nao teoricos)

## Output Example

```
## ANALISE DE CONCORRENTE — @mentorpedro

Plataforma: Instagram | Nicho: Mentoria Digital
Posts analisados: 15 (top engajamento ultimos 30 dias)

### Padroes de Hook
| # | Tipo | Frequencia | Engajamento Medio |
|---|------|-----------|-------------------|
| 1 | Pergunta provocativa | 40% | 2.3% |
| 2 | Afirmacao polemica | 33% | 3.1% |
| 3 | Comando direto | 27% | 1.8% |

### Estrutura Dominante
- 80% carrosseis de 10 slides (Imperial + Crenca)
- Framework mais usado: PAS (60%) e AIDA (25%)
- CTA predominante: "Salva esse post" (53%)

### Gaps Exploraveis
1. Nunca usa stories de venda direta — oportunidade de conversao
2. Zero reels com storytelling — campo aberto
3. Tom sempre educativo — posicionamento imperial seria diferencial

### Insights Acionaveis
- Adaptar hook "Voce ta fazendo X errado" (3.1% eng) para nosso tom
- Atacar gap de stories de venda com sequencia PAS
- Usar formato carrossel 10 slides que domina o nicho
```

references:
  - data/competitor-frameworks.md
  - data/hooks-bank.md
  - data/tipos-de-post.md
  - data/frameworks-copy.md

### Veto Conditions

- id: "CONT_ANALYZE_COMPETITOR_001"
  condition: "Handle do concorrente e top posts nao fornecidos"
  check: "Verificar se handle e lista de top posts estao presentes nos inputs"
  result: "VETO - BLOCK. Executar research-competitors antes de prosseguir"
  rationale: "Sem dados de concorrente, a analise sera superficial e sem fundamento"

- id: "CONT_ANALYZE_COMPETITOR_002"
  condition: "Avatar ou publico-alvo nao definido para comparacao"
  check: "Verificar se o nicho do usuario esta informado para gap analysis"
  result: "VETO - BLOCK. Solicitar nicho e avatar antes de iniciar analise comparativa"
  rationale: "Sem contexto proprio, os insights nao sao adaptaveis ao tom imperial"

### Completion Criteria

- [ ] Relatorio completo entregue com padroes de hooks, estrutura, CTAs e tom identificados
- [ ] Gaps entre conteudo do concorrente e nosso conteudo mapeados com recomendacoes
- [ ] 5 conteudos inspirados nos principios extraidos (nao copias) e validados pelo oraculo
- [ ] Insights acionaveis com dados de engajamento reais (nao teoricos)
