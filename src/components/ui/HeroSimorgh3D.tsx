'use client';

import React, { useEffect, useRef, useState } from 'react';

// The Simorgh of the page headers, re-staged as a 3D scene in the style of
// the MotionSites showcase: instead of a flat bird drifting across the sky,
// the hero shows a perspective diorama — a rotating wireframe globe with
// glowing rings and particles — while the wing-beat film flies through it
// on real depth (translateZ), so parallax and scale read as genuine 3D.
//
// Everything runs on compositor-friendly properties only: transform and
// opacity. No WebGL, no per-frame JavaScript. Browsers without alpha video
// (Safari) get the still bird inside the same scene. Off screen, the video
// pauses. Under prefers-reduced-motion the rotations stop (see index.css).

function canPlayAlphaWebm() {
  if (typeof document === 'undefined') return false;
  const ua = navigator.userAgent;
  // Safari plays VP9 but drops the alpha channel: a black box instead of a bird.
  if (/Safari/.test(ua) && !/Chrome|Chromium|Edg|Firefox|Android/.test(ua)) return false;
  return document.createElement('video').canPlayType('video/webm; codecs="vp9"') !== '';
}

export function HeroSimorgh3D() {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [video, setVideo] = useState(false);

  useEffect(() => { setVideo(canPlayAlphaWebm()); }, []);

  useEffect(() => {
    const area = areaRef.current;
    const v = videoRef.current;
    if (!area || !v) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) v.play().catch(() => undefined);
      else v.pause();
    });
    io.observe(area);
    return () => io.disconnect();
  }, [video]);

  // Pointer parallax: tilt the whole diorama toward the cursor. Written as
  // CSS variables only; the transform itself is applied by the stylesheet,
  // and the transition in between events keeps it smooth and cheap.
  useEffect(() => {
    const area = areaRef.current;
    const stage = stageRef.current;
    if (!area || !stage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = area.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        stage.style.setProperty('--tilt-x', `${(-y * 10).toFixed(2)}deg`);
        stage.style.setProperty('--tilt-y', `${(x * 14).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      stage.style.setProperty('--tilt-x', '0deg');
      stage.style.setProperty('--tilt-y', '0deg');
    };
    area.addEventListener('pointermove', onMove);
    area.addEventListener('pointerleave', onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      area.removeEventListener('pointermove', onMove);
      area.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={areaRef}
      aria-hidden="true"
      data-no-translate
      className="sim-hero-3d-area pointer-events-none absolute inset-y-0 end-0 w-full md:w-[48%]"
    >
      {/* Faint depth glow behind the scene */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_75%_45%,rgba(42,211,240,0.08),transparent_70%)]" />

      <div className="absolute end-[4%] top-[16%] w-[46vw] rtl:-scale-x-100 sm:w-[38vw] md:end-[3%] md:top-[15%] md:w-[min(30vw,400px)]">
        <div ref={stageRef} className="sim-hero-3d-stage relative aspect-square w-full">
          <div className="sim-hero-3d-inner">

          {/* Back layer: two tilted orbit rings, spinning in 3D */}
          <div className="sim-hero-3d-ring sim-hero-3d-ring-a" />
          <div className="sim-hero-3d-ring sim-hero-3d-ring-b" />

          {/* Middle layer: a wireframe globe, latitude + longitude lines */}
          <div className="sim-hero-3d-globe">
            <div className="sim-hero-3d-globe-lines" />
          </div>

          {/* Particles floating at different depths */}
          <span className="sim-hero-3d-dot" style={{ left: '12%', top: '22%', transform: 'translateZ(70px)', animationDelay: '0s' }} />
          <span className="sim-hero-3d-dot" style={{ left: '78%', top: '14%', transform: 'translateZ(-60px)', animationDelay: '-2.4s' }} />
          <span className="sim-hero-3d-dot" style={{ left: '88%', top: '62%', transform: 'translateZ(40px)', animationDelay: '-4.1s' }} />
          <span className="sim-hero-3d-dot" style={{ left: '22%', top: '82%', transform: 'translateZ(-40px)', animationDelay: '-1.2s' }} />
          <span className="sim-hero-3d-dot" style={{ left: '55%', top: '92%', transform: 'translateZ(90px)', animationDelay: '-3.3s' }} />

          {/* Front layer: the bird, flying through the scene on its own depth */}
          <div className="sim-hero-3d-bird">
            <div className="sim-hero-bird">
              {video ? (
                <video
                  ref={videoRef}
                  src="/simorgh/simorgh-flight.webm"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="block h-auto w-full"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/simorgh/simorgh-still.webp" alt="" decoding="async" className="block h-auto w-full" />
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
