'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useI18n } from '../../i18n';

// The brochure's line, set large, its words lighting up one after another as
// the band scrolls through the screen.
const LINE = {
  en: { lead: 'What we are', text: 'Bridging industry, process engineering and advanced AI.' },
  fa: { lead: 'آنچه هستیم', text: 'پل ارتباطی میان صنعت، مهندسی فرآیند و هوش مصنوعی پیشرفته.' },
};
const ACCENT = /^(AI|advanced|هوش|مصنوعی|پیشرفته\.?|AI\.)$/;

function Word({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const start = i / n;
  const opacity = useTransform(progress, [start * 0.8, (start + 1 / n) * 0.8 + 0.05], [0.14, 1]);
  const y = useTransform(progress, [start * 0.8, (start + 1 / n) * 0.8 + 0.05], [14, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${ACCENT.test(word.replace(/[.,،]/g, '')) ? 'text-transparent [-webkit-background-clip:text] [background-clip:text] [background-image:linear-gradient(92deg,#7ce6f7,#e8b65a)]' : ''}`}>
      {word}&nbsp;
    </motion.span>
  );
}

export function StatementBand() {
  const fa = useI18n().locale === 'fa';
  const copy = fa ? LINE.fa : LINE.en;
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = copy.text.split(' ');
  const glow = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  return (
    <section ref={ref} className="relative overflow-hidden border-b border-line bg-space-0" data-no-translate={fa ? '' : undefined}>
      <motion.div aria-hidden style={{ x: glow }} className="pointer-events-none absolute inset-y-0 left-1/4 w-1/2 bg-[radial-gradient(closest-side,rgba(43,107,255,.18),transparent)]" />
      <div className="relative mx-auto max-w-5xl px-5 py-28 text-center lg:py-40">
        <div className="mb-8 inline-flex items-center gap-3 text-[12px] text-gold"><span className="h-px w-8 bg-gold/50" />{copy.lead}<span className="h-px w-8 bg-gold/50" /></div>
        <p className="font-display text-[32px] font-semibold leading-[1.45] tracking-tight text-ink sm:text-[46px] lg:text-[60px]">
          {words.map((w, i) => <Word key={i} word={w} i={i} n={words.length} progress={scrollYProgress} />)}
        </p>
      </div>
    </section>
  );
}
