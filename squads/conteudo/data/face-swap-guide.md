# Guia de Face Swap / Provedor Visual — Gemini API

## Objetivo

Trocar a pessoa de uma imagem de referência pela identidade real do owner (Castelo Forte),
mantendo composição, iluminação, pose e estilo visual da referência original.

## Quando usar

- Criar imagens para carrosséis onde o Castelo Forte aparece em cenas específicas
- Recriar referências visuais de terceiros com a identidade do owner
- Gerar fotos editoriais com o rosto real em contextos diferentes

## Fotos de identidade disponíveis

Ficam em `assets/face-reference/` (9 fotos configuradas em `data/visual-identity.yaml`).

**Regra:** Usar no MÍNIMO 2 fotos de ângulos diferentes para melhor fidelidade.
A foto primária é `castelo-forte-01.jpg`, mas combinar com `castelo-forte-07.jpg` (frontal)
e outras de ângulos variados melhora muito o resultado.

## Prompt que funciona

```
Generate a single photorealistic image.

The first images are identity reference photos of the same real person. Preserve the real face, age range, skin tone, hair, body feel and identity from these photos.

The next images are scene and style reference images. Use them as the main source for composition, framing, lighting, pose, camera distance, wardrobe mood, background treatment and overall art direction.

Create a new image that looks like the visual references, but replace the person in the reference scene with the real person from the identity photos.

Keep the final image natural and convincing. It must look like a real photo shoot, not a collage.

Preserve realistic anatomy, hands, face structure, eyes, skin texture, lighting logic and perspective.

Do not copy logos, watermarks, brand names or text from the reference images.

Do not add text overlays.

Output format: 1080x1350px.
```

## Regras obrigatórias

### 1. Ordem das imagens na chamada API

A ORDEM IMPORTA. Sempre nesta sequência:

1. **Primeiro:** Fotos de identidade (suas fotos pessoais) — inline_data parts
2. **Depois:** Referências visuais (a cena/look que quer reproduzir) — inline_data parts

O prompt diz "The first images are identity..." e "The next images are scene...".
Se inverter a ordem, o resultado sai errado.

### 2. Configuração da API Gemini

```json
{
  "contents": [{
    "role": "user",
    "parts": [
      { "text": "PROMPT AQUI" },
      { "inline_data": { "mime_type": "image/jpeg", "data": "BASE64_FOTO_IDENTIDADE_1" } },
      { "inline_data": { "mime_type": "image/jpeg", "data": "BASE64_FOTO_IDENTIDADE_2" } },
      { "inline_data": { "mime_type": "image/jpeg", "data": "BASE64_REFERENCIA_VISUAL" } }
    ]
  }],
  "generationConfig": {
    "responseModalities": ["TEXT", "IMAGE"],
    "imageConfig": {
      "aspectRatio": "4:5",
      "imageSize": "2K"
    }
  }
}
```

### 3. Modelos recomendados

| Modelo | ID | Qualidade | Custo |
|--------|----|-----------|-------|
| Nano Banana Pro | `gemini-3-pro-image-preview` | Melhor | Maior |
| Nano Banana Flash | `gemini-2.5-flash-image` | Boa | Menor |
| Nano Banana 3.1 | `gemini-3.1-flash-image-preview` | Boa | Menor |

**Regra:** Para face swap de qualidade, usar sempre o Pro. Flash gera resultados
inferiores em fidelidade facial.

### 4. Aspect ratios

| Formato | Valor | Uso |
|---------|-------|-----|
| Feed 4:5 | `1080x1350` | Carrossel, post feed |
| Feed 1:1 | `1080x1080` | Post quadrado |
| Story 9:16 | `1080x1920` | Stories, reels |

## O que NÃO fazer (erros comuns que gastam créditos)

### Erro 1: Mandar apenas 1 foto de identidade
**Problema:** Rosto sai genérico, não parece o Castelo Forte.
**Solução:** Mandar 2-4 fotos de ângulos diferentes.

### Erro 2: Inverter a ordem (referência antes da identidade)
**Problema:** A IA não sabe quem é quem.
**Solução:** SEMPRE identidade primeiro, referência depois.

### Erro 3: Usar Flash para face swap
**Problema:** Fidelidade facial baixa, queima créditos em tentativas.
**Solução:** Usar Pro de primeira. Uma geração Pro > três tentativas Flash.

### Erro 4: Prompt vago sem instruções de fidelidade
**Problema:** Resultado parece colagem ou ilustração.
**Solução:** Sempre incluir: "photorealistic", "real photo shoot, not a collage",
"preserve realistic anatomy, hands, face structure".

### Erro 5: Gerar muitas variações simultâneas
**Problema:** Gasta N vezes mais créditos.
**Solução:** Gerar 1 variação, avaliar, refinar prompt, depois gerar mais se aprovado.

### Erro 6: Não pedir aprovação antes de gerar
**Problema:** Gera imagem errada e desperdiça créditos.
**Solução:** SEMPRE mostrar o prompt montado e pedir aprovação antes de chamar a API.

## Fluxo correto (passo a passo)

1. Receber referência visual do usuário (imagem da cena desejada)
2. Selecionar 2-4 fotos de identidade de `assets/face-reference/`
3. Montar prompt usando o template acima
4. Mostrar prompt para aprovação do usuário
5. Gerar 1 imagem com modelo Pro
6. Mostrar resultado para avaliação
7. Se insatisfatório: ajustar prompt (mudar 1 variável por vez) e gerar novamente
8. Se aprovado: salvar no path correto

## Endpoint

```
POST https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}
```

## Referências

- Aplicação de teste: `criativos/public/test-api-composer.html` (porta 3028)
- Fotos de identidade: `assets/face-reference/`
- Configuração visual: `data/visual-identity.yaml`
