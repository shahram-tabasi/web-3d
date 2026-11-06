'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from '../layout/LocaleLink';
import { Icon } from '../ui/Icon';
import { Tilt } from '../fx/Tilt';
import { TARGET_INDUSTRIES, pickBi } from '../../data/brochure';
import { useI18n } from '../../i18n';

// Where the company works: the four target industries from the brochure, each
// opening its own page. (The band of running keywords is gone: motion for nothing.)
export function IndustriesBand() {
  const fa = useI18n().locale === 'fa';
  return (
    <section className="relative overflow-hidden border-y border-line bg-space-0" data-no-translate={fa ? '' : undefined}>
      <div className="mx-auto max-w-shell px-5 py-20 lg:px-10 lg:py-24">
        <div className="mb-5 flex items-center gap-3 text-[12px] text-cyan/80"><span>{fa ? 'صنایع هدف' : 'INDUSTRIES'}</span><span className="h-px w-10 bg-cyan/30" /></div>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{fa ? 'کجا کنار شما هستیم' : 'Where we work'}</h2>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TARGET_INDUSTRIES.map((x, i) => (
            <motion.li
              key={x.to}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <Tilt className="h-full rounded-[18px]">
              <Link href={x.to} className="group flex h-full flex-col rounded-[18px] border border-line bg-space-0/60 p-6 transition-[border-color,background-color] duration-300 hover:border-cyan/40 hover:bg-space-2/60">
                <span className="flex items-center justify-between">
                  <Icon name={x.icon} className="h-7 w-7 text-gold" strokeWidth={1.3} />
                  <ArrowUpRightIcon className="h-4 w-4 text-ink-faint transition-[color,transform] group-hover:-translate-y-0.5 group-hover:text-cyan rtl:-scale-x-100" />
                </span>
                <span className="mt-8 text-[16.5px] font-semibold leading-snug text-ink">{pickBi(x.title, fa)}</span>
                {x.note && <span className="mt-2 text-[13.5px] text-ink-faint">{pickBi(x.note, fa)}</span>}
              </Link>
              </Tilt>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
