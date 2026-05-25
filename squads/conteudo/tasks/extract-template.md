# Extract Template — Extrair Template Visual de Referencia

## Task Anatomy

- **task_name:** Extract Template
- **executor:** publishing-manager (Tier 1)
- **elicit:** true
- **description:** Extrair template visual de um carrossel existente (screenshot, URL ou print) e salvar como template HTML reutilizavel na biblioteca
- **pre_conditions:**
  - Usuario fornece referencia visual (screenshot, URL do Instagram, print)
  - Playwright MCP disponivel para captura se URL
- **post_conditions:**
  - Template HTML salvo em templates/carousel/
  - Template usa sistema de placeholders padrao
  - README.md atualizado com novo template
- **veto_conditions:**
  - Salvar template sem placeholders ({{slide_text}}, {{bg_color}}, etc.)
  - Template com dimensoes diferentes de 1080x1350 ou 1080x1440
  - Template com dependencias externas alem de Google Fonts
  - Sobrescrever template existente sem confirmacao
- **completion_criteria:**
  - Template HTML renderiza corretamente no Playwright
  - Todos os placeholders funcionam
  - Template adicionado ao README.md da biblioteca

## Steps

### 1. Receber Referencia

Perguntar ao usuario:
1. **Fonte:** URL do Instagram, screenshot/print, ou descricao verbal?
2. **Nome do template:** Como quer chamar? (kebab-case, ex: "dark-minimal")
3. **O que manter:** Cores? Layout? Fontes? Tudo?
4. **O que mudar:** Cores diferentes? Fonte diferente? Layout ajustado?

### 2. Analisar Referencia

Se URL do Instagram:
- Usar Playwright para navegar e screenshot
- Analisar cada slide: layout, cores, fontes, espacamentos

Se screenshot/print:
- Ler a imagem
- Identificar: cores dominantes, fonte aparente, layout, espacamentos

Extrair:
- **Cores:** bg, texto principal, acento, secundaria
- **Fontes:** familia, peso (bold/regular), tamanho por zona
- **Layout:** header/content/footer, alinhamento, padding
- **Elementos:** paginacao, brand bar, decoracoes, separadores

### 3. Gerar Template HTML

Criar arquivo HTML self-contained seguindo o padrao:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080">
  <style>
    @import url('https://fonts.googleapis.com/css2?family={{font_family}}:wght@400;700;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1350px;
      overflow: hidden;
      background: {{bg_color}};
      color: {{text_color}};
      font-family: '{{font_family}}', sans-serif;
    }
    .slide { ... }
    /* Estilos condicionais por tipo */
    .slide[data-type="hook"] .content { font-size: 48px; font-weight: 900; }
    .slide[data-type="content"] .content { font-size: 32px; }
    .slide[data-type="cta"] .content { ... }
  </style>
</head>
<body>
  <div class="slide" data-type="{{slide_type}}">
    <div class="header">{{brand_name}}</div>
    <div class="content">{{slide_text}}</div>
    <div class="footer">{{slide_number}}/{{total_slides}}</div>
  </div>
</body>
</html>
```

### 4. Aplicar Customizacoes

Se usuario pediu mudancas:
- Trocar cores mantendo layout
- Trocar fontes mantendo proporcoes
- Ajustar espacamentos conforme solicitado

### 5. Validar Template

- Renderizar template de teste via Playwright (1080x1350)
- Verificar que texto renderiza corretamente
- Verificar que placeholders substituem corretamente
- Verificar dimensoes exatas

### 6. Salvar na Biblioteca

- Salvar em `templates/carousel/{nome-do-template}.html`
- Atualizar `templates/carousel/README.md` com novo template
- Informar usuario: "Template '{nome}' salvo. Use nos proximos carrosseis."

## Output Example

```
Template extraido:

Fonte: @perfildoinstagram, post de 15/03/2026
Nome: dark-neon
Baseado em: Carrossel de 7 slides sobre marketing digital

Elementos extraidos:
- Background: #0D0D0D (preto profundo)
- Texto: #FFFFFF
- Acento: #00FF88 (verde neon)
- Fonte: Space Grotesk, 900
- Layout: Texto centralizado, sem header, paginacao bottom-center
- Decoracao: Linha neon horizontal no topo

Customizacoes aplicadas:
- Fonte alterada para Inter (conforme solicitado)
- Cor de acento mantida

Salvo em: templates/carousel/dark-neon.html
Validacao: OK (1080x1350, Playwright render OK)
```

## Anti-Patterns

- NUNCA copiar conteudo/texto do carrossel de referencia (so visual)
- NUNCA salvar template sem testar render
- NUNCA usar imagens externas no template (so CSS puro)
- NUNCA hardcodar texto no template (DEVE usar placeholders)

### Veto Conditions

- id: "CONT_EXTRACT_TEMPLATE_001"
  condition: "Referencia visual nao fornecida (screenshot, URL ou print)"
  check: "Verificar se usuario forneceu fonte visual para extracao"
  result: "VETO - BLOCK. Solicitar referencia visual antes de iniciar extracao"
  rationale: "Sem referencia visual, nao ha base para criar template — e criacao do zero, nao extracao"

- id: "CONT_EXTRACT_TEMPLATE_002"
  condition: "Template sem placeholders padrao (texto hardcodado)"
  check: "Verificar se template usa placeholders (slide_text, bg_color, etc.) e nao texto fixo"
  result: "VETO - BLOCK. Substituir texto fixo por placeholders antes de salvar"
  rationale: "Template com texto hardcodado nao e reutilizavel — placeholders sao obrigatorios"

### Completion Criteria

- [ ] Template HTML salvo em templates/carousel/ com todos os placeholders funcionais
- [ ] Template renderiza corretamente no Playwright com dimensoes 1080x1350
- [ ] README.md da biblioteca atualizado com novo template
- [ ] Nenhuma dependencia externa alem de Google Fonts no template
