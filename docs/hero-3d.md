# Industrial Digital Twin hero prototype

Only the home-page hero changes. Its translated heading, calls to action, navigation,
and server-rendered content remain in place. Industries, Products, and Services are
reserved for a later design review.

## Scene

`HeroExperience.tsx` observes the hero and dynamically imports `SceneCanvas.tsx`
with server rendering disabled when it first enters the viewport. The existing
hero image is visible while loading, when WebGL is unavailable, or after context
loss. The scene uses Three.js, React Three Fiber, and Drei's line renderer.

The globe, industrial equipment, orbital rings, and animated data connections are
real procedural meshes, not video. No GLB models were supplied, so this prototype
does not claim to reproduce a specific factory or product. Data packets are a
visual simulation, not connected to live telemetry. An optimized custom GLB can
replace the procedural equipment later.

Mouse movement over the hero changes the camera by at most 0.3 scene units
horizontally and 0.18 vertically, with damping. Hovering equipment highlights it.
Touch devices do not intercept gestures for camera control.

## Resource and accessibility behavior

- Mobile uses fewer sphere/ring segments, fewer connections, no antialiasing,
  and a pixel ratio of 1. Desktop pixel ratio is capped at 1.5.
- The render loop stops while the hero is outside the viewport or the document
  is hidden, and resumes when visible.
- Reduced motion disables rotation, moving packets, and camera parallax. Hover
  can still request a static render. Changes to the OS preference are observed.
- The decorative canvas is hidden from assistive technology. Existing links
  remain normal keyboard-accessible HTML.
- No external textures, models, environment maps, postprocessing, or GSAP runtime
  are needed. The Three.js bundle is downloaded separately from the initial UI.

## Validation

From the repository root:

```sh
npm ci
npx tsc --noEmit
npm run build
npm start -- --hostname 0.0.0.0 --port 3000
```

The repository has an existing ESLint configuration issue (`Plugin "" not found`)
in `eslint.config.mjs`; Next.js reports it during a build even when compilation,
type checking, and static generation succeed. No lint checks were disabled for
this feature.

Browser checks: inspect the home page at desktop and mobile widths; move the
mouse across the hero and hover its industrial sites; scroll the hero out of
view and back; enable reduced motion; disable WebGL; and simulate context loss
using the `WEBGL_lose_context` extension. In every fallback case the original
hero image and page content should remain visible. Verify the home-page links
and the existing language selector still work. Test real mobile GPUs and other
browser engines before treating this visual prototype as production approved.
