# TOOL DISCOVERY REPORT: Video Editor AI Squad
## Análise de 6 Repositórios Open-Source para Reutilização

---

## 1. OpenMontage
**Sistema agentico de produção de vídeo com LLM orquestrando 52 ferramentas em 11 pipelines**

### Arquitetura
- **Três camadas de conhecimento**: Tools (execução), Pipeline YAML (orquestração), Skills Markdown (instruções de agentes)
- **11 pipelines prontos**: explainer, animation, avatar, cinematic, clip-factory, hybrid, localization, podcast-repurpose, screen-demo, talking-head
- **52 ferramentas** em 10 categorias: video (13), audio (4), graphics (9), enhancement (5), analysis (4), avatar (2), subtitle (1), capture (3), publishers (1)
- **Remotion + FFmpeg** como motores de composição final

### O que Reusar
- **Pipeline "clip-factory"**: Exatamente o que você precisa - recebe vídeo longo, produz múltiplos shorts otimizados. 8 estágios (idea → script → scene_plan → assets → edit → compose → publish) com checkpoints.
- **Tool registry Python**: Auto-discovery, scored provider selection (7 dimensões: task fit 30%, quality 20%, control 15%, reliability 15%, cost 10%, latency 5%, continuity 5%)
- **Whisper integration**: WhisperX com word-level timestamps (analysis/transcriber.py)
- **Remotion templates**: React-based composition com spring physics, captions TikTok-style, transitions automáticas
- **Quality gates**: Pre-compose validation, post-render self-review (ffprobe + frame sampling + audio analysis)
- **Decision audit trail**: Logging de todas as decisões com alternativas consideradas

### O que NÃO Reusar
- Seleção de clips via agent skills (Markdown) + LLM, não tem algoritmo determinístico para silence/fillers
- Remotion composer é 100% Node.js/React — integração via subprocess ou HTTP
- Escopo muito grande (52 ferramentas). Curva de aprendizado íngreme.

### Score: **9/10**

---

## 2. VideoAgent (HKUDS)
**Multi-agente framework para edição de vídeo com intent analysis + graph-powered workflows**

### Arquitetura
- **3 camadas**: Intent Analysis, Multi-Agent Coordination, Multi-Modal Understanding
- **7 tipos de saída**: Movie Edits, Meme Videos, Music Videos, Commentary, News Video, Video QA/Summarization
- **Agentes**: Classes Python com run() method, coordenação via Claude (LLM)
- **Modelos locais**: CosyVoice, fish-speech, seed-vc, DiffSinger, Whisper, ImageBind

### O que Reusar
- **Intent Analysis pattern**: Decompõe requirements em explicit + implicit sub-intents
- **Graph-powered workflow planning**: Dinamicamente baseado em intents (útil para múltiplos paths: silence-based vs content-based)
- **Adaptive feedback loops**: Self-evaluation + self-correction
- **ImageBind multimodal embeddings**: Matching de cenas similares (seleção de clips por vibe)
- **Whisper large-v3-turbo + ImageBind**: Stack gratuita/local para transcrição + análise visual

### O que NÃO Reusar
- Foco em "remixing" (cross-talk, meme, music), você precisa corte + layout
- Modelos gigantes (vários GB). Seu MVP deve ser leve.
- Orchestration via LLM em loop é custoso para pipeline determinístico

### Score: **6/10**

---

## 3. ViMax (HKUDS)
**Sistema end-to-end agentico de geração de vídeo (Idea2Video, Novel2Video, Script2Video)**

### Arquitetura
- **4 pipelines**: Idea2Video, Novel2Video, Script2Video, AutoCameo
- **Multi-agent workflow**: Screenwriter → Scene Extractor → Character Extractor → Reference Selector → Consistency Checker → Video Generator
- **Agentes como classes Python**: screenwriter.py, reference_image_selector.py, character_extractor.py
- **Componentes-chave**: RAG script generation, storyboard design, multi-camera simulation, consistency tracking

### O que Reusar
- **Character consistency tracking**: Útil para manter apresentador consistente em múltiplos clips
- **Reference image selection + best-frame pipeline**: Parallel generation + MLLM/VLM selection
- **Multi-agent Python + YAML config**: Padrão clean (agents/ + configs/idea2video.yaml)
- **Storyboarding agent**: Natural language → visual shot list

### O que NÃO Reusar
- Foco 100% em GERAÇÃO (image→video), você precisa EDIÇÃO (footage→clips)
- Sem cutting/silence detection. É "ideas to movie" não "long video to shorts"
- Dependency em Google API + MiniMax (não open-source downstream)

### Score: **5/10**

---

## 4. Director (VideoDB)
**Framework para build video agents com VideoDB backend + reasoning engine**

### Arquitetura
- **20+ pre-built agents**: Summarize, Generate, Search, Clip, Edit, Dub, Translate, Audio Editing
- **Backend reasoning engine**: FastAPI com Contextual Understanding → Dynamic Orchestration → Modular Processing
- **Agent base class**: run(), content types (TextContent, VideoContent, ImageContent)
- **VideoDB integration**: Cloud storage, indexing, streaming

### O que Reusar
- **Agent base class pattern**: Simples, extensível
- **Content output types**: Clean para multi-modal output
- **Action status tracking**: progress, success, error states
- **Multi-agent coordination via reasoning engine**: Decompõe user commands em sub-tasks
- **Real-time progress**: push_update() útil para UX

### O que NÃO Reusar
- Heavy dependency em VideoDB SaaS (você precisa on-prem/local)
- 20 agents não têm silence detection + hook extraction
- Chat UI é overkill para batch automation

### Score: **4/10**

---

## 5. auto-editor
**CLI Python para corte automático de vídeo por análise de loudness, motion, etc.**

### Arquitetura
- **Escrito em Nim** (compiled, fast)
- **Edit methods**: audio, motion, threshold-based
- **Marca silêncios/sections**, output XML para Premiere/DaVinci/Final Cut Pro
- **CLI simples**: `auto-editor video.mp4 --edit audio:-19dB --margin 0.2s`

### O que Reusar
- **Core de corte determinístico**: Chamar como subprocess, parse XML output para clip segments
- **Margin concept**: `--margin 0.2s,1.5s` adiciona padding (feel natural)
- **Fast Nim implementation**: Rápido se precisar
- **CLI interface**: Integra bem com Python scripts

### O que NÃO Reusar
- Sem "hook extraction" ou "filler detection" — só silence/motion
- Output XML para editores desktop, não Python nativa
- Sem agentes, LLM ou composição

### Score: **7/10** (complemento, não base)

---

## 6. Frame
**Editor de vídeo open-source estilo Cursor com AI agent chat + drag-and-drop UI**

### Arquitetura
- **Frontend/Backend**: npm monorepo
- **Frame Video Agent**: Chat-based agent para automação
- **Features**: Auto-clip by scene/audio/motion, color correction, smart tagging
- **Cross-platform**: Web, desktop (Electron), mobile future

### O que Reusar
- **Video agent pattern**: IA planejando tarefas via chat
- **Auto-clip triggers**: Scene detection, audio peaks, motion
- **Smart organization**: Face detection + tagging
- **Plugin architecture**: Custom models/effects

### O que NÃO Reusar
- 100% UI/UX focused (Desktop app). Você precisa batch automation headless
- Early stage (README vago sobre internals)
- Node.js/Electron é heavy para server-side

### Score: **2/10**

---

## RECOMENDAÇÃO DE STACK

### Base Principal: **OpenMontage**

**Por que**: 
- Já tem "clip-factory" pipeline exato para shorts de vídeos longos
- Whisper + word-level subtitles integrado
- Remotion templates prontas para layout programático
- Quality gates + decision audit trail maduros
- Scored provider selection

**Como usar**:
1. Clone OpenMontage + adapte `pipeline_defs/clip-factory.yaml`
2. Estenda stage directors para silence detection + hook extraction
3. Integre auto-editor como subprocess no stage edit
4. Customize Remotion templates para seu layout (presenter + captions animadas)

### Complementos

**auto-editor** (subprocess)
- Primeira pass: `auto-editor video.mp4 --edit audio:-19dB`
- Parse output → candidate clip segments
- Integre no OpenMontage edit stage

**VideoAgent components** (patterns only)
- Intent analysis para parsing requisitos (1min/2min/5min)
- Adaptive feedback loops para refinamento
- NÃO use agents completos, só patterns

**ViMax reference tracking** (if needed)
- reference_image_selector.py pattern
- Manter visuals consistentes entre clips

---

## GAPS A CONSTRUIR DO ZERO

1. **Silence Detection + Filler Detection**
   - **Ação**: Python FFmpeg wrapper + Whisper para identify fillers, combinar com auto-editor output

2. **Hook Extraction**
   - **Ação**: Whisper phrases + CLIP embeddings + LLM scoring para rank moment attractiveness

3. **Layout Programático (Presenter + Captions)**
   - **Ação**: Custom React component em Remotion para split-screen, caption placement, animations

4. **Batch Processing Orchestration**
   - **Ação**: Wrapper Python sync que recebe vídeo + target durations, chama OpenMontage headless, retorna clips

---

## QUICK WINS

| Ação | Esforço | Resultado |
|------|---------|-----------|
| Reusar OpenMontage clip-factory YAML + skills | 4h | Workflow base com checkpoints |
| Integrar auto-editor para silence cutting | 2h | Deterministic first-pass |
| Copiar Remotion templates | 8h | Composition engine |
| Whisper + FFmpeg wrapper Python | 3h | Transcrição + trimming nativo |
| Hook detection via Whisper + LLM | 6h | Smart clip candidates |

**Total MVP**: ~23 horas, reutilizando 70% de código/patterns

---

## DECISÃO FINAL

| Repo | Reusar? | Como | Score |
|------|---------|------|-------|
| **OpenMontage** | SIM (base) | pipeline_defs, tool_registry, skills, Remotion | 9/10 |
| **VideoAgent** | SIM (patterns) | Intent analysis, adaptive feedback, ImageBind | 6/10 |
| **ViMax** | SIM (reference) | Character consistency tracking, YAML config | 5/10 |
| **Director** | NÃO | VideoDB lock-in, chat UI overkill | 4/10 |
| **auto-editor** | SIM (subprocess) | Silence detection first-pass | 7/10 |
| **Frame** | NÃO | Desktop UI, não batch headless | 2/10 |

**Stack Final**: OpenMontage (base) + auto-editor (subprocess) + custom Python orchestrator batch + Remotion customizado

