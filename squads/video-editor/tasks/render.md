# Task: Final Render

**Worker:** renderer
**Phase:** 7/7
**Tool base:** Remotion CLI + ffmpeg (skill `ffmpeg`)

## Purpose
Render each Remotion project to final MP4 and produce a manifest.

## Inputs
- `remotion_projects/`

## Outputs
- `shorts/` — final MP4 files named `short_{id}_{duration}s.mp4`
- `manifest.json`:
  ```json
  {
    "generated_at": "ISO8601",
    "source_video": "...",
    "shorts": [
      {
        "id": "01",
        "path": "shorts/short_01_60s.mp4",
        "duration_seconds": 60,
        "resolution": "1080x1920",
        "transcript": "...",
        "hook_score": 8.4,
        "directors_consensus": {
          "pearlman": "Passes 5-step, strong Movement 2",
          "mrbeast": "Projected AVD 72%, approved",
          "murch": "Emotion + rhythm aligned"
        }
      }
    ]
  }
  ```

## Execution steps
1. For each project in remotion_projects/:
   - Run: `npx remotion render Composition out/short_{id}.mp4 --codec h264`
   - Validate output exists and is >0 bytes
   - Optional: ffmpeg post-process for compression `-crf 23 -preset medium`
2. Collect metadata + directors reasoning from approved_clips.json
3. Write manifest.json

## Checkpoint (veto conditions)
- **VETO** if any render returns non-zero exit → retry once, else log and continue
- **VETO** if final file size < 100KB (render failed silently)
- **VETO** if duration differs from target by >2s

## Completion criteria
- shorts/ contains N valid MP4 files
- Each file plays (ffprobe validates)
- manifest.json generated with all metadata
- Sum of shorts durations matches expected total

## Post-execution summary
Return to chief:
```
✅ Rendered 7 shorts (32 min total runtime)
📦 Output: shorts/
📄 Manifest: manifest.json
⚠️  Warnings: {any}
```

## This is the terminal phase of wf-longform-to-shorts.
