# Ferramentas Disponíveis — Squad Conteúdo

**Propósito:** Catálogo das ferramentas externas que o squad PODE e DEVE usar sem precisar pedir autorização.
**Regra inviolável:** quando o pedido cai em uma das situações abaixo, o agente USA a ferramenta direto. NÃO pergunta. NÃO sugere MCP.

---

## Apify (scraping de Instagram, TikTok, LinkedIn, etc.)

### Status
✅ ATIVO. Token configurado em `squads/conteudo/.env` (variável `APIFY_TOKEN`).

### COMO USAR (regra absoluta)

**Via API direta com curl/fetch. NUNCA via MCP.**

- ❌ NÃO usar: `mcp__docker-gateway__call-actor` ou similar
- ❌ NÃO usar: instalar Apify MCP
- ✅ USAR: chamada HTTP direta na API REST do Apify

### Endpoint padrão

```
POST https://api.apify.com/v2/acts/{actorId}/run-sync-get-dataset-items?token={APIFY_TOKEN}&timeout=120
```

### Actors mais usados (verificados pelo squad)

| Caso de uso | Actor ID | Input esperado |
|---|---|---|
| Post único do Instagram | `apify~instagram-post-scraper` | `{"username":["https://www.instagram.com/p/SHORTCODE/"],"resultsLimit":1}` |
| Perfil Instagram (últimos posts) | `apify~instagram-profile-scraper` | `{"usernames":["nome_perfil"],"resultsLimit":10}` |
| Reels do Instagram | `apify~instagram-reel-scraper` | Similar ao post-scraper |
| Stories Instagram | `apify~instagram-stories-scraper` | `{"usernames":["nome_perfil"]}` |
| TikTok video | `clockworks~tiktok-scraper` | `{"postURLs":["https://www.tiktok.com/..."]}` |
| LinkedIn perfil | `harvestapi~linkedin-profile-scraper` | `{"profileUrls":["https://linkedin.com/in/..."]}` |
| YouTube vídeo | `streamers~youtube-scraper` | `{"startUrls":[{"url":"https://youtube.com/..."}]}` |

### Exemplo testado (POST do Instagram)

```bash
TOKEN=$(grep APIFY_TOKEN /Users/castelofortefloripa/claude/squads/conteudo/.env | cut -d= -f2)

curl -s "https://api.apify.com/v2/acts/apify~instagram-post-scraper/run-sync-get-dataset-items?token=${TOKEN}&timeout=120" \
  -H "Content-Type: application/json" \
  -d '{"username":["https://www.instagram.com/p/SHORTCODE/"],"resultsLimit":1}' \
  -o /tmp/ig-post.json
```

Depois, parse com node:
```bash
node -e "
const d = JSON.parse(require('fs').readFileSync('/tmp/ig-post.json','utf-8'))[0];
console.log('AUTOR:', d.ownerFullName, '@'+d.ownerUsername);
console.log('LIKES:', d.likesCount);
console.log('CAPTION:', d.caption);
console.log('SLIDES:', (d.childPosts||[]).map(c=>c.displayUrl));
"
```

Pra ler imagens dos slides (carrossel), faz curl pra cada URL retornada:
```bash
mkdir -p /tmp/ig-slides
i=1
node -e "const d=JSON.parse(require('fs').readFileSync('/tmp/ig-post.json','utf-8'))[0]; (d.childPosts||[]).forEach(c=>console.log(c.displayUrl))" > /tmp/urls.txt
while IFS= read -r url; do
  curl -s -o "/tmp/ig-slides/slide-$(printf %02d $i).jpg" "$url"
  i=$((i+1))
done < /tmp/urls.txt
```

Depois leia as imagens com tool `Read` (Claude lê imagens nativamente).

### Quando usar Apify (dispara AUTOMATICAMENTE)

Se o pedido do usuário contém qualquer destes gatilhos:
- "post do Instagram de [X]"
- "carrossel do [perfil]"
- "olha esse link do Instagram"
- "análise de concorrente"
- "pesquisa de concorrente"
- "ver como [perfil] tá performando"
- "transcreve esse post"
- "extrai texto desse carrossel"
- "fetch desse Instagram"
- "estuda esse perfil"
- "stalk do [perfil]"
- "benchmark [perfil]"

→ NÃO PERGUNTA. NÃO SUGERE PRINT. **Usa Apify via API direta agora.**

### Atribuição de responsabilidade

| Tipo de tarefa | Agente responsável |
|---|---|
| Scrape de 1 post → análise visual + textual | qualquer agente do squad (use Apify direto) |
| Mapeamento completo de concorrente (perfil + top posts + análise) | `competitor-analyst` |
| Inspirar/decifrar padrão de carrossel | `carousel-creator` |
| Inspirar/decifrar reel | `reels-creator` |

### Custo (transparência)

Cada actor Apify cobra centavos por execução. Para post único é ~$0,01. Para perfil com 10 posts é ~$0,05. Sem preocupação até centenas de scrapes/mês.

### Troubleshooting

- **Status 403 / forbidden:** token expirou. Renovar em `console.apify.com` e atualizar `.env`.
- **Actor retorna vazio:** post pode ser de conta privada. Apify só consegue contas públicas.
- **Timeout:** aumentar o `timeout=` na query string (max 300 segundos).

---

## Outras ferramentas do squad

### Sharp (geração de PNG)
- Status: ✅ ativo via `squads/conteudo/app/image-generator/generate.mjs`
- Quando usar: gerar PNG de print tweet, carrossel, post visual
- Comando: `node generate.mjs --batch slides.json --output ./`

### Playwright MCP (renderização HTML headless)
- Status: ⚠️ disponível mas DESPRIORIZADO
- Quando usar: SÓ se Sharp/generate.mjs não suprir
- Por que: já temos pipeline Sharp + SVG funcionando, não precisa Playwright

### EXA (web search)
- Status: ✅ ativo via MCP `mcp__plugin_everything-claude-code_exa__web_search_exa`
- Quando usar: pesquisar cases, matérias, dados verificáveis pra alimentar banco-cases-externos
- Preferir EXA antes de WebFetch (EXA é específico pra busca, retorna highlights)

### WebFetch
- Status: ✅ ativo (built-in)
- Quando usar: ler URL específica conhecida
- Limitação: 403 em muitos sites grandes (Bloomberg, Reuters), tentar EXA primeiro

### Instagram Graph API
- Status: ✅ ativo. Token em `.env` (`INSTAGRAM_ACCESS_TOKEN`)
- Quando usar: insights da PRÓPRIA conta do cliente
- Limitação: NÃO funciona pra contas terceiras (pra isso use Apify)

---

## Checklist do squad (antes de pedir ajuda ao usuário)

Antes de dizer "preciso de print" ou "não consigo acessar X", verifique:

- [ ] É post do Instagram? → **Apify**
- [ ] É concorrente? → **Apify + competitor-analyst**
- [ ] É busca de informação geral? → **EXA**
- [ ] É URL conhecida? → **WebFetch**
- [ ] É análise da própria conta? → **Instagram Graph API**
- [ ] É geração de imagem? → **Sharp/generate.mjs**

Se um item da lista resolve o pedido, **execute. NÃO pergunte. NÃO desvie pra MCP.**

---

## Última atualização

2026-05-15 — Documento criado em resposta a feedback do cliente Igreja Castelo Forte:
> "Eu tive que te pedir cinco vezes para usar API-FI. Quando eu falo qualquer coisa referente à análise de concorrente ou pesquisa de concorrente, eu quero que você já saiba qual é o caminho a usar, sem que eu precise te pedir."

Erro a evitar para sempre: assumir que Apify só funciona via MCP quando MCP não está conectado. A API direta sempre funciona com o token do `.env`.
