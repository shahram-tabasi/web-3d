'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import Link from '../layout/LocaleLink';
import { ArticleCard } from '../insights/ArticleCard';
import { TopicTabs, countByTopic } from '../insights/TopicTabs';
import { useContent } from '../../content/ContentProvider';
import { useI18n } from '../../i18n';
import { topicOf } from '../../data/topics';

// The latest from the knowledge centre, by topic.
export function InsightsSection() {
  const { articles } = useContent();
  const fa = useI18n().locale === 'fa';
  const [topic, setTopic] = useState('all');
  const counts = useMemo(() => countByTopic(articles, (a) => topicOf(a).key), [articles]);
  const shown = (topic === 'all' ? articles : articles.filter((a) => topicOf(a).key === topic)).slice(0, 3);
  if (!articles.length) return null;
  return (
    <section className="relative border-t border-line bg-space-0">
      <div className="mx-auto max-w-shell px-5 py-24 lg:px-10 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" data-no-translate={fa ? '' : undefined}>
          <div>
            <div className="mb-5 flex items-center gap-3 text-[12px] text-cyan/80"><span>{fa ? 'مرکز دانش' : 'KNOWLEDGE CENTRE'}</span><span className="h-px w-10 bg-cyan/30" /></div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{fa ? 'مقالات و تجربه‌ها' : 'Articles and lessons learned'}</h2>
          </div>
          <Link href="/insights" className="group inline-flex items-center gap-2 text-[14px] text-cyan-soft">
            {fa ? 'همه‌ی مقالات' : 'All articles'}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" strokeWidth={1.6} />
          </Link>
        </div>
        <div className="mt-10"><TopicTabs id="home" value={topic} onChange={setTopic} counts={counts} fa={fa} hideEmpty /></div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((a, i) => (
              <motion.div key={a.slug} layout initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}>
                <ArticleCard item={a} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
