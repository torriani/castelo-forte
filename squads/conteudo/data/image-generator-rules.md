# Regras de Geração de Imagens — Carrossel

## Quem executa
- **carousel-creator** gera o markdown do carrossel
- **image-generator** (`squads/conteudo/app/image-generator/`) converte markdown → PNGs

## Regras de layout

### Posicionamento
- textY = 510 (twitter-branco e twitter-black) — respiro do header (avatar/nome/@)
- Texto nunca pode colar no header do template

### Tipografia no body
- Todo ponto final seguido de espaço = novo parágrafo (quebra automática)
- Leitura frase por frase, uma ideia por bloco visual
- Sem emojis nos slides

### Acentuação
- **OBRIGATÓRIO:** Todo texto em português correto com acentos, til, cedilha
- Nunca gerar slides sem acentuação
- Exemplos: "não", "você", "lógica", "começar", "cabeça", "operação"

## Estrutura do S1 (slide de abertura)

O S1 usa dois níveis de texto:

| Campo | Conteúdo | Renderização |
|-------|----------|--------------|
| `title` | Hook escolhido (IMPERIAL, VIRAL, etc.) | Bold, grande (48px) |
| `body` | S1 original do carrossel (sub-headline) | Regular, menor (32px) |

### Regra de seleção de hook
- O markdown do carrossel traz 3 variações de hook: [VIRAL], [IMPERIAL], etc.
- Na geração, o usuário escolhe qual hook usar como `title` do S1
- O S1 original (frase padrão do carrossel) vai como `body` (sub-headline)
- S1 sempre usa template `twitter-black` (fundo escuro, destaque)

### Exemplo
```json
{
  "title": "Escada de valor não funciona no Brasil. Nunca funcionou.",
  "body": "A escada de valor que você aprendeu está de cabeça para baixo.",
  "template": "twitter-black"
}
```

## Estrutura dos slides internos (S2-S10)

| Campo | Conteúdo |
|-------|----------|
| `title` | Vazio (sem título bold) |
| `body` | Texto do slide — parágrafos separados por `\n\n` |
| `template` | `twitter-branco` (padrão) |

### Regra de quebra de parágrafo
O gerador quebra automaticamente em todo `. ` (ponto + espaço), então basta passar o texto corrido que ele separa.

## Templates disponíveis

| Template | Uso no carrossel |
|----------|-----------------|
| `twitter-black` | S1 (hook de abertura) |
| `twitter-branco` | S2-S10 (slides internos) |

## Perguntas obrigatórias antes de gerar

Antes de gerar imagens de um carrossel, SEMPRE perguntar ao usuário:

1. **Qual carrossel?** (ex: A04, A37)
2. **Qual hook?** (VIRAL 1, VIRAL 2 ou IMPERIAL)
3. **Qual layout?** Opções:
   - `twitter` — S1 fundo preto, S2+ fundo branco (padrão tweet)
   - `twitter-black` — Todos os slides fundo preto
   - `twitter-branco` — Todos os slides fundo branco
   - `editorial` — Templates F2L (capa + internos)
   - `misto` — Usuário define template por slide

NUNCA assumir layout sem perguntar.

## Templates disponíveis (detalhe)

| Template | Descrição | Uso típico |
|----------|-----------|------------|
| `twitter-branco` | Tweet style, fundo branco, header avatar/nome/@ | Carrossel texto, frases |
| `twitter-black` | Tweet style, fundo preto, texto branco | Hooks, abertura, destaque |
| `post-imagem-capa` | Editorial F2L, área de imagem no topo + título | Capa de carrossel editorial |
| `post-imagem-interna-foto` | Editorial F2L, header/footer + foto + texto | Slide interno com foto |
| `post-imagem-interna-texto` | Editorial F2L, header/footer + só texto | Slide interno só texto |

## Como gerar

```bash
cd squads/conteudo/app/image-generator/
node generate.mjs --batch carrossel.json --output ./output/
```

## Output path

As imagens ficam **ao lado do markdown**, na mesma hierarquia dos textos:

```
outputs/copys/{cliente}/{campanha}/carrosseis/
├── A04-escada-valor-invertida.md          ← texto (markdown)
├── A04-escada-valor-invertida/            ← pasta com imagens geradas
│   ├── slides.json                        ← JSON usado na geração
│   ├── slide-01.png
│   ├── slide-02.png
│   └── slide-10.png
```

### Regra
- Pasta de imagens = mesmo nome do arquivo `.md`, sem extensão
- Dentro da pasta: `slides.json` (fonte) + `slide-XX.png` (imagens)
- NUNCA salvar imagens dentro de `squads/conteudo/` — sempre em `outputs/copys/`
