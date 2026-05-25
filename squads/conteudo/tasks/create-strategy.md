# Executar Estrategia de Conteudo (E1-E8)

name: create-strategy
executor: strategist
description: Identificar a intencao do usuario e executar a estrategia correta (E1 a E8) com cronograma completo, templates de feed e stories
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Estrategias E1-E8 disponiveis em data/estrategias.md
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

- **O que voce vende:** mentoria, produto ou servico (obrigatorio)
- **Para quem:** avatar especifico (obrigatorio)
- **Qual dor real:** problema principal do avatar (obrigatorio)
- **Qual transformacao entrega:** resultado mensuravel (obrigatorio)
- **Intencao:** o que quer alcancar — vender, gerar leads, doutrinar, validar (obrigatorio)
- **Prints/provas:** depoimentos, resultados, screenshots (opcional)
- **Prazo:** em quantos dias quer executar (opcional)

## STEPS

1. Coletar as 4 informacoes obrigatorias + intencao
2. Usar Decisor Estrategico Automatico para identificar estrategia:
   - Vender produto/mentoria → E1 (Lancamento de Pressao)
   - Gerar leads para evento → E2 (Isca Magnetica)
   - Doutrinar/virar autoridade → E3 (Doutrina Silenciosa)
   - Conversao imediata/rapida → E4 (Stories Venda Direta)
   - Campanha completa feed+stories → E5 (Feed de Guerra Visual)
   - Lead qualificado especifico → E6 (Story Direto)
   - Validar mentoria → E7 (Stories PAS)
   - Funil pressao progressiva → E8 (Stories Funil Pressao)
3. Confirmar estrategia selecionada com o usuario
4. Executar cronograma completo da estrategia com templates personalizados
5. Gerar templates de Feed (quando aplicavel)
6. Gerar templates de Stories (quando aplicavel)
7. Validar pelo oraculo cada peca gerada
8. Entregar pacote completo no formato padrao

## VETO CONDITIONS

- Se nao tem as 4 informacoes obrigatorias → NAO executar, perguntar
- Se intencao e ambigua e nao permite identificar estrategia → Perguntar (max 2 perguntas)
- Se usuario pede algo que nao se encaixa em E1-E8 → Sugerir a mais proxima e confirmar
- Se templates nao seguem tom imperial → Reescrever
- Se cronograma nao tem dia-a-dia detalhado → Completar
- Se entregou teoria em vez de templates prontos → Reescrever com execucao pratica

## OUTPUT EXAMPLE

```
ESTRATEGIA IDENTIFICADA: E1 — LANCAMENTO DE PRESSAO (5 dias)
OBJETIVO: Vender [produto] com pressao emocional crescente
FORMATO: Feed + Stories integrados

CRONOGRAMA:

DIA 1 — DESPERTAR DOR
Feed: [template personalizado tipo Problema/Imperial]
Stories: [pergunta desconfortavel + enquete]

DIA 2 — PROBLEMA COMUM
Feed: [template personalizado tipo Crenca]
Stories: [prints de respostas + identificacao]

DIA 3 — SOLUCAO EXISTE
Feed: [template personalizado tipo Historia]
Stories: [bastidor + antes/depois]

DIA 4 — MOVIMENTO
Feed: [template personalizado tipo Oferta]
Stories: [tour do grupo + prints]

DIA 5 — OFERTA FINAL
Feed: [template personalizado tipo Oferta]
Stories: [prova final + CTA direto]

PROXIMOS PASSOS: Adaptar → Executar → Monitorar → Ajustar
```

## COMPLETION CRITERIA

- Estrategia correta identificada pela intencao
- Cronograma dia-a-dia completo com templates personalizados
- Templates de Feed prontos para usar (quando aplicavel)
- Templates de Stories prontos para usar (quando aplicavel)
- Tom imperial em todas as pecas
- Score oraculo >= 80% em cada peca
- Formato de entrega padrao seguido (nome, objetivo, formato, cronograma, templates, proximos passos)

## Output Example

```
## ESTRATEGIA E3 — "Semana de Autoridade"

Objetivo: Consciencia → Aquecimento | Publico: Mentores digitais
Duracao: 7 dias | Oferta: Programa Autoridade Absoluta

### Cronograma
| Dia | Feed | Stories | Objetivo |
|-----|------|---------|----------|
| 1 (Seg) | Carrossel Imperial 10s | Bastidores 3 stories | Atrair atencao |
| 2 (Ter) | — | PAS 4 stories | Gerar consciencia |
| 3 (Qua) | Reels Hook 30s | Enquete 2 stories | Engajamento |
| 4 (Qui) | Carrossel Crenca 7s | Prova social 3 stories | Quebrar objecao |
| 5 (Sex) | — | StoryAd casual | Tensao subliminar |
| 6 (Sab) | Reels Storytelling 45s | Bastidores 2 stories | Conexao |
| 7 (Dom) | Carrossel Oferta 10s | Venda direta 5 stories | Conversao |

### Resumo
- Feed: 5 pecas (3 carrosseis + 2 reels)
- Stories: 22 stories distribuidos
- Proporcao: 50% consciencia / 25% aquecimento / 25% venda

### Proximos Passos
1. Criar pecas com *create-carousel e *create-reels
2. Validar cada peca com *validate-content
3. Publicar conforme cronograma
```

references:
  - data/estrategias.md
  - data/tipos-de-post.md
  - data/frameworks-copy.md
  - data/oraculo-posts.md

### Veto Conditions

- id: "CONT_CREATE_STRATEGY_001"
  condition: "Briefing do conteudo nao fornecido (oferta, publico, dor, transformacao, intencao)"
  check: "Verificar se as 5 informacoes obrigatorias estao presentes nos inputs"
  result: "VETO - BLOCK. Solicitar informacoes faltantes antes de identificar estrategia"
  rationale: "Sem briefing completo, o Decisor Estrategico nao consegue selecionar E1-E8 corretamente"

- id: "CONT_CREATE_STRATEGY_002"
  condition: "Intencao ambigua que nao permite identificar estrategia E1-E8"
  check: "Verificar se intencao esta clara o suficiente para mapear a estrategia correta"
  result: "VETO - BLOCK. Perguntar (max 2 perguntas) para desambiguar intencao antes de prosseguir"
  rationale: "Estrategia errada gera cronograma desalinhado com objetivo do usuario"

### Completion Criteria

- [ ] Estrategia correta identificada pelo Decisor Estrategico (E1-E8) e confirmada pelo usuario
- [ ] Cronograma dia-a-dia completo com templates personalizados de Feed e Stories
- [ ] Todas as pecas com tom imperial e score oraculo >= 80%
- [ ] Formato de entrega padrao seguido (nome, objetivo, formato, cronograma, templates, proximos passos)
