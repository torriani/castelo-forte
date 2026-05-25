# Criar Campanha Multi-Formato

name: create-campaign
executor: content-chief
description: Criar campanha completa com carrossel + reels + stories integrados em torno de um tema central, com briefing, criacao por formato, validacao cruzada e entrega unificada
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Tipos de post e frameworks de copy disponiveis em data/
  - Categorias de stories disponiveis em data/stories-categorias.md
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

- **Tema central:** assunto principal da campanha (obrigatorio)
- **Publico-alvo:** avatar com especificidade (obrigatorio)
- **Objetivo da campanha:** Atracao / Consciencia / Aquecimento / Venda (obrigatorio)
- **Duracao:** quantos dias a campanha roda — 3, 5 ou 7 dias (obrigatorio)
- **Oferta relacionada:** produto, mentoria ou servico (opcional)
- **Formatos desejados:** quais formatos incluir — default: carrossel + reels + stories (opcional)
- **Prints/provas:** depoimentos, resultados, screenshots (opcional)
- **Crenca a destruir:** qual crenca do mercado atacar (opcional)

## STEPS

1. Coletar as 4 informacoes obrigatorias — perguntar o que faltar
2. Definir briefing estrategico:
   - Narrativa central da campanha (fio condutor)
   - Progressao emocional ao longo dos dias
   - Papel de cada formato no funil (carrossel = autoridade, reels = alcance, stories = conversao)
3. Montar cronograma dia-a-dia com formatos distribuidos:
   - Dia 1: despertar dor (carrossel problema + stories bastidores)
   - Dia 2: amplificar problema (reels hook forte + stories insights)
   - Dia 3: novo paradigma (carrossel imperial + stories cases)
   - Dia 4: prova social (reels testemunho + stories caixinha)
   - Dia 5: oferta/CTA (carrossel oferta + stories levantada de mao)
   - Ajustar para 3 ou 7 dias conforme duracao
4. Criar carrossel(is) — usar task create-carousel internamente
5. Criar roteiro(s) de reels — hook + desenvolvimento + CTA
6. Criar sequencia(s) de stories — usar categorias de stories-categorias.md
7. Validar coerencia cruzada: tom, mensagem e progressao emocional consistentes entre formatos
8. Validar cada peca pelo oraculo (posts para carrosseis, niveis 1-3 para reels)
9. Se alguma peca < 80% → reescrever e re-validar
10. Entregar campanha completa no formato padrao

## VETO CONDITIONS

- Se nao tem as 4 informacoes obrigatorias → NAO executar, perguntar
- Se campanha tem menos de 2 formatos → NAO e campanha, e post individual (usar task especifica)
- Se narrativa central nao conecta os formatos → Refazer briefing com fio condutor
- Se tom varia entre pecas (imperial num, educativo noutro) → Padronizar tom imperial
- Se cronograma nao tem progressao emocional clara → Reestruturar (dor → paradigma → prova → acao)
- Se stories nao tem intencao estrategica → Reestruturar com categorias
- Se alguma peca score < 80% no oraculo → Reescrever ate atingir
- Se entregou teoria em vez de pecas prontas → Reescrever com execucao pratica

## OUTPUT EXAMPLE

```
CAMPANHA: Posicionamento Imperial — 5 dias
OBJETIVO: Aquecimento para lancamento de mentoria
PUBLICO: Empreendedores digitais 25-40 que faturam 5-15k/mes
NARRATIVA CENTRAL: "Voce nao tem problema de conteudo. Tem problema de posicionamento."

CRONOGRAMA:

DIA 1 — DESPERTAR DOR
Carrossel (Imperial, 10 slides): "95% dos empreendedores digitais estao INVISÍVEIS pro comprador certo."
Stories (Posicionamento + Insights): 3 stories provocando reflexao sobre visibilidade

DIA 2 — AMPLIFICAR PROBLEMA
Reels (45s): "Voce posta todo dia e ninguem compra? O problema nao e o conteudo..."
Stories (Bastidores): 4 stories mostrando metodo por tras do posicionamento

DIA 3 — NOVO PARADIGMA
Carrossel (Crenca, 7 slides): "Pare de criar conteudo. Comece a criar COMANDO."
Stories (Cases): 3 stories com prints de resultados de clientes

DIA 4 — PROVA SOCIAL
Reels (30s): Case do cliente que saiu de 3k pra 47k em 60 dias
Stories (Caixinha): "Me pergunte sobre posicionamento" + respostas direcionadas

DIA 5 — OFERTA
Carrossel (Oferta, 10 slides): "PROCURO 10 empreendedores que querem instalar posicionamento imperial."
Stories (Levantada de mao): "Responde IMPERIAL se quer saber mais" + escassez real

TOTAL DE PECAS: 2 carrosseis + 2 reels + 5 sequencias de stories
SCORE ORACULO: Todas as pecas >= 80%
```

## COMPLETION CRITERIA

- Briefing estrategico com narrativa central e progressao emocional
- Cronograma dia-a-dia com formatos distribuidos
- Todas as pecas criadas (carrosseis + reels + stories)
- Tom imperial consistente em todas as pecas
- Coerencia cruzada entre formatos validada
- Score oraculo >= 80% em cada peca
- Entrega no formato padrao (nome, objetivo, publico, narrativa, cronograma, pecas, score)

## Output Example

```
## CAMPANHA — "Cobrar Barato e Autossabotagem"

Objetivo: Aquecimento | Publico: Mentores digitais 5-15k/mes
Duracao: 5 dias | Oferta: Programa Autoridade Absoluta

### Narrativa Central
Dia 1-2: Problema (mentor que trabalha demais e fatura pouco)
Dia 3-4: Consciencia (o erro esta no posicionamento, nao no trafego)
Dia 5: Transicao para oferta

### Cronograma
| Dia | Carrossel | Reels | Stories |
|-----|----------|-------|---------|
| 1 | Imperial 10s: "Por que mentor cobra barato" | — | Bastidores: caso real |
| 2 | — | Hook 30s: "Cobrar barato e generosidade?" | PAS: 4 stories |
| 3 | Crenca 7s: "Mais conteudo = mais venda?" | — | Enquete: voce cobra quanto |
| 4 | — | Storytelling 45s: caso de transformacao | Prova social: prints |
| 5 | Oferta 10s: Autoridade Absoluta | CTA direto 15s | Venda: 5 stories sequenciais |

Score medio oraculo: 86% | Pecas totais: 12
```

## REFERENCES

- data/tipos-de-post.md — tipos de carrossel e estruturas
- data/frameworks-copy.md — frameworks de copy para carrosseis
- data/stories-categorias.md — 7 categorias de stories com funcao no funil
- data/oraculo-posts.md — validacao de carrosseis
- tasks/create-carousel.md — task de criacao de carrossel
- tasks/create-stories.md — task de criacao de stories

### Veto Conditions

- id: "CONT_CREATE_CAMPAIGN_001"
  condition: "Briefing do conteudo nao fornecido (tema, publico, objetivo, duracao)"
  check: "Verificar se as 4 informacoes obrigatorias estao presentes nos inputs"
  result: "VETO - BLOCK. Solicitar informacoes faltantes antes de iniciar planejamento"
  rationale: "Campanha sem briefing gera pecas desconectadas e sem narrativa central"

- id: "CONT_CREATE_CAMPAIGN_002"
  condition: "Campanha com menos de 2 formatos diferentes"
  check: "Verificar se o plano inclui carrossel + reels + stories ou pelo menos 2 formatos"
  result: "VETO - BLOCK. Redirecionar para task especifica do formato se for peca individual"
  rationale: "Campanha multi-formato e o diferencial desta task — formato unico usa task propria"

### Completion Criteria

- [ ] Cronograma dia-a-dia com formatos distribuidos e narrativa central definida
- [ ] Todas as pecas criadas (carrosseis + reels + stories) com tom imperial consistente
- [ ] Score oraculo >= 80% em cada peca individual da campanha
- [ ] Coerencia cruzada entre formatos validada (mensagem, tom e progressao emocional)
