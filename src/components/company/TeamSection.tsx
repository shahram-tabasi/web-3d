'use client';

// The team, with each person's résumé.
//
// Desktop: a row of tall portrait panels; the one under the pointer (or
// keyboard focus) widens and comes into colour, showing the role and a line
// of the bio. Phone: the same cards in a swipeable strip. Choosing a person
// opens their résumé sheet, the portrait carried across with a shared-layout
// animation (framer-motion layoutId).

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRightIcon, BriefcaseIcon, DownloadIcon, GraduationCapIcon, LinkedinIcon, MailIcon, XIcon } from 'lucide-react';
import { useContent } from '../../content/ContentProvider';
import { useI18n } from '../../i18n';
import type { TeamMember } from '../../content/types';

const COPY = {
  en: {
    index: 'TEAM',
    title: 'The people behind Simorgh',
    lead: 'Electrical, process and software engineers, and the AI researchers who work beside them.',
    open: 'View résumé',
    resume: 'Download résumé (PDF)',
    expertise: 'Expertise',
    experience: 'Experience',
    education: 'Education',
    close: 'Close',
    join: 'Want to work with this team?',
    joinCta: 'Get in touch',
  },
  fa: {
    index: 'تیم ما',
    title: 'افرادی که سیمرغ را می‌سازند',
    lead: 'مهندسان برق، فرآیند و نرم‌افزار، و پژوهشگران هوش مصنوعی که کنار آن‌ها کار می‌کنند.',
    open: 'مشاهده رزومه',
    resume: 'دریافت رزومه (PDF)',
    expertise: 'تخصص‌ها',
    experience: 'سوابق کاری',
    education: 'تحصیلات',
    close: 'بستن',
    join: 'می‌خواهید با این تیم همکاری کنید؟',
    joinCta: 'با ما در تماس باشید',
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

/** The portrait, or a monogram on the brand's night-blue when there is no photo yet. */
function Portrait({ m, name, className = '', sizes, side }: {
  m: TeamMember; name: string; className?: string; sizes?: string;
  /** Show the whole portrait at this side of a wide box, fading into it, instead of filling the box. */
  side?: 'left' | 'right';
}) {
  if (m.photo) {
    if (side) {
      // The image box is the photo itself, so its inner edge can fade into the card.
      const fade = `linear-gradient(to ${side === 'right' ? 'left' : 'right'}, #000 70%, transparent)`;
      return (
        <img src={m.photo} alt={name} sizes={sizes} loading="lazy" decoding="async"
          style={{ maskImage: fade, WebkitMaskImage: fade }}
          className={`absolute bottom-0 h-full w-auto max-w-none ${side === 'right' ? 'right-0' : 'left-0'} ${className}`} />
      );
    }
    return <img src={m.photo} alt={name} sizes={sizes} loading="lazy" decoding="async" style={{ objectFit: 'cover', objectPosition: '50% 18%' }} className={`h-full w-full ${className}`} />;
  }
  return (
    <div className={`relative grid h-full w-full place-items-center overflow-hidden bg-[radial-gradient(120%_90%_at_30%_10%,#1d3570_0%,#0b1226_55%,#060a16_100%)] ${className}`} role="img" aria-label={name}>
      <img src="/brand/mark-light.png" alt="" aria-hidden className="absolute -bottom-6 -end-8 w-[85%] opacity-[0.07]" />
      <span className="font-display text-5xl font-semibold tracking-tight text-ink/80">{initials(m)}</span>
    </div>
  );
}

export function TeamSection() {
  const { team } = useContent();
  const { locale } = useI18n();
  const fa = locale === 'fa';
  const t = fa ? COPY.fa : COPY.en;
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    // Back to the card that opened the sheet, for keyboard users.
    requestAnimationFrame(() => opener.current?.focus());
  }, []);

  // A link to /company#member-id opens that person's résumé.
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (team.some((m) => m.id === id)) setOpen(id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [team]);

  if (!team?.length) return null;
  const current = team.find((m) => m.id === open);

  const show = (m: TeamMember, el: HTMLElement) => {
    opener.current = el;
    setOpen(m.id);
  };

  return (
    <section id="team" className="relative scroll-mt-24 border-b border-line bg-space-0" data-no-translate={fa ? '' : undefined}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(43,107,255,.14),transparent)]" />
      <div className="relative mx-auto max-w-shell px-5 py-20 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3 font-mono text-[11px] text-cyan/80">
              <span>{t.index}</span><span className="h-px w-10 bg-cyan/30" />
            </div>
            <h2 className="font-display text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[44px]">{t.title}</h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted lg:text-[17px]">{t.lead}</p>
          </div>
          <span className="font-mono text-[11px] tracking-label text-ink-faint" aria-hidden>
            {String(team.length).padStart(2, '0')} / {fa ? 'نفر' : 'PEOPLE'}
          </span>
        </div>

        {/* Desktop: expanding portrait panels. */}
        <ul className="mt-14 hidden h-[540px] gap-3 lg:flex">
          {team.map((m, i) => {
            const p = pick(m, fa);
            const on = i === active;
            // Open, a photo stands whole at the far side and the words take the near side.
            const wide = on && !!m.photo;
            return (
              <li
                key={m.id}
                id={m.id}
                onMouseEnter={() => setActive(i)}
                className={`group relative min-w-0 overflow-hidden rounded-[22px] border transition-[flex-grow,border-color] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${on ? 'grow-[4] border-cyan/40' : 'grow border-line'} ${wide ? 'bg-[radial-gradient(90%_100%_at_70%_30%,#1b3466_0%,#0b182e_60%,#070d1c_100%)]' : ''}`}
                style={{ flexBasis: 0 }}>
                <button
                  type="button"
                  onFocus={() => setActive(i)}
                  onClick={(e) => show(m, e.currentTarget)}
                  aria-label={`${p.name}${p.role ? ` — ${p.role}` : ''}: ${t.open}`}
                  className="absolute inset-0 block h-full w-full text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-inset">
                  <motion.div layoutId={reduce ? undefined : `photo-${m.id}`} className="absolute inset-0">
                    <Portrait m={m} name={p.name} sizes="(min-width:1024px) 40vw, 80vw" side={wide ? (fa ? 'left' : 'right') : undefined}
                      className={`transition-[filter,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${on ? 'scale-100 grayscale-0' : 'scale-[1.06] grayscale brightness-[.7]'}`} />
                  </motion.div>
                  <div className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-[#04060e] via-[#04060e]/35 to-transparent ${wide ? 'opacity-0' : 'opacity-100'}`} />
                  {/* Collapsed: the name runs up the panel. */}
                  <span className={`absolute inset-x-0 bottom-7 flex justify-center transition-opacity duration-300 ${on ? 'opacity-0' : 'opacity-100 delay-200'}`}>
                    <span className="max-h-[300px] overflow-hidden whitespace-nowrap font-display text-[15px] font-medium text-ink/90 [writing-mode:vertical-rl]">{p.name}</span>
                  </span>
                  {/* Expanded: a glass caption. */}
                  <span className={`absolute bottom-4 start-4 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl transition-[opacity,transform] duration-500 ${wide ? 'w-[46%]' : 'end-4'} ${on ? 'translate-y-0 opacity-100 delay-200' : 'pointer-events-none translate-y-4 opacity-0'}`}>
                    <span className="block font-display text-[22px] font-semibold leading-tight text-ink">{p.name}</span>
                    {p.role && <span className="mt-1.5 block text-[13px] text-cyan-soft">{p.role}</span>}
                    {p.bio && <span className="mt-3 line-clamp-3 block max-w-md text-[13.5px] leading-relaxed text-ink-muted">{p.bio}</span>}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-gold">
                      {t.open}<ArrowUpRightIcon className="h-3.5 w-3.5 rtl:-scale-x-100" />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Phone and tablet: a swipeable strip. */}
        <ul className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] lg:hidden">
          {team.map((m) => {
            const p = pick(m, fa);
            return (
              <li key={m.id} className="w-[78%] max-w-[340px] shrink-0 snap-start">
                <button type="button" onClick={(e) => show(m, e.currentTarget)} className="relative block aspect-[4/5] w-full overflow-hidden rounded-[20px] border border-line text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan">
                  <motion.div layoutId={reduce ? undefined : `photo-m-${m.id}`} className="absolute inset-0"><Portrait m={m} name={p.name} sizes="80vw" /></motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04060e] via-transparent to-transparent" />
                  <span className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
                    <span className="block font-display text-[18px] font-semibold text-ink">{p.name}</span>
                    {p.role && <span className="mt-1 block text-[12.5px] text-cyan-soft">{p.role}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <AnimatePresence>
        {current && <ResumeSheet m={current} fa={fa} t={t} reduce={!!reduce} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}

function ResumeSheet({ m, fa, t, reduce, onClose }: { m: TeamMember; fa: boolean; t: typeof COPY.en; reduce: boolean; onClose: () => void }) {
  const p = pick(m, fa);
  const panel = useRef<HTMLDivElement>(null);
  const [desktop, setDesktop] = useState(true);

  useEffect(() => {
    setDesktop(window.matchMedia('(min-width: 1024px)').matches);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-[#02040a]/80 backdrop-blur-md" onClick={onClose} aria-hidden />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={p.name}
        tabIndex={-1}
        dir={fa ? 'rtl' : 'ltr'}
        initial={reduce ? false : { y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { y: 30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="relative grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-t-[28px] border border-line bg-space-1 shadow-[0_40px_120px_rgba(0,0,0,.6)] focus:outline-none sm:rounded-[28px] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative h-64 md:h-auto md:min-h-[560px]">
          <motion.div layoutId={reduce ? undefined : `photo-${desktop ? '' : 'm-'}${m.id}`} className="absolute inset-0"><Portrait m={m} name={p.name} sizes="40vw" /></motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-space-1 via-transparent to-transparent md:bg-gradient-to-l md:rtl:bg-gradient-to-r" />
        </div>

        <div className="overflow-y-auto p-7 sm:p-10">
          <button type="button" onClick={onClose} aria-label={t.close} className="absolute end-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/40 text-ink backdrop-blur hover:border-cyan/50">
            <XIcon className="h-5 w-5" strokeWidth={1.6} />
          </button>
          <h3 className="font-display text-[30px] font-semibold leading-tight text-ink">{p.name}</h3>
          {fa ? (m.name && <p className="mt-1 text-[13px] text-ink-faint"><bdi>{m.name}</bdi></p>) : (m.nameFa && <p className="mt-1 text-[13px] text-ink-faint"><bdi>{m.nameFa}</bdi></p>)}
          {p.role && <p className="mt-3 text-[15px] text-cyan-soft">{p.role}</p>}
          {p.bio && <p className="mt-6 whitespace-pre-line text-[15px] leading-[1.9] text-ink-muted">{p.bio}</p>}

          {m.expertise.length > 0 && (
            <div className="mt-8">
              <h4 className="font-mono text-[11px] tracking-label text-ink-faint">{t.expertise}</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {m.expertise.map((x) => <li key={x} className="rounded-full border border-cyan/25 bg-cyan/[0.06] px-3 py-1 text-[12.5px] text-cyan-soft">{x}</li>)}
              </ul>
            </div>
          )}

          {m.experience.length > 0 && (
            <div className="mt-8">
              <h4 className="flex items-center gap-2 font-mono text-[11px] tracking-label text-ink-faint"><BriefcaseIcon className="h-3.5 w-3.5" />{t.experience}</h4>
              <Experience items={m.experience} fa={fa} reduce={reduce} />
            </div>
          )}

          {m.education && (
            <div className="mt-8">
              <h4 className="flex items-center gap-2 font-mono text-[11px] tracking-label text-ink-faint"><GraduationCapIcon className="h-3.5 w-3.5" />{t.education}</h4>
              <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-ink-muted">{m.education}</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-2.5">
            {m.resume && (
              <a href={m.resume} target="_blank" rel="noreferrer" download className="inline-flex h-11 items-center gap-2 rounded-full bg-blue px-5 text-[13.5px] font-medium text-white hover:bg-blue-soft">
                <DownloadIcon className="h-4 w-4" />{t.resume}
              </a>
            )}
            {m.linkedin && (
              <a href={m.linkedin} target="_blank" rel="noreferrer me" className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-[13.5px] text-ink hover:border-cyan/60">
                <LinkedinIcon className="h-4 w-4" />LinkedIn
              </a>
            )}
            {m.email && (
              <a href={`mailto:${m.email}`} className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-[13.5px] text-ink hover:border-cyan/60" dir="ltr">
                <MailIcon className="h-4 w-4" />{m.email}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
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
function Experience({ items, fa, reduce }: { items: TeamMember['experience']; fa: boolean; reduce: boolean }) {
  const years = items.map((x) => yearsOf(x.period));
  const max = Math.max(0, ...years.map((y) => y ?? 0));
  if (max > 0 && years.every((y) => y !== null)) {
    return (
      <ul className="mt-4 grid gap-4">
        {items.map((x, i) => (
          <li key={i}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[14.5px] text-ink">{x.title}</span>
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
          <div className="text-[14.5px] text-ink">{x.title}</div>
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
