# Render Slides — Gerar PNGs a partir de Template + Copy

## Task Anatomy

- **task_name:** Render Slides
- **executor:** publishing-manager (Tier 1)
- **elicit:** false (automatico quando chamado pelo workflow)
- **description:** Receber copy (.md) + template HTML → gerar 1 HTML por slide → renderizar PNGs via Playwright
- **pre_conditions:**
  - Copy do carrossel disponivel (texto por slide)
  - Template HTML selecionado em templates/carousel/
  - Playwright MCP disponivel
- **post_conditions:**
  - PNGs gerados em output/slides/rendered/
  - Manifest JSON com metadata de cada slide
- **veto_conditions:**
  - Renderizar sem template selecionado
  - PNGs com dimensoes diferentes de 1080x1350
  - Publicar sem aprovacao humana
  - Usar slide com layout de imagem SEM imagem real (placeholder ou vazio)

## Regra de Imagens — OBRIGATÓRIA

**REGRA INVIOLÁVEL:** TODOS os slides de TODOS os carrosséis DEVEM ter imagem contextual. Não existe slide sem imagem. Cada slide precisa de uma foto real relacionada ao conteúdo do texto daquele slide específico.

### Fontes de Imagem (ordem de prioridade)
1. **Pexels** — gratuita, alta qualidade, sem atribuição necessária
2. **Unsplash** — gratuita, alta qualidade
3. **Google Imagens** — buscar por licença livre/creative commons
4. **Nano Banana (Gemini)** — gerar via IA se nenhuma foto stock servir

### Processo
1. Para CADA slide que usa imagem, buscar foto relacionada ao CONTEXTO do texto daquele slide
2. Salvar na pasta de imagens do carrossel com nome descritivo (ex: `s03-tela-codigo.jpg`)
3. Nunca reutilizar a mesma imagem em slides diferentes do mesmo carrossel
4. Imagens devem ser portrait-friendly (funcionar em 1080x1350)
5. Preferir fotos com espaço para texto (gradiente por cima ou áreas escuras/claras)

### Regra de Face Swap — OBRIGATÓRIA

Quando uma imagem de stock contém uma **pessoa genérica** (rosto visível), o rosto DEVE ser substituído pelo rosto do owner da marca usando Nano Banana (face swap).

**Fluxo:**
1. Imagem do Pexels/Unsplash com pessoa genérica
2. Detectar que tem rosto humano visível
3. Enviar para Nano Banana com foto de referência do owner (`data/visual-identity.yaml` → `assets.face_reference`)
4. Resultado: owner na cena com composição profissional da foto stock

**Exceções — NÃO fazer face swap quando:**
- A pessoa na foto é uma **pessoa pública conhecida** (Halbert, Ogilvy, Trump, etc.) — manter o rosto original
- A foto é de **paisagem, objeto, tela de computador** sem rosto humano visível
- A foto mostra **grupo grande** onde o rosto não é protagonista

**Configuração:**
- Foto de referência do owner: definida no `data/visual-identity.yaml` → `assets.face_reference`
- Cada novo usuário configura sua foto no `*onboarding`
- O script `render-carrossel.mjs` marca no manifesto quais imagens precisam de face swap: `{ needsFaceSwap: true }`

### Regra de Imagem Fullbleed — OBRIGATÓRIA

Quando um slide usa imagem fullbleed (Hook, Statement, Destaque com foto):
- A imagem DEVE ocupar 100% do espaço (width:1080px height:1350px object-fit:cover)
- Usar `object-position` para ajustar o enquadramento — garantir que o assunto principal (rostos, objetos importantes) fique ACIMA da zona de texto
- O gradiente overlay deve começar mais abaixo (40-50%) para não esconder o assunto da foto
- Testar visualmente que o título não cobre o assunto principal da imagem

### Regra de Coerência Visual — INVIOLÁVEL

**A imagem de cada slide DEVE corresponder exatamente ao que o texto fala.**

1. **Se o texto menciona uma PESSOA específica** (copywriter, empresário, autor) → usar foto REAL dessa pessoa, não stock genérico
2. **Se o texto fala de tecnologia/agentes/robôs** → usar imagem de robô, IA, automação — NÃO pessoas genéricas
3. **Se o texto fala de clonagem cognitiva** → usar imagem que remeta a clonagem, digital twin, cérebro artificial
4. **Se o texto fala de um conceito** (velocidade, precisão, infraestrutura) → usar imagem que represente visualmente esse conceito
5. **NUNCA usar imagem aleatória de banco** que não tem relação com o texto do slide

**Exemplos:**
- Slide fala "Gary Halbert" → foto real do Gary Halbert
- Slide fala "agentes de IA" → robô, interface de IA, automação — NÃO pessoas em escritório
- Slide fala "monte seu time de gênios" → robôs, agentes digitais — NÃO pessoas em reunião
- Slide fala "clonagem cognitiva" → cérebro digital, espelho, duplicação — NÃO alquimia genérica

### Regra de Formatação de Texto

- **NUNCA usar travessões (—)** nos títulos ou corpos dos slides
- Reescrever frases com travessão usando ponto final ou vírgula
- Exemplo: "Gary Halbert — cartas de venda" → "Gary Halbert. Cartas de venda."

### O que NÃO fazer
- NÃO deixar slide sem imagem
- NÃO usar pessoa genérica de stock quando o owner tem foto de referência configurada
- NÃO repetir imagens entre slides
- NÃO usar imagens de baixa resolução (mínimo 1080px de largura)
- NÃO deixar o gradiente cobrir o assunto principal da foto (ajustar object-position)
- NÃO usar imagem desconectada do texto (ex: alquimia para copywriters, pessoas para agentes)
- NÃO usar travessões nos textos dos slides
- **completion_criteria:**
  - Todos os slides renderizados como PNG
  - Dimensoes corretas (1080x1350)
  - Manifest gerado com status OK para todos os slides

## Elicitation (Quando Chamado Standalone)

Se chamado fora de um workflow automatico, coletar:

1. **"Qual carrossel renderizar?"** — Caminho do arquivo .md com a copy aprovada ou colar o texto
2. **"Qual template usar?"** — Listar templates disponiveis em templates/carousel/ e pedir selecao:
   - "Templates disponiveis: twitter, twitter-black, twitter-branco, editorial, minimal-dark, [outros]. Qual usar?"
3. **"Tem identidade visual configurada?"** — Verificar se data/visual-identity.yaml existe:
   - Se SIM: "Usar identidade visual salva? (s/n)"
   - Se NAO: "Quer cores customizadas? Informe: cor de fundo, cor de texto, cor de acento"
4. **"Qual o nome da marca?"** — Para o header/brand bar do template (se aplicavel)
5. **"Dimensoes?"** — Default 1080x1350 (feed). Opcoes: 1080x1350 (feed), 1080x1920 (stories)

## Steps

### 1. Receber Inputs

- Copy: texto de cada slide (extraido do .md do carousel-creator)
- Template: nome do template (ex: "minimal-dark")
- Metadata: brand_name, cores customizadas (opcional)

### 2. Preparar HTMLs

Para cada slide:
1. Ler template HTML de `templates/carousel/{template-name}.html`
2. Substituir placeholders:
   - `{{slide_text}}` → texto do slide
   - `{{slide_number}}` → numero do slide
   - `{{total_slides}}` → total de slides
   - `{{slide_type}}` → hook/content/cta
   - `{{brand_name}}` → nome da marca
   - `{{bg_color}}`, `{{text_color}}`, `{{accent_color}}` → cores (do template ou custom)
   - `{{font_family}}` → fonte
3. Salvar como `output/slides/slide-{NN}.html`

### 3. Renderizar PNGs

```bash
# Iniciar servidor HTTP local
python3 -m http.server 8765 --directory output/ &

# Aguardar servidor ficar pronto
for i in $(seq 1 30); do curl -s http://localhost:8765 > /dev/null 2>&1 && break || sleep 0.1; done

# Para cada slide, usar Playwright MCP:
# 1. browser_navigate → http://localhost:8765/slides/slide-01.html
# 2. browser_resize → { width: 1080, height: 1350 }
# 3. browser_take_screenshot → output/slides/rendered/slide-01.png

# Encerrar servidor
pkill -f "http.server 8765" 2>/dev/null || true
```

### 4. Gerar Manifest

```json
{
  "template": "minimal-dark",
  "render_date": "YYYY-MM-DD",
  "slide_count": 7,
  "format": "PNG",
  "dimensions": "1080x1350px",
  "slides": [
    { "order": 1, "filename": "slide-01.png", "type": "hook", "status": "OK" },
    { "order": 2, "filename": "slide-02.png", "type": "content", "status": "OK" },
    { "order": 7, "filename": "slide-07.png", "type": "cta", "status": "OK" }
  ],
  "ready_to_publish": true
}
```

### 5. Apresentar para Aprovacao

- Mostrar thumbnails dos slides renderizados
- Usuario aprova ou pede ajustes
- Se ajuste: modificar HTML e re-renderizar slide especifico

## Output Example

```
Slides renderizados:

Template: bold-gradient
Slides: 7
Dimensoes: 1080x1350px

slide-01.png (hook) — OK
slide-02.png (content) — OK
slide-03.png (content) — OK
slide-04.png (content) — OK
slide-05.png (content) — OK
slide-06.png (content) — OK
slide-07.png (cta) — OK

Manifest: output/slides/rendered/manifest.json
Status: Pronto para publicacao
```

### Veto Conditions

- id: "CONT_RENDER_SLIDES_001"
  condition: "Template HTML nao selecionado para renderizacao"
  check: "Verificar se template foi escolhido de templates/carousel/"
  result: "VETO - BLOCK. Solicitar selecao de template antes de iniciar renderizacao"
  rationale: "Sem template, nao ha base visual para gerar os PNGs dos slides"

- id: "CONT_RENDER_SLIDES_002"
  condition: "Slides com imagem de placeholder ou sem imagem real"
  check: "Verificar se todos os slides tem imagem contextual (nao placeholder) conforme regra inviolavel"
  result: "VETO - BLOCK. Buscar imagem real para cada slide antes de renderizar"
  rationale: "Regra inviolavel: todos os slides devem ter imagem contextual — placeholder e proibido"

### Completion Criteria

- [ ] Todos os slides renderizados como PNG com dimensoes corretas (1080x1350)
- [ ] Manifest JSON gerado com status OK para todos os slides
- [ ] Imagens contextuais em todos os slides (nenhum placeholder) com coerencia visual-texto
- [ ] Slides apresentados ao usuario para aprovacao antes de publicacao
