"""
Progress tracking for video-editor pipeline.

Provides console progress + structured event log.
"""
from __future__ import annotations

import sys
import time
from dataclasses import dataclass, field
from typing import Any

from .state import PipelinePhase, PipelineState


PHASE_LABELS = {
    PipelinePhase.TRANSCRIBE: "Transcription (Whisper)",
    PipelinePhase.TRANSLATE: "Translation (Claude Code)",
    PipelinePhase.CUT_SILENCES: "Silence Removal (auto-editor)",
    PipelinePhase.DETECT_HOOKS: "Hook Detection (LLM)",
    PipelinePhase.DIRECTORS_COUNCIL: "Directors Council (Pearlman + MrBeast + Murch)",
    PipelinePhase.SELECT_CLIPS: "Timeline Assembly (OpenMontage)",
    PipelinePhase.COMPOSE_LAYOUT: "Layout + Captions (Remotion)",
    PipelinePhase.RENDER: "Final Render",
}


@dataclass
class ProgressEvent:
    timestamp: float
    phase: PipelinePhase
    event_type: str  # start | progress | checkpoint | complete | fail | veto
    message: str
    data: dict[str, Any] = field(default_factory=dict)


class ProgressTracker:
    """Console + event log for pipeline progress."""

    def __init__(self, total_phases: int = 7, verbose: bool = True):
        self.total_phases = total_phases
        self.verbose = verbose
        self.events: list[ProgressEvent] = []
        self.current_phase_start: float | None = None

    def start_phase(self, phase: PipelinePhase) -> None:
        self.current_phase_start = time.time()
        phase_num = list(PipelinePhase).index(phase) + 1
        label = PHASE_LABELS[phase]
        if self.verbose:
            print(
                f"\n▶ Phase {phase_num}/{self.total_phases}: {label}",
                file=sys.stderr,
                flush=True,
            )
        self._emit(phase, "start", f"Started {label}")

    def progress(self, phase: PipelinePhase, message: str, **data: Any) -> None:
        if self.verbose:
            print(f"  · {message}", file=sys.stderr, flush=True)
        self._emit(phase, "progress", message, data)

    def checkpoint(
        self, phase: PipelinePhase, passed: bool, gate: str, reason: str = ""
    ) -> None:
        icon = "✓" if passed else "✗"
        msg = f"Checkpoint {icon} {gate}"
        if reason:
            msg += f" — {reason}"
        if self.verbose:
            print(f"  {msg}", file=sys.stderr, flush=True)
        self._emit(phase, "checkpoint", msg, {"passed": passed, "gate": gate})

    def complete_phase(
        self, phase: PipelinePhase, summary: str = "", **data: Any
    ) -> None:
        elapsed = (
            time.time() - self.current_phase_start if self.current_phase_start else 0.0
        )
        label = PHASE_LABELS[phase]
        if self.verbose:
            print(
                f"  ✅ {label} done ({elapsed:.1f}s)" + (f" — {summary}" if summary else ""),
                file=sys.stderr,
                flush=True,
            )
        self._emit(
            phase, "complete", f"{label} done", {"elapsed_sec": elapsed, **data}
        )

    def fail_phase(self, phase: PipelinePhase, error: str) -> None:
        if self.verbose:
            print(f"  ❌ FAIL: {error}", file=sys.stderr, flush=True)
        self._emit(phase, "fail", error)

    def veto_phase(self, phase: PipelinePhase, reason: str) -> None:
        if self.verbose:
            print(f"  🛑 VETO: {reason}", file=sys.stderr, flush=True)
        self._emit(phase, "veto", reason)

    def summary(self, state: PipelineState) -> str:
        lines = [
            "\n" + "=" * 60,
            f"PIPELINE SUMMARY — {state.pipeline_id}",
            "=" * 60,
            f"Source:   {state.source_video}",
            f"Targets:  {state.target_counts}",
            f"Status:   {'✅ COMPLETE' if state.is_complete() else '❌ BLOCKED' if state.is_blocked() else '⏳ IN PROGRESS'}",
            "",
            "Phases:",
        ]
        for phase in PipelinePhase:
            ps = state.phases[phase]
            icon = {
                "completed": "✓",
                "failed": "✗",
                "vetoed": "🛑",
                "in_progress": "⏳",
                "pending": "·",
                "skipped": "→",
            }.get(ps.status.value, "?")
            lines.append(
                f"  {icon} {PHASE_LABELS[phase]:<55} "
                f"{ps.duration_seconds:>6.1f}s"
            )
        if state.shorts_dir:
            lines.append(f"\nOutput: {state.shorts_dir}")
        lines.append("=" * 60)
        return "\n".join(lines)

    def _emit(
        self,
        phase: PipelinePhase,
        event_type: str,
        message: str,
        data: dict[str, Any] | None = None,
    ) -> None:
        self.events.append(
            ProgressEvent(
                timestamp=time.time(),
                phase=phase,
                event_type=event_type,
                message=message,
                data=data or {},
            )
        )
