'use client';

import { ArrowRightIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { HeroArtwork } from '../hero/HeroArtwork';
import { activeHero } from '../../data/hero';
import { useI18n } from '../../i18n';

export function Hero() {
  const { t } = useI18n();
  const slide = activeHero;

  return <section className="relative isolate min-h-[100svh] w-full overflow-hidden bg-space-0" aria-label="SIMORGH">
    <HeroArtwork media={slide.media} />
    {/* Keep the bird and faces clear; only the lower copy area needs a quiet scrim. */}
    <div className="pointer-events-none absolute inset-0 hidden lg:block"
      style={{ background: 'linear-gradient(180deg, rgba(4,9,19,.65) 0%, rgba(4,9,19,.05) 20%, rgba(4,9,19,.1) 43%, rgba(4,9,19,.84) 69%, rgba(4,9,19,.3) 100%)' }} />
    <div className="pointer-events-none relative mx-auto flex min-h-[100svh] max-w-shell flex-col items-center justify-end px-5 pb-12 pt-[calc(66.667vw+112px)] text-center lg:pb-12 lg:pt-[53vh]">
      <div className="w-full max-w-[850px]">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-6 bg-cyan/60" />
          <span className="font-mono text-[9px] tracking-label text-cyan/80 sm:text-[10px]">{t.hero.eyebrow}</span>
          <span className="h-px w-6 bg-cyan/60" />
        </div>
        <h1 className="mt-5 font-display text-[34px] font-semibold leading-[1.12] tracking-tight text-white sm:text-[46px] lg:text-[clamp(40px,3.6vw,56px)]">
          {t.hero.headline}
          <span className="mt-1 block text-[#9ec9ed]">{t.hero.accent}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[620px] text-[14px] leading-relaxed text-[#abb8ca] sm:text-[15px]">
          {t.hero.subtitle}
        </p>
        <div className="pointer-events-auto mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button to={slide.primaryCta.to} size="lg">
            {t.hero.primary}<ArrowRightIcon className="h-4 w-4" strokeWidth={1.6} />
          </Button>
          <Button to={slide.secondaryCta.to} size="lg" variant="outline">{t.hero.secondary}</Button>
        </div>
        <div className="mt-7 font-mono text-[9px] leading-relaxed tracking-label text-ink-faint">{t.hero.kicker}</div>
      </div>
    </div>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px sim-hairline" />
  </section>;
}
