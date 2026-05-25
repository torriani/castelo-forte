import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";

type Word = {
  text: string;
  start: number;
  end: number;
  emphasis?: boolean;
};

type OverlayWindow = {
  start: number;
  end: number;
  position?: "top-right" | "center" | "bottom" | "fullscreen";
};

type Props = {
  videoSrc: string;
  captions: Word[];
  overlayImage: string | null;
  overlayWindows: OverlayWindow[];
  aspect: "original" | "16:9" | "9:16" | "1:1";
};

/**
 * FullVideoWithOverlay — traditional edit mode.
 *
 * Layout:
 *  - Base layer: original video (preserved full duration)
 *  - Captions overlay: word-by-word karaoke at bottom
 *  - Image overlay: optional, appears during configured time windows
 */
export const FullVideoWithOverlay: React.FC<Props> = ({
  videoSrc,
  captions,
  overlayImage,
  overlayWindows,
  aspect,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentSeconds = frame / fps;

  const activeOverlay = overlayWindows.find(
    (w) => currentSeconds >= w.start && currentSeconds < w.end
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* BASE LAYER */}
      <AbsoluteFill>
        {videoSrc ? (
          <OffthreadVideo
            src={videoSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: aspect === "original" ? "contain" : "cover",
            }}
          />
        ) : null}
      </AbsoluteFill>

      {/* IMAGE OVERLAY */}
      {overlayImage && activeOverlay && (
        <OverlayImageLayer
          image={overlayImage}
          position={activeOverlay.position || "top-right"}
          width={width}
          height={height}
          frameInWindow={currentSeconds - activeOverlay.start}
          windowDuration={activeOverlay.end - activeOverlay.start}
        />
      )}

      {/* CAPTIONS LAYER */}
      <CaptionsLayer
        words={captions}
        currentSeconds={currentSeconds}
        height={height}
      />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Caption layer — cinema-style subtitles (full sentences, white on dark bg)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build sentence groups from word-level timestamps.
 * Groups consecutive words into lines, splitting when:
 *   - A gap > 0.8s between words (natural pause)
 *   - A line exceeds maxWordsPerLine words
 * Each group has start (first word start) and end (last word end).
 */
function buildSentenceGroups(
  words: Word[],
  maxWordsPerLine: number = 12
): { text: string; start: number; end: number }[] {
  if (words.length === 0) return [];
  const groups: { text: string; start: number; end: number }[] = [];
  let current: Word[] = [words[0]];

  for (let i = 1; i < words.length; i++) {
    const prev = words[i - 1];
    const word = words[i];
    const gap = word.start - prev.end;
    // Split on natural pauses or when line gets too long
    if (gap > 0.8 || current.length >= maxWordsPerLine) {
      groups.push({
        text: current.map((w) => w.text).join(" "),
        start: current[0].start,
        end: current[current.length - 1].end,
      });
      current = [word];
    } else {
      current.push(word);
    }
  }
  if (current.length > 0) {
    groups.push({
      text: current.map((w) => w.text).join(" "),
      start: current[0].start,
      end: current[current.length - 1].end,
    });
  }
  return groups;
}

const CaptionsLayer: React.FC<{
  words: Word[];
  currentSeconds: number;
  height: number;
}> = ({ words, currentSeconds, height }) => {
  const t = theme.captionsEdit;

  // Cinema mode: show full sentence/phrase groups
  const groups = React.useMemo(() => buildSentenceGroups(words, 12), [words]);
  const activeGroup = groups.find(
    (g) => currentSeconds >= g.start && currentSeconds < g.end
  );

  if (!activeGroup) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: height * 0.08,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: t.maxWidth,
          padding: t.padding,
          backgroundColor: t.backgroundColor,
          borderRadius: t.borderRadius,
          fontFamily: theme.font.family,
          fontWeight: 700,
          textTransform: "none" as const,
          textAlign: "center",
          lineHeight: 1.25,
          fontSize: t.fontSize,
          color: t.activeColor,
          textShadow:
            "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 2px 8px rgba(0,0,0,0.9)",
          letterSpacing: "0.01em",
        }}
      >
        {activeGroup.text}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Image overlay layer — fade in/out
// ═══════════════════════════════════════════════════════════════════════════════

const OverlayImageLayer: React.FC<{
  image: string;
  position: "top-right" | "center" | "bottom" | "fullscreen";
  width: number;
  height: number;
  frameInWindow: number;
  windowDuration: number;
}> = ({ image, position, width, height, frameInWindow, windowDuration }) => {
  const fadeDuration = theme.overlay.fadeDuration;
  let opacity = 1;
  if (frameInWindow < fadeDuration) {
    opacity = interpolate(frameInWindow, [0, fadeDuration], [0, 1]);
  } else if (frameInWindow > windowDuration - fadeDuration) {
    opacity = interpolate(
      frameInWindow,
      [windowDuration - fadeDuration, windowDuration],
      [1, 0]
    );
  }

  const style: React.CSSProperties = {
    position: "absolute",
    opacity,
    boxShadow: theme.overlay.shadow,
    borderRadius: theme.overlay.borderRadius,
  };
  if (position === "top-right") {
    style.top = height * 0.05;
    style.right = width * 0.05;
    style.width = width * theme.overlay.sizeTopRight;
    style.height = "auto";
  } else if (position === "center") {
    style.top = "50%";
    style.left = "50%";
    style.transform = "translate(-50%, -50%)";
    style.width = width * theme.overlay.sizeCenter;
    style.height = "auto";
  } else if (position === "bottom") {
    style.bottom = height * 0.15;
    style.left = "50%";
    style.transform = "translateX(-50%)";
    style.width = width * theme.overlay.sizeBottom;
    style.height = "auto";
  } else if (position === "fullscreen") {
    style.top = 0;
    style.left = 0;
    style.width = "100%";
    style.height = "100%";
    style.objectFit = "contain";
    style.backgroundColor = theme.overlay.fullscreenBg;
  }

  return <Img src={image} style={style} />;
};
