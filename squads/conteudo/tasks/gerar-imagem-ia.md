# Gerar Imagem IA

## Task Anatomy

- **task_name:** Gerar Imagem IA
- **executor:** publishing-manager (Tier 1)
- **elicit:** true
- **description:** Gerar imagens via IA (Gemini/OpenRouter) para carrosseis, headers, backgrounds ou quote cards usando framework SCDS (Subject, Setting, Style, Technical)
- **pre_conditions:**
  - GEMINI_API_KEY ou OPENROUTER_API_KEY configurado em .env
  - Objetivo da imagem definido (header, background, quote card, imagem criativa)
  - Contexto da marca disponivel (opcional: data/visual-identity.yaml)
- **post_conditions:**
  - Imagem gerada em output/images/ ou pasta do carrossel
  - Metadados registrados (prompt usado, modelo, dimensoes, path)
- **veto_conditions:**
  - Gerar sem prompt estruturado (SCDS: Subject, Setting, Style, Technical)
  - Gerar sem aprovacao do usuario no prompt final
  - Sem API key configurada — orientar usuario a configurar .env
  - Imagem com dimensoes incorretas para o destino (ex: carrossel != 1080x1350)
  - Prompt com texto literal embutido na imagem (IA gera texto distorcido)
- **completion_criteria:**
  - Imagem aprovada pelo usuario
  - Metadados registrados (prompt, modelo, dimensoes, path)
  - Imagem salva no path correto com nome descritivo

## Steps

### 1. Coletar Objetivo

Perguntar ao usuario:
- Qual o objetivo? Header de carrossel? Background? Quote card? Imagem criativa?
- Qual o tema/assunto da imagem?
- Onde sera usada? (carrossel, post feed, stories, thumbnail)

### 2. Montar SCDS

Coletar informacoes para cada dimensao do framework:

| Dimensao | Descricao | Exemplo |
|----------|-----------|---------|
| **S**ubject | Tema principal, objeto central | "empresario confiante em escritorio moderno" |
| **S**etting | Contexto visual, ambiente | "escritorio minimalista, luz natural lateral" |
| **S**tyle | Estetica, mood, referencia | "fotografia editorial, tons quentes, profundidade de campo" |
| **T**echnical | Dimensoes, formato, resolucao | "1080x1350px, alta resolucao, sem texto" |

### 3. Carregar Identidade Visual

Se existe `data/visual-identity.yaml`:
- Carregar cores da marca (primaria, acento, fundo)
- Carregar fontes e mood board
- Incorporar palette no campo Style do SCDS

### 4. Apresentar Prompt para Aprovacao

Mostrar ao usuario o prompt SCDS montado:
```
PROMPT SCDS:
Subject: {descricao}
Setting: {descricao}
Style: {descricao}
Technical: {dimensoes}, {formato}

Aprovar prompt? (s/n/editar)
```

Aguardar aprovacao explicita antes de gerar.

### 5. Gerar Imagem

Executar geracao via script:
```bash
./scripts/gerar-imagem-ia.sh \
  --prompt "{scds_completo}" \
  --output {path_destino} \
  --size {WxH} \
  --mode {test|production}
```

Modo test: gera 1 imagem para validacao rapida.
Modo production: gera em resolucao final.

### 6. Apresentar Resultado

Mostrar imagem gerada ao usuario para avaliacao:
- Se aprovada: salvar no path final
- Se insatisfatoria: ir para Step 7 (refinamento)

### 7. Refinamento PRIO (se necessario)

Aplicar metodo PRIO (Progressive Refinement by Isolated Optimization):
1. Identificar qual dimensao SCDS precisa ajuste
2. Isolar a variavel (mudar APENAS 1 dimensao por vez)
3. Gerar 3 variacoes da dimensao isolada
4. Usuario seleciona a melhor
5. Repetir ate aprovacao

### 8. Salvar e Registrar

- Salvar imagem final no path correto
- Registrar metadados no manifest do carrossel (se aplicavel)
- Adicionar ao historico de prompts para reuso futuro

## Output Example

```
IMAGEM GERADA:

Objetivo: Header de carrossel — posicionamento de marca
Modelo: gemini-2.0-flash
Dimensoes: 1080x1350px

PROMPT SCDS:
  Subject: Empresario solo em pe, postura confiante, olhando para horizonte
  Setting: Escritorio moderno minimalista, janela panoramica com cidade ao fundo, luz dourada do por-do-sol
  Style: Fotografia editorial premium, tons quentes (dourado + azul escuro), profundidade de campo rasa, mood aspiracional
  Technical: 1080x1350px, alta resolucao, sem texto, sem logo, foco no sujeito

Path: output/images/header-posicionamento-marca-01.png
Status: APROVADO pelo usuario

Metadados:
  - Prompt: {hash}
  - Modelo: gemini-2.0-flash
  - Data: 2026-03-29
  - Variacoes testadas: 2
```

## Completion Criteria

- Objetivo coletado e SCDS montado com as 4 dimensoes
- Prompt aprovado pelo usuario antes da geracao
- Imagem gerada com dimensoes corretas para o destino
- Imagem aprovada pelo usuario (com ou sem refinamento PRIO)
- Metadados registrados (prompt, modelo, dimensoes, path)
- Imagem salva no path correto

## Modo Face Swap (Provedor Visual)

Quando o objetivo e colocar o owner em uma cena de referencia (trocar a pessoa da imagem):

### Regras inviolaveis

1. **Ordem das imagens:** SEMPRE identidade primeiro, referencia depois
2. **Minimo 2 fotos de identidade** de angulos diferentes (de `assets/face-reference/`)
3. **Modelo Pro obrigatorio** (`gemini-3-pro-image-preview`) — Flash nao tem fidelidade suficiente
4. **1 variacao por vez** — avaliar antes de gerar mais
5. **Aprovacao do prompt** antes de chamar a API

### Prompt obrigatorio

Usar o template documentado em `data/face-swap-guide.md`. NAO improvisar prompts.

Palavras-chave obrigatorias no prompt:
- "photorealistic"
- "real photo shoot, not a collage"
- "preserve realistic anatomy, hands, face structure, eyes, skin texture"

### Config da API

```json
{
  "generationConfig": {
    "responseModalities": ["TEXT", "IMAGE"],
    "imageConfig": {
      "aspectRatio": "4:5",
      "imageSize": "2K"
    }
  }
}
```

### Guia completo

Consultar `data/face-swap-guide.md` — contem prompt exato, erros comuns, e fluxo passo a passo.

## References

- data/visual-identity.yaml — cores e fontes da marca (se existir)
- data/face-swap-guide.md — guia completo de face swap / provedor visual
- scripts/gerar-imagem-ia.sh — script de geracao
- data/image-generator-rules.md — regras de layout e templates

### Veto Conditions

- id: "CONT_GERAR_IMAGEM_IA_001"
  condition: "Prompt SCDS nao montado ou nao aprovado pelo usuario"
  check: "Verificar se as 4 dimensoes SCDS estao definidas e usuario aprovou o prompt final"
  result: "VETO - BLOCK. Montar SCDS completo e apresentar para aprovacao antes de gerar"
  rationale: "Gerar sem prompt aprovado despernica tokens de API e pode gerar imagem fora do contexto"

- id: "CONT_GERAR_IMAGEM_IA_002"
  condition: "API key nao configurada (GEMINI_API_KEY ou OPENROUTER_API_KEY)"
  check: "Verificar se .env contem pelo menos uma API key valida"
  result: "VETO - BLOCK. Orientar usuario a configurar .env via setup-publicacao"
  rationale: "Sem API key configurada, a geracao de imagens e impossivel"

### Completion Criteria

- [ ] Prompt SCDS montado com 4 dimensoes e aprovado pelo usuario antes da geracao
- [ ] Imagem gerada com dimensoes corretas para o destino e aprovada pelo usuario
- [ ] Metadados registrados (prompt, modelo, dimensoes, path)
- [ ] Imagem salva no path correto com nome descritivo
