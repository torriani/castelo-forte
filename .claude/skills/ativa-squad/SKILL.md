---
name: ativa-squad
description: >
  Ativa um squad da pasta `squads/` deste repositorio (Castelo Forte) no Claude
  Code, sincronizando seus agents/tasks/workflows como referencias utilizaveis
  na sessao. Acionar quando o usuario disser "ativa squad X", "carregar squad",
  "usar squad", ou /ativa-squad. NAO usar para criar squads novos.
---

# Ativa Squad — Castelo Forte

Le um squad em `squads/<nome>/` (raiz deste repo) e o disponibiliza pra sessao
atual: carrega o config, lista agents/tasks/workflows e adota o squad chief
como persona default.

## Squads disponiveis neste repo

- `conteudo` — producao de conteudo Instagram (carrosseis, reels, stories,
  print-tweets, campanhas E1-E8) para a Igreja Castelo Forte.

> Para listar dinamicamente: `ls squads/ | grep -v '^_'`

## Pre-requisitos

- Squad existe em `squads/<slug>/`.
- Estrutura minima: pasta `agents/` ou `tasks/` no squad.

## Passos

### 1. Listar squads disponiveis

```bash
ls squads/ 2>/dev/null | grep -v '^_'
```

Se o usuario nao especificou qual squad, mostre a lista e pergunte.

### 2. Ler o squad escolhido

- Se `squads/<slug>/CLAUDE.md` existir, leia (contexto principal do squad).
- Se `squads/<slug>/config.yaml` existir, leia para entender chief, agents e workflows.
- Liste agents em `squads/<slug>/agents/` (cada `.md` ou pasta com `agent.md`).
- Liste tasks em `squads/<slug>/tasks/`.
- Liste workflows em `squads/<slug>/workflows/`.
- Liste checklists em `squads/<slug>/checklists/`.

### 3. Carregar contexto na sessao

Apresente ao usuario neste formato:

```
Squad <nome> ativado.

Chief: <chief-agent>  (entry point)

Agents disponiveis:
  - <agent1> — <descricao curta lida do frontmatter ou primeira linha>
  - <agent2> — ...

Tasks disponiveis:
  - <task1>
  - ...

Workflows:
  - <wf1>
  - ...

Regras inegociaveis (do CLAUDE.md do squad):
  - <regra1>
  - <regra2>
```

A partir dai, quando o usuario pedir um agent ("rode @X" ou "ativa o X"),
voce le `squads/<slug>/agents/<X>.md` (ou `squads/<slug>/agents/<X>/agent.md`)
e atua conforme a persona descrita.

### 4. (Opcional) Slash commands por agent

Se o usuario quiser registrar agents do squad como sub-agents do projeto
(aparecem como `@nome` na lista de agents):

```bash
SLUG="<slug>"
mkdir -p ".claude/agents/castelo-forte/${SLUG}"
for a in "squads/${SLUG}/agents/"*.md; do
  name=$(basename "$a")
  cp "$a" ".claude/agents/castelo-forte/${SLUG}/$name"
done
```

Avisar pra reiniciar Claude Code se os agents nao aparecerem na lista.

## Edge cases

- Squad sem `agents/` → liste o que existe (tasks, workflows, scripts) e
  oriente uso direto.
- Squad com `SQUAD-NOTES.md` ou avisos no `CLAUDE.md` → leia e mostre ao
  usuario (avisos sobre ativos faltantes).
- Squad ja ativo na sessao (CLAUDE.md auto-carregado) → confirme isso ao
  usuario em vez de "ativar de novo".
