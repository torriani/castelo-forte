# Squad video-editor — Castelo Forte

Squad de edição de vídeo longform → shorts/reels para a **Igreja Castelo Forte**. Combina 3 diretores elite (Pearlman, MrBeast, Murch) com workers técnicos (Whisper + auto-editor + Remotion + ffmpeg).

**Cliente único:** `igreja-castelo-forte` (@castelofortefloripa).

> **Origem:** este squad é uma cópia adaptada de `legacy/squads/video-editor/`. A skill global `/legendar-video` continua funcionando com o squad legacy. Este aqui é pra trabalhos nativos do Castelo Forte (cultos, prédicas, lives da igreja).

---

## Filosofia

> "Minds decide what to cut, workers execute how."

- **Directors (Tier 0)** aplicam frameworks documentados pra selecionar clips
- **Workers (tasks)** executam pipeline técnico headless
- **Orchestrator (`@video-editor-chief`)** coordena tudo via workflow unidirecional

---

## Agentes

### Tier 0 — Directors (decisão)
- `@video-editor-chief` — orquestrador, ponto de entrada
- `@karen-pearlman` — *The Selector* (5-Step Selection + 3 Movements)
- `@mrbeast` — *The Retention Engineer* (CTR/AVD/AVP)
- `@walter-murch` — *The Judge* (Rule of Six)

### Workers (tasks, não-standalone)
Em `tasks/`:
- `transcribe.md` — Whisper local
- `cut-silences.md` — auto-editor
- `detect-hooks.md` — LLM (Ollama/Claude)
- `select-clips.md` — OpenMontage clip-factory
- `compose-layout.md` — Remotion custom template
- `generate-captions.md` — Remotion
- `render.md` — Remotion CLI + ffmpeg

### Workflow principal
`workflows/wf-longform-to-shorts.yaml` — 7 fases, end-to-end.

---

## Pastas canônicas de output (Castelo Forte)

Todo material produzido vai pra `outputs/` do repo Castelo Forte (NUNCA dentro de `squads/`).

### 1. Vídeo legendado / shorts (MP4)

```
outputs/videos-editados/{slug}_translated.mp4
outputs/videos-editados/shorts/{slug}__short_{duracao}.mp4
```

Onde `{slug}` é:
- O nome base do arquivo de entrada (sem extensão), OU
- Um slug definido no briefing (ex: `culto-2026-05-24-fe`)

### 2. Transcrição em Markdown (MD)

```
outputs/videos-editados/transcricoes/{slug}.md
```

**Estrutura obrigatória do MD:**
1. **Header** com título, palestrante(s), duração, tema, fonte
2. **Sumário** com 15-30 capítulos numerados
3. **Conteúdo organizado em capítulos** (NÃO É RESUMO): preserva tudo da transcrição em forma narrativa por tema, com citações em blockquote nas falas-chave
4. **Apêndice** com termos teológicos preservados
5. **Transcrição completa (ordem cronológica)** no final: todos segments em bloco de código, formato `[mm:ss] texto` (ou `[hh:mm:ss]` se >1h)

---

## Diretórios internos do pipeline (NÃO mexer)

```
.aiox/squad-runtime/video-editor/
├── {pipeline_id}/                 # 12 chars hex, um por execução
│   ├── transcript.json            # output do Whisper (Stage A)
│   ├── transcript_translated.json # tradução (Stage B, se houver)
│   ├── audio_track.wav            # áudio extraído
│   ├── edit_project/              # projeto Remotion intermediário
│   ├── whisper/                   # cache do Whisper
│   └── translate_chunks/          # chunks pra tradução paralela
├── state/
│   └── {pipeline_id}.state.json   # estado de cada fase do pipeline
```

---

## Regras inegociáveis (TODO output deste squad)

### 1. Voice DNA da Castelo Forte SEMPRE carregado antes de selecionar clips
Diretores precisam saber a voz da igreja pra escolher o que cortar:
- `workspace/businesses/igreja-castelo-forte/brand/voice/nucleo.md`
- `workspace/businesses/igreja-castelo-forte/brand/voice/expression.md`
- `workspace/businesses/igreja-castelo-forte/brand/voice/anti-padroes.md`

### 2. Teologia do Reino como filtro de relevância
Pilares: identidade, chamado, sobrenatural, formação. Arquétipos: Mago/Cuidador/Criador.
Clip que contradiz teologia do reino é descartado mesmo se viral.

### 3. NUNCA usar travessão (—, –) em nenhum output
Vale pra MD, legendas, descrições. Substituir por vírgula, ponto, dois pontos, parênteses.

### 4. Português brasileiro completo
Acentuação obrigatória em legendas e transcrições (á, é, ç, ã, õ, ê, í, ó, ú).

### 5. Citações bíblicas preservadas no original
Não parafrasear versículos. Se o palestrante cita Lucas 4:18, preservar literal.

### 6. Outputs vão pra `outputs/`, NUNCA dentro de `squads/`

---

## Dependências externas

- **whisper** (local)
- **auto-editor** (`pip install auto-editor`)
- **ffmpeg**
- **remotion** (npm)
- **ollama** (opcional, LLM local pra detect-hooks)

Repos clonados/usados como base:
- OpenMontage (70% reuse, clip factory)
- auto-editor
- VideoAgent (padrões)

---

## Fluxo rápido (longform → shorts)

1. **Input:** vídeo da live/culto em `outputs/videos/originais/`
2. **Comando:** `@video-editor-chief` → `*shorts <arquivo> --duracoes 60,120,300`
3. **Pipeline executa wf-longform-to-shorts** (7 fases)
4. **Output:** shorts em `outputs/videos-editados/shorts/` + MD em `transcricoes/`

---

## Como reaproveitar transcript já existente

Se o vídeo já foi processado (existe `transcript.json` ou `transcript_translated.json`) mas você quer só regenerar o MD:

1. Descubra o `pipeline_id` em `state/*.state.json` pelo `source_video`
2. Despache subagente Sonnet apontando direto pro JSON
3. Salve em `outputs/videos-editados/transcricoes/{slug}.md`

Não precisa rodar Whisper nem render de novo.

---

## Quality standards (herdados do legacy)

- **Agents:** voice_dna required, thinking_dna required, smoke tests 3-pass, heuristics com "when"
- **Workflow:** checkpoints por fase, veto conditions, fluxo unidirecional
