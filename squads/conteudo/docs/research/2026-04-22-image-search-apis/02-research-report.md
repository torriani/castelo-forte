# Relatório de Pesquisa: APIs de Busca e Geração de Imagens

## 1. Bancos de Imagens Gratuitos

### Pexels

| Aspecto | Detalhe |
|---------|---------|
| **Rate limit** | 200 req/hora, 20.000/mês (gratuito; ilimitado sob solicitação) |
| **Autenticação** | API Key via header |
| **SDK Node.js** | `npm i pexels` (oficial, Node + browser) |
| **Conteúdo** | Fotos + vídeos, curados manualmente, 170+ países, 28 idiomas |
| **Licença** | Gratuita para uso comercial, atribuição apreciada mas não obrigatória |
| **Uptime** | 99.99%, 15B+ requests/mês processados |
| **Veredito** | Melhor relação custo-benefício para começar. Inclui vídeos. |

### Unsplash

| Aspecto | Detalhe |
|---------|---------|
| **Rate limit** | Demo: 50 req/hora; Produção: 5.000 req/hora |
| **Autenticação** | `Authorization: Client-ID {KEY}` |
| **SDK Node.js** | `npm i unsplash-js` (oficial, mas arquivado — ainda funcional) |
| **Tamanhos** | raw, full, regular, small, thumb |
| **Licença** | Gratuita para uso comercial, hotlinking permitido com tracking |
| **Observação** | SDK oficialmente arquivado, mas API continua ativa |

### Pixabay

| Aspecto | Detalhe |
|---------|---------|
| **Rate limit** | 100 req/60 segundos |
| **Autenticação** | API key via query string |
| **Modelo** | Download-first: deve hospedar as imagens localmente (cache mínimo 24h) |
| **Conteúdo** | Fotos + vídeos + ilustrações vetoriais |
| **Licença** | Pixabay License (similar a CC0, uso comercial livre) |
| **Observação** | Menor ecossistema npm; menos SDKs mantidos |

### Wikimedia Commons

| Aspecto | Detalhe |
|---------|---------|
| **Rate limit** | Sem API key necessária, limites não documentados claramente |
| **API** | MediaWiki API (mais complexa) |
| **Conteúdo** | 90M+ arquivos, foco em conteúdo educacional/histórico |
| **Licença** | Varia por arquivo (requer verificação individual) |
| **Veredito** | Útil para nichos específicos, não recomendado como fonte principal |

---

## 2. Bancos de Imagens Pagos

### Shutterstock

| Aspecto | Detalhe |
|---------|---------|
| **Rate limit** | Free: 100 req/hora; Pago: 1.000 req/minuto |
| **Downloads** | Free: 500/mês; Pago: ilimitado ou pay-per-use |
| **Autenticação** | OAuth 2.0 (preferido) ou HTTP Basic Auth |
| **Acervo** | 3M+ imagens (free tier), centenas de milhões no total |
| **Busca** | Operadores booleanos (AND, OR, NOT), bulk search (5 imgs/req) |
| **Licença** | Platform License — uso comercial em conteúdo digital |
| **Tokens OAuth** | v2/ não expiram; 1/ expiram em 1 hora |

### Getty Images

| Aspecto | Detalhe |
|---------|---------|
| **Rate limit** | QPS (Queries Per Second) por conta (ex: 5 QPS) |
| **Autenticação** | API Key header + Bearer token via OAuth 2.0 |
| **Tamanhos** | thumb até high_res_comp |
| **Pricing** | Contato direto com vendas (sem self-service) |
| **Veredito** | Premium mas sem transparência de preços; difícil de integrar automaticamente |

### Adobe Stock

| Aspecto | Detalhe |
|---------|---------|
| **Rate limit** | Atualmente sem rate limit enforced (monitoram uso) |
| **Pricing** | Baseado em créditos/assinatura |
| **Veredito** | Bom ecossistema Adobe, mas API menos documentada para automação |

### iStock (Getty)

| Aspecto | Detalhe |
|---------|---------|
| **Modelo** | Créditos: 1 crédito/foto Essentials, 3/Signature |
| **Vídeo** | 6-18 créditos; UHD 4K até 60fps |
| **Licença** | Royalty-free, perpétua, uso ilimitado após compra |

---

## 3. IA Generativa (Criar Imagens sob Demanda)

### DALL-E 3 (OpenAI)

| Aspecto | Detalhe |
|---------|---------|
| **Preço** | $0.04-$0.08 (standard), $0.08-$0.12 (HD) |
| **Resoluções** | 1024x1024, 1024x1792, 1792x1024 (fixas) |
| **Velocidade** | 5-15 segundos |
| **Rate limit** | 7 imagens/minuto |
| **Licença** | Usuário é dono da imagem, uso comercial total |
| **SDK** | OpenAI oficial (`openai` npm) |

### Flux Pro (Black Forest Labs)

| Aspecto | Detalhe |
|---------|---------|
| **Preço** | Pro: $0.04-$0.06; Dev: $0.025-$0.03; Schnell: $0.003/img |
| **Velocidade** | 3-8 segundos (mais rápido que DALL-E) |
| **Resoluções** | Variáveis (não fixas) |
| **Licença** | Schnell = Apache 2.0 (totalmente livre) |
| **Hosting** | Replicate, Together AI, fal.ai |
| **Veredito** | Schnell a $0.003/img é imbatível para volume |

### Stable Diffusion 3.5

| Aspecto | Detalhe |
|---------|---------|
| **Preço** | Hospedado: $0.02-$0.05; Self-hosted: <$0.01/img |
| **Resoluções** | Customizáveis |
| **Licença** | Community license (restrições para grandes empresas) |
| **Veredito** | Menor custo se self-hosted, mas requer infraestrutura |

### GPT Image 1.5

| Aspecto | Detalhe |
|---------|---------|
| **Preço** | $0.03-$0.19 (varia com resolução/qualidade) |
| **Rate limit** | ~5 imagens/minuto |
| **Diferencial** | Integração contextual com GPT-5.4 |

### Midjourney

| Aspecto | Detalhe |
|---------|---------|
| **Preço** | $0.01-$0.15 (varia por velocidade: Relaxed/Fast/Turbo) |
| **Velocidade** | 15-60 segundos |
| **API** | Disponível mas baseada em assinatura |
| **Qualidade** | Considerada a melhor qualidade artística |

---

## 4. APIs de Search Engines

### SerpAPI

| Aspecto | Detalhe |
|---------|---------|
| **Free** | $0 — 250 buscas/mês, 50/hora |
| **Starter** | $25 — 1.000/mês, 200/hora |
| **Developer** | $75 — 5.000/mês, 1.000/hora |
| **Production** | $150 — 15.000/mês, 3.000/hora |
| **APIs** | Google Images, Google Images Light, Bing Images |
| **Veredito** | Útil para buscar imagens contextuais (não stock) |

### Google Custom Search API

| Aspecto | Detalhe |
|---------|---------|
| **Status** | FECHADA para novos clientes. Existentes até 01/01/2027 |
| **Preço** | 100 grátis/dia + $5 por 1.000 queries (max 10.000/dia) |
| **Alternativa** | Google recomenda Vertex AI Search |

### Bing Image Search API

| Aspecto | Detalhe |
|---------|---------|
| **Status** | DESCONTINUADA em agosto 2025 |

---

## 5. SDKs Node.js Disponíveis

| Pacote | Provider | Instalação | Status |
|--------|----------|-----------|--------|
| `pexels` | Pexels | `npm i pexels` | Oficial, mantido |
| `unsplash-js` | Unsplash | `npm i unsplash-js` | Oficial, arquivado (funcional) |
| `node-pexels` | Pexels | `npm i node-pexels` | Não-oficial |
| `openai` | DALL-E/GPT Image | `npm i openai` | Oficial, mantido |
| Não existe | Multi-provider unificado | — | Oportunidade para criar |

---

## Fontes

- Pexels API: https://www.pexels.com/api/
- Unsplash Developers: https://unsplash.com/developers
- Shutterstock API: https://api-reference.shutterstock.com/
- Getty Images API: https://developers.gettyimages.com/docs/
- SerpAPI: https://serpapi.com/pricing
- Google Custom Search: https://developers.google.com/custom-search/v1/overview
- LaoZhang Blog (comparativo 2026): https://blog.laozhang.ai/en/posts/free-image-api
- TokenMix (pricing IA 2026): https://tokenmix.ai/blog/dall-e-api-pricing
