import { Composition, staticFile } from "remotion";
import { PresenterBottomCaptionsTop } from "./compositions/PresenterBottomCaptionsTop";
import captionsData from "./data/captions.json";
import clipMeta from "./data/clip.json";

export const RemotionRoot: React.FC = () => {
  // staticFile() resolves paths relative to the `public/` directory
  const videoSrc = staticFile(clipMeta.source.replace(/^\//, ""));

  return (
    <>
      <Composition
        id="Short"
        component={PresenterBottomCaptionsTop}
        durationInFrames={Math.round(clipMeta.duration_seconds * clipMeta.fps)}
        fps={clipMeta.fps}
        width={1080}
        height={1920}
        defaultProps={{
          videoSrc,
          startFrame: clipMeta.start_frame,
          endFrame: clipMeta.end_frame,
          captions: captionsData.words,
        }}
      />
    </>
  );
};
