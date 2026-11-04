'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, GlobeIcon, MailIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { ABOUT, pickBi } from '../../data/brochure';
import { useI18n } from '../../i18n';
import { useContent } from '../../content/ContentProvider';

// Who we are and what we believe, then the way to reach us: the brochure's
// first and last panels.
export function AboutCTA() {
  const fa = useI18n().locale === 'fa';
  const { settings } = useContent();
  const email = settings.email || 'info@simorghai.com';
  const sales = settings.notifyEmail?.split(',')[0]?.trim() || 'sales@simorghai.com';
  return (
    <section className="relative overflow-hidden bg-space-0" data-no-translate={fa ? '' : undefined}>
      <div aria-hidden className="sim-aurora pointer-events-none absolute -inset-x-1/4 top-[20%] h-[60%] opacity-40" />
      <div className="relative mx-auto grid max-w-shell gap-14 px-5 py-24 lg:grid-cols-[1.25fr_1fr] lg:gap-20 lg:px-10 lg:py-32">
        <div>
          <div className="mb-5 flex items-center gap-3 text-[12px] text-cyan/80"><span>{fa ? 'درباره ما' : 'ABOUT US'}</span><span className="h-px w-10 bg-cyan/30" /></div>
          <h2 className="font-display text-3xl font-semibold leading-[1.3] tracking-tight text-ink sm:text-4xl lg:text-[44px]">
            {fa ? <>دانش عمیق صنعتی،<br />هوش مصنوعی کاربردی</> : <>Deep industrial knowledge,<br />practical AI</>}
          </h2>
          <p className="mt-6 max-w-2xl text-[16px] leading-[2] text-ink-muted">{pickBi(ABOUT.lead, fa)}</p>

          <motion.blockquote
            initial={{ opacity: 0, x: fa ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 border-s-2 border-gold ps-6"
          >
            <span className="text-[12px] text-gold">{fa ? 'باور ما' : 'What we believe'}</span>
            <p className="mt-3 text-[18px] font-medium leading-[1.9] text-ink lg:text-[20px]">{pickBi(ABOUT.belief, fa)}</p>
          </motion.blockquote>

          <ul className="mt-10 grid gap-3 sm:grid-cols-3">
            {ABOUT.points.map((p) => (
              <li key={p.en} className="flex items-start gap-3 text-[14px] leading-relaxed text-ink-muted">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />{pickBi(p, fa)}
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="self-center rounded-[28px] border border-white/10 bg-gradient-to-b from-space-2/90 to-space-1/95 p-8 shadow-[0_30px_90px_rgba(0,0,0,.45)] lg:p-10"
        >
          <img src="/brand/mark-light.png" alt="" aria-hidden className="h-14 w-auto" />
          <h3 className="mt-7 text-[26px] font-semibold text-ink">{fa ? 'با ما در ارتباط باشید' : 'Let’s talk'}</h3>
          <p className="mt-3 text-[15px] leading-[1.9] text-ink-muted">
            {fa ? 'برای توسعه‌ی همکاری‌های راهبردی و دریافت مشاوره‌ی تخصصی، با ما تماس بگیرید.' : 'For a strategic partnership or specialist advice, get in touch.'}
          </p>
          <ul className="mt-7 grid gap-3 text-[14.5px]" dir="ltr">
            <li><a href={`mailto:${email}`} className="flex items-center gap-3 text-ink hover:text-cyan-soft"><MailIcon className="h-4 w-4 text-cyan" />{email}</a></li>
            <li><a href={`mailto:${sales}`} className="flex items-center gap-3 text-ink hover:text-cyan-soft"><MailIcon className="h-4 w-4 text-cyan" />{sales}</a></li>
            <li className="flex items-center gap-3 text-ink-muted"><GlobeIcon className="h-4 w-4 text-cyan" />simorghai.com</li>
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/request-demo" size="lg">
              {fa ? 'درخواست مشاوره' : 'Ask for a consultation'}
              <ArrowRightIcon className="h-4 w-4 rtl:-scale-x-100" strokeWidth={1.6} />
            </Button>
            <Button to="/contact" size="lg" variant="outline">{fa ? 'تماس' : 'Contact'}</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
