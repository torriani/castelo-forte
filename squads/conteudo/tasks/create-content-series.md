# Criar Serie de Conteudo

name: create-content-series
executor: content-chief
description: Criar serie de conteudo multiplataforma — pecas conectadas que constroem narrativa progressiva em diferentes formatos (feed, stories, reels)
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Tipos de post e frameworks de copy disponiveis em data/
  - Banco de hooks disponivel em data/hooks-bank.md
  - Posts intencionais disponiveis em data/posts-intencionais.md

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

- **Tema central:** assunto da serie (obrigatorio)
- **Avatar:** publico-alvo (obrigatorio)
- **Objetivo:** atracao, consciencia, aquecimento ou venda (obrigatorio)
- **Duracao:** quantos dias/semana (obrigatorio)
- **Formatos:** feed, stories, reels ou combinacao (default: todos)
- **Crenca a quebrar:** qual paradigma atacar na serie (opcional)
- **Oferta final:** se a serie leva a uma venda (opcional)

## STEPS

1. Coletar tema, avatar, objetivo e duracao
2. Definir arco narrativo da serie (inicio → meio → clímax → resolucao)
3. Distribuir conteudo por formato e dia:
   - Feed: pecas de profundidade (carrosseis, posts tipo)
   - Stories: bastidores, enquetes, interacao
   - Reels: hooks visuais, demonstracoes
4. Criar cada peca seguindo frameworks do sistema (tipos de post, hooks-bank, frameworks-copy)
5. Garantir conexao entre pecas (cross-reference, continuidade narrativa)
6. Validar cada peca pelo oraculo
7. Montar calendario editorial completo
8. Entregar serie formatada com cronograma

## VETO CONDITIONS

- Se nao tem as 4 informacoes obrigatorias → NAO executar, perguntar
- Se pecas nao tem conexao narrativa entre si → Reestruturar
- Se todos os formatos sao iguais → Diversificar
- Se serie nao tem progressao emocional → Adicionar arco
- Se tom nao e imperial → Reescrever
- Se calendario nao e praticavel (muito conteudo por dia) → Redistribuir

## OUTPUT EXAMPLE

```
SERIE: [Nome da Serie] — [Duracao]
TEMA: [tema central]
OBJETIVO: [objetivo]
ARCO: [descricao do arco narrativo]

DIA 1:
- Feed: [Carrossel tipo Imperial — "Hook do post"]
- Stories: [2 stories de bastidor + enquete]

DIA 2:
- Reels: [Roteiro 30s — hook + conteudo + CTA]
- Stories: [3 stories conectando ao reels]

DIA 3:
- Feed: [Post tipo Crenca — "Hook do post"]
- Stories: [Prints de comentarios + interacao]

[...]

DIA [N]:
- Feed: [Post tipo Oferta — CTA final]
- Stories: [Sequencia E4 de venda]
- Reels: [Video de prova/resultado]

CALENDARIO RESUMIDO:
| Dia | Feed | Stories | Reels |
|-----|------|---------|-------|
| 1   | X    | X       |       |
| 2   |      | X       | X     |
| ... |      |         |       |
```

## COMPLETION CRITERIA

- Serie completa com todas as pecas definidas
- Arco narrativo claro com progressao
- Mix de formatos (feed + stories + reels)
- Calendario editorial praticavel
- Conexao narrativa entre pecas
- Tom imperial consistente
- Score oraculo >= 80% em cada peca
- Cross-references entre pecas (stories mencionam post, reels complementam carrossel)

## Output Example

```
## SERIE DE CONTEUDO — "Semana da Autoridade"

Tema: Posicionamento premium | 5 pecas conectadas | Intencao: Consciencia → Aquecimento

| # | Formato | Titulo | Conexao |
|---|---------|--------|---------|
| 1 | Carrossel 10s | "Por que ninguem lembra de voce" | Abre a serie — gancho principal |
| 2 | Reels 30s | "O teste dos 3 segundos" | Referencia slide 1 do carrossel |
| 3 | Stories PAS (4) | "Seu perfil passa no teste?" | Enquete + link pro carrossel |
| 4 | Carrossel 7s | "3 pilares de um perfil que vende" | Solucao do problema da peca 1 |
| 5 | Reels CTA | "Aplica isso e me conta o resultado" | Fecha a serie com acao |

Narrativa: Problema (1-2) → Consciencia (3-4) → Acao (5)
Score medio oraculo: 85% | Cross-references: 4/5 pecas conectadas
```

references:
  - data/tipos-de-post.md
  - data/frameworks-copy.md
  - data/hooks-bank.md
  - data/posts-intencionais.md

### Veto Conditions

- id: "CONT_CREATE_CONTENT_SERIES_001"
  condition: "Tema central, avatar, objetivo e duracao nao fornecidos"
  check: "Verificar se as 4 informacoes obrigatorias estao presentes nos inputs"
  result: "VETO - BLOCK. Solicitar informacoes faltantes antes de iniciar planejamento da serie"
  rationale: "Serie sem tema e duracao definidos gera pecas sem conexao narrativa"

- id: "CONT_CREATE_CONTENT_SERIES_002"
  condition: "Pecas da serie sem conexao narrativa entre si"
  check: "Verificar se cada peca referencia ou avanca o arco narrativo das anteriores"
  result: "VETO - BLOCK. Reestruturar serie com fio condutor e cross-references entre pecas"
  rationale: "Serie desconectada e apenas posts avulsos — o diferencial e a narrativa progressiva"

### Completion Criteria

- [ ] Serie completa com arco narrativo claro (inicio → meio → climax → resolucao)
- [ ] Mix de formatos (feed + stories + reels) com calendario editorial praticavel
- [ ] Conexao narrativa entre pecas verificada (cross-references explicitas)
- [ ] Score oraculo >= 80% em cada peca com tom imperial consistente
