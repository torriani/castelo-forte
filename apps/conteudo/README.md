# apps/conteudo — Portal Vercel da Castelo Forte

Portal estático (HTML/CSS/JS) hospedado em Vercel. Serve aprovador externo, admin e material publicável.

**URL produção:** https://castelo-forte-ten.vercel.app

---

## Estrutura

```
apps/conteudo/
├── index.html               # redireciona pra /conteudo/maio/
├── vercel.json              # config de deploy
├── aprovar/                 # interface do aprovador externo (link mágico)
├── admin/                   # painel administrativo (login)
├── conteudo/                # material publicável (por mês)
│   └── maio/
├── briefing/                # briefs e referências
├── assets/                  # CSS, JS, fontes
├── img/                     # 1750 imagens
│   ├── cf-carrosseis/       # carrosseis por dia
│   ├── cf-frases/           # frases por dia
│   └── ig-castelo-forte/    # thumbs Instagram
├── *.py                     # scripts Python de manutenção (ad-hoc)
└── README.md                # este arquivo
```

---

## Como rodar localmente

Este portal é **HTML/CSS/JS estático puro** (sem Node, sem React, sem build). **Não tem `npm run dev`.** Use qualquer servidor estático:

```bash
# Opção 1: Python (já vem no Mac)
cd apps/conteudo
python3 -m http.server 8080

# Opção 2: Node (sem instalar nada)
cd apps/conteudo
npx serve -p 8080

# Opção 3: Vercel CLI (simula produção 100%, respeita vercel.json)
cd apps/conteudo
vercel dev
```

Abre em `http://localhost:8080` (ou a porta que o Vercel escolher).

**Qual usar?**
- Edição de texto/imagens → qualquer um
- Teste de redirects/headers/cache (config em `vercel.json`) → `vercel dev` é o único fiel

---

## Como deployar

```bash
cd apps/conteudo
vercel --prod --yes
```

Primeira vez? Faça login + link do projeto:
```bash
vercel login
vercel link
# escolha: castelo-forte / castelo-forte-ten
```

---

## Operação via skill `/aprovacoes`

A maior parte das operações é feita pela skill que mora em `squads/conteudo/skills/aprovacoes/`. Veja `docs/PORTAL.md` na raiz do repo para o fluxo completo.

Comandos resumidos:
```bash
# Sincronizar conteúdo novo pro Supabase
node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/publicar.mjs castelo-forte

# Status da fila
node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/status.mjs castelo-forte

# Gerar link mágico pro aprovador
node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/link.mjs castelo-forte

# Aplicar correções dos reprovados
node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/corrigir.mjs castelo-forte
```

---

## Scripts Python de manutenção

São scripts ad-hoc usados pra reorganizar/migrar conteúdo. Não rodam automaticamente:

| Script | O que faz |
|---|---|
| `migrate-to-padrao.py` | Migra conteúdo antigo pro novo padrão de pastas |
| `unify-sidebar.py` | Unifica sidebars das páginas |
| `inject-global-menu.py` | Injeta menu global em todas as páginas |
| `fix-sidebar-brand.py` | Corrige branding nas sidebars |
| `clean-migrated-pages.py` | Limpa páginas migradas |
| `cleanup-deep.py` | Limpeza profunda de páginas |
| `cleanup-final.py` | Limpeza final |

Use com cuidado, fazem alterações em massa. Sempre commit antes de rodar.
