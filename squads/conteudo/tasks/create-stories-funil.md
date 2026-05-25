# Criar Stories Funil Pressao (E8)

name: create-stories-funil
executor: stories-strategist
description: Criar sequencia de 5 dias de stories com funil de pressao progressiva — vender sem parecer que esta vendendo (Estrategia E8)
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
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

- **O que voce vende:** mentoria, produto ou servico (obrigatorio)
- **Para quem:** avatar especifico (obrigatorio)
- **Qual dor real:** problema principal do avatar (obrigatorio)
- **Qual transformacao entrega:** resultado mensuravel (obrigatorio)
- **Prints/provas disponiveis:** antes/depois, depoimentos, grupo ativo (opcional)
- **Numero de vagas/escassez:** quantidade limitada para urgencia (opcional)

## STEPS

1. Coletar as 4 informacoes obrigatorias
2. Criar Dia 1 (Dor Aberta): Texto de impacto + pergunta desconfortavel que captura atencao emocional
3. Criar Dia 2 (Tensao Coletiva): Prints de respostas + frases cortantes para identificacao coletiva
4. Criar Dia 3 (Solucao sem Vender): Bastidor da ferramenta/metodo + antes/depois sem venda direta
5. Criar Dia 4 (Movimento): Chamada clara + prints do grupo/resultados para urgencia e escassez
6. Criar Dia 5 (Prova + Oferta): Recapitulacao + oferta final com valor demonstrado
7. Validar pelo oraculo (progressao de pressao, tom, naturalidade)
8. Entregar cronograma completo com notas de execucao diaria

## VETO CONDITIONS

- Se nao tem as 4 informacoes obrigatorias → NAO executar, perguntar
- Se qualquer story parece venda direta antes do dia 5 → Reescrever
- Se nao tem progressao de pressao crescente → Reestruturar
- Se dia 3 revela metodo completo em vez de insinuar → Reescrever
- Se dia 4 nao tem elemento de escassez/movimento → Adicionar
- Se tom parece educativo/generico → Reescrever no tom imperial

## OUTPUT EXAMPLE

```
DIA 1 — DOR ABERTA:
"Se voce parasse de postar hoje, alguem sentiria falta?"
[Funcao: Capturar atencao emocional]

DIA 2 — TENSAO COLETIVA:
[Prints de respostas do dia 1]
"Todo especialista acha que entrega valor, mas ninguem sente desejo."
[Funcao: Identificacao + validacao autoridade]

DIA 3 — SOLUCAO SEM VENDER:
[Print antes/depois]
"Essa ideia virou post com copy de venda. Sem formula. Sem template."
[Funcao: Despertar desejo pela solucao]

DIA 4 — MOVIMENTO:
[Print do grupo/numeros]
"213 pessoas vendo ao vivo. Voce ainda pensando."
[Funcao: Urgencia + escassez + movimento]

DIA 5 — PROVA + OFERTA:
"O que eu entrego em minutos, leva horas no manual. Ultimas vagas abertas."
[CTA: Responde QUERO que te mando os detalhes]
[Funcao: Fechamento com valor demonstrado]
```

## COMPLETION CRITERIA

- 5 dias de stories com funcao especifica por dia
- Progressao de pressao: emocional → coletiva → desejo → urgencia → oferta
- Venda so aparece explicitamente no dia 5
- Tom imperial e natural (parece espontaneo, nao roteirizado)
- Score oraculo >= 80%
- Notas de execucao incluidas (horario, formato visual, stickers)

## Output Example

```
## STORIES FUNIL PRESSAO (E8) — "Mentoria Autoridade Absoluta"

Duracao: 5 dias | Publico: Mentores digitais | Intencao: Venda progressiva

DIA 1 — Semente:
Story 1: "Hoje vou contar algo que mudou meu negocio."
Story 2: "Eu postava todo dia. Zero vendas. Ate que entendi uma coisa."
Story 3: Enquete: "Voce sente que posta muito e vende pouco?"

DIA 2 — Problema:
Story 1: "87% dos mentores que me procuram tem o mesmo problema."
Story 2: "Conteudo sem sistema e vitrine sem caixa registradora."
Story 3: Caixa de perguntas: "Qual seu maior desafio com conteudo?"

DIA 3 — Agitacao:
Story 1: "Quantos meses voce vai continuar postando sem resultado?"
Story 2: Print de resultado: "Esse mentor faturou 23k em 30 dias."

DIA 4 — Solucao:
Story 1: "Existe um metodo. E nao envolve postar mais."
Story 2: "3 pilares: posicionamento, sistema, conversao."

DIA 5 — Oferta:
Story 1: "Abri 5 vagas pro Autoridade Absoluta."
Story 2: "Comenta QUERO que eu te mando os detalhes."

Score Oraculo: 84% | Notas: postar entre 10h-12h, usar sticker de contagem regressiva dia 5
```

references:
  - data/stories-categorias.md
  - data/cta-bank.md
  - data/regras-inviolaveis.md
  - data/oraculo-posts.md

### Veto Conditions

- id: "CONT_CREATE_STORIES_FUNIL_001"
  condition: "Briefing da oferta nao fornecido (oferta, publico, dor, transformacao)"
  check: "Verificar se as 4 informacoes obrigatorias estao presentes nos inputs"
  result: "VETO - BLOCK. Solicitar informacoes faltantes antes de criar funil de stories"
  rationale: "Funil de pressao sem oferta clara gera 5 dias de stories sem direcao de conversao"

- id: "CONT_CREATE_STORIES_FUNIL_002"
  condition: "Venda aparecendo antes do dia 5 na sequencia"
  check: "Verificar se stories dos dias 1-4 vendem indiretamente e so dia 5 tem oferta explicita"
  result: "VETO - BLOCK. Reestruturar sequencia para manter pressao progressiva sem venda prematura"
  rationale: "Funil de pressao funciona pela acumulacao — venda antecipada quebra a tensao"

### Completion Criteria

- [ ] 5 dias de stories com funcao especifica e progressao de pressao crescente
- [ ] Venda so aparece explicitamente no dia 5 com valor demonstrado nos dias anteriores
- [ ] Tom imperial e natural em toda sequencia com notas de execucao (horario, formato, stickers)
- [ ] Score oraculo >= 80% validado
