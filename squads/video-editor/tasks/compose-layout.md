# Task: Compose Remotion Layout

**Worker:** layout-composer
**Phase:** 6/7 (parallel with generate-captions)
**Tool base:** Remotion (React) + skill `remotion`

## Purpose
Build a React/Remotion project for each clip with the target layout:
**Presenter video bottom half + animated captions top half** (or other style presets).

## Inputs
- `clip_timelines/` (from phase 5)
- `captions/` (from caption-generator, parallel)
- `style_preset` (from user input, default: `presenter_bottom_captions_top`)

## Outputs
- `remotion_projects/` — one React project per clip:
  ```
  remotion_projects/
    clip_01/
      src/
        Composition.tsx
        VideoLayer.tsx
        CaptionLayer.tsx
      remotion.config.ts
      package.json
  ```

## Execution steps
1. Load base Remotion template (custom: presenter_bottom_captions_top)
2. For each clip:
   - Instantiate template with clip's video source + captions.json
   - Configure `<Composition>` width/height (1080x1920 for 9:16 vertical)
   - Presenter video `<OffthreadVideo>` positioned at bottom half (y: 960, h: 960)
   - Captions `<AbsoluteFill>` positioned at top half with Tailwind-style classes
   - Word-by-word animation via `interpolate()` + caption timestamps
3. Write out each project, run `npm install` (or reuse shared node_modules symlink)

## Style presets supported
- `presenter_bottom_captions_top` (default)
- `captions_top` (captions only, source video full-frame)
- `fullframe` (no captions, clean cut)

## Checkpoint (veto conditions)
- **VETO** if Remotion project fails `remotion preview --no-open` build check
- **VETO** if any clip missing source video reference
- **VETO** if captions layer has unresolved variable

## Completion criteria
- remotion_projects/ has one valid project per clip
- Each passes `remotion studio --dry-run` (if available) or TypeScript check
- All dependencies installed

## Handoff
→ Phase 7 (renderer) consumes remotion_projects/
