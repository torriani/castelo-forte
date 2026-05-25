<!--
checklist_id: filtro-anti-ia
version: 3.7
changelog:
  v3.7: |
    Enriquecimento com pesquisa externa de mercado (2026-05-24).
    Fonte: docs/research/2026-05-24-projetos-escrita-anti-ia/ (Wikipedia "Signs of AI writing" + Bloomberry AI Writing Patterns Database 7400 entradas + blader/humanizer 20.7k stars + conorbronsdon/avoid-ai-writing 42 padrões).
    ADICIONADO §23.6 — Vocabulário pomposo IA-tell PT-BR (mergulhar fundo, meandros, cerne, âmbito, ressaltar, sublinhar, fomentar, tapeçaria, mosaico, panorama, marcante, vibrante, abrangente, holístico, multifacetado, notável, pivotal).
    ADICIONADO §23.7 — Hooks IA-tell PT-BR (reveal setup, candor opener, world-state hook — fingerprints "Very High" Bloomberry).
    ADICIONADO §23.8 — Transição e filler PT-BR (em outras palavras, vale notar, dito isso, a propósito, em última análise — equivalentes BR dos 625 fillers Bloomberry).
    ADICIONADO §23.9 — Rhetorical Contrast Cadence (padrão "Negativo + Mas/Porém + Positivo" repetido — cadência #1 IA segundo Bloomberry). Inclui regex sugerido pra adicionar no anti-ia-structural.mjs.
    ADICIONADO §23.10 — AI Sentence DNA quadripartite (Opening→Expansion→Contrast→Resolution) — assinatura estrutural IA segundo Bloomberry, complementa §3 e §15.
    Princípio mantido: filtro UNIVERSAL, sem voice profile específico, complementa §1-§3 sem duplicar.
  v3.6: |
    Adicionadas 2 regras operacionais do operador (24/05/2026):
    REGRA 1 (threshold absoluto): "A gente só faz texto nota 10".
      - Threshold PASS = 100. REMOVIDO verdict "REVIEW".
      - Agora só 2 verdicts: PASS (overall_score = 100) ou REPROVADO (< 100).
      - Refine loop não para até bater 100 ou esgotar max_iterations.
      - Atualizado §25 (threshold) e §26 (refine).
    REGRA 2 (auto-suficiência semântica): "Leitor cego entende tudo".
      - Adicionada §30 — AUTO-SUFICIÊNCIA SEMÂNTICA.
      - Adicionada 4ª pergunta na §29 (Cena viva): "Leitor cego entende as referências?"
      - Adicionada R8 na §14 (regras de reescrita).
      - Conceitos próprios não-popularizados (Ferrari vs Toyota, "funcionário com CNPJ") precisam de contexto dentro do post OU substituição por referência universal.
  v3.5: |
    Calibragem com operador após teste real em 12 peças.
    REMOVIDO: regra mecânica do hook do §28 (gerava falso positivo em hooks humanos com 2+ pontos).
    DEPRECADO: §28 (regra "hook = 1 ponto final").
    ADICIONADO: §29 — Dimensão "Cena viva 25%" no crítico LLM, redefine a Dimensão 1 do §25.
    Critério novo (3 testes semânticos): pinta cena? tem emoção/reação? é conversa viva?
    Hooks com 2+ pontos finais que pintam cena (CR-08, CR-12) agora são corretamente APROVADOS.
    Detector regex `detectHookViolation()` agora retorna [] sempre (mantido por compatibilidade).
    Aprendizado: avaliação semântica é LLM, não regex.
  v3.4 (deprecada 24/05/2026): "Tentou adicionar §28 'hook = 1 ponto final'. Era regra mecânica demais — falso positivo em hooks humanos legítimos. Substituída por §29 em v3.5."
  v3.3: |
    Fusão COMPLETA das 4 fontes (squad v3.1 + Impeccable + course-creator V2 + revisão externa especializada).
    Adicionado:
    - §22 PRINCÍPIOS PRESCRITIVOS POSITIVOS (12 princípios do Impeccable que dizem "como fazer", não só "o que evitar")
    - §23 DENYLIST PT-BR EXPANDIDA (stolen-engineer diction, internal jargon, marketing voice — categorias do Impeccable adaptadas)
    - §24 UX WRITING UNIVERSAL (botões, erros, empty states, loading, confirm — clarify.md do Impeccable)
    - §25 5 DIMENSÕES PONDERADAS DO CRÍTICO (course-creator V2 — naturalidade 25%, fechamento 25%, tom 20%, estrutura 15%, ritmo 15%)
    - §26 PRINCÍPIOS DE REESCRITA UNIVERSAIS (REFINE_PROMPT do course-creator V2, 6 princípios)
    - §27 AUDIT TRAIL (course-creator V2 — log de toda validação pra evolução do filtro)
    O filtro continua UNIVERSAL — qualquer cliente. Voice profile específico (Castelo Forte, Halbert, etc) é etapa SEPARADA depois do filtro, não dentro dele.
  v3.2: |
    Fusão com feedback de revisão externa especializada (23/05/2026) sobre 14 conteúdos reais
    (CR-01 a CR-04 reprovados, PT-031 aprovado, PT-032/033/034 reprovados, tweet "corte" reprovado,
    tweet "pai de família" aprovado como modelo de referência externo).
    Adicionado:
    - §15 PARALELISMO ESTRUTURAL ENTRE POSTS (queixa central da revisão)
    - §16 CONTEXTO NO PRIMEIRO SEGUNDO (problema do tweet "corte")
    - §17 RITMO QUANTITATIVO (regra 3× ratio entre maior e menor frase)
    - §18 NÚMEROS REAIS > ADJETIVOS DE TAMANHO (lição do modelo lista-evidência)
    - §19 MODELOS CANÔNICOS A/B/C (anatomia de posts que funcionam)
    - §20 VALIDADOR REGEX EXECUTÁVEL (squads/conteudo/scripts/anti-ia-validate.mjs)
    - §21 SUITE DE EXEMPLOS CANÔNICOS (squads/conteudo/checklists/examples/)
    Também integrado: doutrina dos 8 padrões estruturais do Impeccable (pbakaus/impeccable);
    loop critic-refine do course-creator V2.
  v3.1: "Adicionada §14 — Regras de Reescrita (preservar original bom, calibrar números à realidade do nicho, completar ideia). Origem: feedback Castelo Forte 2026-05-18."
scope: UNIVERSAL (todos os clientes, todos os formatos, todos os agentes de escrita)
applies_to:
  - carousel-creator
  - reels-creator
  - stories-strategist
  - print-tweet-creator
  - content-repurposer
  - content-suggester
  - positioning-expert (bio, CLC, storyads)
  - strategist (copy de campanha)
  - copy-chief (squad copy — Layer 0 antes do Oráculo Castelo Forte)
  - tier-1-estrategistas (squad copy)
  - tier-2-executores (squad copy)
enforced_by: content-validator (Layer 0, antes do oráculo de tom)
also_enforced_by:
  - oraculo-castelo-forte (squad copy — Layer 0 antes da validação de copy)
  - skill /anti-ia (invocação manual em qualquer projeto)
  - hooks/pre-approval-check.mjs (CRM de aprovações)
executable_validator: scripts/anti-ia-validate.mjs (regex + detectores estruturais)
severity: VETO_BLOCKING
order_of_application:
  1: filtro-anti-ia (UNIVERSAL — esta checklist)
  2: oraculo-posts.md OU oraculo-reels.md OU oraculo-castelo-forte.md (formato-específico)
  3: tom-de-voz do cliente ativo (ex: data/nucleo.md para Castelo Forte)
-->

# FILTRO DE NATURALIDADE ANTI-IA — v3.7

> **REGRA OBRIGATÓRIA DE SISTEMA.** Este filtro se aplica a TODO texto que você gerar, independente do cliente, do formato ou do canal. Vale para post, copy, roteiro, e-mail, legenda, headline, CTA, descrição, bio, anúncio, página de vendas — qualquer texto que sai pro usuário final.
>
> Este é o filtro UNIVERSAL. Depois dele, aplique o documento de TOM DE VOZ específico do cliente.

---

## COMO APLICAR (duas camadas obrigatórias)

### CAMADA 1 — DURANTE A ESCRITA
Filtre enquanto escreve. Não produza texto sujo pra "limpar depois". Aplique as regras desde a primeira frase do rascunho.

### CAMADA 2 — REVISÃO FINAL (CHECKPOINT OBRIGATÓRIO)
Antes de entregar QUALQUER texto, rode o `TESTE FINAL` da seção 9. Se falhar em qualquer item, reescreva antes de liberar.

---

## 1. FRASES E EXPRESSÕES PROIBIDAS (lista negra)

### Aberturas e ganchos batidos
- "a verdade que ninguém te conta"
- "não é sobre X, é sobre Y"
- "muita gente não percebe isso"
- "se você chegou até aqui"
- "neste vídeo vamos"
- "neste post vou falar"
- "hoje quero falar sobre"
- "vamos falar sobre"
- "imagine só"
- "imagina comigo"
- "imagine acordar todo dia sabendo que..."
- "você já parou pra pensar"
- "já se pegou pensando"
- "saiba que"
- "fato é que"

### Fechamentos e morais genéricas
- "em resumo"
- "no final do dia"
- "no final das contas"
- "e isso muda tudo"
- "faz toda a diferença"
- "pense nisso"
- "e é por isso que"
- "lembre-se sempre"
- "fica a reflexão"
- "no fim, é sobre..."
- "e isso é poderoso"
- "e isso é importante"

### Vocabulário corporativo morto
- "alta performance"
- "novos patamares"
- "transformar resultados"
- "potencial máximo"
- "jornada" (de sucesso, de transformação, do herói)
- "desbloquear"
- "próximo nível"
- "escalar com excelência"
- "revolucionário", "extraordinário", "transformador"
- "incrível" (como elogio próprio)
- "mindset" (usado vazio)

### Tom de coach motivacional
- "acredite em você"
- "você consegue"
- "basta querer"
- "vai dar certo"
- "o céu é o limite"
- "tudo é possível"
- "saia da zona de conforto"

### Construções simétricas viciadas
- "não é só X, é Y"
- "mais que X, é Y"
- "tanto X quanto Y"
- "não apenas... mas também"

### Muletas e formalismos artificiais
- "aliás" (como início pra emendar ideia)
- "inclusive" (como muleta de continuidade)
- "basicamente" (sem função real)
- "literalmente" (como intensificador)
- "de fato", "na verdade", "na realidade" (em excesso)
- "em última análise", "em essência", "fundamentalmente"
- "trata-se de", "diz respeito a"
- "uma vez que" (no sentido de "porque")
- "vale ressaltar", "é importante destacar", "cabe mencionar"
- "por outro lado" (em excesso)
- "portanto", "logo", "assim sendo", "dessa forma"
- "aqui está o pulo do gato", "aqui está o segredo", "aqui está a questão"

---

## 2. FINGERPRINTS DE IA ESCREVENDO PT-BR

> Esta seção é específica pra padrões que IA usa quando escreve português brasileiro. São os tiques que MAIS denunciam que não é humano escrevendo. Atenção redobrada.

### Pontuação e ritmo

1. **Não use travessão (—) como pausa estilística.** Brasileiro usa vírgula, parênteses ou ponto. Travessão em PT-BR só aparece em discurso direto literário, e mesmo assim raro.

2. **Não empilhe frases curtas martelando na MESMA linha/parágrafo.** "Faz isso. Faz aquilo. É assim." é fingerprint de IA. Use vírgula, "e", "mas", "então" pra conectar.

   **EXCEÇÃO:** frases curtas em LINHAS SEPARADAS (com quebra de parágrafo entre elas) funcionam — criam respiro e ritmo natural. Brasileiro escreve assim. O que IA faz errado é empilhar tudo na mesma linha.

   ❌ ERRADO (mesma linha):
   "Preço alto filtra. Preço baixo atrai problema. Quem cobra pouco atende muito."

   ✅ CERTO (linhas separadas):
   "Preço alto filtra cliente.

   Preço baixo atrai problema."

3. **Não use frases do mesmo tamanho em sequência.** Mesmo se forem médias. Texto humano respira — uma curta, uma longa de raciocínio, uma média.

4. **Não use ponto e vírgula em texto casual.** IA usa muito; brasileiro escrevendo post, copy ou email casual quase nunca usa. Em texto formal pode, mas é exceção.

5. **Não use dois pontos pra "anunciar" algo o tempo todo.** "Tem três coisas que importam: tempo, dinheiro e energia." Conecte de outra forma quando der.

### Estrutura de frase

6. **Não termine frase com palavra isolada de impacto.** "E o resultado? Decepção." Em PT-BR vira clichê de coach.

7. **Não use anáfora forçada** (repetir início de frase pra "ênfase"). "É sobre coragem. É sobre escolha. É sobre fazer." Padrão de TED Talk traduzido. Ninguém escreve assim em português natural.

8. **Não force paralelismo simétrico.** "Quem cobra pouco atende muito. Quem cobra muito atende pouco." Simetria perfeita denuncia. Humano escreve "Quem cobra pouco precisa atender em massa, quem cobra alto entrega valor pra poucos."

9. **Não use pergunta-resposta como recurso retórico.** "E sabe o que acontece? Nada." IA adora esse pingue-pongue.

10. **Não comece frase com conectivo solto** ("E é exatamente isso." / "Mas tem um detalhe." / "Porque a verdade é essa."). Texto humano não fragmenta dessa forma — emenda na frase anterior.

### Vocabulário e construção

11. **Não use adjetivo antes do substantivo em excesso.** Em português a gente põe adjetivo depois ("uma estratégia poderosa"), não antes ("uma poderosa estratégia"). IA traduz do inglês mantendo a ordem inglesa.

12. **Não use "o mesmo" como pronome.** "Veja o resultado e aplique o mesmo." Brasileiro escreve "aplique isso" ou "aplique também".

13. **Não comece com "Imagine..."** como ferramenta de engajamento. "Imagine acordar todo dia sabendo que..." é coach manual.

14. **Não use negação dupla pra suavizar** ("Não é incomum que..." / "Não é raro encontrar..."). Brasileiro escreve "é comum", "é frequente".

15. **Não use reforço retórico vazio** ("E isso é poderoso." / "E isso é importante."). Frase que não acrescenta nada, só serve pra fechar o parágrafo com "peso".

16. **Não termine cada parágrafo com sentença de moral.** IA adora fechar bloco com aforismo. Texto humano não fecha tudo com chave de ouro — alguns parágrafos só terminam.

### Sintático

17. **Não use voz passiva onde caberia voz ativa.** "Resultados são alcançados por quem age." → "Quem age alcança resultado."

18. **Não use sujeito inanimado abstrato.** "A estratégia revela que..." / "O método mostra que..." Em PT-BR natural quem revela e mostra é gente, não conceito.

19. **Não use sempre ordem direta sujeito-verbo-objeto.** Texto humano inverte às vezes. Quebre a ordem em algumas frases.

20. **Não use conectivos de coesão em excesso.** "Portanto", "logo", "assim sendo", "dessa forma" — brasileiro casual não usa. Usa "então" ou nada.

---

## 3. PADRÕES ESTRUTURAIS PROIBIDOS

- **Explicação didática em excesso** — tom de professor dando aula
- **Estrutura previsível** — intro → 3 pontos → conclusão (IA adora tríade simétrica)
- **Listas de 3 itens simétricos sem motivo real** — se você adicionou um item só pra fechar tríade, corta. Bullets podem ser 2, 4, 5, 6.
- **Pergunta retórica genérica de abertura** — "você já se pegou pensando...?"
- **Parênteses explicativos didáticos** — "(ou seja, ...)", "(em outras palavras, ...)"
- **Emojis decorativos em texto corrido** — só se o cliente usa, e em posição variável (não sempre nos mesmos lugares previsíveis)
- **Mais de 1 "que" por frase**
- **Advérbios em -mente quando dá pra cortar** ("rapidamente" → "rápido"; "claramente" → "claro")
- **Gerúndio em CTA** — "vou estar te enviando", "estarei aguardando"

### Padrões estruturais adicionais (origem: análise Impeccable + revisão externa)

- **Negation pivot recorrente** — "Não é X. É Y" / "Não é só X, é Y" usados mais de 1 vez no mesmo texto. **MÁXIMO 1 OCORRÊNCIA POR POST.** Detectado em CR-01 a CR-04 (todos reprovados na revisão).
- **Five-paragraph essay shape** — intro → 3 seções → conclusão em todo post. Mate isso. Lidere com o exemplo. Pule a conclusão. Deixe seções com 1 frase.
- **Comprimento uniforme de parágrafo** — todos os parágrafos com 2-3 linhas. Injete 1 parágrafo de 4 palavras OU 1 de 20+ palavras pra quebrar.
- **Balance sintético** — pros e cons de tamanho igual quando uma direção é claramente certa. Escreva a recomendação. Note exceções breves.
- **Confiança oca** — "poderoso", "incrível", "transformador" sem número anexado. Substitua por dado.
- **Hedge stack** — "talvez seja possível considerar..." Cada hedge isolado tudo bem; empilhados soam treinados.
- **Copy intercambiável** — troque "Castelo Forte" por concorrente. Se nada vira mentira, a copy é genérica.

---

## 4. PADRÕES CONCEITUAIS PROIBIDOS

- **Tentar agradar todo mundo** — texto sem posicionamento é texto morto
- **Falsa humildade performática** — "eu também já errei muito", "não sou perfeito mas..."
- **Hashtag-pensamento** — frases feitas pra virar legenda motivacional vazia
- **Frase de efeito sem substância** — bonita por fora, oca por dentro
- **Linguagem neutra, polida demais** — sem opinião, sem energia, sem lado
- **Generalidade quando dá pra ser específico** — "muito dinheiro" → "R$ 80 mil"; "muita gente" → "9 em cada 10 mentores"

---

## 5. IDENTIFICAR E CORRIGIR

Se encontrar no rascunho, refaça:

| Sintoma | Correção |
|---|---|
| Frase "bonitinha demais" | Tornar mais crua, mais falada |
| Construção perfeita demais | Quebrar o ritmo, deixar imperfeito |
| Texto linear demais | Variar comprimento de frase, criar cadência |
| Frase curta empilhada na mesma linha | Conectar com vírgula ou separar em parágrafos diferentes |
| Falta de emoção | Inserir intenção, energia, opinião |
| Falta de posicionamento | Tomar lado, defender uma ideia |
| Tudo soa igual | Mudar o ataque da frase, começar diferente |
| Genérico demais | Trocar por número, nome, exemplo concreto |

---

## 6. GARANTIR NO TEXTO FINAL

- **Voz humana autêntica** — parece fala (ou escrita pessoal), não redação
- **Personalidade clara** — tem opinião, não é neutro
- **Ritmo natural** — mistura frase curta com frase longa
- **Energia emocional** — não é morno
- **Clareza sem parecer aula**
- **Trechos que podem virar corte forte** — linhas que se sustentam sozinhas
- **Especificidade** — números reais, nomes reais, casos reais
- **Inimigo claro** — todo texto está contra ALGO

---

## 7. DIREÇÃO DE ESTILO

- Escreva como alguém experiente, que domina o tema
- Não explique o óbvio
- Não repita padrões saturados de YouTube/Instagram
- Prefira impacto a perfeição
- Corte tudo que for excesso
- Frase curta tem peso quando aparece em momento certo — não quando empilha

---

## 8. REGRA DO INIMIGO (obrigatória)

Todo texto bom tem um inimigo claro. Sem inimigo, o texto fica morno.

O inimigo pode ser:
- Uma crença errada do mercado
- Um comportamento que o cliente não tolera
- Um tipo de pessoa/profissional que faz tudo errado
- Uma prática que o cliente combate

**Se você não consegue apontar contra QUEM ou contra O QUÊ o texto está, reescreve.**

---

## 9. TESTE FINAL (CHECKPOINT OBRIGATÓRIO)

Antes de liberar o texto, responda:

1. Soa como alguém de verdade escrevendo (ou falando, se for roteiro)?
2. Tem alguma frase, expressão ou clichê das listas proibidas (§1)?
3. Tem fingerprint de IA escrevendo PT-BR (§2)? Especialmente: travessão? Frase curta empilhada na mesma linha? Anáfora forçada?
4. Tem padrão estrutural proibido (§3)?
5. O texto tem personalidade ou poderia ser de qualquer canal?
6. Tem inimigo claro (§8)?
7. Tem especificidade (número, nome, caso) ou tá no abstrato?
8. **CHECKPOINT CRUZADO COM TOM DE VOZ:** o texto poderia sair da boca/mão do cliente? Tem ao menos uma palavra, expressão, ataque ou bordão que ele usa?

**Se qualquer resposta indicar problema, REESCREVA antes de entregar.**

---

## 10. REGRA DE OURO

> Se o texto parecer **bonito demais, correto demais ou genérico demais**, está errado. Corrija até parecer humano, imperfeito e real.

---

## 11. EXEMPLOS ANTES/DEPOIS

### Exemplo 1 — Abertura de post

❌ **ANTES (IA):**
"Hoje eu quero falar sobre uma verdade que ninguém te conta sobre vendas. Se você chegou até aqui, é porque quer resultados de verdade."

✅ **DEPOIS:**
"Mentor que vende barato não tem problema de marketing. O problema é de posicionamento."

**Por quê:** cortou aquecimento e clichê de abertura. Entrou com opinião e inimigo claro (o mentor que vende barato).

---

### Exemplo 2 — Frase curta empilhada na mesma linha (fingerprint clássico)

❌ **ANTES (IA):**
"Preço alto filtra. Preço baixo atrai problema. É isso."

✅ **DEPOIS (versão A — conectado):**
"Preço alto filtra cliente, enquanto preço baixo atrai problema."

✅ **DEPOIS (versão B — separado em parágrafos):**
"Preço alto filtra cliente.

Preço baixo atrai problema."

**Por quê:** na mesma linha, frase curta empilhada vira fingerprint. Conectada com vírgula vira frase humana. Separada por quebra de parágrafo cria respiro e mantém o ritmo cru.

---

### Exemplo 3 — Explicação de método

❌ **ANTES (IA):**
"Não é sobre vender mais, é sobre vender melhor. Muita gente não percebe isso, mas a verdade é que o preço alto atrai o cliente certo."

✅ **DEPOIS:**
"Quem cobra alto não vende menos. Vende pra cliente diferente. Mentor que ainda acha que volume é a saída tá brigando no campeonato errado."

**Por quê:** matou "não é X, é Y", matou "muita gente não percebe". Posicionamento direto, inimigo claro (mentor que aposta em volume), exemplo com construção mais elaborada que evita simetria forçada.

---

### Exemplo 4 — Fechamento / CTA

❌ **ANTES (IA):**
"Em resumo, se você quer escalar seu negócio de mentoria e alcançar novos patamares, é fundamental aplicar essas estratégias no seu dia a dia."

✅ **DEPOIS:**
"Quem aplica passa. Quem fica reclamando que mentoria não escala, fica esperando."

**Por quê:** sem "em resumo", sem "novos patamares", sem moral genérica. Inimigo claro (quem reclama em vez de aplicar). Aqui a construção paralela funciona porque está em ÚLTIMO bloco — uso pontual, não padrão do texto.

---

### Exemplo 5 — Texto descritivo de produto

❌ **ANTES (IA):**
"O programa COLISEU foi desenvolvido para mentores de alta performance que buscam transformar seus resultados através de uma metodologia exclusiva e comprovada."

✅ **DEPOIS:**
"COLISEU não é programa pra quem está começando. É pra mentor que já fatura e cansou de operar como autônomo de luxo."

**Por quê:** cortou jargão corporativo ("alta performance", "transformar resultados", "metodologia exclusiva"). Definiu o público pelo que ele NÃO é. Posicionamento + inimigo (autônomo de luxo).

---

## 12. NOTA ESPECIAL — USO DE FRASE CURTA

Frase curta funciona quando:

- Aparece pontualmente, não como padrão do texto inteiro
- Está em LINHA SEPARADA (parágrafo próprio) das outras frases curtas
- Fecha um bloco ou abre uma seção — não empilhada no meio
- Tem função real: cortar ritmo, enfatizar conclusão, dar pausa

Frase curta NÃO funciona quando:

- Vem empilhada na mesma linha que outras curtas
- Aparece três ou mais vezes em sequência
- É usada como recurso de estilo o tempo todo
- Substitui conectivo natural ("Faz isso. Faz aquilo." em vez de "Faz isso e aquilo.")

---

## 14. REGRAS DE REESCRITA (CRÍTICO — quando aplicar filtro em texto existente)

> Esta seção foi adicionada na v3.1 porque a aplicação do filtro estava gerando texto pior que o original em muitos casos. Reescrita errada também é fingerprint de IA.

### R1 — Preservar frase original boa
Se a frase original transmite a tese com clareza e ritmo natural, **NÃO reescrever**. Apenas **enriquecer com o porquê** ou um complemento.

❌ **ERRADO:** Trocar "Escada de valor não funciona no Brasil. Nunca funcionou." por "Escada de valor é golpe americano que ninguém te avisou."
✅ **CERTO:** Manter original + adicionar "A escada de valor é um golpe americano que ninguém teve coragem de te avisar."

**Por quê:** "Nunca funcionou" é ênfase legítima, não fingerprint. Pulou pra reescrita por reflexo, sem necessidade real.

### R2 — Teste oral antes de propor substituição
Antes de trocar uma frase, leia em voz alta a alternativa. Se soa mais artificial que o original, **mantém o original**.

❌ **ERRADO:** Trocar "Quase todo mundo aprendeu" por "Aprenderam todos a mesma coisa" (soa traduzido).
✅ **CERTO:** "Todo mundo aprendeu da mesma forma" (mais natural).

### R3 — Calibrar números à realidade do nicho (CRÍTICO)
Quando adicionar especificidade numérica, **rode a matemática**. Se o número implica cenário impossível ou inverossímil pro nicho, ele destrói credibilidade — pior que abstração.

❌ **ERRADO:** "Precisa vender 30 por dia de R$3.000 = R$90 mil/dia" (irrealista)
✅ **CERTO:** "Precisa vender 5 por dia só pra fechar o mês" (realista)

**Regra prática:** Antes de cravar um número, perguntar:
- Esse volume é factível pro nicho do cliente?
- A multiplicação resulta em valor coerente com a realidade do mercado?
- Se eu fosse o cliente lendo isso, esse número me faria sentido ou me faria duvidar?

### R4 — Conhecer a definição de high/low ticket DO CLIENTE
Não usar definições genéricas. Calibrar exemplos com a realidade do nicho.

**Para Castelo Forte (mentoria high ticket):**
- Low ticket: R$97, R$197, R$297
- Médio ticket: R$497, R$997
- High ticket: R$3.000+
- Premium: R$30.000+

❌ **ERRADO:** Usar R$3.000 como exemplo de "produto barato" (no universo Castelo Forte é high ticket)
✅ **CERTO:** R$297 como low ticket, R$3.000 como high básico, R$30.000 como premium

**Generalização:** Antes de inventar número, consultar `data/nucleo.md` ou contexto do cliente ativo. Cada nicho tem sua escala.

### R5 — Texto humano frequentemente é incompleto, redundante ou hesitante
Texto polido demais é fingerprint mesmo SEM frase curta empilhada. Humano:
- Repete uma palavra pra reforçar ("vive em movimento, vive sempre em movimento")
- Refraseia no meio da frase ("...que tem dinheiro, sabe, que tem capacidade de investir")
- Deixa pendente quando o sentido já está claro

❌ **ERRADO:** "Tem dinheiro circulando e investe quando vê valor" (polido demais)
✅ **CERTO:** "Tem dinheiro circulando, e quando aparece valor de verdade, investe sem pensar muito"

**Regra prática:** Se a frase está "elegantemente compacta", joga um pouco de imperfeição: redundância, refrasing, ou um "sabe" no meio.

### R6 — Não trocar frase clara por metáfora forçada
"Cute" não é melhor. Direto é melhor. Metáfora só quando ela é mais clara ou mais visceral que a versão literal.

❌ **ERRADO:** Trocar "Nem todo mundo que chega no Direct merece sua atenção" por "Mentor que responde todo direct virou atendente de SAC" (metáfora forçada, perdeu clareza)
✅ **CERTO:** Manter original ou ajustar pra "Quem responde todo direct virou atendente de quem nunca vai pagar"

### R7 — Frase tem que terminar a ideia
Coerência de raciocínio > impacto isolado. Não cortar pra parecer profundo.

❌ **ERRADO:** "Quem ainda chega, cara, tem muito" (parece corte, não terminou a ideia)
✅ **CERTO:** "Quem ainda acha que precisa aquecer cliente high ticket nunca vendeu pra um cara de verdade"

### R8 — Referência proprietária sem contexto (v3.6)
Se o crítico identificou conceito proprietário, metáfora própria ou sigla interna sem contexto, **escolha 1 das 3**:
- **Opção A:** substituir por referência universal que o mercado conhece
- **Opção B:** explicar o conceito dentro do próprio post antes de usar
- **Opção C:** reformular evitando a referência

Não deixe ambíguo. Não diga "todo mundo entende" — leitor cego é o critério.

❌ **ERRADO:** "Você tá rodando modelo Ferrari ou modelo Toyota?" (conceito proprietário, leitor pensa em carro)
✅ **CERTO (Opção A):** "Você tá rodando marca de luxo (fila) ou marca de massa (promoção)?"
✅ **CERTO (Opção B):** "Modelo Ferrari = marca tão desejada que tem fila de espera, sem desconto. Modelo Toyota = marca de massa, sempre tem promoção. Você tá rodando qual?"

Detalhe completo em §30.

### CHECKPOINT DE REESCRITA (rodar SEMPRE antes de propor versão nova)

Antes de entregar uma reescrita, perguntar:

1. **A frase original tinha algum problema REAL** (das listas §1, §2, §3)? Se não, NÃO reescrever.
2. **A alternativa proposta soa MELHOR** quando lida em voz alta? Se não, manter original.
3. **Se adicionei número, ele faz sentido na realidade do nicho do cliente?** Se não, refazer ou tirar.
4. **A frase nova TERMINA a ideia?** Se cortou no meio pra parecer profundo, completar.
5. **Mantive a tese e o inimigo do original?** Se mudei a tese sem necessidade, voltar.
6. **Leitor cego entende as referências?** (v3.6) Se não, aplicar R8.

**Se qualquer resposta indicar problema, NÃO entregar a reescrita — refazer.**

---

## 15. PARALELISMO ESTRUTURAL ENTRE POSTS (v3.2)

> Adicionada em 23/05/2026 a partir de revisão externa especializada sobre PT-032, PT-033, PT-034.
>
> Citação literal: *"Esses 4 exemplos possuem um mesmo padrão. Afirmação X → Consequência N. Repetição de formatos gera percepção de algo artificial."*

A queixa do filtro v3.1 era post a post. **Esta seção endereça o problema de carrossel/feed inteiro com a mesma estrutura.**

### Regra

Entre 4 conteúdos consecutivos do mesmo canal (feed, story, carrossel), **no máximo 1 pode usar a mesma estrutura sintática.**

### Estruturas que se repetem demais (e quando reprovam)

| Estrutura | Padrão | Reprovado quando |
|-----------|--------|------------------|
| **Negation pivot** | "Não é X. É Y." | Aparece em 2+ posts consecutivos |
| **Anáfora binária** | "Cliente reclama, você corre. Funcionário falta, você cobre." | Aparece em 2+ posts (mesmo que cada um esteja bom isolado) |
| **Antes/Depois** | "Antes do filho, eu X. Depois do filho, eu Y." | Aparece em 2+ posts |
| **Mais/Menos** | "Mais reunião, menos jantar." | Aparece em 2+ posts |
| **Caixa apertou / Caixa transbordou** | Oposição binária com mesma reação | Aparece em 2+ posts |
| **Time de N (X variando)** | "Time de 5 sem visão. Time de 15 sem visão. Time de 50 sem visão." | Aparece em 2+ posts |

### Como aplicar

Ao gerar peças em lote (campanha, carrossel multi-post, batch de tweets), **olhar a estrutura sintática da peça anterior** antes de gerar a próxima. Variar.

❌ **ERRADO (4 tweets seguidos com mesma estrutura — PT-032 a PT-034):**
- Post 1: `"Meu time não entrega." / "Meu time entrega tudo." → Olha pra você.`
- Post 2: `Caixa apertou. / Caixa transbordou. → Como você reage.`
- Post 3: `Time de 5 / Time de 15 / Time de 50 → ninguém entrega.`

✅ **CERTO (variar dispositivo):**
- Post 1: paralelismo binário
- Post 2: lista de evidência com números (Modelo B)
- Post 3: cena visual de comportamento (Modelo A)
- Post 4: pergunta + contraste (Modelo C)

---

## 16. CONTEXTO NO PRIMEIRO SEGUNDO (v3.2)

> Adicionada em 23/05/2026 a partir de revisão externa sobre o tweet "Não cortou por preço..."
>
> Citação literal: *"A copy não deu contexto prévio e pressupôs que a pessoa leria até o final para entender. Tem que ficar muito claro desde o primeiro momento do que se trata, senão ninguém vai ter curiosidade pra chegar até o final."*

### Regra

Quem chega no post **sem nenhum repertório anterior** precisa entender o ASSUNTO na primeira frase. Não no item 5. Não no fim.

### Teste do leitor cego

Imagine alguém que nunca viu seu perfil. Cai no post. Lê só a primeira frase. **Consegue dizer sobre o quê é o post?**
- Se sim → passa.
- Se não → reescrever a primeira frase.

### Exemplos

❌ **ERRADO (tweet "corte" — reprovado em revisão):**
```
1. Não cortou por preço.
2. Não cortou por crise.
3. Não cortou por reorganização.
4. Não cortou por moda.
5. Cortou porque viu que agência cobrava caro pra pensar mal e responder devagar.
```
Quem chega não sabe O QUE foi cortado até o item 5. E mesmo no item 5 fica vago (cortou o quê? agência inteira? funcionário? despesa?).

✅ **CERTO (PT-031 aprovado):**
```
Cliente reclama, você corre.
```
Em 4 palavras já sei que é sobre empresário reativo no dia a dia operacional.

✅ **CERTO (modelo lista-evidência aprovado):**
```
Pai de família brasileiro em 2026:
```
Em 6 palavras já sei que é sobre custo de vida da família média.

---

## 17. RITMO QUANTITATIVO (v3.2)

> Refinamento operacional do §2.3 v3.1 (que era qualitativo: *"Não use frases do mesmo tamanho em sequência"*).

### Regra (testável)

Em qualquer post com 5+ frases, **a maior frase deve ter pelo menos 3× a extensão (em palavras) da menor**. Se não tem essa variação, é texto sem cadência.

### Como contar

Frase = unidade entre pontos finais (incluindo "?" e "!"). Conte palavras (não caracteres).

### Exemplo (PT-031 aprovado, decomposto)

```
Cliente reclama, você corre.        ← 4 palavras
Funcionário falta, você cobre.      ← 4 palavras
Caixa aperta, você desconta.        ← 4 palavras
Esse papo de "empresário toma decisão" não existe se o dia inteiro foi
reagindo à urgência.                ← 19 palavras
Você não decidiu nada.              ← 4 palavras
Foi decidido.                       ← 2 palavras
```

Menor frase: 2 palavras. Maior: 19. Ratio 9,5×. **PASSA com folga.**

### Razão

Texto polido demais tem todas as frases num intervalo apertado (8-12 palavras). É o ritmo que delata IA mais rápido que vocabulário.

---

## 18. NÚMEROS REAIS > ADJETIVOS DE TAMANHO (v3.2)

> Adicionada em 23/05/2026. Aprendizado central de tweet de referência externa analisado em revisão.

### Regra

Tudo que pode virar número, vira número. Sempre.

### Substituições

| Adjetivo de tamanho (banido) | Substituir por |
|------------------------------|----------------|
| "caro" | R$ 480, R$ 4.080, R$ 30k |
| "muita gente" | 9 em cada 10, 60% dos líderes, 3 de 4 mentores |
| "muito tempo" | 15 reuniões por semana, 3 anos de mercado, 14h/dia |
| "uma grana boa" | R$ 80 mil/mês, R$ 1,2 milhão/ano |
| "muito" / "muita" (qualquer) | dado específico |
| "alta performance" | "% de conversão dobrou em 6 meses" |
| "resultados extraordinários" | "R$ X de faturamento em Y dias" |

### Exemplo (modelo lista-evidência aprovado)

```
- Almoço fora no domingo: R$ 480.
- Cinema com pipoca: R$ 220.
- Lanche do McDonald's na sexta: R$ 180.
- Sorvete no sábado: R$ 140.

Total do mês: R$ 4.080 só de lazer.

5 mil é só para o básico.
```

5 números reais. Cada item da lista é evidência, não retórica. **Lista com números distintos por linha É legítima** (diferente de anáfora retórica banida no §10).

### Cuidado (já está no §14 R3)

Calibrar números à realidade do nicho. R$ 3.000 não é "produto barato" no universo Castelo Forte — é high ticket básico. Antes de cravar número, consultar `data/nucleo.md` ou contexto do cliente ativo.

---

## 19. MODELOS CANÔNICOS APROVADOS (v3.2)

> Adicionada em 23/05/2026 a partir do material aprovado em revisão externa.
>
> Não copiar os modelos literalmente. Estudar a **anatomia** e replicar a estrutura com seu próprio conteúdo.

### Modelo A — Cena visual com paralelismo de 3 + fechamento que inverte

**Referência canônica:** PT-031 ("Cliente reclama, você corre") — APROVADO em revisão externa.

```
Cliente reclama, você corre.
Funcionário falta, você cobre.
Caixa aperta, você desconta.

Esse papo de "empresário toma decisão" não existe se o dia inteiro foi
reagindo à urgência.

Você não decidiu nada. Foi decidido.
```

**Anatomia:**
- 3 frases curtas (4 palavras) com paralelismo `Sujeito + verbo presente + você + verbo presente`
- Quebra de parágrafo + frase longa que nomeia o problema
- Fechamento de 5 palavras com **inversão** (passivo deliberado: "Foi decidido")

**Quando usar:** posts sobre comportamento, dia-a-dia operacional, decisão.

**Quantos posts seguidos podem usar este modelo:** 1. No próximo, mudar.

---

### Modelo B — Lista de evidência com números reais

**Referência canônica:** tweet externo ("Pai de família brasileiro em 2026") — usado como modelo aprovado em revisão externa.

```
Pai de família brasileiro em 2026:

- Almoço fora no domingo: R$ 480.
- Cinema com pipoca: R$ 220.
- Lanche do McDonald's na sexta: R$ 180.
- Sorvete no sábado: R$ 140.

Total do mês: R$ 4.080 só de lazer.

5 mil é só para o básico.
```

**Anatomia:**
- Setup de 1 linha que contextualiza (6 palavras)
- Lista de 4 itens, cada um com **substantivo único + número distinto**
- Total que ressignifica os itens
- Fechamento de 7 palavras que reposiciona

**Quando usar:** dados financeiros, comparações de custo, escala, evidência objetiva.

**Por que não cai no §10 (sem repetição de palavras):** porque cada linha tem substantivo único (Almoço, Cinema, Lanche, Sorvete) e número distinto (480, 220, 180, 140). Lista é evidência, não retórica.

---

### Modelo C — Pergunta + contraste binário + fechamento direto

**Referência canônica:** Castelo Forte — IA hobby vs IA ativo.

```
Aprender IA.
- Aperta botão. Repete prompt. Posta print.

Ter IA treinada em você.
- Operação roda sem você apertar nada.

Uma é hobby. Outra é ativo.

Você quer o quê?
```

**Anatomia:**
- 2 setups contrastantes (categoria A vs categoria B)
- Comportamento descrito em 3 verbos curtos por categoria
- 1 frase de categorização ("Uma é X. Outra é Y.")
- **Pergunta direta** de fechamento

**Quando usar:** posicionamento, decisão binária, contraste de categoria.

---

## 20. VALIDADORES REGEX EXECUTÁVEIS (v3.2)

> Adicionado em 23/05/2026. Inspirado no `validateProse()` do projeto Impeccable (pbakaus/impeccable, build automático).

O squad tem **DOIS validadores complementares**, cada um cobrindo uma camada do filtro.

### 20.1 — Validador de Frases & Fingerprints (existente, v3.1)

**Localização:** `squads/conteudo/scripts/validate-anti-ia.sh`

**O que faz (cobertura de §1, §2):**
- Travessão (§2.1) — fingerprint #1 de IA PT-BR
- Lista negra de frases proibidas (§1) — "a verdade que ninguém te conta", "transformar resultados", "alta performance", etc
- Frase curta empilhada na mesma linha (§2.2)
- Paralelismo simétrico "Mais/Menos X. Mais/Menos Y." (§2.8)
- Paralelismo "Se não X, não Y" (§2.8)
- Ponto-e-vírgula em texto casual (§2.4)
- Suporta extração automática de slides HTML (`--html`) ou JSON (`--json`)

**Uso:**
```bash
./squads/conteudo/scripts/validate-anti-ia.sh caminho/texto.md
./squads/conteudo/scripts/validate-anti-ia.sh slides.html --html
./squads/conteudo/scripts/validate-anti-ia.sh post.md --strict   # falha no 1º erro
```

### 20.2 — Validador Estrutural (novo, v3.2)

**Localização:** `squads/conteudo/scripts/anti-ia-structural.mjs`

**O que faz (cobertura de §3, §15, §17, §18 — gaps do v3.1):**
- **Denylist regex de verbos/adjetivos oco** — potencializ\w+, alavanc\w+, eleva, revolucion, empodera, desbloque, destrava, maximiz, otimiz, robust, escalável, inovador, disruptivo, data-driven, de ponta, de classe mundial, excepcional, extraordinário, incrível, poderoso, ademais, outrossim, em suma/síntese/resumo, concluindo, para finalizar, vamos falar sobre, deixa eu te contar, quero compartilhar, hoje em dia, no mundo de hoje, nos dias atuais, como todos sabem, se você está lendo isso
- **Detector quantitativo de negation pivot** ("Não é X. É Y." — máximo 1 por post; reprova no 2º)
- **Detector de anáfora repetitiva** (3+ linhas começando com mesma palavra) — **ignora se cada linha tem número distinto** (Modelo B passa, retórica não)
- **Detector de comprimento uniforme** de parágrafo (4+ parágrafos sem variação ≥ 2×)

**Uso:**
```bash
node squads/conteudo/scripts/anti-ia-structural.mjs caminho/texto.md
echo "Seu texto" | node squads/conteudo/scripts/anti-ia-structural.mjs
node squads/conteudo/scripts/anti-ia-structural.mjs --json caminho/texto.md
```

### 20.3 — Hook de pré-aprovação (CRM, novo v3.2)

**Localização:** `squads/conteudo/scripts/anti-ia-pre-approval.mjs`

**O que faz:** orquestra validador estrutural + monta feedback estruturado pro autor caso reprove. Plugável no fluxo do CRM antes do conteúdo entrar na fila de aprovação humana.

**Uso:**
```bash
node squads/conteudo/scripts/anti-ia-pre-approval.mjs \
  --content-id PT-035 --content-file posts/PT-035.md
```

### Ordem de aplicação (CI/CD)

```
1. validate-anti-ia.sh     → reprova frases e fingerprints PT-BR (§1, §2)
2. anti-ia-structural.mjs  → reprova estrutura (§3, §15, §17, §18)
3. content-validator LLM   → tudo o que regex não pega (§4-§14, §16, §19)
4. anti-ia-pre-approval.mjs → última checagem antes do CRM
```

### Exit codes (padrão pros 3 .mjs/.sh)

- `0` = aprovado (zero violações)
- `1` = reprovado (autor recebe lista com linha + categoria + rationale)
- `2` = erro técnico

### Limitação importante

Validadores regex pegam ~70% dos problemas. **Os 30% restantes (padrões estruturais sutis, copy intercambiável, contexto no primeiro segundo, calibragem de número por nicho, inimigo claro do §8) ainda precisam do `content-validator` LLM rodando contra este checklist completo.**

Validadores regex rodam **antes** do content-validator. Quem regex reprova, nem chega ao LLM (economia de token + feedback instantâneo).

---

## 21. SUITE DE EXEMPLOS CANÔNICOS (v3.2)

> Adicionado em 23/05/2026. Versionamento dos exemplos reais reprovados/aprovados em revisão externa, pra evitar regressão.

### Localização

```
squads/conteudo/checklists/examples/
```

### Conteúdo atual

| Arquivo | Status | Razão de status |
|---------|--------|-----------------|
| `reprovado-cr01-negation-pivot.md` | REPROVADO | 4 negation pivots seguidos (CR-01 a CR-04) |
| `reprovado-anafora-corte.md` | REPROVADO | Anáfora "Não cortou por..." 4× sem contexto inicial |
| `aprovado-pt031-cliente-reclama.md` | APROVADO | Modelo A canônico (marcado como bom em revisão) |
| `aprovado-teddy-pai-de-familia.md` | APROVADO | Modelo B canônico (referência externa de lista de evidência) |

### Como manter

Quando o operador ou qualquer revisor reprovar conteúdo novo:
1. Salvar o exemplo em `examples/reprovado-{slug}.md`
2. Identificar se é gap regex (adicionar à §1, §2 ou ao validador) ou estrutural (adicionar à §3 ou aos modelos)
3. Bump da versão do filtro (v3.3 → v3.4)
4. Re-rodar validador contra suite inteira pra garantir que aprovados ainda passam e reprovados ainda reprovam

---

## 22. PRINCÍPIOS PRESCRITIVOS POSITIVOS (v3.3)

> Adicionada em 23/05/2026 a partir do projeto Impeccable (pbakaus/impeccable — STYLE.md).
>
> As seções §1 a §21 dizem **o que NÃO fazer**. Esta seção diz **o que FAZER**. Sem isso, o filtro só limpa — não orienta.

### P1 — Abra com a crença errada do leitor, a sua afirmação mais forte, ou o exemplo

Não comece com "neste post vou falar", "hoje quero compartilhar", "deixa eu te explicar". Comece direto.

❌ `Vamos falar sobre liderança hoje.`
✅ `Líder confuso atrai gente confusa.`

### P2 — Tome uma posição com a qual alguém possa discordar

Se o parágrafo pode ser invertido sem mudar o sentido, ele não tem posição. **Teste operacional:** inverta cada parágrafo. Se o sentido sobrevive intacto, o parágrafo é neutro = é IA.

❌ `É importante ter um time alinhado.` (ninguém discorda — neutro)
✅ `Time grande sem visão clara é só salário a mais.` (alguém discorda — tem posição)

### P3 — Cite nomes. Use números. Use referências reais

Concorrentes reais, clientes reais, versões reais, paths de arquivo reais, benchmarks reais. Corte adjetivo de tamanho — escreva o número.

❌ `Muita gente fala sobre isso.`
✅ `60% dos líderes nos EUA já fizeram esse corte.`

❌ `Um framework popular.`
✅ `Notion AI — que rebatizou GPT-4 e cobra R$ 50 por mês.`

### P4 — Verbo no comando. Substantivo segue

Voz ativa. Modo imperativo aceitável. Corte nominalizações ("a implementação de" → "implementar").

❌ `A realização da venda exige a aplicação de pressão estratégica.`
✅ `Pra vender, aplica pressão.`

### P5 — Varie o tamanho da frase de propósito

Longa, longa, curta. Ritmo monotônico é o sinal de IA mais profundo. Já coberto no §17 quantitativamente (ratio 3×).

### P6 — Prosa carrega o peso. Estrutura serve.

Bullets são pra opções paralelas. Parágrafos são pra argumento. Não bullete o que cabe melhor como frase.

❌ Lista de 3 bullets cada um com uma frase de argumento → vira retórica disfarçada
✅ Parágrafo com argumento contínuo, OU lista de 4-5 itens distintos como evidência (Modelo B do §19)

### P7 — Palavra simples. Termo técnico só quando algo depende dele especificamente

Misturar registros faz o termo técnico bater mais forte. Jargão constante apaga tudo.

❌ `O ROI da operação multicanal exige throughput de leads qualificados.`
✅ `Operação multicanal só dá retorno se o custo de cada lead cabe na margem.`

### P8 — Permita fragmentos agramaticais por ritmo

Cinco palavras. Sinal de confiança. Não é erro — é assinatura humana. Já coberto no §6 e §12.

### P9 — Respeite a competência do leitor

Sem "desenvolvedores devem considerar"; só "você pode não precisar de um efeito". Sem "muita gente não percebe isso" — assume que ele percebe.

❌ `Muita gente não percebe que vendas é sobre confiança.`
✅ `Vendas é sobre confiança.`

### P10 — Leia em voz alta. Conserte qualquer coisa em que tropeçar

Teste oral antes de aprovar. Já no §14 R2.

### P11 — Concreto sobre abrangente

Cobertura é obsessão de IA. Troque cobertura por momentum. Deixe coisas de fora.

❌ Lista de 10 itens "completa".
✅ 3 itens que importam + 1 frase que admite o resto fica de fora.

### P12 — Feche entregando o próximo movimento, não resumindo

Sem "em resumo", "em conclusão". Fechamento bom:
- Termina na frase mais forte e cala
- Inverte o que foi dito ("Você não decidiu nada. Foi decidido.")
- Aponta a ação ("Você precisa decidir mais.")
- Reposiciona com número ("5 mil é só para o básico.")

---

## 23. DENYLIST PT-BR EXPANDIDA (v3.3)

> Adicionada em 23/05/2026. Categorias do Impeccable adaptadas pro PT-BR. Complementa §1 e §2.

### 23.1 — Stolen-engineer diction PT-BR

Vocabulário de engenharia/eval-team que vazou pro marketing e virou cheiro de IA quando vira frase de venda.

| Banido | Por quê | Use em vez disso |
|--------|---------|------------------|
| `alavanca`, `alavancar` (como verbo em copy) | Engenharia financeira vazando | Diga o que multiplica e por quanto |
| `leverage` (anglicismo) | Idem | "Multiplicar", "usar a favor" |
| `ponto de inflexão` | Estatística vazando | Descreva a virada com exemplo |
| `pivotal` | Idem | "Central", "decide tudo" |
| `ownership` (em PT-BR) | Internal jargon | "Quem responde por isso" |
| `deliverable` (em PT-BR) | Idem | "O que tem que entregar" |
| `stakeholder` (em copy) | Idem | "Quem decide", "quem paga" |
| `throughput` (em copy) | Eval-team | Número de leads/dia, conversões/semana |
| `bottleneck` (em copy) | Engenharia | "Onde trava", "o gargalo é" |

### 23.2 — Internal jargon vazando

Palavras que funcionam em planilha interna e morrem em copy.

| Banido | Por quê | Use em vez disso |
|--------|---------|------------------|
| `entregabilidade` | Termo de e-mail marketing | "Chega na caixa de entrada" |
| `escalabilidade` (em copy) | Termo de SaaS | "Funciona com 10, 100 ou 10 mil" |
| `aderência` (em copy) | RH/consultoria | "Quem combina com isso" |
| `fluxo` (genérico) | Termo de design vazando | Descreva o passo |
| `consumir` (conteúdo) | Termo de mídia | "Ler", "assistir", "ouvir" |
| `nicho` (em excesso) | Marketing antigo | Nomeie o nicho (mentor high ticket, dentista cosmético) |
| `experiência do usuário` (UX) em copy de venda | Termo de design | "Como o cliente sente isso" |
| `journey` (em PT-BR de copy) | UX vazando | Não tem substituto natural — corta |
| `funnel` (em PT-BR de copy) | Idem | "O caminho da venda", "o que acontece antes da compra" |

### 23.3 — Marketing voice (verbos e adjetivos com regex)

(Já parcialmente no §1, mas explicitar aqui as flexões que regex precisa pegar):

| Banido | Por quê |
|--------|---------|
| `potencializ\w+` (potencializa, potencializar, potencialização) | Verbo de palestra |
| `alavanc\w+` (alavanca, alavancar, alavancagem) | Marketing 2010 |
| `eleva\w+` (eleva, elevar — quando sentido = melhorar) | Verbo IA |
| `revolucion\w+` (revoluciona, revolucionar, revolucionário) | Hipérbole |
| `empodera\w+` (empoderar, empoderamento) | Manifesto |
| `desbloque\w+` (desbloquear, desbloqueio) | Coach |
| `destrava\w+` (destravar, destravamento) | Idem |
| `maximiz\w+` (maximizar, maximização) | Genérico |
| `otimiz\w+` (otimizar, otimização — em copy) | Genérico |
| `transform\w+` (transformar, transformação — em copy genérica) | IA |
| `robust\w+` (robusto, robustez) | Vazio |
| `escal[áa]vel` (em copy de venda) | SaaS genérico |
| `inovador\w*` | Vazio |
| `disruptiv\w+` | Vazio |
| `data.?driven`, `orientad\w+ a dados` | Cite o dado |
| `de ponta`, `de classe mundial` | Marketing 2005 |
| `excepcional`, `extraordin[áa]ri\w+` | Pede evidência |
| `incr[íi]vel` (em copy) | IA |
| `poderos\w+` (em copy) | Hollow |

### 23.4 — Conectivos metronômicos

| Banido | Substituir por |
|--------|----------------|
| `\bademais\b` | "E", "Também" |
| `\boutrossim\b` | Idem |
| `\bem suma\b`, `\bem síntese\b`, `\bem resumo\b` | Cortar (fechamento ruim) |
| `\bconcluindo\b`, `\bpara finalizar\b` | Cortar |
| `\bportanto\b`, `\blogo\b`, `\bassim sendo\b`, `\bdessa forma\b` | "Aí", "Então", reestruturar |

### 23.5 — Throat-clearing (aberturas que enrolam)

| Banido | Por quê |
|--------|---------|
| `\bvamos? falar sobre\b` | Não fala, faz |
| `\bdeixa eu te (contar\|explicar\|mostrar)\b` | Permissão desnecessária |
| `\bquero compartilhar\b` | Idem |
| `\bhoje em dia\b`, `\bno mundo de hoje\b`, `\bnos dias atuais\b` | Genérico |
| `\bcomo todos sabem\b` | Mentira retórica |
| `\bse você está lendo isso\b` | Manjado |

### 23.6 — Vocabulário pomposo IA-tell PT-BR (v3.7)

> Adicionada em 2026-05-24 a partir de pesquisa `docs/research/2026-05-24-projetos-escrita-anti-ia/`. Equivalente PT-BR dos fingerprints catalogados por Wikipedia "Signs of AI writing" e Bloomberry AI Writing Patterns Database (7.400 entradas). Lista densa de palavras que Claude/ChatGPT/Gemini usam quando escrevem PT-BR e raramente saem da boca de um brasileiro real.

| Banido | Substituir por |
|--------|----------------|
| `\bmergulhar\s+(fundo\|profundamente)\s+em\b`, `\bmergulho\s+profundo\b` | "Pegar", "ver de perto", "olhar" |
| `\bnavegar\s+(nos\|pelos)\s+meandros\s+de\b`, `\bnos\s+meandros\s+de\b` | "Ver como funciona X" |
| `\bno\s+cerne\s+(da\|de)\b` | "No meio de", "no centro de" |
| `\bno\s+(âmbito\|escopo)\s+(da\|de)\b` (em copy) | "Em", "dentro de" |
| `\bexplorar\s+as\s+nuances\b` | "Ver os detalhes", "olhar fino" |
| `\bressaltar\b`, `\bsublinhar\b`, `\bevidenciar\b` (em copy) | "Mostrar", "dizer", "apontar" |
| `\bfomentar\b` (em copy) | "Impulsionar", "fazer crescer" |
| `\btapeçaria\b`, `\bmosaico\b` (sentido metafórico) | "Mistura de", "conjunto de" |
| `\b(o\|um)\s+panorama\b`, `\b(a\|uma)\s+paisagem\b` (metafórico) | "O cenário", "a situação" |
| `\bmarcante\b`, `\bmemorável\b` (em copy) | Dado específico |
| `\bvibrante\b`, `\bvigoroso\b` | Substituir por descrição concreta |
| `\babrangente\b` (em copy de venda) | "Completo", "que cobre tudo" |
| `\bholístic\w+` | "Inteiro", "que olha tudo junto" |
| `\bmultifacetad\w+` | "De várias frentes", "com vários lados" |
| `\bnotáve\w+` (em copy) | Mostrar o número/exemplo |
| `\bpivotal\b` (em PT-BR de copy) | "Central", "decide tudo" |
| `\bfundamental\b` (como puffery, sem evidência) | Cortar ou substituir por dado |
| `\bcrucial\b` (em excesso) | Cortar; se importa de verdade, mostre por quê |

### 23.7 — Hooks IA-tell PT-BR (v3.7)

> Lista catalogada pela Bloomberry (Hook patterns 17, classificação "Very High"). Aberturas que Claude/ChatGPT abrem post 80% do tempo. Banir em PRIMEIRA frase de qualquer post/copy.

| Banido | Por quê |
|--------|---------|
| `\ba\s+(verdade\|realidade)\s+é\s+(que\|essa)\b` | "Reveal setup" Bloomberry — fingerprint #1 |
| `\baqui\s+está\s+(a\s+verdade\|o\s+ponto\|a\s+questão\|o\s+segredo)\b` | Idem |
| `\bvamos\s+ser\s+honest\w+\b` | "Candor opener" Bloomberry |
| `\bem\s+um\s+(mundo\|cenário)\s+(onde\|em\s+que)\b` | "World-state hook" Bloomberry |
| `\bem\s+um\s+momento\s+(em\s+que\|onde)\b` | Variante de world-state |
| `\bvocê\s+já\s+(parou\s+pra\|se\s+pegou)\s+pens\w+\b` | Já em §1, reforço aqui |
| `\bvocê\s+já\s+notou\s+que\b` | "Curiosity opener" Bloomberry |
| `\bdeixa\s+(eu\s+)?te\s+conta\w+\s+(uma\|um)\b` | Variante throat-clearing |

### 23.8 — Transição e filler PT-BR (v3.7)

> Bloomberry catalogou 625 entradas de transition/filler global. Estas são as equivalentes PT-BR que Claude/ChatGPT usam de muleta. Diferente do §23.4 (conectivos formais) — aqui é o filler casual que parece humano mas é fingerprint.

| Banido | Substituir por |
|--------|----------------|
| `\bem\s+outras\s+palavras\b` | Cortar (se explicou bem, não precisa repetir) |
| `\bvale\s+(a\s+pena\s+)?(notar\|mencionar\|destacar\|ressaltar)\b` | Cortar; se vale, fala direto |
| `\bdito\s+isso\b` | "Mas", "porém", ou cortar |
| `\ba\s+propósito\b` | Cortar (introduzir tema direto) |
| `\bnesse\s+sentido\b` | "Aí", "então" |
| `\bem\s+última\s+análise\b` | Cortar |
| `\bdesta\s+forma\b`, `\bdesta\s+maneira\b` | "Aí", "então", ou cortar |
| `\bpor\s+sinal\b`, `\binclusive\b` (no início de frase) | Já em §1 (muletas), reforço |
| `\bem\s+suma\b` | Já em §23.4, reforço aqui em filler |

### 23.9 — Rhetorical Contrast Cadence (v3.7)

> Bloomberry classificou como "AI Cadence #1 — Very High frequency em todos os modelos". Padrão: **Frase negativa curta + conectivo de virada (mas/porém/no entanto) + reframe positivo**. Diferente do §15 (negation pivot estrutural "Não é X. É Y.") — aqui é a cadência completa frase a frase.

**Padrão proibido:**

```
[Afirmação negativa]. Mas [afirmação positiva].
[Não funciona X]. No entanto, [funciona Y].
[Empresário fracassa em X]. Porém, [empresário vence em Y].
```

**Regra:** se 2+ frases consecutivas seguem o padrão `[negativo] + [conectivo de virada] + [positivo]`, **reprovado**. Use no máximo 1 vez em todo o texto.

**Detector regex (a ser adicionado a `anti-ia-structural.mjs`):**

```js
/[A-ZÀ-Ú][^.!?]*(não|nunca|sem)[^.!?]*\.\s+(Mas|Porém|No entanto|Contudo|Todavia|Entretanto)\b/g
```

Se aparecer mais de 1 ocorrência → REPROVADO.

### 23.10 — AI Sentence DNA quadripartite (v3.7)

> Bloomberry: "AI converge em estrutura de 4 partes: Opening (framing) → Expansion (evidência) → Contrast (reframe) → Resolution (takeaway)". Padrão #1 que o crítico LLM deve buscar em parágrafo de copy.

**Padrão proibido (parágrafo único cobrindo as 4 partes):**

```
[Opening: frame temporal/genérico]. [Expansion: 2-3 frases de evidência polida]. [Contrast com "mas/porém"]. [Resolution: moral/takeaway].
```

Quando um parágrafo isolado segue essa cadência completa em 4 movimentos, é assinatura de IA.

**Regra de quebra:**
- Comece direto no Contrast OU na Resolution
- Corte o Opening genérico (frame temporal, "hoje", "atualmente")
- Resolution não vira moral — vira ação ou cala

❌ "Hoje o mercado de mentoria está saturado. Muitos profissionais cobram R$3.000 e vendem volume. Mas quem cobra R$30.000 não compete em volume. No final do dia, é sobre posicionamento."

✅ "Quem cobra R$30 mil não compete em volume. Compete em escassez."

---

## 24. UX WRITING UNIVERSAL (v3.3)

> Adicionada em 23/05/2026. Adaptada de `clarify.md` + `ux-writing.md` do Impeccable.
>
> Vale para QUALQUER texto que pede ação do leitor: botões, CTAs, mensagens de erro, telas vazias, confirmações, formulários, headlines com call-to-action implícito.

### 24.1 — Botões e CTAs

**Nunca usar:** "OK", "Enviar", "Sim/Não", "Clique aqui", "Saiba mais", "Continuar"

**Sempre usar:** verbo + objeto específico

| Ruim | Bom | Por quê |
|------|-----|---------|
| OK | Salvar alterações | Diz o que vai acontecer |
| Enviar | Criar conta | Foco no resultado |
| Sim | Excluir mensagem | Confirma a ação |
| Cancelar | Continuar editando | Esclarece o que "cancelar" significa |
| Clique aqui | Baixar PDF | Descreve o destino |
| Saiba mais | Ver detalhes da mentoria | Específico |

**Pra ações destrutivas:** nomeie a destruição.
- `Excluir` (não `Remover` — "excluir" é permanente, "remover" sugere recuperável)
- `Excluir 5 itens` (não `Excluir selecionados` — mostre o número)

### 24.2 — Mensagens de erro (fórmula)

Toda mensagem de erro responde 3 perguntas:
1. **O que aconteceu?**
2. **Por quê?**
3. **Como corrigir?**

❌ `Entrada inválida.`
✅ `O e-mail precisa ter um @. Tente: nome@exemplo.com`

❌ `Erro 403: Forbidden`
✅ `Você não tem permissão para ver essa página. Fale com o admin pra liberar.`

### 24.3 — Não culpe o leitor

❌ `Você digitou uma data inválida.`
✅ `Digite a data no formato DD/MM/AAAA.`

### 24.4 — Estados vazios

Estado vazio = momento de onboarding. (1) reconheça (2) explique o valor de preencher (3) dê ação clara.

❌ `Nenhum item.`
✅ `Sem campanhas ainda. Crie a primeira pra começar a rodar.`

### 24.5 — Voz vs Tom

**Voz** = personalidade da marca, constante em tudo.
**Tom** = adapta ao momento.

| Momento | Tom |
|---------|-----|
| Sucesso | Curto e celebratório: "Pronto! Já tá no ar." |
| Erro | Empático e útil: "Isso não rolou. Tenta isso..." |
| Carregando | Tranquilizador: "Salvando..." |
| Confirmação destrutiva | Sério e claro: "Excluir esse projeto? Não dá pra desfazer." |

**Nunca use humor em mensagem de erro.** O usuário já está frustrado.

### 24.6 — Estados de carregamento

❌ `Carregando...` (por 30+ segundos sem contexto)
✅ `Analisando seus dados... costuma levar 30-60 segundos`

**Princípios:**
- Setar expectativa de tempo
- Explicar o que tá acontecendo
- Mostrar progresso quando der
- Oferecer "Cancelar" se aplicável

### 24.7 — Diálogos de confirmação

**Use raramente.** A maioria é falha de design — considere "Desfazer" em vez disso. Quando precisar confirmar:
- Nomeie a ação específica
- Explique a consequência
- Use labels claros nos botões (`Excluir projeto` / `Manter projeto`, não `Sim` / `Não`)

❌ `Tem certeza?`
✅ `Excluir 'Projeto Alpha'? Não dá pra desfazer.`

### 24.8 — Consistência terminológica

Escolha um termo e mantenha:

| Inconsistente | Consistente |
|---------------|-------------|
| Excluir / Remover / Apagar | Excluir |
| Configurações / Preferências / Opções | Configurações |
| Entrar / Logar / Acessar | Entrar |
| Criar / Adicionar / Novo | Criar |

### 24.9 — 6 regras universais de UX writing

Aplica a qualquer texto que pede ação:

1. **Seja específico:** "Digite o e-mail" não "Digite o valor"
2. **Seja conciso:** corte palavras desnecessárias (sem sacrificar clareza)
3. **Seja ativo:** "Salvar alterações" não "As alterações serão salvas"
4. **Seja humano:** "Algo deu errado" não "Erro de sistema encontrado"
5. **Diga o que fazer**, não só o que aconteceu
6. **Seja consistente:** mesmo termo em todo lugar

---

## 25. 5 DIMENSÕES PONDERADAS DO CRÍTICO LLM (v3.3)

> Adicionada em 23/05/2026. Adaptada do CRITIC_PROMPT do squad course-creator V2 (Constitutional AI pattern).
>
> Substitui o sistema antigo de "score 0-100 vago" por avaliação dimensional ponderada. Quando o validador regex passa o texto pra LLM, a LLM avalia em **5 dimensões com pesos diferentes**.

### Dimensões (peso entre parênteses)

#### Dimensão 1 — NATURALIDADE HUMANA (25%)

O texto cabe na boca de alguém? Tem artigos, adjetivos, "tempero" (§5 da revisão externa)?

- score 10: lê em voz alta sem tropeçar; tem expressões coloquiais; verbos no presente ativo
- score 5: estrutura humana mas vocabulário polido demais
- score 0: telegrama de IA — sem artigos, sem adjetivos, sem coloquial

#### Dimensão 2 — FECHAMENTO NÃO-GENÉRICO (25%)

Como o texto termina? Sem "em resumo", sem moral, fecha forte ou para?

- score 10: fecha invertendo, apontando ação, ou parando na frase forte
- score 5: fechamento aceitável mas sem garra
- score 0: "em resumo / no final do dia / isso muda tudo / pense nisso"

#### Dimensão 3 — TOM APROPRIADO (20%)

Tem opinião? Tem inimigo claro? Não vende em todo parágrafo?

- score 10: posição clara, inimigo nomeado, sem hedge stack
- score 5: tem opinião mas dilui em ressalvas
- score 0: neutro / "tentando agradar todo mundo" / linguagem polida demais

#### Dimensão 4 — ESTRUTURA ANTI-IA (15%)

Sem negation pivot recorrente, sem paralelismo simétrico cruzado entre posts, sem tríade forçada?

- score 10: estrutura diferente dos últimos 3 posts, sem dispositivos repetidos
- score 5: 1 dispositivo IA-tell aceitável
- score 0: 2+ dispositivos (negation pivot 2×, ou anáfora longa, ou paralelismo simétrico óbvio)

#### Dimensão 5 — RITMO E DENSIDADE (15%)

Varia tamanho de frase? Maior frase ≥ 3× a menor? Não tem comprimento uniforme?

- score 10: ratio ≥ 3×, alternância de curtas e longas, fragmento OK
- score 5: ratio entre 2× e 3×
- score 0: tudo no mesmo tamanho (12-18 palavras por frase) — fingerprint de IA

### Cálculo do overall_score

```
overall_score = (D1 × 25) + (D2 × 25) + (D3 × 20) + (D4 × 15) + (D5 × 15)
                ─────────────────────────────────────────────────────
                                       100
```

(Convertendo cada dimensão 0-10 para 0-100 e ponderando)

### Verdict (atualizado em v3.6 — Regra 1 do operador: nota 10 ou refaz)

- **PASS:** overall_score = 100 (todas as 5 dimensões com score 10)
- **REPROVADO:** overall_score < 100

> **REGRA OPERACIONAL DO OPERADOR (v3.6):** *"A gente só faz texto nota 10. Se não ficou nota 10, reprove. Eu não quero nada na minha boca."*
>
> Verdict "REVIEW" foi REMOVIDO em v3.6. Texto que não está nota 10 não passa. Refine loop até bater 100 ou esgotar `max_iterations` (e mesmo após esgotar, retorna como REPROVADO — não publica).
>
> Implicação: cada dimensão tem que estar com **score 10/10**. Se alguma estiver 8 ou 9, é REPROVADO. Sem média ponderada salvando texto fraco em uma dimensão.

### Output esperado do crítico (YAML estruturado — atualizado v3.6)

```yaml
overall_score: 0-100
overall_verdict: PASS | REPROVADO

dimensions:
  naturalidade_humana:
    score: 0-10
    findings:
      - "Citação literal do texto / problema específico"
    fixes:
      - "Substituição concreta com antes/depois"

  fechamento_nao_generico:
    score: 0-10
    findings: []
    fixes: []

  tom_apropriado:
    score: 0-10
    findings: []
    fixes: []

  estrutura_anti_ia:
    score: 0-10
    findings: []
    fixes: []

  ritmo_densidade:
    score: 0-10
    findings: []
    fixes: []

priority_fixes:
  - "1. Fix específico concreto"
  - "2. Fix específico concreto"
  - "3. Fix específico concreto"

stop_recommendation: STOP | REFINE
stop_reason: "Explicação curta"
```

---

## 26. PRINCÍPIOS DE REESCRITA UNIVERSAIS (v3.3)

> Adicionada em 23/05/2026. Adaptada do REFINE_PROMPT do squad course-creator V2.
>
> Quando o crítico LLM identifica problemas e o texto vai pra reescrita, **seguir estes 6 princípios.** Sem isso, refine vira destruição.
>
> Complementa o §14 (Regras de Reescrita R1-R7).

### Princípio 1 — MANTENHA o que estava bom

Estrutura geral, conceitos, exemplos que funcionam, números reais, frases com voz autoral — **não mude.** Refine é polimento, não reconstrução.

### Princípio 2 — APLIQUE os fixes LITERALMENTE

Se o crítico disse "trocar 'permite que você acesse' por 'te dá acesso a'", troque exatamente isso. Não invente alternativa "melhor". A alternativa do crítico já foi pensada considerando o resto do texto.

### Princípio 3 — PRESERVE o fechamento se já estava certo

Se o fechamento original tava bom, **mantém igual**. Se estava errado (genérico, moral, "em resumo"), corrige aplicando exatamente o padrão indicado pelo crítico (§12 do filtro).

### Princípio 4 — REPRODUZA marcadores de voz ausentes (se houver voice profile)

Se o crítico identificou que faltava marcador de voz do expert (provocação curta, fechamento canônico específico) em X momentos do texto, **adicione exatamente nesses momentos**. Não distribua aleatoriamente.

(Este princípio ativa só quando houver voice profile carregado — moldagem como expert é etapa SEPARADA do filtro anti-IA. Sem voice profile, esse princípio fica neutro.)

### Princípio 5 — CORRIJA frases corporativas substituindo literalmente

Substituições literais conforme o crítico apontou. Não use sinônimo "mais bonito" — use exatamente o que o crítico sugeriu.

### Princípio 6 — Não adicione conteúdo novo gratuito

Esta é uma operação de **POLIMENTO**, não expansão. Se você inventou um exemplo novo ou adicionou um argumento que não tinha, **remova**. Pelas duas razões:
1. Adicionar conteúdo na reescrita destrói o teste de regressão (não dá pra saber se melhorou o texto original ou se o conteúdo novo escondeu o defeito)
2. Texto original existe por uma razão — respeite a tese

### Quando refine é proibido

(do §14 R1-R7 já existente)

1. Se a frase original não tinha problema real, **não reescreva** (R1)
2. Se a alternativa proposta soa pior quando lida em voz alta, **mantém original** (R2)
3. Se o crítico adicionou número que não bate com a realidade do nicho, **rejeite o número** (R3)
4. Se a reescrita cortou a ideia no meio pra parecer profunda, **completar** (R7)

---

## 27. AUDIT TRAIL (v3.3)

> Adicionada em 23/05/2026. Adaptada do `utmos-audit.yaml` do squad course-creator V2.
>
> Toda validação do filtro anti-IA grava trilha de auditoria. Sem isso, o filtro não evolui com dados — só com feedback humano pontual.

### Localização

```
squads/conteudo/audit-log.yaml
```

(arquivo único acumulativo — JSONL-like estrutura YAML)

### Schema

Cada entrada é uma validação completa:

```yaml
- timestamp: "2026-05-23T14:32:15-03:00"
  content_id: "PT-035"
  content_path: "outputs/posts/PT-035.md"
  content_chars: 412
  content_words: 67

  layer_0_regex:
    validator: "anti-ia-structural.mjs"
    status: APPROVED | REJECTED
    violation_count: 0
    violations: []  # detalhes só se REJECTED

  layer_0_phrases:
    validator: "validate-anti-ia.sh"
    status: APPROVED | REJECTED
    violation_count: 0

  layer_1_llm:
    model: "claude-sonnet-4-6"
    overall_score: 87
    overall_verdict: PASS
    dimensions:
      naturalidade_humana: 9
      fechamento_nao_generico: 10
      tom_apropriado: 8
      estrutura_anti_ia: 9
      ritmo_densidade: 8
    priority_fixes_count: 1
    refine_iterations: 0

  final_decision: APPROVED | REJECTED | REVIEW
  final_score: 87
  stop_reason: "threshold_passed"

  operator_feedback:  # preenchido quando humano reprova/aprova depois
    timestamp: "2026-05-23T16:05:00-03:00"
    reviewer: "{reviewer_id}"
    verdict: APPROVED | REJECTED
    reason: "Ficou genérico no meio"
```

### Como usar

**Mensal:** rodar análise sobre o log:

```bash
# % de aprovação por dimensão
yq '.[] | select(.layer_1_llm.overall_verdict == "PASS") | .layer_1_llm.dimensions' audit-log.yaml
```

**Para identificar falsos positivos:**
Procurar entradas onde `final_decision: APPROVED` MAS `operator_feedback.verdict: REJECTED`. Esses são os casos onde o filtro APROVOU mas o humano REPROVOU — sinal de gap no filtro.

**Para identificar falsos negativos:**
Procurar entradas onde `final_decision: REJECTED` MAS `operator_feedback.verdict: APPROVED`. Filtro está reprovando coisa boa — sinal de regra agressiva demais.

### Calibragem por nicho (futuro)

Após 30 dias de log:
- Se uma dimensão consistentemente recebe baixo score mesmo em textos aprovados pelo humano → afrouxar peso ou regra
- Se uma dimensão consistentemente passa mas textos são reprovados pelo humano → apertar regra ou criar sub-dimensão

### Privacidade

O audit-log pode conter copy de clientes. **Não commitar pro git.** Adicionar `audit-log.yaml` ao `.gitignore` do squad.

---

## 28. REGRA DO HOOK — DEPRECADA EM v3.5 (24/05/2026)

> **Esta seção foi DEPRECADA.** A regra mecânica "hook = 1 ponto final" gerava falso positivo em hooks humanos legítimos.
>
> **Exemplo do falso positivo:** "Em 15 minutos fiz o que 4 pessoas de agência fariam em 30 dias. Carmem não acreditou." — 2 pontos finais, MAS é hook humano que pinta cena viva (Carmem, tempo concreto, reação). Reprovado pela regra mecânica, aprovado pelo operador.
>
> **Aprendizado:** o que delata IA em hook não é número de pontos. É a **falta de cena viva, falta de emoção, falta de conversa real**. Isso é avaliação semântica — regex não pega.
>
> **Substituída por:** §29 (dimensão "Cena viva" no crítico LLM).
>
> **No detector:** `detectHookViolation()` agora retorna sempre `[]`. Mantido por compatibilidade.

---

## 29. DIMENSÃO "CENA VIVA" NO CRÍTICO LLM (v3.5)

> Adicionada em 24/05/2026 substituindo a regra mecânica do §28.
>
> A diferença entre hook humano e hook IA **não está em regra de pontuação**. Está em 3 coisas: a pessoa vê uma cena? tem emoção/reação humana? ou é teoria abstrata?
>
> Esta seção **redefine a Dimensão 1 do §25** (que era "Naturalidade humana 25%") com critério operacional mais preciso: **Cena viva 25%**.

### Critério de avaliação

Para qualquer texto (especialmente hook de carrossel e abertura de tweet/post), perguntar:

**1. Pinta cena?**
A pessoa que lê consegue **desenhar mentalmente** o que tá sendo dito? Tem pessoa real, tempo real, lugar real, ação concreta?
- ✅ "Cliente reclama, você corre" — vê o cliente, vê você correndo.
- ✅ "Em 15 minutos fiz o que a agência faria em 30 dias. Carmem não acreditou" — vê o tempo, vê a Carmem, vê a reação.
- ❌ "Liderança verdadeira atrai talentos alinhados" — abstrato, não dá pra desenhar.
- ❌ "Estratégias de alta performance transformam resultados" — teoria pura.

**2. Tem emoção/reação humana?**
Aparece alguém sentindo, reagindo, falando, agindo? Ou é frase informativa seca?
- ✅ "Carmem não acreditou" — reação humana visível.
- ✅ "Sua agência ainda manda boleto" — confronto vivo com o leitor.
- ❌ "O método demonstrou eficácia comprovada" — zero emoção.
- ❌ "Resultados são alcançados por quem age" — frase de manual.

**3. É conversa viva ou monólogo de manual?**
Cabe na boca de alguém te falando, ou parece texto de slide corporativo?
- ✅ "Você não decidiu nada. Foi decidido" — alguém te dizendo isso na cara.
- ✅ "Os próximos R$50k não estão em mais clientes. Estão no preço que você não cobra" — direto, conversado.
- ❌ "É fundamental considerar a implementação de estratégias robustas" — manual corporativo.
- ❌ "A maturidade empresarial requer uma abordagem holística" — palestra de coach.

**4. Leitor cego entende todas as referências?** (adicionada em v3.6 — Regra 2 do operador)
O leitor que chega no post pela primeira vez, sem te conhecer, sem ter lido outros posts seus — entende tudo que tá escrito? Ou tem conceito proprietário/metáfora própria que só faz sentido pra quem já te segue?
- ✅ "Empresário que pede permissão tem chefe disfarçado dentro da própria empresa" — qualquer um entende: empresário, chefe, permissão.
- ✅ "Cliente reclama, você corre" — vocabulário universal.
- ✅ "Em 15 minutos fiz o que 4 pessoas de agência fariam em 30 dias. Carmem não acreditou" — Carmem é nome próprio mas o contexto explica (cliente do narrador).
- ❌ "Modelo Ferrari vs modelo Toyota" — metáfora proprietária do operador, ninguém mais usa. Quem chega não entende.
- ❌ "Empresário que tá no modo HTB ainda" — sigla interna, ninguém entende.
- ❌ "Vira um Pedro Valério da operação" — referência pessoal sem contexto.

Detalhe completo em §30 (Auto-suficiência semântica).

### Scoring da dimensão (atualizado v3.6)

| Score | Critério |
|-------|----------|
| 10 | Pinta cena clara + tem reação humana + soa como conversa viva + leitor cego entende tudo |
| 7-9 | Tem 3 das 4 qualidades — texto vivo mas com algum trecho ambíguo, ou 1 referência proprietária sem contexto |
| 4-6 | Tem 2 das 4 — informativo mas sem cena/emoção/contexto |
| 0-3 | Tem 1 ou nenhuma — texto teórico, abstrato, ou cheio de referência interna |

### Peso (atualiza §25)

A Dimensão 1 do §25 muda de "Naturalidade humana" para **"Cena viva"**. Peso continua 25%.

### Por que regex não pega

- "Pinta cena" exige entender substantivos abstratos (liderança, sinergia, alinhamento) vs concretos (Carmem, 15 minutos, agência).
- "Reação humana" exige detectar verbo de afeto/ação vs verbo informativo.
- "Conversa viva" exige reconhecer ritmo de fala vs ritmo de manual.

Tudo isso é semântico. Só LLM faz com confiabilidade.

### Casos calibrados (suite de regressão)

| Texto | Cena? | Emoção? | Conversa? | Score |
|-------|-------|---------|-----------|-------|
| "Em 15 minutos fiz o que 4 pessoas de agência fariam em 30 dias. Carmem não acreditou." | ✅ | ✅ | ✅ | 10 |
| "Cliente reclama, você corre." | ✅ | ✅ | ✅ | 10 |
| "Maior grupo de publicidade do mundo demitiu 4.000 por IA. Sua agência ainda manda boleto." | ✅ | ✅ | ✅ | 10 |
| "Não é IA. É TIME treinado em você." | ❌ | ❌ | ❌ | 2 |
| "Quem pede permissão pra decidir não é dono. É funcionário com CNPJ." | ❌ | ❌ | ⚠️ | 4 |

**Os 2 hooks de baixo score são exatamente os que a revisão externa reprovou.** A dimensão tá calibrada com casos reais.

---

## 30. AUTO-SUFICIÊNCIA SEMÂNTICA (v3.6)

> Adicionada em 24/05/2026 a partir da Regra 2 do operador.
>
> **Citação literal do operador:** *"Todos os textos que a gente for fazer, a pessoa que lê vai ter que entender o texto. Vários dos textos que você tá falando aqui, a pessoa não tem contexto e não faz sentido. Por exemplo, o filtro Ferrari: ninguém conhece, só eu, que criei essa bagaça e eu não popularizei isso. Então, se a gente for falar modelo de negócio Toyota versus modelo de negócio Ferrari, ninguém vai entender, porque nunca dei contexto para eles."*

### Princípio

**Todo texto que sai pro ar tem que se explicar sozinho.** O leitor que chega no post pela primeira vez, sem te conhecer, sem ter lido nenhum outro post seu, sem conhecer suas metáforas — precisa entender 100% do que tá escrito.

Vale pra **todo formato**: carrossel, print-tweet, reels, story, e-mail, headline. Sem exceção.

### Teste do leitor cego

Antes de aprovar, perguntar:
1. **Se eu mostrasse esse texto pra alguém que nunca te ouviu falar — ela entende a referência principal?**
2. **Tem algum conceito que só faz sentido pra quem já te segue há meses?**
3. **Tem nome próprio ou termo proprietário sem explicação?**

Se a resposta for "não entende" pra qualquer pergunta → **REPROVADO. Reescreve.**

### Tipos de referência e como tratar cada

| Tipo de referência | Exemplo | Tratamento |
|--------------------|---------|------------|
| **Conceito proprietário não popularizado** | "Modelo Ferrari vs Toyota", "Filtro Anti-IA do operador", "Estratégia HTB", "Operação Imperial" | REPROVADO. Reescrever com vocabulário universal OU substituir por referência que o mercado conhece. |
| **Sigla interna do operador** | "HTB", "ICP-Premium", "Sistema 21D" | REPROVADO. Soletra ou substitui. |
| **Nome próprio sem contexto** | "Vira um Pedro Valério da operação", "Como o Alan ensina" | REPROVADO se não há contexto. APROVADO se o post explica quem é. |
| **Nome próprio público verificável** | "Sam Altman fala isso", "Omnicom e IPG fundiram", "Boeing demitiu 1 ano, Nokia 3 dias" | APROVADO — qualquer leitor checa no Google. |
| **Caso real com cliente nomeado** | "Carmem tem clínica, fatura sério..." | APROVADO se o próprio texto apresenta a Carmem (idade, ramo, contexto). |
| **Vocabulário de mercado universal** | "Funil", "lead", "ICP", "carrossel", "engajamento" | APROVADO — vocabulário que qualquer pessoa de marketing conhece. |
| **Vocabulário técnico de nicho sem explicação** | "Pixel Conversions API", "CPM crescente vs CPA decrescente", "ROAS micro" | REPROVADO em copy pra público amplo. APROVADO se o público-alvo é técnico (a copy precisa declarar pra quem é). |
| **Jargão corporativo** | "Sinergia", "alavancar resultados", "ownership" | Já reprovado no §23. |

### Decisão operacional: 3 opções quando há referência proprietária

Se o texto precisa MESMO da referência (porque é central pro argumento):

**Opção A — Substituir por referência universal**
- ❌ "Modelo Ferrari não tem estoque. Tem fila. Modelo Toyota tem estoque. Tem promoção."
- ✅ "Marca de luxo não tem estoque. Tem fila. Marca de massa tem estoque. Tem promoção."

**Opção B — Explicar o conceito dentro do post**
- ❌ "Você tá rodando uma operação Imperial?" (leitor não sabe o que é)
- ✅ "Operação Imperial é a estrutura que blinda decisão do dono — onde nenhum funcionário pede aprovação pra agir dentro do escopo dele. Você tá rodando uma assim?"

**Opção C — Reformular evitando a referência**
- ❌ "Cliente HTB exige cadência diferente."
- ✅ "Cliente que paga R$ 30k+ exige cadência de venda diferente do cliente que paga R$ 1k."

### Exemplos calibrados (suite de regressão)

| Texto | Auto-suficiente? | Por quê |
|-------|------------------|---------|
| "Cliente reclama, você corre. Funcionário falta, você cobre. Caixa aperta, você desconta." | ✅ SIM | Vocabulário universal. Qualquer empresário entende. |
| "Em 15 minutos fiz o que 4 pessoas de agência fariam em 30 dias. Carmem não acreditou." | ✅ SIM | Carmem aparece como personagem, o resto do texto apresenta o contexto dela. |
| "Maior grupo de publicidade do mundo demitiu 4.000 por IA. Sua agência ainda manda boleto." | ✅ SIM | Dado público verificável + vocabulário universal (agência, boleto). |
| "Modelo Ferrari não tem estoque. Tem fila. Modelo Toyota tem estoque. Tem promoção." | ❌ NÃO | "Modelo Ferrari" e "Modelo Toyota" como categorias de negócio são conceito proprietário do operador. Leitor pensa em carro, não em estratégia. |
| "Não é IA. É TIME treinado em você." | ❌ NÃO | "TIME treinado em você" é jargão interno do operador. Quem chega não entende que TIME = agentes de IA personalizados. |
| "Empresário que pede permissão tem chefe disfarçado dentro da própria empresa." | ✅ SIM | Conceito ("chefe disfarçado") é metáfora autoexplicativa. |

### Relação com §16 (Contexto no primeiro segundo)

§16 e §30 são complementares:
- **§16** = entender o ASSUNTO na primeira frase
- **§30** = entender as REFERÊNCIAS ao longo do post inteiro

Texto pode passar no §16 (assunto claro de cara) e reprovar no §30 (usa metáfora proprietária no slide 3). Os dois precisam passar.

### Aplicação no fluxo

1. **Camada 1 (durante escrita):** ao escrever, perguntar "leitor cego entende?" pra cada conceito.
2. **Camada 2 (validador regex):** não pega (avaliação semântica).
3. **Camada 3 (crítico LLM):** Dimensão 1 (§29) pergunta 4 cobre isso. Se reprovou → REPROVADO total (Regra 1: nota 10 ou refaz).

---

## 13. LEMBRETE FINAL DE EXECUÇÃO

- Aplique DURANTE a escrita E na revisão final.
- Não pule o checkpoint da seção 9.
- Na dúvida entre soar polido ou soar real → escolha real.
- Texto bom é o que cabe na boca/mão de alguém de verdade.
- Filtro Anti-IA ELIMINA o que não pode aparecer. Tom de Voz MOLDA o que tem que aparecer. Use os dois.
