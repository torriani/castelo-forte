# Adaptar Conteudo para Outro Formato

name: repurpose-content
executor: content-repurposer
description: Adaptar conteudo existente (carrossel, reels, stories) para outro formato mantendo a essencia, tom imperial e validacao pelo oraculo
elicit: true
pre_conditions:
  - Conteudo original criado e disponivel (carrossel, reels ou stories)
  - Nucleo e regras inviolaveis carregados de data/
  - Tipos de post e frameworks de copy disponiveis em data/
  - Oraculo de posts e reels disponiveis para validacao

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

- **Conteudo original:** texto completo do post/roteiro/sequencia existente (obrigatorio)
- **Formato de origem:** Carrossel / Reels / Stories (obrigatorio)
- **Formato destino:** Carrossel / Reels / Stories (obrigatorio)
- **Intencao:** Atracao / Consciencia / Aquecimento / Venda (obrigatorio)
- **Tipo de post desejado:** Imperial / Polemico / Crenca / Problema / Curiosidade / Historia / Oferta (opcional — recomendado automaticamente)
- **Framework de copy:** 1 dos 9 frameworks (opcional — recomendado automaticamente)

## STEPS

1. Receber conteudo original e identificar formato de origem
2. Extrair nucleo do conteudo: tema central, argumento principal, emocao dominante, CTA
3. Identificar tipo de post e framework de copy usados no original
4. Selecionar tipo de post e framework adequados pro formato destino (usar matriz tipo x framework)
5. Adaptar estrutura conforme regras do formato destino:
   - **Para Carrossel:** seguir estrutura do tipo escolhido (1-10 slides), max 60 palavras/slide, 3 variacoes de headline
   - **Para Reels:** roteiro com hook (3s), desenvolvimento (15-45s), CTA (5s), sugestao de cortes
   - **Para Stories:** sequencia de 3-7 stories com categoria estrategica (conforme stories-categorias.md)
6. Manter tom imperial — nunca suavizar na adaptacao
7. Ajustar CTA para o comportamento nativo do formato destino (salvar/compartilhar no carrossel, comentar no reels, responder/reagir nos stories)
8. Validar pelo oraculo (posts para carrosseis, niveis 1-3 para reels)
9. Se score < 80% → reescrever e re-validar
10. Entregar conteudo adaptado com sugestoes de publicacao

## VETO CONDITIONS

- Se nao tem conteudo original completo → NAO executar, pedir conteudo
- Se formato de origem = formato destino → NAO executar, nao e repurpose
- Se adaptacao perde a mensagem central do original → Refazer mantendo nucleo
- Se tom muda de imperial para educativo/generico → Reescrever no tom imperial
- Se carrossel adaptado tem mais de 60 palavras por slide → Reduzir
- Se reels adaptado nao tem hook nos primeiros 3 segundos → Reescrever hook
- Se stories adaptado nao tem intencao estrategica por story → Reestruturar
- Se score oraculo < 80% → Reescrever ate atingir

## OUTPUT EXAMPLE

```
REPURPOSE: Carrossel → Reels
TEMA: Posicionamento de marca no mercado digital
TIPO ORIGINAL: Imperial (Carrossel 10 slides)
TIPO DESTINO: Imperial (Reels 45s)

ROTEIRO REELS:

HOOK (0-3s):
"A estrategia que todo mundo ensina esta DESTRUINDO seu posicionamento."

DESENVOLVIMENTO (3-40s):
[Bloco 1 - Problema] "Voce posta todo dia, segue o calendariozinho bonito..."
[Bloco 2 - Contraste] "Enquanto isso, quem fatura de verdade posta 3x por semana..."
[Bloco 3 - Novo paradigma] "Nao e sobre volume. E sobre ser a UNICA opcao..."
[Bloco 4 - Prova] "Meu cliente saiu de 3k pra 47k em 60 dias. Mesmo publico."

CTA (40-45s):
"Salva esse video. Manda pro amigo que precisa ouvir isso."

SUGESTOES:
- Gravar olhando direto pra camera, tom firme
- Corte seco entre blocos
- Texto na tela no hook
- Melhor horario: 18h-20h
```

## COMPLETION CRITERIA

- Conteudo adaptado mantendo nucleo do original (tema + argumento + emocao)
- Formato destino respeitado com suas regras especificas
- Tom imperial consistente (sem suavizar)
- CTA adequado ao formato destino
- Score oraculo >= 80%
- Sugestoes de publicacao incluidas

## Output Example

```
## REPURPOSE — Carrossel → Reels + Stories

Original: Carrossel "Cobrar Barato e Autossabotagem" (10 slides, Imperial/PAS)

### Adaptacao 1: Reels (30s)
HOOK: "Cobrar barato nao e humildade. E autossabotagem." (slide 1)
DESENVOLVIMENTO: Slides 2-3 condensados em 15s de fala direta
CTA: "Salva esse reels e manda pra aquele amigo que cobra pouco."
Score Oraculo: 83%

### Adaptacao 2: Stories PAS (4 stories)
Story 1: Slide 1 como imagem + texto (hook)
Story 2: Slide 3 como pergunta interativa (enquete)
Story 3: Slide 9 como afirmacao de impacto
Story 4: CTA "Comenta PREMIUM no ultimo post"
Score Oraculo: 81%

Essencia mantida: tom imperial, mensagem anti-cobrar-barato
Publicacao sugerida: Reels 48h apos carrossel, Stories no dia seguinte
```

## REFERENCES

- data/tipos-de-post.md — estruturas dos 7 tipos
- data/frameworks-copy.md — 9 frameworks e matriz tipo x framework
- data/oraculo-posts.md — validacao de carrosseis
- data/stories-categorias.md — categorias de stories

### Veto Conditions

- id: "CONT_REPURPOSE_CONTENT_001"
  condition: "Conteudo original nao fornecido para adaptacao"
  check: "Verificar se texto completo do post/roteiro/sequencia original esta disponivel"
  result: "VETO - BLOCK. Solicitar conteudo original completo antes de iniciar repurpose"
  rationale: "Sem conteudo original, nao ha nucleo para extrair e adaptar"

- id: "CONT_REPURPOSE_CONTENT_002"
  condition: "Formato de origem igual ao formato destino"
  check: "Verificar se formato de origem e destino sao diferentes"
  result: "VETO - BLOCK. Informar que nao e repurpose — redirecionar para task de edicao ou validacao"
  rationale: "Repurpose exige mudanca de formato — mesmo formato e revisao, nao adaptacao"

### Completion Criteria

- [ ] Conteudo adaptado mantendo nucleo do original (tema + argumento + emocao)
- [ ] Formato destino respeitado com suas regras especificas e CTA adequado
- [ ] Tom imperial consistente (sem suavizar na adaptacao) e score oraculo >= 80%
- [ ] Sugestoes de publicacao incluidas (horario, sequencia em relacao ao original)
