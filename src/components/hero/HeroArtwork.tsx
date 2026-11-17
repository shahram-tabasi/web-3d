'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { HeroMedia } from '../../data/hero';
import { HeroAtmosphere } from './HeroAtmosphere';
import dynamic from 'next/dynamic';

const EarthGlobe = dynamic(() => import('./EarthGlobe'), { ssr: false });

/** A photographic parallax treatment, intentionally without a WebGL render loop. */
export function HeroArtwork({ media }: { media: HeroMedia }) {
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(host, { amount: 0.05 });
  const [interactive, setInteractive] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [earthTriggered, setEarthTriggered] = useState(false);
  const inputX = useMotionValue(0);
  const inputY = useMotionValue(0);
  const x = useSpring(inputX, { stiffness: 45, damping: 24, mass: 0.8 });
  const y = useSpring(inputY, { stiffness: 45, damping: 24, mass: 0.8 });
  const rotateX = useTransform(y, [-4, 4], [0.25, -0.25]);
  const rotateY = useTransform(x, [-7, 7], [-0.35, 0.35]);

  useEffect(() => {
    if (!video.current) return;
    if (interactive) void video.current.play().catch(() => {});
    else video.current.pause();
  }, [interactive]);

  useEffect(() => {
    if (!interactive || !animated || earthTriggered) return;
    const timer = window.setTimeout(() => setEarthTriggered(true), 4500);
    return () => window.clearTimeout(timer);
  }, [interactive, animated, earthTriggered]);

  useEffect(() => {
    const section = host.current?.closest('section');
    if (!section) return;
    const finePointer = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const reset = () => { inputX.set(0); inputY.set(0); };
    const stop = () => { inputX.jump(0); inputY.jump(0); x.jump(0); y.jump(0); };
    const canMove = () => inView && !document.hidden && finePointer.matches && !reduced.matches;
    const preferences = () => {
      setInteractive(canMove());
      setAnimated(inView && !document.hidden && !reduced.matches);
      if (!canMove()) stop();
    };
    const move = (event: Event) => {
      const pointer = event as PointerEvent;
      if (!canMove() || pointer.pointerType !== 'mouse') return;
      const bounds = section.getBoundingClientRect();
      inputX.set(Math.max(-1, Math.min(1, (pointer.clientX - bounds.left) / bounds.width * 2 - 1)) * 7);
      inputY.set(Math.max(-1, Math.min(1, (pointer.clientY - bounds.top) / bounds.height * 2 - 1)) * 4);
    };
    preferences();
    section.addEventListener('pointermove', move);
    section.addEventListener('pointerleave', reset);
    finePointer.addEventListener('change', preferences);
    reduced.addEventListener('change', preferences);
    document.addEventListener('visibilitychange', preferences);
    return () => {
      section.removeEventListener('pointermove', move);
      section.removeEventListener('pointerleave', reset);
      finePointer.removeEventListener('change', preferences);
      reduced.removeEventListener('change', preferences);
      document.removeEventListener('visibilitychange', preferences);
      stop();
    };
  }, [inView, inputX, inputY, x, y]);

  return <div ref={host} data-hero-artwork={interactive ? 'interactive' : 'static'} data-command-state={earthTriggered ? 'received' : 'awaiting'}
    className="pointer-events-none absolute inset-x-0 top-20 aspect-[3/2] overflow-hidden lg:inset-0 lg:aspect-auto">
    <motion.div className="absolute -inset-3" style={{ x, y, rotateX, rotateY, transformPerspective: 1400 }}>
      {media.type === 'video' ? <video ref={video} className="h-full w-full object-cover" style={{ objectPosition: media.focal }}
        autoPlay={interactive} muted loop playsInline poster={media.desktop}>
        {media.videoWebm && <source src={media.videoWebm} type="video/webm" />}
        {media.videoMp4 && <source src={media.videoMp4} type="video/mp4" />}
      </video> : <picture className="block h-full w-full">
        <source media="(min-width: 1024px)" srcSet={media.desktop} />
        <source media="(min-width: 640px)" srcSet={media.tablet} />
        <img src={media.mobile} width={1536} height={1024}
          alt="Two artificial intelligence profiles facing a Simorgh constellation above Earth"
          className="h-full w-full object-cover" style={{ objectPosition: media.focal }}
          fetchPriority="high" decoding="async" />
      </picture>}
      {media.type === 'image' && <>
        {earthTriggered && <EarthGlobe active={interactive && animated} />}
        <HeroAtmosphere active={animated} />
      </>}
    </motion.div>
    <div className="absolute inset-0 bg-gradient-to-b from-space-0/20 via-transparent to-space-0 lg:hidden" />
  </div>;
}
