# Face Swap — Prompt Padrão para Nano Banana Pro

## REGRA INVIOLÁVEL

Este é o prompt correto para substituir rostos em imagens usando o Gemini (Nano Banana Pro).
NUNCA fazer de outro jeito. A ordem das imagens e a estrutura do prompt são críticas.

## Estrutura da Chamada API

### Ordem das imagens (IMPORTA):
1. **PRIMEIRO**: Fotos de identidade (fotos reais da pessoa) — mínimo 3 fotos
2. **DEPOIS**: Referências visuais (a cena/look que quer reproduzir)
3. **POR ÚLTIMO**: O prompt

### Prompt Padrão:

```
Generate a single photorealistic image.

The first images are identity reference photos of the same real person. Preserve the real face, age range, skin tone, hair, body feel and identity from these photos.

The next images are scene and style reference images. Use them as the main source for composition, framing, lighting, pose, camera distance, wardrobe mood, background treatment and overall art direction.

Create a new image that looks like the visual references, but replace the person in the reference scene with the real person from the identity photos.

Reference 1: {nome} | {estilo visual} | {mini prompt da referência}

Keep the final image natural and convincing. It must look like a real photo shoot, not a collage.

Preserve realistic anatomy, hands, face structure, eyes, skin texture, lighting logic and perspective.

Do not copy logos, watermarks, brand names or text from the reference images.

Do not add text overlays.

Output format: 1080x1350px.
```

### Configuração da API:

```json
{
  "generationConfig": {
    "responseModalities": ["TEXT", "IMAGE"]
  }
}
```

### Modelo preferido:
- `gemini-2.5-flash-image` (Nano Banana) — rápido, bom resultado
- `gemini-3-pro-image-preview` (Nano Banana Pro) — melhor qualidade
- `gemini-3.1-flash-image-preview` — mais recente

### Pontos críticos:
- A **ordem das imagens importa**: primeiro identidade, depois referência
- O prompt precisa dizer **explicitamente** o que é identidade vs referência
- Pedir "**photorealistic**" e "**real photo shoot, not a collage**"
- Pedir preservação de **anatomia, mãos, rosto, textura de pele**
- Enviar **mínimo 3 fotos** de identidade para melhor resultado
- Se gerar variações, adicionar "Variation: this is version X of Y" no final

### O que NÃO fazer:
- NÃO pedir "face swap" — pedir "replace the person with the real person"
- NÃO enviar apenas 1 foto de identidade — enviar 3+
- NÃO inverter a ordem (cena primeiro, identidade depois)
- NÃO usar prompts genéricos tipo "troca o rosto"
- NÃO usar InsightFace, Segmind ou outras ferramentas — usar Gemini/Nano Banana

### Fotos de identidade do operador:
- `assets/face-reference/castelo-forte-07.jpg` — Principal (P&B, braços cruzados)
- `assets/face-reference/castelo-forte-04.jpg` — Palco, gola alta preta (redimensionar antes)
- `assets/face-reference/castelo-forte-08.JPG` — Palco, gesticulando (redimensionar antes)
- Redimensionar fotos grandes com: `sips -Z 600 {input} --out {output}`
