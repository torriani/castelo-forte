# Criar Sequencia de Stories

name: create-stories
executor: stories-strategist
description: Criar sequencia estrategica de stories para Instagram com intencao de conversao, baseada nas 7 categorias e com funcao clara no funil de vendas
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Categorias de stories disponiveis em data/stories-categorias.md
  - Oraculo de posts disponivel para validacao de tom (data/oraculo-posts.md)

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

- **Tema:** sobre o que e a sequencia (obrigatorio)
- **Categoria principal:** Lifestyle / Posicionamento / Insights / Bastidores / Cases / Caixinha / Levantada de Mao (obrigatorio)
- **Intencao:** Atracao / Consciencia / Aquecimento / Venda (obrigatorio)
- **Avatar:** quem vai ver (obrigatorio)
- **Numero de stories:** 3-7 (opcional — default: 5)
- **Oferta relacionada:** produto, mentoria ou servico (opcional)
- **Conexao com post do feed:** link com carrossel ou reels publicado (opcional)
- **Prints/provas disponiveis:** depoimentos, resultados, screenshots (opcional)

## STEPS

1. Coletar as 4 informacoes obrigatorias — perguntar o que faltar
2. Confirmar categoria com o usuario, explicando funcao no funil:
   - Lifestyle → fazer cobicarem sua vida (topo de funil)
   - Posicionamento → separar do rebanho (meio de funil)
   - Insights → mostrar visao superior (meio de funil)
   - Bastidores → gerar curiosidade sobre metodo (meio de funil)
   - Cases → provas reais de resultado (fundo de funil)
   - Caixinha → vender sem parecer vender (fundo de funil)
   - Levantada de Mao → identificar quem esta pronto pra comprar (fundo de funil)
3. Definir arco narrativo da sequencia: abertura (tensao) → desenvolvimento (valor) → fechamento (CTA)
4. Criar cada story seguindo regras da categoria:
   - **Lifestyle:** natural, aspiracional, nunca parecer ostentacao
   - **Posicionamento:** provocativo, polarizador, gerar reacao forte
   - **Insights:** revelador, inteligente, entregar algo que ninguem pensou
   - **Bastidores:** exclusivo, sempre deixar incompleto, gerar vontade de saber mais
   - **Cases:** factual com numeros reais, nunca generico
   - **Caixinha:** respostas direcionando pra oferta, nunca responder so por responder
   - **Levantada de Mao:** direto, escassez real, CTA com palavra-chave
5. Para cada story, definir: texto, elemento visual sugerido (foto/video/print), sticker (enquete/caixinha/slider/quiz)
6. Garantir progressao entre stories (cada um avanca o arco)
7. Ultimo story sempre com CTA claro alinhado a intencao
8. Validar tom imperial e coerencia da sequencia
9. Entregar sequencia completa formatada

## VETO CONDITIONS

- Se nao tem as 4 informacoes obrigatorias → NAO executar, perguntar
- Se categoria nao e uma das 7 validas → Sugerir a mais proxima e confirmar
- Se stories parecem posts avulsos sem conexao entre si → Reestruturar com arco narrativo
- Se story de Cases nao tem numeros/dados reais → Pedir prints ou dados concretos
- Se story de Levantada de Mao nao tem escassez real → Adicionar (vagas, prazo, exclusividade)
- Se tom vira educativo ("vou te ensinar") → Reescrever no tom imperial
- Se algum story nao tem funcao clara na sequencia → Remover ou substituir
- Se Caixinha responde sem direcionar pra oferta → Reescrever com direcao

## OUTPUT EXAMPLE

```
SEQUENCIA DE STORIES — POSICIONAMENTO
TEMA: Por que consistencia nao funciona
CATEGORIA: Posicionamento
INTENCAO: Aquecimento
AVATAR: Empreendedores digitais que postam todo dia sem resultado

STORY 1 — ABERTURA (Provocacao)
Texto: "Postei todo dia por 6 meses. Sabe o que aconteceu? NADA."
Visual: Fundo escuro, texto branco grande
Sticker: Enquete — "Ja aconteceu com voce?" SIM / NAO

STORY 2 — DESENVOLVIMENTO (Polarizacao)
Texto: "O mercado te vendeu 'consistencia' como se fosse religiao. Mas consistencia sem posicionamento e so barulho."
Visual: Print de post generico de guru com circulo vermelho
Sticker: Nenhum (deixar absorver)

STORY 3 — APROFUNDAMENTO (Insight)
Texto: "Os que faturam 50k+ postam 3x por semana. A diferenca? Cada post e uma ARMA, nao um diario."
Visual: Grafico simples comparativo
Sticker: Slider — "Quanto voce concorda?" 0-100

STORY 4 — VIRADA (Novo paradigma)
Texto: "Nao e sobre postar mais. E sobre ser a UNICA opcao na mente de quem paga."
Visual: Frase destacada em fundo contrastante
Sticker: Nenhum

STORY 5 — CTA (Direcao)
Texto: "Se voce quer parar de ser invisivel e instalar posicionamento de verdade, eu tenho algo pra te mostrar. Responde POSICIONAMENTO."
Visual: Selfie olhando pra camera
Sticker: Caixinha de perguntas

NOTAS DE EXECUCAO:
- Postar entre 18h-20h
- Intervalo de 5-10 min entre stories
- Nao usar filtros excessivos
- Tom firme, nunca suplicante
```

## COMPLETION CRITERIA

- Sequencia completa com numero de stories definido
- Categoria respeitada com suas regras especificas
- Arco narrativo claro: abertura → desenvolvimento → fechamento
- Cada story com texto + visual sugerido + sticker (quando aplicavel)
- CTA no ultimo story alinhado com intencao
- Tom imperial consistente
- Notas de execucao incluidas (horario, intervalo, visual)

## Output Example

```
## STORIES — "Bastidores do Metodo"

Categoria: Bastidores | Intencao: Aquecimento | 4 stories

STORY 1:
"Acabei de sair de uma call com um mentor que faturava 8k.
Ele me mostrou o conteudo dele. Sabe o que eu falei?"
[Texto sobre fundo escuro, sem imagem]

STORY 2:
"Seu conteudo e bom. Seu sistema e inexistente."
[Print parcial da call — borrado]

STORY 3:
"Em 20 minutos eu reestruturei o funil dele.
Resultado: 3 vendas em 48h. Sem post novo."
[Foto do quadro branco com anotacoes]

STORY 4:
"Isso nao e sorte. E metodo."
Enquete: "Voce quer que eu mostre o framework?" (Sim/Conta mais)

Score Oraculo: 83% | Funcao no funil: Aquecimento (gera curiosidade)
Notas: postar entre 19h-21h, intervalo de 30min entre stories
```

## REFERENCES

- data/stories-categorias.md — 7 categorias com funcao, tom, exemplos e frequencia
- data/oraculo-posts.md — referencia de tom e linguagem imperial
- tasks/create-campaign.md — quando stories fazem parte de campanha

### Veto Conditions

- id: "CONT_CREATE_STORIES_001"
  condition: "Tema, categoria, intencao e avatar nao fornecidos"
  check: "Verificar se as 4 informacoes obrigatorias estao presentes nos inputs"
  result: "VETO - BLOCK. Solicitar informacoes faltantes antes de criar sequencia de stories"
  rationale: "Stories sem categoria definida nao tem funcao estrategica no funil"

- id: "CONT_CREATE_STORIES_002"
  condition: "Stories parecem posts avulsos sem conexao narrativa"
  check: "Verificar se existe arco narrativo (abertura → desenvolvimento → fechamento) entre stories"
  result: "VETO - BLOCK. Reestruturar com arco narrativo e funcao clara para cada story"
  rationale: "Stories desconectados desperdicam visualizacoes — precisam de sequencia estrategica"

### Completion Criteria

- [ ] Sequencia completa com arco narrativo claro e cada story com funcao definida
- [ ] Categoria respeitada com suas regras especificas (Lifestyle, Posicionamento, etc.)
- [ ] Cada story com texto + visual sugerido + sticker e CTA no ultimo story
- [ ] Notas de execucao incluidas (horario, intervalo, visual) e tom imperial consistente
