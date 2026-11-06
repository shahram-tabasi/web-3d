'use client';

import React from 'react';
import { ArrowUpRightIcon, PlayIcon } from 'lucide-react';
import Link from '../layout/LocaleLink';
import { Icon } from '../ui/Icon';
import { Tilt } from '../fx/Tilt';
import { useI18n } from '../../i18n';
import type { PublicContent } from '../../content/types';
import { FORMATS, dateLabel, readTimeLabel, topicOf } from '../../data/topics';

type Item = PublicContent['articles'][number];

/** One article: its topic's colour and icon, format, title, excerpt, date and reading time. */
export function ArticleCard({ item, big = false }: { item: Item; big?: boolean }) {
  const fa = useI18n().locale === 'fa';
  const topic = topicOf(item);
  const format = FORMATS[item.kind];
  return (
    <Tilt className="h-full rounded-[22px]" max={big ? 4 : 6}>
      <Link
        href={`/insights/${item.slug}`}
        className={`group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-space-1/90 transition-colors duration-300 hover:border-white/20 ${big ? 'lg:flex-row' : ''}`}
        style={{ ['--tc' as string]: topic.color }}
      >
        <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-[3px] bg-[var(--tc)] opacity-80" />
        <div className={`relative overflow-hidden ${big ? 'aspect-[16/9] lg:aspect-auto lg:w-[55%]' : 'aspect-[16/9]'}`}>
          {item.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-[radial-gradient(120%_100%_at_30%_0%,color-mix(in_srgb,var(--tc)_30%,#0b1226)_0%,#070b18_70%)]">
              <Icon name={topic.icon} className="h-14 w-14 text-[var(--tc)] opacity-70 transition-transform duration-700 group-hover:scale-110" strokeWidth={1} />
            </div>
          )}
          {item.kind === 'Video' && (
            <span className="absolute inset-0 grid place-items-center"><span className="grid h-14 w-14 place-items-center rounded-full bg-black/50 text-white backdrop-blur"><PlayIcon className="h-6 w-6" /></span></span>
          )}
        </div>
        <div className={`flex flex-1 flex-col p-6 ${big ? 'lg:p-10' : ''}`}>
          <div className="flex flex-wrap items-center gap-2 text-[12px]" data-no-translate={fa ? '' : undefined}>
            <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1" style={{ borderColor: `${topic.color}55`, color: topic.color }}>
              <Icon name={topic.icon} className="h-3.5 w-3.5" />{fa ? topic.title.fa : topic.title.en}
            </span>
            {format && <span className="rounded-full border border-line px-2.5 py-1 text-ink-faint">{fa ? format.fa : format.en}</span>}
          </div>
          {/* Titles and excerpts are written in English and translated with the page. */}
          <h3 className={`mt-5 font-semibold leading-snug text-ink transition-colors group-hover:text-white ${big ? 'text-[24px] lg:text-[30px]' : 'text-[18px]'}`}>
            {item.title}
          </h3>
          <p className={`mt-3 text-[14px] leading-[1.9] text-ink-muted ${big ? 'line-clamp-4' : 'line-clamp-3'}`}>{item.excerpt}</p>
          <div className="mt-auto flex items-center justify-between pt-6 text-[12.5px] text-ink-faint" data-no-translate={fa ? '' : undefined}>
            <span>{dateLabel(item.date, fa)} · {readTimeLabel(item.readTime, fa)}</span>
            <ArrowUpRightIcon className="h-4 w-4 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:text-[var(--tc)] rtl:-scale-x-100" />
          </div>
        </div>
      </Link>
    </Tilt>
  );
}
