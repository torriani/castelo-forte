# Carousel HTML Templates

Templates de carrossel para Instagram em HTML puro. Cada template e um arquivo HTML auto-contido de 1080x1350px, pronto para renderizacao e exportacao como imagem.

---

## Como Funcionam

### Sistema de Placeholders

Cada template usa placeholders no formato `{{placeholder}}` que devem ser substituidos antes da renderizacao:

| Placeholder | Descricao | Exemplo |
|-------------|-----------|---------|
| `{{bg_color}}` | Cor de fundo principal | `#0A0E1A` |
| `{{text_color}}` | Cor do texto principal | `#FFFFFF` |
| `{{accent_color}}` | Cor de destaque/acento | `#6366F1` |
| `{{font_family}}` | Fonte primaria | `'Inter', sans-serif` |
| `{{brand_name}}` | Nome da marca/autor | `Castelo Forte` |
| `{{slide_text}}` | Conteudo textual do slide | `O problema nao e...` |
| `{{slide_number}}` | Numero do slide atual | `3` |
| `{{total_slides}}` | Total de slides do carrossel | `7` |
| `{{slide_type}}` | Tipo do slide (afeta estilo) | `hook`, `content` ou `cta` |

### Tipos de Slide (slide_type)

Cada template tem estilos condicionais baseados no `data-type` do slide:

- **hook** — Primeiro slide. Texto maior e mais bold. Funciona como thumbnail/gancho.
- **content** — Slides de conteudo intermediarios. Texto legivel, tamanho moderado.
- **cta** — Ultimo slide (call-to-action). Layout diferente com botao ou acao clara.

### Renderizacao

Para gerar imagens a partir dos templates:

1. Substituir todos os `{{placeholders}}` pelos valores desejados
2. Abrir o HTML em um browser (ou headless browser)
3. Capturar screenshot em 1080x1350px
4. Exportar como PNG ou JPG

Ferramentas recomendadas para renderizacao automatizada:
- Puppeteer (Node.js) — `page.screenshot({ clip: { width: 1080, height: 1350 } })`
- Playwright (Node.js/Python)
- html2canvas + dom-to-image (client-side)

---

## Templates Disponiveis

### 1. minimal-dark.html
- **Visual:** Fundo escuro, texto branco, tipografia grande e limpa
- **Melhor para:** Imperial, Polemico, statements fortes
- **Tom:** Serio, direto, impactante
- **Paginacao:** Bottom-right, sutil

### 2. editorial-clean.html
- **Visual:** Fundo off-white, serif para titulos, sans para corpo, linha de acento na esquerda
- **Melhor para:** Curiosidade, Historia, conteudo educativo
- **Tom:** Sofisticado, editorial, informativo
- **Decoracao:** Barra de acento vertical na esquerda

### 3. bold-gradient.html
- **Visual:** Gradiente escuro para cor de acento, texto bold branco
- **Melhor para:** Crenca, provocacoes, statements curtos
- **Tom:** Energico, provocativo, visual forte
- **Efeito:** Gradiente sutil + glow radial

### 4. brand-bar.html
- **Visual:** Cor solida de marca, header bar com nome + icone, footer com paginacao
- **Melhor para:** Series, conteudo educativo, listas numeradas
- **Tom:** Profissional, organizado, serial
- **Estrutura:** Header/Content/Footer com zonas claras

### 5. split-accent.html
- **Visual:** Layout assimetrico (60% escuro, 40% cor de acento)
- **Melhor para:** Oferta, comparacoes, antes/depois
- **Tom:** Dinamico, moderno, visual anchor
- **Efeito:** Corte diagonal entre as zonas

---

## Como Criar Novos Templates

### Requisitos obrigatorios

1. Dimensoes exatas: `1080px x 1350px` (aspect ratio 4:5)
2. Usar CSS custom properties para todas as cores e fontes customizaveis
3. Incluir todos os placeholders `{{}}` documentados acima
4. Ter estilos condicionais para `data-type="hook"`, `data-type="content"` e `data-type="cta"`
5. Importar fontes via Google Fonts (`@import`)
6. Ser auto-contido (sem dependencias externas alem de Google Fonts)
7. Incluir valores default no CSS para funcionar sem substituicao de placeholders

### Estrutura base

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1080">
<title>[Nome] — Carousel Template</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

  :root {
    --bg-color: {{bg_color}};
    --text-color: {{text_color}};
    --accent-color: {{accent_color}};
    --font-family: {{font_family}};
  }

  /* Default values */
  :root {
    --bg-color: #000000;
    --text-color: #FFFFFF;
    --accent-color: #FF0000;
    --font-family: 'Inter', sans-serif;
  }

  body {
    width: 1080px;
    height: 1350px;
    overflow: hidden;
  }

  /* Hook, content, CTA styles... */
</style>
</head>
<body>
  <div class="slide" data-type="{{slide_type}}">
    <div class="slide-text">{{slide_text}}</div>
  </div>
  <div class="brand">{{brand_name}}</div>
  <div class="pagination">{{slide_number}} / {{total_slides}}</div>
</body>
</html>
```

### Naming convention

`[nome-descritivo].html` — kebab-case, sem numeros, nome descritivo do estilo visual.

---

## Como Extrair Templates de Referencias do Instagram

Quando encontrar um post de referencia no Instagram:

1. **Capturar screenshot** do carrossel (todos os slides)
2. **Analisar o layout:** proporcoes, posicoes de texto, decoracoes
3. **Identificar cores:** background, texto, acentos (usar color picker)
4. **Identificar fontes:** serif vs sans, peso, tamanho relativo
5. **Criar o HTML** seguindo a estrutura base acima
6. **Testar renderizacao** comparando lado a lado com o original
7. **Generalizar:** substituir cores e textos especificos por placeholders

O objetivo nao e copiar pixel-perfect, mas capturar o *estilo visual* e transforma-lo em template reutilizavel.
