# Especificação Editorial — Layout de Referência

## Arquivos de referência
- `editorial-capa-referencia.png` — Capa com foto + hook sobreposto
- `editorial-interna-referencia.png` — Slide interno com título serifado numerado

---

## CAPA (S1)

### Layout
- **Foto:** ocupa 100% da imagem (1080x1350), é o fundo
- **Logo:** topo esquerdo, fonte serifada branca, pequena (~24px)
- **Hook (título):** fonte serifada bold branca, grande (~56-64px), centralizado horizontalmente
- **Posição Y do hook:** ~65-70% da altura (em torno de Y=880-950)
- **Sub-headline:** fonte regular branca, menor (~28-32px), centralizada, logo abaixo do hook
- **Alinhamento:** CENTRO (não esquerda)
- **Texto sobrepõe a foto** — não tem área separada

### Tipografia
- Hook: PT Serif Bold, branco, ~60px
- Sub-headline: Inter Regular, branco, ~28px
- Logo: PT Serif Regular, branco, ~24px

### Efeito visual
- Foto escurecida levemente na parte inferior (gradient overlay) para texto branco legível
- Aspas tipográficas no hook (estilo editorial)

---

## INTERNA (S2+)

### Layout
- **Header:** marca à esquerda + linha horizontal + categoria à direita (~Y=30, fonte 14px, cinza)
- **Título numerado:** fonte serifada bold preta, grande (~44-48px)
- **Posição Y do título:** ~35-40% da altura (Y=470-540) — centro-superior
- **Body:** fonte sans-serif regular, cinza escuro (#444), ~26-28px
- **Último parágrafo:** fonte sans-serif BOLD, preta (#000) — destaque/conclusão
- **Footer:** ícone à esquerda + nome da marca à direita (~Y=1300, fonte 14px, cinza)
- **Alinhamento:** ESQUERDA
- **Margens:** X=80, largura útil ~920px

### Tipografia
- Título: PT Serif Bold, preto, ~44px
- Body: Inter Regular, cinza (#444), ~28px
- Último parágrafo: Inter Bold, preto (#1a1a1a), ~28px
- Header/Footer: Inter Regular, cinza (#999), 14px

### Numeração
- Slides internos são numerados: "2.", "3.", "4." etc.
- Número faz parte do título, na mesma linha

### Espaçamento
- Entre título e body: ~40px gap
- Entre parágrafos: ponto final = linha em branco
- Body começa logo após o título, sem gap excessivo

---

## Diferenças do layout atual (a corrigir)

| Aspecto | Atual (errado) | Referência (correto) |
|---------|----------------|---------------------|
| Fonte título | Inter Bold (sans) | PT Serif Bold (serif) |
| Capa | Texto em área separada | Texto sobreposto à foto |
| Alinhamento capa | Esquerda | Centro |
| Posição Y capa | Fixo no topo | 65-70% da altura (parte inferior) |
| Numeração slides | Não tem | "2.", "3.", "4." |
| Último parágrafo | Regular | Bold (destaque) |
| Header interna | Texto só | Marca + linha + categoria |
| Footer interna | Texto só | Ícone + nome marca |

---

## Pendências para implementar

1. [ ] Integrar PT Serif Bold (copiar de /System/Library/Fonts/Supplemental/PTSerif.ttc)
2. [ ] Redesenhar layout da capa: foto como fundo + texto sobreposto + centralizado
3. [ ] Adicionar gradient overlay na foto (escurecer parte inferior)
4. [ ] Implementar numeração automática nos slides internos
5. [ ] Implementar "último parágrafo bold" no body
6. [ ] Ajustar posição Y dos textos conforme referência
7. [ ] Centralizar texto da capa (atualmente é left-aligned)
