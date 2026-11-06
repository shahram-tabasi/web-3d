'use client';

import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useContent } from '../../content/ContentProvider';
import { useI18n } from '../../i18n';

// The first screen, "Persian night" (2026-11): the Simorgh flies over the
// earth's horizon under a band of the galaxy, and a constellation of thought —
// the AI — links the stars around it and sends signals down to the earth.
// The scene is pure CSS and SVG (no video, no canvas), so the page stays fast,
// and it moves only gently and not at all under prefers-reduced-motion.
// The words keep the UX rules: one heading, one sentence, one main action and
// one quiet one, on plain dark sky with AA contrast.

/** Faint eight-pointed girih stars in gold: Persian tilework in the night. */
const GIRIH = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Cg fill='none' stroke='%23e4bc62' stroke-width='1'%3E%3Cpath d='M36 6l8.5 21.5L66 36l-21.5 8.5L36 66l-8.5-21.5L6 36l21.5-8.5z'/%3E%3Cpath d='M36 22l4 10 10 4-10 4-4 10-4-10-10-4 10-4z'/%3E%3C/g%3E%3C/svg%3E")`;
const GIRIH_MASK = 'radial-gradient(ellipse 60% 60% at 50% 30%, #000, transparent)';

/** The AI constellation: stars (nodes) and the lines of thought between them. */
const NODES: [number, number, number][] = [
  [60, 90, 3], [150, 40, 2.4], [250, 70, 3.4], [340, 30, 2.2], [420, 110, 3],
  [90, 210, 2.4], [200, 170, 2.8], [380, 220, 2.6], [460, 260, 2.2], [40, 330, 2.6],
  [130, 300, 3.2], [300, 330, 2.4], [420, 380, 3], [220, 420, 2.6], [90, 440, 2.2],
];
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [2, 4], [0, 5], [5, 6], [6, 2], [6, 7], [4, 7], [7, 8],
  [5, 9], [9, 10], [10, 6], [10, 11], [11, 7], [11, 12], [12, 8], [11, 13], [13, 14], [14, 10],
];
/** Signals that run through the constellation down toward the earth. */
const SIGNALS: [number, number][] = [[10, 13], [6, 11], [7, 12]];

/** City lights on the earth's rim (desktop geometry: a 1440-wide earth 160px
 *  above the fold line), and the arcs of data the AI sends between them. */
const CITIES: [number, number][] = [[250, 192.9], [460, 137.7], [660, 115.3], [870, 121.8], [1050, 152.3], [1240, 211.2]];
const ARCS = [
  'M250 192.9 Q455 16.9 660 115.3', 'M460 137.7 Q665 23.4 870 121.8', 'M660 115.3 Q855 21.7 1050 152.3',
  'M870 121.8 Q1055 33 1240 211.2', 'M250 192.9 Q355 87.3 460 137.7', 'M1050 152.3 Q1145 106.7 1240 211.2',
];

function EarthNetwork() {
  return (
    <svg viewBox="0 0 1440 260" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 hidden h-[260px] w-full lg:block" aria-hidden>
      <g fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {ARCS.map((d, i) => (
          <path key={d} d={d} stroke={i % 2 ? '#8fe4e0' : '#e4bc62'} opacity="0.45" className="sim-signal" style={{ animationDelay: `${i * 0.5}s` }} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      {CITIES.map(([x, y], i) => (
        <g key={i} className="sim-node" style={{ animationDelay: `${i * 0.6}s` }}>
          <ellipse cx={x} cy={y} rx="9" ry="9" fill="#e4bc62" opacity="0.18" />
          <ellipse cx={x} cy={y} rx="2.2" ry="2.2" fill="#ffe7b0" />
        </g>
      ))}
    </svg>
  );
}

function Constellation() {
  return (
    <svg viewBox="0 0 500 480" className="absolute inset-0 h-full w-full" aria-hidden>
      <g stroke="#8fe4e0" strokeWidth="0.8" opacity="0.28">
        {LINKS.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
        ))}
      </g>
      <g stroke="#e4bc62" strokeWidth="1.2" fill="none" opacity="0.7">
        {SIGNALS.map(([a, b]) => (
          <line key={`s${a}-${b}`} className="sim-signal" x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
        ))}
      </g>
      {NODES.map(([x, y, r], i) => (
        <g key={i} className="sim-node" style={{ animationDelay: `${((i * 0.37) % 4).toFixed(2)}s` }}>
          <circle cx={x} cy={y} r={r * 3} fill="#5fd4cf" opacity="0.10" />
          <circle cx={x} cy={y} r={r * 0.8} fill={i % 4 === 0 ? '#e4bc62' : '#eef2fb'} />
        </g>
      ))}
    </svg>
  );
}

export function Hero() {
  const { locale } = useI18n();
  const fa = locale === 'fa';
  const { hero } = useContent();
  const text = hero.text[locale] ?? hero.text.en;
  const industries = fa
    ? ['صنایع تولیدی', 'برق و انرژی', 'نفت، گاز و معدن', 'شهرهای هوشمند']
    : ['Manufacturing', 'Power & energy', 'Oil, gas & mining', 'Smart cities'];

  return (
    <section className="relative w-full overflow-hidden pt-[72px]" aria-label={fa ? 'سیمرغ' : 'SIMORGH'} data-no-simorgh>
      {/* The scene, behind everything and hidden from assistive technology. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="sim-galaxy" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: GIRIH, WebkitMaskImage: GIRIH_MASK, maskImage: GIRIH_MASK }}
        />
        <span className="sim-meteor" />
        <div className="sim-earth" />
        <EarthNetwork />
      </div>

      <div className="relative mx-auto grid max-w-shell items-center gap-10 px-5 pb-36 pt-14 sm:pb-40 sm:pt-20 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:px-10 lg:pb-48 lg:pt-16">
        <div>
          {/* The brand opens the page's one heading: what a search for «سیمرغ AI» should find. */}
          <h1 className="font-display font-semibold tracking-tight text-ink">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-space-1/70 px-3.5 py-1 align-middle text-[13px] font-medium leading-normal text-ink-muted backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_rgba(95,212,207,0.9)]" />
              {text.eyebrow}
            </span>
            <span className="mt-6 block text-[34px] leading-[1.2] sm:text-[46px] lg:text-[58px]">{text.headline}</span>
            <span className="block bg-gradient-to-r from-cyan-soft via-violet-soft to-gold bg-clip-text pb-1 text-[34px] leading-[1.25] text-transparent sm:text-[46px] lg:text-[58px]">
              {text.accent}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-[17px] leading-[1.9] text-ink-muted sm:text-[18px]">{text.subtitle}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to={hero.primaryTo} size="lg">
              {text.primary}
              <ArrowRightIcon className="h-4 w-4 rtl:-scale-x-100" strokeWidth={1.8} />
            </Button>
            <Button to={hero.secondaryTo} size="lg" variant="outline">
              {text.secondary}
            </Button>
          </div>

          <p className="mt-10 text-[14px] text-ink-faint">
            {fa ? 'در خدمت ' : 'Working for '}
            {industries.map((w, i) => (
              <React.Fragment key={w}>
                <span className="text-ink-muted">{w}</span>
                {i < industries.length - 1 && <span aria-hidden className="mx-2 text-gold/60">✦</span>}
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* The Simorgh among the stars of thought. Decorative: hidden on phones,
            where the words must come first and fast. */}
        <div className="relative mx-auto hidden aspect-[500/480] w-full max-w-[520px] lg:block" aria-hidden>
          <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgba(95,212,207,0.18),rgba(79,122,240,0.10)_55%,transparent)]" />
          <Constellation />
          <div className="sim-float absolute inset-x-[12%] top-[14%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/simorgh/simorgh-still.webp"
              alt=""
              decoding="async"
              className="block h-auto w-full drop-shadow-[0_0_28px_rgba(143,228,224,0.35)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
