'use client';

import React from 'react';
import Link from '../layout/LocaleLink';
import { ChevronRightIcon } from 'lucide-react';
import { useI18n } from '../../i18n';

interface Crumb {
  label: string;
  to?: string;
}

interface Props {
  eyebrow: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  image?: string;
  /** Mirror the background vertically. */
  flip?: boolean;
  children?: React.ReactNode;
}

export function PageHero({ eyebrow, title, lead, crumbs = [], children }: Props) {
  const fa = useI18n().locale === 'fa';
  return (
    <section className="relative w-full overflow-hidden border-b border-line bg-space-0 pt-[72px]">

      <div className="relative mx-auto max-w-shell px-5 py-16 lg:px-10 lg:py-20">
        {crumbs.length > 0 &&
        <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] text-ink-faint">
              <li>
                <Link href="/" className="hover:text-cyan">
                  {fa ? 'خانه' : 'Home'}
                </Link>
              </li>
              {crumbs.map((c) =>
            <li key={c.label} className="flex items-center gap-2">
                  <ChevronRightIcon className="h-3 w-3 opacity-50 rtl:-scale-x-100" strokeWidth={1.6} aria-hidden="true" />
                  {c.to ?
              <Link href={c.to} className="hover:text-cyan">
                      {c.label}
                    </Link> :

              <span className="text-ink-muted">{c.label}</span>
              }
                </li>
            )}
            </ol>
          </nav>
        }

        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium text-cyan">{eyebrow}</span>
        </div>
        <h1 className="mt-6 max-w-4xl font-display text-[34px] font-semibold leading-[1.25] tracking-tight text-ink lg:text-[50px]">
          {title}
        </h1>
        {lead && <p className="mt-6 max-w-2xl text-[17px] leading-[1.9] text-ink-muted lg:text-[18px]">{lead}</p>}
        {children}
      </div>
    </section>);

}