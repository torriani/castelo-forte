# Criar Roteiro de Reels para Instagram

name: create-reels
executor: reels-creator
description: Criar roteiro completo de Reels seguindo o DNA BLAZE (6 blocos) + 4C Imperial + hooks virais, com validacao pelo Oraculo Reels em 3 niveis e score minimo 80%
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Framework BLAZE disponivel em data/reels-framework.md
  - Padroes virais de hook disponiveis em data/reels-patterns.md
  - Oraculo Reels disponivel para validacao (data/oraculo-reels.md)

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

- **Tema:** sobre o que e o Reels (obrigatorio)
- **Publico (ICP):** quem vai assistir — avatar com especificidade (obrigatorio)
- **Objetivo:** Gerar leads / Engajamento / Autoridade / Conversao direta (obrigatorio)
- **Duracao:** 15-30s / 30-60s / 60-90s (opcional — default: 30-60s)
- **Padrao viral:** 1 dos 7 padroes: Contraintuitivo, Segredo, Confissao, Urgente, Prova, Tribal, Meta (opcional — recomendado pelo objetivo)
- **Formato:** Oficial / Tatico / Storytelling / Provocacao (opcional — recomendado pelo objetivo)
- **Crenca a quebrar:** qual crenca limitante atacar (opcional)
- **Elemento do Movimento preferido:** crenca, inimigo, mantra ou posicionamento (opcional)

## STEPS

### Etapa 0: CONSULTA OBRIGATORIA (BLOQUEANTE — NAO PULAR)

**ANTES de qualquer outra acao, ler INTEGRALMENTE os arquivos abaixo usando a tool Read.
Nao gerar nenhum hook, bloco ou CTA sem ter feito esta consulta.**

Arquivos a ler (na ordem):
1. `data/hooks-bank.md` — banco de hooks com IDs (foco em secao Reels HB2-REEL-NNN e arquetipos HB2-CAR-NNN)
2. `data/aberturas-poderosas.md` — 5 tipos de abertura
3. `data/cliches-proibidos.md` — palavras/frases banidas
4. `data/regras-inviolaveis.md` — leis gerais de conteudo
5. `checklists/hook-quality.md` — 15 itens de validacao de hook (regras Reels: max 5 palavras)
6. `data/reels-patterns.md` — 7 padroes virais de hook em Reels

**Output do Step 0 (OBRIGATORIO antes de prosseguir):** O agente DEVE iniciar a resposta com o bloco `FONTES_CONSULTADAS` no formato:

```
FONTES_CONSULTADAS:
- hooks-bank.md: [N] hooks-base mapeados pro tema (citar IDs candidatos, ex: HB2-REEL-001, HB2-REEL-005, HB2-CAR-018)
- aberturas-poderosas.md: tipo de abertura escolhido = [Curiosidade|Promessa|Polarizacao|Confissao|Tribal]
- cliches-proibidos.md: [N] cliches a evitar listados (citar 3 exemplos relevantes ao tema)
- regras-inviolaveis.md: regras aplicaveis citadas (mencionar pelo menos 2)
- hook-quality.md: padrao viral alvo = [Contraintuitivo|Segredo|Confissao|Urgencia|Prova|Tribal|Meta]
- reels-patterns.md: padrao Reels escolhido (1 dos 7)
```

**Sem esse bloco, o output e VETADO automaticamente (ver veto CONT_HOOK_SOURCES_001).**

### Etapa 1: Configuracao
1. Coletar as 3 informacoes obrigatorias — perguntar o que faltar
2. Recomendar formato/duracao/padrao pelo objetivo:
   - Leads → Tatico 30-60s + Contraintuitivo | Engajamento → Provocacao 15-30s + Tribal
   - Autoridade → Oficial 60-90s + Prova | Conversao → Storytelling 30-60s + Urgente
3. Apresentar opcoes: "1. X, 2. Y, 3. Z" — aguardar selecao

### Etapa 2: Hook (Bloco 1 BLAZE) — COM RASTRO DE FONTE OBRIGATORIO
4. Gerar 3 hooks (max 5 palavras cada), **com rastreabilidade de fonte**:
   ```
   HOOKS:
   - [VIRAL] "texto" (max 5 palavras)
     └─ base: HB2-REEL-NNN ou HB2-CAR-NNN "[hook original]"
     └─ padrao Reels: [1-Contraintuitivo|2-Segredo|3-Confissao|4-Urgente|5-Prova|6-Tribal|7-Meta]
     └─ adaptacao: [o que troquei pra encaixar no tema]
   - [VIRAL] "texto"
     └─ base: HB-X-NNN "[...]"
     └─ padrao Reels: [...]
     └─ adaptacao: [...]
   - [IMPERIAL] "texto"
     └─ base: criacao original
     └─ padrao Reels: [1 dos 7]
     └─ inspiracao: [HB-X-NNN se houve, ou "criada do zero"]
   ```
5. As 2 [VIRAL] DEVEM citar IDs do hooks-bank.md (preferencia HB2-REEL-NNN, mas HB2-CAR-NNN ou HB2-CAR-NNN tambem aceitos)
6. A [IMPERIAL] pode ser criacao original mas DEVE declarar padrao Reels aplicado
7. Apresentar ao usuario para selecao

### Etapa 3: Roteiro (6 Blocos BLAZE)
6. **B1 Hook (0-3s):** Texto + fala + direcao visual
7. **B2 Retencao (3-15s):** Gap de informacao + tensao + contexto
8. **B3 Segundo Hook (15-25s):** Re-engajamento + segmentacao ICP
9. **B4 Conteudo (25-45s):** Valor + elemento Movimento (OBRIGATORIO)
10. **B5 Moral+CTA (45-55s):** Sentimento climatico (OBRIGATORIO) + CTA desejo
11. **B6 Loop (55-60s):** Conexao com hook ou loop replay

### Etapa 4: 4C Imperial
12. Clareza (1 ideia/bloco) + Concisao + Comando (imperativo) + Contraste (tensao/alivio)

### Etapa 5: Validacao
13. Oraculo Reels 3 niveis: N1 Copy >= 80% → N2 Hook >= 80% → N3 Completo >= 80%
14. Score = (N1 x 0.30) + (N2 x 0.30) + (N3 x 0.40). Se reprovar: reescrever.

### Etapa 6: Entrega
15. Roteiro por bloco (tempos + texto tela + fala + direcao) + caption + repurpose

## VETO CONDITIONS

- Se nao tem as 3 informacoes obrigatorias → NAO executar, perguntar
- Se hook tem mais de 5 palavras → Reescrever (reprovacao automatica)
- Se hook e pergunta → Reescrever (deve ser afirmacao ou comando)
- Se Bloco 4 nao tem elemento do Movimento (crenca/inimigo/mantra/posicionamento) → Adicionar obrigatoriamente
- Se Bloco 5 nao gera 1 dos 5 sentimentos climaticos → Reescrever moral
- Se CTA vende diretamente ("compre", "link na bio") → Reescrever como gerador de desejo
- Se tom parece educativo ("vou te ensinar", "a dica e") → Reescrever no tom imperial
- Se usa palavras proibidas (segredo, dica, truque, hack, simples, facil) → Substituir
- Se nao tem progressao de tensao entre blocos → Reestruturar
- Se foco esta no "eu" em vez do "voce" → Reescrever com foco no espectador
- Se score Oraculo Reels < 80% em qualquer nivel → Reescrever ate atingir

## OUTPUT EXAMPLE

```
REELS: Provocacao + Contraintuitivo (45s)
TEMA: Precificacao errada de coaches | PUBLICO: Coaches que cobram por hora
OBJETIVO: Autoridade + Gerar leads

HOOKS: [VIRAL] "Cobrar por hora mata" / [VIRAL] "Seu preco ta errado" / [IMPERIAL] "Pare de cobrar barato"
SELECIONADO: "Cobrar por hora mata"

BLOCO 1 — HOOK (0-3s)
Tela: "COBRAR POR HORA MATA" | Fala: "Cobrar por hora esta matando seu negocio e voce nem percebe."
Direcao: Close-up, olhar direto, corte seco

BLOCO 2 — RETENCAO (3-15s)
Tela: "127 coaches analisados" | Fala: "Analisei 127 coaches. Todos que faturam menos de 5k cobram por hora."
Direcao: Afastar camera, gestos, ritmo acelerado

BLOCO 3 — SEGUNDO HOOK (15-25s)
Tela: "E o pior?" | Fala: "Quanto mais voce trabalha, menos ganha. Armadilha que voce mesmo criou."
Direcao: Pausa dramatica, close-up

BLOCO 4 — CONTEUDO PRINCIPAL (25-40s)
Tela: "Precificacao por transformacao" | Fala: "Quem fatura 50k+ nao vende hora. Vende transformacao. A diferenca nao e talento. E posicionamento."
Direcao: Energia crescente, andar, gestos enfaticos
MOVIMENTO: INIMIGO — "competir por preco" como armadilha

BLOCO 5 — MORAL + CTA (40-50s)
Tela: "Voce vai continuar sangrando?" | Fala: "Ou voce muda, ou continua rezando pra ter cliente. Manda ESCALA nos comentarios."
Direcao: Olhar fixo, voz firme
SENTIMENTO: INDIGNACAO — vergonha + raiva

BLOCO 6 — LOOP (50-55s)
Tela: "Quantos coaches assim?" | Fala: "Manda esse reel pro coach que cobra por hora. Antes que seja tarde."
Direcao: Tom baixo, corte seco (loop)

CAPTION: "127 coaches analisados. Todos <5k cobram por hora. A diferenca e posicionamento. Manda ESCALA."
SCORE: 85% (N1: 83%, N2: 90%, N3: 84%) — APROVADO
REPURPOSE: Carrossel 7 slides (Blocos 2-4) + Stories 5 (hook + dado + moral + CTA)
```

## COMPLETION CRITERIA

- 6 blocos BLAZE com tempos, texto tela, fala e direcao
- Hook max 5 palavras + padrao viral + 3 opcoes apresentadas
- Movimento no B4 + sentimento climatico no B5 + CTA desejo (nao vende)
- Score Oraculo >= 80% em cada nivel + caption + repurpose
- Tom imperial consistente do inicio ao fim

## Output Example

```
## REELS — "O Teste dos 3 Segundos"

Duracao: 35s | Padrao: Hook Disruptivo | Intencao: Atracao

HOOK (0-3s):
"Abre o perfil de um seguidor seu. Se em 3 segundos ele nao sabe
o que voce vende — voce nao tem bio. Tem decoracao."

DESENVOLVIMENTO (3-25s):
"A maioria dos mentores escreve bio pra parecer bonito.
'Apaixonado por transformacao. Ajudando pessoas a crescer.'
Isso nao vende. Isso e ruido.

Bio que vende tem 3 coisas:
1. Pra quem voce fala
2. Que problema resolve
3. Qual o proximo passo"

CTA (25-35s):
"Faz o teste agora. Abre seu perfil e pergunta pra alguem:
voce sabe o que eu vendo?
Se a resposta demorar, comenta BIO que eu te mando o framework."

CAPTION: Seu perfil tem 3 segundos pra vender ou perder (...)
Score Oraculo: Hook 9/10 | Copy 8/10 | Reel Completo 85%
Repurpose: Carrossel "3 elementos de bio que vende", Stories teste
```

## REFERENCES

- data/hooks-bank.md — Banco de hooks com IDs (HB2-REEL-NNN, HB2-CAR-NNN, HB2-CAR-NNN) — **CONSULTA OBRIGATORIA na Etapa 0**
- data/aberturas-poderosas.md — 5 tipos de abertura — **CONSULTA OBRIGATORIA na Etapa 0**
- data/cliches-proibidos.md — Lista de exclusao — **CONSULTA OBRIGATORIA na Etapa 0**
- data/regras-inviolaveis.md — Leis de execucao — **CONSULTA OBRIGATORIA na Etapa 0**
- checklists/hook-quality.md — 15 itens de validacao — **CONSULTA OBRIGATORIA na Etapa 0**
- data/reels-framework.md — DNA BLAZE: estrutura de 6 blocos
- data/reels-imperial.md — 4C Imperial e tom de comando
- data/reels-patterns.md — 7 padroes virais de hook — **CONSULTA OBRIGATORIA na Etapa 0**
- data/oraculo-reels.md — Validacao em 3 niveis (Copy, Hook, Reel Completo)

### Veto Conditions

- id: "CONT_CREATE_REELS_001"
  condition: "Tema, publico (ICP) e objetivo nao fornecidos"
  check: "Verificar se as 3 informacoes obrigatorias estao presentes nos inputs"
  result: "VETO - BLOCK. Solicitar informacoes faltantes antes de criar roteiro"
  rationale: "Reels sem publico-alvo definido gera conteudo sem direcao e sem retencao"

- id: "CONT_CREATE_REELS_002"
  condition: "Output sem hook validado (mais de 5 palavras ou e pergunta)"
  check: "Verificar se hook tem max 5 palavras e e afirmacao ou comando"
  result: "VETO - BLOCK. Reescrever hook antes de prosseguir com roteiro completo"
  rationale: "Hook e o fator #1 de retencao — se falha nos 3 primeiros segundos, o reel morre"

- id: "CONT_HOOK_SOURCES_001"
  condition: "Output nao inicia com bloco FONTES_CONSULTADAS contendo as 6 fontes obrigatorias"
  check: "Verificar primeiro bloco do output — deve listar hooks-bank.md, aberturas-poderosas.md, cliches-proibidos.md, regras-inviolaveis.md, hook-quality.md, reels-patterns.md"
  result: "VETO - BLOCK. Voltar a Etapa 0 e ler os 6 arquivos antes de gerar qualquer hook"
  rationale: "Sem rastro de consulta, hook e alucinado e ignora banco curado de 220+ hooks-base"

- id: "CONT_HOOK_SOURCES_002"
  condition: "Hooks [VIRAL] sem citacao └─ base: HB-X-NNN do hooks-bank.md"
  check: "Cada hook marcado [VIRAL] DEVE ter linha └─ base: com ID valido (HB2-REEL-NNN, HB2-CAR-NNN ou HB2-CAR-NNN)"
  result: "VETO - BLOCK. Adicionar ID de fonte ou trocar marcador para [IMPERIAL] (criacao original)"
  rationale: "Rastreabilidade obrigatoria — sem ID, e impossivel auditar se o agente consultou o banco"

- id: "CONT_HOOK_SOURCES_003"
  condition: "Hook [IMPERIAL] sem declarar padrao Reels aplicado"
  check: "Hook [IMPERIAL] DEVE ter linha └─ padrao Reels: com 1 dos 7 padroes (Contraintuitivo|Segredo|Confissao|Urgente|Prova|Tribal|Meta)"
  result: "VETO - BLOCK. Declarar padrao Reels aplicado antes de prosseguir"
  rationale: "Hook IMPERIAL sem padrao viral e improviso — reels-patterns.md exige escolha clara"

### Completion Criteria

- [ ] 6 blocos BLAZE com tempos, texto tela, fala e direcao para cada bloco
- [ ] Hook max 5 palavras com 3 opcoes apresentadas e padrao viral identificado
- [ ] Movimento no B4 + sentimento climatico no B5 + CTA de desejo (nao vende direto)
- [ ] Score Oraculo >= 80% em cada nivel + caption + sugestoes de repurpose
