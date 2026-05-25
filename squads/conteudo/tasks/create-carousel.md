# Criar Carrossel para Instagram

name: create-carousel
executor: carousel-creator
description: Criar carrossel completo (1-10 slides) seguindo o sistema de 7 tipos de post + 9 frameworks de copy, com validacao pelo oraculo e score minimo 80%
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Tipos de post e frameworks de copy disponiveis em data/
  - Oraculo de posts disponivel para validacao (data/oraculo-posts.md)

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

- **Tema:** sobre o que e o carrossel (obrigatorio)
- **Publico:** quem vai ler — avatar com especificidade (obrigatorio)
- **Intencao:** Atracao / Consciencia / Aquecimento / Venda (obrigatorio)
- **Tipo de post:** Imperial / Polemico / Crenca / Problema / Curiosidade / Historia / Oferta (opcional — recomendado pela intencao)
- **Framework de copy:** 1 dos 9 frameworks (opcional — recomendado pela matriz tipo x framework)
- **Tamanho:** 1, 3, 5, 7 ou 10 slides (opcional — default: 10)
- **Crenca a quebrar:** qual crenca limitante atacar (opcional)
- **Objecao principal:** qual resistencia derrubar (opcional)

## STEPS

### Etapa 0: CONSULTA OBRIGATORIA (BLOQUEANTE — NAO PULAR)

**ANTES de qualquer outra acao, ler INTEGRALMENTE os arquivos abaixo usando a tool Read.
Nao gerar nenhum hook, slide ou CTA sem ter feito esta consulta.**

Arquivos a ler (na ordem):
1. `data/hooks-bank.md` — banco completo de hooks com IDs (HB2-CAR-NNN, HB2-CAR-NNN, HB2-CAR-NNN)
2. `data/aberturas-poderosas.md` — 5 tipos de abertura
3. `data/cliches-proibidos.md` — palavras/frases banidas
4. `data/regras-inviolaveis.md` — leis gerais de conteudo
5. `checklists/hook-quality.md` — 15 itens de validacao de hook

**Output do Step 0 (OBRIGATORIO antes de prosseguir):** O agente DEVE iniciar a resposta com o bloco `FONTES_CONSULTADAS` no formato:

```
FONTES_CONSULTADAS:
- hooks-bank.md: [N] hooks-base mapeados pro tema (citar IDs candidatos, ex: HB2-CAR-005, HB2-CAR-014, HB2-CAR-018)
- aberturas-poderosas.md: tipo de abertura escolhido = [Curiosidade|Promessa|Polarizacao|Confissao|Tribal]
- cliches-proibidos.md: [N] cliches a evitar listados (citar 3 exemplos relevantes ao tema)
- regras-inviolaveis.md: regras aplicaveis citadas (mencionar pelo menos 2)
- hook-quality.md: padrao viral alvo = [Contraintuitivo|Segredo|Confissao|Urgencia|Prova|Tribal|Meta]
```

**Sem esse bloco, o output e VETADO automaticamente (ver veto CONT_HOOK_SOURCES_001).**

### Etapa 1: Configuracao
1. Coletar as 3 informacoes obrigatorias — perguntar o que faltar
2. Se tipo/framework/tamanho nao definidos, recomendar com base na intencao:
   - Atracao → Polemico ou Curiosidade + Abertura Curiosa ou Segredo Revelado
   - Consciencia → Imperial ou Crenca + Problema e Solucao ou Pergunta Impactante
   - Aquecimento → Historia ou Problema + Testemunho Real ou Autoridade
   - Venda → Oferta + Beneficio Direto ou Passo a Passo
3. Apresentar opcoes ao usuario: "1. X, 2. Y, 3. Z"
4. Aguardar selecao

### Etapa 2: Headlines (Slide 1) — COM RASTRO DE FONTE OBRIGATORIO
5. Gerar 3 variacoes no formato S1_HOOKS, **cada uma com rastreabilidade de fonte**:
   ```
   S1_HOOKS:
   - [VIRAL] "headline 1"
     └─ base: HB2-CAR-NNN "[hook original do banco]"
     └─ abertura: aberturas-poderosas.md tipo [Curiosidade|Promessa|Polarizacao|Confissao|Tribal]
     └─ adaptacao: [o que troquei pra encaixar no tema]
   - [VIRAL] "headline 2"
     └─ base: HB2-CAR-NNN "[hook original]"
     └─ abertura: tipo [...]
     └─ adaptacao: [...]
   - [IMPERIAL] "headline 3"
     └─ base: criacao original
     └─ padrao viral: [Contraintuitivo|Segredo|Confissao|Urgencia|Prova|Tribal|Meta]
     └─ inspiracao: [HB-X-NNN se houve, ou "criada do zero"]
   ```
6. Regras: max 18 palavras, sem interrogacao, contraintuitivo obrigatorio
7. As 2 [VIRAL] DEVEM citar IDs do hooks-bank.md. A [IMPERIAL] pode ser criacao original mas DEVE declarar o padrao viral
8. Apresentar ao usuario para selecao

### Etapa 3: Argumentacao (Slides 2-9)
8. Seguir estrutura completa do tipo escolhido (conforme tipos-de-post.md)
9. Aplicar framework de copy escolhido (conforme frameworks-copy.md)
10. Respeitar progressao emocional: reptiliano (1-3) → limbico (4-6) → neocortex (7-10)
11. Max 25 palavras por slide (concisao brutal)
12. Adaptar quantidade de slides conforme tamanho escolhido

### Etapa 4: CTA (Ultimo Slide)
13. Gerar 3 opcoes de CTA alinhadas com intencao:
    - Atracao: "Salva + compartilha"
    - Consciencia: "Comenta [PALAVRA-CHAVE]"
    - Aquecimento: "Manda pro amigo que precisa ouvir"
    - Venda: "Link na bio / Responde [PALAVRA-CHAVE] no DM"
14. CTA sempre imperativo, escolha binaria (age ou fica como esta)

### Etapa 5: Validacao
15. Executar oraculo posts completo (9 etapas)
16. Score >= 80% para aprovar
17. Se reprovar: identificar etapas que falharam, reescrever e re-validar

### Etapa 6: Entrega
18. Post formatado slide por slide
19. Caption sugerida (hook + contexto + CTA)
20. Sugestoes de repurpose (adaptar pra reels e stories)

### Etapa 7: Geracao de Imagens
21. **ANTES de gerar, perguntar ao usuario:**
    - Qual hook usar (VIRAL 1, VIRAL 2, IMPERIAL)
    - Qual layout: `twitter` (S1 preto + resto branco), `twitter-black` (tudo preto), `twitter-branco` (tudo branco), `editorial` (templates F2L), `misto` (customizado por slide)
    - NUNCA assumir layout sem perguntar
22. Converter markdown aprovado em `slides.json` usando o layout escolhido:
    - Aplicar template correto por slide conforme layout selecionado
    - S1: `title` = hook selecionado, `body` = frase original S1
    - S2+: `title` = vazio, `body` = texto do slide
    - Todo texto com acentuacao correta (pt-BR)
23. Gerar imagens: `node squads/conteudo/app/image-generator/generate.mjs --batch slides.json --output ./`
24. Salvar em `outputs/copys/{cliente}/{campanha}/carrosseis/{id}-{slug}/`
    - `slides.json` + `slide-01.png` a `slide-XX.png`
25. Consultar `data/image-generator-rules.md` para regras de layout e templates
26. Marcar no markdown (secao Metadados):
    - `- **Imagens geradas:** Sim — {YYYY-MM-DD} — Hook: {TIPO} — Layout: {LAYOUT} — \`{pasta}/\``
    - Se nao gerou: `- **Imagens geradas:** Nao`

## VETO CONDITIONS

- Se nao tem as 3 informacoes obrigatorias → NAO executar, perguntar
- Se Slide 1 e pergunta em vez de afirmacao → Reescrever (deve ser afirmacao chocante)
- Se qualquer slide tem mais de 25 palavras → Reduzir (concisao brutal)
- Se nao tem progressao emocional entre slides → Reestruturar (reptiliano → limbico → neocortex)
- Se CTA nao e comando imperativo → Reescrever
- Se tom parece educativo ("vou te ensinar", "a dica e") → Reescrever no tom imperial
- Se usa palavras proibidas (segredo, dica, truque, hack, simples, facil) → Substituir
- Se parece carrossel generico de dicas → Refazer completamente
- Se score oraculo < 80% → Reescrever ate atingir
- Se foco esta no "eu" em vez do "voce" → Reescrever com foco no leitor

## OUTPUT EXAMPLE

```
CARROSSEL: Imperial + Abertura Curiosa (10 slides)
TEMA: Posicionamento de marca no mercado digital
PUBLICO: Empreendedores digitais que faturam 5-15k/mes
INTENCAO: Consciencia

S1_HOOKS:
- [VIRAL] "95% dos empreendedores digitais sao INVISIVEIS pro comprador certo."
- [VIRAL] "Voce posta todo dia e ninguem compra. O problema nao e o conteudo."
- [IMPERIAL] "Enquanto voce cria conteudo, quem fatura cria COMANDO."

SLIDE 1: "95% dos empreendedores digitais sao INVISIVEIS pro comprador certo."
SLIDE 2: "Voce faz reels, carrossel, stories. Segue o calendariozinho. E NADA muda."
SLIDE 3: "Enquanto voce posta e reza, outros faturam 50k/mes com 3 posts por semana."
SLIDE 4: "O problema nao e seu conteudo. E que voce nao tem POSICIONAMENTO."
SLIDE 5: "Posicionamento nao e 'identidade visual'. E ser a UNICA opcao na mente de quem paga."
SLIDE 6: "O mercado te vendeu 'consistencia'. Mas consistencia sem posicionamento e barulho."
SLIDE 7: "O dia que voce parar de criar conteudo e comecar a criar COMANDO, tudo muda."
SLIDE 8: "Meu cliente saiu de 3k pra 47k em 60 dias. Mesmo publico. Novo posicionamento."
SLIDE 9: "Isso nao e pra quem quer 'crescer no Instagram'. E pra quem quer DOMINAR um mercado."
SLIDE 10: "Salva esse post. Manda pro amigo que precisa ouvir. Ou ignora e continua invisivel."

CAPTION:
"Voce pode continuar postando todo dia e rezando pra alguem comprar. Ou pode entender que o jogo mudou. Posicionamento > Consistencia. Salva e compartilha com quem precisa."

SCORE ORACULO: 88% — APROVADO

REPURPOSE:
- Reels: roteiro de 45s com blocos do carrossel
- Stories: sequencia de 5 stories (posicionamento + levantada de mao)
```

## COMPLETION CRITERIA

- Todas as etapas executadas na ordem (configuracao → headlines → argumentacao → CTA → validacao → entrega)
- Slide 1 com 3 variacoes (2 VIRAL + 1 IMPERIAL)
- Progressao emocional respeitada (reptiliano → limbico → neocortex)
- Max 25 palavras por slide
- CTA imperativo com escolha binaria
- Caption sugerida
- Score oraculo >= 80%
- Sugestoes de repurpose incluidas
- Tom imperial consistente do inicio ao fim

## Output Example

```
## CARROSSEL — "Cobrar Barato e Autossabotagem"

Tipo: Imperial | Framework: PAS | Slides: 10 | Intencao: Consciencia

SLIDE 1 (CAPA):
"Cobrar barato nao e humildade. E autossabotagem."

SLIDE 2:
"Voce entrega resultado real. Transforma a vida do cliente.
Mas na hora de precificar, trava."

SLIDE 3:
"O problema nao e o mercado. E a historia que voce conta pra si mesmo:
'Preciso de mais seguidores primeiro.'"

[...]

SLIDE 9:
"Quem cobra premium atrai cliente que valoriza.
Quem cobra barato atrai cliente que reclama."

SLIDE 10 (CTA):
"Voce vai continuar cobrando o preco do seu medo
ou vai cobrar o preco do seu resultado?
Comenta PREMIUM que eu te mostro o caminho."

CAPTION: Mentor que cobra barato trabalha o dobro e fatura metade (...)
Score Oraculo: 87% | Repurpose: Reels slide 1-3, Stories PAS
```

## REFERENCES

- data/hooks-bank.md — Banco de hooks com IDs (HB2-CAR-NNN, HB2-CAR-NNN, HB2-CAR-NNN) — **CONSULTA OBRIGATORIA na Etapa 0**
- data/aberturas-poderosas.md — 5 tipos de abertura — **CONSULTA OBRIGATORIA na Etapa 0**
- data/cliches-proibidos.md — Lista de exclusao — **CONSULTA OBRIGATORIA na Etapa 0**
- data/regras-inviolaveis.md — Leis de execucao — **CONSULTA OBRIGATORIA na Etapa 0**
- checklists/hook-quality.md — 15 itens de validacao — **CONSULTA OBRIGATORIA na Etapa 0**
- data/tipos-de-post.md — 7 tipos de post com estrutura completa por slides
- data/frameworks-copy.md — 9 frameworks de copy + matriz tipo x framework
- data/oraculo-posts.md — 9 etapas de validacao + 12 testes

### Veto Conditions

- id: "CONT_CREATE_CAROUSEL_001"
  condition: "Tema, publico e intencao nao fornecidos"
  check: "Verificar se as 3 informacoes obrigatorias estao presentes nos inputs"
  result: "VETO - BLOCK. Solicitar informacoes faltantes antes de iniciar criacao do carrossel"
  rationale: "Carrossel sem tema e publico gera conteudo generico que nao converte"

- id: "CONT_CREATE_CAROUSEL_002"
  condition: "Output sem hook validado (Slide 1 e pergunta ou generico)"
  check: "Verificar se Slide 1 e afirmacao chocante com max 18 palavras e 3 variacoes"
  result: "VETO - BLOCK. Reescrever Slide 1 como afirmacao contraintuitiva antes de prosseguir"
  rationale: "Hook fraco compromete retencao — 80% do engajamento depende do Slide 1"

- id: "CONT_HOOK_SOURCES_001"
  condition: "Output nao inicia com bloco FONTES_CONSULTADAS contendo as 5 fontes obrigatorias"
  check: "Verificar primeiro bloco do output — deve listar hooks-bank.md, aberturas-poderosas.md, cliches-proibidos.md, regras-inviolaveis.md, hook-quality.md"
  result: "VETO - BLOCK. Voltar a Etapa 0 e ler os 5 arquivos antes de gerar qualquer hook"
  rationale: "Sem rastro de consulta, hook e alucinado e ignora banco curado de 220+ hooks-base"

- id: "CONT_HOOK_SOURCES_002"
  condition: "Hooks [VIRAL] em S1_HOOKS sem citacao └─ base: HB-X-NNN do hooks-bank.md"
  check: "Cada hook marcado [VIRAL] DEVE ter linha └─ base: com ID valido do hooks-bank.md (HB2-CAR-NNN, HB2-CAR-NNN ou HB2-CAR-NNN)"
  result: "VETO - BLOCK. Adicionar ID de fonte ou trocar marcador para [IMPERIAL] (criacao original)"
  rationale: "Rastreabilidade obrigatoria — sem ID, e impossivel auditar se o agente consultou o banco"

- id: "CONT_HOOK_SOURCES_003"
  condition: "Hook [IMPERIAL] sem declarar padrao viral aplicado"
  check: "Hook [IMPERIAL] DEVE ter linha └─ padrao viral: com um dos 7 padroes do hook-quality.md (Contraintuitivo|Segredo|Confissao|Urgencia|Prova|Tribal|Meta)"
  result: "VETO - BLOCK. Declarar padrao viral aplicado antes de prosseguir"
  rationale: "Hook IMPERIAL sem padrao viral e improviso — checklist hook-quality exige pelo menos 1 padrao"

### Completion Criteria

- [ ] Slide 1 com 3 variacoes (2 VIRAL + 1 IMPERIAL) apresentadas ao usuario
- [ ] Progressao emocional respeitada (reptiliano → limbico → neocortex) com max 25 palavras/slide
- [ ] Score oraculo >= 80% com CTA imperativo e caption sugerida
- [ ] Sugestoes de repurpose (reels e stories) incluidas na entrega
