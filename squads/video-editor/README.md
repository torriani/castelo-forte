# 🎬 Squad: video-editor

**Two modes:** Traditional video edit OR longform → clips factory.

## Quick start

### 🎬 EDIT — Polish a whole video
```
/video-editor:video-editor-chief
*edit /path/to/meu-video.mp4
*edit /path/to/meu-video.mp4 --image /path/to/materia.png
*edit /path/to/meu-video.mp4 --aspect 9:16
```
What it does: removes silences/breaths + adds karaoke captions + optional image overlay.
Output: one polished MP4.

### ✂️ CLIPS — Chop longform into clips
```
/video-editor:video-editor-chief
*clips /path/to/aula-3h.mp4 --durations 60,120,300 --counts 5,3,2
```
What it does: 7-phase pipeline with directors council. Output: N clips.

### Consult a director directly
```
/video-editor:karen-pearlman   → selection advice (rhythm/process)
/video-editor:mrbeast          → retention/hook analysis
/video-editor:walter-murch     → tiebreak (Rule of Six)
```

## Philosophy

> "Minds decide what to cut. Workers execute how."

| Agent | Role | Framework |
|---|---|---|
| **@karen-pearlman** 🎞️ | The Selector | 5-Stage Process + 3 Movements |
| **@mrbeast** 📊 | The Retention Engineer | AVD/CTR/Minute-mark |
| **@walter-murch** ⚖️ | The Judge | Rule of Six (Emotion 51%) |

**Productive tension:** MrBeast vetoes cuts that kill retention → Murch vetoes cuts that kill emotion → Pearlman arbitrates via process.

## Two pipelines

### EDIT mode (4 phases)
```
INPUT: video.mp4 [+ image.png]
  ↓
1. transcribe        (Whisper)            → transcript.json
2. cut-silences      (auto-editor)        → segments.json
6. compose-layout    (Remotion full-video) → edit_project/
7. render            (Remotion CLI)        → output/{name}_edited.mp4
```

### CLIPS mode (7 phases)
```
INPUT: longform.mp4 + "N clips of X duration"
  ↓
1. transcribe       (Whisper)           → transcript.json
2. cut-silences     (auto-editor)       → segments.json
3. detect-hooks     (Claude Code)       → candidates.json
4. DIRECTORS COUNCIL (3 agents debate)  → approved_clips.json
5. select-clips     (timestamp→frames)  → clip_timelines/
6. compose-layout   (Remotion per clip) → remotion_projects/
7. render           (Remotion CLI)      → shorts/*.mp4 + manifest.json
```

## Structure

```
squads/video-editor/
├── README.md                    ← you are here
├── config.yaml                  ← squad config
├── agents/                      ← 4 agents
│   ├── video-editor-chief.md    ← orchestrator
│   ├── karen-pearlman.md        ← Tier 0 — The Selector
│   ├── mrbeast.md               ← Tier 0 — The Retention Engineer
│   └── walter-murch.md          ← Tier 0 — The Judge
├── tasks/                       ← 7 worker tasks
│   ├── transcribe.md
│   ├── cut-silences.md
│   ├── detect-hooks.md
│   ├── select-clips.md
│   ├── generate-captions.md
│   ├── compose-layout.md
│   └── render.md
├── workflows/
│   └── wf-longform-to-shorts.yaml  ← 7-phase pipeline
└── research/
    ├── TOOL-DISCOVERY.md        ← analysis of 6 open-source repos
    ├── MIND-RESEARCH.md         ← mind research iterations
    └── repos/                   ← cloned reference (gitignored)
```

## Mind DNA

Full mind DNA extraction (voice + thinking) lives in:
- `outputs/minds/karen_pearlman/mind_dna.yaml`
- `outputs/minds/mrbeast/mind_dna.yaml`
- `outputs/minds/walter_murch/mind_dna.yaml`

## Technical stack

| Layer | Tool | Source |
|---|---|---|
| Transcription | Whisper (local) | skill `video-understand` |
| Silence cutting | auto-editor | cloned repo |
| Orchestration patterns | OpenMontage (70% reused) | cloned repo |
| Rendering | Remotion (React) | skill `remotion` |
| Processing | FFmpeg | skill `ffmpeg` |
| LLM decision | Claude / Ollama | user config |

## Pipeline code (Phase 2 — DONE)

Scaffolded and smoke-tested:

```
pipeline/
├── core/                        ← state, progress, runner
│   ├── state.py                 ← PipelineState + StateManager (JSON-backed, resumable)
│   ├── progress.py              ← ProgressTracker + event log
│   ├── runner.py                ← PhaseRunner + Pipeline orchestrator
│   └── __init__.py
├── executors.py                 ← 7 phase executor stubs (TODO: wire real tools)
├── build_pipeline.py            ← factory: phases + veto conditions
├── cli/
│   └── video_editor.py          ← CLI: edit | resume | status
└── remotion-template/           ← Remotion 9:16 template
    ├── src/
    │   ├── Root.tsx
    │   ├── index.ts
    │   ├── compositions/
    │   │   └── PresenterBottomCaptionsTop.tsx  ← layout: video bottom + karaoke captions top
    │   └── data/                ← per-clip config (overwritten by compose-layout)
    ├── package.json
    └── tsconfig.json
```

### Run the CLI

```bash
# From squads/video-editor/
python3 -m pipeline.cli.video_editor edit /path/to/video.mp4 \
  --durations 60,120,300 --counts 5,3,2

# Resume a crashed pipeline
python3 -m pipeline.cli.video_editor resume {pipeline_id}

# Check status
python3 -m pipeline.cli.video_editor status {pipeline_id}
```

### State + artifacts location

- State files: `.aiox/squad-runtime/video-editor/state/{id}.state.json`
- Per-run workdir: `.aiox/squad-runtime/video-editor/{id}/`
  - transcript.json, segments.json, candidates.json
  - approved_clips.json (council decisions)
  - clip_timelines/, remotion_projects/
  - shorts/ + manifest.json

### Smoke test passes

All 7 phases execute (with stub outputs). State persists, resume works,
status reports correctly. Pipeline is ready for real tool integration.

## What's next (Phase 3 — Tool wiring)

The scaffolding is complete. Each phase executor has a clear TODO marking where
real tool integration goes:

- [ ] **Phase 1 — transcribe**: Wire to skill `video-understand` or whisper CLI
- [ ] **Phase 2 — cut_silences**: Wire to `auto-editor` subprocess
- [ ] **Phase 3 — detect_hooks**: Wire to LLM (Ollama local or Claude API)
- [ ] **Phase 4 — directors_council**: Orchestrate 3 director agents (.md personas) — most complex
- [ ] **Phase 5 — select_clips**: Wire to OpenMontage clip-factory pipeline
- [ ] **Phase 6 — compose_layout**: Copy Remotion template per clip + patch data/
- [ ] **Phase 7 — render**: `npx remotion render` CLI per project
- [ ] Install Remotion deps in pipeline/remotion-template/ (`npm install`)
- [ ] End-to-end test on a real longform video

## Based on research

- **Tool discovery:** `research/TOOL-DISCOVERY.md` — analysis of OpenMontage, auto-editor, VideoAgent, ViMax, Director, frame
- **Mind research:** `research/MIND-RESEARCH.md` — 3-iteration selection of elite minds with devil's advocate

---

Created by `@squad-creator:squad-chief` via `*create-squad` workflow.
