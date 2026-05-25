"""
Pipeline factory — wires phase definitions, veto conditions, and executors.

Two modes, two pipelines:

  EDIT mode (traditional polish):
    Phase 1: transcribe (Whisper)
    Phase 2: cut silences (auto-editor)
    Phase 6: compose_full_layout (Remotion template + optional image overlay)
    Phase 7: render_full_video (single polished MP4)

  CLIPS mode (longform → shorts):
    Phases 1-7 with directors council in the middle.
    Stage A (Python): phases 1-2
    Stage B (Claude Code): phases 3-4 (hook scoring + council debate)
    Stage C (Python): phases 5-7
"""
from __future__ import annotations

from pathlib import Path

from . import executors
from .core.progress import ProgressTracker
from .core.runner import PhaseDefinition, Pipeline, VetoCondition
from .core.state import PipelinePhase, PipelineState, PipelineStateManager


# ═══════════════════════════════════════════════════════════════════════════════
# VETO CONDITIONS (per phase, per workflow YAML)
# ═══════════════════════════════════════════════════════════════════════════════


def _transcribe_vetos() -> list[VetoCondition]:
    return [
        VetoCondition(
            name="confidence_threshold",
            # Whisper reports per-word log-probabilities averaged, which tend
            # to sit around 0.3-0.7 for clean speech. 0.25 is a safe floor
            # that still catches garbage audio.
            check=lambda state, out: out.get("confidence", 1.0) < 0.25
            and out.get("word_count", 0) > 0,
            reason="Transcript confidence below 25% — audio unusable",
        ),
        VetoCondition(
            name="no_words_transcribed",
            check=lambda state, out: (
                out.get("word_count", 0) == 0
                and out.get("video_duration_seconds", 0) > 2
            ),
            reason="No words extracted from >2s video — likely no speech",
        ),
    ]


def _cut_silences_vetos() -> list[VetoCondition]:
    return [
        VetoCondition(
            name="duration_retention",
            check=lambda state, out: out.get("kept_duration_ratio", 1.0) < 0.5,
            reason="Less than 50% of audio retained after silence cut",
        ),
    ]


def _detect_hooks_vetos() -> list[VetoCondition]:
    return [
        # On stub, candidate_count=0 — skip this veto until real implementation
        # VetoCondition(
        #     name="min_strong_candidates",
        #     check=lambda state, out: out.get("strong_candidates", 0) < 10,
        #     reason="Fewer than 10 strong candidates — video lacks hooks",
        # ),
    ]


def _council_vetos() -> list[VetoCondition]:
    return [
        # VetoCondition(
        #     name="mrbeast_mass_veto",
        #     check=lambda state, out: (
        #         out.get("mrbeast_vetoed", 0) / max(out.get("pearlman_proposed", 1), 1)
        #         > 0.8
        #     ),
        #     reason="MrBeast vetoed >80% of Pearlman's list — escalate to user",
        # ),
    ]


def _select_clips_vetos() -> list[VetoCondition]:
    return []


def _compose_layout_vetos() -> list[VetoCondition]:
    return []


def _render_vetos() -> list[VetoCondition]:
    return []


# ═══════════════════════════════════════════════════════════════════════════════
# PIPELINE FACTORY
# ═══════════════════════════════════════════════════════════════════════════════


def build_clips_pipeline(state_dir: Path | None = None) -> Pipeline:
    """CLIPS mode: full 7-phase longform → shorts pipeline."""
    if state_dir is None:
        state_dir = Path(".aiox/squad-runtime/video-editor/state")

    phases = [
        PhaseDefinition(
            phase=PipelinePhase.TRANSCRIBE,
            executor=executors.transcribe,
            description="Extract word-level transcript via Whisper",
            veto_conditions=_transcribe_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.CUT_SILENCES,
            executor=executors.cut_silences,
            description="Remove silences + fillers via auto-editor",
            requires_outputs_from=[PipelinePhase.TRANSCRIBE],
            veto_conditions=_cut_silences_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.DETECT_HOOKS,
            executor=executors.detect_hooks,
            description="Score segments for hook/emotion/rhythm via LLM",
            requires_outputs_from=[PipelinePhase.CUT_SILENCES],
            veto_conditions=_detect_hooks_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.DIRECTORS_COUNCIL,
            executor=executors.directors_council,
            description="Pearlman proposes → MrBeast vetoes → Murch tiebreaks",
            requires_outputs_from=[PipelinePhase.DETECT_HOOKS],
            veto_conditions=_council_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.SELECT_CLIPS,
            executor=executors.select_clips,
            description="Assemble timelines via OpenMontage clip-factory",
            requires_outputs_from=[PipelinePhase.DIRECTORS_COUNCIL],
            veto_conditions=_select_clips_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.COMPOSE_LAYOUT,
            executor=executors.compose_layout,
            description="Instantiate Remotion template with captions + layout",
            requires_outputs_from=[PipelinePhase.SELECT_CLIPS],
            veto_conditions=_compose_layout_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.RENDER,
            executor=executors.render,
            description="Final Remotion render → MP4 + manifest",
            requires_outputs_from=[PipelinePhase.COMPOSE_LAYOUT],
            veto_conditions=_render_vetos(),
        ),
    ]

    state_manager = PipelineStateManager(state_dir)
    progress = ProgressTracker(total_phases=7, verbose=True)
    return Pipeline(phases=phases, state_manager=state_manager, progress=progress)


def _state_dir() -> Path:
    return Path(".aiox/squad-runtime/video-editor/state")


# Backward-compatible alias (old callers used build_pipeline)
build_pipeline = build_clips_pipeline


def build_clips_stage_a(state_dir: Path | None = None) -> Pipeline:
    """CLIPS Stage A: Phases 1-2 only. Outputs transcript + segments for council."""
    sd = state_dir or _state_dir()
    phases = [
        PhaseDefinition(
            phase=PipelinePhase.TRANSCRIBE,
            executor=executors.transcribe,
            description="Extract word-level transcript via Whisper",
            veto_conditions=_transcribe_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.CUT_SILENCES,
            executor=executors.cut_silences,
            description="Remove silences + fillers via auto-editor",
            requires_outputs_from=[PipelinePhase.TRANSCRIBE],
            veto_conditions=_cut_silences_vetos(),
        ),
    ]
    return Pipeline(
        phases=phases,
        state_manager=PipelineStateManager(sd),
        progress=ProgressTracker(total_phases=2, verbose=True),
    )


def build_clips_stage_c(state_dir: Path | None = None) -> Pipeline:
    """CLIPS Stage C: Phases 5-7 only. Requires approved_clips.json from council."""
    sd = state_dir or _state_dir()
    phases = [
        PhaseDefinition(
            phase=PipelinePhase.SELECT_CLIPS,
            executor=executors.select_clips,
            description="Assemble timelines",
            veto_conditions=_select_clips_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.COMPOSE_LAYOUT,
            executor=executors.compose_layout,
            description="Instantiate Remotion template with captions + layout",
            requires_outputs_from=[PipelinePhase.SELECT_CLIPS],
            veto_conditions=_compose_layout_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.RENDER,
            executor=executors.render,
            description="Final Remotion render → MP4 + manifest",
            requires_outputs_from=[PipelinePhase.COMPOSE_LAYOUT],
            veto_conditions=_render_vetos(),
        ),
    ]
    return Pipeline(
        phases=phases,
        state_manager=PipelineStateManager(sd),
        progress=ProgressTracker(total_phases=3, verbose=True),
    )


def build_edit_pipeline(state_dir: Path | None = None) -> Pipeline:
    """
    EDIT mode: traditional video polish.

    Pipeline (4 phases, no clips selection):
      1. Transcribe (Whisper)
      2. Cut silences (auto-editor)
      6. Compose full layout (Remotion template + optional image overlay)
      7. Render full video (single polished MP4)

    Phases 3 (detect-hooks), 4 (directors council), 5 (select-clips) are
    SKIPPED — edit mode preserves the whole video, doesn't pick highlights.
    """
    sd = state_dir or _state_dir()
    phases = [
        PhaseDefinition(
            phase=PipelinePhase.TRANSCRIBE,
            executor=executors.transcribe,
            description="Extract word-level transcript via Whisper",
            veto_conditions=_transcribe_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.CUT_SILENCES,
            executor=executors.cut_silences,
            description="Remove silences + fillers via auto-editor",
            requires_outputs_from=[PipelinePhase.TRANSCRIBE],
            veto_conditions=_cut_silences_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.COMPOSE_LAYOUT,
            executor=executors.compose_full_layout,
            description="Instantiate full-video Remotion template with captions + overlay",
            requires_outputs_from=[PipelinePhase.CUT_SILENCES],
            veto_conditions=_compose_layout_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.RENDER,
            executor=executors.render_full_video,
            description="Render polished full video → single MP4",
            requires_outputs_from=[PipelinePhase.COMPOSE_LAYOUT],
            veto_conditions=_render_vetos(),
        ),
    ]
    return Pipeline(
        phases=phases,
        state_manager=PipelineStateManager(sd),
        progress=ProgressTracker(total_phases=4, verbose=True),
        skip_unregistered=True,  # edit mode skips phases 3/4/5
    )


def build_edit_translate_stage_a(state_dir: Path | None = None) -> Pipeline:
    """
    EDIT-TRANSLATE Stage A: Transcribe + Cut silences.

    After this, Claude Code translates transcript.json inline (Stage B),
    then runs Stage C for compose + render.
    """
    sd = state_dir or _state_dir()
    phases = [
        PhaseDefinition(
            phase=PipelinePhase.TRANSCRIBE,
            executor=executors.transcribe,
            description="Extract word-level transcript via Whisper",
            veto_conditions=_transcribe_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.CUT_SILENCES,
            executor=executors.cut_silences,
            description="Remove silences + fillers via auto-editor",
            requires_outputs_from=[PipelinePhase.TRANSCRIBE],
            veto_conditions=_cut_silences_vetos(),
        ),
    ]
    return Pipeline(
        phases=phases,
        state_manager=PipelineStateManager(sd),
        progress=ProgressTracker(total_phases=2, verbose=True),
    )


def build_edit_translate_stage_c(state_dir: Path | None = None) -> Pipeline:
    """
    EDIT-TRANSLATE Stage C: Compose layout + Render.

    Expects transcript_translated.json to exist (written by Claude Code in Stage B).
    State must have transcript_path pointing to the translated transcript.
    """
    sd = state_dir or _state_dir()
    phases = [
        PhaseDefinition(
            phase=PipelinePhase.COMPOSE_LAYOUT,
            executor=executors.compose_full_layout,
            description="Instantiate full-video Remotion template with translated captions",
            veto_conditions=_compose_layout_vetos(),
        ),
        PhaseDefinition(
            phase=PipelinePhase.RENDER,
            executor=executors.render_full_video,
            description="Render full video with translated subtitles → single MP4",
            requires_outputs_from=[PipelinePhase.COMPOSE_LAYOUT],
            veto_conditions=_render_vetos(),
        ),
    ]
    return Pipeline(
        phases=phases,
        state_manager=PipelineStateManager(sd),
        progress=ProgressTracker(total_phases=2, verbose=True),
        skip_unregistered=True,  # skips translate/hooks/council/clips phases
    )
