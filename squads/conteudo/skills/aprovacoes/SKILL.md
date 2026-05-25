---
name: aprovacoes
description: Sistema de aprovação de conteúdo. Sincroniza posts do portal Vercel pro Supabase, gera link mágico para o aprovador externo, lê decisões (aprovado/reprovado + observações) e aplica correções em batch via Claude Code. Zero API paga.
---

# Skill: /aprovacoes

Pipeline de aprovação de conteúdo com painel web e gestão admin via CLI.

## Comandos

### `/aprovacoes-publicar {cliente}`
Escaneia o portal do cliente, descobre os posts (carrosseis + frases) e faz upsert no Supabase. Idempotente. Use sempre que adicionar conteúdo novo.

```bash
node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/publicar.mjs castelo-forte
```

### `/aprovacoes-status {cliente}`
Mostra resumo da fila: pendentes, aprovados, reprovados, corrigidos.

```bash
node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/status.mjs castelo-forte
```

### `/aprovacoes-link {cliente} [--corrigidos]`
Imprime link mágico do aprovador. Use `--corrigidos` pra abrir filtrado nos itens que foram corrigidos e precisam de re-aprovação.

```bash
node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/link.mjs castelo-forte
```

### `/aprovacoes-corrigir {cliente}`
Lê os reprovados do Supabase, mostra observações, e tu (Claude Code) aplica correções uma a uma. Marca como `corrigido=true` no Supabase. No final, redeploy Vercel.

```bash
node ~/claude/castelo-forte/squads/conteudo/skills/aprovacoes/scripts/corrigir.mjs castelo-forte
```

## Clientes suportados

- `castelo-forte` — descobre 21 carrosseis (7 slides) + 21 frases literais + 21 frases autorais em `apps/conteudo/img/cf-*`.

Pra adicionar outro cliente: criar registro em `aprovacao_clientes` (via SQL ou helper futuro) e adicionar lógica de discovery em `scripts/publicar.mjs`.

## URLs

- Painel aprovador: `https://castelo-forte-ten.vercel.app/aprovar/?cliente={slug}&token={token}`
- Painel admin: `https://castelo-forte-ten.vercel.app/admin/`

## Credenciais

`.env` desta skill tem:
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY` — projeto `aprovacao`
- `SUPABASE_DB_URL` — pooler para queries diretas via psql se necessário
- `PUBLIC_BASE_URL` — base do portal Vercel

Admin: `juliano@castelo-forte.com.br` / `100a123` (cadastrado via Supabase Auth).
