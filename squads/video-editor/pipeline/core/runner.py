"""
Pipeline Runner — orchestrates 7 phases of video-editor workflow.

Each phase is a PhaseDefinition with: executor, preconditions, postconditions, veto.
Runner handles: state persistence, crash resume, veto propagation, progress tracking.
"""
from __future__ import annotations

import traceback
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Protocol

from .progress import ProgressTracker
from .state import (
    PhaseStatus,
    PipelinePhase,
    PipelineState,
    PipelineStateManager,
)


class PhaseExecutor(Protocol):
    """A phase executor must be callable with (state, progress) -> outputs dict."""

    def __call__(
        self, state: PipelineState, progress: ProgressTracker
    ) -> dict[str, Any]:
        ...


@dataclass
class VetoCondition:
    """A veto is a predicate that, if True, halts the pipeline."""

    name: str
    check: Callable[[PipelineState, dict[str, Any]], bool]
    reason: str


@dataclass
class PhaseDefinition:
    phase: PipelinePhase
    executor: PhaseExecutor
    description: str
    veto_conditions: list[VetoCondition] = field(default_factory=list)
    requires_outputs_from: list[PipelinePhase] = field(default_factory=list)


class PhaseRunner:
    """Runs a single phase with veto checks."""

    def __init__(self, definition: PhaseDefinition):
        self.definition = definition

    def run(
        self, state: PipelineState, progress: ProgressTracker
    ) -> dict[str, Any]:
        phase = self.definition.phase

        # Precondition check
        for req in self.definition.requires_outputs_from:
            if state.phases[req].status != PhaseStatus.COMPLETED:
                raise RuntimeError(
                    f"Phase {phase.value} requires {req.value} to be completed"
                )

        progress.start_phase(phase)
        state.start_phase(phase)

        try:
            outputs = self.definition.executor(state, progress)
        except Exception as exc:  # noqa: BLE001 — we want broad catch here
            err = f"{type(exc).__name__}: {exc}\n{traceback.format_exc()}"
            progress.fail_phase(phase, err)
            state.fail_phase(phase, err)
            raise

        # Veto checks after execution
        for veto in self.definition.veto_conditions:
            if veto.check(state, outputs):
                progress.veto_phase(phase, f"{veto.name}: {veto.reason}")
                state.veto_phase(phase, f"{veto.name}: {veto.reason}")
                raise RuntimeError(f"VETO at {phase.value}: {veto.name}")
            progress.checkpoint(phase, True, veto.name)

        progress.complete_phase(phase)
        state.complete_phase(phase, outputs)
        return outputs


class Pipeline:
    """The full 7-phase video-editor pipeline."""

    def __init__(
        self,
        phases: list[PhaseDefinition],
        state_manager: PipelineStateManager,
        progress: ProgressTracker | None = None,
        *,
        skip_unregistered: bool = False,
    ):
        self.phases = {pd.phase: PhaseRunner(pd) for pd in phases}
        self.state_manager = state_manager
        self.progress = progress or ProgressTracker()
        # If True, missing phase runners are silently skipped (edit mode
        # skips phases 3/4/5). If False, missing runners stop the pipeline
        # (clips-stage-a stops at phase 3 so Claude Code can take over).
        self.skip_unregistered = skip_unregistered

    def run(
        self,
        source_video: str,
        target_counts: dict[int, int],
        style_preset: str = "presenter_bottom_captions_top",
        pipeline_id: str | None = None,
        resume: bool = False,
        whisper_prompt: str | None = None,
        overlay_start: float | None = None,
        overlay_end: float | None = None,
        overlay_position: str | None = None,
    ) -> PipelineState:
        """Execute the full pipeline. Supports resume from crash."""
        # Resume or create new state
        if resume and pipeline_id:
            state = self.state_manager.load(pipeline_id)
            if state is None:
                raise ValueError(f"Cannot resume: pipeline_id {pipeline_id} not found")
        else:
            state = PipelineState(
                pipeline_id=pipeline_id or uuid.uuid4().hex[:12],
                source_video=source_video,
                target_durations=sorted(target_counts.keys()),
                target_counts=target_counts,
                style_preset=style_preset,
                whisper_prompt=whisper_prompt,
                overlay_start=overlay_start,
                overlay_end=overlay_end,
                overlay_position=overlay_position,
            )

        # Execute phases in order
        for phase in PipelinePhase:
            if state.phases[phase].status in (PhaseStatus.COMPLETED, PhaseStatus.SKIPPED):
                self.progress.progress(phase, f"Skipping (already completed)")
                continue
            if state.phases[phase].status in (PhaseStatus.FAILED, PhaseStatus.VETOED):
                break  # Don't continue past failure

            runner = self.phases.get(phase)
            if runner is None:
                if self.skip_unregistered:
                    # Edit mode: silently skip this phase, continue to next
                    state.phases[phase].status = PhaseStatus.SKIPPED
                    continue
                # Stage-a mode: stop here so Claude Code can take over
                break

            try:
                runner.run(state, self.progress)
            except Exception:
                self.state_manager.save(state)
                break

            self.state_manager.save(state)

        # Final summary
        print(self.progress.summary(state))
        return state
