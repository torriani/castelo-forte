import React from "react";
import {
  AbsoluteFill,
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

type Props = {
  videoSrc: string;
  startFrame: number;
  endFrame: number;
  captions: Word[];
};

/**
 * Layout:
 *  ┌─────────────────────────┐
 *  │  Top half (0-960):      │
 *  │  Animated karaoke       │  ← captions layer
 *  │  captions + BG          │
 *  ├─────────────────────────┤
 *  │  Bottom half (960-1920):│
 *  │  Presenter video clip   │  ← source video trimmed
 *  │  (cropped/fitted)       │
 *  └─────────────────────────┘
 *
 * Dimensions: 1080x1920 (9:16 vertical)
 */
export const PresenterBottomCaptionsTop: React.FC<Props> = ({
  videoSrc,
  startFrame,
  endFrame,
  captions,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentSeconds = frame / fps;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background }}>
      {/* TOP HALF — captions layer */}
      <AbsoluteFill
        style={{
          top: 0,
          height: 960,
          backgroundColor: theme.background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
        }}
      >
        <CaptionsKaraoke words={captions} currentSeconds={currentSeconds} />
      </AbsoluteFill>

      {/* BOTTOM HALF — presenter video (clipped to frame range) */}
      <AbsoluteFill
        style={{
          top: 960,
          height: 960,
          overflow: "hidden",
        }}
      >
        <OffthreadVideo
          src={videoSrc}
          startFrom={startFrame}
          endAt={endFrame}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CaptionsKaraoke — word-by-word highlight animation
// ═══════════════════════════════════════════════════════════════════════════════

const CaptionsKaraoke: React.FC<{
  words: Word[];
  currentSeconds: number;
}> = ({ words, currentSeconds }) => {
  // Show active window: 7 words centered on current word
  const activeIdx = words.findIndex(
    (w) => currentSeconds >= w.start && currentSeconds < w.end
  );
  const center = activeIdx >= 0 ? activeIdx : 0;
  const windowStart = Math.max(0, center - 3);
  const windowEnd = Math.min(words.length, center + 4);
  const visible = words.slice(windowStart, windowEnd);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: theme.captionsClip.gap,
        fontFamily: theme.font.family,
        fontWeight: theme.font.weight,
        textTransform: theme.font.textTransform,
        textAlign: "center",
        lineHeight: theme.font.lineHeight,
      }}
    >
      {visible.map((word, i) => {
        const actualIdx = windowStart + i;
        const isActive = actualIdx === activeIdx;
        const isPast = actualIdx < activeIdx;
        const isFuture = actualIdx > activeIdx;

        // Scale + opacity animation
        const t = theme.captionsClip;
        const scale = isActive ? t.activeScale : 1.0;
        const opacity = isPast ? t.pastOpacity : isFuture ? t.futureOpacity : 1.0;
        const color = isActive
          ? word.emphasis
            ? t.emphasisColor
            : t.activeColor
          : isPast
          ? t.pastColor
          : t.futureColor;

        return (
          <span
            key={`${actualIdx}-${word.text}`}
            style={{
              fontSize: word.emphasis ? t.fontSizeEmphasis : t.fontSize,
              color,
              opacity,
              transform: `scale(${scale})`,
              transition: "transform 50ms ease-out, color 30ms",
              textShadow: isActive ? t.activeShadow : t.inactiveShadow,
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
