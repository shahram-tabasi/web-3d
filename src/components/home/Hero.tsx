'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowRightIcon, ChevronDownIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useContent } from '../../content/ContentProvider';
import { useI18n } from '../../i18n';

// The first screen. It should feel alive without costing frames: the picture
// breathes (a slow CSS zoom), a soft light follows the pointer (one CSS
// variable, written at most once a frame) and the industry line turns over every
// few seconds. The words are there at once (no fade-in: the first paint is the
// page), and nothing turns over under prefers-reduced-motion. Everything that moves is
// a transform or an opacity, so the compositor does the work.

function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % words.length), 2800);
    return () => window.clearInterval(t);
  }, [words.length, reduced]);
  return (
    <span className="relative inline-grid h-[1.6em] overflow-hidden align-bottom">
      {words.map((w, k) => (
        <span
          key={w}
          aria-hidden={k !== i}
          className="col-start-1 row-start-1 whitespace-nowrap text-gold transition-[transform,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ transform: `translateY(${k === i ? 0 : k === (i + words.length - 1) % words.length ? -110 : 110}%)`, opacity: k === i ? 1 : 0 }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const { locale } = useI18n();
  const fa = locale === 'fa';
  const { hero } = useContent();
  const text = hero.text[locale] ?? hero.text.en;
  const isVideo = /\.(mp4|webm)(\?|$)/i.test(hero.image);

  // The light that follows the pointer.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !window.matchMedia('(pointer: fine)').matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    };
    el.addEventListener('pointermove', move, { passive: true });
    return () => { el.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, [reduced]);

  const lead = fa ? 'در خدمت' : 'Working for';
  const words = fa
    ? ['صنایع تولیدی', 'برق و انرژی', 'نفت، گاز و معدن', 'شهرهای هوشمند']
    : ['manufacturing', 'power & energy', 'oil, gas & mining', 'smart cities'];

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden bg-space-0 [--mx:62%] [--my:40%]"
      aria-label={fa ? 'سیمرغ' : 'SIMORGH'}
      data-no-simorgh
      data-no-translate={fa ? '' : undefined}
    >
      <div className="absolute inset-0 sim-kenburns">
        {isVideo ? (
          <video className="h-full w-full object-cover" style={{ objectPosition: hero.focal }} autoPlay muted loop playsInline poster={hero.mobileImage || undefined}>
            <source src={hero.image} type={/\.webm/i.test(hero.image) ? 'video/webm' : 'video/mp4'} />
          </video>
        ) : (
          <picture>
            <source media="(min-width: 640px)" srcSet={hero.image} />
            <img src={hero.mobileImage || hero.image} alt="" className="h-full w-full object-cover" style={{ objectPosition: hero.focal }} fetchPriority="high" />
          </picture>
        )}
      </div>

      {/* Scrims, then the pointer light and a slow aurora. */}
      <div className="absolute inset-0 bg-gradient-to-t from-space-0 via-space-0/60 to-space-0/30" style={{ opacity: Math.min(1, hero.overlay + 0.4) }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(520px_circle_at_var(--mx)_var(--my),rgba(124,230,247,.13),transparent_70%)] lg:block" />
      <div aria-hidden className="sim-aurora pointer-events-none absolute -inset-x-1/4 bottom-[-30%] h-[70%] opacity-60" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-shell flex-col items-center justify-end px-5 pb-24 pt-28 text-center lg:justify-center lg:px-10 lg:pb-10">
        {/* The brand opens the page's one heading: what a search for "سیمرغ AI" should find. */}
        <h1 className="max-w-5xl font-display font-semibold tracking-tight text-white">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 align-middle text-[12.5px] font-medium leading-normal tracking-wide text-ink-muted backdrop-blur-md">
            <span aria-hidden className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" /></span>
            {text.eyebrow}
          </span>
          <span className="mt-7 block text-[36px] leading-[1.15] sm:text-[52px] lg:text-[66px]">{text.headline}</span>
          <span className="sim-shine block text-[36px] leading-[1.15] text-transparent [-webkit-background-clip:text] [background-clip:text] [background-image:linear-gradient(92deg,#7ce6f7,#5c8dff_40%,#e8b65a_60%,#7ce6f7_80%)] [background-size:200%_auto] sm:text-[52px] lg:text-[66px]">
            {text.accent}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-[1.9] text-ink-muted sm:text-[17px]">
          {text.subtitle}
        </p>

        <div className="mt-6 text-[15px] text-ink sm:text-[17px]">
          {lead} <RotatingWord words={words} />
        </div>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button to={hero.primaryTo} size="lg">
            {text.primary}
            <ArrowRightIcon className="h-4 w-4 rtl:-scale-x-100" strokeWidth={1.6} />
          </Button>
          <Button to={hero.secondaryTo} size="lg" variant="outline">
            {text.secondary}
          </Button>
        </div>
      </div>

      <a href="#services" aria-label={fa ? 'ادامه' : 'Scroll down'} className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-ink-faint transition-colors hover:text-cyan sm:block">
        <ChevronDownIcon className="h-6 w-6 animate-bounce" strokeWidth={1.4} />
      </a>
      <div className="absolute inset-x-0 bottom-0 h-px sim-hairline" />
    </section>
  );
}
