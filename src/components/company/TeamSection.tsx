'use client';

// The team on a tight 3D cylinder of small cards (portrait, name, role):
// the front card faces the reader, the ones round the sides turn toward
// them, so several people are seen at once. Arrows, dots, swipe or the
// arrow keys turn it; a click brings that card forward out of the ring,
// grown into the person's whole résumé (portrait as taken, bio, expertise,
// experience by role and years, education, résumé file).

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BriefcaseIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, GraduationCapIcon, LinkedinIcon, MailIcon, XIcon } from 'lucide-react';
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
    close: 'Close',
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
    close: 'بستن',
    next: 'نفر بعدی',
    people: 'نفر',
  },
};

function pick(m: TeamMember, fa: boolean) {
  return {
    name: (fa ? m.nameFa || m.name : m.name || m.nameFa) || '—',
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

/**
 * Small cards on the inside of a tight cylinder, the reader at its axis: the
 * front card faces them, each card further round turns toward them and comes
 * nearer. `width` is a card's width in pixels; the radius follows from it.
 */
function cardStyle(offset: number, width: number, reduce: boolean): React.CSSProperties {
  const radius = width * 1.9;
  const step = ((width * 1.06) / radius) * (180 / Math.PI);
  const far = Math.abs(offset);
  const transform = reduce
    ? `translateX(${offset * 112}%)`
    : `translateZ(${radius}px) rotateY(${-offset * step}deg) translateZ(${-radius}px)`;
  return {
    transform,
    opacity: far === 0 ? 1 : far === 1 ? 0.85 : far === 2 ? 0.6 : 0,
    pointerEvents: far > 2 ? 'none' : undefined,
    // Cards waiting out of sight are not drawn at all.
    visibility: far > 2 ? 'hidden' : 'visible',
  };
}

/** The whole résumé of one person: the portrait beside everything about them. */
function Resume({ m, fa, t, reduce }: { m: TeamMember; fa: boolean; t: typeof COPY.en; reduce: boolean }) {
  const p = pick(m, fa);
  const align: React.CSSProperties = { textAlign: fa ? 'right' : 'left' };
  return (
    <div dir={fa ? 'rtl' : 'ltr'} className="grid h-full grid-rows-[260px_minmax(0,1fr)] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:grid-rows-1">
      <div className="relative overflow-hidden bg-[#e8e6e4]"><Portrait m={m} name={p.name} eager /></div>
      <div className="flex min-h-0 flex-col overflow-y-auto p-6 sm:p-9">
        <h3 dir="auto" translate="no" style={align} className="font-display text-[26px] font-semibold leading-tight text-ink sm:text-[32px]">{p.name}</h3>
        {p.role && <p dir="auto" style={align} className="mt-3 text-[16px] text-cyan-soft">{p.role}</p>}
        {p.bio && <p dir="auto" style={align} className="mt-5 whitespace-pre-line text-[14.5px] leading-[1.95] text-ink-muted">{p.bio}</p>}
        {m.expertise.length > 0 && (
          <div className="mt-7">
            <h4 className="text-[12px] text-ink-faint" data-no-translate={fa ? '' : undefined}>{t.expertise}</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {m.expertise.map((x) => <li key={x} dir="auto" className={`max-w-full break-words border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[13px] leading-relaxed text-cyan-soft ${x.length > 40 ? 'rounded-xl' : 'rounded-full'}`}>{x}</li>)}
            </ul>
          </div>
        )}
        {m.experience.length > 0 && (
          <div className="mt-7">
            <h4 className="flex items-center gap-2 text-[12px] text-ink-faint" data-no-translate={fa ? '' : undefined}><BriefcaseIcon className="h-3.5 w-3.5" />{t.experience}</h4>
            <Experience key={m.id} items={m.experience} reduce={reduce} />
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
              <a href={m.resume} target="_blank" rel="noreferrer" download className="inline-flex h-11 items-center gap-2 rounded-full bg-blue px-5 text-[13.5px] font-medium text-white hover:bg-blue-soft" data-no-translate={fa ? '' : undefined}>
                <DownloadIcon className="h-4 w-4" />{t.resume}
              </a>
            )}
            {m.linkedin && (
              <a href={m.linkedin} target="_blank" rel="noreferrer me" className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-[13.5px] text-ink hover:border-cyan/60">
                <LinkedinIcon className="h-4 w-4" />LinkedIn
              </a>
            )}
            {m.email && (
              <a href={`mailto:${m.email}`} dir="ltr" className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-[13.5px] text-ink hover:border-cyan/60">
                <MailIcon className="h-4 w-4" />{m.email}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function TeamSection() {
  const { team } = useContent();
  const fa = useI18n().locale === 'fa';
  const t = fa ? COPY.fa : COPY.en;
  const reduce = !!useReducedMotion();
  // An unbounded position: the ring always turns one card at a time the short
  // way, and wraps round without any card crossing the others.
  const [pos, setPos] = useState(0);
  const [open, setOpen] = useState(false);
  const count = team?.length ?? 0;
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const ring = useRef<HTMLDivElement | null>(null);
  const [cardWidth, setCardWidth] = useState(240);
  useEffect(() => {
    const el = ring.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setCardWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mod = (n: number) => (count ? ((n % count) + count) % count : 0);
  const active = mod(pos);
  /** Turn to person `i` by the shortest way round. */
  const show = useCallback((i: number) => {
    if (!count) return;
    setPos((cur) => {
      const here = ((cur % count) + count) % count;
      let d = i - here;
      if (d > count / 2) d -= count;
      if (d < -count / 2) d += count;
      return cur + d;
    });
  }, [count]);
  const next = () => setPos((v) => v + 1);
  const prev = () => setPos((v) => v - 1);

  // A link to /company#member-id opens that person's résumé.
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const i = team.findIndex((m) => m.id === id);
      if (i >= 0) { show(i); setOpen(true); document.getElementById('team')?.scrollIntoView({ block: 'start' }); }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [team, show]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!count) return null;
  const current = team[active];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Enter' && !open) setOpen(true);
  };
  const onPointerDown = (e: React.PointerEvent) => { dragStart.current = { x: e.clientX, y: e.clientY }; };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = dragStart.current;
    dragStart.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
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
      <div className="relative mx-auto max-w-shell px-5 pt-16 lg:px-10 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center" data-no-translate={fa ? '' : undefined}>
          <div className="mb-5 inline-flex items-center gap-4 font-mono text-[11px] text-cyan/80"><span className="h-px w-10 bg-cyan/40" />{t.index}<span className="h-px w-10 bg-cyan/40" /></div>
          <h2 className="font-display text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[44px]">{t.title}</h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted lg:text-[17px]">{t.lead}</p>
        </div>
      </div>

      <div className={`relative mx-auto max-w-[1500px] px-4 pb-14 pt-16 transition-[min-height] duration-500 sm:px-6 lg:px-10 lg:pb-20 ${open ? 'min-h-[min(760px,92vh)] md:min-h-[660px]' : ''}`}>
        {/* The ring runs left to right in every language, like the product slider. */}
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
          className={`relative touch-pan-y select-none outline-none transition-[opacity,visibility] duration-500 ${open ? 'pointer-events-none invisible opacity-0' : 'visible opacity-100'}`}
          style={{ perspective: '1600px' }}
        >
          <div ref={ring} className="relative mx-auto h-[290px] w-[210px] sm:h-[380px] sm:w-[280px] lg:h-[460px] lg:w-[340px]" style={{ transformStyle: 'preserve-3d' }}>
            {/* Seven places round the front one; each card keeps its place in
                the ring as it turns, and the ones coming round enter unseen. */}
            {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
              const v = pos + offset;
              const m = team[mod(v)];
              const front = offset === 0;
              const p = pick(m, fa);
              return (
                <button
                  key={v}
                  type="button"
                  tabIndex={-1}
                  aria-label={`${p.name}${p.role ? ` — ${p.role}` : ''}`}
                  onClick={() => { setPos(v); setOpen(true); }}
                  style={{ ...cardStyle(offset, cardWidth, reduce), transition: `transform .8s ${EASE}, opacity .8s ${EASE}, visibility .8s` }}
                  className={`group absolute inset-0 overflow-hidden rounded-[22px] border bg-[#070b18] text-start will-change-transform ${front ? 'border-cyan/70' : 'border-white/10'}`}
                >
                  <Portrait m={m} name={p.name} eager className="transition-transform duration-700 group-hover:scale-[1.04]" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pb-4 pt-12" dir={fa ? 'rtl' : 'ltr'}>
                    <span dir="auto" translate="no" className="block truncate text-[17px] font-semibold text-white lg:text-[19px]" style={{ textAlign: fa ? 'right' : 'left' }}>{p.name}</span>
                    {p.role && <span dir="auto" className="mt-0.5 block truncate text-[12.5px] text-cyan-soft" style={{ textAlign: fa ? 'right' : 'left' }}>{p.role}</span>}
                  </span>
                </button>
              );
            })}
          </div>

          {count > 1 && (
            <>
              <button type="button" onClick={prev} aria-label={t.prev}
                className="absolute left-0 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cyan/60 bg-space-2 text-cyan transition hover:bg-cyan hover:text-white lg:flex">
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button type="button" onClick={next} aria-label={t.next}
                className="absolute right-0 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cyan/60 bg-space-2 text-cyan transition hover:bg-cyan hover:text-white lg:flex">
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {count > 1 && (
          <div dir="ltr" className={`mt-10 flex items-center justify-center gap-5 transition-opacity ${open ? 'opacity-0' : ''}`} data-no-translate={fa ? '' : undefined}>
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

        {/* The chosen card comes forward out of the ring with the whole résumé. */}
        <AnimatePresence>
          {open && current && (
            <motion.div
              key="front"
              className="absolute inset-x-3 top-4 z-40 mx-auto max-w-[1000px] sm:inset-x-6 lg:top-6"
              style={{ perspective: 1200 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                role="dialog"
                aria-modal="false"
                aria-label={pick(current, fa).name}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.55, z: -300, rotateY: -12 }}
                animate={{ opacity: 1, scale: 1, z: 0, rotateY: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, z: -300 }}
                transition={{ type: 'spring', stiffness: 170, damping: 22 }}
                className="relative h-[min(640px,82vh)] overflow-hidden rounded-[26px] border border-line bg-space-2 shadow-[0_30px_80px_-30px_rgba(23,35,62,0.45)] md:h-[560px]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={current.id} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    <Resume m={current} fa={fa} t={t} reduce={reduce} />
                  </motion.div>
                </AnimatePresence>
                <button type="button" onClick={() => setOpen(false)} aria-label={t.close}
                  className="absolute end-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/50 text-white hover:border-cyan">
                  <XIcon className="h-5 w-5" />
                </button>
                {count > 1 && (
                  <div dir="ltr" className="absolute bottom-3 left-3 z-10 flex gap-2">
                    <button type="button" onClick={prev} aria-label={t.prev} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/50 text-white hover:border-cyan"><ChevronLeftIcon className="h-5 w-5" /></button>
                    <button type="button" onClick={next} aria-label={t.next} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/50 text-white hover:border-cyan"><ChevronRightIcon className="h-5 w-5" /></button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {open && <button type="button" aria-label={t.close} onClick={() => setOpen(false)} className="absolute inset-0 z-30 cursor-default" tabIndex={-1} />}
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
