# Criar Bio Imperial

name: create-bio
executor: positioning-expert
description: Criar Bio Imperial completa em 3 fases (Inversao de Poder + Desafio da Realidade + Redefinicao) coletando 6 perguntas uma por vez
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Diretrizes de posicionamento disponiveis em data/posicionamento.md
  - Lista de cliches proibidos disponivel em data/cliches-proibidos.md

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

Coletar UMA PERGUNTA POR VEZ, nesta ordem:

1. **Quem e seu cliente ideal?** (ex: mentores, empresarios, coaches, nutricionistas)
2. **Qual o momento especifico em que essa pessoa percebe que precisa de ajuda?** (ex: quando posta todo dia e ninguem compra)
3. **Qual o problema real que trava o crescimento?** (ex: conteudo sem venda, falta de autoridade)
4. **Qual o resultado que ele quer, mas nao consegue sozinho?** (ex: previsibilidade, vendas no automatico)
5. **Qual esforco inutil ele continua fazendo porque o mercado diz que e certo?** (ex: criar conteudo diario, rodar trafego pago)
6. **Qual verdade incomoda voce acredita que contradiz o senso comum?** (ex: conteudo nao vende. Posicionamento vende.)

## STEPS

1. Fazer pergunta 1 e aguardar resposta
2. Fazer pergunta 2 e aguardar resposta
3. Fazer pergunta 3 e aguardar resposta
4. Fazer pergunta 4 e aguardar resposta
5. Fazer pergunta 5 e aguardar resposta
6. Fazer pergunta 6 e aguardar resposta
7. Construir Fase 1 — Inversao de Poder: "[CLIENTE_IDEAL] me procuram quando [MOMENTO_DE_COLAPSO]."
8. Construir Fase 2 — Desafio da Realidade Aceita: "Eu [transformacao] sem [esforco inutil]."
9. Construir Fase 3 — Redefinicao da Realidade: "Porque [verdade contraintuitiva]."
10. Montar Frase de Dominio completa (3 fases concatenadas)
11. Sintetizar Frase da Bio (ate 150 caracteres)
12. Gerar 3 variacoes de cada para escolha do usuario

## VETO CONDITIONS

- Se fez mais de 1 pergunta por vez → Parar e corrigir (1 por vez)
- Se alguma resposta e vaga/generica → Pedir mais especificidade antes de continuar
- Se Frase de Dominio usa verbos proibidos ("ajudo", "inspiro", "ensino") → Reescrever
- Se Frase da Bio tem mais de 150 caracteres → Reduzir
- Se Bio parece conteudo de LinkedIn ou generica → Refazer completamente
- Se nao usa verbos permitidos (reposiciono, instalo, desbloqueio, acelero, substituo, reprogramo, codifico, transformo) → Corrigir

## OUTPUT EXAMPLE

```
FRASE DE DOMINIO:

"Mentores me procuram quando percebem que postam todo dia e nao vendem.
Eu instalo posicionamento lucrativo onde so existia conteudo vazio — sem depender de posts diarios.
Porque conteudo nao vende. Comando vende."

FRASE DA BIO (150 chars):

"Posiciono mentores para vender todos os dias sem depender de conteudo diario ou formulas cansadas."

---

VARIACAO 2:
Dominio: [variacao]
Bio: [variacao]

VARIACAO 3:
Dominio: [variacao]
Bio: [variacao]
```

## COMPLETION CRITERIA

- 6 perguntas feitas uma por vez (nao em bloco)
- Frase de Dominio com 3 fases claras (Inversao + Desafio + Redefinicao)
- Frase da Bio com ate 150 caracteres
- 3 variacoes para escolha
- Verbos permitidos usados corretamente
- Zero verbos proibidos ("ajudo", "inspiro", "ensino")
- Tom imperial — nao parece generico nem de LinkedIn

## Output Example

```
## BIO IMPERIAL — Mentoria Digital Premium

### Fase 1: Inversao de Poder
Mentores cobram barato porque confundem generosidade com estrategia.

### Fase 2: Desafio da Realidade
Voce posta todo dia, roda trafego, faz live — e continua sem previsibilidade.

### Fase 3: Redefinicao
Construo maquinas de autoridade que vendem sem precisar implorar atencao.

### Bio Final (150 caracteres)
Mentores faturam baixo porque vendem errado.
Construo maquinas de autoridade que vendem no automatico.
Metodo Autoridade Absoluta >> link

### Validacao
- Verbos proibidos: 0 ("ajudo", "inspiro", "ensino" ausentes)
- Tom: Imperial (comando, nao pedido)
- Clareza em 3s: SIM — problema + solucao + CTA visiveis
```

references:
  - data/posicionamento.md
  - data/nucleo.md
  - data/cliches-proibidos.md
  - data/regras-inviolaveis.md

### Veto Conditions

- id: "CONT_CREATE_BIO_001"
  condition: "Respostas das 6 perguntas do framework nao coletadas"
  check: "Verificar se as 6 perguntas foram feitas e respondidas uma por vez"
  result: "VETO - BLOCK. Coletar cada pergunta individualmente antes de construir a bio"
  rationale: "A bio imperial depende das 6 camadas — pular perguntas gera bio generica"

- id: "CONT_CREATE_BIO_002"
  condition: "Sem contexto de posicionamento da marca"
  check: "Verificar se nicho, cliente ideal e transformacao estao claros nas respostas"
  result: "VETO - BLOCK. Solicitar mais especificidade antes de gerar variacoes"
  rationale: "Bio sem posicionamento claro se confunde com bio generica de LinkedIn"

### Completion Criteria

- [ ] Frase de Dominio com 3 fases claras (Inversao + Desafio + Redefinicao) entregue
- [ ] Frase da Bio com ate 150 caracteres e 3 variacoes para escolha do usuario
- [ ] Zero verbos proibidos (ajudo, inspiro, ensino) e verbos permitidos usados corretamente
- [ ] Tom imperial validado — nao parece generico nem educativo
