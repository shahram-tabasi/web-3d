'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRightIcon } from 'lucide-react';
import Link from '../layout/LocaleLink';
import { useContent } from '../../content/ContentProvider';
import { useI18n } from '../../i18n';

// The products as a plain grid (the calm design, 2026-11): every product seen at
// once, the same card for each — picture, name, what it is for, one link.
// (A turning 3D carousel hid all but one and moved on by itself.)
export function ProductGrid({ heading = 'h2' }: { heading?: 'h1' | 'h2' }) {
  const { products } = useContent();
  const fa = useI18n().locale === 'fa';
  const Heading = heading;
  if (products.length === 0) return null;
  return (
    <section className="border-b border-line bg-space-1 py-20 lg:py-24" aria-labelledby="products-heading">
      <div className="mx-auto max-w-shell px-5 lg:px-10">
        <div className="mb-12 max-w-2xl" data-no-translate={fa ? '' : undefined}>
          <p className="text-[14px] font-medium text-cyan">{fa ? 'محصولات ما' : 'Our products'}</p>
          <Heading id="products-heading" className="mt-3 font-display text-[30px] font-semibold leading-[1.3] tracking-tight text-ink sm:text-[38px]">
            {fa ? 'نرم‌افزارهایی که در صنعت کار می‌کنند' : 'Software that works on the shop floor'}
          </Heading>
          <p className="mt-4 text-[17px] leading-[1.9] text-ink-muted">
            {fa
              ? 'از طراحی خودکار تابلو برق تا ERP تولیدی و دستیار هوش مصنوعی؛ روی سرورهای خود شما.'
              : 'From automatic switchboard design to manufacturing ERP and an AI assistant — on your own servers.'}
          </p>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.slug}>
              <Link href={`/products/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-space-2 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-cyan/35 hover:shadow-[0_18px_40px_-20px_rgba(95,212,207,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue">
                {p.image && (
                  <div className="relative aspect-[16/9] bg-space-3">
                    <Image src={p.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-[20px] font-semibold text-ink" data-no-translate dir="ltr" style={{ textAlign: fa ? 'right' : 'left' }}>{p.name}</h3>
                  {p.tagline && <p className="mt-1.5 text-[15.5px] font-medium leading-7 text-ink/90">{p.tagline}</p>}
                  {p.summary && <p className="mt-3 line-clamp-3 text-[15px] leading-7 text-ink-muted">{p.summary}</p>}
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[15px] font-medium text-cyan">
                    {fa ? 'بیشتر بدانید' : 'Learn more'}
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" strokeWidth={1.8} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
