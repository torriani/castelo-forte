# Criar Stories de Venda Direta (E4)

name: create-stories-venda
executor: stories-strategist
description: Criar sequencia de 5 stories para venda direta (Estrategia E4 - Caixa Rapido)
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Categorias de stories disponiveis em data/stories-categorias.md
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

- **O que voce vende:** mentoria, produto ou servico (obrigatorio)
- **Para quem:** avatar com especificidade minima (obrigatorio)
- **Qual dor real:** dor que o avatar sente hoje (obrigatorio)
- **Qual transformacao entrega:** resultado mensuravel (obrigatorio)
- **Prints/provas disponiveis:** screenshots, depoimentos (opcional)

## STEPS

1. Coletar as 4 informacoes obrigatorias (uma por vez se necessario)
2. Criar Story 1 (Antecipacao): Gancho provocativo + enquete que gera identificacao
3. Criar Story 2 (Autoridade): Prints + provas sociais que comprovam resultado
4. Criar Story 3 (Qualificacao): Enquete de investimento para filtrar curiosos
5. Criar Story 4 (Qualificacao Avancada): Confirmar comprometimento real
6. Criar Story 5 (Oferta): CTA direto com palavra-chave especifica
7. Validar pelo oraculo (tom imperial, concisao, coerencia)
8. Entregar sequencia completa formatada com notas de execucao

## VETO CONDITIONS

- Se nao tem as 4 informacoes obrigatorias → NAO executar, perguntar
- Se qualquer story tem mais de 3 linhas de texto → Reescrever
- Se CTA nao tem palavra-chave definida → Reescrever
- Se tom nao e imperial (parece generico/educativo) → Reescrever
- Se enquetes nao tem opcoes polarizadoras → Reescrever
- Se sequencia nao tem progressao emocional clara → Reestruturar

## OUTPUT EXAMPLE

```
STORY 1 (ANTECIPACAO):
"Voce ja sentiu que faz tudo certo mas nao vende? Conta pra mim."
[Enquete: Sim / Nao]

STORY 2 (AUTORIDADE):
[Print de resultado]
"Isso aconteceu depois de aplicar 1 mudanca. UMA."

STORY 3 (QUALIFICACAO):
"Se existisse algo que resolve isso em 30 dias, voce investiria?"
[Enquete: Sim, quero / Nao agora]

STORY 4 (QUALIFICACAO AVANCADA):
"Voce dedica 1h por dia pra mudar isso?"
[Enquete: Sim / Talvez]

STORY 5 (OFERTA):
"Abrindo 5 vagas. Responde EU QUERO que te explico."
```

## COMPLETION CRITERIA

- 5 stories completos com texto e enquetes/stickers
- Palavra-chave definida pro CTA final
- Tom imperial consistente em toda sequencia
- Progressao emocional: curiosidade → prova → filtro → comprometimento → acao
- Score oraculo >= 80%
- Metricas esperadas informadas (200+ views = funcional, 2-5% conversao)

## Output Example

```
## STORIES VENDA DIRETA (E4) — "Caixa Rapido Autoridade Absoluta"

Formato: 5 stories | Intencao: Venda direta | Oferta: Programa Autoridade Absoluta

STORY 1 (Gancho):
"Se voce fatura menos de 15k como mentor, a culpa nao e do mercado."

STORY 2 (Prova):
Print de resultado: "Esse mentor saiu de 8k pra 32k em 60 dias.
Sem trafego pago. Sem equipe."

STORY 3 (Oferta):
"O Programa Autoridade Absoluta abre 5 vagas hoje.
90 dias. Sistema completo. Acompanhamento semanal."

STORY 4 (Escassez):
"Ultima turma lotou em 48h. Essa vai ser igual."
Contagem regressiva: 24h

STORY 5 (CTA):
"Link na bio. Ou responde esse story com EU QUERO."

Score Oraculo: 86% | Meta: 200+ views, 2-5% conversao
Notas: postar as 11h (pico de audiencia), usar sticker link direto
```

references:
  - data/stories-categorias.md
  - data/cta-bank.md
  - data/regras-inviolaveis.md
  - data/oraculo-posts.md

### Veto Conditions

- id: "CONT_CREATE_STORIES_VENDA_001"
  condition: "Briefing da oferta nao fornecido (oferta, publico, dor, transformacao)"
  check: "Verificar se as 4 informacoes obrigatorias estao presentes nos inputs"
  result: "VETO - BLOCK. Solicitar informacoes faltantes antes de criar stories de venda"
  rationale: "Stories de venda sem oferta e dor claras geram CTA sem direcao"

- id: "CONT_CREATE_STORIES_VENDA_002"
  condition: "Palavra-chave de CTA nao definida para o story final"
  check: "Verificar se existe palavra-chave especifica no CTA do story 5"
  result: "VETO - BLOCK. Definir palavra-chave antes de finalizar sequencia"
  rationale: "Sem palavra-chave, nao ha como rastrear leads qualificados via DM"

### Completion Criteria

- [ ] 5 stories completos com progressao: curiosidade → prova → filtro → comprometimento → acao
- [ ] Palavra-chave definida e tom imperial consistente em toda sequencia
- [ ] Enquetes polarizadoras nos stories de qualificacao (3 e 4)
- [ ] Score oraculo >= 80% com metricas esperadas informadas
