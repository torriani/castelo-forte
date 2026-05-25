"""
Helper to mark phases as completed after Claude Code writes their output JSONs.

Usage:
    python3 -m pipeline.cli.mark_phase PIPELINE_ID 3_detect_hooks 4_directors_council
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from pipeline.core.state import (
    PhaseStatus,
    PipelinePhase,
    PipelineStateManager,
)


def main() -> int:
    if len(sys.argv) < 3:
        print(
            "Usage: python3 -m pipeline.cli.mark_phase PIPELINE_ID PHASE1 [PHASE2 ...]",
            file=sys.stderr,
        )
        return 1

    pipeline_id = sys.argv[1]
    phase_names = sys.argv[2:]

    mgr = PipelineStateManager(Path(".aiox/squad-runtime/video-editor/state"))
    state = mgr.load(pipeline_id)
    if state is None:
        print(f"Pipeline {pipeline_id} not found", file=sys.stderr)
        return 1

    for name in phase_names:
        try:
            phase = PipelinePhase(name)
        except ValueError:
            print(f"Unknown phase: {name}", file=sys.stderr)
            return 1
        state.complete_phase(phase, {"marked_by": "claude_code"})
        print(f"  ✓ {name} → completed")

    mgr.save(state)
    print(f"State saved for pipeline {pipeline_id}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
