'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import Link from '../layout/LocaleLink';
import { Icon } from '../ui/Icon';
import { GlowGrid } from './GlowGrid';
import { SERVICES, pickBi } from '../../data/brochure';
import { useI18n } from '../../i18n';

const toFa = (n: number) => (n).toLocaleString('fa-IR');

// The five things the company does, as on the brochure: numbered, short, one
// line each. Three across, then two wider ones, so the row ends cleanly.
export function ServicesSection({ more = true }: { more?: boolean }) {
  const fa = useI18n().locale === 'fa';
  return (
    <section id="services" className="relative scroll-mt-20 bg-space-0" data-no-translate={fa ? '' : undefined}>
      <div className="mx-auto max-w-shell px-5 py-24 lg:px-10 lg:py-32">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3 text-[12px] text-cyan/80"><span>{fa ? 'محورهای فعالیت' : 'WHAT WE DO'}</span><span className="h-px w-10 bg-cyan/30" /></div>
            <h2 className="font-display text-3xl font-semibold leading-[1.2] tracking-tight text-ink sm:text-4xl lg:text-[46px]">
              {fa ? 'پنج محور کلیدی' : 'Five things we do well'}
            </h2>
          </div>
          {more && <Link href="/solutions" className="group inline-flex items-center gap-2 text-[14px] text-cyan-soft">
            {fa ? 'جزئیات خدمات' : 'Services in detail'}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={1.6} />
          </Link>}
        </div>

        <GlowGrid className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.icon}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`sim-glow-card group rounded-[20px] bg-space-1/90 p-7 transition-colors duration-300 hover:bg-space-2/80 lg:p-8 ${i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'}`}
            >
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan/20 bg-cyan/[0.06] text-cyan transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <span className="font-display text-[44px] font-bold leading-none text-gold/80">{fa ? toFa(i + 1) : String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-7 text-[19px] font-semibold text-ink">{pickBi(s.title, fa)}</h3>
              <p className="mt-3 text-[14.5px] leading-[1.9] text-ink-muted">{pickBi(s.body, fa)}</p>
            </motion.article>
          ))}
        </GlowGrid>
      </div>
    </section>
  );
}
