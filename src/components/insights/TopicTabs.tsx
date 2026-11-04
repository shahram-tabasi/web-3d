'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../ui/Icon';
import { TOPICS } from '../../data/topics';

/** "All" and one tab per topic; the highlight slides to the chosen one. */
export function TopicTabs({ value, onChange, counts, fa, id, hideEmpty = false }: {
  value: string; onChange: (key: string) => void; counts: Record<string, number>; fa: boolean; id: string; hideEmpty?: boolean;
}) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const tabs = [
    { key: 'all', label: fa ? 'همه' : 'All', icon: '', color: '#e7edff', count: total },
    ...TOPICS.filter((t) => !hideEmpty || counts[t.key]).map((t) => ({ key: t.key, label: fa ? t.title.fa : t.title.en, icon: t.icon, color: t.color, count: counts[t.key] ?? 0 })),
  ];
  return (
    <div role="tablist" aria-label={fa ? 'موضوع' : 'Topic'} data-no-translate={fa ? '' : undefined}
      className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0">
      {tabs.map((t) => {
        const on = t.key === value;
        return (
          <button key={t.key} type="button" role="tab" aria-selected={on} onClick={() => onChange(t.key)}
            className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] transition-colors ${on ? 'text-space-0' : 'text-ink-muted hover:text-ink'} ${t.count === 0 && !on ? 'opacity-50' : ''}`}>
            {on && <motion.span layoutId={`tab-${id}`} className="absolute inset-0 rounded-full" style={{ background: t.color }} transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            {!on && <span className="absolute inset-0 rounded-full border border-line" />}
            <span className="relative flex items-center gap-2">
              {t.icon && <Icon name={t.icon} className="h-4 w-4" />}
              {t.label}
              <span className={`rounded-full px-1.5 text-[11px] tabular-nums ${on ? 'bg-black/15' : 'bg-white/5 text-ink-faint'}`}>{fa ? t.count.toLocaleString('fa-IR') : t.count}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function countByTopic<T>(items: T[], topicKey: (i: T) => string) {
  const counts: Record<string, number> = {};
  for (const i of items) counts[topicKey(i)] = (counts[topicKey(i)] ?? 0) + 1;
  return counts;
}
