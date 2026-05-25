# PADRÃO ANTI-IA CASTELO FORTE — Documento Mestre

> **O quê é isto:** o guia operacional completo do filtro anti-IA Castelo Forte. Quem precisa criar conteúdo, validar conteúdo, replicar o filtro em novo squad, ou atualizar o filtro com feedback novo lê este documento.
>
> **Versão do filtro coberta:** 3.7 (24/05/2026 — v3.5 corrigiu regra de hook + adicionou Cena viva (§29); v3.6 adicionou regra "nota 10 ou refaz" + auto-suficiência semântica (§30); v3.7 adicionou §23.6-§23.10 com fingerprints PT-BR de pesquisa externa Wikipedia + Bloomberry)
>
> **IMPORTANTE:** Este filtro é UNIVERSAL — ELIMINA cheiro de IA. Não molda como expert específico. Moldagem (voice profile do operador, Halbert, etc) é etapa SEPARADA, fora deste filtro.
>
> **Quem deve ler:**
> - Todo agente que escreve texto (`copy-chief`, `content-chief`, `carousel-creator`, `reels-creator`, `imperador`, etc)
> - Todo humano do squad que produz, revisa ou aprova copy
> - Quem for criar squad novo que produz texto
> - Quem for criar skill nova de validação

---

## 1. ARQUITETURA — Onde mora o quê

```
legacy/squads/conteudo/
├── checklists/
│   ├── filtro-anti-ia.md          ← FONTE CANÔNICA v3.7
│   ├── PADRAO-ANTI-IA.md          ← este documento (v1.1)
│   └── examples/                   ← suite de regressão
│       ├── reprovado-cr01-negation-pivot.md
│       ├── reprovado-anafora-corte.md
│       ├── aprovado-pt031-cliente-reclama.md
│       └── aprovado-teddy-pai-de-familia.md
├── scripts/
│   ├── validate-anti-ia.sh         ← validador de frases & fingerprints PT-BR (cobre §1, §2)
│   ├── anti-ia-structural.mjs      ← validador estrutural + denylist expandida (cobre §3, §15, §17, §18, §23) + audit trail (§27)
│   └── anti-ia-pre-approval.mjs    ← hook pre-aprovação pro CRM
├── audit-log.yaml                  ← trilha de auditoria de toda validação (§27) — GITIGNORED
├── agents/
│   └── content-validator.md        ← agente que orquestra Layer 0/1/2 (Tier 2 do squad)
├── data/
│   └── cliches-proibidos.md        ← lista de exclusão (referenciada pelo §1 do filtro)
└── config.yaml                     ← registra que filtro-anti-ia.md é enforced_by

legacy/squads/copy/
├── checklists/
│   ├── filtro-anti-ia.md          ← REFERÊNCIA ao canonical do conteudo
│   └── oraculo-castelo-forte.md        ← atualizado com Layer 0 obrigatório
└── config.yaml                     ← v5.1.0 registra integração

~/.claude/skills/anti-ia/
└── SKILL.md                        ← skill global /anti-ia (workflow 4 fases: regex → LLM 5 dim → refine → audit)
```

## 2. AS 4 CAMADAS DE VALIDAÇÃO

Ordem não negociável. **Falhou na camada N, NÃO avança pra N+1.**

```
┌────────────────────────────────────────────────────────────────────┐
│ LAYER 0 — FILTRO ANTI-IA UNIVERSAL                                 │
│   Aplicado a TODO texto, em TODO formato, pra TODO cliente.        │
│   Fonte canônica: squads/conteudo/checklists/filtro-anti-ia.md     │
│   Enforcement automatizado:                                        │
│     1. validate-anti-ia.sh    → frases proibidas + fingerprints    │
│     2. anti-ia-structural.mjs → estrutura + denylist regex         │
│   Enforcement LLM:                                                 │
│     3. content-validator (squad conteudo) ou oraculo-castelo-forte      │
│        (squad copy) — avalia §4-§14, §16, §19                      │
│   Severidade: VETO BLOQUEANTE (1 violação = reprovação)            │
└──────────────────────┬─────────────────────────────────────────────┘
                       ↓ APROVADO em Layer 0
┌────────────────────────────────────────────────────────────────────┐
│ LAYER 1 — VALIDADOR DE FORMATO                                     │
│   Squad conteudo: oraculo-posts (carrosseis) ou oraculo-reels      │
│   Squad copy:     oraculo-castelo-forte (38 clichês + RU + RA + master) │
│   Threshold: 80% (score < 80 = refaz)                              │
└──────────────────────┬─────────────────────────────────────────────┘
                       ↓ APROVADO em Layer 1
┌────────────────────────────────────────────────────────────────────┐
│ LAYER 2 — TOM DE VOZ CASTELO FORTE                                      │
│   data/nucleo.md (conteudo) ou data/premissa-core.md (copy)        │
│   Calibragem de voz, posicionamento, inimigo claro                 │
└──────────────────────┬─────────────────────────────────────────────┘
                       ↓ APROVADO em Layer 2
┌────────────────────────────────────────────────────────────────────┐
│ LAYER 3 — CONTEXTO DO CLIENTE ATIVO                                │
│   workspace/businesses/{cliente}/                                  │
│   Brandbook, ICP, offerbook, vocabulário do avatar                 │
└────────────────────────────────────────────────────────────────────┘
```

**Pontos críticos:**
- Layer 0 é o ÚNICO universal — aplica a qualquer cliente.
- Layer 1 muda por formato (carrossel ≠ reels ≠ tweet ≠ VSL).
- Layer 2 e 3 mudam por cliente (Castelo Forte ≠ outro mentor).
- Validadores regex ficam em Layer 0 mas **rodam antes** das LLMs pra economizar token e dar feedback instantâneo.

## 3. FLUXO DE UM CONTEÚDO DO ZERO ATÉ APROVAÇÃO

```
1. Agente recebe briefing
   ↓
2. CAMADA 1 (durante escrita): Ler filtro-anti-ia.md ANTES de gerar
   Aplicar §1, §2, §3 desde a primeira frase do rascunho
   Não produzir rascunho sujo pra limpar depois
   ↓
3. Agente gera output
   ↓
4. CAMADA 2 — Validador automático regex (rápido, instantâneo)
   ./scripts/validate-anti-ia.sh output.md
   node ./scripts/anti-ia-structural.mjs output.md
   ↓
   ├─ REPROVADO → volta ao agente com lista de violações (loop max 2)
   └─ APROVADO → segue
   ↓
5. CAMADA 3 — content-validator / oraculo-castelo-forte (LLM, mais lento)
   Avalia §4-§14, §16, §19, §29, §30 e §23.6-§23.10 do filtro v3.7
   + Layer 1 (oraculo de formato) + Layer 2 (tom) + Layer 3 (cliente)
   ↓
   ├─ overall_score < 100 → refine loop (max 3 iter, regra "nota 10 ou refaz" v3.6)
   └─ overall_score = 100 → segue (Layer 1/2 ainda exigem 80%)
   ↓
6. CAMADA 4 — Hook pre-aprovação CRM
   node ./scripts/anti-ia-pre-approval.mjs --content-id X --content-file Y
   ↓
   ├─ BLOCKED → devolve ao autor com author-feedback
   └─ APPROVED → entra na fila de aprovação humana
   ↓
7. Operador aprova / refaz / reprova
```

## 4. COMO REPLICAR EM OUTRO SQUAD

Para acoplar o filtro anti-IA em um squad novo que produza texto (ex: brand, hormozi, imperador, movement):

### Passo 1 — Criar referência ao canônico

`squads/{novo-squad}/checklists/filtro-anti-ia.md` deve ser uma **referência curta** ao canonical, NÃO uma cópia. Usar template:

```markdown
<!--
checklist_id: filtro-anti-ia
version: 3.5
type: reference
canonical_source: legacy/squads/conteudo/checklists/filtro-anti-ia.md
applies_to:
  - {agente-1}
  - {agente-2}
  ...
enforced_by: {validador-do-squad} (Layer 0)
severity: VETO_BLOCKING
-->

# FILTRO ANTI-IA — Squad {nome}

> Referência ao canônico. Sempre ler o canônico completo antes de gerar.

[restante: tabela de cobertura, ordem de aplicação, agentes aplicáveis]
```

### Passo 2 — Integrar com o validador do squad

Se o squad tem validador próprio (igual `oraculo-castelo-forte.md` do copy ou `content-validator.md` do conteudo):

1. Adicionar bloco "⚠️ LAYER 0 OBRIGATÓRIO ANTES DESTE ORÁCULO" no topo do validador
2. Apontar pro canonical do conteudo
3. Listar os 2 validadores executáveis com path absoluto

Se o squad NÃO tem validador, criar um agente Tier 2 chamado `{nome}-validator` análogo ao `content-validator`.

### Passo 3 — Amarrar nos workflows

Editar todos os `workflows/wf-*.yaml` que produzem texto pra incluir:

```yaml
pre_requisites:
  - "OBRIGATORIO: Agente LE checklists/filtro-anti-ia.md antes de gerar (Camada 1)"
  - "OBRIGATORIO: Aplicar filtro DURANTE a escrita, nunca rascunho sujo"

quality_gates:
  - id: QG_AI_001
    name: Filtro Anti-IA Layer 0
    severity: BLOCKING
    check: "Zero violações em validate-anti-ia.sh + anti-ia-structural.mjs"
    action_on_fail: "Devolver pro agente com trechos exatos marcados. NÃO publicar."
```

### Passo 4 — Atualizar config.yaml do squad

```yaml
changelog:
  v{N}.{M}.{P} (data): "Integração com Filtro Anti-IA Universal v3.7 (squad conteudo) como Layer 0 obrigatório. Threshold PASS 100/100."

description: "[descrição atual] Validação OBRIGATÓRIA: Filtro Anti-IA Layer 0 + [validadores próprios]."
```

### Passo 5 — Atualizar agentes do squad

Cada `agents/*.md` que escreve texto precisa, no bloco "Dados que Consulta", listar:

```markdown
- `legacy/squads/conteudo/checklists/filtro-anti-ia.md` (Layer 0 universal — sempre antes do oráculo do squad)
```

E na seção de outputs:

```markdown
Antes de retornar qualquer output:
1. Rodar validate-anti-ia.sh + anti-ia-structural.mjs no rascunho
2. Se reprovar, refazer (não retornar pro operador com violações abertas)
```

## 5. COMO ATUALIZAR QUANDO APARECER FEEDBACK NOVO

Quando o operador ou qualquer revisor reprovar conteúdo que o filtro aprovou:

### Passo 1 — Capturar o exemplo

Salvar em `legacy/squads/conteudo/checklists/examples/reprovado-{slug}.md` com:
- Texto exato reprovado
- Quem reprovou (revisor externo, operador, etc)
- Data
- Razão da reprovação (citação literal se possível)

### Passo 2 — Diagnosticar o gap

Pergunta sequencial:
1. **Existe padrão regex que pegaria isso?** Se sim, adicionar ao `.sh` ou `.mjs` correspondente.
2. **É padrão estrutural só pegável por LLM?** Se sim, adicionar nova seção §N ao `filtro-anti-ia.md` com regra clara.
3. **É frase específica?** Se sim, adicionar ao §1 (frases proibidas) ou `data/cliches-proibidos.md`.
4. **É fingerprint PT-BR novo?** Se sim, adicionar ao §2.

### Passo 3 — Atualizar o canônico

Editar `legacy/squads/conteudo/checklists/filtro-anti-ia.md`:
- Bumpar versão no topo conforme a próxima revisão semântica do filtro
- Adicionar entrada no changelog com data + razão + origem do feedback
- Inserir a nova regra/seção

### Passo 4 — Atualizar validadores (se aplicável)

Se o gap pode virar regra automática:
- Adicionar regex em `scripts/anti-ia-structural.mjs` (em `RULES`) ou `scripts/validate-anti-ia.sh` (chamada `report`)

### Passo 5 — Re-rodar suite de regressão

```bash
cd legacy/squads/conteudo
for f in checklists/examples/aprovado-*.md; do
  echo "Testing $f (should APPROVE):"
  node scripts/anti-ia-structural.mjs "$f"
done
for f in checklists/examples/reprovado-*.md; do
  echo "Testing $f (should REJECT):"
  node scripts/anti-ia-structural.mjs "$f"
done
```

Se algum aprovado virar reprovado, ou algum reprovado virar aprovado, ajustar a regra.

### Passo 6 — Comunicar squad e propagações

- Avisar agentes do squad conteudo (relendo o filtro)
- Squad copy automaticamente herda (referência canônica)
- Outros squads que referenciam herdam
- Notificar operador da mudança de versão

## 6. COMO O FILTRO CONVERSA COM TOM DE VOZ DO CLIENTE

**Filtro Anti-IA ≠ Tom de Voz.** Os dois são complementares.

| Aspecto | Filtro Anti-IA | Tom de Voz Cliente |
|---------|----------------|---------------------|
| **Função** | ELIMINA o que não pode aparecer | MOLDA o que tem que aparecer |
| **Escopo** | Universal (todo cliente) | Específico do cliente |
| **Versionamento** | Único arquivo canônico | Um por cliente |
| **Localização** | `squads/conteudo/checklists/filtro-anti-ia.md` | `data/nucleo.md` (Castelo Forte), `workspace/businesses/{X}/brand/messaging-framework.yaml` |
| **Aplicação** | Layer 0 (primeiro) | Layer 2 (depois do oráculo de formato) |
| **Severidade** | Veto bloqueante | Direção positiva |

**Regra do Lembrete Final §13:**
> Filtro Anti-IA ELIMINA o que não pode aparecer. Tom de Voz MOLDA o que tem que aparecer. Use os dois.

## 7. INSTALAÇÃO DA SKILL GLOBAL

A skill `/anti-ia` está instalada em `~/.claude/skills/anti-ia/SKILL.md`.

Para verificar:
```bash
ls ~/.claude/skills/anti-ia/
```

Para invocar em qualquer sessão Claude Code:
```
/anti-ia caminho/texto.md
/anti-ia                  # pede texto inline
```

A skill lê o canônico do squad conteudo e roda os 2 validadores executáveis + crítico LLM.

## 8. CHECKLIST DE OPERAÇÃO DIÁRIA

Pra você (operador) e pro time:

- [ ] Antes de pedir conteúdo ao agente, verificar que o squad ativo tem filtro acoplado (`squads/{nome}/checklists/filtro-anti-ia.md` existe)
- [ ] Pedir ao agente: "Aplique o Filtro Anti-IA Layer 0 ANTES de me devolver"
- [ ] Quando agente entrega, rodar manualmente os validadores se quiser checagem extra:
  ```bash
  node legacy/squads/conteudo/scripts/anti-ia-structural.mjs caminho/output.md
  ```
- [ ] Se qualquer revisor reprovar conteúdo aprovado pelo filtro, seguir Seção 5 deste doc pra atualizar canônico
- [ ] Manutenção quinzenal: rodar suite de regressão pra garantir que filtro não regrediu

## 9. PRINCÍPIO FUNDADOR

> **Em todo parágrafo, aponta a frase que SÓ você escreveria. Se não consegue apontar, o parágrafo é IA por default, mesmo que um humano tenha digitado.**

Origem: STYLE.md do projeto Impeccable (pbakaus/impeccable). Adotado como princípio orientador do filtro Castelo Forte v3.2.

Operacionalização: as 21 seções do `filtro-anti-ia.md` existem pra forçar essa pergunta a cada parágrafo.

---

**Versão deste documento:** 1.0 — 23/05/2026
**Próxima revisão:** quando novo feedback real exigir alteração semântica no filtro
