# Task: Transcribe

**Worker:** transcriber
**Phase:** 1/7 in wf-longform-to-shorts
**Tool base:** Whisper (local) via skill `video-understand`

## Purpose
Extract word-level transcript with timestamps from longform video.

## Inputs
- `video_path`: str (mp4/mov/mkv)

## Outputs
- `transcript.json` — structured: `{words: [{text, start, end, confidence}], segments: [{text, start, end}]}`
- `audio_track.wav` — extracted audio (16kHz mono for Whisper)

## Execution steps
1. Extract audio via ffmpeg: `ffmpeg -i {video_path} -ac 1 -ar 16000 audio_track.wav`
2. Run Whisper with word timestamps: `whisper audio_track.wav --word_timestamps True --output_format json`
3. Parse output into transcript.json schema
4. Validate: at least 95% words have confidence field

## Checkpoint (veto conditions)
- **VETO** if avg confidence < 85% → halt, notify user "audio too noisy"
- **VETO** if transcript has 0 words (silent video)
- **VETO** if audio extraction fails

## Completion criteria
- transcript.json exists and is valid JSON
- audio_track.wav exists
- Word count > 100 for videos >5min

## Handoff
→ Phase 2 (silence-cutter) receives both outputs
