# WORKFLOW VISUAL — SISTEMA DE CONTEUDO CASTELO FORTE

## Visao Geral: 4 Fases do Pipeline

```
╔══════════════╗    ╔══════════════╗    ╔══════════════╗    ╔══════════════╗
║  FASE 1      ║    ║  FASE 2      ║    ║  FASE 3      ║    ║  FASE 4      ║
║  CRIAR       ║ →  ║  VISUALIZAR  ║ →  ║  PUBLICAR    ║ →  ║  AUTOMATIZAR ║
║  (Copy)      ║    ║  (Imagem)    ║    ║  (Instagram)  ║    ║  (Pipeline)  ║
╚══════════════╝    ╚══════════════╝    ╚══════════════╝    ╚══════════════╝
   MANUAL hoje         MANUAL hoje         PRECISA SETUP       CONSTRUIR
```

---

## FASE 1 — CRIAR (Copy / Texto)

### 3 Portas de Entrada

```
PORTA A: FRASE / IDEIA    PORTA B: ARQUIVO TEXTO    PORTA C: VIDEO / AUDIO
   *briefing                  *atomizar                  *multiplicar
   *carrossel                 Le + extrai atomos         Transcreve + atomiza
   *reels                                                
   *stories                                              
        |                         |                          |
        v                         v                          v
   1 carrossel              5-10 carrosseis             30+ pecas
   (20-30 min)              (1-2 horas)                (4-8 horas)
```

### Porta A — Frase / Ideia Rapida

1. Content Chief diagnostica intencao (1-2 perguntas)
2. Prescreve: formato + tipo de post + framework de copy + tamanho
3. Direciona para @carousel-creator
4. Carousel Creator gera 3 opcoes de hook (Slide 1)
5. Usuario escolhe o hook
6. Gera 10 slides completos + caption + 3 opcoes de CTA
7. Oraculo valida (score >= 80%)

**Comandos:**
- `*briefing` — Inicia coleta com diagnostico do Chief
- `*carrossel` — Vai direto pro carousel-creator
- `*reels` — Cria roteiro de Reel
- `*stories` — Cria sequencia de Stories

### Porta B — Arquivo / Texto Existente

1. Le o arquivo completo
2. Extrai "atomos" — ideias independentes com potencial de post
3. Sugere 5-10 carrosseis com tema + angulo
4. Aprova quais criar
5. Cria cada um pelo mesmo fluxo da Porta A

**Comando:** `*atomizar` + caminho do arquivo

### Porta C — Video / Audio (Multiplicar)

1. Transcreve o video/audio (Whisper local ou YouTube captions)
2. Limpa a transcricao
3. Extrai 30+ atomos de conteudo
4. Planeja formatos: carrosseis, reels, stories, frases, briefs de email
5. Aprova o plano
6. Cria cada peca com o agent especializado
7. Valida tudo pelo Oraculo
8. Distribui no calendario

**Comando:** `*multiplicar` + YouTube URL ou caminho do arquivo

---

## FASE 2 — VISUALIZAR (Gerar Imagens)

### Templates Disponiveis — 18 no total

#### Familia TWITTER (6 layouts) — Estilo Tweet

| Layout | Nome | Foto? | Melhor Para |
|--------|------|-------|-------------|
| twitter/impact | Foto fullbleed + overlay + header | Obrigatoria | CAPA, hook, statement |
| twitter/text-top | Texto em cima, imagem embaixo | Opcional | Argumento + prova visual |
| twitter/image-top | Imagem em cima, texto embaixo | Opcional | Mostrar antes de explicar |
| twitter/bubble-bottom | Foto + card glass embaixo | Obrigatoria | Impacto com contexto |
| twitter/bubble-top | Foto + card glass no topo | Obrigatoria | Variacao do bubble-bottom |
| twitter/list | Lista com icones check/X | Opcional | Comparacoes, pros/contras |

#### Familia IMPERIAL (7 layouts) — Estilo Revista/Editorial

| Layout | Nome | Foto? | Melhor Para |
|--------|------|-------|-------------|
| imperial/cover | Foto fullbleed + titulo UPPERCASE | Obrigatoria | CAPA do carrossel |
| imperial/internal-A | Imagem em cima, texto embaixo | Obrigatoria | Foto cintura pra cima |
| imperial/internal-B | Texto em cima, imagem embaixo | Obrigatoria | Texto + foto apoio |
| imperial/internal-C | Imagem no meio | Obrigatoria | Graficos, objetos |
| imperial/internal-D | Foto fullbleed + balao embaixo | Obrigatoria | Pessoa OK |
| imperial/internal-E | Foto fullbleed + balao em cima | Obrigatoria | NUNCA pessoa |
| imperial/cta | Foto fullbleed + botao/acao | Obrigatoria | Ultimo slide — CTA |

#### Familia STANDALONE (5 layouts)

| Layout | Nome | Foto? | Melhor Para |
|--------|------|-------|-------------|
| minimal-dark | Fundo escuro, texto branco | Nao | Imperial, polemico |
| editorial-clean | Fundo off-white, serif + sans | Nao | Educativo, historia |
| bold-gradient | Gradiente escuro + magenta | Nao | Crenca, provocacao |
| brand-bar | Header + footer com marca | Nao | Series, listas |
| split-accent | Layout 60/40 diagonal | Nao | Oferta, comparacoes |

#### Image Generator (5 templates PNG)

| Template | Fundo | Uso |
|----------|-------|-----|
| twitter-black | Preto | S1 (hook) |
| twitter-branco | Branco | S2-S10 (internos) |
| post-imagem-capa | Foto + overlay | Capa editorial |
| post-imagem-interna-foto | Claro + foto | Slide com foto |
| post-imagem-interna-texto | Claro, so texto | Slide so texto |

### Como Gerar Imagens (Manual)

**Opcao 1 — Script generate.mjs:**
```bash
cd squads/conteudo/app/image-generator/
node generate.mjs --batch slides.json --output ./output/
```

**Opcao 2 — Templates HTML + Playwright:**
1. Escolher template HTML
2. Substituir placeholders
3. Renderizar via Playwright → PNG 1080x1350

**Opcao 3 — IA (Gemini/OpenRouter):**
Gera imagens criativas. Requer GEMINI_API_KEY ou OPENROUTER_API_KEY.

---

## FASE 3 — PUBLICAR (Instagram)

### Setup Inicial (primeira vez)

1. Criar App Facebook Developer (tipo Business)
2. Gerar Access Token (Graph Explorer)
   - Permissoes: instagram_basic, instagram_content_publish, pages_read_engagement, pages_show_list
   - Converter para token longo (60 dias)
3. Obter Business Account ID
4. Criar conta imgBB + gerar API key
5. Salvar tudo no .env

**Comando:** `*setup-publicacao`

### Variaveis Necessarias (.env)

| Variavel | Obrig.? | Onde pegar |
|----------|---------|------------|
| INSTAGRAM_ACCESS_TOKEN | SIM | Graph Explorer |
| INSTAGRAM_BUSINESS_ACCOUNT_ID | SIM | Graph API |
| IMGBB_API_KEY | SIM | api.imgbb.com |
| GEMINI_API_KEY | nao | aistudio.google |
| OPENROUTER_API_KEY | nao | openrouter.ai |
| BLOTATO_API_KEY | nao | blotato.com |

### Fluxo de Publicacao

1. PNGs prontos (2-10 imagens, 1080x1350)
2. Preparar caption (<= 2200 chars + 30 hashtags)
3. Dry-run (valida sem publicar)
4. Aprovacao explicita ("sim, publicar")
5. Upload imagens → imgBB
6. Criar containers → Graph API
7. Polling ate FINISHED (timeout 60s)
8. Publicar carrossel
9. URL capturada + metadata registrada

### Limites

- 2-10 imagens por carrossel
- Caption <= 2200 caracteres
- Token expira em 60 dias
- Maximo 25 posts por 24h
- Cada imagem < 8MB
- Apenas conta Business

---

## FASE 4 — AUTOMATIZAR (Pipeline Unificado)

### Pipeline Completo (a construir)

```
Step 1:  [CHECKPOINT] Briefing do usuario
Step 2:  [AGENT] Diagnostico do Chief
Step 3:  [AGENT] Carousel Creator gera copy
Step 4:  [CHECKPOINT] Aprovacao do copy
Step 5:  [AGENT] Oraculo valida (score >= 80%)
Step 6:  [AGENT] Escolher template + gerar imagens
Step 7:  [CHECKPOINT] Aprovacao visual
Step 8:  [AGENT] Otimizar caption + hashtags
Step 9:  [AGENT] Dry-run de publicacao
Step 10: [CHECKPOINT] Aprovacao final
Step 11: [AGENT] Publicar no Instagram
Step 12: [AGENT] Performance tracker
Step 13: [AGENT] Sugerir repurpose
```

### Etapas Opcionais (inspirado no OpenSquad)

- Pesquisa de trends com web_search
- 5 temas ranqueados por potencial viral
- Checkpoint de escolha do usuario

---

## STATUS DE CADA ETAPA

| # | Etapa | Existe? | Como usar hoje | O que falta |
|---|-------|---------|----------------|-------------|
| 1 | Briefing | SIM | *briefing | - |
| 2 | Diagnostico | SIM | Content Chief automatico | - |
| 3 | Criar copy | SIM | *carrossel | - |
| 4 | Aprovar copy | SIM | Usuario le e aprova | - |
| 5 | Validar Oraculo | SIM | *validar | - |
| 6 | Gerar imagens | SIM | node generate.mjs | Falta orquestracao |
| 7 | Aprovar imagens | SIM | Usuario olha PNGs | - |
| 8 | Caption + hashtags | SIM | Carousel Creator gera | - |
| 9 | Dry-run | SIM | node publicar-instagram.js --dry-run | Precisa .env |
| 10 | Aprovar publicacao | SIM | Usuario confirma | - |
| 11 | Publicar | SIM | node publicar-instagram.js | Precisa .env |
| 12 | Tracking | SIM | @performance-tracker | - |
| 13 | Repurpose | SIM | *repurpose | - |
| - | Pesquisa trends | NAO | - | Adicionar web_search |
| - | Pipeline unificado | NAO | - | Criar workflow |
