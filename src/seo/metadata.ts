// Page metadata (title, description, canonical link, language alternates,
// social cards) built from the content the admin edits, in the language of
// the request (/fa/… is Persian). Each page's server file calls these.

import type { Metadata } from 'next';
import { getContent } from '../content/store';
import type { PageKey, Seo, SiteContent } from '../content/types';
import type { Locale } from '../i18n-dictionaries';
import { LOCALES, localizePath, OG_LOCALE } from '../i18n-routing';
import { getRequestLocale } from './locale';
import { FA_PAGES, titleTemplate, translator } from './localized';

/**
 * The one public address every canonical link, sitemap entry and hreflang
 * names. The deployment's NEXT_PUBLIC_SITE_URL wins over the admin setting: a
 * stale setting (https://www.… while www redirects to the bare domain) would
 * point Google at addresses that only redirect.
 */
export function siteUrl(c: SiteContent) {
  return (process.env.NEXT_PUBLIC_SITE_URL || c.settings.siteUrl || 'http://localhost:3000').replace(/\/+$/, '');
}

export function absoluteUrl(c: SiteContent, path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return siteUrl(c) + (path.startsWith('/') ? path : `/${path}`);
}

/** hreflang alternates for one page: every language, plus x-default (English). */
export function languageAlternates(c: SiteContent, path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LOCALES) out[l] = absoluteUrl(c, localizePath(path, l));
  out['x-default'] = absoluteUrl(c, path);
  return out;
}

interface Build {
  path: string;
  seo?: Seo;
  /** Used when the SEO fields are empty. */
  fallbackTitle?: string;
  fallbackDescription?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  /** Hand-written title/description for this language, ahead of everything else. */
  localized?: { title: string; description: string; keywords?: string };
}

const hasBrand = (t: string) => /simorgh|سیمرغ/i.test(t);

export async function buildMetadata(c: SiteContent, b: Build, locale?: Locale): Promise<Metadata> {
  const lang = locale ?? (await getRequestLocale());
  const tr = await translator(c, lang);
  const enTitle = b.seo?.title || b.fallbackTitle;
  const enDescription = b.seo?.description || b.fallbackDescription || c.seo.description;
  const title = b.localized?.title || (enTitle ? tr(enTitle) : undefined);
  const description = b.localized?.description || tr(enDescription);
  const image = b.seo?.image || b.image || c.seo.ogImage;
  const keywords = [b.localized?.keywords, b.seo?.keywords, c.seo.keywords].filter(Boolean).join(', ');
  const url = absoluteUrl(c, localizePath(b.path, lang));
  const template = titleTemplate(c, lang);
  const fullTitle = title ? (hasBrand(title) ? title : template.replace('%s', title)) : undefined;
  return {
    // A page title that already carries the brand is used as is.
    title: fullTitle ? { absolute: fullTitle } : undefined,
    description,
    keywords: keywords || undefined,
    alternates: {
      canonical: url,
      languages: b.seo?.noindex ? undefined : languageAlternates(c, b.path),
      types: { 'application/rss+xml': [{ url: '/insights/feed.xml', title: `${c.settings.siteName} Insights` }] },
    },
    robots: b.seo?.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: b.type ?? 'website',
      url,
      title: fullTitle,
      description,
      siteName: c.settings.siteName,
      locale: OG_LOCALE[lang],
      images: image ? [{ url: absoluteUrl(c, image) }] : undefined,
      publishedTime: b.publishedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: image ? [absoluteUrl(c, image)] : undefined,
      site: c.seo.twitterHandle || undefined,
    },
  };
}

export const PAGE_PATHS: Record<PageKey, string> = {
  home: '/', products: '/products', solutions: '/solutions', industries: '/industries', technology: '/technology',
  insights: '/insights', company: '/company', contact: '/contact', requestDemo: '/request-demo',
};

/** generateMetadata for one of the fixed pages. */
export function pageMetadata(key: PageKey) {
  return async (): Promise<Metadata> => {
    const c = await getContent();
    const locale = await getRequestLocale();
    const p = c.pages[key];
    return buildMetadata(c, {
      path: PAGE_PATHS[key],
      seo: p.seo,
      image: p.heroImage,
      localized: locale === 'fa' ? FA_PAGES[key] : undefined,
    }, locale);
  };
}
