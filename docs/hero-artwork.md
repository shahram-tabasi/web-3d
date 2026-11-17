# Simorgh reference artwork hero

The home-page hero uses a quieter edit of the supplied two-profile / Simorgh / Earth
reference. The Simorgh is a coherent celestial star figure inspired by the supplied
Hercules reference: separate pinpoints and a few larger glints describe its wings,
body, and flowing tail. There is no solid body, continuous neon outline, or realistic
facial detail. The industrial campus and
globe prototypes have been removed. The original
`public/2.jpg` is retained unchanged. The edited artwork is exported to three WebP
sizes under `public/hero/` (approximately 145KB desktop, 72KB tablet, 40KB mobile).
The primary slide in `src/data/hero.ts` selects these images. Other slides and other
site sections are unchanged.

`HeroArtwork.tsx` renders an ordinary server-rendered responsive picture. Desktop
mouse input moves it at most 7px horizontally and 4px vertically, with spring damping
and a perspective tilt of at most 0.35 degrees. It returns to neutral on pointer exit.
This is a photographic parallax effect, not a model of the characters or real 3D.
`HeroAtmosphere.tsx` adds 14 sparse sky stars and 28 small constellation glints,
with slow asynchronous opacity changes, plus three faint meteor paths staggered
over 19/27/31-second cycles. Each meteor is visible for about one second. The
SVG uses the image coordinate system so it follows the artwork's responsive crop
and parallax. Mobile hides half the detail glints and the third meteor.
The command sequence repeats over 20 seconds: the constellation's chest glows,
two short light packets travel to the robot receivers, then the receivers respond.
After the first 4.5 seconds of visible desktop animation, `EarthGlobe.tsx` is
loaded separately and begins rotating a spherical Earth at 0.018 radians/second.
The image, constellation, and command pulses remain photographic/SVG layers;
only Earth uses Three.js. Fiber and Drei are no longer dependencies.

The Earth matches the photograph's coordinate system and uses local night/city-light
textures, an orthographic camera, and a subtle atmosphere rim. Rendering is capped
at 30fps with pixel ratio capped at 1.25. It pauses for reduced motion, hidden
documents, and offscreen artwork. Mobile/tablet, initial reduced-motion users,
and browsers without WebGL keep the Earth in the photograph. A failed texture
load or lost WebGL context also restores that photo. Texture sources and licenses
are retained under `public/hero/textures/`.

Touch devices receive no pointer movement. Reduced-motion users receive a static
image and stars, without moving meteors or twinkling. Changing the system motion
preference, hiding the document, or scrolling the artwork out of view stops the
atmosphere, pauses the Earth, and resets pointer displacement. The image remains available without
JavaScript or WebGL, and CSS disables animation independently for reduced motion.
On mobile and tablets the entire composition appears above the text, preserving
both faces. Desktop uses a subtle lower scrim to keep the existing translated title
and buttons readable without covering the bird. Navigation and existing locales
are retained.

## Validation

```sh
npm ci
npx tsc --noEmit
npm run build
npm start -- --hostname 0.0.0.0 --port 3000
```

The repository's existing ESLint configuration error (`Plugin "" not found`) is
reported during the build. No lint checks are disabled by this change.

Browser checks: confirm the artwork loads at desktop, tablet, and phone widths;
verify both profiles and the bird remain visible; move the desktop mouse and check
that displacement is small and returns to neutral; enable reduced motion and check
that the image stays static; scroll out of view and return; check Persian RTL text
and both CTA links; observe the command pulses and Earth rotation after 4.5 seconds;
simulate Earth context loss; and load the page without JavaScript. Other browser engines
and real mobile hardware still require visual review.

Validated against the production server in Chromium: bounded pointer movement and
return to neutral; star/meteor animation; reduced-motion and offscreen suspension;
English desktop and Persian desktop/tablet/phone layouts; Persian CTA navigation;
image/heading without JavaScript; delayed Earth initialization, continuous spherical
rotation, reduced-motion/offscreen Earth suspension, and photo fallback after context
loss. No application page errors or hydration mismatches were observed. The production
build completed with the pre-existing ESLint configuration error noted above.
