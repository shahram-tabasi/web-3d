'use client';

import React, { useRef } from 'react';

// A card that leans toward the pointer and catches a light where it is.
// Only a transform and two CSS variables change, once a frame at most, so it
// stays on the compositor. Touch screens and reduced motion get a flat card.
export function Tilt({ children, className = '', max = 7 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const raf = useRef(0);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = (clientX - r.left) / r.width;
      const y = (clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateZ(0)`;
      el.style.setProperty('--lx', `${x * 100}%`);
      el.style.setProperty('--ly', `${y * 100}%`);
    });
  };
  const leave = () => {
    cancelAnimationFrame(raf.current);
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`sim-tilt ${className}`}>
      {children}
    </div>
  );
}
