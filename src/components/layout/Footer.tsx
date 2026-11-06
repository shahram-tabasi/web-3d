'use client';

import React from 'react';
import Link from './LocaleLink';
import { Logo } from './Logo';
import { useContent } from '../../content/ContentProvider';
import { useI18n } from '../../i18n';
import { BRAND } from '../../data/brand';
import { ArrowUp, Github, Instagram, Linkedin, Mail, Phone, PlayCircle, Send, Twitter, Youtube, type LucideIcon } from 'lucide-react';
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
  const { t, locale } = useI18n();
  const fa = locale === 'fa';
  // The language is chosen in the header (one place for one job); the footer
  // keeps to what people look for at the bottom of a page: a next step, the
  // site's map, how to reach the company, and its profiles.
  return (
    <footer className="relative border-t border-line bg-space-1">
      <div className="mx-auto max-w-shell px-5 lg:px-10">
        {/* The next step, for whoever has read this far. */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-line py-12 sm:flex-row sm:items-center lg:py-14">
          <div>
            <p className="font-display text-[22px] font-semibold text-ink sm:text-[26px]">
              {fa ? 'پروژه‌ای در ذهن دارید؟' : 'Have a project in mind?'}
            </p>
            <p className="mt-2 text-[15px] leading-7 text-ink-muted">
              {fa ? 'در یک جلسه کوتاه، راه‌حل مناسب کار شما را نشان می‌دهیم.' : 'In one short call we will show you what fits your work.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3" data-no-translate>
            <Link href="/request-demo" className="inline-flex h-11 items-center rounded-md bg-blue px-5 text-[14px] font-medium text-white transition-colors hover:bg-blue-soft">
              {fa ? 'درخواست دمو' : 'Request a demo'}
            </Link>
            <Link href="/contact" className="inline-flex h-11 items-center rounded-md border border-line px-5 text-[14px] text-ink transition-colors hover:border-cyan/50 hover:text-cyan-soft">
              {fa ? 'تماس با ما' : 'Contact us'}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-14 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:py-16">
          <div className="col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-6 max-w-xs text-[14px] leading-7 text-ink-muted">
              {fa ? 'نرم‌افزار هوشمند برای سیستم‌های واقعی؛ هوش مصنوعی، دانش مهندسی و زیرساخت در یک پلتفرم.' : 'Intelligent software for real-world systems — artificial intelligence, engineering knowledge and infrastructure, working as one platform.'}
            </p>
            {(settings.email || settings.phone) && (
              <ul className="mt-6 grid gap-2 text-[14px]" data-no-translate>
                {settings.email && (
                  <li className="flex items-center gap-2.5 text-ink-muted"><Mail className="h-4 w-4 text-cyan/80" strokeWidth={1.75} aria-hidden />
                    <a href={`mailto:${settings.email}`} dir="ltr" className="transition-colors hover:text-cyan-soft">{settings.email}</a></li>
                )}
                {settings.phone && (
                  <li className="flex items-center gap-2.5 text-ink-muted"><Phone className="h-4 w-4 text-cyan/80" strokeWidth={1.75} aria-hidden />
                    <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} dir="ltr" className="transition-colors hover:text-cyan-soft">{settings.phone}</a></li>
                )}
              </ul>
            )}
            {/* The company's profiles (Settings → social links), each opening in a new tab. */}
            {social.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label={fa ? 'سیمرغ در شبکه‌های اجتماعی' : 'SIMORGH on social media'}>
                {social.map(({ key, url }) => {
                  const Icon = SOCIAL_ICON[key];
                  const label = fa ? SOCIAL_LABEL[key].fa : SOCIAL_LABEL[key].en;
                  return (
                    <li key={key}>
                      <a href={url} target="_blank" rel="noopener me" aria-label={label} title={label}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-muted transition-colors duration-150 ease-sim hover:border-cyan/50 hover:bg-cyan/[0.06] hover:text-cyan-soft">
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {columns(products, industries).map((col) => (
            <nav key={col.title} aria-label={t.nav[col.title] ?? col.title}>
              <h3 className="text-[14px] font-semibold text-ink">{t.nav[col.title] ?? col.title}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.to} className="text-[14px] text-ink-muted transition-colors duration-150 ease-sim hover:text-cyan-soft">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-7 text-[13px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p data-no-translate>
            {fa
              ? `© ${new Date().getFullYear()} ${BRAND.nameFa}. تمامی حقوق محفوظ است.`
              : `© ${new Date().getFullYear()} ${BRAND.nameEn} (${BRAND.nameFa}). All rights reserved.`}
          </p>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-1.5 self-start transition-colors hover:text-cyan-soft sm:self-auto" data-no-translate>
            <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />{fa ? 'بازگشت به بالا' : 'Back to top'}
          </a>
        </div>
      </div>
    </footer>
  );
}
