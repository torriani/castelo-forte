# PORTAL — Sistema de Aprovação de Conteúdo

Como funciona, como editar, como deployar o portal `apps/conteudo/`.

---

## O que é

Portal web estático que serve 2 públicos:

1. **Aprovador externo** — pastor ou liderança recebe link mágico e aprova/reprova carrosseis e frases num clique. Pode deixar observação.
2. **Admin (você/operador)** — gerencia clientes, vê estatísticas, dispara comandos de re-deploy.

Stack:
- **Front-end:** HTML/CSS/JS puro (sem framework)
- **Hospedagem:** Vercel (`https://castelo-forte-ten.vercel.app`)
- **Backend:** Supabase (projeto separado chamado `aprovacao`)
- **Motor de sync:** skill `/aprovacoes` (em `squads/conteudo/skills/aprovacoes/`)

---

## URLs em produção

| URL | Função | Acesso |
|---|---|---|
| `https://castelo-forte-ten.vercel.app/aprovar/?cliente=castelo-forte&token={TOKEN}` | Aprovação externa | Token mágico (gerado pela skill) |
| `https://castelo-forte-ten.vercel.app/admin/` | Admin | Login: `juliano@castelo-forte.com.br` |
| `https://castelo-forte-ten.vercel.app/conteudo/maio/` | Conteúdo do mês | Público |

---

## Estrutura `apps/conteudo/`

```
apps/conteudo/
├── index.html                    # redireciona pra /conteudo/maio/
├── vercel.json                   # config de deploy
├── aprovar/                      # interface do aprovador externo
│   ├── index.html
│   └── (assets)
├── admin/                        # painel administrativo
│   ├── index.html
│   ├── login.html
│   └── (assets)
├── conteudo/                     # material publicável (por mês)
│   └── maio/
│       ├── index.html
│       └── (subpáginas)
├── briefing/                     # briefs e referências
├── assets/                       # CSS, JS, fontes
└── img/                          # 1750 imagens
    ├── cf-carrosseis/            # carrosseis por dia
    ├── cf-frases/                # frases por dia
    └── ig-castelo-forte/         # thumbs Instagram (coletados via skill)
```

---

## Fluxo de operação

```
┌─────────────────────────────────────────────────────────────┐
│  1. CRIAÇÃO (operador no Claude Code)                       │
│  @content-chief gera carrossel/frase                        │
│  PNGs vão pra apps/conteudo/img/cf-carrosseis/dia-NN/       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. SYNC (skill /aprovacoes)                                │
│  node squads/conteudo/skills/aprovacoes/scripts/publicar.mjs│
│  → escaneia apps/conteudo/img/cf-*/                         │
│  → faz upsert no Supabase (idempotente)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. LINK MÁGICO                                             │
│  node squads/.../aprovacoes/scripts/link.mjs castelo-forte  │
│  → imprime URL com token único                              │
│  → você manda pro aprovador (WhatsApp, e-mail)              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. APROVAÇÃO (aprovador externo)                           │
│  → abre URL, vê carrosseis e frases                         │
│  → marca ✓ aprovado ou ✗ reprovado (+ observação)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  5. CORREÇÃO (operador no Claude Code)                      │
│  node squads/.../aprovacoes/scripts/corrigir.mjs            │
│  → lê reprovados + observações                              │
│  → você (Claude Code) aplica correções uma a uma            │
│  → marca como corrigido=true                                │
│  → redeploya Vercel automaticamente                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  6. RE-APROVAÇÃO                                            │
│  Aprovador volta no link com filtro --corrigidos            │
│  Re-aprova ou ainda reprova                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Comandos da skill `/aprovacoes`

### 1. Sincronizar conteúdo novo
```bash
node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/publicar.mjs castelo-forte
```
- Escaneia `apps/conteudo/img/cf-*/`
- Descobre carrosseis (7 slides) + frases (1 imagem)
- Upsert no Supabase (idempotente: pode rodar várias vezes)

### 2. Ver status da fila
```bash
node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/status.mjs castelo-forte
```
Mostra:
- Total de itens
- Pendentes (não aprovados ainda)
- Aprovados
- Reprovados
- Corrigidos (esperando re-aprovação)

### 3. Gerar link mágico pro aprovador
```bash
node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/link.mjs castelo-forte
# ou pra ver só os corrigidos:
node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/link.mjs castelo-forte --corrigidos
```

### 4. Aplicar correções
```bash
node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/corrigir.mjs castelo-forte
```
- Lê reprovados
- Mostra observações
- Você (Claude Code) edita os arquivos
- Marca como `corrigido=true`
- Re-deploya Vercel

---

## Editar o portal manualmente

Pra mudar HTML, CSS, JS, ou adicionar nova página:

### 1. Edite os arquivos
```bash
cd apps/conteudo
# editar com VS Code:
code .
```

### 2. Teste localmente
```bash
cd apps/conteudo
python3 -m http.server 8080
# abre http://localhost:8080
```

### 3. Deploy
```bash
cd apps/conteudo
vercel --prod --yes
```

> O Vercel detecta as mudanças automaticamente e re-deploya em ~30s.

---

## Adicionar novo conteúdo (carrosseis novos)

### Fluxo recomendado (via squad)
```bash
cd ~/claude/castelo-forte/squads/conteudo
claude
@content-chief
*carrossel
# segue diálogo, gera PNGs em outputs/
```

Depois, copie pro portal:
```bash
cp outputs/campanhas/{campanha}/carrosseis/{slug}/*.png apps/conteudo/img/cf-carrosseis/dia-XX/
```

E sincronize:
```bash
node squads/conteudo/skills/aprovacoes/scripts/publicar.mjs castelo-forte
```

### Fluxo manual (sem squad)
Crie diretamente em `apps/conteudo/img/cf-carrosseis/dia-XX/`:
- `1-capa.png` (slide capa)
- `2.png` até `7.png` (slides internos)

Sincronize:
```bash
node squads/conteudo/skills/aprovacoes/scripts/publicar.mjs castelo-forte
```

---

## Credenciais necessárias

### `.env` da skill aprovações
`squads/conteudo/skills/aprovacoes/.env`:
```env
SUPABASE_URL=https://xxxxx.supabase.co            # projeto 'aprovacao'
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...
SUPABASE_DB_URL=postgres://...                    # pra queries diretas via psql
PUBLIC_BASE_URL=https://castelo-forte-ten.vercel.app
```

### Acesso Vercel
```bash
vercel login
# vincule ao projeto (primeira vez):
cd apps/conteudo
vercel link
# escolha: castelo-forte / castelo-forte-ten
```

---

## Troubleshooting

### "Link mágico não funciona"
- Token expirou? Tokens duram 30 dias. Gere novo: `link.mjs castelo-forte`
- Cliente errado? URL deve ter `?cliente=castelo-forte&token=...`

### "Vercel deploy falhou"
```bash
cd apps/conteudo
vercel logs  # vê erro
```

### "Skill aprovacoes diz 'cliente não cadastrado'"
Precisa cadastrar no Supabase. Veja `squads/conteudo/skills/aprovacoes/SKILL.md` seção "Pra adicionar outro cliente".

### "Aprovador externo não consegue acessar"
- Confira que o link tem token válido
- Confira que ele tem internet (link mágico precisa bater no Supabase)
- Se o navegador dele bloqueia third-party cookies, tente em outro navegador

### "Mudei o HTML mas o site não atualizou"
- Vercel demora ~30s pra re-deployar
- Limpe cache do navegador (Cmd+Shift+R)
- Confira `vercel ls` se o deploy entrou

---

## Próximas leituras

- Operação dia a dia do squad: `docs/USO.md`
- Como criar conteúdo: `docs/CRIAR-CONTEUDO.md`
- Como publicar no Instagram (separado do portal): `docs/PUBLICAR.md`
