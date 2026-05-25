# Criar Stories PAS (E7)

name: create-stories-pas
executor: stories-strategist
description: Criar sequencia de 11 stories com framework PAS (Problema-Agitacao-Solucao) para validar mentoria antes do lancamento oficial (Estrategia E7)
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Frameworks de copy disponiveis em data/frameworks-copy.md
  - Categorias de stories disponiveis em data/stories-categorias.md
  - Banco de CTAs disponivel em data/cta-bank.md

---

## 🛑 GATE OBRIGATORIO — FILTRO ANTI-IA (PRE E POS ESCRITA)

**Severidade:** VETO BLOQUEANTE. Esta task NAO entrega output sem passar pelo filtro.

### Antes de comecar (Camada 1 — Pre-escrita)
1. **Ler obrigatorio:** `checklists/filtro-anti-ia.md` (filtro UNIVERSAL anti-IA v3)
2. Internalizar listas proibidas (§1, §2, §3) e regra do inimigo (§8)
3. Aplicar DURANTE a escrita — nunca produzir rascunho sujo pra "limpar depois"

### Antes de entregar (Camada 2 — Auto-validacao)
1. Rodar `§9 TESTE FINAL` do filtro em CADA bloco de texto produzido
2. Se falhar em qualquer item: REESCREVER antes de seguir
3. Se passar: marcar `anti_ia_self_check: PASS` no metadata do output

### Veto Conditions (bloqueiam entrega)
- ❌ Texto contem qualquer item das listas proibidas §1, §2, §3 → REESCREVER
- ❌ Texto sem inimigo claro (§8) → REESCREVER
- ❌ Texto com travessao (— ou –) → REESCREVER (use virgula, ponto, parenteses ou quebra de linha)
- ❌ Frases curtas empilhadas na mesma linha → REESCREVER (separar em paragrafos)
- ❌ Falha no §9 TESTE FINAL em qualquer item → REESCREVER

### Handoff obrigatorio
Apos entrega, @content-validator roda **Layer 0** (filtro anti-IA UNIVERSAL) automaticamente. Se reprovar, volta pra reescrita. Sem aprovacao do Layer 0, nada avanca pra Layer 1 (formato) nem Layer 2 (tom do cliente).

## INPUTS

- **O que voce vende:** mentoria, curso ou servico a ser validado (obrigatorio)
- **Para quem:** avatar especifico (obrigatorio)
- **Qual dor real:** problema principal do avatar (obrigatorio)
- **Qual transformacao entrega:** resultado mensuravel (obrigatorio)
- **Prova social disponivel:** depoimentos, cases, prints (opcional)
- **Preco/ticket previsto:** faixa de investimento (opcional)

## STEPS

1. Coletar as 4 informacoes obrigatorias
2. Criar Stories 1-2 (Problema): Perguntas que expoe a dor + enquete de validacao
3. Criar Stories 3-4 (Agitacao): Intensificar a dor mostrando consequencias de nao agir
4. Criar Stories 5-6 (Solucao): Apresentar o caminho sem revelar o metodo completo
5. Criar Stories 7-8 (Prova Social): Screenshots, depoimentos, casos reais
6. Criar Story 9 (Sondagem): Enquete de interesse para medir demanda
7. Criar Story 10 (Apresentacao): Descricao da mentoria + beneficios principais
8. Criar Story 11 (CTA Final): Chamada com link ou palavra-chave para pre-cadastro
9. Validar pelo oraculo (progressao PAS, tom, concisao)
10. Entregar sequencia completa formatada

## VETO CONDITIONS

- Se nao tem as 4 informacoes obrigatorias → NAO executar, perguntar
- Se qualquer story tem mais de 3 linhas de texto → Reescrever
- Se progressao PAS nao e clara (problema → agitacao → solucao) → Reestruturar
- Se tom parece educativo/generico em vez de imperial → Reescrever
- Se sondagem (story 9) nao tem enquete mensuravel → Reescrever
- Se CTA final nao tem acao especifica (link, DM ou palavra-chave) → Reescrever

## OUTPUT EXAMPLE

```
STORIES 1-2 (PROBLEMA):
Story 1: "Esta dificil captar novos clientes?"
[Enquete: Sim / Nao]

Story 2: "A maioria dos especialistas passa por isso e acha que o problema e conteudo..."

STORIES 3-4 (AGITACAO):
Story 3: "O mercado ficou mais sofisticado. Todos fazem as mesmas ofertas."
Story 4: "Enquanto voce 'se prepara', alguem com metade da sua experiencia esta fechando."

STORIES 5-6 (SOLUCAO):
Story 5: "Pra se destacar, precisa de orientacao personalizada. Nao de mais curso."
Story 6: "O segredo nao e mais conteudo. E posicionamento que vende sozinho."

STORIES 7-8 (PROVA SOCIAL):
Story 7: [Print] "Olha como a Fulana multiplicou vendas em 3x aplicando isso."
Story 8: [Depoimento] "Mais um resultado real. Sem formula magica."

STORY 9 (SONDAGEM):
"Voce gostaria da minha orientacao pra implementar isso no seu negocio?"
[Enquete: Sim, quero / Ainda nao]

STORY 10 (APRESENTACAO):
"Estou criando uma mentoria exclusiva pra resolver isso. [beneficios]"

STORY 11 (CTA FINAL):
"Se tem interesse, responde MENTORIA que te mando os detalhes."
```

## COMPLETION CRITERIA

- 11 stories completos seguindo framework PAS
- Enquetes estrategicas nos pontos de validacao (stories 1-2, 9)
- Progressao emocional clara: dor → agitacao → esperanca → prova → acao
- Tom imperial consistente
- Score oraculo >= 80%
- Dados de sondagem permitem medir demanda real

## Output Example

```
## STORIES PAS (E7) — "Validacao Mentoria Digital Premium"

Framework: Problema-Agitacao-Solucao | 11 stories | Intencao: Validacao de oferta

PROBLEMA (Stories 1-4):
1: "Voce ja se pegou pensando: eu entrego tanto e faturo tao pouco?"
2: "O problema nao e falta de conhecimento. E falta de sistema."
3: "Eu sei porque ja estive ai. Postando todo dia sem vender nada."
4: Enquete: "Voce sente que trabalha demais pro que fatura?" (Sim/Nao)

AGITACAO (Stories 5-8):
5: "Enquanto voce posta de graca, seu concorrente vende no automatico."
6: "Cada dia sem sistema e dinheiro que voce deixa na mesa."
7: "Daqui 6 meses voce vai estar no mesmo lugar?"
8: Slider emoji: "De 0 a 10, quao frustrado voce ta com isso?"

SOLUCAO (Stories 9-11):
9: "Eu criei um metodo que resolve isso em 90 dias."
10: "To pensando em abrir uma mentoria sobre isso."
11: Caixa de perguntas: "Se eu abrisse, o que voce gostaria que tivesse?"

Score Oraculo: 82% | Sondagem: respostas stories 4, 8 e 11 medem demanda
```

references:
  - data/stories-categorias.md
  - data/frameworks-copy.md
  - data/cta-bank.md
  - data/regras-inviolaveis.md

### Veto Conditions

- id: "CONT_CREATE_STORIES_PAS_001"
  condition: "Briefing da oferta a validar nao fornecido"
  check: "Verificar se as 4 informacoes obrigatorias estao presentes (oferta, publico, dor, transformacao)"
  result: "VETO - BLOCK. Solicitar informacoes faltantes antes de criar sequencia PAS"
  rationale: "Stories PAS sem oferta e dor definidas nao conseguem validar demanda real"

- id: "CONT_CREATE_STORIES_PAS_002"
  condition: "Progressao PAS nao e clara (problema → agitacao → solucao)"
  check: "Verificar se a sequencia segue a ordem PAS com transicoes logicas entre blocos"
  result: "VETO - BLOCK. Reestruturar sequencia respeitando framework PAS"
  rationale: "Framework PAS e a espinha dorsal desta estrategia — desordem mata a eficacia"

### Completion Criteria

- [ ] 11 stories completos seguindo framework PAS com enquetes estrategicas
- [ ] Progressao emocional clara: dor → agitacao → esperanca → prova → acao
- [ ] Dados de sondagem que permitem medir demanda real (enquetes nos stories 1-2 e 9)
- [ ] Tom imperial consistente e score oraculo >= 80%
