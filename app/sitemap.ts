import type { MetadataRoute } from 'next';
import { getContent, toPublic } from '@/src/content/store';
import { absoluteUrl, languageAlternates } from '@/src/seo/metadata';
import { LOCALES, localizePath } from '@/src/i18n-routing';

// From content.json at request time, not the build's defaults.
export const dynamic = 'force-dynamic';

type Freq = 'weekly' | 'monthly' | 'yearly';

// Every public page, product, industry and article, in every language: each
// address listed with all its language versions (hreflang), the way Google
// pairs /products with /fa/products. English and Persian come first.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const full = await getContent();
  const c = toPublic(full);
  const updated = new Date(full.updatedAt.startsWith('1970') ? Date.now() : full.updatedAt);
  const pages: { path: string; priority: number; freq: Freq; modified: Date }[] = [
    { path: '/', priority: 1, freq: 'weekly', modified: updated },
    { path: '/products', priority: 0.9, freq: 'weekly', modified: updated },
    { path: '/solutions', priority: 0.8, freq: 'monthly', modified: updated },
    { path: '/industries', priority: 0.8, freq: 'monthly', modified: updated },
    { path: '/technology', priority: 0.8, freq: 'monthly', modified: updated },
    { path: '/insights', priority: 0.8, freq: 'weekly', modified: updated },
    { path: '/company', priority: 0.7, freq: 'monthly', modified: updated },
    { path: '/contact', priority: 0.6, freq: 'monthly', modified: updated },
    { path: '/request-demo', priority: 0.7, freq: 'monthly', modified: updated },
    ...c.products.filter((p) => !p.seo.noindex).map((p) => ({ path: `/products/${p.slug}`, priority: 0.9, freq: 'monthly' as Freq, modified: updated })),
    ...c.industries.filter((i) => !i.seo.noindex).map((i) => ({ path: `/industries/${i.slug}`, priority: 0.7, freq: 'monthly' as Freq, modified: updated })),
    ...c.articles.filter((a) => !a.seo.noindex).map((a) => ({ path: `/insights/${a.slug}`, priority: 0.7, freq: 'yearly' as Freq, modified: new Date(a.date) })),
  ];
  const order = ['en', 'fa', ...LOCALES.filter((l) => l !== 'en' && l !== 'fa')] as typeof LOCALES;
  return order.flatMap((locale) => pages.map((p) => ({
    url: absoluteUrl(full, localizePath(p.path, locale)),
    lastModified: p.modified,
    changeFrequency: p.freq,
    // The other languages are translations of the English and Persian pages.
    priority: locale === 'en' || locale === 'fa' ? p.priority : Math.round(p.priority * 5) / 10,
    alternates: { languages: languageAlternates(full, p.path) },
  })));
}
