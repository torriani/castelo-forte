# Prompt de Pesquisa Estruturado

## Sub-queries Pesquisadas

1. **Bancos gratuitos:** "free stock photo APIs Pexels Unsplash Pixabay 2025 2026"
2. **Bancos pagos:** "paid stock photo APIs Shutterstock Getty Adobe Stock API pricing 2025 2026"
3. **IA generativa:** "AI image generation APIs DALL-E Midjourney Stable Diffusion Flux API pricing 2025 2026"
4. **SDKs Node.js:** "Node.js npm packages for stock photo API integration unified image search"
5. **Search engines:** "Google Custom Search API SerpAPI Bing Image Search API programmatic image search pricing"

## Estratégia

- 5 workers Haiku em paralelo
- WebSearch + WebFetch (deep read) em cada worker
- Cobertura: gratuitos, pagos, IA, SDKs, search engines
