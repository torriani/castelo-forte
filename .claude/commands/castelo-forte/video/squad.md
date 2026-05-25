---
description: "Mostra status e capacidades do squad video-editor Castelo Forte"
---

Você está no repositório **Castelo Forte**. O usuário quer saber o que o squad de vídeo faz.

Mostre **exatamente isto** (formatado bonito):

# Squad Video Editor — Castelo Forte (ATIVO)

**Cliente:** Igreja Castelo Forte (@castelofortemandaqui)
**Localização:** `squads/video-editor/`
**Origem:** cópia adaptada de `legacy/squads/video-editor/`

## O que faz

Transforma vídeos longos (cultos, prédicas, lives) em **shorts/reels editados automaticamente** com múltiplas durações (60s, 120s, 300s). Combina 3 diretores elite com workers técnicos.

> **Filosofia:** "Minds decide what to cut, workers execute how."

## Slash commands deste squad

```
/castelo-forte:video:squad                ← você acabou de rodar este
/castelo-forte:video:video-editor-chief   ← orquestrador, comece aqui
/castelo-forte:video:karen-pearlman       ← The Selector (5-Step + 3 Movements)
/castelo-forte:video:mrbeast              ← The Retention Engineer (CTR/AVD/AVP)
/castelo-forte:video:walter-murch         ← The Judge (Rule of Six)
```

## Workflow principal

`workflows/wf-longform-to-shorts.yaml` — 7 fases end-to-end:
1. Transcribe (Whisper)
2. Cut silences (auto-editor)
3. Detect hooks (LLM)
4. Select clips (OpenMontage + 3 directors)
5. Compose layout (Remotion)
6. Generate captions (Remotion)
7. Render (ffmpeg)

## Pastas de output (Castelo Forte)

```
outputs/videos-editados/{slug}_translated.mp4
outputs/videos-editados/shorts/{slug}__short_{duracao}.mp4
outputs/videos-editados/transcricoes/{slug}.md
```

## Regras inegociáveis

1. **Voice DNA Castelo Forte** carregado antes de selecionar clips
2. **Teologia do Reino** como filtro (clip que contradiz é descartado)
3. NUNCA usar travessão (—, –)
4. Português brasileiro completo (acentos preservados)
5. Citações bíblicas preservadas no original
6. Outputs em `outputs/`, nunca em `squads/`

## Dependências externas

- whisper (local) · auto-editor · ffmpeg · remotion · ollama (opcional)

## Skill relacionada

`/legendar-video` continua usando o squad **legacy** (não este). Este squad é pra trabalhos nativos da igreja.
