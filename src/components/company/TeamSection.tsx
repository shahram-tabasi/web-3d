'use client';

// The team on a turning cylinder, like the product slider: the person in
// front, the ones before and after turned away at the sides, so it is plain
// there are more; arrows, dots, swipe, the arrow keys, or a click on a side card. Each page is the person's résumé in full: the portrait as it
// was taken (never cropped to a band or tinted), name, role, bio, expertise,
// experience by role and years, education and the résumé file.
//
// Text the admin types may be in either language whatever page it sits on,
// so each piece takes its own direction (dir="auto") and stays in its box.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BriefcaseIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, GraduationCapIcon, LinkedinIcon, MailIcon } from 'lucide-react';
import { useContent } from '../../content/ContentProvider';
import { useI18n } from '../../i18n';
import type { TeamMember } from '../../content/types';

const COPY = {
  en: {
    index: 'TEAM',
    title: 'The people behind Simorgh',
    lead: 'Electrical, process and software engineers, and the AI researchers who work beside them.',
    resume: 'Download résumé (PDF)',
    expertise: 'Expertise',
    experience: 'Experience',
    education: 'Education',
    prev: 'Previous person',
    next: 'Next person',
    people: 'PEOPLE',
  },
  fa: {
    index: 'تیم ما',
    title: 'افرادی که سیمرغ را می‌سازند',
    lead: 'مهندسان برق، فرآیند و نرم‌افزار، و پژوهشگران هوش مصنوعی که کنار آن‌ها کار می‌کنند.',
    resume: 'دریافت رزومه (PDF)',
    expertise: 'تخصص‌ها',
    experience: 'سوابق کاری',
    education: 'تحصیلات',
    prev: 'نفر قبلی',
    next: 'نفر بعدی',
    people: 'نفر',
  },
};

function pick(m: TeamMember, fa: boolean) {
  return {
    name: (fa ? m.nameFa || m.name : m.name || m.nameFa) || '—',
    other: fa ? (m.nameFa && m.name ? m.name : '') : (m.name && m.nameFa ? m.nameFa : ''),
    role: fa ? m.roleFa || m.role : m.role || m.roleFa,
    bio: fa ? m.bioFa || m.bio : m.bio || m.bioFa,
  };
}

/** "Sara Ahmadi" → "SA"; Persian letters do not read well apart, so a Persian-only name gives its first letter. */
function initials(m: TeamMember) {
  const latin = m.name.replace(/[^\p{L}\s]/gu, '').trim().split(/\s+/).filter(Boolean);
  if (latin.length) return (latin.length > 1 ? latin[0][0] + latin[latin.length - 1][0] : latin[0].slice(0, 2)).toUpperCase();
  return m.nameFa.trim().charAt(0) || '·';
}

/** The portrait as taken, or a monogram on night blue when there is no photo yet. */
function Portrait({ m, name, className = '', eager = false }: { m: TeamMember; name: string; className?: string; eager?: boolean }) {
  if (m.photo) {
    return <img src={m.photo} alt={name} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} className={`h-full w-full object-cover object-top ${className}`} />;
  }
  return (
    <div className={`relative grid h-full w-full place-items-center overflow-hidden bg-[radial-gradient(120%_90%_at_30%_10%,#1d3570_0%,#0b1226_55%,#060a16_100%)] ${className}`} role="img" aria-label={name}>
      <img src="/brand/mark-light.png" alt="" aria-hidden className="absolute -bottom-6 -end-8 w-[85%] opacity-[0.07]" />
      <span className="font-display text-5xl font-semibold tracking-tight text-ink/80">{initials(m)}</span>
    </div>
  );
}

const SWIPE = 50;
const EASE = 'cubic-bezier(.22,.61,.36,1)';

/** Where a card sits relative to the centre one: 0 centre, ±1 sides, else behind. */
function offsetOf(i: number, active: number, count: number) {
  const half = Math.floor(count / 2);
  let o = i - active;
  if (o > half) o -= count;
  if (o < -half) o += count;
  return o;
}

/**
 * The cards stand on the inside of a cylinder, the reader at its axis: the
 * front card faces them flat, and each card further round turns toward them
 * and comes nearer, like the panels of a curved screen. `width` is the card's
 * width in pixels; the cylinder's radius follows from it.
 */
function cardStyle(offset: number, width: number, reduce: boolean): React.CSSProperties {
  const radius = width * 1.9;
  const step = ((width * 1.05) / radius) * (180 / Math.PI); // degrees between neighbours, with a small gap
  const angle = reduce ? 0 : -offset * step;
  const far = Math.abs(offset);
  const shift = reduce ? `translateX(${offset * 105}%)` : '';
  return {
    transform: `${shift} translateZ(${radius}px) rotateY(${angle}deg) translateZ(${-radius}px)`,
    opacity: far === 0 ? 1 : far === 1 ? 0.55 : far === 2 ? 0.25 : 0,
    pointerEvents: far > 2 ? 'none' : undefined,
  };
}

export function TeamSection() {
  const { team } = useContent();
  const fa = useI18n().locale === 'fa';
  const t = fa ? COPY.fa : COPY.en;
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const count = team?.length ?? 0;
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const [cardWidth, setCardWidth] = useState(800);
  useEffect(() => {
    const el = ring.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setCardWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const swiped = useRef(false);

  const show = useCallback((n: number) => { if (count) setActive(((n % count) + count) % count); }, [count]);
  const next = () => show(active + 1);
  const prev = () => show(active - 1);

  // A link to /company#member-id opens on that person.
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const i = team.findIndex((m) => m.id === id);
      if (i >= 0) { setActive(i); document.getElementById('team')?.scrollIntoView({ block: 'start' }); }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [team]);

  if (!count) return null;
  const align: React.CSSProperties = { textAlign: fa ? 'right' : 'left' };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };
  const onPointerDown = (e: React.PointerEvent) => { dragStart.current = { x: e.clientX, y: e.clientY }; };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = dragStart.current;
    dragStart.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    // A sideways swipe turns the cylinder; an up-down one scrolls the résumé.
    swiped.current = Math.abs(dx) >= SWIPE && Math.abs(dx) > Math.abs(dy);
    if (!swiped.current) return;
    if (dx < 0) next(); else prev();
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (swiped.current) { e.preventDefault(); e.stopPropagation(); swiped.current = false; }
  };

  return (
    <section id="team" className="relative scroll-mt-20 overflow-hidden border-b border-line bg-space-0">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(43,107,255,.14),transparent)]" />
      <div className="relative mx-auto max-w-shell px-5 pt-20 lg:px-10 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center" data-no-translate={fa ? '' : undefined}>
          <div className="mb-5 inline-flex items-center gap-4 font-mono text-[11px] text-cyan/80"><span className="h-px w-10 bg-cyan/40" />{t.index}<span className="h-px w-10 bg-cyan/40" /></div>
          <h2 className="font-display text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[44px]">{t.title}</h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted lg:text-[17px]">{t.lead}</p>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 pb-20 pt-12 sm:px-6 lg:px-10 lg:pb-24">
        {/* The stage runs left to right in every language, like the product slider: the next person comes in from the right. */}
        <div
          dir="ltr"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { dragStart.current = null; }}
          onClickCapture={onClickCapture}
          aria-roledescription="carousel"
          aria-label={t.title}
          className="relative touch-pan-y select-none outline-none"
          style={{ perspective: '2400px', perspectiveOrigin: '50% 50%' }}
        >
          <div ref={ring} className="relative mx-auto h-[720px] w-[82%] max-w-[920px] sm:h-[640px] sm:w-[70%] lg:h-[580px] lg:w-[56%]" style={{ transformStyle: 'preserve-3d' }}>
            {team.map((m, i) => {
              const offset = offsetOf(i, active, count);
              const current = offset === 0;
              const p = pick(m, fa);
              return (
                <article
                  key={m.id}
                  id={m.id}
                  aria-hidden={!current}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} / ${count}: ${p.name}`}
                  onClick={() => { if (!current) show(i); }}
                  style={{ ...cardStyle(offset, cardWidth, reduce), transition: `transform .8s ${EASE}, opacity .8s ${EASE}`, backfaceVisibility: 'hidden' }}
                  className={`absolute inset-0 grid grid-rows-[300px_minmax(0,1fr)] overflow-hidden rounded-[26px] border bg-[#070b18] will-change-transform sm:grid-rows-[340px_minmax(0,1fr)] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:grid-rows-1 ${current ? 'border-cyan/60' : 'cursor-pointer border-cyan/25'}`}
                >
                  {/* The portrait, whole and untinted. */}
                  <div className={`relative overflow-hidden bg-[#e8e6e4] ${fa ? 'md:order-2' : ''}`}>
                    <Portrait m={m} name={p.name} eager={Math.abs(offset) <= 1} />
                    {/* The sides show who is there: a name over the photo. */}
                    <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 transition-opacity duration-500 md:hidden ${current ? 'opacity-0' : 'opacity-100'}`}>
                      <span dir="auto" className="block text-[18px] font-semibold text-white">{p.name}</span>
                    </div>
                  </div>

                  <div dir={fa ? 'rtl' : 'ltr'} className={`flex min-h-0 flex-col overflow-y-auto p-6 sm:p-9 ${fa ? 'md:order-1' : ''} ${current ? '' : 'pointer-events-none'}`}>
                    <h3 dir="auto" style={align} className="font-display text-[26px] font-semibold leading-tight text-ink sm:text-[32px]">{p.name}</h3>
                    {p.other && <p dir="auto" style={align} className="mt-1.5 text-[14px] text-ink-faint">{p.other}</p>}
                    {p.role && <p dir="auto" style={align} className="mt-3 text-[16px] text-cyan-soft">{p.role}</p>}
                    {p.bio && <p dir="auto" style={align} className="mt-5 whitespace-pre-line text-[14.5px] leading-[1.95] text-ink-muted">{p.bio}</p>}

                    {m.expertise.length > 0 && (
                      <div className="mt-7">
                        <h4 className="text-[12px] text-ink-faint" data-no-translate={fa ? '' : undefined}>{t.expertise}</h4>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {m.expertise.map((x) => <li key={x} dir="auto" className="rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[13px] text-cyan-soft">{x}</li>)}
                        </ul>
                      </div>
                    )}

                    {m.experience.length > 0 && (
                      <div className="mt-7">
                        <h4 className="flex items-center gap-2 text-[12px] text-ink-faint" data-no-translate={fa ? '' : undefined}><BriefcaseIcon className="h-3.5 w-3.5" />{t.experience}</h4>
                        {current && <Experience key={`${m.id}-${active}`} items={m.experience} reduce={reduce} />}
                      </div>
                    )}

                    {m.education && (
                      <div className="mt-7">
                        <h4 className="flex items-center gap-2 text-[12px] text-ink-faint" data-no-translate={fa ? '' : undefined}><GraduationCapIcon className="h-3.5 w-3.5" />{t.education}</h4>
                        <p dir="auto" style={align} className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-ink-muted">{m.education}</p>
                      </div>
                    )}

                    {(m.resume || m.linkedin || m.email) && (
                      <div className="mt-auto flex flex-wrap gap-2.5 pt-8">
                        {m.resume && (
                          <a href={m.resume} target="_blank" rel="noreferrer" download tabIndex={current ? 0 : -1} className="inline-flex h-11 items-center gap-2 rounded-full bg-blue px-5 text-[13.5px] font-medium text-white hover:bg-blue-soft" data-no-translate={fa ? '' : undefined}>
                            <DownloadIcon className="h-4 w-4" />{t.resume}
                          </a>
                        )}
                        {m.linkedin && (
                          <a href={m.linkedin} target="_blank" rel="noreferrer me" tabIndex={current ? 0 : -1} className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-[13.5px] text-ink hover:border-cyan/60">
                            <LinkedinIcon className="h-4 w-4" />LinkedIn
                          </a>
                        )}
                        {m.email && (
                          <a href={`mailto:${m.email}`} dir="ltr" tabIndex={current ? 0 : -1} className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-[13.5px] text-ink hover:border-cyan/60">
                            <MailIcon className="h-4 w-4" />{m.email}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {count > 1 && (
            <>
              <button type="button" onClick={prev} aria-label={t.prev}
                className="absolute left-0 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cyan/60 bg-space-1/95 text-cyan shadow-[0_0_30px_rgba(42,211,240,.12)] transition hover:bg-cyan hover:text-space-0 lg:flex">
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button type="button" onClick={next} aria-label={t.next}
                className="absolute right-0 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cyan/60 bg-space-1/95 text-cyan shadow-[0_0_30px_rgba(42,211,240,.12)] transition hover:bg-cyan hover:text-space-0 lg:flex">
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {count > 1 && (
          <div dir="ltr" className="mt-8 flex items-center justify-center gap-5" data-no-translate={fa ? '' : undefined}>
            <button type="button" onClick={prev} aria-label={t.prev} className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-muted hover:text-cyan lg:hidden"><ChevronLeftIcon className="h-5 w-5" /></button>
            <div className="flex items-center gap-2">
              {team.map((x, i) => (
                <button key={x.id} type="button" onClick={() => show(i)} aria-label={pick(x, fa).name}
                  className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'w-8 bg-cyan' : 'w-2 bg-white/25 hover:bg-white/50'}`} />
              ))}
            </div>
            <span className="font-mono text-[11px] tabular-nums text-ink-faint">
              {fa ? `${(active + 1).toLocaleString('fa-IR')} / ${count.toLocaleString('fa-IR')}` : `${String(active + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`}
            </span>
            <button type="button" onClick={next} aria-label={t.next} className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-muted hover:text-cyan lg:hidden"><ChevronRightIcon className="h-5 w-5" /></button>
          </div>
        )}
      </div>
    </section>
  );
}

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
/** "۱۴ سال" / "14 years" → 14; anything else (a date range) → null. */
function yearsOf(period: string): number | null {
  const latin = period.replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
  const m = /(\d+(?:[.,]\d+)?)\s*(?:\+\s*)?(?:سال|years?|yrs?)/i.exec(latin);
  return m ? Number(m[1].replace(',', '.')) : null;
}

/**
 * Experience by role. When the periods are durations ("۱۴ سال"), each role
 * gets a bar as long as its years, filling in as the sheet opens; otherwise
 * (dates, places) a plain timeline.
 */
function Experience({ items, reduce }: { items: TeamMember['experience']; reduce: boolean }) {
  const years = items.map((x) => yearsOf(x.period));
  const max = Math.max(0, ...years.map((y) => y ?? 0));
  if (max > 0 && years.every((y) => y !== null)) {
    return (
      <ul className="mt-4 grid gap-4">
        {items.map((x, i) => (
          <li key={i}>
            <div className="flex items-baseline justify-between gap-4">
              <span dir="auto" className="min-w-0 text-[14.5px] text-ink">{x.title}</span>
              <span className="shrink-0 text-[13px] tabular-nums text-gold">{x.period}</span>
            </div>
            {x.org && <div className="mt-0.5 text-[12.5px] text-ink-faint">{x.org}</div>}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r from-gold/70 to-cyan/80 rtl:bg-gradient-to-l`}
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${((years[i] ?? 0) / max) * 100}%` }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ol className="relative mt-4 border-s border-line ps-6">
      {items.map((x, i) => (
        <li key={i} className="relative pb-5 last:pb-0">
          <span className="absolute -start-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-space-1 bg-gold" />
          <div className="text-[14.5px] text-ink"><bdi>{x.title}</bdi></div>
          {(x.org || x.period) && (
            <div className="mt-0.5 text-[13px] text-ink-muted">
              {x.org}{x.org && x.period && ' · '}{x.period && <span className="text-ink-faint">{x.period}</span>}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
