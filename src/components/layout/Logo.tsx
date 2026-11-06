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
        src="/brand/mark-dark.png"
        alt={fa ? `لوگوی ${BRAND.nameFa}` : `${BRAND.nameEn} logo`}
        width={1084}
        height={832}
        priority
        className="h-11 w-auto shrink-0 sm:h-12 object-contain transition-transform duration-300 ease-sim group-hover:scale-105" />
      <span className="flex flex-col leading-none" data-no-translate>
        {fa ?
        <>
            <span className="text-[15px] font-bold text-ink">{BRAND.short_fa}</span>
            {!compact && <span className="mt-1.5 hidden whitespace-nowrap text-[10.5px] text-ink-faint sm:block">فن‌آوری هوشمند ایرانیان</span>}
          </> :
        <>
            <span className="font-display text-[17px] font-semibold tracking-[0.08em] text-ink">SIMORGH</span>
            {!compact &&
          <span className="mt-1 hidden whitespace-nowrap text-[10.5px] tracking-[0.02em] text-ink-faint sm:block">
                Intelligent Iranian Technology
              </span>
          }
          </>
        }
      </span>
    </Link>);

}
