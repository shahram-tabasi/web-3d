'use client';

import React, { useRef } from 'react';

/** A grid whose cards' borders light up under the pointer: one listener, two CSS variables per card. */
export function GlowGrid({ className = '', children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const onMove = (e: React.PointerEvent) => {
    const root = ref.current;
    if (!root || e.pointerType !== 'mouse') return;
    for (const card of root.querySelectorAll<HTMLElement>('.sim-glow-card')) {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--gx', `${e.clientX - r.left}px`);
      card.style.setProperty('--gy', `${e.clientY - r.top}px`);
    }
  };
  return <div ref={ref} onPointerMove={onMove} className={className}>{children}</div>;
}
