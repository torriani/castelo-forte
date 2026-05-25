# Publicar no Instagram

## Task Anatomy

- **task_name:** Publicar no Instagram
- **executor:** publishing-manager (Tier 1)
- **elicit:** true
- **description:** Publicar carrossel no Instagram via Graph API com fluxo dry-run, aprovacao explicita e publicacao. Suporta carrosseis de 2-10 imagens com caption otimizada e hashtags estrategicas.
- **pre_conditions:**
  - PNGs renderizados do carrossel (2-10 imagens, JPEG ou PNG)
  - Caption pronta (texto do carrossel aprovado)
  - Credenciais em .env: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID, IMGBB_API_KEY
- **post_conditions:**
  - Post publicado no Instagram com URL capturada
  - Metadata registrada (URL, data, slides, caption)
  - Handoff para @performance-tracker realizado
- **veto_conditions:**
  - Publicar sem executar dry-run primeiro
  - Publicar sem aprovacao explicita do usuario
  - Rate limit excedido (>25 posts/24h)
  - Credenciais ausentes ou invalidas em .env
  - Imagens em formato diferente de JPEG/PNG
  - Caption > 2200 caracteres
  - Menos de 2 ou mais de 10 imagens
  - Imagens com dimensoes inconsistentes entre si
- **completion_criteria:**
  - Dry-run executado com sucesso
  - Aprovacao explicita do usuario obtida
  - Post publicado no Instagram
  - URL do post capturada
  - Metadata registrada
  - Handoff para @performance-tracker realizado

## Steps

### 1. Verificar Credenciais

Ler .env e confirmar presenca de:
- `INSTAGRAM_ACCESS_TOKEN` — token de acesso da Graph API
- `INSTAGRAM_BUSINESS_ACCOUNT_ID` — ID da conta business
- `IMGBB_API_KEY` — para upload de imagens (URLs publicas necessarias para Graph API)

Se alguma credencial ausente:
```
CREDENCIAIS FALTANDO:
- INSTAGRAM_ACCESS_TOKEN: Configure em https://developers.facebook.com/
  1. Acesse Facebook Developer Portal
  2. Crie app tipo Business
  3. Adicione Instagram Graph API
  4. Gere token com permissoes: instagram_basic, instagram_content_publish
- IMGBB_API_KEY: Configure em https://api.imgbb.com/
```

NAO prosseguir sem credenciais completas.

### 2. Verificar Rate Limit

Perguntar ao usuario: "Quantos posts voce ja fez hoje nesta conta?"
- Se >= 25: BLOQUEAR publicacao (limit da Graph API e 25/24h)
- Se < 25: prosseguir

### 3. Validar Imagens

Listar PNGs do carrossel e validar:
- Formato: JPEG ou PNG
- Quantidade: 2-10 imagens
- Dimensoes: consistentes entre slides (idealmente 1080x1350)
- Tamanho: cada imagem < 8MB

```bash
# Listar e validar imagens
ls -la output/slides/rendered/*.png
```

Se validacao falhar: informar problema especifico e orientar correcao.

### 4. Preparar Caption

Usar caption do carrossel aprovado e otimizar:
- Texto principal: hook + contexto + CTA (max 2200 caracteres)
- Hashtags: 30 total distribuidas em 3 camadas:
  - 10 broad (alto volume, >500k posts): #empreendedorismo #marketing
  - 10 niche (medio volume, 50k-500k): #marketingdigitalbrasil #copywriting
  - 10 rotating (baixo volume, 5k-50k): #posicionamentodemarca #vendasonline

Validar que caption total <= 2200 caracteres.

### 5. Executar Dry-Run

```bash
node scripts/publicar-instagram.js \
  --images "slide-01.png,slide-02.png,...,slide-XX.png" \
  --caption "{caption_completa}" \
  --hashtags "{hashtags}" \
  --dry-run
```

O dry-run deve:
- Validar token de acesso
- Fazer upload das imagens para URL publica (imgbb)
- Simular criacao do container sem publicar
- Retornar resumo do que sera publicado

### 6. Apresentar Resumo para Aprovacao

```
DRY-RUN CONCLUIDO:

Conta: @{nome_da_conta}
Slides: {N} imagens
Dimensoes: 1080x1350px
Caption: "{preview primeiras 100 chars}..."
Hashtags: 30 (10 broad + 10 niche + 10 rotating)
Caracteres: {N}/2200

Confirma publicacao? (s/n)
```

Aguardar "s" ou "sim" explicito. Qualquer outra resposta = cancelar.

### 7. Publicar

```bash
node scripts/publicar-instagram.js \
  --images "slide-01.png,slide-02.png,...,slide-XX.png" \
  --caption "{caption_completa}" \
  --hashtags "{hashtags}"
```

Capturar URL do post publicado e ID do media object.

### 8. Registrar Metadata

Salvar em manifest do carrossel ou arquivo de historico:

```yaml
publication:
  platform: instagram
  account: "@{conta}"
  post_url: "https://www.instagram.com/p/{shortcode}/"
  media_id: "{id}"
  published_at: "YYYY-MM-DD HH:MM"
  slides: N
  caption_length: N
  hashtags: 30
```

### 9. Handoff

Entregar para @performance-tracker:
- URL do post
- Data/hora de publicacao
- Numero de slides
- Tipo de conteudo (carrossel)
- Metricas iniciais esperadas (baseline da conta)

## Output Example

```
PUBLICACAO INSTAGRAM:

DRY-RUN:
  Conta: @coreai.oficial
  Slides: 10 imagens (1080x1350px)
  Caption: "95% dos empreendedores digitais sao INVISIVEIS pro comprador certo..." (847 chars)
  Hashtags: 30 (10 broad + 10 niche + 10 rotating)
  Status: OK — pronto para publicar

APROVACAO: Sim (usuario confirmou)

PUBLICADO:
  URL: https://www.instagram.com/p/ABC123xyz/
  Media ID: 17890012345678
  Data: 2026-03-29 14:30
  Slides: 10

HANDOFF:
  Enviado para @performance-tracker
  Metricas a acompanhar: alcance, salvamentos, compartilhamentos, comentarios (24h/48h/7d)
```

## Completion Criteria

- Credenciais verificadas e validas
- Rate limit checado (< 25 posts/24h)
- Imagens validadas (formato, quantidade, dimensoes)
- Caption <= 2200 caracteres com hashtags otimizadas
- Dry-run executado com sucesso
- Aprovacao explicita do usuario obtida
- Post publicado no Instagram
- URL do post capturada e registrada
- Handoff para @performance-tracker realizado

## References

- scripts/publicar-instagram.js — script de publicacao
- data/visual-identity.yaml — identidade visual da marca
- Instagram Graph API: https://developers.facebook.com/docs/instagram-api/guides/content-publishing

### Veto Conditions

- id: "CONT_PUBLICAR_INSTAGRAM_001"
  condition: "Credenciais ausentes ou invalidas no .env"
  check: "Verificar se INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID e IMGBB_API_KEY estao validos"
  result: "VETO - BLOCK. Orientar usuario a executar setup-publicacao para configurar credenciais"
  rationale: "Sem credenciais validas, a publicacao na Graph API falha com erro de autenticacao"

- id: "CONT_PUBLICAR_INSTAGRAM_002"
  condition: "Dry-run nao executado ou aprovacao do usuario nao obtida"
  check: "Verificar se dry-run retornou sucesso e usuario confirmou com sim explicito"
  result: "VETO - BLOCK. Executar dry-run e obter aprovacao antes de publicar"
  rationale: "Publicar sem dry-run e aprovacao pode resultar em post com erro visivel publicamente"

### Completion Criteria

- [ ] Dry-run executado com sucesso e aprovacao explicita do usuario obtida
- [ ] Post publicado no Instagram com URL capturada e metadata registrada
- [ ] Imagens validadas (formato, quantidade 2-10, dimensoes consistentes) e caption <= 2200 caracteres
- [ ] Handoff para performance-tracker realizado com dados da publicacao
