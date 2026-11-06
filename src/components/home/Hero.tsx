'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useContent } from '../../content/ContentProvider';
import { useI18n } from '../../i18n';

// The first screen, in the calm design (2026-11): one clear sentence of what we
// do, who it is for, one main action and one quiet one. The brand's Simorgh in
// lapis on warm paper, over a faint girih (Persian tile) pattern. Nothing moves:
// a first impression is formed in a fraction of a second, and low visual
// complexity with a familiar layout is what people judge best.

/** A faint eight-pointed girih star repeated: Persian tilework, kept almost invisible. */
const GIRIH = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Cg fill='none' stroke='%231f4fa8' stroke-width='1'%3E%3Cpath d='M36 6l8.5 21.5L66 36l-21.5 8.5L36 66l-8.5-21.5L6 36l21.5-8.5z'/%3E%3Cpath d='M36 22l4 10 10 4-10 4-4 10-4-10-10-4 10-4z'/%3E%3C/g%3E%3C/svg%3E")`;

export function Hero() {
  const { locale } = useI18n();
  const fa = locale === 'fa';
  const { hero } = useContent();
  const text = hero.text[locale] ?? hero.text.en;
  const industries = fa
    ? ['صنایع تولیدی', 'برق و انرژی', 'نفت، گاز و معدن', 'شهرهای هوشمند']
    : ['Manufacturing', 'Power & energy', 'Oil, gas & mining', 'Smart cities'];

  return (
    <section className="relative w-full overflow-hidden border-b border-line bg-space-0 pt-[72px]" aria-label={fa ? 'سیمرغ' : 'SIMORGH'} data-no-simorgh>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: GIRIH }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-space-0" />

      <div className="relative mx-auto grid max-w-shell items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-10 lg:py-28">
        <div>
          {/* The brand opens the page's one heading: what a search for «سیمرغ AI» should find. */}
          <h1 className="font-display font-semibold tracking-tight text-ink">
            <span className="inline-block rounded-full border border-line bg-space-2 px-3.5 py-1 align-middle text-[13px] font-medium leading-normal text-ink-muted">
              {text.eyebrow}
            </span>
            <span className="mt-6 block text-[34px] leading-[1.2] sm:text-[46px] lg:text-[56px]">{text.headline}</span>
            <span className="block text-[34px] leading-[1.2] text-blue sm:text-[46px] lg:text-[56px]">{text.accent}</span>
          </h1>

          <p className="mt-6 max-w-xl text-[17px] leading-[1.9] text-ink-muted sm:text-[18px]">{text.subtitle}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to={hero.primaryTo} size="lg">
              {text.primary}
              <ArrowRightIcon className="h-4 w-4 rtl:-scale-x-100" strokeWidth={1.8} />
            </Button>
            <Button to={hero.secondaryTo} size="lg" variant="outline">
              {text.secondary}
            </Button>
          </div>

          <p className="mt-10 text-[14px] text-ink-faint">
            {fa ? 'در خدمت ' : 'Working for '}
            {industries.map((w, i) => (
              <React.Fragment key={w}>
                <span className="text-ink-muted">{w}</span>
                {i < industries.length - 1 && <span aria-hidden className="mx-2 text-line">·</span>}
              </React.Fragment>
            ))}
          </p>
        </div>

        <div className="relative mx-auto hidden w-full max-w-md lg:block" aria-hidden>
          <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(15,124,134,0.10),transparent)]" />
          <Image src="/brand/mark-dark.png" alt="" width={1084} height={832} priority className="relative h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
