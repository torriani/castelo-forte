# Planejar Conteudo Estrategico

name: plan-content
executor: content-planner
description: Gerar planejamento estrategico de conteudo com 25 ideias por ciclo, distribuidas nos 5 niveis de consciencia (Schwartz), proporcao 50/25/25 Castelo Forte e calendario editorial semanal
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Tipos de post e frameworks de copy disponiveis em data/
  - Categorias de stories disponiveis em data/stories-categorias.md
  - Oraculo de posts disponivel para validacao de tom (data/oraculo-posts.md)

## INPUTS

- **Publico:** avatar com especificidade — quem e, o que faz, qual dor (obrigatorio)
- **Oferta:** produto, servico ou mentoria que sera vendida (obrigatorio)
- **Crenca central:** ideia a ser vendida/instalada ao longo dos conteudos (obrigatorio)
- **Transformacao:** resultado mensuravel que a oferta entrega (obrigatorio)
- **Frequencia de postagem:** quantos posts por semana — default: 5 (opcional)
- **Ciclo:** semanal ou quinzenal — default: semanal (opcional)
- **Prioridade de formato:** carrossel / reels / misto — default: misto (opcional)

## STEPS

1. Coletar as 4 informacoes obrigatorias — perguntar o que faltar
2. Mapear os 5 niveis de consciencia do avatar (Eugene Schwartz):
   - **Inconsciente:** nao sabe que tem o problema
   - **Consciente do problema:** sabe que tem o problema, nao sabe a solucao
   - **Consciente da solucao:** sabe que existe solucao, nao conhece a sua
   - **Consciente do produto:** conhece sua oferta, ainda nao decidiu
   - **Mais consciente:** pronto pra comprar, precisa de empurrao final
3. Gerar 25 ideias de conteudo — 5 por nivel de consciencia:
   - Nivel 1 (Inconsciente): conteudo de choque, provocacao, polemica → tipo Polemico/Imperial
   - Nivel 2 (Consciente do problema): amplificar dor, diagnostico → tipo Problema/Crenca
   - Nivel 3 (Consciente da solucao): novo paradigma, metodo, insights → tipo Curiosidade/Historia
   - Nivel 4 (Consciente do produto): cases, provas, comparacoes → tipo Oferta/Historia
   - Nivel 5 (Mais consciente): oferta direta, escassez, CTA → tipo Oferta/Imperial
4. Aplicar proporcao 50/25/25 Castelo Forte:
   - 50% conteudo de POSICIONAMENTO (niveis 1-2): provocar, polarizar, criar inimigos
   - 25% conteudo de AUTORIDADE (nivel 3): mostrar que sabe, entregar insights
   - 25% conteudo de CONVERSAO (niveis 4-5): provar e vender
5. Distribuir formatos por tipo:
   - Posicionamento: carrosseis imperiais, polemicos + reels de hook forte
   - Autoridade: carrosseis de crenca, curiosidade + reels educativos
   - Conversao: carrosseis de oferta + stories de levantada de mao
6. Montar calendario editorial semanal com dia, formato, tipo de post, nivel de consciencia e ideia
7. Sugerir framework de copy para cada ideia (referencia: matriz tipo x framework)
8. Entregar planejamento completo no formato padrao

## VETO CONDITIONS

- Se nao tem as 4 informacoes obrigatorias → NAO executar, perguntar
- Se ideias sao genericas ("fale sobre seu produto") → Reescrever com especificidade e angulo claro
- Se todas as ideias estao no mesmo nivel de consciencia → Redistribuir nos 5 niveis
- Se proporcao nao respeita 50/25/25 → Rebalancear (posicionamento deve dominar)
- Se calendario nao tem formato + tipo + nivel por dia → Completar
- Se nao tem pelo menos 1 ideia de conversao direta por semana → Adicionar
- Se ideias parecem conteudo educativo de guru → Reescrever no tom imperial (provocar, nao ensinar)
- Se entregou so lista de temas sem angulo de abordagem → Reescrever com hook e tipo definidos

## OUTPUT EXAMPLE

```
PLANEJAMENTO DE CONTEUDO — CICLO SEMANAL
AVATAR: Empreendedores digitais 25-40, faturam 5-15k/mes, postam todo dia sem resultado
OFERTA: Mentoria de Posicionamento Imperial (R$ 5.000)
CRENCA CENTRAL: "Posicionamento > Consistencia"
TRANSFORMACAO: Sair de 5-15k/mes para 30-50k/mes em 90 dias

PROPORCAO APLICADA:
- Posicionamento: 13 ideias (52%)
- Autoridade: 6 ideias (24%)
- Conversao: 6 ideias (24%)

25 IDEIAS POR NIVEL DE CONSCIENCIA:

NIVEL 1 — INCONSCIENTE (5 ideias):
1. "Voce nao tem problema de vendas. Tem problema de ANONIMATO." (Carrossel Imperial / Abertura Curiosa)
2. "95% dos empreendedores digitais sao INVISIVEIS pro comprador certo." (Reels / Segredo Revelado)
3. "Consistencia e a maior MENTIRA que te venderam." (Carrossel Polemico / Pergunta Impactante)
4. "Postar todo dia e a versao digital de gritar no deserto." (Reels / Problema e Solucao)
5. "O mercado te ensinou a criar conteudo. Deveria ter ensinado a criar COMANDO." (Carrossel Imperial / Autoridade)

[...]

NIVEL 5 — MAIS CONSCIENTE (5 ideias):
21. "PROCURO 10 empreendedores que querem instalar posicionamento imperial em 90 dias." (Carrossel Oferta / Beneficio Direto)
[...]

CALENDARIO SEMANAL (Semana 1):
| Dia | Formato | Tipo | Nivel | Ideia |
|-----|---------|------|-------|-------|
| SEG | Carrossel | Imperial | 1 | Ideia #1 |
| TER | Reels | Polemico | 1 | Ideia #3 |
| QUA | Carrossel | Crenca | 3 | Ideia #12 |
| QUI | Reels | Historia | 4 | Ideia #18 |
| SEX | Carrossel | Oferta | 5 | Ideia #21 |

STORIES COMPLEMENTARES: 2-3 sequencias por semana (posicionamento + bastidores + levantada de mao)
```

## COMPLETION CRITERIA

- 25 ideias geradas (5 por nivel de consciencia)
- Proporcao 50/25/25 respeitada (posicionamento/autoridade/conversao)
- Cada ideia com: hook, formato, tipo de post e framework sugerido
- Calendario editorial semanal montado
- Niveis de consciencia corretamente mapeados pro avatar
- Tom imperial em todas as ideias (nao educativo)
- Sugestoes de stories complementares incluidas

## Output Example

```
## PLANEJAMENTO ESTRATEGICO — Ciclo Abril/2026

Publico: Mentores digitais | 25 ideias | Proporcao 50/25/25

### Distribuicao por Nivel de Consciencia (Schwartz)
| Nivel | Qtd | Exemplo |
|-------|-----|---------|
| Inconsciente | 5 | "Por que mentores inteligentes fracassam" |
| Consciente do problema | 8 | "Voce posta todo dia e ninguem compra" |
| Consciente da solucao | 5 | "3 pilares de conteudo que vende" |
| Consciente do produto | 4 | "Como funciona o Autoridade Absoluta" |
| Mais consciente | 3 | "Ultimas 3 vagas — comenta EU QUERO" |

### Top 5 Ideias Prioritarias
| # | Tema | Formato | Intencao | Framework |
|---|------|---------|----------|-----------|
| 1 | Cobrar barato e autossabotagem | Carrossel 10s | Consciencia | PAS |
| 2 | O teste dos 3 segundos (bio) | Reels 30s | Atracao | Hook Disruptivo |
| 3 | Mais seguidores = mais vendas? | Carrossel 7s | Consciencia | Crenca |
| 4 | Case: de 8k pra 32k em 60 dias | Stories PAS | Aquecimento | Storytelling |
| 5 | Mentoria Autoridade Absoluta | Carrossel Oferta | Venda | Oferta Direta |

Stories complementares sugeridos por dia no calendario semanal.
```

## REFERENCES

- data/tipos-de-post.md — 7 tipos de post e estruturas
- data/frameworks-copy.md — 9 frameworks e matriz tipo x framework
- data/stories-categorias.md — categorias de stories para complementar o feed
- data/oraculo-posts.md — referencia de tom e linguagem

### Veto Conditions

- id: "CONT_PLAN_CONTENT_001"
  condition: "Publico, oferta, crenca central e transformacao nao fornecidos"
  check: "Verificar se as 4 informacoes obrigatorias estao presentes nos inputs"
  result: "VETO - BLOCK. Solicitar informacoes faltantes antes de gerar planejamento"
  rationale: "Planejamento sem crenca central e avatar gera ideias genericas e desalinhadas"

- id: "CONT_PLAN_CONTENT_002"
  condition: "Ideias todas no mesmo nivel de consciencia (Schwartz)"
  check: "Verificar distribuicao das 25 ideias nos 5 niveis de consciencia"
  result: "VETO - BLOCK. Redistribuir ideias para cobrir todos os 5 niveis com 5 ideias cada"
  rationale: "Funil de conteudo eficaz precisa cobrir todos os niveis — concentrar e desperdicar alcance"

### Completion Criteria

- [ ] 25 ideias geradas com 5 por nivel de consciencia (Schwartz)
- [ ] Proporcao 50/25/25 respeitada (posicionamento/autoridade/conversao)
- [ ] Cada ideia com hook, formato, tipo de post e framework sugerido
- [ ] Calendario editorial semanal montado com sugestoes de stories complementares
