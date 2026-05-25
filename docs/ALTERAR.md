# ALTERAR — Como Editar Tudo

Este squad foi feito pra ser **modificado**. Voice DNA, templates, agentes, regras — tudo pode mudar conforme a Castelo Forte evolui.

---

## 1. Voice DNA (tom de voz, expressões, anti-padrões)

**Path:** `workspace/businesses/igreja-castelo-forte/brand/voice/`

| Arquivo | O que controla | Quando editar |
|---|---|---|
| `nucleo.md` | Tom de voz central, sentimento que toda peça deve carregar | Quando o posicionamento da igreja muda |
| `expression.md` | Frases assinatura, vocabulário próprio | Quando aparece uma expressão nova marcante |
| `aberturas-poderosas.md` | Hooks que funcionam (provados em posts) | Sempre que descobrir um hook que viralizou |
| `anti-padroes.md` | O que a igreja NUNCA diz/faz | Quando perceber que algo está vazando IA ou genérico |
| `tonalidades.md` | Quando usar tom suave / quando usar tom forte | Quando criar campanha nova com tom diferente |

**Como editar:**
```bash
code workspace/businesses/igreja-castelo-forte/brand/voice/nucleo.md
```

Depois de qualquer alteração no voice DNA:
1. Commit (`git add` + `git commit`)
2. Push pro repo
3. **Avise o time** — eles precisam dar `git pull` antes de criar novo conteúdo

---

## 2. Identidade visual / Brand

**Path:** `workspace/businesses/igreja-castelo-forte/brand/`

| Arquivo | O que controla |
|---|---|
| `identidade.md` | Cores, tipografia, princípios visuais |
| `tokens.yaml` (se existir) | Tokens de design (paletas, espaçamentos) |
| `assets/` | Logos, fontes, ícones |
| `templates.yaml` (se existir) | Quais templates do catálogo usar pra Castelo Forte |

---

## 3. Templates de carrossel

**Path:** `squads/conteudo/templates/carousel/`

Cada template é uma pasta:
```
squads/conteudo/templates/carousel/{nome-template}/
├── template.html       # estrutura HTML
├── style.css           # CSS
├── config.yaml         # campos disponíveis (title, body, footer, etc)
└── preview-01.png      # preview pra ver no catálogo
```

### Catálogo oficial
9 templates ativos em `squads/conteudo/templates/catalog.yaml`:
- **Imperial** (T01-T03): dark, premium, alto contraste
- **Twitter** (T04-T06): branco, estilo print-tweet
- **Claude** (T07-T09): azul, técnico, autoral

### Criar template novo
1. Duplique um template existente:
   ```bash
   cp -r squads/conteudo/templates/carousel/twitter-branco squads/conteudo/templates/carousel/meu-template-novo
   ```
2. Edite `template.html` + `style.css`
3. Adicione no `catalog.yaml`:
   ```yaml
   - id: T10
     slug: meu-template-novo
     familia: Twitter
     descricao: "Variação do branco com header sutil"
   ```
4. Rode o builder do catálogo:
   ```bash
   node squads/conteudo/scripts/build-catalogo.mjs
   ```
5. Abra `squads/conteudo/templates/CATALOGO.html` pra ver o preview.

### Editar template existente
1. Edite os arquivos da pasta do template
2. Re-renderize um carrossel teste pra ver se quebrou:
   ```bash
   node squads/conteudo/scripts/render-carrossel.mjs <arquivo-teste.md> --template <nome-template>
   ```

### Templates depreciados
`squads/conteudo/templates/_arquivo/` — 7 templates antigos arquivados. NÃO usar. Se quiser ressuscitar algum, mova de volta pra `squads/conteudo/templates/carousel/` e atualize o `catalog.yaml`.

---

## 4. Agentes (Tier 0, 1, 2)

**Path:** `squads/conteudo/agents/`

Cada agente é um arquivo `.md` com frontmatter YAML + corpo de instruções.

Exemplo: `squads/conteudo/agents/content-chief.md`

### Editar persona / comandos / heurísticas
1. Abra o agente que quer alterar
2. Edite a seção desejada:
   - `## Persona` — tom do agente
   - `## Scope` — o que faz / não faz
   - `## Heuristicas` — regras de decisão
   - `## Comandos` — comandos disponíveis
   - `## Output Examples` — exemplos de resposta esperada
3. Commit + push
4. No Claude Code, ative o agente de novo (`@content-chief`) — ele recarrega.

### Criar agente novo
1. Duplique um agente existente:
   ```bash
   cp squads/conteudo/agents/print-tweet-creator.md squads/conteudo/agents/meu-agente-novo.md
   ```
2. Ajuste o frontmatter:
   ```yaml
   ---
   name: meu-agente-novo
   description: "Cria peças X usando técnica Y"
   ---
   ```
3. Reescreva a persona, scope, heurísticas
4. Se for Tier 1 (criador), atualize o `content-chief.md` pra delegar pra ele
5. Atualize `squads/conteudo/ARCHITECTURE.md` adicionando ele na tabela

### Anti-padrões em agentes
Veja `squads/conteudo/data/.claude/CLAUDE.md` (se existir) ou `squads/conteudo/data/REGRA-DNA-CLIENTE.md` pra regras gerais.

---

## 5. Regras e checklists

**Path:** `squads/conteudo/data/` e `squads/conteudo/checklists/`

### Regras inviolaveis
`squads/conteudo/data/regras-inviolaveis.md` — regras que TODO agente deve seguir. Editar com cuidado.

### Filtro Anti-IA
`squads/conteudo/checklists/filtro-anti-ia.md` — versão humana (markdown) das regras.
`squads/conteudo/scripts/validate-anti-ia.sh` — versão executável (grep determinístico).

**Importante:** se você alterar a regra humana, precisa atualizar o script também. As 2 fontes precisam concordar. Ver `squads/conteudo/scripts/anti-ia-structural.mjs` pro lado estrutural (HTML/JSON).

### Oráculo de formato
`squads/conteudo/checklists/oraculo-posts.md` — checklist de qualidade por formato (carrossel, reels, stories).

### Frameworks de copy
`squads/conteudo/data/frameworks-copy.md` — 9 frameworks (Abertura Curiosa, Autoridade, etc).
Pode adicionar / remover. Avise o `@content-chief.md` (heurísticas) se mudar.

---

## 6. Pipeline de publicação

**Path:** `apps/publisher-instagram/publisher.mjs`

### Mudar horários de publicação
Edite o `plist` do LaunchAgent:
```bash
nano ~/Library/LaunchAgents/com.castelo-forte.instagram-publisher.plist
# Altere os <Hour> e <Minute>
launchctl unload ~/Library/LaunchAgents/com.castelo-forte.instagram-publisher.plist
launchctl load -w ~/Library/LaunchAgents/com.castelo-forte.instagram-publisher.plist
```

### Mudar lógica do filtro anti-IA do publisher
`publisher.mjs` linha ~155 — bloco `GATE ANTI-IA`. Editar com cuidado.

### Mudar retry / janela de publicação
`publisher.mjs`:
- `MAX_ATTEMPTS` (linha 8) — quantas vezes tenta antes de marcar como failed
- `RETRY_DELAYS_MS` (linha 9) — quanto espera entre tentativas
- `findDuePost` (linha ~99) — janela de 5min antes / 10min depois do horário

---

## 7. Histórico / Outputs

**Path:** `outputs/`

### Documentos estratégicos (estão no Git)
- `PLANO-CAMPANHA-COMPLETA.md` — plano mestre da campanha vigente
- `HANDOFF.md` — handoff entre operadores (atualize quando passar bastão)
- `FORMATOS-DE-CONTEUDO.md` — catálogo de formatos com exemplos

### Conteúdos novos
Sempre vão pra `outputs/{tipo}/{slug}/`. Tipos válidos:
- `campanhas/`
- `reels/`
- `stories/`
- `multiplicar/`
- `conteudo-cultos/`
- `inteligencia/`
- `apps/publisher-instagram/publicar/` (fila Instagram)

### Mídia pesada (PNG, MP4)
**NÃO** vai pro Git. Vai pro Supabase Archive.

- Subir: `node squads/conteudo/scripts/upload-archive.mjs <pasta> --prefix <nome>`
- Baixar: `node squads/conteudo/scripts/pull-archive.mjs <prefixo>`
- Listar: `node squads/conteudo/scripts/list-archive.mjs`

Detalhes em `docs/ARCHIVE.md`.

---

## 8. Configurações gerais

| Arquivo | O que controla |
|---|---|
| `squads/conteudo/CLAUDE.md` | Contrato Claude Code (carrega ao abrir sessão) |
| `squads/conteudo/config.yaml` | Config geral do squad (paths, regras) |
| `squads/conteudo/ARCHITECTURE.md` | Visão geral da arquitetura |
| `.gitignore` | O que NÃO vai pro Git |
| `.env.example` | Template de variáveis de ambiente |

---

## Workflow de mudanças

Toda alteração relevante:

1. **Crie uma branch**
   ```bash
   git checkout -b feat/voice-tom-mais-suave
   ```

2. **Edite os arquivos**

3. **Valide** (se for conteúdo / template):
   ```bash
   bash squads/conteudo/scripts/validate-anti-ia.sh <arquivo>
   ```

4. **Commit com mensagem descritiva**
   ```bash
   git add workspace/businesses/igreja-castelo-forte/brand/voice/nucleo.md
   git commit -m "voice(castelo): suaviza tom para semana santa"
   ```

5. **Push e abra PR**
   ```bash
   git push -u origin feat/voice-tom-mais-suave
   gh pr create --title "Voice: tom Semana Santa" --body "Suavização do tom para campanha de Semana Santa. Volta ao normal em 15/04."
   ```

6. **Peça revisão** de outro operador (não merja sozinho mudança de voice/regras).

7. **Após merge**, **avise todo mundo** pra dar `git pull`.

---

## Checklist antes de commitar alteração crítica

Coisas a NUNCA esquecer:

- [ ] Anti-IA passou (`validate-anti-ia.sh`)
- [ ] Não introduziu travessão (—, –) em nada
- [ ] Acentuação portuguesa preservada (á, é, ç, ã, õ, ê, í, ó, ú)
- [ ] Voice DNA da Castelo Forte mantido (não virou genérico)
- [ ] `.env` NÃO foi commitado
- [ ] Nenhum arquivo >10MB sendo commitado (pre-commit hook bloqueia, mas confirme)
- [ ] HANDOFF.md atualizado (se a mudança afeta operação diária)
