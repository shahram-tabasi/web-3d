'use client';

import dynamic from 'next/dynamic';
import React, { Component, useCallback, useEffect, useRef, useState } from 'react';

const Scene = dynamic(() => import('./SceneCanvas'), { ssr: false });

class SceneBoundary extends Component<{ children: React.ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** The server-rendered hero image stays underneath until WebGL is ready. */
export function HeroExperience() {
  const host = useRef<HTMLDivElement>(null);
  const [eligible, setEligible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const onFailure = useCallback(() => setFailed(true), []);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const small = window.matchMedia('(max-width: 767px)');
    const preferences = () => { setReduced(motion.matches); setCompact(small.matches); };
    preferences();
    motion.addEventListener('change', preferences);
    small.addEventListener('change', preferences);
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && !document.hidden);
      if (entry.isIntersecting) setEligible(true);
    }, { threshold: 0.01 });
    observer.observe(element);
    const visibility = () => {
      const bounds = element.getBoundingClientRect();
      setVisible(!document.hidden && bounds.bottom > 0 && bounds.top < window.innerHeight);
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', preferences);
      small.removeEventListener('change', preferences);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  return (
    <div ref={host} aria-hidden="true" className="absolute inset-0" data-hero-3d={failed ? 'fallback' : 'available'}>
      <div className={`pointer-events-none absolute inset-0 bg-[#050b18] transition-opacity duration-700 ${ready && !failed ? 'opacity-100' : 'opacity-0'}`} />
      <div className="absolute inset-x-0 top-20 h-[280px] sm:h-[360px] lg:bottom-0 lg:top-0 lg:h-auto lg:left-[43%] rtl:lg:left-0 rtl:lg:right-[43%]">
        {eligible && !failed && <SceneBoundary onFailure={onFailure}>
          <Scene visible={visible} compact={compact} reduced={reduced} onFailure={onFailure} onReady={onReady} />
        </SceneBoundary>}
      </div>
    </div>
  );
}
