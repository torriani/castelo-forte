# Auditar Conteudo pelo Oraculo

name: audit-content
executor: content-validator
description: Auditar conteudo existente contra os padroes do oraculo — identificar gaps, pontuar e sugerir melhorias
elicit: true
pre_conditions:
  - Conteudo existente disponivel para auditoria
  - Nucleo e regras inviolaveis carregados de data/
  - Oraculo de posts e reels disponiveis (data/oraculo-posts.md, data/oraculo-reels.md)
  - Lista de cliches proibidos disponivel em data/cliches-proibidos.md

## INPUTS

- **Conteudo a auditar:** texto do post, carrossel, story ou reels (obrigatorio)
- **Formato:** carrossel, reels, stories, post unico (obrigatorio)
- **Intencao original:** atracao, consciencia, aquecimento ou venda (obrigatorio)
- **Avatar:** publico-alvo (opcional — melhora a analise)
- **Metricas atuais:** engajamento, views, saves (opcional)

## STEPS

1. Receber conteudo e formato
2. Identificar tipo de post atual (Imperial, Polemico, Crenca, Problema, Curiosidade, Historia, Oferta)
3. Aplicar checklist do oraculo correspondente (oraculo-posts ou oraculo-reels)
4. Pontuar cada criterio do oraculo (0-10)
5. Calcular score geral (%)
6. Identificar pontos fortes (o que ja funciona)
7. Identificar gaps criticos (o que precisa melhorar)
8. Gerar versao reescrita com melhorias aplicadas
9. Pontuar versao nova pelo oraculo
10. Entregar relatorio comparativo (antes vs depois)

## VETO CONDITIONS

- Se nao tem o conteudo a auditar → NAO executar, pedir
- Se formato nao e informado → Perguntar antes de auditar
- Se auditoria e superficial ("esta bom/ruim") → Detalhar criterio por criterio
- Se nao gera versao reescrita → Sempre entregar alternativa melhorada
- Se versao nova nao pontua mais que a original → Reescrever novamente

## OUTPUT EXAMPLE

```
AUDITORIA DE CONTEUDO

CONTEUDO ORIGINAL:
"[texto do post/carrossel/reels]"

TIPO IDENTIFICADO: Carrossel tipo Crenca
INTENCAO: Aquecimento

SCORE ORACULO: 62%

PONTUACAO POR CRITERIO:
| Criterio | Nota | Observacao |
|----------|------|-----------|
| Hook | 5/10 | Fraco, nao gera curiosidade |
| Tom Imperial | 7/10 | Bom, mas tem trechos educativos |
| Progressao | 6/10 | Slides 3-5 perdem ritmo |
| CTA | 4/10 | Generico, sem comando |
| Concisao | 8/10 | Dentro do limite |
| Especificidade | 5/10 | Muito generico pro avatar |
[...]

PONTOS FORTES:
- Slide 1 tem boa provocacao
- Tom geral esta na direcao certa

GAPS CRITICOS:
1. Hook precisa ser mais chocante
2. CTA precisa ser comando imperativo
3. Slides 3-5 parecem "dicas" em vez de argumentacao

VERSAO REESCRITA:
[Versao completa melhorada slide por slide]

SCORE NOVO: 84%
MELHORIA: +22 pontos
```

## COMPLETION CRITERIA

- Score oraculo calculado com criterios detalhados
- Cada criterio pontuado individualmente com observacao
- Pontos fortes identificados
- Gaps criticos listados com solucao
- Versao reescrita completa entregue
- Score da versao nova superior ao original
- Relatorio comparativo claro (antes vs depois)

## Output Example

```
## AUDITORIA ORACULO — Carrossel "5 Erros de Precificacao"

Formato: Carrossel 10 slides | Intencao: Consciencia

### Score por Etapa
| Etapa | Criterio | Score | Status |
|-------|----------|-------|--------|
| 1 | Hook magnetico | 8/10 | PASS |
| 2 | Coerencia de framework | 7/10 | PASS |
| 3 | Progressao logica | 6/10 | ALERTA |
| 4 | Tom imperial | 9/10 | PASS |
| 5 | CTA estrategico | 5/10 | FAIL |
| 6 | Cliches proibidos | 10/10 | PASS |

Score Geral: 75% — REPROVADO (minimo 80%)

### Gaps Identificados
- Slide 7: quebra de progressao logica (pula do problema pra oferta)
- CTA generico ("clique no link") — substituir por CTA imperial

### Versao Corrigida (CTA)
ANTES: "Clique no link da bio e saiba mais"
DEPOIS: "Voce vai continuar cobrando barato ou vai aplicar o metodo? Link na bio."
```

## REFERENCES

references:
  - data/regras-inviolaveis.md
  - data/oraculo-posts.md
  - data/oraculo-reels.md
  - data/cliches-proibidos.md

### Veto Conditions

- id: "CONT_AUDIT_CONTENT_001"
  condition: "Conteudo a auditar nao fornecido"
  check: "Verificar se o texto completo do post/carrossel/reels esta presente"
  result: "VETO - BLOCK. Solicitar conteudo completo antes de iniciar auditoria"
  rationale: "Sem conteudo, nao ha o que auditar — a task perde razao de existir"

- id: "CONT_AUDIT_CONTENT_002"
  condition: "Formato do conteudo nao informado (carrossel, reels, stories)"
  check: "Verificar se o formato e a intencao original estao especificados"
  result: "VETO - BLOCK. Perguntar formato e intencao antes de aplicar checklist do oraculo"
  rationale: "Cada formato tem criterios diferentes no oraculo — sem formato, a validacao e imprecisa"

### Completion Criteria

- [ ] Score oraculo calculado com cada criterio pontuado individualmente
- [ ] Versao reescrita entregue com score superior ao original
- [ ] Relatorio comparativo claro (antes vs depois) com gaps criticos listados
- [ ] Todas as etapas do oraculo correspondente executadas na ordem correta
