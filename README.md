# Castelo Forte

Repositório central da **Igreja Castelo Forte**. Reúne apps, squads de inteligência, dados da igreja e tudo que é produzido.

---

## Estrutura

```
castelo-forte/
├── apps/                        ← aplicações da igreja (deployáveis)
│   ├── conteudo/                ← portal Vercel (aprovação + admin)
│   └── publisher-instagram/     ← cron de publicação automática
│
├── squads/                      ← serviços de inteligência (agentes)
│   └── conteudo/                ← squad de copy/conteúdo
│       └── (futuro: design/, traffic/, copy/, etc)
│
├── workspace/                   ← dados da igreja (consumidos pelos squads)
│   └── businesses/igreja-castelo-forte/
│       ├── brand/voice/         ← tom de voz, expressões, anti-padrões
│       ├── brand/identidade/    ← cores, logos, tipografia
│       └── campaigns/           ← campanhas em andamento
│           (futuro: programas/, series/, eventos/)
│
├── outputs/                     ← tudo que foi produzido (histórico)
│   ├── PLANO-CAMPANHA-COMPLETA.md
│   ├── HANDOFF.md
│   ├── FORMATOS-DE-CONTEUDO.md
│   ├── campanhas/
│   ├── conteudo-cultos/
│   ├── inteligencia/
│   ├── multiplicar/
│   └── reunioes/
│
└── docs/                        ← manuais
    ├── SETUP.md                 ← primeiro dia
    ├── USO.md                   ← referência de comandos
    ├── CRIAR-CONTEUDO.md        ← fluxos de criação
    ├── PUBLICAR.md              ← pipeline Instagram
    ├── PORTAL.md                ← portal de aprovação
    ├── ALTERAR.md               ← editar voice/brand/agentes
    ├── ARQUITETURA.md           ← visão geral
    ├── TROUBLESHOOTING.md
    └── ARCHIVE.md               ← sistema de mídia Supabase
```

---

## Filosofia

**apps/** = produtos deployáveis (UI, portal, cron de publicação)
**squads/** = "serviços" de inteligência (agentes Claude Code que executam trabalho)
**workspace/** = dados da igreja (voice DNA, identidade, programas, séries)
**outputs/** = histórico do que foi produzido (planos, peças, inteligência)

Os **squads** leem do **workspace** pra criar com tom certo, e geram trabalho que vai pra **outputs**. Os **apps** servem o resultado pra audiência (portal, Instagram).

---

## Começar a usar

**Primeira vez?** Leia `docs/SETUP.md` e siga o passo-a-passo (30-45min).

**Já configurado?**

| Quero... | Vou para... |
|---|---|
| Criar conteúdo (carrossel, reels, stories) | `docs/CRIAR-CONTEUDO.md` |
| Publicar no Instagram | `docs/PUBLICAR.md` |
| Acessar/editar o portal de aprovação | `docs/PORTAL.md` |
| Editar voice DNA / brand / agentes | `docs/ALTERAR.md` |
| Entender como tudo se conecta | `docs/ARQUITETURA.md` |
| Algo deu errado | `docs/TROUBLESHOOTING.md` |
| Baixar mídia histórica (carrosseis antigos) | `docs/ARCHIVE.md` |

---

## Requisitos

- macOS (testado em Darwin 25.x). Linux funciona, mas o LaunchAgent é macOS-only.
- Node.js 18+
- Claude Code CLI (https://claude.com/claude-code)
- Acesso ao projeto Supabase compartilhado da Castelo Forte (administrador entrega tokens)
- Conta Instagram Business conectada à página Facebook da igreja
- Acesso Vercel (pra deployar mudanças no portal `apps/conteudo/`)

---

## Tamanho

Clone completo: ~470 MB
- 12 MB: squads + workspace + outputs (texto)
- 450 MB: apps/conteudo (portal Vercel com 1750 imagens)
- 8 MB: docs + configs

Mídia histórica (carrosseis publicados, vercel-deploy antigo): **773 MB no Supabase Archive**, sob demanda via `node squads/conteudo/scripts/pull-archive.mjs`.

---

## Suporte

Dúvidas? Comece por `docs/TROUBLESHOOTING.md`. Se não resolver, abra issue no repositório.
