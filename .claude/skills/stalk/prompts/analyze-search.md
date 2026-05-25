# Análise de Busca por Termo — Prompt

Você recebeu `data.json` com posts coletados via Apify search/hashtag scraper. Modo solicitado pelo usuário pode ser:

- `default` — relatório de top posts ranqueados
- `hooks` — extrair só os hooks
- `angles` — agrupar por ângulo narrativo
- `swipe` — banco completo (hooks + CTAs + estruturas)
- `find-perfis` — perfis ranqueados em vez de posts

## Estrutura por modo

### Modo `default` (ranking de top posts)

```markdown
# PESQUISA: "{termo}"

**Posts coletados:** N
**Período:** últimos 90d
**Idioma:** {lang}

## TOP 10 POSTS POR ENGAGEMENT

| # | Handle | Likes | Comments | Tipo | Hook |
|---|--------|-------|----------|------|------|
...

## PADRÕES IDENTIFICADOS

- Tipos dominantes (% de cada)
- Formatos vencedores
- Hooks recorrentes (categorias)
- CTAs comuns

## INSIGHT IMPERIAL

1-2 parágrafos cortantes sobre o que o termo revela do nicho.
```

### Modo `hooks`

```markdown
# BANCO DE HOOKS: "{termo}"

**Top 50 hooks** extraídos das primeiras frases dos posts mais performantes.

Agrupar por categoria:

## CONTRAINTUITIVO RADICAL
1. "..."
2. "..."

## PROVOCAÇÃO DIRETA
...

## ESTATÍSTICA / DADO
...

## HISTÓRIA / CASE
...

## PERGUNTA RETÓRICA
...

## INSIGHT
Qual categoria está dominando? Por quê? Qual ainda é gap?
```

### Modo `angles`

```markdown
# ÂNGULOS NARRATIVOS: "{termo}"

Agrupar posts em 4 grupos:

## ÂNGULO 1: PROBLEMA / DOR
Quantos posts: N (X%)
Tom dominante:
Exemplos (3-5):
Eficácia média (engagement médio):

## ÂNGULO 2: SOLUÇÃO / MÉTODO
...

## ÂNGULO 3: POLÊMICO / CONTRA-CORRENTE
...

## ÂNGULO 4: HISTÓRIA / CASE
...

## DIAGNÓSTICO IMPERIAL
Qual ângulo está saturado? Qual está sub-explorado? Onde atacar?
```

### Modo `swipe`

```markdown
# BANCO DE SWIPE: "{termo}"

## 50 HOOKS PERFORMÁTICOS
(formato lista numerada)

## 50 CTAs DETECTADOS
(formato lista, com categoria: salvar/comentar/DM)

## 30 ESTRUTURAS DE CARROSSEL
Para cada: tipo de post, número de slides, sequência de slides resumida.

## INSIGHT
O que esse swipe revela do nicho.
```

### Modo `find-perfis`

```markdown
# PERFIS RELEVANTES: "{termo}"

Top 20 perfis que aparecem repetidamente em posts populares do termo.

| # | Handle | Seguidores | Frequência | Eng Médio | Tom Dominante |
|---|--------|-----------|------------|-----------|---------------|
...

## CLUSTERS
Agrupar perfis por arquétipo (educadores, polêmicos, premium, etc.)

## RECOMENDAÇÃO
Quem stalkear primeiro com /stalk dossie.
```

## Tom comum a todos os modos

- Imperial Torriani
- Diagnóstico > descrição
- Sempre fechar com insight acionável
- Frases curtas

Salvar em `{outdir}/RELATORIO.md`.
