'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { PageHero } from '../components/ui/PageHero';
import { Icon } from '../components/ui/Icon';
import { Tilt } from '../components/fx/Tilt';
import { ArticleCard } from '../components/insights/ArticleCard';
import { TopicTabs, countByTopic } from '../components/insights/TopicTabs';
import { useContent } from '../content/ContentProvider';
import { useI18n } from '../i18n';
import { FORMATS, TOPICS, topicOf } from '../data/topics';

// The knowledge centre, arranged so nobody gets lost: the topics first, each
// with what it covers and how many pieces it holds; then one bar to narrow by
// topic, format and words; the newest piece large, the rest in a grid.
export function Insights() {
  const { pages, articles } = useContent();
  const fa = useI18n().locale === 'fa';
  const [topic, setTopic] = useState('all');
  const [format, setFormat] = useState('all');
  const [query, setQuery] = useState('');

  // /insights?topic=industrial-ai opens on that topic.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('topic');
    if (t && TOPICS.some((x) => x.key === t)) setTopic(t);
  }, []);
  const choose = (t: string) => {
    setTopic(t);
    const url = new URL(window.location.href);
    if (t === 'all') url.searchParams.delete('topic'); else url.searchParams.set('topic', t);
    window.history.replaceState(null, '', url);
  };

  const counts = useMemo(() => countByTopic(articles, (a) => topicOf(a).key), [articles]);
  const formats = useMemo(() => Array.from(new Set(articles.map((a) => a.kind))), [articles]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) =>
      (topic === 'all' || topicOf(a).key === topic) &&
      (format === 'all' || a.kind === format) &&
      (!q || `${a.title} ${a.excerpt}`.toLowerCase().includes(q)));
  }, [articles, topic, format, query]);
  const [featured, ...rest] = filtered;

  return (
    <>
      <div data-no-translate={fa ? '' : undefined}>
        <PageHero
          eyebrow={fa ? 'مرکز دانش' : 'KNOWLEDGE CENTRE'}
          title={fa ? 'مقالات سیمرغ' : 'Insights'}
          lead={fa
            ? 'آنچه در پروژه‌ها یاد گرفته‌ایم، دسته‌بندی‌شده بر اساس حوزه‌های کاری ما: هوش مصنوعی صنعتی، اتوماسیون مهندسی، مهندسی فرآیند، ERP و IoT.'
            : 'What we learn on projects, arranged by the areas we work in: industrial AI, engineering automation, process engineering, ERP and IoT.'}
          crumbs={[{ label: fa ? 'مقالات' : 'Insights' }]}
          image={pages.insights.heroImage}
          flip={pages.insights.heroFlip} />
      </div>

      {/* The topics at a glance. */}
      <section className="border-b border-line bg-space-0" data-no-translate={fa ? '' : undefined}>
        <div className="mx-auto max-w-shell px-5 py-16 lg:px-10">
          <h2 className="text-[13px] text-ink-faint">{fa ? 'موضوع‌ها' : 'Topics'}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((t, i) => {
              const n = counts[t.key] ?? 0;
              const on = topic === t.key;
              return (
                <motion.li key={t.key} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}>
                  <Tilt className="h-full rounded-[18px]" max={5}>
                    <button type="button" onClick={() => { choose(on ? 'all' : t.key); document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                      className={`flex h-full w-full items-start gap-4 rounded-[18px] border p-5 text-start transition-colors ${on ? 'bg-space-2' : 'border-line bg-space-1/80 hover:bg-space-2/70'}`}
                      style={on ? { borderColor: t.color } : undefined}>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: `${t.color}1f`, color: t.color }}><Icon name={t.icon} className="h-5 w-5" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-[15.5px] font-semibold text-ink">{fa ? t.title.fa : t.title.en}</span>
                          <span className="text-[12px] tabular-nums text-ink-faint">{n ? (fa ? `${n.toLocaleString('fa-IR')} مطلب` : `${n} ${n === 1 ? 'piece' : 'pieces'}`) : (fa ? 'به‌زودی' : 'soon')}</span>
                        </span>
                        <span className="mt-1.5 block text-[13px] leading-relaxed text-ink-muted">{fa ? t.blurb.fa : t.blurb.en}</span>
                      </span>
                    </button>
                  </Tilt>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="articles" className="scroll-mt-20 bg-space-0">
        <div className="mx-auto max-w-shell px-5 py-14 lg:px-10 lg:py-16">
          {/* One bar for everything that narrows the list; it stays in reach while scrolling. */}
          <div className="sticky top-[72px] z-20 -mx-5 border-b border-line bg-space-0/[0.97] px-5 py-4 lg:mx-0 lg:rounded-2xl lg:border lg:px-5" data-no-translate={fa ? '' : undefined}>
            <TopicTabs id="page" value={topic} onChange={choose} counts={counts} fa={fa} />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-1.5">
                {['all', ...formats].map((f) => (
                  <button key={f} type="button" onClick={() => setFormat(f)} aria-pressed={format === f}
                    className={`rounded-full px-3 py-1.5 text-[12.5px] transition-colors ${format === f ? 'bg-white/10 text-ink' : 'text-ink-faint hover:text-ink'}`}>
                    {f === 'all' ? (fa ? 'همه‌ی قالب‌ها' : 'All formats') : (fa ? FORMATS[f]?.fa : FORMATS[f]?.en) ?? f}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 rounded-full border border-line px-4 py-2 sm:w-72">
                <SearchIcon className="h-4 w-4 text-ink-faint" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={fa ? 'جستجو در مقالات' : 'Search articles'} className="w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-faint" />
              </label>
            </div>
          </div>

          <div className="mt-10">
            {!featured && (
              <p className="rounded-2xl border border-dashed border-line py-16 text-center text-[14px] text-ink-faint" data-no-translate={fa ? '' : undefined}>
                {fa ? 'در این دسته هنوز مطلبی منتشر نشده است.' : 'Nothing published here yet.'}
              </p>
            )}
            <AnimatePresence mode="popLayout">
              {featured && (
                <motion.div key={`f-${featured.slug}`} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                  <ArticleCard item={featured} big />
                </motion.div>
              )}
            </AnimatePresence>
            {rest.length > 0 && (
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {rest.map((a, i) => (
                    <motion.div key={a.slug} layout initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.25), ease: [0.22, 1, 0.36, 1] }}>
                      <ArticleCard item={a} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </section>
    </>);

}
