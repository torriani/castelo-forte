# Criar Frases de Impacto

name: create-impact-phrases
executor: carousel-creator
description: Gerar frases de impacto para quote cards (feed) e stories a partir de atomos extraidos de conteudo pilar. Executado pelo carousel-creator porque frases de impacto sao conteudo de feed (mesmo territorio que carrosseis).
elicit: true
pre_conditions:
  - Conteudo pilar ingerido via ingest-pillar e atomizado via atomize-content
  - Atomos tipo quote extraidos e disponiveis
  - Nucleo e regras inviolaveis carregados de data/
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

- **Atomos tipo quote:** lista de quotes de impacto extraidas do conteudo pilar (obrigatorio)
- **Tema central:** assunto do conteudo pilar (obrigatorio)
- **Publico:** avatar especifico (obrigatorio)
- **Quantidade:** numero de frases a gerar (opcional — default: todas as quotes extraidas)
- **Tom:** imperial (default) ou personalizado

## STEPS

### Etapa 1: Selecao de Quotes

1. Receber lista de atomos classificados como "quote de impacto"
2. Avaliar cada quote por potencial de impacto:
   - E contraintuitiva? (surpreende a audiencia)
   - E memoravel? (fica na cabeca)
   - E compartilhavel? (pessoa quer mandar pra alguem)
   - E autoral? (so VOCE diria isso desse jeito)
3. Ranquear por potencial (alta, media, baixa)
4. Apresentar lista ranqueada ao usuario: "1. Confirmar, 2. Ajustar, 3. Adicionar quotes proprias"

### Etapa 2: Refinamento das Frases

5. Para cada quote selecionada:
   - Refinar para maxima concisao (quanto menor, mais forte)
   - Garantir que funciona ISOLADA (sem contexto do pilar)
   - Manter vocabulario e tom do autor original
   - Eliminar palavras desnecessarias — cada palavra deve PESAR
6. Maximo 2 linhas por frase (ideal: 1 linha)
7. Se a quote original e longa, extrair o nucleo e descartar o resto

### Etapa 3: Formato Feed (Quote Card)

8. Para cada frase, gerar especificacao de quote card:
   - **Frase principal:** a frase de impacto (1-2 linhas)
   - **Contexto curto:** 1 frase que situa a frase (opcional, para caption)
   - **Estilo visual sugerido:** fundo escuro / claro / texturizado
   - **Fonte sugerida:** bold, serif, handwriting
   - **CTA da caption:** o que postar na legenda do feed
9. Caption do feed deve ter:
   - A frase como destaque
   - 2-3 linhas de contexto ou provocacao
   - CTA de engajamento (salvar, compartilhar, comentar)

### Etapa 4: Formato Stories

10. Para cada frase, gerar versao Stories:
    - Frase adaptada para tela vertical (pode quebrar em 2 stories se necessario)
    - Sugestao de fundo (cor solida, foto com overlay, video com texto)
    - Sticker sugerido (enquete, pergunta, slider)
    - CTA do stories (responder, reagir, compartilhar)

### Etapa 5: Entrega

11. Entregar pacote completo:
    - Lista de frases ranqueadas por potencial
    - Versao feed (quote card) com especificacoes visuais
    - Versao stories com sugestoes de sticker
    - Caption pronta para cada quote card
12. Apresentar ao usuario para aprovacao

## VETO CONDITIONS

- Se frase tem mais de 2 linhas → Condensar ou dividir
- Se frase nao funciona isolada (precisa de contexto) → Reescrever para independencia
- Se frase e generica (qualquer pessoa diria) → Adicionar angulo autoral ou descartar
- Se frase usa palavras proibidas (segredo, dica, truque, hack, simples, facil) → Substituir
- Se tom nao e imperial → Reescrever no tom correto
- Se caption do feed e maior que 5 linhas → Condensar
- Se menos de 3 frases de impacto foram extraidas → Avisar que o pilar teve poucas quotes

## OUTPUT EXAMPLE

```
FRASES DE IMPACTO — Conteudo Pilar: Posicionamento de Marca
Total: 5 frases | Potencial alto: 3 | Medio: 2

---

FRASE #1 [POTENCIAL ALTO]
"Consistencia sem posicionamento e trabalho escravo digital."

FEED (Quote Card):
- Visual: Fundo preto, fonte branca bold serif
- Caption: "Voce posta todo dia. Todo santo dia. E ninguem compra.
  O problema nao e frequencia. E direcao.
  Salva esse post e manda pra quem precisa ouvir."
- CTA: Salvar + compartilhar

STORIES:
- Fundo: Preto solido
- Texto: Frase centralizada, fonte grande
- Sticker: Enquete "Concorda? Sim / Doi mas sim"
- Sequencia: 1 story unico

---

FRASE #2 [POTENCIAL ALTO]
"Voce nao perde cliente por cobrar caro. Perde por cobrar barato."

FEED (Quote Card):
- Visual: Fundo escuro texturizado, fonte branca handwriting
- Caption: "O medo de cobrar caro e uma estrategia de sobrevivencia.
  Preco baixo atrai quem compara. Preco alto atrai quem valoriza.
  Comenta VALOR se voce ta pronto pra parar de competir por preco."
- CTA: Comentar + salvar

STORIES:
- Fundo: Gradiente escuro
- Texto: Frase em 2 linhas, fonte bold
- Sticker: Slider "Quanto voce cobra?" (pouco → o justo)
- Sequencia: 1 story unico

---

FRASE #3 [POTENCIAL ALTO]
"95% dos empreendedores sao invisiveis pro comprador certo."

[...]

RESUMO:
- 3 frases de potencial alto → publicar primeiro
- 2 frases de potencial medio → usar como complemento
- Sugestao: publicar 1 frase a cada 3-4 dias (nao saturar feed com quotes)
```

## COMPLETION CRITERIA

- Todas as quotes recebidas foram avaliadas e ranqueadas
- Cada frase tem versao feed (quote card) com especificacoes visuais
- Cada frase tem versao stories com sugestoes de sticker
- Captions prontas para cada quote card
- Frases funcionam isoladamente (sem depender do pilar)
- Tom imperial mantido em todas as frases e captions
- Nenhuma palavra proibida usada
- Usuario aprovou as frases finais

## Output Example

```
## FRASES DE IMPACTO — Tema: Autoridade Digital

| # | Frase | Categoria | Uso Sugerido |
|---|-------|-----------|-------------|
| 1 | "Likes nao pagam boleto. Autoridade paga." | Provocacao | Capa de carrossel |
| 2 | "Quem precisa convencer, ja perdeu." | Imperial | Slide final |
| 3 | "Conteudo sem estrategia e barulho. O mercado ja ta surdo." | Metafora | Hook de reels |
| 4 | "Seu seguidor nao compra porque nao sabe o que voce vende." | Diagnostico | Stories abertura |
| 5 | "Nao e sobre postar mais. E sobre postar certo." | Redefinicao | Legenda de post |
| 6 | "O preco do seu medo e o desconto que voce da." | Impacto emocional | Quote card feed |

Frases geradas: 6 | Cliches detectados: 0
Validacao: tom imperial, zero verbos proibidos, max 12 palavras cada
```

## REFERENCES

- data/swipe-posts.md — templates de titulo e frases
- data/hooks-bank.md — referencia de frases de impacto
- data/cta-bank.md — CTAs por tipo de acao
- data/regras-inviolaveis.md — regras de tom e linguagem
- data/cliches-proibidos.md — palavras e expressoes proibidas
- data/posts-intencionais.md — principios de posts intencionais

### Veto Conditions

- id: "CONT_CREATE_IMPACT_PHRASES_001"
  condition: "Atomos tipo quote nao extraidos do conteudo pilar"
  check: "Verificar se lista de quotes de impacto esta disponivel como input"
  result: "VETO - BLOCK. Executar atomize-content antes para extrair quotes"
  rationale: "Frases de impacto dependem de atomos reais — inventar frases do zero nao e o objetivo"

- id: "CONT_CREATE_IMPACT_PHRASES_002"
  condition: "Avatar ou publico-alvo nao definido"
  check: "Verificar se avatar esta especificado nos inputs"
  result: "VETO - BLOCK. Solicitar avatar antes de gerar frases e captions"
  rationale: "Sem avatar, as frases nao terao angulo autoral e parecerao genericas"

### Completion Criteria

- [ ] Todas as quotes avaliadas, ranqueadas por potencial e apresentadas ao usuario
- [ ] Cada frase com versao feed (quote card + especificacoes visuais) e versao stories
- [ ] Captions prontas para cada quote card com CTA de engajamento
- [ ] Frases funcionam isoladamente, tom imperial mantido, zero palavras proibidas
