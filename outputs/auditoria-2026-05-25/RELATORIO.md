# Auditoria Anti-IA + Voice DNA — Castelo Forte

**Data:** 2026-05-25
**Escopo:** Campanha Em Cristo (21 dias) + Arsenal Efésios + Culto Jó (24 carrosséis + 35 frases)
**Total auditado:** 28 arquivos
**Validador:** `squads/conteudo/scripts/validate-anti-ia.sh` (Anti-IA v3.7 determinístico)

---

## Resumo executivo

| Métrica | Antes | Depois | Status |
|---|---|---|---|
| Travessões (§2.1) | **202** | **0** | ✅ CORRIGIDO automaticamente |
| Frase curta empilhada (§2.2) | **25** | **25** | ⚠ Precisa reescrita manual |
| Arquivos aprovados | 2/28 | 2/28 | (frases.json + C19.json) |
| Arquivos com violação restante | 26 | 26 | Só §2.2 (frase empilhada) |

**Backup completo do estado original:** `/tmp/cf-auditoria-backup-2026-05-25/`

---

## Correções aplicadas (Travessões)

Script Python `/tmp/fix-travessao.py` aplicado em 28 arquivos.

| Arquivo | Antes | Depois |
|---|---|---|
| `ARSENAL-COMPLETO.md` | 64 | 0 |
| `ARSENAL-POPULAR.md` | 48 | 0 |
| `CAMPANHA-ANTECIPACAO-21-DIAS.md` | 90 | 0 |
| 24 JSONs de carrossel (C01–C24) | ~57 | 0 |
| `frases.json` | 0 | 0 |

**Regras aplicadas:**
1. ` — ` (com espaços) → `, ` (separador inline)
2. `— ` início de linha → removido (citação/assinatura)
3. `—` ou `–` isolado → `,`

---

## Violações pendentes (§2.2 — Frase Curta Empilhada)

**Fingerprint detectado:** 3 ou mais frases curtas com ponto em sequência na mesma linha.
**Exemplo do C01.json (slide 3):**

> "Os anjos se apresentam diante de Deus. E o diabo aparece junto. Mas quem fala primeiro é Deus. Quem aponta Jó primeiro é Deus. Quem regula o que pode e o que não pode é Deus. O inimigo não invade. Ele pede licença."

São **6 frases curtas seguidas** na mesma linha. É padrão clássico de IA.

### Lista completa de violações restantes

| Arquivo | Violações §2.2 |
|---|---|
| `ARSENAL-COMPLETO.md` | 13 |
| `CAMPANHA-ANTECIPACAO-21-DIAS.md` | 2 |
| `ARSENAL-POPULAR.md` | 2 |
| `C01.json` | 3 |
| `C02.json` | 3 |
| `C03.json` | 4 |
| `C04.json` | 4 |
| `C05.json` | 4 |
| `C06.json` | 3 |
| `C07.json` | 3 |
| `C08.json` | 1 |
| `C09.json` | 6 |
| `C10.json` | 1 |
| `C11.json` | 5 |
| `C12.json` | 3 |
| `C13.json` | 2 |
| `C14.json` | 1 |
| `C15.json` | 2 |
| `C16.json` | 3 |
| `C17.json` | 2 |
| `C18.json` | 1 |
| `C20.json` | 1 |
| `C21.json` | 1 |
| `C22.json` | 1 |
| `C23.json` | 1 |
| `C24.json` | 2 |

**Total: 77 ocorrências em 26 arquivos.**

---

## Por que NÃO corrigi §2.2 automaticamente

**Frase curta empilhada exige reescrita inteligente.** As opções:

1. **Quebrar em parágrafos** (cada 1-2 frases curtas vira parágrafo separado)
2. **Fundir com conectivos** ("E quem regula é Deus. E quem aponta também" → "E é Deus que regula e aponta")
3. **Expandir frases** dando ritmo respiratório ao texto

Cada uma muda o tom do conteúdo. **Decisão de copy, não de regex.**

Algumas estruturas curtas empilhadas podem ser **intencionais** (padrão TTM, ritmo Imperial), mas o filtro v3.7 não diferencia. Precisa avaliação humana ou LLM com contexto.

---

## Análise Voice DNA / Teologia do Reino

**Não rodada nesta passagem** (foco foi Anti-IA mecânico primeiro).

Para fazer:
- Cada peça precisa ser comparada com `workspace/businesses/igreja-castelo-forte/brand/voice/nucleo.md` (pilares: identidade, chamado, sobrenatural, formação)
- Verificar arquétipos (Mago/Cuidador/Criador) presentes
- Checar contra `anti-padroes.md` (auto-ajuda, clichês gospel, jargão sem tradução, manipulação)
- Validar que cita citações bíblicas literais (não parafraseadas)

**Tempo estimado:** ~30s por peça × ~50 peças = 25 min de análise LLM.

---

## Recomendações

### Curto prazo
1. **Aprovar correção de travessões** (já feita, basta validar visualmente 2-3 amostras)
2. **Decidir estratégia §2.2:** quebrar parágrafos, fundir, ou aceitar (algumas podem ser intencionais)
3. **Validar Voice DNA + Teologia** em batch separado

### Médio prazo
1. **Inserir validate-anti-ia.sh no pipeline obrigatório** antes de qualquer publicação
2. **Hook pre-commit** que reprova MD/JSON com travessão
3. **Treinar Content Validator** pra rodar §2.2 com julgamento contextual

---

## Arquivos auditados

**Em Cristo / Efésios:**
- `outputs/multiplicar/efesios-encarnado/ARSENAL-COMPLETO.md`
- `outputs/multiplicar/efesios-encarnado/ARSENAL-POPULAR.md`
- `outputs/multiplicar/efesios-encarnado/CAMPANHA-ANTECIPACAO-21-DIAS.md`

**Culto Jó 17/05:**
- `outputs/conteudo-cultos/jo-exemplo-17-05/carrosseis/C01.json` até `C24.json`
- `outputs/conteudo-cultos/jo-exemplo-17-05/frases.json`

**Backup do estado original:** `/tmp/cf-auditoria-backup-2026-05-25/`

---

*Gerado por Claude Code em 2026-05-25 — auditoria assistida por Anti-IA v3.7.*
