# Platform Guidelines — Instagram

> Regras tecnicas e limites da plataforma Instagram, atualizadas para 2025-2026.
> Referencia obrigatoria para qualquer agente que crie ou publique conteudo.

---

## Formatos e Especificacoes

### Carrossel (Feed)
| Especificacao | Valor |
|---------------|-------|
| Resolucao recomendada | 1080x1350px (4:5) ou 1080x1080px (1:1) |
| Aspect ratio | 4:5 (retrato, RECOMENDADO) ou 1:1 (quadrado) |
| Slides | Minimo 2, maximo 10 |
| Tipos de slide | Imagens, videos ou misto (imagens + video) |
| Formato de arquivo | JPG, PNG (imagens), MP4 (video) |
| Tamanho maximo | 30MB por imagem, 4GB por video |
| Duracao video por slide | Ate 60 segundos |

### Reels
| Especificacao | Valor |
|---------------|-------|
| Resolucao | 1080x1920px (9:16) |
| Aspect ratio | 9:16 (vertical, tela cheia) |
| Duracao | 15s, 30s, 60s, 90s (ate 15 min em 2025) |
| Formato | MP4 |
| Tamanho maximo | 4GB |
| Safe zone texto | Manter textos 250px acima do fundo (UI overlay) |

### Stories
| Especificacao | Valor |
|---------------|-------|
| Resolucao | 1080x1920px (9:16) |
| Duracao | Ate 60 segundos por story |
| Sequencia | Sem limite de quantidade |
| Interacoes disponiveis | Enquete, quiz, slider, pergunta, link, mencao |
| Safe zone | 14% superior (nome do perfil), 20% inferior (resposta) |

### Single Post (Feed)
| Especificacao | Valor |
|---------------|-------|
| Resolucao | 1080x1350px (4:5) ou 1080x1080px (1:1) |
| Formato | JPG, PNG |
| Tamanho maximo | 30MB |

---

## Limites da API e Publicacao

| Limite | Valor | Notas |
|--------|-------|-------|
| Posts por 24h | 100 (limite tecnico) | Nao e recomendado chegar perto |
| Posts por dia (recomendado) | 25 | Acima disso, risco de shadowban |
| API calls por hora | 200 | Rate limiting da Graph API |
| Hashtags por post | 30 (maximo) | Recomendado: 20-30 |
| Caracteres na caption | 2.200 (maximo) | Primeiras 2 linhas sao criticas (fold) |
| Mencoes por post | 20 (maximo) | Excesso pode ser flagged como spam |
| Caracteres na bio | 150 | |
| Links na bio | 5 (link stickers ilimitados em stories) | |

---

## Horarios de Pico (Brasil)

| Faixa | Horario | Nivel de Engajamento | Melhor Para |
|-------|---------|---------------------|-------------|
| Manha | 7h - 9h | ALTO | Conteudo educativo, motivacional |
| Almoco | 12h - 14h | MEDIO-ALTO | Carrosseis, conteudo leve |
| Noite | 19h - 21h | PICO | Reels, conteudo emocional, ofertas |
| Madrugada | 22h - 00h | MEDIO | Stories, conteudo intimo |
| Baixa | 2h - 6h | BAIXO | Evitar publicacoes |

**Nota:** Horarios sao baseados em medias do mercado brasileiro. O performance-tracker ajusta com dados reais da conta.

---

## Caption — Regras e Boas Praticas

| Regra | Detalhe |
|-------|---------|
| Maximo de caracteres | 2.200 |
| Fold (corte) | Apos ~125 caracteres, aparece "...mais" |
| Primeiras 2 linhas | CRITICAS — decidem se a pessoa expande ou ignora |
| Quebras de linha | Usar caracter invisivel para espacamento (nao contar com Enter) |
| Emojis | Usar com moderacao. 2-5 por caption. Nunca como substituto de texto. |
| CTA | Sempre incluir. Posicao depende da intencao (ver `data/caption-templates.md`) |
| Links | NAO clicaveis no caption. Usar "link na bio" ou stories. |

---

## Hashtags — Regras da Plataforma

| Regra | Detalhe |
|-------|---------|
| Maximo | 30 hashtags por post |
| Recomendado | 20-30 (mix estrategico) |
| Mix ideal | 10 broad + 10 niche + 10 rotating |
| Posicao | No caption ou primeiro comentario (performance similar) |
| Hashtags banidas | Verificar antes de usar. Lista muda frequentemente. |
| Repeticao | NUNCA repetir o set completo em 2 posts seguidos |

Ver `data/hashtag-strategy.md` para estrategia completa.

---

## Carrossel — Regras Especificas

| Regra | Detalhe |
|-------|---------|
| Slides | 3-10 (sweet spot: 5-7) |
| Misto | Permitido combinar imagens e video no mesmo carrossel |
| Primeiro slide | CRITICO — funciona como thumbnail/hook |
| Ultimo slide | Recomendado: CTA claro (salvar, compartilhar, seguir) |
| Navegacao | Swipe esquerda. Indicador de pontos na parte inferior. |
| Re-exibicao | Instagram re-exibe carrosseis nao finalizados no feed (segundo slide) |
| Engagement | Cada swipe conta como interacao para o algoritmo |

---

## Metricas Disponiveis via API

| Metrica | Disponivel | Nivel |
|---------|-----------|-------|
| Reach | SIM | Post e conta |
| Impressions | SIM | Post e conta |
| Likes | SIM | Post |
| Comments | SIM | Post |
| Saves | SIM | Post (Insights) |
| Shares | SIM | Post (Insights) |
| Profile visits | SIM | Conta |
| Website clicks | SIM | Conta |
| Follows | SIM | Conta |
| Story replies | SIM | Story |
| Story exits | SIM | Story |
| Reel plays | SIM | Reel |
| Reel watch time | PARCIAL | Reel (retencao por %) |

---

## Restricoes e Riscos

| Acao | Risco |
|------|-------|
| Postar mais de 25x/dia | Shadowban temporario |
| Repetir mesmas hashtags | Reducao de alcance |
| Usar hashtags banidas | Post nao aparece no Explore |
| Comprar seguidores/engajamento | Penalizacao permanente |
| Automacao excessiva | Restricao de conta |
| Texto excessivo em imagens | Reducao de alcance (legado, menos impacto em 2025) |
| Links externos no caption | Nao funciona (nao sao clicaveis) |

---

## Atualizacoes Recentes (2025)

- Carrosseis podem ter ate 20 slides (em teste, rollout gradual)
- Reels ate 15 minutos (para criadores elegíveis)
- Trial Reels: exibir para nao-seguidores antes de publicar para todos
- Notas no perfil: ate 60 caracteres, visivel para seguidores
- Canais de transmissao: broadcasting direto para seguidores
- Algoritmo prioriza "original content" sobre reposts

> **Fonte:** Declaracoes oficiais de Adam Mosseri, Instagram Creators blog, Social Insider 2025 Report.
