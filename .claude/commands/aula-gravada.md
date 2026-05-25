---
description: Transforma transcrição de prédica/culto/aula em material editorial estruturado (capítulos, citações bíblicas, Q&A)
argument-hint: "[opcional: caminho do MD de transcrição]"
---

# /aula-gravada — Castelo Forte

Transforma a transcrição de uma **prédica, culto, aula de liderança ou live da igreja** em material editorial denso e estruturado, pronto pra alimentar o squad de conteúdo.

> **Filosofia:** quem lê o material tem a MESMA informação de quem assistiu o vídeo. Não é resumo, é reorganização por tema com tudo preservado.

## Quando usar

Quando o usuário disser:
- "/aula-gravada"
- "terminei o culto, gera o material"
- "pega a transcrição da prédica e estrutura"
- "transforma essa gravação em material pra equipe"

## Pré-requisito

A transcrição deve existir em:
```
outputs/transcricoes/{slug}.md
```

Se não existe, rode `/transcrever <video>` primeiro.

## Inputs necessários

Pede ao usuário 3 itens:

### 1. Caminho da transcrição
```
1. Caminho do MD da transcrição (ou cola a transcrição direto):
   Exemplo: outputs/transcricoes/culto-2026-05-25-pastor.md
```

### 2. Metadados do material
```
2. Me passa:
   - Título da prédica/aula (ex: "A presença que muda tudo")
   - Quem ministrou (ex: "Pastor João")
   - Data do evento
   - Tipo: prédica | aula-lideres | live | encontro | conferência
   - Texto base (opcional, ex: "Lucas 4:18-19")
```

### 3. Pra onde vai o material gerado
```
3. Output:
   outputs/materiais/{tipo}/{slug}.md
   
   Onde {slug} é kebab-case do título + data.
   Exemplo: outputs/materiais/predicas/2026-05-25-a-presenca-que-muda-tudo.md
```

## Estrutura obrigatória do MD gerado

Segue o **padrão de aula-gravada** validado: conteúdo COMPLETO no centro em formato leitura, não índice de timestamps.

```markdown
---
título: "{título da prédica}"
ministrante: "{quem pregou}"
data: "{YYYY-MM-DD}"
tipo: "{prédica|aula-lideres|live|...}"
texto-base: "{referência bíblica}"
duração: "{HH:MM}"
fonte: "outputs/transcricoes/{slug}.md"
---

# {Título da Prédica}

> Texto base: **{Lucas 4:18-19}** (ou seja qual for)

## Sumário (4-8 movimentos principais)

1. {Movimento 1 - nome}
2. {Movimento 2 - nome}
...

---

## 1. {Movimento 1 — nome forte}

[Conteúdo completo deste bloco temático em forma narrativa. NÃO é resumo, é reorganização. Tudo o que o pastor falou sobre ESTE tema, mesmo que tenha aparecido em vários momentos da prédica, vem aqui em ordem lógica.]

> "Citação literal e impactante do pastor sobre este movimento."

[Continua o desenvolvimento. Sub-tópicos, exemplos práticos, ilustrações.]

### Aplicação prática

[Se o pastor deu aplicação, vem aqui. Lista numerada de ações.]

---

## 2. {Movimento 2}

[Mesma estrutura.]

...

---

## Citações marcantes (banco de quotes)

Lista de 5-15 frases curtas e fortes do pastor, prontas pra virar:
- Print tweet (carrossel 1 imagem)
- Stories de impacto
- Reels de 15s

> "{frase 1}"

> "{frase 2}"

...

---

## Perguntas que a prédica responde (Q&A)

Pra alimentar carrosséis didáticos. 5-10 perguntas que alguém faria + a resposta que o pastor deu.

**P: {pergunta real que um membro faria}**
R: {resposta consolidada do pastor}

**P: ...**
R: ...

---

## Referências bíblicas usadas

Lista de TODAS as passagens citadas (não parafrasear, manter literal):

- **Lucas 4:18-19** — texto base
- **Isaías 61:1-2** — referência paralela
- ...

---

## Termos teológicos que apareceram

Glossário de termos pra ajudar a equipe a alinhar vocabulário:

- **Unção:** {definição que o pastor deu, se deu}
- **Reino:** {...}
- ...

---

## Transcrição completa (ordem cronológica)

```text
[00:00] Boa noite igreja, hoje a gente vai falar...
[00:45] Abre a Bíblia comigo em Lucas 4...
[01:32] ...
```

[TUDO da transcrição original, em bloco de código, formato [mm:ss] ou [hh:mm:ss] se >1h.]
```

## Próximo passo recomendado depois de gerar o material

1. **Passa pro `@content-chief` com `*multiplicar`** → vira 30+ peças (carrosséis, reels, stories, prints) baseadas nas citações marcantes + Q&A
2. **Banco de quotes vai pra Print Tweet Creator** → cada citação vira 1 imagem
3. **Q&A vai pra Carousel Creator** → cada bloco de 5 perguntas vira 1 carrossel didático
4. **Aplicação prática vira reels curtos** → cada item vira 1 reels de 30s

## Regras inegociáveis

1. **Citações bíblicas literais.** Não parafrasear versículos. Se o pastor falou "tudo o que pedirdes em meu nome", buscar a versão correta da tradução e citar exatamente.
2. **Voz do pastor preservada.** Citações em blockquote mantêm o tom dele, não traduzir pro tom imperial.
3. **Sem travessão (—, –).** Substituir por vírgula, ponto, dois pontos.
4. **Português brasileiro completo.** Acentos sempre.
5. **Tom conversacional preservado** dentro dos blocos narrativos.
6. **Output em `outputs/materiais/`**, nunca dentro de `squads/`.
