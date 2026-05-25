# Criar Story Direto - Levantada de Mao (E6)

name: create-levantada-mao
executor: stories-strategist
description: Criar 1 story poderoso para gerar lead qualificado imediato com chamada especifica (Estrategia E6 - Story Direto)
elicit: true
pre_conditions:
  - Nucleo e regras inviolaveis carregados de data/
  - Categorias de stories disponiveis em data/stories-categorias.md
  - Banco de CTAs e hooks disponiveis em data/

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

- **O que voce vende:** mentoria, servico ou produto (obrigatorio)
- **Para quem:** publico especifico com detalhe (obrigatorio)
- **Resultado mensuravel:** o que o lead vai conseguir (obrigatorio)
- **Prazo:** em quantos dias/semanas (obrigatorio)
- **Numero de vagas:** quantidade limitada (default: 3-5)
- **Ativo que o lead ja tem:** audiencia, experiencia, lista (opcional)

## STEPS

1. Coletar as 4 informacoes obrigatorias
2. Montar estrutura do template universal: PROCURO [N] [publico] que querem [resultado] nos proximos [prazo]
3. Adicionar linha de promessa estrategica: "Vou te mostrar como [promessa]"
4. Definir palavra-chave de resposta (ex: EU QUERO, ESCALAR, QUERO)
5. Criar CTA final com instrucao clara
6. Gerar 3 variacoes para o usuario escolher
7. Validar pelo oraculo (concisao, especificidade, tom)
8. Entregar story final formatado

## VETO CONDITIONS

- Se nao tem as 4 informacoes obrigatorias → NAO executar, perguntar
- Se story tem mais de 5 linhas → Reescrever mais conciso
- Se nao tem numero especifico de vagas → Adicionar (3-5)
- Se nao tem prazo especifico → Perguntar ou sugerir (30-60 dias)
- Se resultado nao e mensuravel ("melhorar", "crescer") → Tornar especifico
- Se palavra-chave nao esta definida → Definir
- Se parece generico/aplicavel a qualquer nicho → Reescrever com especificidade

## OUTPUT EXAMPLE

```
VARIACAO 1 (Para Mentores):
"PROCURO 4 pessoas que querem vender 10 mentorias de R$ 5k nos proximos 60 dias, usando so a audiencia que ja tem.
Vou te mostrar como estruturar oferta que gera desejo imediato.
Responde com EU QUERO que te passo os bastidores."

VARIACAO 2 (Para Empresarios):
"PROCURO 2 empresarios que querem escalar para R$ 100k/mes nos proximos 45 dias, sem aumentar time ou criar produtos.
Vou te mostrar como simplificar oferta e vender todos os dias.
Responde com ESCALAR e eu te mando os detalhes."

VARIACAO 3 (Para [nicho do usuario]):
[Adaptacao especifica com dados coletados]
```

## COMPLETION CRITERIA

- 3 variacoes do story para escolha do usuario
- Cada variacao segue template universal (PROCURO + resultado + prazo + CTA)
- Palavra-chave definida e destacada
- Numero de vagas especifico (escassez)
- Resultado mensuravel (nao generico)
- Tom imperial e direto
- Score oraculo >= 80%

## Output Example

```
## LEVANTADA DE MAO — Programa Autoridade Absoluta

Publico: Mentores digitais 5-15k/mes | Formato: Story direto (E6)

CONTEXTO:
"Nos ultimos 6 meses, 47 mentores aplicaram esse sistema
e pararam de depender de lancamento."

FILTRO (Qualificacao):
"Mas nao e pra todo mundo. E pra quem:
- Ja tem resultado com clientes
- Fatura pelo menos 5k/mes
- Quer escalar sem trabalhar mais horas"

ESCASSEZ:
"Abro 10 vagas por trimestre. Esse trimestre: 3 restantes."

CTA:
"Se voce se encaixa, comenta EU QUERO que eu mando
os detalhes no privado."

Score Oraculo: 88% | Tipo: Levantada de mao com filtro qualificador
```

references:
  - data/stories-categorias.md
  - data/cta-bank.md
  - data/hooks-bank.md

### Veto Conditions

- id: "CONT_CREATE_LEVANTADA_MAO_001"
  condition: "Oferta e publico-alvo nao fornecidos"
  check: "Verificar se as 4 informacoes obrigatorias estao presentes (oferta, publico, resultado, prazo)"
  result: "VETO - BLOCK. Solicitar informacoes faltantes antes de criar story"
  rationale: "Levantada de mao sem oferta clara gera leads desqualificados"

- id: "CONT_CREATE_LEVANTADA_MAO_002"
  condition: "Resultado nao e mensuravel (generico como melhorar ou crescer)"
  check: "Verificar se resultado tem numero, prazo e especificidade"
  result: "VETO - BLOCK. Tornar resultado especifico com metricas antes de gerar variacoes"
  rationale: "Resultado vago nao gera urgencia — precisa de numero concreto para converter"

### Completion Criteria

- [ ] 3 variacoes do story entregues com template universal (PROCURO + resultado + prazo + CTA)
- [ ] Palavra-chave definida e destacada com numero de vagas especifico (escassez)
- [ ] Resultado mensuravel e tom imperial direto em todas as variacoes
- [ ] Score oraculo >= 80% validado
