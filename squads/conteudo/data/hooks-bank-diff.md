# Diff: hooks-bank.md (v1) → hooks-bank-v2.md (v2)

> **Fonte da verdade:** `hooks-bank-v2.md` é o banco oficial.
> **Objetivo deste diff:** identificar o que do v1 vale resgatar pro v2.
> **Critério de migração:** só entra no v2 o que (1) não está duplicado e (2) atende a regra de ouro dos 4 ingredientes OU representa um padrão genuinamente novo.
> **Última atualização:** 2026-05-11

---

## Resumo executivo

| Bloco do v1 | Total v1 | Já em v2 (cobertos) | Resgatar | Descartar | % aproveitamento |
|---|---|---|---|---|---|
| Hooks Carrossel Slide 1 (HB-C-001 a HB-C-057) | 57 | ~22 | 8 candidatos | ~27 | 14% |
| Hooks Reels (HB-R-001 a HB-R-028) | 28 | 0 | 28 (toda categoria nova) | 0 | 100% (mover bloco) |
| Hooks Fura-Fila Fitness (HB-FF-001 a HB-FF-064) | 64 | ~30 | 12 candidatos | ~22 | 19% |
| Hooks Fura-Fila Outros nichos | 21 | ~5 | 4 candidatos | ~12 | 19% |
| Hooks Fura-Fila Multi-Nicho (HB-FF-076 a HB-FF-100) | 25 | ~15 | 5 candidatos | ~5 | 20% |
| 6 Arquétipos (HB-A-001 a HB-A-036) | 36 | ~10 | 0 (estrutura redundante) | 36 | 0% |
| Frameworks teóricos (Hormozi 70-20-10, Matriz, 8 tipos) | 3 | 0 | 3 (úteis como princípios) | 0 | 100% (resgatar) |

**Total a resgatar:** ~60 itens + 3 frameworks teóricos
**Estimativa pós-merge:** v2 final com ~115 hooks (CAR) + 10 arquétipos (MAN) + frameworks teóricos consolidados

---

## 1. Hooks de Carrossel (HB-C-001 a HB-C-057)

### Já cobertos pelo v2 (descartar — duplicidade)

| ID v1 | Hook v1 | Já no v2 como |
|---|---|---|
| HB-C-005 | "Pare de fazer X se quiser Y" | Coberto por CAR-019 (polêmico inversão de causa) e por padrão de comando |
| HB-C-014 / HB-C-038 | "X sem precisar de Y" | CAR-015 (curiosity gap clássico) |
| HB-C-008 / HB-C-032 | "Eu faria isso se fosse começar do zero" | Variante de CAR-005 (afirmação categórica) |
| HB-C-012 / HB-C-036 | "Vou te mostrar como fazer X com recurso mínimo" | CAR-007 (resultado alto + esforço baixo) |
| HB-C-013 / HB-C-037 | "Você quer X? Então pare de Y" | Coberto por CAR-019 (inversão) e CAR-024 (incompletude) |
| HB-C-007 / HB-C-031 | "Se você ainda faz isso, está ficando pra trás" | Coberto por CAR-019 (polêmica) e ângulo "ficando pra trás" |
| HB-C-009 / HB-C-033 | "Você tem duas opções: continuar X ou..." | Variante de CAR-019/024 (binário polêmico) |
| HB-C-010 / HB-C-034 | "Você precisa parar de acreditar que X" | CAR-019 (polêmico) |
| HB-C-011 / HB-C-035 | "3 sinais de que você está no caminho errado em X" | Coberto por CAR-018 (didático número fechado) |
| HB-C-040 a HB-C-057 (18 hooks "Pare de X") | "Pare de viralizar/postar errado/etc" | Coberto por CAR-022 (Pare de X comum, vem Y) — formato já existe |

### Candidatos a resgatar pro v2 (genuinamente novos)

| ID v1 | Hook v1 | Por que vale resgatar | Proposta de ID no v2 |
|---|---|---|---|
| HB-C-001 | "O maior mito sobre X é que..." | Padrão "destruidor de mito" — NÃO está coberto. Diferente de "real motivo" (CAR-034) | **HB2-CAR-054 — Destruidor de mito** |
| HB-C-002 / HB-C-026 | "Você não vai acreditar que isso existe" | Curiosity gap puro com produto/ferramenta — variante de CAR-052 mas com foco em existência | **Funde com CAR-052** (não cria novo) |
| HB-C-003 / HB-C-027 | "A maioria das pessoas erra quando tenta X" | Padrão "erro do coletivo" — NÃO está coberto. Diferente de CAR-019 (inversão de causa) porque foca no erro de execução | **HB2-CAR-055 — Erro coletivo na execução** |
| HB-C-006 / HB-C-030 | "N verdades que ninguém te contou sobre X" | Padrão "revelação numerada" — NÃO está coberto | **HB2-CAR-056 — Revelação numerada** |
| HB-C-015 | "Você não tem noção do que é isso aqui" | Curto, misterioso, autêntico — NÃO coberto. Funciona como abertura curta com produto único | **HB2-CAR-057 — Mistério radical** |
| HB-C-017 | "Isso deveria ser ilegal" | Hook extremo polarizador — NÃO coberto. Curto, viral, autossuficiente | **HB2-CAR-058 — Extremo polarizador** |
| HB-C-018 | "O jeito mais preguiçoso de parecer um gênio de marketing" | Autodepreciativo + humor + benefício oculto — NÃO coberto | **HB2-CAR-059 — Autodepreciativo + benefício oculto** |
| HB-C-023 / HB-C-039 | "Você pode me deixar de seguir por dizer isso, mas..." | Polarizador autoeliminador — NÃO coberto | **HB2-CAR-060 — Polarizador autoeliminador** |
| HB-C-057 | "Quanto mais produtos você tem, mais pobre você fica" | Inversão de causa específica e forte — variante de CAR-019 mas com estrutura própria ("quanto mais X, mais Y oposto") | **HB2-CAR-061 — Quanto mais X, mais Y oposto** |

**8 hooks novos pra resgatar do bloco Carrossel.**

---

## 2. Hooks de Reels (HB-R-001 a HB-R-028)

### Status no v2

**Nenhum** hook desta categoria existe no v2 ainda. As categorias `Reels — Título overlay` e `Reels — Primeiros 6 segundos` estão **explicitamente marcadas como pendentes** nas Estatísticas do banco.

### Decisão

**Resgatar a categoria inteira (28 hooks)** mas reformatá-los seguindo o padrão v2 (Headline + Sub-headline ou apenas Headline curta + Função + Exemplo real + Ingredientes + Anti-padrão).

**Importante:** o v1 já fornece **regras operacionais** dessa categoria que vamos preservar:
- Máximo 5 palavras (ideal 3-4)
- Máximo 1.5s falado
- Texto na tela obrigatório
- Primeira palavra = maior impacto (PARE, NUNCA, ISSO, VOCÊ, CUIDADO)
- Nunca começar com "Você", "Eu", "A", "O" (ATENÇÃO: conflita com "VOCÊ" como primeira palavra de impacto — verificar com JT)
- Sentimentos-alvo: Medo, Curiosidade, Raiva, Desejo

**Padrões do v1 a resgatar:**
1. Contraintuitivo (HB-R-001 a 004)
2. Segredo Revelado (HB-R-005 a 008)
3. Confissão/Vulnerabilidade (HB-R-009 a 012)
4. Urgente/Exclusivo (HB-R-013 a 016)
5. Prova Imediata (HB-R-017 a 020)
6. Tribal/Identidade (HB-R-021 a 024)
7. Meta/Autorreferência (HB-R-025 a 028)

**Proposta:** quando o JT quiser abrir categoria Reels no v2, partir desses 7 padrões como esqueleto base.

---

## 3. Hooks Fura-Fila Fitness (HB-FF-001 a HB-FF-064)

### Já cobertos pelo v2 (descartar — duplicidade)

| ID v1 | Hook v1 | Já no v2 como |
|---|---|---|
| HB-FF-002 / HB-FF-023 | "Pare de perder tempo no Instagram e vem treinar" | **CAR-022** (literal) |
| HB-FF-003 / HB-FF-024 | "Você não é obrigada a gostar de treinar" | **CAR-023** (literal) |
| HB-FF-004 / HB-FF-025 | "Não adianta fechar a boca" | **CAR-024** (literal) |
| HB-FF-006 / HB-FF-027 | "Treina, treina, treina e a bunda tá do mesmo jeito" | **CAR-025** (literal) |
| HB-FF-007 / HB-FF-028 | "Se você tentou e falhou, parabéns!" | **CAR-026** (literal) |
| HB-FF-008 / HB-FF-029 | "Nada pode parar uma mulher que quer ficar gostosa" | **CAR-027** (literal) |
| HB-FF-009 / HB-FF-030 | "Pule esse vídeo e continue se perguntando" | **CAR-028** (literal) |
| HB-FF-015 / HB-FF-036 | "Com essa série de abdômen as pessoas podem te odiar" | **CAR-029** (literal) |
| HB-FF-039 | "Eu declaro: não gosto de treinar" | **CAR-030** (literal) |
| HB-FF-040 | "Aprenda a deletar exercícios que não te levam a nada" | **CAR-031** (literal) |
| HB-FF-041 | "Já passou do meio do ano e você ainda não tá feliz" | **CAR-032** (literal) |
| HB-FF-042 / HB-FF-061 | "Você está viciada em inventar desculpas/procrastinar" | **CAR-033** (literal) |
| HB-FF-044 | "O real motivo pra sua barriga estar desse jeito" | **CAR-034** (literal) |
| HB-FF-048 / HB-FF-062 | "Você se acha bonita pelada / Tá feliz com sua bunda" | **CAR-035 / CAR-046** (literal) |
| HB-FF-049 | "A segunda melhor coisa da vida é comer..." | **CAR-036** (literal) |
| HB-FF-050 | "1 mês de academia não vai mudar sua vida" | **CAR-037** (literal) |
| HB-FF-052 | "Coisas pra você tomar... vergonha na cara, constância" | **CAR-038** (literal) |
| HB-FF-053 | "Um caminho simples: entender que não existe caminho simples" | **CAR-039** (literal — ⭐ top pick) |
| HB-FF-055 | "Quando nem os caras da obra te dão mais atenção" | **CAR-040** (literal) |
| HB-FF-056 | "Pelas minhas contas suas desculpas acabaram" | **CAR-041** (literal) |
| HB-FF-057 | "Como ter o corpo dos sonhos em 2 passos" | **CAR-042** (literal) |
| HB-FF-058 | "Quem é de verdade sabe quem é de mentira (corpo malhado x cirurgia)" | **CAR-043** (literal) |
| HB-FF-059 | "Comece com o que tem, onde estiver" | **CAR-044** (literal) |
| HB-FF-060 | "Prometo que em 1 mês se estiver fazendo o que precisa" | **CAR-045** (literal) |
| HB-FF-063 | "Mulher que deseja afinar o braço precisa fazer isso" | **CAR-047** (literal) |

### Candidatos a resgatar pro v2 (novos padrões)

| ID v1 | Hook v1 | Por que vale resgatar | Proposta v2 |
|---|---|---|---|
| HB-FF-001 / HB-FF-022 / HB-FF-076 | "Talvez ficar gostosa não seja pra você" | Padrão "desafiador autoeliminador" — NÃO coberto | **HB2-CAR-062 — Desafiador autoeliminador** |
| HB-FF-005 / HB-FF-026 / HB-FF-080 | "Quase mulher nenhuma faz isso" | Padrão de raridade + curiosidade — NÃO coberto | **HB2-CAR-063 — Raridade de comportamento** |
| HB-FF-010 / HB-FF-031 | "Por que elas ficam mais gostosas que você?" | É **pergunta competitiva** — categoria de pergunta que NÃO temos | **HB2-CAR-064 — Pergunta competitiva** |
| HB-FF-011 / HB-FF-032 | "Esse é o pior tipo de treino do mundo" | Padrão de **superlativo negativo** — NÃO coberto | **HB2-CAR-065 — Superlativo negativo** |
| HB-FF-012 / HB-FF-033 / HB-FF-086 | "Se fosse fácil, tava todo mundo gostosa" | Padrão **lógico de seleção** — NÃO coberto | **HB2-CAR-066 — Lógica de seleção** |
| HB-FF-013 / HB-FF-087 | "Você está cada vez mais distante do seu corpo dos sonhos" | Padrão **distância progressiva** — diferente de "rock bottom" (CAR-040) porque é processo, não estado | **HB2-CAR-067 — Distância progressiva** |
| HB-FF-014 / HB-FF-088 | "E O ANTES E DEPOIS? Vai ficar só com o antes até quando?" | Padrão **provocação temporal direta** — NÃO coberto | **HB2-CAR-068 — Provocação temporal direta** |
| HB-FF-037 | "Você apaga a luz na hora de transar?" | Pergunta de **vergonha íntima específica** — variante de CAR-035 mas com vergonha como gatilho. Vale como exemplo no CAR-035 | **Adiciona como exemplo de CAR-035** |
| HB-FF-043 | "Seu corpo não é interessante" | Afirmação chocante autônoma — NÃO coberto. Forte mas perigoso | **HB2-CAR-069 — Afirmação chocante autônoma** ⚠️ uso restrito |
| HB-FF-045 | "3 motivos pra você desistir dessa palhaçada de treinar" | Padrão **anti-conselho irônico** — NÃO coberto | **HB2-CAR-070 — Anti-conselho irônico** |
| HB-FF-046 | "Quem tem medo de fazer tira sarro de quem está fazendo" | Padrão **psicologia social** — NÃO coberto | **HB2-CAR-071 — Psicologia social do invejoso** |
| HB-FF-047 | "As portas que se abrem quando você tá com o corpo que gosta" | Padrão **promessa de portas abertas** — variante mas com lógica própria | **HB2-CAR-072 — Promessa de portas que abrem** |
| HB-FF-054 / HB-FF-099 | "PARE AGORA DE MALHAR de qualquer forma. (Faz direito)" | Padrão **comando + parêntese de correção** — NÃO coberto | **HB2-CAR-073 — Comando + correção em parênteses** |
| HB-FF-064 | "Intestino: prende ou solta? Descubra a diferença" | Padrão **dicotomia + descoberta** — NÃO coberto | **HB2-CAR-074 — Dicotomia + descoberta** |

**12 candidatos novos do bloco Fitness** (+ 1 exemplo extra pra CAR-035).

### Descartar (fracos / redundantes)

- HB-FF-038 ("Essa série vai convencer você a gostar de treinar") — promessa rasa
- HB-FF-051 ("Essas atitudes prejudicam seu resultado") — vago
- HB-FF-075 (texto longo confuso) — não funciona como hook

---

## 4. Hooks Fura-Fila Outros nichos (HB-FF-065 a HB-FF-074)

### Já cobertos

| ID v1 | Hook v1 | Já no v2 como |
|---|---|---|
| HB-FF-065 / HB-FF-016 | "5 plantas que espantam a dengue" | **CAR-048** (literal) |
| HB-FF-066 / HB-FF-021 | "5 coisas que comprei e mudaram meu banheiro" | **CAR-048** (literal) |
| HB-FF-067 / HB-FF-017 | "Airbnb: truque pra parcelar em 10x" | **CAR-049** (literal) |
| HB-FF-069 / HB-FF-019 | "22 looks da princesa Diana" | **CAR-050** (literal) |
| HB-FF-070 / HB-FF-071 | "Você tem bolinhas no queixo?" | **CAR-051** (literal — pendente) |
| HB-FF-072 | "Você não vai acreditar no que deixou elas assim" | **CAR-052** (literal) |
| HB-FF-074 / HB-FF-020 | "Você não vai perder gordura se cometer esses 5 erros" | **CAR-053** (literal) |

### Candidatos a resgatar

| ID v1 | Hook v1 | Por que vale resgatar | Proposta v2 |
|---|---|---|---|
| HB-FF-018 / HB-FF-073 | "O processo de terapia em um vídeo" | Padrão **complexidade encapsulada** (algo grande em formato pequeno) — NÃO coberto | **HB2-CAR-075 — Complexidade encapsulada** |
| HB-FF-068 | "A diferença entre óleo essencial e essência" | Padrão **diferenciação educativa** (X vs Y didático) — diferente de CAR-043 (versus autenticidade) porque é didático, não polarizador | **HB2-CAR-076 — Diferenciação educativa** |

**2 candidatos novos.**

---

## 5. Hooks Multi-Nicho (HB-FF-076 a HB-FF-100)

A maioria são **versões abstraídas** dos hooks específicos já cobertos no v2. Não precisamos migrar — já temos os templates abstratos nos próprios padrões CAR.

### Exceções (genuinamente novos)

| ID v1 | Hook v1 | Já mapeado |
|---|---|---|
| HB-FF-085 | "Esse é o pior tipo de X do mundo" | Já mapeado acima como CAR-065 |
| HB-FF-093 | "3 motivos pra você desistir dessa palhaçada de X" | Já mapeado acima como CAR-070 |
| HB-FF-094 | "As portas que se abrem quando você X" | Já mapeado acima como CAR-072 |

**Nenhum adicional além dos já listados.**

---

## 6. 6 Arquétipos Hormozi (HB-A-001 a HB-A-036)

### Análise

O v1 organiza por **Arquétipo emocional** (Transformação, Curiosidade, Dor, Interrupção, Surpresa, Valor). O v2 organiza por **padrão estrutural** (53 padrões CAR + 10 arquétipos MAN).

**A organização do v2 é mais granular e mais útil**. Os arquétipos do v1 são camadas teóricas, não hooks operacionais.

### Decisão

**Descartar** os 36 IDs como hooks (são genéricos demais), mas **resgatar a taxonomia emocional** como **metadado opcional** no banco v2.

Proposta: cada hook do v2 pode receber tag `arquétipo emocional` (transformação/curiosidade/dor/interrupção/surpresa/valor). Útil pra escolher hook conforme objetivo emocional do post.

**Resgate sugerido:** seção `## Taxonomia emocional` no fim do v2, listando os 6 arquétipos como categorias de tag aplicáveis aos 75+ hooks.

---

## 7. Frameworks teóricos do v1 (resgatar 100%)

Estes elementos do v1 são **genuinamente úteis** e devem ser migrados:

### a) 8 Tipos de Hook Verbal (Hormozi)

```
1. Labels (Rótulos)
2. Yes Questions
3. Open Questions
4. Conditionals
5. Commands
6. Statements
7. Lists/Steps
8. Narratives
```

**Proposta:** seção `## Taxonomia de tipo verbal` no v2 — útil pra classificar hooks por estrutura linguística.

### b) Framework 70-20-10 (Hormozi)

```
- 70% CORE: Hooks já testados e vencedores
- 20% EMERGING: Variações dos vencedores
- 10% BIG IDEAS: Experimentação radical

Batch de 10: 7 core + 2 emerging + 1 big idea
```

**Proposta:** seção `## Princípio operacional: 70-20-10` no v2 — regra de composição de batch de hooks.

### c) Matriz Hook × Tipo de Post

| Hook | Imperial | Polêmico | Crença | Problema | Curiosidade | História | Oferta |
|---|---|---|---|---|---|---|---|

**Proposta:** seção `## Matriz de aplicação (Hook × Tipo de Post)` no v2 — guia de qual padrão usar pra qual tipo de post.

### d) Regras de Hook para Carrossel/Reels (parcialmente já no v2)

- ✅ 18 palavras (carrossel) — já migrado
- ⚠️ "JAMAIS perguntas" — JT decidiu **manter perguntas permitidas** (não migrar essa regra)
- ⚠️ "3 variações: 2 virais + 1 imperial" — não está no v2, pode entrar como padrão de produção
- ⚠️ Regras de Reels (max 5 palavras, 1.5s, etc) — entram quando categoria Reels for aberta

---

## Plano de execução (proposto)

Quando você aprovar este diff, eu faço **em ordem**:

**Passo 1 — Adicionar os 23 novos hooks ao v2** (Carrossel):
- 8 do bloco Carrossel original (HB2-CAR-054 a 061)
- 12 do bloco Fitness/Saúde (HB2-CAR-062 a 074)
- 2 do bloco Outros nichos (HB2-CAR-075, 076)
- 1 exemplo extra em CAR-035 (apaga luz transar)

**Passo 2 — Adicionar frameworks teóricos** ao v2:
- Taxonomia emocional (6 arquétipos Hormozi)
- Taxonomia de tipo verbal (8 tipos Hormozi)
- Princípio 70-20-10
- Matriz Hook × Tipo de Post

**Passo 3 — Decisão sobre categoria Reels:**
- Você quer migrar os 28 hooks de Reels já? Ou abrir categoria depois?

**Passo 4 — Arquivar v1:**
- Mover `data/hooks-bank.md` → `data/archive/hooks-bank-v1.md`
- v2 vira fonte oficial
- Atualizar referências em `tasks/create-hook-batch.md`, `checklists/hook-quality.md`, `workflows/wf-hook-testing.yaml`

---

## Itens marcados como DESCARTE definitivo

Lista de hooks/blocos do v1 que **não vale** trazer (motivos: duplicidade total, fraqueza, ou já coberto por padrão mais forte):

- HB-C-019 a HB-C-024 (Hooks Imperador Produto) — específicos do "agente que escreve", caso particular sem fórmula replicável
- HB-C-040 a HB-C-057 (18 hooks "Pare de X") — todos cabem em CAR-022, não precisam de IDs individuais
- HB-FF-038, HB-FF-051, HB-FF-075 — fracos individualmente
- HB-A-001 a HB-A-036 (36 hooks por arquétipo emocional) — taxonomia útil, IDs descartáveis

---

## Resumo final pra aprovação

| Item | Quantidade |
|---|---|
| **Hooks novos a migrar (CAR)** | 23 |
| **Frameworks teóricos a resgatar** | 4 (taxonomia emocional, taxonomia verbal, 70-20-10, matriz) |
| **Categoria Reels** | Decisão JT: migrar 28 agora ou depois? |
| **Hooks descartados** | ~95 (duplicados ou fracos) |
| **Tamanho final estimado do v2** | ~115 hooks (CAR) + 10 (MAN) + 4 frameworks teóricos |
