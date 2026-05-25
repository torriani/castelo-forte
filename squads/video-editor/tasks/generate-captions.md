# Task: Generate Animated Captions

**Worker:** caption-generator
**Phase:** 6/7 (parallel with compose-layout)
**Tool base:** Remotion + transcript.json word timestamps

## Purpose
Generate karaoke-style animated captions synchronized to word-level timestamps.

## Inputs
- `clip_timelines/` (from phase 5)
- `transcript.json` (word-level)

## Outputs
- `captions/` directory, one `captions_{clip_id}.json` per clip:
  ```json
  {
    "clip_id": "01",
    "words": [
      {"text": "You", "start": 0.0, "end": 0.2, "emphasis": false},
      {"text": "don't", "start": 0.2, "end": 0.4, "emphasis": true}
    ],
    "style": "karaoke_bold_uppercase"
  }
  ```

## Execution steps
1. For each clip timeline:
   - Slice transcript.json by clip's start/end timestamps
   - Normalize word timings relative to clip start (0-based)
   - Detect emphasis words (long words, pauses before/after, keywords)
   - Output captions_{clip_id}.json
2. Validate sync: first word should start <200ms from clip start

## Checkpoint (veto conditions)
- **VETO** if caption drift > 200ms on any clip
- **VETO** if any clip has 0 captions
- **WARN** if avg word duration < 50ms (too fast) or > 800ms (too slow)

## Completion criteria
- captions/ has one file per clip
- Each file validates schema
- All timings are clip-relative (0-based)

## Handoff
→ layout-composer (parallel) consumes captions/ + clip_timelines/
