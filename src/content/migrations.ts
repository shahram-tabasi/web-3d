// One-time changes to the stored content (storage/content.json), for content
// that ships with a release: the admin's saved lists replace the defaults
// whole, so new products or articles would otherwise never appear. Each
// migration runs once; its id is then kept in content.migrations, so an
// admin who later undoes part of it (re-publishes a product) is not overruled.
import { productionProducts, retiredProducts } from './seed/products-2026-10';
import { simodArticle } from './seed/article-simod';
import { designSuiteUpdate, erpProduct, karaUpdate, productOrder } from './seed/products-2026-11';
import { designToDeliveryArticle } from './seed/article-design-to-delivery';
import type { SiteContent } from './types';
import { dictionaries } from '../i18n-dictionaries';
import { topicOf } from '../data/topics';

interface Migration {
  id: string;
  apply: (c: SiteContent) => SiteContent;
}

const OCT_PRODUCTS_DESCRIPTION =
  'Simorgh Kara, Design Suite, Engineering AI and HR Assistant: software for running complex engineering organisations, on your own servers.';

const OLD_ENTERPRISE_BODY = 'Accounting, inventory and workforce systems built for engineering organisations.';

const OLD_PRODUCTS_DESCRIPTION =
  'SIMORGH Design Suite, Grid, Digital Twin, Kara, Shop, Draw and Cloud: seven products sharing one intelligence layer, from electrical design to digital twin.';

export const MIGRATIONS: Migration[] = [
  {
    // October 2026: the products in production (Kara, Design Suite, Engineering
    // AI, HR Assistant, on Cloud) and the first real article. The products not
    // in production and the placeholder articles are unpublished, not deleted.
    id: '2026-10-production-products',
    apply: (c) => {
      const bySlug = new Map(c.products.map((p) => [p.slug, p]));
      const order = ['simorgh-kara', 'simorgh-design-suite', 'simorgh-engineering-ai', 'simorgh-hr-assistant', 'simorgh-cloud'];
      const products = c.products.map((p) => (retiredProducts.includes(p.slug) ? { ...p, status: 'draft' as const } : p));
      for (const text of productionProducts) {
        const old = bySlug.get(text.slug);
        const next = {
          ...text,
          // What the admin chose stays: pictures, gallery, diagrams, SEO overrides.
          image: old?.image || text.image,
          headerImage: old?.headerImage ?? '',
          gallery: old?.gallery ?? [],
          schematics: old?.schematics ?? [],
          seo: { ...text.seo, ...Object.fromEntries(Object.entries(old?.seo ?? {}).filter(([, v]) => v)) },
          status: 'published' as const,
          order: 0,
        };
        const i = products.findIndex((p) => p.slug === text.slug);
        if (i >= 0) products[i] = next; else products.push(next);
      }
      for (const p of products) {
        const rank = order.indexOf(p.slug);
        p.order = rank >= 0 ? rank + 1 : 100 + p.order;
      }

      const articles = c.articles.map((a) => (!a.body.trim() && a.status !== 'draft' ? { ...a, status: 'draft' as const } : a));
      if (!articles.some((a) => a.slug === simodArticle.slug)) articles.unshift(simodArticle);

      const pages = { ...c.pages };
      if (pages.products?.seo.description === OLD_PRODUCTS_DESCRIPTION) {
        pages.products = {
          ...pages.products,
          seo: {
            ...pages.products.seo,
            description: OCT_PRODUCTS_DESCRIPTION,
          },
        };
      }
      return { ...c, products, articles, pages };
    },
  },
  {
    // November 2026: Simorgh ERP as a product of its own; Kara gains the shop
    // floor and field service, Design Suite gains Simorgh Draw and Send to
    // PLM; the article on the whole thread. Pictures and SEO the admin chose
    // stay; texts are replaced, as in the October migration.
    id: '2026-11-erp-shop-floor',
    apply: (c) => {
      const products = c.products.map((p) => {
        if (p.slug === 'simorgh-kara') return { ...p, ...karaUpdate };
        if (p.slug === 'simorgh-design-suite') return { ...p, ...designSuiteUpdate };
        return p;
      });
      const old = products.find((p) => p.slug === erpProduct.slug);
      const erp = {
        ...erpProduct,
        image: old?.image || erpProduct.image,
        // The banner carries words; the page header gets the wordless picture.
        headerImage: old?.headerImage || '/images/products/simorgh-erp/header.jpg',
        gallery: old?.gallery ?? [],
        schematics: old?.schematics ?? [],
        seo: { ...erpProduct.seo, ...Object.fromEntries(Object.entries(old?.seo ?? {}).filter(([, v]) => v)) },
        status: 'published' as const,
        order: 0,
      };
      const i = products.findIndex((p) => p.slug === erp.slug);
      if (i >= 0) products[i] = erp; else products.push(erp);
      for (const p of products) {
        const rank = productOrder.indexOf(p.slug);
        if (rank >= 0) p.order = rank + 1;
      }

      const articles = c.articles.some((a) => a.slug === designToDeliveryArticle.slug)
        ? c.articles
        : [designToDeliveryArticle, ...c.articles];

      const ecosystem = c.ecosystem.map((e) =>
        e.key === 'enterprise' && e.body === OLD_ENTERPRISE_BODY
          ? { ...e, body: 'Kara for people and work, Simorgh ERP for orders, production, quality and service, connected to the design.' }
          : e);
      const pages = { ...c.pages };
      if (pages.products?.seo.description === OCT_PRODUCTS_DESCRIPTION) {
        pages.products = {
          ...pages.products,
          seo: {
            ...pages.products.seo,
            description: 'Simorgh Kara, ERP, Design Suite, Engineering AI and HR Assistant: one platform from the engineer’s design to the customer’s signature, on your own servers.',
          },
        };
      }
      return { ...c, products, articles, ecosystem, pages };
    },
  },
  {
    // November 2026: the new logo and the company's name as on it — in English
    // as on the brochure, and in Persian. A name the admin changed stays.
    id: '2026-11-brand-name',
    apply: (c) => {
      const old = ['SIMORGH Intelligent Iranian Technology', 'SIMORGH Intelligent Technology', ''];
      const settings = { ...c.settings };
      if (old.includes(settings.legalName.trim())) settings.legalName = 'Simorgh Intelligent Iranian Technology Co.';
      if (!settings.legalNameFa?.trim()) settings.legalNameFa = 'سیمرغ فن‌آوری هوشمند ایرانیان';
      const seo = { ...c.seo };
      if (!/فن.?آوری هوشمند ایرانیان/.test(seo.keywords)) {
        seo.keywords = `سیمرغ فن آوری هوشمند ایرانیان, سیمرغ فن‌آوری هوشمند ایرانیان, Simorgh AI, SimorghAI, ${seo.keywords}`;
      }
      // The share card with the new logo, unless the admin chose their own.
      if (!seo.ogImage || seo.ogImage === '/images/og-default.jpg') seo.ogImage = '/brand/og-sti.jpg';
      return { ...c, settings, seo };
    },
  },
  {
    // November 2026: the home page tells the brochure's story. The hero's
    // English and Persian texts change unless the admin had rewritten them;
    // its first button goes to the services page; Solutions becomes Services.
    id: '2026-11-home-brochure',
    apply: (c) => {
      const old: Record<string, string> = { en: 'Engineering Intelligence', fa: 'هوشمندی مهندسی' };
      const text = { ...c.hero.text };
      for (const code of ['en', 'fa'] as const) {
        if (!text[code] || text[code].headline === old[code]) text[code] = { ...dictionaries[code].hero };
      }
      const hero = { ...c.hero, text, primaryTo: c.hero.primaryTo === '/technology' ? '/solutions' : c.hero.primaryTo };
      const pages = { ...c.pages };
      if (pages.solutions?.seo.title === 'Solutions') {
        pages.solutions = {
          ...pages.solutions,
          seo: {
            ...pages.solutions.seo,
            title: 'Services',
            description: 'Strategic consulting, process engineering, digital solutions, industrial AI and smart retrofit of existing equipment — from diagnosis to a working system.',
          },
        };
      }
      return { ...c, hero, pages };
    },
  },
  {
    // November 2026, second thoughts: the first screen goes back to its own
    // slogan ("Engineering Intelligence for a Smarter World"), the brochure's
    // line moving to a band of its own below it; the buttons stay. Articles
    // get one of the fixed topics (data/topics.ts) instead of free text.
    id: '2026-11-slogan-back-topics',
    apply: (c) => {
      const brochure: Record<string, string> = { en: 'Bridging industry, process engineering', fa: 'پل ارتباطی میان صنعت، مهندسی فرآیند' };
      const text = { ...c.hero.text };
      for (const code of ['en', 'fa'] as const) {
        if (text[code]?.headline === brochure[code]) {
          const d = dictionaries[code].hero;
          text[code] = { ...text[code], eyebrow: d.eyebrow, headline: d.headline, accent: d.accent, subtitle: d.subtitle, kicker: d.kicker };
        }
      }
      const articles = c.articles.map((a) => ({ ...a, category: topicOf(a).key }));
      return { ...c, hero: { ...c.hero, text }, articles };
    },
  },
];

/** The migrations not yet applied to `c`, applied in order. */
export function migrate(c: SiteContent): { content: SiteContent; applied: string[] } {
  const done = new Set(c.migrations ?? []);
  const applied: string[] = [];
  let content = c;
  for (const m of MIGRATIONS) {
    if (done.has(m.id)) continue;
    content = m.apply(content);
    applied.push(m.id);
  }
  if (applied.length) content = { ...content, migrations: [...(c.migrations ?? []), ...applied] };
  return { content, applied };
}
