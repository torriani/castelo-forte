"""
Phase executors for video-editor pipeline.

Status (Phase 3 — tool wiring in progress):
  - Phase 1 (transcribe):          REAL  — ffmpeg + whisper via pipeline.tools
  - Phase 2 (cut-silences):        REAL  — auto-editor via pipeline.tools
  - Phase 3 (detect-hooks):        STUB  — needs LLM (Ollama/Claude)
  - Phase 4 (directors-council):   STUB  — needs agent orchestration
  - Phase 5 (select-clips):        REAL  — ffprobe + timestamp→frame mapping
  - Phase 6 (compose-layout):      REAL  — copy Remotion template + patch JSON
  - Phase 7 (render):              REAL  — remotion render CLI

Helpers are in pipeline.tools (isolated subprocess wrappers).
"""
from __future__ import annotations

import json
import shutil
from dataclasses import asdict
from pathlib import Path
from typing import Any

from . import tools
from .core.progress import ProgressTracker
from .core.state import PipelinePhase, PipelineState


def _workdir(state: PipelineState) -> Path:
    """Canonical workdir for this pipeline run."""
    root = Path(".aiox/squad-runtime/video-editor") / state.pipeline_id
    root.mkdir(parents=True, exist_ok=True)
    return root


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 1 — Transcribe (REAL: ffmpeg + whisper)
# ═══════════════════════════════════════════════════════════════════════════════
def transcribe(state: PipelineState, progress: ProgressTracker) -> dict[str, Any]:
    """
    Extract mono 16kHz audio via ffmpeg → transcribe via OpenAI Whisper CLI
    with word-level timestamps.

    Whisper model: 'base' (good balance speed/quality). Override via env
    WHISPER_MODEL in future if needed.
    """
    wd = _workdir(state)
    source = Path(state.source_video)

    # Probe video first so downstream phases have metadata
    progress.progress(PipelinePhase.TRANSCRIBE, "Probing video with ffprobe...")
    meta = tools.ffprobe_video(source)
    progress.progress(
        PipelinePhase.TRANSCRIBE,
        f"Video: {meta.duration_seconds:.1f}s, {meta.fps}fps, {meta.width}x{meta.height}",
    )

    # Audio extraction
    progress.progress(PipelinePhase.TRANSCRIBE, "Extracting audio (ffmpeg)...")
    audio_path = wd / "audio_track.wav"
    tools.ffmpeg_extract_audio(source, audio_path)

    # Transcription
    progress.progress(
        PipelinePhase.TRANSCRIBE, "Running Whisper (model=base)..."
    )
    whisper_workdir = wd / "whisper"
    transcript = tools.whisper_transcribe(
        audio_path, whisper_workdir, model="base",
        initial_prompt=state.whisper_prompt,
    )

    # Persist normalized transcript
    transcript_path = wd / "transcript.json"
    payload = transcript.to_json()
    payload["video_metadata"] = {
        "duration_seconds": meta.duration_seconds,
        "fps": meta.fps,
        "width": meta.width,
        "height": meta.height,
    }
    transcript_path.write_text(json.dumps(payload, indent=2))

    state.transcript_path = str(transcript_path)
    state.audio_path = str(audio_path)

    progress.progress(
        PipelinePhase.TRANSCRIBE,
        f"Transcribed {len(transcript.words)} words "
        f"({transcript.language}, avg_conf={transcript.avg_confidence:.2f})",
    )

    return {
        "transcript_path": str(transcript_path),
        "audio_path": str(audio_path),
        "word_count": len(transcript.words),
        "confidence": transcript.avg_confidence,
        "language": transcript.language,
        "video_duration_seconds": meta.duration_seconds,
        "video_fps": meta.fps,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 1B — Translate Transcript (Claude Code inline — NOT via external API)
#
# This phase is NOT executed by Python. The edit-translate pipeline splits:
#   Stage A (Python): transcribe + cut silences → transcript.json + segments.json
#   Stage B (Claude Code): reads transcript.json, translates inline (Haiku),
#                           writes transcript_translated.json
#   Stage C (Python): compose layout + render (reads translated transcript)
#
# The CLI commands are:
#   edit-translate-stage-a  → runs Stage A, prints pipeline_id + paths
#   edit-translate-stage-c  → runs Stage C from saved state
# ═══════════════════════════════════════════════════════════════════════════════


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 2 — Cut Silences (REAL: auto-editor)
# ═══════════════════════════════════════════════════════════════════════════════
def cut_silences(state: PipelineState, progress: ProgressTracker) -> dict[str, Any]:
    """
    Detect silences + fillers using auto-editor's v1 timeline export.
    Produces kept_segments list (start/end seconds).
    """
    wd = _workdir(state)
    source = Path(state.source_video)

    # Load fps from previous phase's video metadata
    transcript_data = json.loads(Path(state.transcript_path or "").read_text())
    fps = float(transcript_data.get("video_metadata", {}).get("fps", 30.0))
    source_duration = float(
        transcript_data.get("video_metadata", {}).get("duration_seconds", 0.0)
    )

    progress.progress(
        PipelinePhase.CUT_SILENCES,
        f"Running auto-editor (threshold=-19dB, fps={fps})...",
    )

    timeline_json = wd / "auto_editor_timeline.json"
    kept = tools.auto_editor_cut_silences(
        source, timeline_json, fps=fps, silence_threshold_db=-19
    )

    kept_total = sum(s.end - s.start for s in kept)
    ratio = (kept_total / source_duration) if source_duration > 0 else 1.0

    segments_path = wd / "segments.json"
    segments_path.write_text(
        json.dumps(
            {
                "fps": fps,
                "source_duration_seconds": source_duration,
                "kept_total_seconds": kept_total,
                "kept_duration_ratio": ratio,
                "kept_segments": [asdict(s) for s in kept],
            },
            indent=2,
        )
    )

    state.segments_path = str(segments_path)

    progress.progress(
        PipelinePhase.CUT_SILENCES,
        f"Kept {len(kept)} segments = {kept_total:.1f}s ({ratio*100:.0f}%)",
    )

    return {
        "segments_path": str(segments_path),
        "timeline_json": str(timeline_json),
        "kept_segment_count": len(kept),
        "kept_duration_ratio": ratio,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 3 — Detect Hooks (LLM)
# ═══════════════════════════════════════════════════════════════════════════════
def detect_hooks(state: PipelineState, progress: ProgressTracker) -> dict[str, Any]:
    """
    TODO: Wire to LLM (Ollama local or Claude API).
    Prompt: score segments for hook/emotion/rhythm/standalone (0-10 each).
    """
    wd = _workdir(state)
    progress.progress(PipelinePhase.DETECT_HOOKS, "Scoring segments via LLM...")

    candidates_path = wd / "candidates.json"

    # TODO: Real implementation
    # - Load transcript + segments
    # - Create sliding windows (30s, 60s, 120s, 300s)
    # - For each window, call LLM with scoring prompt
    # - Combine scores: 0.4*hook + 0.3*emotion + 0.2*rhythm + 0.1*standalone

    stub_candidates = {
        "candidates": [],
        "_stub": True,
        "_note": "Each candidate needs: {id, start, end, text, hook_score, emotion_score, rhythm_score, standalone_score, combined_score}",
    }
    candidates_path.write_text(json.dumps(stub_candidates, indent=2))

    state.candidates_path = str(candidates_path)

    return {
        "candidates_path": str(candidates_path),
        "candidate_count": 0,
        "strong_candidates": 0,  # combined_score > 6.0
    }


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 4 — Directors Council (the heart of the squad)
# ═══════════════════════════════════════════════════════════════════════════════
def directors_council(
    state: PipelineState, progress: ProgressTracker
) -> dict[str, Any]:
    """
    TODO: Orchestrate the 3 director agents (Pearlman, MrBeast, Murch).

    Flow:
      1. Pearlman applies 5-stage process → proposes initial list
      2. MrBeast reviews → vetoes clips with projected AVD <50%
      3. Murch resolves deadlocks → applies Rule of Six

    This is the most complex phase. Options for implementation:
      A) Call Claude API with each agent's .md as system prompt (3 round-trips)
      B) Use local Ollama with agent personas loaded
      C) Invoke via Claude Code Task tool (if running inside Claude Code)

    Output: approved_clips.json with consensus + reasoning from each director.
    """
    wd = _workdir(state)
    progress.progress(
        PipelinePhase.DIRECTORS_COUNCIL,
        "Dispatching to @karen-pearlman → @mrbeast → @walter-murch...",
    )

    approved_path = wd / "approved_clips.json"

    # TODO: Real multi-agent orchestration
    # See: agents/karen-pearlman.md, agents/mrbeast.md, agents/walter-murch.md

    stub_approved = {
        "clips": [],
        "council_decisions": [],
        "_stub": True,
        "_note": (
            "Each clip needs: "
            "{id, start, end, pearlman_verdict, mrbeast_verdict, murch_verdict, final}"
        ),
    }
    approved_path.write_text(json.dumps(stub_approved, indent=2))

    state.approved_clips_path = str(approved_path)
    state.directors_debate_log.append(
        {
            "phase": "council",
            "note": "STUB — wire to real agent orchestration",
        }
    )

    return {
        "approved_clips_path": str(approved_path),
        "approved_count": 0,
        "pearlman_proposed": 0,
        "mrbeast_vetoed": 0,
        "murch_tiebroke": 0,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 5 — Select Clips (REAL: timestamp→frame mapping)
# ═══════════════════════════════════════════════════════════════════════════════
def select_clips(state: PipelineState, progress: ProgressTracker) -> dict[str, Any]:
    """
    Convert approved_clips.json → one clip_{id}.json per short with absolute
    frame numbers ready for Remotion.

    Note: OpenMontage integration can replace this later; the lightweight
    version produces the same schema Remotion template expects.
    """
    wd = _workdir(state)
    timelines_dir = wd / "clip_timelines"
    timelines_dir.mkdir(exist_ok=True)

    progress.progress(
        PipelinePhase.SELECT_CLIPS, "Mapping timestamps to frames..."
    )

    transcript_data = json.loads(Path(state.transcript_path or "").read_text())
    fps = float(transcript_data.get("video_metadata", {}).get("fps", 30.0))

    approved_path = Path(state.approved_clips_path or "")
    approved = (
        json.loads(approved_path.read_text()) if approved_path.exists() else {}
    )
    clips = approved.get("clips") or approved.get("approved_clips") or []

    # Fallback: if council stub returned no clips, derive from segments
    if not clips:
        segments_data = json.loads(Path(state.segments_path or "").read_text())
        kept = segments_data.get("kept_segments", [])
        # Take target counts and pick evenly from kept segments
        target_counts = state.target_counts
        clips = []
        clip_idx = 0
        for dur, count in target_counts.items():
            picked = 0
            for seg in kept:
                if picked >= count:
                    break
                seg_dur = seg["end"] - seg["start"]
                if seg_dur >= dur:
                    clips.append(
                        {
                            "id": f"{clip_idx:02d}",
                            "start": seg["start"],
                            "end": seg["start"] + dur,
                            "target_duration": dur,
                            "source": "derived_from_segments_fallback",
                        }
                    )
                    clip_idx += 1
                    picked += 1

    written = 0
    for clip in clips:
        clip_id = str(clip.get("id", f"{written:02d}"))
        start_sec = float(clip["start"])
        end_sec = float(clip["end"])
        duration = end_sec - start_sec

        timeline_file = timelines_dir / f"clip_{clip_id}.json"
        timeline_file.write_text(
            json.dumps(
                {
                    "id": clip_id,
                    "source": state.source_video,
                    "start_seconds": start_sec,
                    "end_seconds": end_sec,
                    "start_frame": int(round(start_sec * fps)),
                    "end_frame": int(round(end_sec * fps)),
                    "fps": fps,
                    "duration_seconds": duration,
                    "target_duration": clip.get("target_duration"),
                    "directors_reasoning": clip.get("directors_reasoning", {}),
                },
                indent=2,
            )
        )
        written += 1

    state.clip_timelines_dir = str(timelines_dir)

    progress.progress(
        PipelinePhase.SELECT_CLIPS, f"Generated {written} clip timelines"
    )

    return {
        "clip_timelines_dir": str(timelines_dir),
        "timeline_count": written,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 6 — Compose Layout (REAL: Remotion template instantiation)
# ═══════════════════════════════════════════════════════════════════════════════
def compose_layout(
    state: PipelineState, progress: ProgressTracker
) -> dict[str, Any]:
    """
    For each clip timeline, instantiate a Remotion project by copying the
    shared template and patching src/data/{clip,captions}.json.

    node_modules is installed once in the base template and symlinked into
    each per-clip project to save disk space + install time.
    """
    wd = _workdir(state)
    projects_dir = wd / "remotion_projects"
    projects_dir.mkdir(exist_ok=True)

    progress.progress(
        PipelinePhase.COMPOSE_LAYOUT,
        f"Instantiating Remotion template: {state.style_preset}",
    )

    template_dir = Path(__file__).resolve().parent / "remotion-template"
    if not template_dir.exists():
        raise RuntimeError(f"Remotion template not found at {template_dir}")

    # Ensure base template has node_modules (install once, reuse via symlink)
    progress.progress(
        PipelinePhase.COMPOSE_LAYOUT, "Ensuring Remotion dependencies installed..."
    )
    tools.remotion_install(template_dir)

    # Load transcript for caption slicing
    transcript_data = json.loads(Path(state.transcript_path or "").read_text())
    all_words = transcript_data.get("words", [])

    timelines_dir = Path(state.clip_timelines_dir or "")
    project_count = 0

    for timeline_file in sorted(timelines_dir.glob("clip_*.json")):
        clip = json.loads(timeline_file.read_text())
        clip_id = clip["id"]

        project = projects_dir / f"clip_{clip_id}"
        # Copy template (excluding node_modules — we symlink below)
        if project.exists():
            shutil.rmtree(project)
        shutil.copytree(
            template_dir,
            project,
            ignore=shutil.ignore_patterns("node_modules", "out"),
        )

        # Symlink node_modules from template (saves ~200MB per clip)
        nm_src = template_dir / "node_modules"
        nm_dst = project / "node_modules"
        if nm_src.exists() and not nm_dst.exists():
            nm_dst.symlink_to(nm_src, target_is_directory=True)

        # Copy source video into project's public/ dir so Remotion can serve it
        public_dir = project / "public"
        public_dir.mkdir(parents=True, exist_ok=True)
        video_filename = Path(state.source_video).name
        local_video = public_dir / video_filename
        if not local_video.exists():
            shutil.copy2(state.source_video, local_video)

        # Patch data/clip.json — use relative URL that Remotion serves from public/
        clip_data_file = project / "src" / "data" / "clip.json"
        clip_data_file.parent.mkdir(parents=True, exist_ok=True)
        clip_data_file.write_text(
            json.dumps(
                {
                    "source": f"/{video_filename}",
                    "start_frame": clip["start_frame"],
                    "end_frame": clip["end_frame"],
                    "fps": clip["fps"],
                    "duration_seconds": clip["duration_seconds"],
                },
                indent=2,
            )
        )

        # Slice transcript words into clip window, rebase timings to clip start
        clip_words = []
        for w in all_words:
            w_start = float(w.get("start", 0))
            w_end = float(w.get("end", 0))
            if w_end < clip["start_seconds"] or w_start > clip["end_seconds"]:
                continue
            clip_words.append(
                {
                    "text": w.get("text", ""),
                    "start": max(0.0, w_start - clip["start_seconds"]),
                    "end": min(
                        clip["duration_seconds"], w_end - clip["start_seconds"]
                    ),
                    "emphasis": len(w.get("text", "")) >= 6,
                }
            )

        # Fallback caption if no words sliced (e.g., non-speech audio)
        if not clip_words:
            clip_words = [
                {
                    "text": "...",
                    "start": 0.0,
                    "end": clip["duration_seconds"],
                    "emphasis": False,
                }
            ]

        captions_file = project / "src" / "data" / "captions.json"
        captions_file.write_text(json.dumps({"words": clip_words}, indent=2))

        project_count += 1
        progress.progress(
            PipelinePhase.COMPOSE_LAYOUT,
            f"  · clip_{clip_id}: {clip['duration_seconds']:.1f}s, "
            f"{len(clip_words)} words",
        )

    state.remotion_projects_dir = str(projects_dir)

    return {
        "remotion_projects_dir": str(projects_dir),
        "project_count": project_count,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 7 — Render (REAL: remotion render CLI)
# ═══════════════════════════════════════════════════════════════════════════════
def render(state: PipelineState, progress: ProgressTracker) -> dict[str, Any]:
    """
    Run `npx remotion render` for each project directory. Writes final MP4s
    to shorts/ plus a manifest.json with metadata + directors reasoning.
    """
    from datetime import datetime

    wd = _workdir(state)
    shorts_dir = wd / "shorts"
    shorts_dir.mkdir(exist_ok=True)
    manifest_path = wd / "manifest.json"

    projects_dir = Path(state.remotion_projects_dir or "")
    manifest_shorts: list[dict[str, Any]] = []

    for project in sorted(projects_dir.glob("clip_*")):
        if not project.is_dir():
            continue
        clip_id = project.name.replace("clip_", "")

        # Load clip metadata for naming/manifest
        clip_data_file = project / "src" / "data" / "clip.json"
        clip_meta = (
            json.loads(clip_data_file.read_text())
            if clip_data_file.exists()
            else {}
        )
        duration = int(round(float(clip_meta.get("duration_seconds", 0))))
        out_file = shorts_dir / f"short_{clip_id}_{duration}s.mp4"

        progress.progress(
            PipelinePhase.RENDER, f"Rendering clip_{clip_id} → {out_file.name}"
        )
        try:
            tools.remotion_render(project, "Short", out_file, codec="h264")
        except tools.ToolFailure as exc:
            progress.progress(
                PipelinePhase.RENDER, f"  ⚠ Render failed: {exc}"
            )
            continue

        manifest_shorts.append(
            {
                "id": clip_id,
                "path": str(out_file.relative_to(wd)),
                "duration_seconds": clip_meta.get("duration_seconds"),
                "start_seconds": None,  # filled from timeline if available
                "file_size_bytes": out_file.stat().st_size,
            }
        )

    manifest = {
        "pipeline_id": state.pipeline_id,
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "source_video": state.source_video,
        "target_counts": state.target_counts,
        "style_preset": state.style_preset,
        "shorts_count": len(manifest_shorts),
        "shorts": manifest_shorts,
    }
    manifest_path.write_text(json.dumps(manifest, indent=2))

    state.shorts_dir = str(shorts_dir)
    state.manifest_path = str(manifest_path)

    progress.progress(
        PipelinePhase.RENDER,
        f"Rendered {len(manifest_shorts)} shorts → {shorts_dir}",
    )

    return {
        "shorts_dir": str(shorts_dir),
        "manifest_path": str(manifest_path),
        "rendered_count": len(manifest_shorts),
    }


# ═══════════════════════════════════════════════════════════════════════════════
# EDIT MODE — compose_full_layout (REAL: full-video Remotion template)
# ═══════════════════════════════════════════════════════════════════════════════
def compose_full_layout(
    state: PipelineState, progress: ProgressTracker
) -> dict[str, Any]:
    """
    Traditional edit mode: instantiate ONE Remotion project covering the full
    cleaned video with captions and optional image overlay.

    Reads image overlay config from state.directors_debate_log (sentinel for
    edit mode params) or state.style_preset (aspect ratio).
    """
    wd = _workdir(state)
    project = wd / "edit_project"
    if project.exists():
        shutil.rmtree(project)
    progress.progress(
        PipelinePhase.COMPOSE_LAYOUT, "Instantiating full-video Remotion template..."
    )

    template_dir = (
        Path(__file__).resolve().parent / "remotion-template-full"
    )
    if not template_dir.exists():
        raise RuntimeError(
            f"Edit template not found at {template_dir} — run npm install in it first"
        )

    tools.remotion_install(template_dir)

    # Parse edit-mode config from style_preset:
    #   "edit:{aspect}:{image_path or ''}"
    #   "edit-translate:{aspect}:{lang}:{image_path or ''}"
    aspect = "original"
    image_path: str | None = None
    overlay_windows: list[dict[str, Any]] = []
    if state.style_preset and state.style_preset.startswith("edit-translate:"):
        parts = state.style_preset.split(":", 3)
        if len(parts) >= 2:
            aspect = parts[1]
        # parts[2] is target_lang (already consumed by translate phase)
        if len(parts) >= 4 and parts[3]:
            image_path = parts[3]
    elif state.style_preset and state.style_preset.startswith("edit:"):
        parts = state.style_preset.split(":", 2)
        if len(parts) >= 2:
            aspect = parts[1]
        if len(parts) >= 3 and parts[2]:
            image_path = parts[2]

    # Load transcript + video metadata.
    # In edit-translate mode, prefer transcript_translated.json (written in Stage B)
    # so captions are rendered in the target language.
    transcript_path_to_load = Path(state.transcript_path or "")
    if state.style_preset and state.style_preset.startswith("edit-translate:"):
        translated = wd / "transcript_translated.json"
        if translated.exists():
            transcript_path_to_load = translated
    transcript_data = json.loads(transcript_path_to_load.read_text())
    source_fps = float(transcript_data.get("video_metadata", {}).get("fps", 30.0))
    source_duration = float(
        transcript_data.get("video_metadata", {}).get("duration_seconds", 0.0)
    )
    source_width = int(
        transcript_data.get("video_metadata", {}).get("width", 1920)
    )
    source_height = int(
        transcript_data.get("video_metadata", {}).get("height", 1080)
    )

    # Resolve output dimensions based on aspect
    aspect_map = {
        "original": (source_width, source_height),
        "16:9": (1920, 1080),
        "9:16": (1080, 1920),
        "1:1": (1080, 1080),
    }
    out_w, out_h = aspect_map.get(aspect, (source_width, source_height))

    # Copy template
    shutil.copytree(
        template_dir,
        project,
        ignore=shutil.ignore_patterns("node_modules", "out"),
    )
    nm_src = template_dir / "node_modules"
    nm_dst = project / "node_modules"
    if nm_src.exists() and not nm_dst.exists():
        nm_dst.symlink_to(nm_src, target_is_directory=True)

    # Copy source video into project public/
    public_dir = project / "public"
    public_dir.mkdir(parents=True, exist_ok=True)
    video_filename = Path(state.source_video).name
    local_video = public_dir / video_filename
    if not local_video.exists():
        shutil.copy2(state.source_video, local_video)

    # Copy overlay image (if provided)
    overlay_image_rel: str | None = None
    if image_path:
        img_file = Path(image_path)
        if img_file.exists():
            img_filename = img_file.name
            shutil.copy2(img_file, public_dir / img_filename)
            overlay_image_rel = f"/{img_filename}"
            overlay_windows = [
                {
                    "start": state.overlay_start if state.overlay_start is not None else 0.0,
                    "end": state.overlay_end if state.overlay_end is not None else source_duration,
                    "position": state.overlay_position or "top-right",
                }
            ]

    # Patch data/clip.json
    clip_data_file = project / "src" / "data" / "clip.json"
    clip_data_file.write_text(
        json.dumps(
            {
                "source": f"/{video_filename}",
                "fps": source_fps,
                "duration_seconds": source_duration,
                "output_width": out_w,
                "output_height": out_h,
                "aspect": aspect,
            },
            indent=2,
        )
    )

    # Patch data/captions.json — slice all transcript words (rebased to 0)
    all_words = transcript_data.get("words", [])
    caption_words = [
        {
            "text": w.get("text", ""),
            "start": float(w.get("start", 0)),
            "end": float(w.get("end", 0)),
            "emphasis": len(w.get("text", "")) >= 6,
        }
        for w in all_words
    ]
    if not caption_words:
        caption_words = [
            {"text": "...", "start": 0.0, "end": source_duration, "emphasis": False}
        ]
    captions_file = project / "src" / "data" / "captions.json"
    captions_file.write_text(json.dumps({"words": caption_words}, indent=2))

    # Patch data/overlay.json
    overlay_file = project / "src" / "data" / "overlay.json"
    overlay_file.write_text(
        json.dumps(
            {
                "image": overlay_image_rel,
                "windows": overlay_windows,
            },
            indent=2,
        )
    )

    state.remotion_projects_dir = str(project.parent)

    progress.progress(
        PipelinePhase.COMPOSE_LAYOUT,
        f"Edit project ready: {source_duration:.1f}s, "
        f"{out_w}x{out_h} ({aspect}), "
        f"{len(caption_words)} words"
        + (f", overlay={Path(image_path).name}" if image_path else ""),
    )

    return {
        "project_dir": str(project),
        "project_count": 1,
        "duration_seconds": source_duration,
        "output_resolution": f"{out_w}x{out_h}",
        "has_overlay": bool(overlay_image_rel),
    }


# ═══════════════════════════════════════════════════════════════════════════════
# EDIT MODE — render_full_video (REAL: single MP4 output)
# ═══════════════════════════════════════════════════════════════════════════════
def render_full_video(
    state: PipelineState, progress: ProgressTracker
) -> dict[str, Any]:
    """
    Render the single edit_project to one output MP4.
    """
    from datetime import datetime

    wd = _workdir(state)

    # Canonical output location: legacy/outputs/videos-editados/
    # All edited/translated videos go here (single source of truth).
    canonical_dir = (
        Path(__file__).resolve().parents[3] / "outputs" / "videos-editados"
    )
    canonical_dir.mkdir(parents=True, exist_ok=True)

    source_name = Path(state.source_video).stem
    is_translate = state.style_preset and "edit-translate:" in state.style_preset
    suffix = "_translated" if is_translate else "_edited"
    out_file = canonical_dir / f"{source_name}{suffix}.mp4"

    project = wd / "edit_project"
    if not project.exists():
        raise RuntimeError(f"Edit project not found at {project}")

    progress.progress(
        PipelinePhase.RENDER, f"Rendering full edit → {out_file.name}"
    )
    tools.remotion_render(project, "FullEdit", out_file, codec="h264")

    manifest_path = wd / "manifest.json"
    mode = "edit-translate" if is_translate else "edit"
    manifest = {
        "pipeline_id": state.pipeline_id,
        "mode": mode,
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "source_video": state.source_video,
        "output": str(out_file),
        "file_size_bytes": out_file.stat().st_size,
    }
    manifest_path.write_text(json.dumps(manifest, indent=2))

    state.shorts_dir = str(canonical_dir)
    state.manifest_path = str(manifest_path)

    progress.progress(
        PipelinePhase.RENDER,
        f"Rendered edit → {out_file} ({out_file.stat().st_size / 1024:.0f} KB)",
    )

    return {
        "output_file": str(out_file),
        "manifest_path": str(manifest_path),
        "file_size_bytes": out_file.stat().st_size,
    }
