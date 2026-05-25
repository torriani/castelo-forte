"""
Pipeline State Management for video-editor squad.

Tracks the 7-phase workflow state with resume capability.
Persists to JSON for crash recovery.
"""
from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Any


class PhaseStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    VETOED = "vetoed"
    SKIPPED = "skipped"


class PipelinePhase(str, Enum):
    TRANSCRIBE = "1_transcribe"
    TRANSLATE = "1b_translate"
    CUT_SILENCES = "2_cut_silences"
    DETECT_HOOKS = "3_detect_hooks"
    DIRECTORS_COUNCIL = "4_directors_council"
    SELECT_CLIPS = "5_select_clips"
    COMPOSE_LAYOUT = "6_compose_layout"
    RENDER = "7_render"


@dataclass
class PhaseState:
    phase: PipelinePhase
    status: PhaseStatus = PhaseStatus.PENDING
    started_at: str | None = None
    completed_at: str | None = None
    outputs: dict[str, Any] = field(default_factory=dict)
    error: str | None = None
    veto_reason: str | None = None
    checkpoint_passed: bool = False
    duration_seconds: float = 0.0


@dataclass
class PipelineState:
    """Full pipeline state. Serializable to JSON."""

    pipeline_id: str
    source_video: str
    target_durations: list[int]
    target_counts: dict[int, int]
    style_preset: str = "presenter_bottom_captions_top"
    whisper_prompt: str | None = None
    overlay_start: float | None = None
    overlay_end: float | None = None
    overlay_position: str | None = None

    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    current_phase: PipelinePhase | None = None

    phases: dict[PipelinePhase, PhaseState] = field(default_factory=dict)

    # Accumulated artifacts across phases
    transcript_path: str | None = None
    translated_transcript_path: str | None = None
    audio_path: str | None = None
    segments_path: str | None = None
    candidates_path: str | None = None
    approved_clips_path: str | None = None
    clip_timelines_dir: str | None = None
    remotion_projects_dir: str | None = None
    shorts_dir: str | None = None
    manifest_path: str | None = None

    # Council decisions (Phase 4)
    directors_debate_log: list[dict[str, Any]] = field(default_factory=list)

    def __post_init__(self) -> None:
        if not self.phases:
            self.phases = {p: PhaseState(phase=p) for p in PipelinePhase}

    def start_phase(self, phase: PipelinePhase) -> None:
        self.current_phase = phase
        self.phases[phase].status = PhaseStatus.IN_PROGRESS
        self.phases[phase].started_at = datetime.utcnow().isoformat()
        self._touch()

    def complete_phase(self, phase: PipelinePhase, outputs: dict[str, Any]) -> None:
        ps = self.phases[phase]
        ps.status = PhaseStatus.COMPLETED
        ps.completed_at = datetime.utcnow().isoformat()
        ps.outputs = outputs
        ps.checkpoint_passed = True
        if ps.started_at:
            start = datetime.fromisoformat(ps.started_at)
            ps.duration_seconds = (datetime.utcnow() - start).total_seconds()
        self._touch()

    def fail_phase(self, phase: PipelinePhase, error: str) -> None:
        self.phases[phase].status = PhaseStatus.FAILED
        self.phases[phase].error = error
        self._touch()

    def veto_phase(self, phase: PipelinePhase, reason: str) -> None:
        self.phases[phase].status = PhaseStatus.VETOED
        self.phases[phase].veto_reason = reason
        self._touch()

    def _touch(self) -> None:
        self.updated_at = datetime.utcnow().isoformat()

    def next_phase_to_run(self) -> PipelinePhase | None:
        """Returns next pending phase, or None if complete."""
        for p in PipelinePhase:
            if self.phases[p].status == PhaseStatus.PENDING:
                return p
        return None

    def is_complete(self) -> bool:
        return all(
            self.phases[p].status in (PhaseStatus.COMPLETED, PhaseStatus.SKIPPED)
            for p in PipelinePhase
        )

    def is_blocked(self) -> bool:
        return any(
            self.phases[p].status in (PhaseStatus.FAILED, PhaseStatus.VETOED)
            for p in PipelinePhase
        )


class PipelineStateManager:
    """Persist + load pipeline state. JSON-backed."""

    def __init__(self, state_dir: Path):
        self.state_dir = state_dir
        self.state_dir.mkdir(parents=True, exist_ok=True)

    def save(self, state: PipelineState) -> Path:
        path = self.state_dir / f"{state.pipeline_id}.state.json"
        data = asdict(state)
        # Convert enums to strings for JSON
        data["current_phase"] = (
            state.current_phase.value if state.current_phase else None
        )
        data["phases"] = {
            p.value: {
                **asdict(ps),
                "phase": p.value,
                "status": ps.status.value,
            }
            for p, ps in state.phases.items()
        }
        path.write_text(json.dumps(data, indent=2))
        return path

    def load(self, pipeline_id: str) -> PipelineState | None:
        path = self.state_dir / f"{pipeline_id}.state.json"
        if not path.exists():
            return None
        data = json.loads(path.read_text())
        # Rehydrate enums
        phases = {}
        for p_key, ps_data in data.get("phases", {}).items():
            ps = PhaseState(
                phase=PipelinePhase(ps_data["phase"]),
                status=PhaseStatus(ps_data["status"]),
                started_at=ps_data.get("started_at"),
                completed_at=ps_data.get("completed_at"),
                outputs=ps_data.get("outputs", {}),
                error=ps_data.get("error"),
                veto_reason=ps_data.get("veto_reason"),
                checkpoint_passed=ps_data.get("checkpoint_passed", False),
                duration_seconds=ps_data.get("duration_seconds", 0.0),
            )
            phases[PipelinePhase(p_key)] = ps
        state = PipelineState(
            pipeline_id=data["pipeline_id"],
            source_video=data["source_video"],
            target_durations=data["target_durations"],
            target_counts={int(k): v for k, v in data["target_counts"].items()},
            style_preset=data.get("style_preset", "presenter_bottom_captions_top"),
            created_at=data["created_at"],
            updated_at=data["updated_at"],
            current_phase=(
                PipelinePhase(data["current_phase"])
                if data.get("current_phase")
                else None
            ),
            phases=phases,
            transcript_path=data.get("transcript_path"),
            translated_transcript_path=data.get("translated_transcript_path"),
            audio_path=data.get("audio_path"),
            segments_path=data.get("segments_path"),
            candidates_path=data.get("candidates_path"),
            approved_clips_path=data.get("approved_clips_path"),
            clip_timelines_dir=data.get("clip_timelines_dir"),
            remotion_projects_dir=data.get("remotion_projects_dir"),
            shorts_dir=data.get("shorts_dir"),
            manifest_path=data.get("manifest_path"),
            directors_debate_log=data.get("directors_debate_log", []),
        )
        return state
