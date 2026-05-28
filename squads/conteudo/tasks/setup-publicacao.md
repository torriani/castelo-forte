# Setup de Publicacao — Onboarding Completo

## Task Anatomy

- **task_name:** Setup de Publicacao
- **executor:** publishing-manager (Tier 1)
- **elicit:** true
- **description:** Wizard de onboarding que guia o usuario passo a passo na configuracao de todas as APIs necessarias para gerar imagens IA e publicar no Instagram. Constroi o .env automaticamente.
- **pre_conditions:**
  - Squad conteudo ativado
  - Usuario quer usar funcionalidades de geracao de imagens ou publicacao
- **post_conditions:**
  - Arquivo .env criado na raiz do squad com todas as chaves validas
  - Conexao Instagram testada com sucesso
  - Identidade visual basica configurada (opcional)
- **veto_conditions:**
  - Salvar token de API em arquivo versionado pelo git (somente .env, que e gitignored)
  - Prosseguir sem validar cada chave inserida
  - Pular etapa de teste de conexao
  - Aceitar token vazio ou placeholder como valido
- **completion_criteria:**
  - .env existe com pelo menos as chaves obrigatorias preenchidas
  - Teste de conexao Instagram retorna nome da conta corretamente
  - Usuario confirma que o setup esta completo

## Fluxo do Onboarding

### Etapa 0 — Diagnostico

Verificar o que ja esta configurado:
1. Verificar se `.env` existe na raiz do squad (`squads/conteudo/.env`)
2. Se existe: ler e verificar quais chaves estao preenchidas vs vazias
3. Mostrar status atual:

```
STATUS DE CONFIGURACAO
━━━━━━━━━━━━━━━━━━━━━
Instagram (publicar carrosseis):
  INSTAGRAM_ACCESS_TOKEN:        [NAO CONFIGURADO]
  INSTAGRAM_BUSINESS_ACCOUNT_ID: [NAO CONFIGURADO]
  IMGBB_API_KEY:                 [NAO CONFIGURADO]

Publicacao Multi-Plataforma:
  BLOTATO_API_KEY:               [NAO CONFIGURADO]

Geracao de Imagens IA:
  GEMINI_API_KEY:                [NAO CONFIGURADO]
  OPENROUTER_API_KEY:            [NAO CONFIGURADO]

O que deseja configurar?
1. Tudo (Instagram + Blotato + Imagens IA) — recomendado
2. Apenas Instagram (publicar direto via Graph API)
3. Apenas Blotato (multi-plataforma: IG + LinkedIn + X + TikTok)
4. Apenas Imagens IA (gerar imagens)
5. Verificar configuracao existente
```

### Etapa 0.5 — Metodo de Publicacao

```
COMO DESEJA PUBLICAR NO INSTAGRAM?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Conexao Direta (Instagram Graph API)
   → Controle total, sem intermediario
   → Precisa: App Facebook + Token + imgBB
   → Gratis, renovar token a cada 60 dias

2. Via Blotato MCP
   → Multi-plataforma (IG + LinkedIn + X + TikTok + YouTube)
   → Precisa: conta blotato.com + API key
   → Mais simples de configurar, agendamento incluso

3. Ambos (recomendado)
   → Blotato como primario (agendamento + multi-plataforma)
   → Conexao direta como fallback (se Blotato estiver fora)
```

**Se usuario escolheu opcao com Blotato (2 ou 3):** pular para Etapa B1.
**Se usuario escolheu opcao sem Blotato (1):** pular para Etapa 1.
**Se escolheu "Tudo" ou "Ambos":** fazer Etapa B1 primeiro, depois Etapa 1.

### Etapa B1 — Blotato: Configurar MCP Multi-Plataforma

```
ETAPA B1 — BLOTATO MCP (MULTI-PLATAFORMA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Blotato permite publicar em Instagram, LinkedIn, X, TikTok e YouTube
a partir de uma unica interface MCP.

PASSO A PASSO:
1. Abra: https://blotato.com
2. Crie uma conta (ou logue)
3. Conecte suas redes sociais (Instagram, LinkedIn, etc.)
4. Va em Settings → API → Copie sua API Key

Cola a API Key aqui:
```

**Ao receber:**
1. Validar formato
2. Testar conexao: chamar `blotato_list_accounts` via MCP
3. Se sucesso: listar contas conectadas ("Contas encontradas: @instagram, @linkedin...")
4. Salvar no .env como `BLOTATO_API_KEY`
5. Configurar MCP em `.claude/settings.local.json`:
   ```json
   {
     "mcpServers": {
       "blotato": {
         "url": "https://mcp.blotato.com/mcp",
         "headers": { "Authorization": "Bearer {BLOTATO_API_KEY}" }
       }
     }
   }
   ```

```
Blotato configurado!

Contas conectadas:
  Instagram: @{username} ✅
  LinkedIn: {name} ✅
  X/Twitter: @{handle} ✅

MCP ativo: blotato → publicar e agendar em todas as plataformas.

Quando publicar, voce pode escolher:
  - *publicar (direto no Instagram via Graph API)
  - *publicar --blotato (via Blotato, multi-plataforma)
  - *publicar --blotato --agendar "2026-04-05 09:00" (agendar)
```

### Etapa 1 — Instagram: Criar App Facebook

**Mostrar ao usuario:**

```
ETAPA 1/6 — CRIAR APP NO FACEBOOK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Voce precisa de um App do Facebook para publicar no Instagram via API.

PASSO A PASSO:
1. Abra: https://developers.facebook.com/apps/
2. Clique em "Criar App"
3. Selecione tipo: "Business"
4. De um nome ao app (ex: "Publicador Conteudo")
5. Selecione sua conta Business Manager
6. Na tela do app, va em "Adicionar Produto" → "Instagram Graph API" → "Configurar"

REQUISITOS PREVIOS:
- Conta Instagram BUSINESS (nao personal, nao creator)
  → Se sua conta e personal/creator: Configuracoes → Conta → Mudar para Business
- Pagina Facebook CONECTADA a conta Business do Instagram
  → Se nao tem: crie uma pagina e conecte em Instagram → Configuracoes → Conta Vinculada

Quando terminar, me diz "pronto" que eu sigo para a proxima etapa.
Se algo deu errado, cola a mensagem de erro aqui que eu te ajudo.
```

### Etapa 2 — Instagram: Gerar Token

```
ETAPA 2/6 — GERAR ACCESS TOKEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agora vamos gerar o token que permite publicar posts.

PASSO A PASSO:
1. Abra: https://developers.facebook.com/tools/explorer/
2. No topo, selecione o App que voce criou
3. Clique em "Generate Access Token"
4. Quando pedir permissoes, marque TODAS estas:
   - instagram_basic
   - instagram_content_publish
   - pages_read_engagement
   - pages_show_list
5. Clique em "Generate Access Token"
6. Copie o token gerado

IMPORTANTE: Este e um token de curta duracao (1h). Vamos converter para 60 dias.

Cola o token aqui:
```

**Ao receber o token:**

1. Validar formato (deve comecar com "EAA" e ter 100+ caracteres)
2. Se invalido: pedir novamente com orientacao especifica
3. Se valido: converter para token de longa duracao (60 dias):

```
Convertendo token para longa duracao (60 dias)...

Abra este link no navegador (substitua os valores):
https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=SEU_APP_ID&client_secret=SEU_APP_SECRET&fb_exchange_token=TOKEN_CURTO

Onde encontrar:
- SEU_APP_ID: Facebook Developer → Seu App → Configuracoes → Basico → ID do App
- SEU_APP_SECRET: Mesma tela → Chave Secreta do App

Cola aqui o token longo que apareceu no navegador:
```

4. Salvar no .env como `INSTAGRAM_ACCESS_TOKEN`

### Etapa 3 — Instagram: Obter Business Account ID

```
ETAPA 3/6 — OBTER BUSINESS ACCOUNT ID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agora preciso do ID da sua conta Instagram Business.

PASSO A PASSO:
1. Abra: https://developers.facebook.com/tools/explorer/
2. No campo GET, digite: /me/accounts
3. Clique em "Submit"
4. Voce vai ver suas Paginas do Facebook. Copie o "id" da pagina conectada ao Instagram
5. Agora no campo GET, digite: /{PAGE_ID}?fields=instagram_business_account
6. Clique em "Submit"
7. Copie o valor de "instagram_business_account.id"

Cola o ID aqui (so numeros):
```

**Ao receber:**
1. Validar formato (so digitos, 10-20 caracteres)
2. Testar conexao: fazer GET `/{id}?fields=name,username` com o token
3. Se sucesso: mostrar "Conta encontrada: @{username} ({name})"
4. Salvar no .env como `INSTAGRAM_BUSINESS_ACCOUNT_ID`

### Etapa 4 — imgBB: Chave para Hosting de Imagens

```
ETAPA 4/6 — IMGBB (HOSTING DE IMAGENS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O Instagram exige que as imagens estejam em uma URL publica.
Usamos o imgBB como hosting temporario (gratis).

PASSO A PASSO:
1. Abra: https://api.imgbb.com/
2. Clique em "Get API Key"
3. Crie uma conta (ou logue com Google)
4. Copie a API Key que aparece

Cola a API Key aqui:
```

**Ao receber:**
1. Validar formato (32 caracteres alfanumericos)
2. Salvar no .env como `IMGBB_API_KEY`

### Etapa 5 — Gemini: Chave para Geracao de Imagens

```
ETAPA 5/6 — GEMINI API (GERACAO DE IMAGENS IA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para gerar imagens com IA, usamos o Google Gemini (gratis ate 500 imagens/dia).

PASSO A PASSO:
1. Abra: https://aistudio.google.com/apikey
2. Clique em "Create API Key"
3. Selecione qualquer projeto (ou crie um novo)
4. Copie a chave gerada

Cola a API Key aqui:
```

**Ao receber:**
1. Validar formato (comeca com "AIza", ~39 caracteres)
2. Salvar no .env como `GEMINI_API_KEY`

### Etapa 6 — Teste Final

```
ETAPA 6/6 — TESTE DE CONEXAO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vou testar cada servico configurado...

[1/3] Instagram API...
  → GET /{account_id}?fields=name,username
  → Resultado: @{username} ({name}) ✅

[2/3] imgBB Upload...
  → Upload de imagem de teste (1x1 pixel)
  → Resultado: URL publica gerada ✅

[3/3] Gemini API...
  → Geracao de imagem de teste ("blue square 100x100")
  → Resultado: Imagem gerada com sucesso ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SETUP COMPLETO!

Tudo configurado e testado. Voce ja pode usar:
  *gerar-imagem — Gerar imagens com IA
  *criar-template — Configurar visual da marca
  *publicar — Publicar carrosseis no Instagram

Arquivo .env salvo em: squads/conteudo/.env
IMPORTANTE: Este arquivo NAO deve ser commitado no git.
Renovar token Instagram a cada 60 dias.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Tratamento de Erros

### Token Instagram invalido
```
O token parece invalido. Verificar:
- Voce copiou o token COMPLETO? (deve ter 100+ caracteres, comeca com "EAA")
- O app do Facebook tem as permissoes corretas? (instagram_content_publish)
- A conta Instagram e BUSINESS? (nao personal/creator)

Tenta de novo. Cola o token aqui:
```

### Business Account ID nao encontrado
```
Nao consegui encontrar a conta Instagram Business.

Possiveis causas:
1. A Pagina Facebook NAO esta conectada ao Instagram
   → Abra a Pagina do Facebook → Configuracoes → Instagram → Conectar Conta
2. A conta Instagram NAO e tipo Business
   → Instagram → Configuracoes → Conta → Mudar para Conta Profissional → Business
3. O token nao tem a permissao pages_read_engagement
   → Volte ao Graph Explorer e gere um novo token com TODAS as permissoes

Qual o erro que apareceu? Cola aqui que eu te ajudo:
```

### Gemini Key invalida
```
A chave do Gemini nao funcionou.

Verificar:
- A chave comeca com "AIza"?
- Voce tem um projeto ativo no Google Cloud?
- A API Generative Language esta habilitada no projeto?

Se preferir, pode pular essa etapa e usar OpenRouter depois.
Quer pular? (sim/nao)
```

### imgBB Key invalida
```
A chave do imgBB nao funcionou.

Verificar:
- Voce copiou a chave completa? (32 caracteres)
- A conta do imgBB foi ativada? (verifique o email de confirmacao)

Cola a chave novamente:
```

## Renovacao de Token (Lembrete Automatico)

O token do Instagram expira a cada 60 dias. O publishing-manager deve:
1. Verificar data de criacao do token no .env (campo INSTAGRAM_TOKEN_CREATED_AT)
2. Se faltam menos de 7 dias: avisar o usuario no greeting
3. Se expirou: bloquear publicacao e guiar renovacao

```
AVISO: Seu token do Instagram expira em {X} dias.
Para renovar: *setup-publicacao (selecione opcao 4 — Renovar token)
```

## Output Example

```
SETUP DE PUBLICACAO — RESULTADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Configuracao concluida em 2026-03-30

Servicos configurados:
  Instagram Publishing:  ✅ @castelofortefloripa (operador da Castelo Forte)
  imgBB Image Hosting:   ✅ Conta ativa
  Gemini Image AI:       ✅ 500 imagens/dia gratis
  OpenRouter:            ⏭️ Nao configurado (opcional)

Arquivo: squads/conteudo/.env
Proxima renovacao de token: 2026-05-29 (60 dias)

Comandos disponiveis:
  *gerar-imagem — Gerar imagem IA para carrossel
  *criar-template — Configurar identidade visual
  *publicar — Publicar carrossel no Instagram
```

## References

| Referencia | Arquivo |
|-----------|---------|
| Script de publicacao | scripts/publicar-instagram.js |
| Script de geracao IA | scripts/gerar-imagem-ia.sh |
| Script de templates | scripts/criar-template-visual.sh |
| Template de .env | .env.example |
| Instagram Graph API | https://developers.facebook.com/docs/instagram-api/ |
| imgBB API | https://api.imgbb.com/ |
| Google AI Studio | https://aistudio.google.com/apikey |
| OpenRouter | https://openrouter.ai/ |

### Veto Conditions

- id: "CONT_SETUP_PUBLICACAO_001"
  condition: "Token de API salvo em arquivo versionado pelo git (fora do .env)"
  check: "Verificar se todas as chaves estao SOMENTE no .env (gitignored)"
  result: "VETO - BLOCK. Mover chaves para .env e remover de qualquer arquivo versionado"
  rationale: "Credenciais em arquivo versionado sao vazamento de seguranca — somente .env"

- id: "CONT_SETUP_PUBLICACAO_002"
  condition: "Etapa de teste de conexao pulada ou nao executada"
  check: "Verificar se os 3 testes (Instagram API, imgBB, Gemini) retornaram sucesso"
  result: "VETO - BLOCK. Executar testes de conexao antes de marcar setup como completo"
  rationale: "Chaves nao testadas podem estar invalidas — teste garante funcionamento real"

### Completion Criteria

- [ ] .env criado com pelo menos as chaves obrigatorias preenchidas e testadas
- [ ] Teste de conexao Instagram retorna nome da conta corretamente
- [ ] Cada chave validada individualmente (formato e funcionalidade)
- [ ] Usuario informado sobre renovacao de token (60 dias) e comandos disponiveis
