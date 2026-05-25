# Task: Cut Silences & Fillers

**Worker:** silence-cutter
**Phase:** 2/7
**Tool base:** auto-editor (Python CLI)

## Purpose
Remove dead air, long silences, breath pauses, and filler words from video.

## Inputs
- `video_path`
- `transcript.json` (from phase 1)

## Outputs
- `segments.json` — kept segments: `[{start, end, reason}]`
- `cleaned_timeline.xml` — auto-editor timeline export

## Execution steps
1. Run auto-editor with threshold: `auto-editor {video_path} --edit audio:-19dB --export xml --output cleaned_timeline.xml`
2. Optional: filler word removal (um, uh, tipo, então): scan transcript.json for filler tokens, add to cut list
3. Parse XML → segments.json with {start, end, reason: "content"|"kept_from_silence_cut"}

## Checkpoint (veto conditions)
- **VETO** if cleaned duration < 50% of original → "audio too noisy, halt"
- **VETO** if segments.json has 0 kept segments
- **WARN** if cleaned duration < 70% (continue but flag)

## Completion criteria
- segments.json valid
- Sum of segment durations > 50% of original
- cleaned_timeline.xml is valid XML parseable by OpenMontage

## Handoff
→ Phase 3 (hook-detector) receives segments.json + transcript.json
