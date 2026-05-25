"""
Tool wrappers for the video-editor pipeline.

Isolates subprocess calls to external tools (ffmpeg, whisper, auto-editor,
remotion, ffprobe) behind typed Python interfaces. Executors import from here
instead of calling subprocess directly — makes it easier to mock in tests and
swap backends.
"""
from __future__ import annotations

import json
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any

# ═══════════════════════════════════════════════════════════════════════════════
# BINARIES
# ═══════════════════════════════════════════════════════════════════════════════


class ToolNotFound(RuntimeError):
    pass


class ToolFailure(RuntimeError):
    def __init__(self, cmd: list[str], returncode: int, stderr: str):
        self.cmd = cmd
        self.returncode = returncode
        self.stderr = stderr
        super().__init__(
            f"{cmd[0]} failed with exit {returncode}: {stderr[:500]}"
        )


def _find_tool(name: str, extra_paths: list[str] | None = None) -> str:
    """Locate a binary by name, searching PATH + extras. Raises ToolNotFound."""
    found = shutil.which(name)
    if found:
        return found
    for p in extra_paths or []:
        path_obj = Path(p).expanduser()
        if path_obj.exists() and path_obj.is_file():
            return str(path_obj)
    raise ToolNotFound(f"Required tool not found on PATH: {name}")


def _run(
    cmd: list[str],
    *,
    check: bool = True,
    cwd: Path | None = None,
) -> subprocess.CompletedProcess[str]:
    """Run a subprocess, capturing stdout/stderr as text."""
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        check=False,
        cwd=str(cwd) if cwd else None,
    )
    if check and result.returncode != 0:
        raise ToolFailure(cmd, result.returncode, result.stderr)
    return result


# ═══════════════════════════════════════════════════════════════════════════════
# FFMPEG / FFPROBE
# ═══════════════════════════════════════════════════════════════════════════════


@dataclass
class VideoMetadata:
    duration_seconds: float
    fps: float
    width: int
    height: int
    has_audio: bool


def ffprobe_video(video_path: Path) -> VideoMetadata:
    """Return video metadata via ffprobe."""
    ffprobe = _find_tool("ffprobe")
    cmd = [
        ffprobe,
        "-v",
        "error",
        "-print_format",
        "json",
        "-show_format",
        "-show_streams",
        str(video_path),
    ]
    result = _run(cmd)
    data = json.loads(result.stdout)
    streams = data.get("streams", [])
    video_stream = next((s for s in streams if s.get("codec_type") == "video"), None)
    audio_stream = next((s for s in streams if s.get("codec_type") == "audio"), None)
    if video_stream is None:
        raise ToolFailure(cmd, 0, "No video stream found")

    # Parse fps from r_frame_rate like "30/1" or "30000/1001"
    fps_str = video_stream.get("r_frame_rate", "30/1")
    if "/" in fps_str:
        num, den = fps_str.split("/")
        fps = float(num) / float(den) if float(den) != 0 else 30.0
    else:
        fps = float(fps_str)

    duration = float(data.get("format", {}).get("duration", 0.0))
    width = int(video_stream.get("width", 0))
    height = int(video_stream.get("height", 0))

    return VideoMetadata(
        duration_seconds=duration,
        fps=fps,
        width=width,
        height=height,
        has_audio=audio_stream is not None,
    )


def ffmpeg_extract_audio(
    video_path: Path, out_wav: Path, sample_rate: int = 16000
) -> Path:
    """Extract mono 16kHz WAV audio (ideal for Whisper)."""
    ffmpeg = _find_tool("ffmpeg")
    out_wav.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        ffmpeg,
        "-y",
        "-i",
        str(video_path),
        "-ac",
        "1",
        "-ar",
        str(sample_rate),
        "-vn",  # no video
        str(out_wav),
    ]
    _run(cmd)
    if not out_wav.exists() or out_wav.stat().st_size == 0:
        raise ToolFailure(cmd, 0, "ffmpeg produced empty output")
    return out_wav


# ═══════════════════════════════════════════════════════════════════════════════
# WHISPER
# ═══════════════════════════════════════════════════════════════════════════════


@dataclass
class Word:
    text: str
    start: float
    end: float
    confidence: float = 0.0


@dataclass
class TranscriptSegment:
    text: str
    start: float
    end: float


@dataclass
class Transcript:
    words: list[Word]
    segments: list[TranscriptSegment]
    language: str
    avg_confidence: float

    def to_json(self) -> dict[str, Any]:
        return {
            "language": self.language,
            "avg_confidence": self.avg_confidence,
            "words": [
                {
                    "text": w.text,
                    "start": w.start,
                    "end": w.end,
                    "confidence": w.confidence,
                }
                for w in self.words
            ],
            "segments": [
                {"text": s.text, "start": s.start, "end": s.end}
                for s in self.segments
            ],
        }


WHISPER_PATH_CANDIDATES = [
    "~/Library/Python/3.9/bin/whisper",
    "~/Library/Python/3.10/bin/whisper",
    "~/Library/Python/3.11/bin/whisper",
    "~/Library/Python/3.12/bin/whisper",
]


def whisper_transcribe(
    audio_path: Path,
    workdir: Path,
    model: str = "base",
    language: str | None = None,
    initial_prompt: str | None = None,
) -> Transcript:
    """
    Run OpenAI Whisper CLI with word timestamps, parse JSON output into Transcript.

    Writes {audio_stem}.json to workdir; returns parsed Transcript.
    initial_prompt: hint words/phrases so Whisper spells them correctly
                    (e.g. "Anthropic, OpenAI, Claude, EAG").
    """
    whisper_bin = _find_tool("whisper", WHISPER_PATH_CANDIDATES)
    workdir.mkdir(parents=True, exist_ok=True)
    cmd = [
        whisper_bin,
        str(audio_path),
        "--model",
        model,
        "--output_format",
        "json",
        "--word_timestamps",
        "True",
        "--output_dir",
        str(workdir),
        "--verbose",
        "False",
    ]
    if language:
        cmd.extend(["--language", language])
    if initial_prompt:
        cmd.extend(["--initial_prompt", initial_prompt])

    _run(cmd)

    json_path = workdir / f"{audio_path.stem}.json"
    if not json_path.exists():
        raise ToolFailure(cmd, 0, f"Whisper JSON not found at {json_path}")

    data = json.loads(json_path.read_text())
    return _parse_whisper_json(data)


def _parse_whisper_json(data: dict[str, Any]) -> Transcript:
    """Parse Whisper CLI JSON output into typed Transcript."""
    words: list[Word] = []
    segments: list[TranscriptSegment] = []
    confidences: list[float] = []

    for seg in data.get("segments", []):
        segments.append(
            TranscriptSegment(
                text=seg.get("text", "").strip(),
                start=float(seg.get("start", 0.0)),
                end=float(seg.get("end", 0.0)),
            )
        )
        for w in seg.get("words", []) or []:
            # Whisper returns "word" with leading space usually
            text = (w.get("word") or w.get("text") or "").strip()
            if not text:
                continue
            prob = float(w.get("probability", 0.0))
            confidences.append(prob)
            words.append(
                Word(
                    text=text,
                    start=float(w.get("start", 0.0)),
                    end=float(w.get("end", 0.0)),
                    confidence=prob,
                )
            )

    avg_conf = sum(confidences) / len(confidences) if confidences else 0.0
    language = data.get("language", "unknown")
    return Transcript(
        words=words,
        segments=segments,
        language=language,
        avg_confidence=avg_conf,
    )


# ═══════════════════════════════════════════════════════════════════════════════
# AUTO-EDITOR
# ═══════════════════════════════════════════════════════════════════════════════


AUTO_EDITOR_PATH_CANDIDATES = [
    "./.venv/bin/auto-editor",
    "../.venv/bin/auto-editor",
    "squads/video-editor/.venv/bin/auto-editor",
]


@dataclass
class KeptSegment:
    start: float
    end: float


def auto_editor_cut_silences(
    video_path: Path,
    out_json: Path,
    *,
    fps: float = 30.0,
    silence_threshold_db: int = -19,
) -> list[KeptSegment]:
    """
    Run auto-editor to detect silences + output a JSON timeline of kept segments.

    Uses auto-editor's `--export v1` format (chunks: [start_frame, end_frame, speed]).
    Chunks with speed == 1.0 are kept, others are silences/cuts.
    """
    tool = _find_tool("auto-editor", AUTO_EDITOR_PATH_CANDIDATES)
    out_json.parent.mkdir(parents=True, exist_ok=True)

    cmd = [
        tool,
        str(video_path),
        "--edit",
        f"audio:{silence_threshold_db}dB",
        "--export",
        "v1",
        "--output",
        str(out_json),
    ]
    _run(cmd)

    if not out_json.exists():
        raise ToolFailure(cmd, 0, f"auto-editor output not found at {out_json}")

    data = json.loads(out_json.read_text())
    return _parse_auto_editor_v1(data, fps=fps)


def _parse_auto_editor_v1(data: dict[str, Any], fps: float = 30.0) -> list[KeptSegment]:
    """
    Parse auto-editor v1 timeline JSON.

    v1 schema (confirmed empirically, auto-editor 29.3.x):
      {
        "version": "1",
        "source": "/path/to/video.mp4",
        "chunks": [[start_frame, end_frame, speed], ...]
      }
    Chunks with speed != 1.0 are "cut" (sped up → effectively removed when
    auto-editor renders). Chunks with speed == 1.0 are kept verbatim.
    """
    chunks = data.get("chunks") or []
    segments: list[KeptSegment] = []
    for chunk in chunks:
        if not isinstance(chunk, list) or len(chunk) < 3:
            continue
        start_frame = float(chunk[0])
        end_frame = float(chunk[1])
        speed = float(chunk[2])
        if speed != 1.0:
            continue  # silenced/sped-up region
        segments.append(
            KeptSegment(start=start_frame / fps, end=end_frame / fps)
        )
    return segments


# ═══════════════════════════════════════════════════════════════════════════════
# REMOTION
# ═══════════════════════════════════════════════════════════════════════════════


def remotion_render(
    project_dir: Path,
    composition_id: str,
    out_mp4: Path,
    *,
    codec: str = "h264",
) -> Path:
    """
    Run Remotion's render CLI from within the project dir, using the locally
    installed @remotion/cli binary in node_modules/.bin. This avoids `npx`
    global resolution problems.
    """
    entry = project_dir / "src" / "index.ts"
    if not entry.exists():
        raise ToolFailure([], 0, f"Remotion entry not found: {entry}")

    # Resolve through symlinks to get actual binary path
    nm_dir = (project_dir / "node_modules").resolve()
    local_bin = nm_dir / ".bin" / "remotion"
    if not local_bin.exists():
        raise ToolFailure(
            [],
            0,
            f"Remotion CLI not found at {local_bin}. Run npm install first.",
        )
    local_bin = local_bin.resolve()

    out_mp4.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        str(local_bin),
        "render",
        "src/index.ts",
        composition_id,
        str(out_mp4.resolve()),
        f"--codec={codec}",
    ]
    _run(cmd, cwd=project_dir)
    if not out_mp4.exists() or out_mp4.stat().st_size < 1024:
        raise ToolFailure(cmd, 0, f"Render produced empty file: {out_mp4}")
    return out_mp4


def remotion_install(project_dir: Path) -> None:
    """Run `npm install` in a Remotion project directory."""
    npm = _find_tool("npm")
    if (project_dir / "node_modules").exists():
        return
    cmd = [npm, "install", "--prefix", str(project_dir), "--silent"]
    _run(cmd)
