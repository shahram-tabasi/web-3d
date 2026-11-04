'use client';

// The team, one person at a time, paged like the product slider: arrows,
// dots, a row of faces to jump to anyone, swipe on touch screens and the
// arrow keys. Each page is the person's résumé in full: the portrait as it
// was taken (never cropped to a band or tinted), name, role, bio, expertise,
// experience by role and years, education and the résumé file.
//
// Text the admin types may be in either language whatever page it sits on,
// so each piece takes its own direction (dir="auto") and stays in its box.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion';
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

const SWIPE = 60;

export function TeamSection() {
  const { team } = useContent();
  const fa = useI18n().locale === 'fa';
  const t = fa ? COPY.fa : COPY.en;
  const reduce = !!useReducedMotion();
  const [[index, dir], setPage] = useState<[number, number]>([0, 0]);
  const count = team?.length ?? 0;

  const go = useCallback((n: number, d?: number) => {
    if (!count) return;
    setPage(([cur]) => {
      const next = ((n % count) + count) % count;
      return [next, d ?? (next > cur ? 1 : -1)];
    });
  }, [count]);
  const next = () => go(index + 1, 1);
  const prev = () => go(index - 1, -1);

  // A link to /company#member-id opens on that person.
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const i = team.findIndex((m) => m.id === id);
      if (i >= 0) { setPage([i, 0]); document.getElementById('team')?.scrollIntoView({ block: 'start' }); }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [team]);

  const stage = useRef<HTMLDivElement | null>(null);
  const align: React.CSSProperties = { textAlign: fa ? 'right' : 'left' };
  if (!count) return null;
  const m = team[index];
  const p = pick(m, fa);

  // In right-to-left pages "next" lies to the left: arrows, keys and swipes follow the reading direction.
  const forward = fa ? -1 : 1;
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') (forward === 1 ? next : prev)();
    if (e.key === 'ArrowLeft') (forward === 1 ? prev : next)();
  };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE) (forward === 1 ? next : prev)();
    else if (info.offset.x > SWIPE) (forward === 1 ? prev : next)();
  };
  const slide = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * forward * 80 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : -d * forward * 80 }),
  };

  return (
    <section id="team" className="relative scroll-mt-20 border-b border-line bg-space-0">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(43,107,255,.14),transparent)]" />
      <div className="relative mx-auto max-w-shell px-5 py-20 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" data-no-translate={fa ? '' : undefined}>
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3 font-mono text-[11px] text-cyan/80"><span>{t.index}</span><span className="h-px w-10 bg-cyan/30" /></div>
            <h2 className="font-display text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[44px]">{t.title}</h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted lg:text-[17px]">{t.lead}</p>
          </div>
          {/* Faces: jump to anyone. */}
          {count > 1 && (
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label={t.index}>
              {team.map((x, i) => (
                <button key={x.id} type="button" role="tab" aria-selected={i === index} aria-label={pick(x, fa).name} title={pick(x, fa).name} onClick={() => go(i)}
                  className={`relative h-12 w-12 overflow-hidden rounded-full border-2 transition-[transform,border-color,opacity] duration-300 ${i === index ? 'scale-110 border-gold opacity-100' : 'border-white/10 opacity-60 hover:opacity-100'}`}>
                  <span className="absolute inset-0 [&_span]:text-[15px]"><Portrait m={x} name={pick(x, fa).name} /></span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={stage} tabIndex={0} onKeyDown={onKey} aria-roledescription="carousel" aria-label={t.title}
          className="relative mt-12 outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 rounded-[28px]">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.article
              key={m.id}
              id={m.id}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              drag={count > 1 && !reduce ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={onDragEnd}
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${count}: ${p.name}`}
              className="grid cursor-grab touch-pan-y select-none overflow-hidden rounded-[28px] border border-cyan/25 bg-space-1/95 shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)] active:cursor-grabbing md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
            >
              {/* The portrait, whole and untinted. */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e8e6e4] md:aspect-auto md:min-h-[560px]">
                <Portrait m={m} name={p.name} eager />
              </div>

              <div className="flex max-h-none flex-col p-7 sm:p-10 md:max-h-[640px] md:overflow-y-auto">
                <h3 dir="auto" style={align} className="font-display text-[30px] font-semibold leading-tight text-ink lg:text-[36px]">{p.name}</h3>
                {p.other && <p dir="auto" style={align} className="mt-1.5 text-[14px] text-ink-faint">{p.other}</p>}
                {p.role && <p dir="auto" style={align} className="mt-3 text-[16px] text-cyan-soft">{p.role}</p>}
                {p.bio && <p dir="auto" style={align} className="mt-6 whitespace-pre-line text-[15px] leading-[1.95] text-ink-muted">{p.bio}</p>}

                {m.expertise.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-[12px] text-ink-faint" data-no-translate={fa ? '' : undefined}>{t.expertise}</h4>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {m.expertise.map((x) => <li key={x} dir="auto" className="rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[13px] text-cyan-soft">{x}</li>)}
                    </ul>
                  </div>
                )}

                {m.experience.length > 0 && (
                  <div className="mt-8">
                    <h4 className="flex items-center gap-2 text-[12px] text-ink-faint" data-no-translate={fa ? '' : undefined}><BriefcaseIcon className="h-3.5 w-3.5" />{t.experience}</h4>
                    <Experience key={m.id} items={m.experience} reduce={reduce} />
                  </div>
                )}

                {m.education && (
                  <div className="mt-8">
                    <h4 className="flex items-center gap-2 text-[12px] text-ink-faint" data-no-translate={fa ? '' : undefined}><GraduationCapIcon className="h-3.5 w-3.5" />{t.education}</h4>
                    <p dir="auto" className="mt-3 whitespace-pre-line text-[14px] style={align} leading-relaxed text-ink-muted">{m.education}</p>
                  </div>
                )}

                {(m.resume || m.linkedin || m.email) && (
                  <div className="mt-auto flex flex-wrap gap-2.5 pt-10">
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
            </motion.article>
          </AnimatePresence>

          {count > 1 && (
            <>
              <button type="button" onClick={prev} aria-label={t.prev}
                className="absolute start-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cyan/50 bg-space-1 text-cyan shadow-[0_0_30px_rgba(42,211,240,.15)] transition hover:bg-cyan hover:text-space-0 lg:flex ltr:-translate-x-1/2 rtl:translate-x-1/2">
                {fa ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
              </button>
              <button type="button" onClick={next} aria-label={t.next}
                className="absolute end-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cyan/50 bg-space-1 text-cyan shadow-[0_0_30px_rgba(42,211,240,.15)] transition hover:bg-cyan hover:text-space-0 lg:flex ltr:translate-x-1/2 rtl:-translate-x-1/2">
                {fa ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
              </button>
            </>
          )}
        </div>

        {count > 1 && (
          <div className="mt-8 flex items-center justify-center gap-5" data-no-translate={fa ? '' : undefined}>
            <button type="button" onClick={prev} aria-label={t.prev} className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-muted hover:text-cyan lg:hidden">
              {fa ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              {team.map((x, i) => (
                <button key={x.id} type="button" onClick={() => go(i)} aria-label={pick(x, fa).name}
                  className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-cyan' : 'w-2 bg-white/25 hover:bg-white/50'}`} />
              ))}
            </div>
            <span className="font-mono text-[11px] tabular-nums text-ink-faint">
              {fa ? `${(index + 1).toLocaleString('fa-IR')} / ${count.toLocaleString('fa-IR')}` : `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`}
            </span>
            <button type="button" onClick={next} aria-label={t.next} className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-muted hover:text-cyan lg:hidden">
              {fa ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
            </button>
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
          <div dir="auto" className="text-[14.5px] text-ink">{x.title}</div>
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
