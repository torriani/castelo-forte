# Criar Template Visual

## Task Anatomy

- **task_name:** Criar Template Visual
- **executor:** publishing-manager (Tier 1)
- **elicit:** true
- **description:** Configurar identidade visual da marca para geracao de carrosseis — cores, fontes, logo, template preferido. Salva em data/visual-identity.yaml para reuso em todas as tarefas de geracao visual.
- **pre_conditions:**
  - Templates existem em templates/carousel/
  - Usuario tem informacoes basicas da marca (mesmo que parciais)
- **post_conditions:**
  - data/visual-identity.yaml criado com configuracao valida
  - Contraste WCAG AA validado (4.5:1 minimo)
  - Preview visual confirmado pelo usuario
- **veto_conditions:**
  - Prosseguir sem pelo menos cor primaria + fonte de titulo definidas
  - Salvar template sem preview visual no browser
  - Usar cores que nao atendem contraste WCAG AA (4.5:1)
  - Sobrescrever visual-identity.yaml existente sem confirmar com usuario
  - Salvar fontes que nao estao disponiveis no sistema (Google Fonts ou locais)
- **completion_criteria:**
  - data/visual-identity.yaml existe com configuracao valida
  - Contraste de cores validado (WCAG AA 4.5:1)
  - Preview visual aprovado pelo usuario
  - Confirmacao de que futuros carrosseis usarao a identidade

## Elicitation

Quando a task iniciar, coletar informacoes nesta ordem:

1. **"Voce ja tem identidade visual da marca? (cores, fontes, logo)"** → Se SIM: coleta manual. Se NAO: selecao assistida.
2. **Se coleta manual:** perguntar uma por vez:
   - "Qual a cor primaria da marca? (hex, ex: #1A1A2E)"
   - "Qual a cor de acento? (hex, ex: #E94560)"
   - "Qual a fonte de titulo? (ex: Playfair Display, Montserrat)"
   - "Tem logo? Se sim, qual o caminho do arquivo?"
   - "Tem preferencia de template? (twitter-branco, minimal-dark, etc.)"
3. **Se selecao assistida:** apresentar 5 combinacoes pre-configuradas e perguntar:
   - "Qual estilo mais combina com sua marca? (1-5)"
   - "Quer personalizar alguma cor ou fonte?"
4. **Apos configuracao:** "Este e o visual final. Aprovar? (s/n/editar)"

## Steps

### 1. Diagnostico Inicial

Perguntar ao usuario:
- "Voce ja tem identidade visual da marca? (cores, fontes, logo)"
- Se SIM: ir para Step 2 (coleta manual)
- Se NAO: ir para Step 3 (selecao assistida)

### 2. Coleta Manual (usuario ja tem identidade)

Coletar as informacoes:

| Campo | Obrigatorio | Exemplo |
|-------|------------|---------|
| Cor primaria | SIM | #1A1A2E |
| Cor de acento | SIM | #E94560 |
| Cor de fundo | NAO (default: #FFFFFF) | #F5F5F5 |
| Cor de texto | NAO (default: #1A1A1A) | #2D2D2D |
| Fonte titulo | SIM | Playfair Display |
| Fonte corpo | NAO (default: Inter) | Inter |
| Logo path | NAO | assets/logo.png |
| Template preferido | NAO | twitter-branco |

Ir para Step 4.

### 3. Selecao Assistida (usuario nao tem identidade)

1. Iniciar servidor de preview:
```bash
./scripts/criar-template-visual.sh --preview
```
2. Abrir browser com galeria de templates disponiveis
3. Mostrar 5 combinacoes pre-configuradas:
   - **Classico:** preto + branco + serifa (Playfair + Inter)
   - **Moderno:** azul escuro + amarelo + sans-serif (Montserrat + Open Sans)
   - **Minimalista:** cinza + branco + mono (Space Grotesk + IBM Plex)
   - **Bold:** preto + vermelho + display (Bebas Neue + Roboto)
   - **Elegante:** dourado + navy + serifa (Cormorant + Lato)
4. Usuario escolhe e personaliza cores/fontes

### 4. Validar Contraste

Para cada combinacao texto-sobre-fundo:
- Texto sobre fundo principal: ratio >= 4.5:1
- Texto sobre cor de acento: ratio >= 4.5:1
- Texto claro sobre fundo escuro (se aplicavel): ratio >= 4.5:1

Se algum contraste falhar:
- Informar ao usuario qual combinacao falhou
- Sugerir ajuste automatico (clarear/escurecer)
- Aguardar aprovacao do ajuste

### 5. Preview Visual

Gerar preview no browser com as configuracoes escolhidas:
```bash
./scripts/criar-template-visual.sh \
  --primary "{cor_primaria}" \
  --accent "{cor_acento}" \
  --bg "{cor_fundo}" \
  --text "{cor_texto}" \
  --font-title "{fonte_titulo}" \
  --font-body "{fonte_corpo}" \
  --template "{template}"
```

Mostrar ao usuario: "Este e o visual final. Aprovar? (s/n/editar)"

### 6. Salvar Configuracao

Se aprovado, salvar em `data/visual-identity.yaml`:

```yaml
brand:
  name: "{nome_marca}"
  updated: "YYYY-MM-DD"

colors:
  primary: "#1A1A2E"
  accent: "#E94560"
  background: "#FFFFFF"
  text: "#1A1A1A"

typography:
  title: "Playfair Display"
  body: "Inter"
  title_weight: "700"
  body_weight: "400"

assets:
  logo: "assets/logo.png"

template:
  preferred: "twitter-branco"
  fallback: "minimal-dark"

contrast:
  text_on_bg: 15.3
  text_on_accent: 5.2
  validated: true
```

### 7. Confirmacao

Informar ao usuario:
- "Identidade visual salva em data/visual-identity.yaml"
- "Todos os carrosseis futuros usarao essas configuracoes automaticamente"
- "Para alterar, execute esta task novamente"

## Output Example

```
TEMPLATE VISUAL CONFIGURADO:

Marca: Core AI
Data: 2026-03-29

Cores:
  Primaria: #1A1A2E (azul escuro)
  Acento: #E94560 (vermelho)
  Fundo: #FFFFFF (branco)
  Texto: #1A1A1A (preto)

Tipografia:
  Titulo: Playfair Display (700)
  Corpo: Inter (400)

Template preferido: twitter-branco
Logo: assets/logo-coreai.png

Contraste WCAG AA:
  Texto #1A1A1A sobre fundo #FFFFFF → 17.4:1 OK
  Texto #FFFFFF sobre acento #E94560 → 4.6:1 OK

Salvo em: data/visual-identity.yaml
Status: APROVADO
```

## Output Example (Selecao Assistida)

```
TEMPLATE VISUAL CONFIGURADO (Via Selecao Assistida):

Marca: Studio Bloom
Data: 2026-04-01
Estilo base: Elegante (#3 da galeria)

Cores (ajustadas pelo usuario):
  Primaria: #2C1810 (marrom escuro)
  Acento: #D4A574 (dourado)
  Fundo: #FFF8F0 (off-white)
  Texto: #2C1810 (marrom escuro)

Tipografia:
  Titulo: Cormorant Garamond (700)
  Corpo: Lato (400)

Template preferido: editorial
Logo: nao configurado

Contraste WCAG AA:
  Texto #2C1810 sobre fundo #FFF8F0 → 12.8:1 OK
  Texto #FFF8F0 sobre acento #D4A574 → 3.1:1 FALHOU → ajustado para #1A0F08 sobre #D4A574 → 7.2:1 OK

Preview: gerado e aprovado pelo usuario
Salvo em: data/visual-identity.yaml
Status: APROVADO
```

## Completion Criteria

- Pelo menos cor primaria + cor de acento + fonte titulo definidas
- Contraste WCAG AA validado (4.5:1 minimo) para todas as combinacoes
- Preview visual gerado e aprovado pelo usuario
- data/visual-identity.yaml salvo com todas as configuracoes
- Usuario informado que futuros carrosseis usarao a identidade

## References

- templates/carousel/ — templates HTML disponiveis
- data/visual-identity.yaml — arquivo de saida
- data/image-generator-rules.md — regras de layout e templates

### Veto Conditions

- id: "CONT_CRIAR_TEMPLATE_VISUAL_001"
  condition: "Cor primaria e fonte de titulo nao definidas"
  check: "Verificar se pelo menos cor primaria + fonte de titulo estao nos inputs ou coletados"
  result: "VETO - BLOCK. Solicitar cor primaria e fonte antes de gerar preview"
  rationale: "Sem cor e fonte minimas, nao e possivel gerar identidade visual utilizavel"

- id: "CONT_CRIAR_TEMPLATE_VISUAL_002"
  condition: "Contraste WCAG AA nao validado (ratio < 4.5:1)"
  check: "Verificar ratio de contraste para todas as combinacoes texto-sobre-fundo"
  result: "VETO - BLOCK. Ajustar cores ate atingir contraste minimo de 4.5:1"
  rationale: "Texto ilegivel compromete toda geracao visual futura de carrosseis"

### Completion Criteria

- [ ] data/visual-identity.yaml criado com configuracao valida e contraste WCAG AA validado
- [ ] Preview visual gerado e aprovado pelo usuario
- [ ] Todas as combinacoes texto-sobre-fundo com ratio >= 4.5:1
- [ ] Usuario informado que futuros carrosseis usarao a identidade configurada
