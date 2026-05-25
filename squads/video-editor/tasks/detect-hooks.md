# Task: Detect Hooks & Highlights

**Worker:** hook-detector
**Phase:** 3/7
**Tool base:** LLM (Ollama local or Claude API)

## Purpose
Score every segment for hook strength, emotional intensity, and standalone comprehensibility. Produces a ranked list of candidates for the directors council.

## Inputs
- `transcript.json` (words + timestamps)
- `segments.json` (kept segments from phase 2)

## Outputs
- `candidates.json` — ranked list: `[{segment_id, start, end, text, hook_score, emotion_score, rhythm_score, standalone_score, combined_score}]`

## Execution steps
1. **Windowing:** Create sliding windows (30s, 60s, 120s, 300s) over transcript
2. **LLM scoring prompt** per window:
   ```
   Score this video segment from 0-10 on:
   - HOOK_SCORE: Does the first 5s grab attention?
   - EMOTION_SCORE: Does it evoke emotion (curiosity, surprise, insight)?
   - RHYTHM_SCORE: Does it flow naturally without dead air?
   - STANDALONE_SCORE: Can someone watch this alone (no missing context)?

   Segment text: {text}
   Return JSON: {hook, emotion, rhythm, standalone}
   ```
3. **Combined score:** `0.4*hook + 0.3*emotion + 0.2*rhythm + 0.1*standalone`
4. **Rank and filter:** Keep segments with `combined_score > 5.5`

## Checkpoint (veto conditions)
- **VETO** if < 10 candidates with combined_score > 6.0 → "video lacks strong hooks, halt"
- **VETO** if LLM unavailable
- **WARN** if best candidate has hook_score < 7

## Completion criteria
- candidates.json valid and ranked
- At least 15 candidates across all window sizes
- Each candidate has all 4 sub-scores + combined

## Handoff
→ Phase 4 (directors council) receives candidates.json
