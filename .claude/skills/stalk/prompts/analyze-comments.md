# Análise de Comentários — Vocabulário do Avatar

Você recebeu `data.json` com comentários extraídos de um post via Apify Comment Scraper.

Missão: extrair a **voz real do avatar** — palavras que ele usa, dores que ele verbaliza, objeções, perguntas. Material direto pra alimentar copy.

## Estrutura do RELATORIO.md

```markdown
# VOCABULÁRIO DO AVATAR — Comentários do post

**URL:** {url}
**Comentários analisados:** N

---

## 1. PERFIL DEMOGRÁFICO IMPLÍCITO

Inferir a partir de nomes, fotos de perfil mencionadas, contexto:
- Faixa etária predominante
- Gênero
- Categoria profissional / nicho
- Nível socioeconômico aparente

## 2. DORES VERBALIZADAS

Top 10 dores expressadas com palavras EXATAS dos comentários:
1. "..." (citação literal)
2. "..."

Categorizar em:
- Dores financeiras
- Dores de tempo
- Dores de identidade
- Dores relacionais

## 3. OBJEÇÕES DETECTADAS

Top 10 objeções com citação:
- "Achei caro" → ...
- "Não tenho tempo" → ...

## 4. PERGUNTAS REAIS

Lista das perguntas mais feitas (5-15):
- "Como funciona?"
- "Quanto custa?"
- "Vale pra quem está começando?"

→ Insight: o que essas perguntas revelam do nível de consciência (Schwartz)?

## 5. PALAVRAS-CHAVE DO AVATAR

Top 30 palavras/expressões que se repetem (excluir genéricas).
Estas são o vocabulário pra usar em hooks.

## 6. ELOGIOS / PROVAS SOCIAIS

Frases positivas que podem virar testemunhal ou social proof.
- "Mudou minha vida"
- "Foi exatamente o que precisava"

## 7. RED FLAGS

Comentários negativos, críticas, haters. O que reclamam? Vale virar conteúdo de quebra de objeção?

## 8. INSIGHT IMPERIAL

1-2 parágrafos:
- O que esse post revela do avatar?
- Qual ângulo de copy mais ressoa?
- Qual dor não tá sendo atacada e poderia ser?

## 9. MUNIÇÃO PRONTA

10 hooks gerados a partir das dores reais (palavras do próprio avatar):
1. "..."
2. "..."

10 frases pra usar em corpo de texto:
1. "..."
```

## Princípios

- **Citar literal.** Não parafrasear comentários.
- **Privacidade:** não citar @s nem nomes. Só conteúdo.
- **Tom Torriani na análise**, mas as citações ficam intocadas.
- **Acionável:** cada seção alimenta copy.

Salvar em `{outdir}/RELATORIO.md`.
