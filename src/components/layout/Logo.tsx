'use client';

import React from 'react';
import Image from 'next/image';
import Link from './LocaleLink';
import { useI18n } from '../../i18n';
import { BRAND } from '../../data/brand';

export function Logo({ compact = false }: {compact?: boolean;}) {
  const { locale } = useI18n();
  const fa = locale === 'fa';
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={fa ? `${BRAND.nameFa} — صفحه اصلی` : `${BRAND.short} home`}>
      <Image
        src="/brand/sti-mark-light.png"
        alt={fa ? `لوگوی ${BRAND.nameFa}` : `${BRAND.nameEn} logo`}
        width={500}
        height={362}
        priority
        className="h-9 w-auto shrink-0 object-contain drop-shadow-[0_0_10px_rgba(160,215,255,0.35)] transition-transform duration-300 ease-sim group-hover:scale-105" />
      <span className="flex flex-col leading-none" data-no-translate>
        {fa ?
        <>
            <span className="text-[15px] font-bold text-ink">{BRAND.short_fa}</span>
            {!compact && <span className="mt-1.5 text-[10.5px] text-ink-faint">فن‌آوری هوشمند ایرانیان</span>}
          </> :
        <>
            <span className="font-display text-[17px] font-semibold tracking-[0.2em] text-ink">SIMORGH</span>
            {!compact &&
          <span className="mt-1 font-mono text-[9px] tracking-[0.22em] text-ink-faint">
                INTELLIGENT IRANIAN TECHNOLOGY
              </span>
          }
          </>
        }
      </span>
    </Link>);

}
