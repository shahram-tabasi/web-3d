'use client';


import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/** A thin line under the header that fills as the page is read. */
/** The original animation, kept for later use; nothing on the site renders it now. */
export function ScrollProgressLive() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-cyan via-blue-soft to-gold rtl:origin-right"
    />
  );
}


/** The calm design (2026-11): nothing moving in the background. */
export function ScrollProgress(_props: Record<string, unknown> = {}): null {
  return null;
}
