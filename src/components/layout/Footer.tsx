'use client';

import React from 'react';
import Link from './LocaleLink';
import { Logo } from './Logo';
import { languages } from '../../data/site';
import { useContent } from '../../content/ContentProvider';
import { useI18n, type Locale } from '../../i18n';
import NextLink from 'next/link';
import { localizePath } from '../../i18n-routing';
import { BRAND } from '../../data/brand';
import { Github, Instagram, Linkedin, PlayCircle, Send, Twitter, Youtube, type LucideIcon } from 'lucide-react';
import { SOCIAL_LABEL, socialLinks, type SocialKey } from '../../data/social';

const SOCIAL_ICON: Record<SocialKey, LucideIcon> = {
  linkedin: Linkedin, instagram: Instagram, telegram: Send, x: Twitter, youtube: Youtube, aparat: PlayCircle, github: Github,
};

const columns = (products: { short: string; slug: string }[], industries: { name: string; slug: string }[]) => [
{
  title: 'Products',
  links: products.map((p) => ({ label: p.short, to: `/products/${p.slug}` }))
},
{
  title: 'Industries',
  links: industries.slice(0, 7).map((i) => ({ label: i.name, to: `/industries/${i.slug}` }))
},
{
  title: 'Company',
  links: [
  { label: 'About SIMORGH', to: '/company' },
  { label: 'Our Team', to: '/company#team' },
  { label: 'Services', to: '/solutions' },
  { label: 'Insights', to: '/insights' },
  { label: 'Contact', to: '/contact' },
  { label: 'Request a Demo', to: '/request-demo' }]

}];


export function Footer() {
  const { products, industries, settings } = useContent();
  const social = socialLinks(settings.social);
  const { t, locale, path, setLocale } = useI18n();
  return (
    <footer className="relative border-t border-line bg-space-1">
      <div className="mx-auto max-w-shell px-5 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-faint">
              {locale === 'fa' ? 'نرم‌افزار هوشمند برای سیستم‌های واقعی؛ هوش مصنوعی، دانش مهندسی و زیرساخت در یک پلتفرم.' : 'Intelligent software for real-world systems — artificial intelligence, engineering knowledge and infrastructure, working as one platform.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-1.5" data-no-translate>
              {languages.map((l) =>
              <NextLink key={l.code} href={localizePath(path, l.code as Locale)} hrefLang={l.code} title={l.label}
                onClick={(e) => { e.preventDefault(); setLocale(l.code as Locale); }}
                className={`border px-2 py-1 font-mono text-[12px] transition-colors hover:text-cyan-soft ${l.code === locale ? 'border-cyan/50 text-cyan-soft' : 'border-line text-ink-faint'}`}>
                  /{l.code}
                </NextLink>
              )}
            </div>
            {/* The company's profiles (Settings → social links), each opening in a new tab. */}
            {social.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label={locale === 'fa' ? 'سیمرغ در شبکه‌های اجتماعی' : 'SIMORGH on social media'}>
                {social.map(({ key, url }) => {
                  const Icon = SOCIAL_ICON[key];
                  const label = locale === 'fa' ? SOCIAL_LABEL[key].fa : SOCIAL_LABEL[key].en;
                  return (
                    <li key={key}>
                      <a href={url} target="_blank" rel="noopener me" aria-label={label} title={label}
                        className="flex h-9 w-9 items-center justify-center border border-line text-ink-faint transition-colors duration-150 ease-sim hover:border-cyan/50 hover:text-cyan-soft">
                        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {columns(products, industries).map((col) =>
          <div key={col.title}>
              <h3 className="font-mono text-[12px] tracking-label text-cyan/80">{(t.nav[col.title] ?? col.title).toUpperCase()}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((l) =>
              <li key={l.label}>
                    <Link
                  href={l.to}
                  className="text-[13.5px] text-ink-muted transition-colors duration-150 ease-sim hover:text-cyan-soft">
                  
                      {l.label}
                    </Link>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-[12.5px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p data-no-translate>
            {locale === 'fa'
              ? `© ${new Date().getFullYear()} ${BRAND.nameFa}. تمامی حقوق محفوظ است.`
              : `© ${new Date().getFullYear()} ${BRAND.nameEn} (${BRAND.nameFa}). All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>);

}