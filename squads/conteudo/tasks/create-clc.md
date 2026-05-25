# Criar Carrossel de Lavagem Cerebral (CLC)

name: create-clc
executor: positioning-expert
description: Criar Carrossel de Lavagem Cerebral com 10 slides que forcam decisoes — sistema de dominacao mental via carrossel
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Diretrizes de posicionamento disponiveis em data/posicionamento.md
  - Lista de cliches proibidos disponivel em data/cliches-proibidos.md
  - Diretrizes de expressao disponiveis em data/expression.md

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
- **Crenca a destruir:** qual crenca do mercado atacar (obrigatorio)
- **Novo paradigma:** qual verdade instalar no lugar (obrigatorio)
- **Prova/dados:** numeros, cases, resultados (opcional)
- **Oferta relacionada:** o que vende (opcional)

## STEPS

1. Coletar as 4 informacoes obrigatorias
2. Criar Slide 1 — Gancho Neurologico: afirmacao CHOCANTE que sequestra o cerebro em 0.8s
3. Criar Slide 2 — Inoculacao contra Objecoes: neutralizar desculpas antes que aparecam
4. Criar Slide 3 — Contraste de Realidades: onde a pessoa esta vs onde poderia estar
5. Criar Slide 4 — Diagnostico Autoritario: dar nome ao problema que ninguem nomeia
6. Criar Slide 5 — Identificacao do Inimigo: criar alianca "nos contra eles"
7. Criar Slide 6 — Novo Paradigma: introduzir forma de pensar que substitui a antiga
8. Criar Slide 7 — Epifania (AHA Moment): insight irreversivel de compreensao
9. Criar Slide 8 — Validacao com Prova: dados, resultados, comparacoes
10. Criar Slide 9 — Acesso a Oportunidade: abrir janela para acao seletiva
11. Criar Slide 10 — Comando de Acao: CTA imperativo polarizador
12. Validar pelo oraculo (progressao, tom, concisao por slide)
13. Sugerir caption para o post
14. Entregar carrossel completo formatado

## VETO CONDITIONS

- Se nao tem as 4 informacoes obrigatorias → NAO executar, perguntar
- Se Slide 1 e pergunta em vez de afirmacao → Reescrever (deve ser afirmacao chocante)
- Se qualquer slide tem mais de 60 palavras → Reduzir
- Se nao tem progressao emocional clara entre slides → Reestruturar
- Se Slide 10 nao e comando imperativo → Reescrever
- Se tom parece educativo ("vou te ensinar") → Reescrever no tom imperial
- Se parece carrossel generico de dicas → Refazer completamente

## OUTPUT EXAMPLE

```
SLIDE 1 — GANCHO NEUROLOGICO:
"A estrategia de crescimento que todo mundo ensina esta LITERALMENTE impedindo voce de faturar."

SLIDE 2 — INOCULACAO:
"Voce ja tentou: postar todo dia, fazer reels, rodar trafego. E nada mudou. Nao e culpa sua."

SLIDE 3 — CONTRASTE:
"Enquanto voce posta e reza, outros faturam 50k/mes com 3 posts por semana."

SLIDE 4 — DIAGNOSTICO:
"O problema nao e seu conteudo. E que voce e invisivel pro comprador certo."

SLIDE 5 — INIMIGO:
"O mercado te vendeu 'consistencia'. Mas consistencia sem posicionamento e barulho."

SLIDE 6 — NOVO PARADIGMA:
"Nao e sobre postar mais. E sobre ser a unica opcao na mente de quem paga."

SLIDE 7 — EPIFANIA:
"O dia que voce parar de 'criar conteudo' e comecar a criar COMANDO, tudo muda."

SLIDE 8 — PROVA:
"[Case real] Saiu de 3k/mes para 47k/mes em 60 dias. Mesma audiencia. Novo posicionamento."

SLIDE 9 — ACESSO:
"Isso nao e pra todo mundo. E pra quem esta cansado de fingir que 'ta indo bem'."

SLIDE 10 — COMANDO:
"Salva esse post. Manda pro amigo que precisa ouvir. Ou ignora e continua como esta."

CAPTION:
"[Caption com gancho + contexto + CTA]"
```

## COMPLETION CRITERIA

- 10 slides completos seguindo estrutura CLC
- Slide 1 e afirmacao chocante (nunca pergunta)
- Progressao emocional: choque → dor → diagnostico → paradigma → prova → acao
- Max 60 palavras por slide
- CTA imperativo no slide 10
- Caption sugerida
- Tom imperial consistente
- Score oraculo >= 80%

## Output Example

```
## CLC — "Mentoria que Vende no Automatico"

Publico: Mentores digitais | Intencao: Dominacao mental

SLIDE 1 (CAPA):
"Voce nao precisa de mais seguidores. Precisa de um sistema."

SLIDE 2 (CRENCA ATUAL):
"O mercado te ensinou: poste todo dia, rode trafego, faca lives.
E voce obedeceu."

SLIDE 3 (QUEBRA):
"Mas se isso funcionasse, todo mundo que posta estaria rico."

SLIDE 4 (NOVA REALIDADE):
"Os mentores que faturam 50k+ nao postam mais.
Eles postam melhor."

[...]

SLIDE 9 (DECISAO FORCADA):
"Voce pode continuar fazendo o que todo mundo faz.
Ou pode fazer o que funciona."

SLIDE 10 (CTA):
"Comenta SISTEMA. Eu vou te mostrar o que muda."

Score Oraculo: 86% | Formato: CLC 10 slides
```

## REFERENCES

references:
  - data/posicionamento.md
  - data/nucleo.md
  - data/cliches-proibidos.md
  - data/expression.md

### Veto Conditions

- id: "CONT_CREATE_CLC_001"
  condition: "Crenca a destruir e novo paradigma nao definidos"
  check: "Verificar se as 4 informacoes obrigatorias estao nos inputs (nicho, avatar, crenca, paradigma)"
  result: "VETO - BLOCK. Solicitar crenca e paradigma antes de construir o CLC"
  rationale: "CLC sem crenca-alvo e paradigma nao tem direcao — vira carrossel generico"

- id: "CONT_CREATE_CLC_002"
  condition: "Sem contexto de posicionamento da marca para tom imperial"
  check: "Verificar se nicho e avatar estao especificos o suficiente"
  result: "VETO - BLOCK. Solicitar mais detalhes do nicho e avatar para especificidade"
  rationale: "CLC generico nao gera dominacao mental — precisa ser cirurgicamente direcionado"

### Completion Criteria

- [ ] 10 slides completos seguindo estrutura CLC (Gancho → Inoculacao → Contraste → Diagnostico → Inimigo → Paradigma → Epifania → Prova → Acesso → Comando)
- [ ] Progressao emocional clara do choque ate a acao com max 60 palavras por slide
- [ ] CTA imperativo no slide 10 com caption sugerida e tom imperial consistente
- [ ] Score oraculo >= 80% validado
