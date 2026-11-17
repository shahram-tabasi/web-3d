# Industrial Digital Twin hero prototype

Only the home-page hero changes. Its translated heading, calls to action, navigation,
and server-rendered content remain in place. Industries, Products, and Services are
reserved for a later design review.

## Scene

`HeroExperience.tsx` observes the hero and dynamically imports `SceneCanvas.tsx`
with server rendering disabled when it first enters the viewport. The existing
hero image is visible while loading, when WebGL is unavailable, or after context
loss. The scene uses Three.js, React Three Fiber, and Drei.

The scene is a single industrial campus: a production hall with clerestory roof
lights, stainless process tanks and pipework, a glazed control building, and an
electrical utility zone on a shared machined plinth. Beveled edges, soft desktop
shadows, warm work lights, and cool fill lighting provide depth. Rectangular light
panels generate a small reflection environment locally; no HDR download is needed.
The camera has a fixed three-quarter composition with restrained pointer movement;
the campus does not continuously spin. Subtle animated data routes follow the floor.

These are real procedural meshes, not video. No GLB models were supplied, so this prototype
does not claim to reproduce a specific factory or product. Data packets are a
visual simulation, not connected to live telemetry. An optimized custom GLB can
replace the procedural equipment later.

Mouse movement over the hero changes the camera by at most 0.35 scene units
horizontally and 0.2 vertically, with damping. Hovering equipment highlights its
footprint and adds a local fill light.
Touch devices do not intercept gestures for camera control.

The desktop text and scene occupy separate columns, mirrored for RTL languages.
Mobile has a dedicated 280px scene above the copy (360px on tablets), so the
heading, description, and buttons never need to sit over the model. The text no
longer fades out on scroll.

## Resource and accessibility behavior

- Mobile uses fewer tank segments, fewer facade details, no shadow maps or antialiasing,
  and a pixel ratio of 1. Desktop pixel ratio is capped at 1.5.
- The continuous animation requests frames at approximately 30fps. Reflection
  lighting is baked once at 64px resolution (32px on mobile).
- The render loop stops while the hero is outside the viewport or the document
  is hidden, and resumes when visible.
- Reduced motion disables moving packets and camera parallax. Hover
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

The campus redesign was validated against the production server in headless
Chromium with software WebGL: 1440px English and Persian, 1024px English, 768px
Persian, and 390px Persian layouts all kept the heading outside the canvas and
had no horizontal overflow. Persian product navigation, equipment hover lighting,
offscreen render suspension/resumption, reduced-motion static rendering, context
loss, and no-WebGL image fallback were checked. Type checking and the production
build completed; the existing ESLint configuration error remains as described above.
These checks do not establish frame rates on real mobile hardware or coverage of
Safari and Firefox.
