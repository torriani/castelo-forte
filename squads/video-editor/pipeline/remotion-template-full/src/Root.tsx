import { Composition, staticFile } from "remotion";
import { FullVideoWithOverlay } from "./compositions/FullVideoWithOverlay";
import captionsData from "./data/captions.json";
import videoMeta from "./data/clip.json";
import overlayData from "./data/overlay.json";

export const RemotionRoot: React.FC = () => {
  const videoSrc = staticFile(videoMeta.source.replace(/^\//, ""));
  const overlayImage = overlayData.image
    ? staticFile(overlayData.image.replace(/^\//, ""))
    : null;

  return (
    <>
      <Composition
        id="FullEdit"
        component={FullVideoWithOverlay}
        durationInFrames={Math.round(videoMeta.duration_seconds * videoMeta.fps)}
        fps={videoMeta.fps}
        width={videoMeta.output_width}
        height={videoMeta.output_height}
        defaultProps={{
          videoSrc,
          captions: captionsData.words,
          overlayImage,
          overlayWindows: overlayData.windows,
          aspect: videoMeta.aspect,
        }}
      />
    </>
  );
};
