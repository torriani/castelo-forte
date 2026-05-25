"""
CLI entry point for video-editor squad.

Two modes:

  *edit  — Traditional video edit: clean silences + captions + optional image overlay.
           Preserves the whole video, just polishes it.

  *clips — Longform → multiple shorts: 7-phase pipeline with directors council.
           Chops a long video into N shorts of varying durations.

Both modes share Stage A (transcribe + cut silences). They diverge after.

Usage:
    # Traditional edit — one polished video out
    python3 -m pipeline.cli.video_editor edit INPUT.mp4
    python3 -m pipeline.cli.video_editor edit INPUT.mp4 --image materia.png
    python3 -m pipeline.cli.video_editor edit INPUT.mp4 --image materia.png --aspect 9:16

    # Edit + Translate — 3-stage: Python → Claude Code → Python
    python3 -m pipeline.cli.video_editor edit-translate-stage-a INPUT_EN.mp4 --lang pt
    # ... Claude Code translates transcript.json → transcript_translated.json ...
    python3 -m pipeline.cli.video_editor edit-translate-stage-c PIPELINE_ID

    # Clips mode — longform → shorts
    python3 -m pipeline.cli.video_editor clips INPUT.mp4 \\
        --durations 60,120,300 --counts 5,3,2

    # Clips in stages (for Claude Code orchestration of directors council)
    python3 -m pipeline.cli.video_editor clips-stage-a INPUT.mp4 --durations 60 --counts 3
    python3 -m pipeline.cli.video_editor clips-stage-c PIPELINE_ID

    # Common
    python3 -m pipeline.cli.video_editor resume PIPELINE_ID
    python3 -m pipeline.cli.video_editor status PIPELINE_ID
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from pipeline.build_pipeline import (  # noqa: E402
    build_clips_pipeline,
    build_clips_stage_a,
    build_clips_stage_c,
    build_edit_pipeline,
    build_edit_translate_stage_a,
    build_edit_translate_stage_c,
)
from pipeline.core.progress import ProgressTracker  # noqa: E402
from pipeline.core.state import PipelineStateManager  # noqa: E402


def _parse_counts(durations_str: str, counts_str: str) -> dict[int, int]:
    durations = [int(x) for x in durations_str.split(",")]
    counts = [int(x) for x in counts_str.split(",")]
    if len(durations) != len(counts):
        raise ValueError(
            f"--durations has {len(durations)} items, --counts has {len(counts)}"
        )
    return dict(zip(durations, counts))


# ═══════════════════════════════════════════════════════════════════════════════
# EDIT (traditional polish)
# ═══════════════════════════════════════════════════════════════════════════════
def cmd_edit(args: argparse.Namespace) -> int:
    source = Path(args.input).resolve()
    if not source.exists():
        print(f"ERROR: source video not found: {source}", file=sys.stderr)
        return 1

    image_path: str | None = None
    if args.image:
        img = Path(args.image).resolve()
        if not img.exists():
            print(f"ERROR: image not found: {img}", file=sys.stderr)
            return 1
        image_path = str(img)

    pipeline = build_edit_pipeline()
    # Encode edit-mode config into style_preset: "edit:{aspect}:{image_path or ''}"
    style = f"edit:{args.aspect}:{image_path or ''}"
    state = pipeline.run(
        source_video=str(source),
        target_counts={},
        style_preset=style,
        whisper_prompt=args.prompt,
        overlay_start=args.overlay_start,
        overlay_end=args.overlay_end,
        overlay_position=args.overlay_position,
    )
    return 0 if not state.is_blocked() else 2


# ═══════════════════════════════════════════════════════════════════════════════
# EDIT-TRANSLATE (3-stage: Python transcribe → Claude Code translate → Python render)
# ═══════════════════════════════════════════════════════════════════════════════
def cmd_edit_translate_stage_a(args: argparse.Namespace) -> int:
    """Stage A: transcribe + cut silences. Outputs transcript for Claude Code to translate."""
    source = Path(args.input).resolve()
    if not source.exists():
        print(f"ERROR: source video not found: {source}", file=sys.stderr)
        return 1

    image_path: str | None = None
    if args.image:
        img = Path(args.image).resolve()
        if not img.exists():
            print(f"ERROR: image not found: {img}", file=sys.stderr)
            return 1
        image_path = str(img)

    pipeline = build_edit_translate_stage_a()
    style = f"edit-translate:{args.aspect}:{args.lang}:{image_path or ''}"
    state = pipeline.run(
        source_video=str(source),
        target_counts={},
        style_preset=style,
        whisper_prompt=args.prompt,
        overlay_start=args.overlay_start,
        overlay_end=args.overlay_end,
        overlay_position=args.overlay_position,
    )
    print(f"\n--- EDIT-TRANSLATE STAGE A OUTPUT ---")
    print(f"pipeline_id: {state.pipeline_id}")
    print(f"transcript: {state.transcript_path}")
    print(f"segments: {state.segments_path}")
    print(f"target_lang: {args.lang}")
    print(f"workdir: .aiox/squad-runtime/video-editor/{state.pipeline_id}/")
    print(f"--- Claude Code: translate transcript.json → transcript_translated.json ---")
    print(
        f"--- Then: python3 -m pipeline.cli.video_editor edit-translate-stage-c {state.pipeline_id} ---"
    )
    return 0 if not state.is_blocked() else 2


def cmd_edit_translate_stage_c(args: argparse.Namespace) -> int:
    """Stage C: compose layout + render. Expects transcript_translated.json from Claude Code."""
    pipeline = build_edit_translate_stage_c()
    state = pipeline.run(
        source_video="",
        target_counts={},
        pipeline_id=args.pipeline_id,
        resume=True,
    )
    return 0 if not state.is_blocked() else 2


# ═══════════════════════════════════════════════════════════════════════════════
# CLIPS (longform → shorts)
# ═══════════════════════════════════════════════════════════════════════════════
def cmd_clips(args: argparse.Namespace) -> int:
    source = Path(args.input).resolve()
    if not source.exists():
        print(f"ERROR: source video not found: {source}", file=sys.stderr)
        return 1
    target_counts = _parse_counts(args.durations, args.counts)
    pipeline = build_clips_pipeline()
    state = pipeline.run(
        source_video=str(source),
        target_counts=target_counts,
        style_preset=args.style,
    )
    return 0 if state.is_complete() else 2


def cmd_clips_stage_a(args: argparse.Namespace) -> int:
    """Phases 1-2 only. Outputs transcript.json + segments.json for council."""
    source = Path(args.input).resolve()
    if not source.exists():
        print(f"ERROR: source video not found: {source}", file=sys.stderr)
        return 1
    target_counts = _parse_counts(args.durations, args.counts)
    pipeline = build_clips_stage_a()
    state = pipeline.run(
        source_video=str(source),
        target_counts=target_counts,
        style_preset=args.style,
    )
    print(f"\n--- CLIPS STAGE A OUTPUT ---")
    print(f"pipeline_id: {state.pipeline_id}")
    print(f"transcript: {state.transcript_path}")
    print(f"segments: {state.segments_path}")
    print(f"workdir: .aiox/squad-runtime/video-editor/{state.pipeline_id}/")
    print(
        "--- Claude Code: run Phase 3 (detect-hooks) + Phase 4 (directors council) ---"
    )
    print(
        f"--- Then: python3 -m pipeline.cli.video_editor clips-stage-c {state.pipeline_id} ---"
    )
    return 0 if not state.is_blocked() else 2


def cmd_clips_stage_c(args: argparse.Namespace) -> int:
    """Phases 5-7 only. Requires approved_clips.json."""
    pipeline = build_clips_stage_c()
    state = pipeline.run(
        source_video="",
        target_counts={},
        pipeline_id=args.pipeline_id,
        resume=True,
    )
    return 0 if state.is_complete() else 2


# ═══════════════════════════════════════════════════════════════════════════════
# SHARED
# ═══════════════════════════════════════════════════════════════════════════════
def cmd_resume(args: argparse.Namespace) -> int:
    pipeline = build_clips_pipeline()
    state = pipeline.run(
        source_video="",
        target_counts={},
        pipeline_id=args.pipeline_id,
        resume=True,
    )
    return 0 if state.is_complete() else 2


def cmd_status(args: argparse.Namespace) -> int:
    mgr = PipelineStateManager(Path(".aiox/squad-runtime/video-editor/state"))
    state = mgr.load(args.pipeline_id)
    if state is None:
        print(f"Pipeline {args.pipeline_id} not found", file=sys.stderr)
        return 1
    print(ProgressTracker().summary(state))
    return 0


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════
def main() -> int:
    parser = argparse.ArgumentParser(
        prog="video-editor",
        description="video-editor squad — traditional edit or longform → clips",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # ─── EDIT (traditional) ────────────────────────────────────────────────
    p_edit = sub.add_parser(
        "edit",
        help="Traditional edit: clean silences + captions + optional image overlay",
    )
    p_edit.add_argument("input", help="Path to source video")
    p_edit.add_argument(
        "--image",
        default=None,
        help="Optional image to overlay (e.g. news article screenshot)",
    )
    p_edit.add_argument(
        "--aspect",
        default="original",
        choices=["original", "16:9", "9:16", "1:1"],
        help="Output aspect ratio (default: preserve original)",
    )
    p_edit.add_argument(
        "--prompt",
        default=None,
        help="Whisper hint: nomes proprios e termos tecnicos para transcrever corretamente "
        "(ex: 'Anthropic, OpenAI, Claude, EAG, Juliano Torriani')",
    )
    p_edit.add_argument(
        "--overlay-start",
        type=float,
        default=None,
        help="Segundo em que o overlay aparece (default: 0 = inicio)",
    )
    p_edit.add_argument(
        "--overlay-end",
        type=float,
        default=None,
        help="Segundo em que o overlay desaparece (default: fim do video)",
    )
    p_edit.add_argument(
        "--overlay-position",
        default="top-right",
        choices=["top-right", "center", "bottom", "fullscreen"],
        help="Posicao do overlay (default: top-right)",
    )
    p_edit.set_defaults(func=cmd_edit)

    # ─── EDIT-TRANSLATE Stage A (transcribe + cut silences) ──────────────
    p_eta = sub.add_parser(
        "edit-translate-stage-a",
        help="Stage A: transcribe + cut silences (then Claude Code translates)",
    )
    p_eta.add_argument("input", help="Path to source video")
    p_eta.add_argument(
        "--lang",
        default="pt",
        help="Target language code (default: pt = português brasileiro). "
        "Supported: pt, es, fr, de, it, ja, ko, zh",
    )
    p_eta.add_argument(
        "--image",
        default=None,
        help="Optional image to overlay",
    )
    p_eta.add_argument(
        "--aspect",
        default="original",
        choices=["original", "16:9", "9:16", "1:1"],
        help="Output aspect ratio (default: preserve original)",
    )
    p_eta.add_argument(
        "--prompt",
        default=None,
        help="Whisper hint: proper nouns and technical terms "
        "(e.g. 'Anthropic, OpenAI, Claude')",
    )
    p_eta.add_argument(
        "--overlay-start",
        type=float,
        default=None,
        help="Segundo em que o overlay aparece (default: 0 = inicio)",
    )
    p_eta.add_argument(
        "--overlay-end",
        type=float,
        default=None,
        help="Segundo em que o overlay desaparece (default: fim do video)",
    )
    p_eta.add_argument(
        "--overlay-position",
        default="top-right",
        choices=["top-right", "center", "bottom", "fullscreen"],
        help="Posicao do overlay (default: top-right)",
    )
    p_eta.set_defaults(func=cmd_edit_translate_stage_a)

    # ─── EDIT-TRANSLATE Stage C (compose + render) ─────────────────────────
    p_etc = sub.add_parser(
        "edit-translate-stage-c",
        help="Stage C: compose layout + render (after Claude Code translated transcript)",
    )
    p_etc.add_argument("pipeline_id")
    p_etc.set_defaults(func=cmd_edit_translate_stage_c)

    # ─── CLIPS (longform → shorts) ─────────────────────────────────────────
    p_clips = sub.add_parser("clips", help="Longform → multiple clips (full 7-phase)")
    p_clips.add_argument("input", help="Path to source video")
    p_clips.add_argument("--durations", default="60,120,300")
    p_clips.add_argument("--counts", default="5,3,2")
    p_clips.add_argument(
        "--style",
        default="presenter_bottom_captions_top",
        choices=["presenter_bottom_captions_top", "captions_top", "fullframe"],
    )
    p_clips.set_defaults(func=cmd_clips)

    # ─── CLIPS split stages (for Claude Code orchestration) ────────────────
    p_a = sub.add_parser("clips-stage-a", help="Clips: Phases 1-2 only")
    p_a.add_argument("input")
    p_a.add_argument("--durations", default="60,120,300")
    p_a.add_argument("--counts", default="5,3,2")
    p_a.add_argument("--style", default="presenter_bottom_captions_top")
    p_a.set_defaults(func=cmd_clips_stage_a)

    p_c = sub.add_parser("clips-stage-c", help="Clips: Phases 5-7 only")
    p_c.add_argument("pipeline_id")
    p_c.set_defaults(func=cmd_clips_stage_c)

    # ─── SHARED ────────────────────────────────────────────────────────────
    p_resume = sub.add_parser("resume", help="Resume from failed phase")
    p_resume.add_argument("pipeline_id")
    p_resume.set_defaults(func=cmd_resume)

    p_status = sub.add_parser("status", help="Show pipeline status")
    p_status.add_argument("pipeline_id")
    p_status.set_defaults(func=cmd_status)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
