# Recomendações: Integração de Imagens no Squad de Conteúdo

## Arquitetura Proposta: Provider Unificado

Como não existe um pacote npm que unifique múltiplos providers, a recomendação é criar um módulo `image-provider` com interface unificada que abstrai os diferentes backends.

```
image-provider/
├── providers/
│   ├── pexels.js      # Tier 1 - Gratuito, principal
│   ├── unsplash.js    # Tier 1 - Gratuito, fallback
│   ├── pixabay.js     # Tier 2 - Gratuito, backup
│   ├── flux.js        # Tier 3 - IA generativa ($0.003/img)
│   └── shutterstock.js # Tier 4 - Pago, premium
├── search.js          # Unified search interface
└── index.js           # Exports
```

### Estratégia de Busca (Cascade)

1. **Pexels** (principal) — melhor rate limit gratuito, inclui vídeos
2. **Unsplash** (fallback) — se Pexels não retornar resultados suficientes
3. **Pixabay** (backup) — terceira opção gratuita
4. **Flux Schnell** (generativa) — quando nenhum banco tem imagem adequada ao tema
5. **Shutterstock** (premium) — para conteúdo que exige qualidade máxima

---

## Fase 1: Implementação Mínima (Recomendada para Começar)

### O que fazer

1. Obter API keys gratuitas:
   - Pexels: https://www.pexels.com/api/ (instantâneo)
   - Unsplash: https://unsplash.com/developers (instantâneo)
   - Pixabay: https://pixabay.com/api/docs/ (instantâneo)

2. Instalar SDKs oficiais:
   ```bash
   npm i pexels unsplash-js
   ```

3. Criar módulo de busca unificada com fallback entre providers

### Custo: $0/mês

### Limites estimados:
- Pexels: 20.000 buscas/mês
- Unsplash: ~120.000 buscas/mês (5.000/hr × 24hr)
- Total combinado: ~140.000 buscas/mês gratuitas

---

## Fase 2: Adicionar IA Generativa

### Quando

Quando o squad precisar de imagens que não existem em bancos (ex: ilustrações específicas, mockups personalizados, imagens com estilo específico da marca).

### O que fazer

1. Integrar Flux Schnell via Replicate/fal.ai
   - $0.003/imagem — o mais barato do mercado
   - Apache 2.0 — sem restrições comerciais
   - 3-8 segundos por imagem

2. Ou DALL-E 3 via OpenAI SDK (já instalado se usar outros serviços OpenAI)
   - $0.04-$0.08/imagem
   - Qualidade superior e entende prompts em português

### Custo estimado: $3-$30/mês (1.000-10.000 imagens)

---

## Fase 3: Premium (Se Necessário)

### Quando

Quando o conteúdo exigir imagens premium com licenciamento comercial robusto (ex: campanhas pagas, materiais impressos).

### O que fazer

1. Shutterstock API (free tier: 500 downloads/mês)
2. Getty Images (contato comercial necessário)

---

## Matriz de Decisão

| Critério | Pexels | Unsplash | Pixabay | Flux Schnell | DALL-E 3 | Shutterstock |
|----------|--------|----------|---------|-------------|----------|-------------|
| Custo | Grátis | Grátis | Grátis | $0.003/img | $0.04/img | $$$ |
| SDK Node.js | Oficial | Oficial | Comunidade | Via API | Oficial | Oficial |
| Qualidade | Alta | Alta | Média-Alta | Média | Alta | Muito Alta |
| Vídeos | Sim | Não | Sim | Não | Não | Sim |
| Personalização | Não | Não | Não | Total | Total | Não |
| Rate limit | 200/hr | 5.000/hr | 100/min | Alto | 7/min | 1.000/min |
| Licença comercial | Sim | Sim | Sim | Apache 2.0 | Sim | Platform |

---

## APIs Descartadas

| API | Motivo |
|-----|--------|
| Bing Image Search | Descontinuada em agosto 2025 |
| Google Custom Search | Fechada para novos clientes, fim em 2027 |
| Pond5 | Mínimo $30.000/ano — fora de escopo |
| Getty Images | Sem pricing self-service, requer contato comercial |
| Wikimedia Commons | Licenciamento complexo (varia por arquivo) |

---

## Próximos Passos

1. **@pm** — Priorizar a implementação do módulo `image-provider` no backlog do squad
2. **@dev** — Implementar integração Pexels + Unsplash como Fase 1
3. **@dev** — Testar busca com termos em português e inglês (Pexels suporta 28 idiomas)
4. Obter API keys e armazenar em `.env`
