# SETUP — Primeiro Dia

Tempo estimado: **30 a 45 minutos** (depende da sua velocidade pra instalar Node + Claude Code).

---

## 0. Pré-requisitos

Antes de clonar o repo, instale:

### Node.js 18+
```bash
# macOS via Homebrew
brew install node

# Confira a versão
node --version    # >= 18.x
npm --version
```

### Claude Code CLI
Siga https://claude.com/claude-code/quickstart

```bash
# Após instalar, confirme:
claude --version
```

### Git + Git LFS (opcional mas recomendado pra clone rápido)
Git já vem no macOS. Se não tiver:
```bash
xcode-select --install
```

### GitHub CLI
```bash
brew install gh
gh auth login
```

### Vercel CLI (se for editar o portal)
```bash
npm install -g vercel
vercel login
```

---

## 1. Clone o repositório

```bash
# Clone direto no ~/claude/
cd ~/
mkdir -p claude
cd claude
git clone git@github.com:torriani/castelo-forte.git
cd castelo-forte
```

Estrutura que você verá:
```
castelo-forte/
├── README.md
├── docs/                        ← manuais (este aqui!)
├── apps/
│   ├── conteudo/                ← portal Vercel
│   └── publisher-instagram/     ← cron Instagram
├── squads/
│   └── conteudo/                ← squad de copy/conteúdo
├── workspace/                   ← dados da igreja
└── outputs/                     ← histórico produzido
```

> Clone pode demorar 2-5min na primeira vez (470 MB total, sendo 450 MB do portal Vercel).

---

## 2. Instale dependências

### Gerador de imagens do squad
```bash
cd squads/conteudo/app/image-generator
npm install
cd -
```

### Skill de aprovações
```bash
cd squads/conteudo/skills/aprovacoes
npm install
cd -
```

### Pipeline de publicação
```bash
cd apps/publisher-instagram
npm install
cd -
```

### Portal de conteúdo (se for editar)
```bash
cd apps/conteudo
# (Não tem package.json, é HTML/CSS/JS estático — pula esse)
cd -
```

---

## 3. Configure o `.env` raiz

```bash
# Copie o template
cp .env.example .env

# Edite
code .env       # VS Code
```

**Mínimo para começar (acessar archive Supabase):**
```env
SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

**Se for publicar no Instagram:**
```env
INSTAGRAM_ACCESS_TOKEN=EAAxxxxxxxxx
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841402079107066
```

> O administrador entrega os tokens via 1Password no item **"Castelo Forte — Squad Conteúdo"**.

---

## 4. Configure também o `.env` dos apps

### Pipeline de publicação
```bash
cp apps/publisher-instagram/.env.example apps/publisher-instagram/.env
# Edite e cole INSTAGRAM_* + SUPABASE_*
```

### Skill aprovações
```bash
cp squads/conteudo/skills/aprovacoes/.env.example squads/conteudo/skills/aprovacoes/.env
# Edite com credenciais do projeto Supabase 'aprovacao' (separado)
```

---

## 5. Habilite o pre-commit hook
Bloqueia arquivos grandes (>10MB fora de apps/conteudo) e secrets:

```bash
git config core.hooksPath .githooks
```

Teste:
```bash
# Cria arquivo grande de teste
dd if=/dev/zero of=/tmp/grande.bin bs=1m count=15
cp /tmp/grande.bin .
git add grande.bin
git commit -m "teste"
# Esperado: "BLOQUEADO: grande.bin (15 MB > 10 MB)"
rm grande.bin
git restore --staged grande.bin 2>/dev/null
```

---

## 6. Testes de fumaça

### Teste 1: archive Supabase
```bash
node squads/conteudo/scripts/list-archive.mjs
```
Esperado: lista pastas top-level (`campanhas/`, `inteligencia/`, `multiplicar/`, `vercel-deploy/`, etc).

Erros comuns:
- `ERRO: .env não encontrado` → passo 3 não foi feito
- `Supabase list falhou (401)` → token errado, peça novo
- `fetch failed` → sem internet ou Supabase fora

### Teste 2: gerador de PNG
```bash
cd squads/conteudo/app/image-generator
node generate.mjs --batch examples/exemplo-twitter.json --output /tmp/teste-castelo/
ls /tmp/teste-castelo/
cd -
```
Esperado: PNGs gerados. Abra um pra confirmar.

### Teste 3: portal Vercel local
```bash
cd apps/conteudo
python3 -m http.server 8080
# abre http://localhost:8080
```
Deve abrir o portal. Ctrl+C pra parar.

### Teste 4: Claude Code reconhece o squad
```bash
cd ~/claude/castelo-forte/squads/conteudo
claude
```

No Claude Code:
```
@content-chief
```

O agente deve responder ativando o **Content Chief — Imperador do Squad Conteudo**.

---

## 7. Próximos passos

Agora você tem tudo funcional. Continue por:

- **Vai criar conteúdo?** → `docs/CRIAR-CONTEUDO.md`
- **Vai publicar no Instagram?** → `docs/PUBLICAR.md`
- **Vai editar o portal?** → `docs/PORTAL.md`
- **Quer entender como tudo se conecta?** → `docs/ARQUITETURA.md`
- **Precisa baixar mídia antiga pra referência?** → `docs/ARCHIVE.md`

---

## Checklist de conclusão

- [ ] Node 18+ instalado
- [ ] Claude Code CLI instalado
- [ ] Vercel CLI instalado (se for editar portal)
- [ ] Repositório clonado em `~/claude/castelo-forte/`
- [ ] `npm install` rodou em 3 lugares: `squads/conteudo/app/image-generator/`, `squads/conteudo/skills/aprovacoes/`, `apps/publisher-instagram/`
- [ ] `.env` raiz preenchido
- [ ] `.env` em `apps/publisher-instagram/` preenchido (se for publicar)
- [ ] `.env` em `squads/conteudo/skills/aprovacoes/` preenchido (se for usar portal)
- [ ] `git config core.hooksPath .githooks` rodado
- [ ] `node squads/conteudo/scripts/list-archive.mjs` rodou e listou pastas
- [ ] Gerou pelo menos um PNG de teste
- [ ] Portal abre em `python3 -m http.server` na pasta `apps/conteudo/`
- [ ] `@content-chief` responde no Claude Code

Tudo OK? Está pronto pra trabalhar.
