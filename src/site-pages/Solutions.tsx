'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from '../components/layout/LocaleLink';
import { PageHero } from '../components/ui/PageHero';
import { Icon } from '../components/ui/Icon';
import { ServicesSection } from '../components/home/ServicesSection';
import { AboutCTA } from '../components/home/AboutCTA';
import { useContent } from '../content/ContentProvider';
import { useI18n } from '../i18n';
import { PLATFORMS, pickBi } from '../data/brochure';

// Services: the five areas of work and the three platforms they are built on,
// as on the brochure.
export function Solutions() {
  const { pages } = useContent();
  const fa = useI18n().locale === 'fa';
  return (
    <>
      <div data-no-translate={fa ? '' : undefined}>
        <PageHero
          eyebrow={fa ? 'خدمات' : 'SERVICES'}
          title={fa ? 'از عارضه‌یابی تا سیستمی که کار می‌کند' : 'From diagnosis to a system that works'}
          lead={fa
            ? 'مشاوره، مهندسی فرآیند، نرم‌افزار و هوش مصنوعی صنعتی؛ یک تیم، از اولین جلسه تا راه‌اندازی در محل شما.'
            : 'Consulting, process engineering, software and industrial AI — one team, from the first meeting to commissioning on your site.'}
          crumbs={[{ label: fa ? 'خدمات' : 'Services' }]}
          image={pages.solutions.heroImage}
          flip={pages.solutions.heroFlip} />
      </div>

      <ServicesSection more={false} />

      <section className="border-t border-line bg-space-1/70" data-no-translate={fa ? '' : undefined}>
        <div className="mx-auto max-w-shell px-5 py-24 lg:px-10 lg:py-28">
          <div className="mb-5 flex items-center gap-3 text-[12px] text-cyan/80"><span>{fa ? 'حوزه‌های تخصصی' : 'PLATFORMS'}</span><span className="h-px w-10 bg-cyan/30" /></div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{fa ? 'پلتفرم‌ها و راهکارها' : 'Platforms and solutions'}</h2>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {PLATFORMS.map((p, i) => (
              <motion.article
                key={p.icon}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col rounded-[20px] border border-line bg-space-0/70 p-7 lg:p-8"
              >
                <Icon name={p.icon} className="h-7 w-7 text-cyan" strokeWidth={1.3} />
                <h3 className="mt-6 text-[19px] font-semibold text-ink">{pickBi(p.title, fa)}</h3>
                <p className="mt-3 text-[14.5px] leading-[1.9] text-ink-muted">{pickBi(p.body, fa)}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-7" dir="ltr">
                  {p.examples.map((x) => x.to ? (
                    <Link key={x.label} href={x.to} className="rounded-full border border-cyan/30 bg-cyan/[0.06] px-3 py-1.5 font-mono text-[11px] tracking-wide text-cyan-soft transition-colors hover:border-cyan hover:text-white">{x.label}</Link>
                  ) : (
                    <span key={x.label} className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-ink-faint">{x.label}</span>
                  ))}
                </div>
                {p.examples[0]?.note && <p className="mt-3 text-[13px] text-ink-faint">{pickBi(p.examples[0].note, fa)}</p>}
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <AboutCTA />
    </>);

}
