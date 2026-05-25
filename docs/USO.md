# USO — Manual Completo de Comandos

Catálogo de tudo que você pode fazer neste squad. Use como referência rápida.

---

## 1. Comandos do Content Chief (no Claude Code)

Ative o orquestrador com `@content-chief`. Depois use os comandos abaixo:

| Comando | O que faz | Resultado |
|---|---|---|
| `*briefing` | Inicia coleta de briefing | Te faz no máximo 2 perguntas e prescreve o formato certo |
| `*diagnostico` | Analisa contexto e recomenda configuração | Formato + Tipo + Framework + Tamanho prescritos |
| `*carrossel` | Direciona pro @carousel-creator | Carrossel pronto, validado pelo Oráculo |
| `*reels` | Direciona pro @reels-creator | Roteiro de Reels completo |
| `*stories` | Direciona pro @stories-strategist | Sequência de Stories |
| `*planejar` | Direciona pro @content-planner | Calendário editorial |
| `*validar` | Direciona pro @content-validator | Validação Anti-IA + Oráculo |
| `*campanha` | Coordena campanha multi-formato | Estratégia E1-E8 (delega pro @strategist) |
| `*repurpose` | Adapta conteúdo existente | Carrossel → Reels → Stories |
| `*multiplicar` | Quebra conteúdo longo em micro-peças | 30+ peças a partir de 1 live/aula |
| `*teses` | Mostra teses ativas (se cadastradas) | Lista de teses estratégicas da Castelo Forte |
| `*templates` | Lista todos os templates do catálogo | 9 templates oficiais T01-T09 |

---

## 2. Agentes disponíveis (chamada direta com @)

Você pode ativar qualquer um diretamente, mas o **Content Chief** sabe quando chamar quem.

### Tier 0 — Orquestrador
- `@content-chief` — Imperador, diagnostica e delega

### Tier 1 — Criadores
- `@carousel-creator` — Carrosséis de 1 a 10 slides
- `@reels-creator` — Roteiros de Reels (15-90s)
- `@stories-strategist` — Sequências de Stories
- `@print-tweet-creator` — Print-tweets (reflexão de 3-12 linhas)
- `@strategist` — Estratégias de campanha E1-E8
- `@positioning-expert` — Bio, CLC (Carta de Linha Compactada), StoryAds
- `@competitor-analyst` — Análise de concorrentes (igrejas, ministérios)

### Tier 2 — Operação
- `@content-planner` — Calendário editorial
- `@content-repurposer` — Adapta entre formatos
- `@content-validator` — Validação Anti-IA + Oráculo (gatekeeper)

---

## 3. Comandos do publisher Instagram

Os comandos abaixo funcionam de **qualquer lugar** (são skills globais do Claude Code).

| Comando | O que faz |
|---|---|
| `/publicar` | Publica um post avulso (com dry-run + aprovação) |
| `/publicar-status` | Mostra status da fila agendada |
| `/publicar-log` | Mostra o log do dia |
| `/publicar-agora N` | Força publicação manual do post #N da fila |
| `/publicar-pause` | Desativa o cron (LaunchAgent) |
| `/publicar-resume` | Reativa o cron |

Detalhes completos em `docs/PUBLICAR.md`.

---

## 4. Scripts (linha de comando)

### Gerador de imagens (PNG)
```bash
cd squads/conteudo/app/image-generator
node generate.mjs --batch <arquivo.json> --output <pasta-saida>/
```

### Renderizador de carrossel (a partir de MD)
```bash
node squads/conteudo/scripts/render-carrossel.mjs <arquivo.md> --template <modelo>
```
Templates disponíveis: `twitter-branco`, `imperial-dark`, `claude-azul`, etc.
Veja todos em `squads/conteudo/templates/catalog.yaml`.

### Filtro Anti-IA (validação mecânica)
```bash
bash squads/conteudo/scripts/validate-anti-ia.sh <arquivo.md>
bash squads/conteudo/scripts/validate-anti-ia.sh <arquivo.json> --json
bash squads/conteudo/scripts/validate-anti-ia.sh <arquivo.html> --html
```
Exit 0 = aprovado. Exit 1 = reprovado (leia o output, corrija, rode de novo).

**OBRIGATÓRIO antes de qualquer publicação.** Sem isso, o post é bloqueado pelo publisher.

### Archive Supabase (histórico de mídia)
```bash
# Lista o que existe
node squads/conteudo/scripts/list-archive.mjs
node squads/conteudo/scripts/list-archive.mjs campanhas

# Baixa uma pasta sob demanda
node squads/conteudo/scripts/pull-archive.mjs campanhas/em-cristo-antecipacao
node squads/conteudo/scripts/pull-archive.mjs multiplicar --out outputs/multiplicar

# Sobe pasta nova pro archive
node squads/conteudo/scripts/upload-archive.mjs <pasta-local> --prefix <nome-remoto>
```

Detalhes em `docs/ARCHIVE.md`.

### Construtor de página de culto
```bash
node squads/conteudo/scripts/build-pagina-culto.mjs
```

### Construtor de catálogo de templates
```bash
node squads/conteudo/scripts/build-catalogo.mjs
# Abre squads/conteudo/templates/CATALOGO.html no browser pra ver todos os templates
```

---

## 5. Fluxos típicos

### Criar 1 carrossel novo
```
1. cd ~/clientes/castelo-forte/squad
2. claude
3. @content-chief
4. *briefing
5. (responde as perguntas)
6. (aceita a prescrição)
7. (Carousel Creator escreve, valida, gera PNG)
8. (Content Validator passa pelo Anti-IA e Oráculo)
9. Pronto: outputs/campanhas/{campanha}/carrosseis/
```

### Multiplicar 1 live longa
```
1. @content-chief
2. *multiplicar
3. (cola URL do YouTube ou path do arquivo)
4. (deixa o pipeline rodar: transcrever → extrair átomos → planejar formatos → criar peças)
5. Saída: outputs/multiplicar/{nome-da-live}/
```

### Publicar post agendado
```
1. Criar pasta NN-YYYY-MM-DD-HHMM-slug/ dentro de apps/publisher-instagram/publicar/
2. Colocar: post.png + post.json + legenda.md
3. Apagar queue.json (se existir)
4. Esperar o cron (LaunchAgent rodando)
5. Verificar: /publicar-status
```

### Publicar agora (manual)
```
/publicar
(segue dry-run + aprovação)
```

---

## 6. Como saber qual comando usar

| Você quer... | Use |
|---|---|
| Criar conteúdo do zero | `@content-chief` + `*briefing` |
| Já sei que é carrossel | `@content-chief` + `*carrossel` |
| Quebrar uma live longa em vários posts | `@content-chief` + `*multiplicar` |
| Validar um texto pronto | `bash squads/conteudo/scripts/validate-anti-ia.sh <arquivo>` |
| Gerar PNG sem entrar no Claude Code | `node squads/conteudo/app/image-generator/generate.mjs ...` |
| Publicar AGORA | `/publicar` |
| Saber se a fila publicou | `/publicar-status` |
| Baixar carrossel antigo pra referência | `node squads/conteudo/scripts/pull-archive.mjs ...` |
| Ver concorrentes | `@competitor-analyst` |

---

## 7. Convenções e regras

Ler antes de criar conteúdo:
- `squads/conteudo/data/regras-inviolaveis.md`
- `squads/conteudo/data/REGRA-DNA-CLIENTE.md`
- `squads/conteudo/checklists/filtro-anti-ia.md`

Voice DNA da Castelo Forte (carregar SEMPRE):
- `workspace/businesses/igreja-castelo-forte/brand/voice/nucleo.md`
- `workspace/businesses/igreja-castelo-forte/brand/voice/expression.md`
- `workspace/businesses/igreja-castelo-forte/brand/voice/aberturas-poderosas.md`
- `workspace/businesses/igreja-castelo-forte/brand/voice/anti-padroes.md`
