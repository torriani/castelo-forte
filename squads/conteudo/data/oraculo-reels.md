# ORÁCULO REELS - Validação em 3 Níveis (DNA BLAZE)

> Sistema definitivo de validação de Reels.
> Threshold: >= 80% OBRIGATÓRIO em cada nível.
> Progressão: Nível 1 -> Nível 2 -> Nível 3 (não pula).

---

## Arquitetura

```
REEL -> NÍVEL 1 (Copy) >=80%? -> NÍVEL 2 (Hook) >=80%? -> NÍVEL 3 (Completo) >=80%? -> APROVADO
```

---

## NÍVEL 1: Validação Universal de Copy

### Categoria 1: Fundação Estrutural (Peso 20%)

**Banco de 4 Pernas (AWAI):**
- Benefício: forte e irresistível?
- Track Record: histórico e prova?
- Credibilidade: autoridade crível?
- Ideia Única: ângulo diferenciador?

**CBPP:** Credibilidade, Benefício, Prova, Push

Fórmula: `CAT1 = (4PERNAS x 0.60) + (CBPP x 0.40)` | Mínimo 70%

### Categoria 2: Persuasão Core (Peso 25%)

**4 Us (AWAI):** Útil, Urgente, Único, Ultraespecífico
- Se qualquer U <50% = copy fraca

**4 Ps (AWAI):** Promise, Picture, Prove, Push

Fórmula: `CAT2 = (4US x 0.60) + (4PS x 0.40)` | Mínimo 75%

### Categoria 3: Qualidade Técnica (Peso 20%)

**Especificidade Brutal:**
- Números exatos (127, não "muitas")
- Números ímpares (7, não 10)
- Detalhes concretos ("R$47k em março")
- Resultados mensuráveis
- Contexto temporal específico
- Nomes próprios

**10 Regras de Boa Escrita (AWAI):**
Hook atrativo, Lead com WIIFM, Propósito único, Ideia principal clara, Estrutura retórica, Densidade informacional, Autoridade, Sem jargão, Concisão, Coerência início-fim

Fórmula: `CAT3 = (ESPECIFICIDADE x 0.50) + (10REGRAS x 0.50)` | Mínimo 70%

### Categoria 4: Impacto Emocional (Peso 25%)

**12 Testes do Validator:** (mesmos do Oráculo Posts)

**5 Indicadores de Persuasão:**
Dissonância, Pressão emocional, Urgência real, Comando claro, Tensão narrativa

Fórmula: `CAT4 = (12TESTES x 0.70) + (INDICADORES x 0.30)` | Mínimo 75%

### Categoria 5: Compliance e Proibições (Peso 10%)

**Reprovação automática se contém:**
- Perguntas que geram "não"
- Clichês de coach
- Venda direta crua
- Autocentrismo
- Frases de rejeição
- Palavras proibidas

Fórmula: Contém proibição = 0%. Tudo OK = 100%. **Mínimo 100% (não negociável).**

### Score Nível 1
```
SCORE_N1 = (CAT1 x 0.20) + (CAT2 x 0.25) + (CAT3 x 0.20) + (CAT4 x 0.25) + (CAT5 x 0.10)
```
Aprovado >= 80%

---

## NÍVEL 2: Validação Específica de Hook

### Categoria 1: Padrão Viral (Peso 30%)
Deve usar 1+ dos 7 padrões: Contraintuitivo, Segredo, Confissão, Urgente, Prova, Tribal, Meta

### Categoria 2: Estrutura Técnica (Peso 25%)
- Max 5 palavras (>5 = REPROVAÇÃO AUTOMÁTICA)
- Primeira palavra inesperada
- Textual E falado
- Clareza imediata (0.5s)
- Sem jargão técnico

### Categoria 3: Impacto Emocional (Peso 25%)
Sentimentos: Choque, Curiosidade, Raiva/Indignação, Ego/Identificação, Medo/Urgência
Se não gera nenhum sentimento forte = 0%

### Categoria 4: Incompletude Forçada (Peso 10%)
Não revela solução, cria gap, promessa implícita, tensão cognitiva

### Categoria 5: Qualidade Viral (Peso 10%)
Breakability, Shareability, Comentabilidade, Distinctiveness

### Score Nível 2
```
SCORE_N2 = (PADRAO x 0.30) + (ESTRUTURA x 0.25) + (SENTIMENTO x 0.25) + (INCOMPLETUDE x 0.10) + (VIRAL x 0.10)
```
Aprovado >= 80%

---

## NÍVEL 3: Validação Completa do Reel

### Bloco 2: Retenção (3-30s) - Peso 25%
- Gap de Informação (40%): curiosidade, loop, promessa, contexto
- Tensão Narrativa (35%): conflito, escalada, micro-clímax, sem vale
- Qualidade Contexto (25%): relevante, específico, dinâmico, conciso

### Bloco 3: Segundo Hook (30-40s) - Peso 20%
- Re-engajamento (40%): novo conflito, pattern interrupt, promessa renovada
- Segmentação (35%): segmenta ICP, dor específica, qualificação
- Técnicas (25%): pergunta, revelação parcial, contraste, urgência

### Bloco 4: Conteúdo Principal (40-70%) - Peso 30%
- Entrega de Valor (35%): resolve dor, vitória rápida, prático, memorável
- Elemento do Movimento (35%): crença, inimigo, mantra, posicionamento
  **SE NENHUM ELEMENTO = REPROVAR**
- Qualidade Execução (30%): não técnico, densidade, fluxo, engajamento

### Bloco 5: Moral + CTA - Peso 25%
- 5 Sentimentos Climáticos (40%) **SE NENHUM = REPROVAR**
- Qualidade Moral (30%): crença certa, insight, coerente, memorável
- CTA (30%): transição fluida, comando claro, não vende direto, alinhado

### Score Nível 3
```
SCORE_N3 = (BLOCO2 x 0.25) + (BLOCO3 x 0.20) + (BLOCO4 x 0.30) + (BLOCO5 x 0.25)
```

---

## Score Geral Consolidado

```
SCORE_GERAL = (NIVEL1 x 0.30) + (NIVEL2 x 0.30) + (NIVEL3 x 0.40)
```

| Score | Classificação | Ação |
|-------|---------------|------|
| >=90% | Excelência | GRAVAR AGORA |
| 85-89% | Muito Forte | GRAVAR |
| 80-84% | Forte | GRAVAR |
| 75-79% | Bom | Revisar pontos fracos |
| 70-74% | Aceitável | Retrabalhar seções |
| <70% | Reprovar | Reconstruir |

---

## Regras Invioláveis do Oráculo Reels

- Threshold 80% sagrado em cada nível
- Progressão obrigatória (não pula nível)
- Compliance binário (100% ou reprovar)
- Hook >5 palavras = reprovação automática
- Palavras proibidas = reprovação instantânea
- Bloco 4 DEVE ter elemento do movimento
- Bloco 5 DEVE gerar 1 dos 5 sentimentos
- CTA não vende diretamente (gera desejo)

---

## Protocolo de Falha (3 reprovações)

Pedir ao usuário:
1. Dor principal do avatar
2. Desejo mais profundo
3. Resultado específico com números
4. Prova disponível
5. O que torna único
6. Crença a quebrar
7. Emoção a ativar
