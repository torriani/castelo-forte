# Gerar Batch de Hooks (Hormozi 70-20-10)

name: create-hook-batch
executor: content-chief
description: Gerar lote de hooks usando framework Hormozi 70-20-10 — 70% comprovados adaptados, 20% variacoes, 10% experimentais
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Banco de hooks disponivel em data/hooks-bank.md
  - Aberturas poderosas disponiveis em data/aberturas-poderosas.md

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

- **Nicho/mercado:** area de atuacao (obrigatorio)
- **Avatar:** quem vai ler (obrigatorio)
- **Formato:** carrossel, reels, stories ou misto (obrigatorio)
- **Quantidade:** quantos hooks gerar (default: 20)
- **Temas especificos:** assuntos para os hooks (opcional)
- **Hooks que ja funcionaram:** referencias de performance anterior (opcional)

## STEPS

### Etapa 0: CONSULTA OBRIGATORIA (BLOQUEANTE — NAO PULAR)

**ANTES de gerar qualquer hook, ler INTEGRALMENTE os arquivos abaixo usando a tool Read.**

Arquivos a ler (na ordem):
1. `data/hooks-bank.md` — banco completo (HB2-CAR-NNN, HB2-REEL-NNN, HB2-CAR-NNN, HB2-CAR-NNN)
2. `data/aberturas-poderosas.md` — 5 tipos de abertura
3. `data/cliches-proibidos.md` — palavras/frases banidas
4. `data/regras-inviolaveis.md` — leis gerais
5. `checklists/hook-quality.md` — 15 itens de validacao

**Output do Step 0 (OBRIGATORIO antes de prosseguir):** O agente DEVE iniciar a resposta com o bloco `FONTES_CONSULTADAS` no formato:

```
FONTES_CONSULTADAS:
- hooks-bank.md: [N] hooks-base mapeados pro nicho [nicho] (citar 5+ IDs candidatos para os 70% comprovados)
- aberturas-poderosas.md: tipos de abertura disponiveis para o nicho
- cliches-proibidos.md: [N] cliches a evitar (citar 3 relevantes)
- regras-inviolaveis.md: regras aplicaveis (mencionar pelo menos 2)
- hook-quality.md: padroes virais alvo do batch
```

**Sem esse bloco, output VETADO automaticamente (ver veto CONT_HOOK_SOURCES_001).**

### Etapa 1: Geracao
1. Coletar nicho, avatar e formato
2. **70% comprovados:** adaptacoes diretas de hooks com ID HB-X-NNN do banco — CADA hook DEVE citar `└─ base: HB-X-NNN`
3. **20% variacoes:** combinacoes/recombinacoes de 2+ hooks do banco — CADA hook DEVE citar `└─ bases: HB-X-NNN + HB-Y-NNN`
4. **10% experimentais:** hooks novos — CADA hook DEVE citar `└─ inspiracao: HB-X-NNN` (ID que inspirou) OU `└─ base: criacao original` + padrao viral
5. Categorizar cada hook por tipo: Universal, Produto, Contraintuitivo, Provocativo
6. Marcar nivel de risco: Seguro / Moderado / Ousado
7. Validar: especificidade pro nicho, tom imperial, concisao (max 18 palavras)
8. Entregar batch organizado por categoria, risco e com rastreabilidade

## VETO CONDITIONS

- Se hooks sao genericos e aplicaveis a qualquer nicho → Reescrever com especificidade
- Se proporcao 70-20-10 nao e respeitada → Rebalancear
- Se hooks sao longos (mais de 18 palavras) → Reduzir
- Se nao tem variedade de tipos → Adicionar tipos faltantes
- Se todos os hooks sao "seguros" → Adicionar hooks ousados
- Se tom nao e imperial → Reescrever

## OUTPUT EXAMPLE

```
FONTES_CONSULTADAS:
- hooks-bank.md: 8 IDs candidatos (HB2-CAR-005, HB2-CAR-014, HB2-CAR-041, HB2-CAR-018, HB2-CAR-022, HB2-CAR-077, HB2-CAR-099, HB2-REEL-001)
- aberturas-poderosas.md: tipos disponiveis = Polarizacao + Confissao
- cliches-proibidos.md: evitando "segredo", "dica", "facil"
- regras-inviolaveis.md: max 18 palavras + zero perguntas + foco no leitor
- hook-quality.md: padroes alvo = Contraintuitivo + Tribal + Meta

BATCH DE HOOKS — [Nicho] — [Data]

70% COMPROVADOS (14 hooks):
1. [Seguro] "Voce esta postando errado. E por isso nao vende."
   └─ base: HB2-CAR-004 "Voce esta fazendo isso errado e nem sabe..."
   └─ adaptacao: trocou "fazendo isso" por "postando" + adicionou consequencia
2. [Seguro] "A maioria dos [nicho] erra quando tenta [acao]..."
   └─ base: HB2-CAR-003 "A maioria das pessoas erra quando tenta [fazer algo]..."
   └─ adaptacao: especificou "[nicho]" no lugar de "pessoas"
3. [Moderado] "Pare de fazer [X] se quiser [Y]"
   └─ base: HB2-CAR-005 "Pare de fazer [X] se quiser [Y]"
   └─ adaptacao: estrutura mantida, X e Y a definir pelo tema
...

20% VARIACOES (4 hooks):
15. [Moderado] "O que [concorrentes] nao te contam sobre [tema]..."
    └─ bases: HB2-CAR-007 "A tecnica pouco conhecida que os especialistas usam..." + HB2-CAR-006 "[Numero] verdades que ninguem te contou..."
    └─ combinacao: pegou "especialistas escondem" do A-007 + "ninguem te conta" do C-006
16. [Moderado] "[Numero] sinais de que voce esta [consequencia negativa]"
    └─ bases: HB2-CAR-011 "3 sinais de que voce esta no caminho errado..." + HB2-CAR-013 "Sinais de uma [persona] comecando a [medo]..."
...

10% EXPERIMENTAIS (2 hooks):
19. [Ousado] "Isso deveria ser ilegal no [nicho]."
    └─ inspiracao: HB2-CAR-017 "Isso deveria ser ilegal." + HB2-CAR-025
    └─ padrao viral: Surpresa + Contraintuitivo
20. [Ousado] "Voce pode me deixar de seguir por dizer isso..."
    └─ base: HB2-CAR-023 "Voce pode me deixar de seguir por dizer isso..."
    └─ padrao viral: Polarizador (Confissao + Tribal)

LEGENDA:
[Seguro] = Formato testado, risco baixo (citacao direta de HB-X-NNN)
[Moderado] = Variacao com potencial, testar com cautela (combinacao de 2+ IDs)
[Ousado] = Experimental, pode viralizar ou dividir audiencia (criacao com padrao viral declarado)
```

## COMPLETION CRITERIA

- Quantidade solicitada de hooks entregue (default: 20)
- Proporcao 70-20-10 respeitada
- Cada hook categorizado por tipo e nivel de risco
- Hooks especificos pro nicho (nao genericos)
- Tom imperial consistente
- Concisao: max 18 palavras por hook
- Variedade de formatos (pergunta, afirmacao, comando, provocacao)

## Output Example

```
## HOOK BATCH — Tema: Precificacao para Mentores

| # | Hook | Tipo | Score | Camada |
|---|------|------|-------|--------|
| 1 | "Cobrar barato nao e humildade. E autossabotagem." | 70% Comprovado | 9.2 | Consciencia |
| 2 | "Quantos clientes voce precisa pra pagar suas contas?" | 70% Comprovado | 8.7 | Consciencia |
| 3 | "Para de dar desconto. Comeca a dar resultado." | 70% Comprovado | 8.9 | Aquecimento |
| 4 | "Seu preco diz pro mercado quem voce e." | 20% Variacao | 8.5 | Atracao |
| 5 | "Cliente que pede desconto nao e cliente. E curioso." | 20% Variacao | 9.0 | Consciencia |
| 6 | "O dia que eu dobrei meu preco, dobrei meus resultados." | 10% Experimental | 8.3 | Aquecimento |
| 7 | "Voce cobra pelo tempo ou pelo resultado?" | 10% Experimental | 8.8 | Consciencia |

Hooks gerados: 7 | Score medio: 8.77 | Cliches detectados: 0
Distribuicao Hormozi: 70% (3) / 20% (2) / 10% (2)
```

references:
  - data/hooks-bank.md — **CONSULTA OBRIGATORIA na Etapa 0**
  - data/aberturas-poderosas.md — **CONSULTA OBRIGATORIA na Etapa 0**
  - data/cliches-proibidos.md — **CONSULTA OBRIGATORIA na Etapa 0**
  - data/regras-inviolaveis.md — **CONSULTA OBRIGATORIA na Etapa 0**
  - checklists/hook-quality.md — **CONSULTA OBRIGATORIA na Etapa 0**
  - data/swipe-posts.md

### Veto Conditions

- id: "CONT_CREATE_HOOK_BATCH_001"
  condition: "Nicho e avatar nao definidos para os hooks"
  check: "Verificar se nicho, avatar e formato estao presentes nos inputs"
  result: "VETO - BLOCK. Solicitar nicho e avatar antes de gerar hooks"
  rationale: "Hooks sem nicho especifico sao genericos e nao convertem"

- id: "CONT_CREATE_HOOK_BATCH_002"
  condition: "Proporcao Hormozi 70-20-10 nao respeitada no batch"
  check: "Verificar distribuicao: 70% comprovados, 20% variacoes, 10% experimentais"
  result: "VETO - BLOCK. Rebalancear batch antes de entregar"
  rationale: "Framework 70-20-10 garante equilibrio entre seguranca e inovacao"

- id: "CONT_HOOK_SOURCES_001"
  condition: "Output nao inicia com bloco FONTES_CONSULTADAS contendo as 5 fontes obrigatorias"
  check: "Verificar primeiro bloco do output — deve listar hooks-bank.md, aberturas-poderosas.md, cliches-proibidos.md, regras-inviolaveis.md, hook-quality.md"
  result: "VETO - BLOCK. Voltar a Etapa 0 e ler os 5 arquivos antes de gerar hooks"
  rationale: "Sem rastro de consulta, batch e alucinado e ignora banco curado de 220+ hooks-base"

- id: "CONT_HOOK_SOURCES_002"
  condition: "Hooks 70% comprovados sem citacao └─ base: HB-X-NNN do hooks-bank.md"
  check: "Cada hook na faixa 70% DEVE ter linha └─ base: com ID valido (HB2-CAR-NNN, HB2-REEL-NNN, HB2-CAR-NNN ou HB2-CAR-NNN)"
  result: "VETO - BLOCK. Adicionar IDs de fonte aos hooks comprovados antes de entregar"
  rationale: "Hook '70% comprovado' sem ID e auto-contraditorio — se nao cita o banco, nao e comprovado"

- id: "CONT_HOOK_SOURCES_003"
  condition: "Hooks 20% variacoes sem citar 2+ IDs de bases combinadas"
  check: "Cada hook na faixa 20% DEVE ter linha └─ bases: com 2+ IDs do hooks-bank.md"
  result: "VETO - BLOCK. Declarar IDs combinados antes de entregar"
  rationale: "Variacao por definicao combina 2+ hooks existentes — sem IDs, e improviso disfarcado"

- id: "CONT_HOOK_SOURCES_004"
  condition: "Hooks 10% experimentais sem declarar inspiracao OU padrao viral"
  check: "Cada hook na faixa 10% DEVE ter └─ inspiracao: HB-X-NNN OU └─ base: criacao original + └─ padrao viral: [1 dos 7]"
  result: "VETO - BLOCK. Declarar inspiracao ou padrao viral aplicado"
  rationale: "Experimental nao significa aleatorio — precisa de ancoragem no sistema"

### Completion Criteria

- [ ] Bloco FONTES_CONSULTADAS no inicio do output (5 arquivos listados)
- [ ] Quantidade solicitada de hooks entregue com proporcao 70-20-10 respeitada
- [ ] Todos os hooks com rastreabilidade (└─ base / └─ bases / └─ inspiracao + padrao viral)
- [ ] Cada hook categorizado por tipo e nivel de risco (Seguro/Moderado/Ousado)
- [ ] Hooks especificos pro nicho com max 18 palavras e tom imperial
- [ ] Variedade de formatos presentes (pergunta, afirmacao, comando, provocacao)
