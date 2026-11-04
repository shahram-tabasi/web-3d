'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from '../layout/LocaleLink';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useContent } from '../../content/ContentProvider';
import { useI18n } from '../../i18n';

const AUTOPLAY_MS = 3000;
const SWIPE_PX = 50;
const EASE = 'cubic-bezier(.22,.61,.36,1)';

// ── The deck ──────────────────────────────────────────────────────────────
//
// The same carousel as "Send to EPLAN" in Simorgh Soft: every card is mounted
// once and stays mounted, and only its place on the curve changes — the one
// in the middle, the one before and after turned and dimmed at the shoulders,
// the rest parked behind the centre. Nothing unmounts, so there is no fade to
// black and no wait for the next image: it is already loaded, it just moves.

/** Where a card sits relative to the active one: 0 centre, ±1 shoulders, else off-stage. */
function offsetOf(index: number, active: number, count: number) {
  const half = Math.floor(count / 2);
  let offset = index - active;
  if (offset > half) offset -= count;
  if (offset < -half) offset += count;
  return offset;
}

function cardStyle(offset: number): React.CSSProperties {
  if (offset === 0) {
    return { transform: 'translateX(0) scale(1) rotateY(0deg)', opacity: 1, zIndex: 3 };
  }
  const side = offset < 0 ? -1 : 1;
  if (Math.abs(offset) > 1) {
    // Off-stage: parked just behind the shoulder on its own side, so coming
    // back on is a short move inwards rather than a jump across the deck.
    return { transform: `translateX(${side * 40}%) scale(0.6) rotateY(${side * -18}deg)`, opacity: 0, zIndex: 0, pointerEvents: 'none' };
  }
  return {
    transform: `translateX(${side * 62}%) scale(0.78) rotateY(${side * -18}deg)`,
    opacity: 0.45,
    zIndex: 2,
  };
}

export function ProductCarousel({ heading = 'h1' }: { heading?: 'h1' | 'h2' }) {
  const { products: slides, pages } = useContent();
  const fa = useI18n().locale === 'fa';
  const Heading = heading;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragStart = useRef<number | null>(null);
  const swiped = useRef(false);

  const show = useCallback((n: number) => setActive((n + slides.length) % slides.length), [slides.length]);
  const next = useCallback(() => setActive((value) => (value + 1) % slides.length), [slides.length]);
  const previous = useCallback(() => setActive((value) => (value - 1 + slides.length) % slides.length), [slides.length]);

  // Restarts on every change, so a manual step gets a full interval before the next one.
  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, next]);

  if (slides.length === 0) return null;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') previous();
    if (event.key === 'ArrowRight') next();
  };

  const onPointerDown = (event: React.PointerEvent) => { dragStart.current = event.clientX; };
  const onPointerUp = (event: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = event.clientX - dragStart.current;
    dragStart.current = null;
    swiped.current = Math.abs(delta) >= SWIPE_PX;
    if (delta <= -SWIPE_PX) next();
    else if (delta >= SWIPE_PX) previous();
  };
  // A swipe ends on top of a card; it must not also count as a click on it.
  const onClickCapture = (event: React.MouseEvent) => {
    if (swiped.current) { event.preventDefault(); event.stopPropagation(); swiped.current = false; }
  };

  return (
    <section
      className="relative overflow-hidden border-y border-cyan/10 bg-[#020916]/55 py-14 lg:py-20"
      aria-label="Product showcase"
    >
      {pages.products.heroImage &&
      // eslint-disable-next-line @next/next/no-img-element
      <img src={pages.products.heroImage} alt="" aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35 ${pages.products.heroFlip ? '-scale-y-100' : ''}`} />
      }
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[1100px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(42,211,240,.12),transparent)]" />
        <div className="sim-grid-lines absolute inset-0 opacity-25" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto mb-9 max-w-3xl text-center lg:mb-12" data-no-translate={fa ? '' : undefined}>
          <div className="mb-4 inline-flex items-center gap-4 font-mono text-[10px] font-medium tracking-[0.35em] text-cyan">
            <span className="h-px w-12 bg-cyan/60" />
            {fa ? 'محصولات ما' : 'OUR PRODUCTS'}
            <span className="h-px w-12 bg-cyan/60" />
          </div>
          <Heading className="font-display text-3xl font-semibold leading-[1.3] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {fa ? <>نرم‌افزارهایی که <span className="text-cyan">در صنعت کار می‌کنند</span></> : <>Software that <span className="text-cyan">works on the shop floor</span></>}
          </Heading>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink-muted sm:text-base">
            {fa
              ? 'از طراحی خودکار تابلو برق تا ERP تولیدی و دستیار هوش مصنوعی؛ روی سرورهای خود شما.'
              : 'From automatic switchboard design to manufacturing ERP and an AI assistant — on your own servers.'}
          </p>
        </div>

        {/* The stage stays left-to-right in RTL locales too, so "next" always comes in from the right. */}
        <div
          dir="ltr"
          data-no-simorgh
          className="relative touch-pan-y select-none outline-none"
          style={{ perspective: '1600px' }}
          tabIndex={0}
          // Holds still only while the pointer is on the deck itself, so the reader can finish a card.
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { dragStart.current = null; }}
          onClickCapture={onClickCapture}
        >
          <div
            className="relative mx-auto h-[480px] w-[88%] max-w-[860px] sm:h-[420px] sm:w-[80%] lg:h-[420px] lg:w-[62%]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {slides.map((slide, index) => {
              const offset = offsetOf(index, active, slides.length);
              const current = offset === 0;
              return (
                <div
                  key={slide.slug}
                  aria-hidden={!current}
                  style={{
                    ...cardStyle(offset),
                    transition: `transform .7s ${EASE}, opacity .7s ${EASE}`,
                  }}
                  className={`absolute inset-0 overflow-hidden rounded-2xl border bg-space-1 will-change-transform ${current ? 'border-cyan/70 shadow-[0_20px_50px_-20px_rgba(0,0,0,.8)]' : 'border-cyan/30'}`}
                >
                  <Link
                    href={`/products/${slide.slug}`}
                    tabIndex={current ? 0 : -1}
                    draggable={false}
                    onClick={(event) => {
                      // A shoulder card is a step, not a link: bring it to the centre first.
                      if (!current) { event.preventDefault(); show(index); }
                    }}
                    className="block h-full"
                  >
                    {slide.image &&
                    <Image
                      src={slide.image}
                      alt={slide.name}
                      fill
                      loading="eager"
                      priority={index === 0}
                      draggable={false}
                      sizes="(max-width: 1024px) 88vw, 860px"
                      className="object-cover"
                    />
                    }
                    <div className={`absolute inset-0 ${fa ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#020713]/95 via-[#020713]/75 to-[#020713]/10`} />
                    {/* On a phone the text covers the whole banner, and the banner carries words of its own. */}
                    <div className="absolute inset-0 bg-[#020713]/55 sm:hidden" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020713]/75 via-transparent to-transparent" />

                    <div
                      style={{ transition: `opacity .5s ${EASE} ${current ? '.2s' : '0s'}` }}
                      dir={fa ? 'rtl' : 'ltr'}
                      className={`absolute inset-y-0 flex w-full max-w-[520px] flex-col justify-center overflow-hidden p-6 sm:p-10 lg:p-11 ${fa ? 'right-0' : 'left-0'} ${current ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <span className="truncate font-mono text-[9px] font-medium tracking-[0.2em] text-cyan sm:text-[10px]">
                        {slide.accent}
                      </span>
                      <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white sm:text-4xl" data-no-translate dir="ltr" style={{ textAlign: fa ? 'right' : 'left' }}>
                        {slide.name}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-base font-medium leading-7 text-cyan sm:text-lg">
                        {slide.tagline}
                      </p>
                      <p className="mt-3 line-clamp-4 max-w-[440px] text-sm leading-6 text-white/75 sm:line-clamp-3">
                        {slide.summary}
                      </p>
                      <span className="mt-6 inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-cyan bg-blue/80 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_28px_rgba(43,107,255,.35)] transition hover:bg-cyan hover:text-space-0">
                        {fa ? 'مشاهده جزئیات' : 'View details'}
                        <ArrowRightIcon className="h-4 w-4 rtl:-scale-x-100" />
                      </span>
                    </div>

                    {/* The shoulders carry just the name, so the deck reads at a glance. */}
                    <div
                      style={{ transition: `opacity .5s ${EASE}` }}
                      className={`absolute inset-x-0 bottom-0 hidden p-6 lg:block ${current ? 'opacity-0' : 'opacity-100'}`}
                    >
                      <div className="font-display text-xl font-semibold text-white" data-no-translate>{slide.name}</div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={previous}
            aria-label="Previous product"
            className="absolute left-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cyan/60 bg-space-1/90 text-cyan shadow-[0_0_30px_rgba(42,211,240,.12)] backdrop-blur transition hover:bg-cyan hover:text-space-0 lg:flex"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next product"
            className="absolute right-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cyan/60 bg-space-1/90 text-cyan shadow-[0_0_30px_rgba(42,211,240,.12)] backdrop-blur transition hover:bg-cyan hover:text-space-0 lg:flex"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>

        <div dir="ltr" className="mt-8 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.slug}
              type="button"
              aria-label={slide.name}
              title={slide.name}
              aria-current={index === active}
              onClick={() => show(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${index === active ? 'w-7 bg-cyan shadow-[0_0_15px_rgba(42,211,240,.6)]' : 'w-2.5 bg-white/25 hover:bg-white/50'}`}
            />
          ))}
        </div>

        <div dir="ltr" className="mt-6 flex items-center justify-center gap-3 lg:hidden">
          <button type="button" onClick={previous} className="rounded-full border border-line p-2 text-cyan" aria-label="Previous product"><ChevronLeftIcon className="h-5 w-5" /></button>
          <span className="font-mono text-[10px] tracking-[0.25em] text-ink-faint">{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
          <button type="button" onClick={next} className="rounded-full border border-line p-2 text-cyan" aria-label="Next product"><ChevronRightIcon className="h-5 w-5" /></button>
        </div>
      </div>
    </section>
  );
}
