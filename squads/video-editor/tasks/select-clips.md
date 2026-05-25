# Task: Assemble Clip Timelines

**Worker:** clip-selector
**Phase:** 5/7
**Tool base:** OpenMontage clip-factory pipeline

## Purpose
Convert approved_clips.json (from directors council) into concrete video timelines ready for rendering.

## Inputs
- `approved_clips.json` (from phase 4 council)
- `video_path` (original)
- `segments.json`

## Outputs
- `clip_timelines/` directory with N files: `clip_{id}_{duration}s.json` each containing:
  ```json
  {
    "source": "video_path",
    "start_frame": 1234,
    "end_frame": 5678,
    "fps": 30,
    "duration_seconds": 60,
    "transcript_slice": "...",
    "directors_reasoning": {...}
  }
  ```

## Execution steps
1. Load OpenMontage clip-factory config
2. For each approved clip in approved_clips.json:
   - Map timestamps → frame numbers (via fps)
   - Validate no overlap with other selected clips
   - Generate timeline JSON
3. Write all timelines to clip_timelines/

## Checkpoint (veto conditions)
- **VETO** if any two clips overlap by >20%
- **VETO** if any clip's start_frame > end_frame
- **VETO** if count of output timelines ≠ target_counts sum

## Completion criteria
- clip_timelines/ contains exactly N files
- All timelines validate against OpenMontage schema
- No overlaps

## Handoff
→ Phase 6 (caption-generator + layout-composer) receives clip_timelines/
