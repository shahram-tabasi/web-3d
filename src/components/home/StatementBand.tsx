'use client';

import React from 'react';
import { useI18n } from '../../i18n';

// The brochure's line, set large and still; the AI words in lapis.
const LINE = {
  en: { lead: 'What we are', text: 'Bridging industry, process engineering and advanced AI.' },
  fa: { lead: 'آنچه هستیم', text: 'پل ارتباطی میان صنعت، مهندسی فرآیند و هوش مصنوعی پیشرفته.' },
};
const ACCENT = /^(AI|advanced|هوش|مصنوعی|پیشرفته\.?|AI\.)$/;

export function StatementBand() {
  const fa = useI18n().locale === 'fa';
  const copy = fa ? LINE.fa : LINE.en;
  const words = copy.text.split(' ');
  return (
    <section className="border-b border-line bg-space-0" data-no-translate={fa ? '' : undefined}>
      <div className="mx-auto max-w-4xl px-5 py-20 text-center lg:py-24">
        <p className="mb-5 text-[14px] font-medium text-gold">{copy.lead}</p>
        <p className="font-display text-[28px] font-semibold leading-[1.55] tracking-tight text-ink sm:text-[38px] lg:text-[44px]">
          {words.map((w, i) => (
            <span key={i} className={ACCENT.test(w.replace(/[.,،]/g, '')) ? 'text-blue' : ''}>{w}{i < words.length - 1 ? ' ' : ''}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
