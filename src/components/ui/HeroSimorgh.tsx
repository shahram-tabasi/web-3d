'use client';

import React, { useEffect, useRef, useState } from 'react';

// The Simorgh keeping the sky of a page header: it flies on the empty side of
// the hero — the end side, mirrored in Persian and Arabic — riding the air in
// a slow loop while its wings beat.
//
// Smoothness first. The wing beat is the brand film as a VP9 video with an
// alpha channel: decoded by the GPU, a fraction of the cost of the 75-frame
// animated WebP it replaces. The drift is a CSS transform, run by the
// compositor. No filters, blend modes or per-frame JavaScript touch the bird.
// Browsers without alpha video (Safari) get the still bird with the same
// drift. Off screen, the video pauses.

function canPlayAlphaWebm() {
  if (typeof document === 'undefined') return false;
  const ua = navigator.userAgent;
  // Safari plays VP9 but drops the alpha channel: a black box instead of a bird.
  if (/Safari/.test(ua) && !/Chrome|Chromium|Edg|Firefox|Android/.test(ua)) return false;
  return document.createElement('video').canPlayType('video/webm; codecs="vp9"') !== '';
}

export function HeroSimorgh() {
  const areaRef = useRef<HTMLDivElement | null>(null);
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

  return (
    <div
      ref={areaRef}
      aria-hidden="true"
      data-no-translate
      className="pointer-events-none absolute inset-y-0 end-0 w-full md:w-[48%]"
    >
      <div className="absolute end-[4%] top-[16%] w-[46vw] opacity-60 rtl:-scale-x-100 sm:w-[38vw] md:end-[3%] md:top-[15%] md:w-[min(30vw,400px)] md:opacity-95">
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
  );
}
