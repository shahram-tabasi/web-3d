// Server-only: page titles and descriptions in the visitor's language.
//
// The page copy is translated in the browser (components/i18n/AutoTranslate),
// but <title>, the meta description and social cards are read by search
// engines straight from the HTML, so they are translated here: hand-written
// Persian for the fixed pages (the searches that matter most), then the same
// catalogs the browser uses, then English.
import type { Locale } from '../i18n-dictionaries';
import type { PageKey, SiteContent } from '../content/types';
import { BRAND } from '../data/brand';

type Catalog = Record<string, string>;
const loaders: Record<Exclude<Locale, 'en'>, () => Promise<{ default: Catalog }>> = {
  fa: () => import('../locales/fa.json'),
  ar: () => import('../locales/ar.json'),
  tr: () => import('../locales/tr.json'),
  de: () => import('../locales/de.json'),
  fr: () => import('../locales/fr.json'),
  es: () => import('../locales/es.json'),
  zh: () => import('../locales/zh.json'),
  ja: () => import('../locales/ja.json'),
  ru: () => import('../locales/ru.json'),
};
const loaded = new Map<Locale, Map<string, string>>();
const norm = (v: string) => v.replace(/\s+/g, ' ').trim();

async function catalog(locale: Locale): Promise<Map<string, string>> {
  if (locale === 'en') return new Map();
  let m = loaded.get(locale);
  if (!m) {
    const entries = (await loaders[locale]()).default;
    m = new Map(Object.entries(entries).map(([k, v]) => [norm(k), v]));
    loaded.set(locale, m);
  }
  return m;
}

/** A translator for one request: admin overrides, then the bundled catalog, then the English itself. */
export async function translator(c: SiteContent, locale: Locale) {
  if (locale === 'en') return (s: string) => s;
  const cat = await catalog(locale);
  const overrides = new Map(Object.entries(c.translations?.[locale] ?? {}).map(([k, v]) => [norm(k), v]));
  const one = (s: string) => {
    const k = norm(s);
    return overrides.get(k) || cat.get(k) || cat.get(k.replace(/\.$/, '')) || s;
  };
  // "Simorgh Kara — Run the whole company" is translated part by part when the whole is not in the catalog.
  return (s: string) => {
    const whole = one(s);
    return whole !== s || !s.includes(' — ') ? whole : s.split(' — ').map(one).join(' — ');
  };
}

/** Hand-written Persian titles and descriptions for the fixed pages. */
export const FA_PAGES: Record<PageKey, { title: string; description: string; keywords?: string }> = {
  home: {
    title: `${BRAND.nameFa} | هوش مصنوعی صنعتی و اتوماسیون مهندسی`,
    description: 'سیمرغ فن‌آوری هوشمند ایرانیان: پل ارتباطی میان صنعت، مهندسی فرآیند و هوش مصنوعی. مشاوره راهبردی، اتوماسیون طراحی تابلو برق، ERP صنعتی، دوقلوی دیجیتال و IoT.',
    keywords: 'سیمرغ, سیمرغ AI, سیمرغ فن آوری هوشمند ایرانیان, هوش مصنوعی صنعتی, اتوماسیون مهندسی, طراحی تابلو برق, ERP صنعتی, دوقلوی دیجیتال',
  },
  products: {
    title: 'محصولات سیمرغ | Kara، ERP، Design Suite و هوش مصنوعی مهندسی',
    description: 'محصولات سیمرغ فن‌آوری هوشمند ایرانیان: سیمرغ کارا، سیمرغ ERP، Design Suite برای طراحی و ترسیم خودکار نقشه تابلو برق، هوش مصنوعی مهندسی و دستیار منابع انسانی؛ روی سرورهای خود شما.',
    keywords: 'نرم افزار طراحی تابلو برق, ERP تولیدی, نرم افزار مهندسی برق, سیمرغ کارا, Design Suite',
  },
  solutions: {
    title: 'راهکارهای سیمرغ | اتوماسیون مهندسی، ERP و هوش مصنوعی',
    description: 'از مشخصات فنی تا نقشه EPLAN بدون بازنویسی، مدیریت یکپارچه چند شرکت، پاسخ‌گویی هوشمند به اسناد فنی و هوشمندسازی فرآیندها با مدل کالیبره‌شده.',
  },
  industries: {
    title: 'صنایع | برق و انرژی، تابلو برق، نفت و گاز، معدن و شهر هوشمند',
    description: 'راهکارهای سیمرغ برای صنایع تولیدی و تجهیزات سنگین، برق و انرژی، تابلوسازی، نفت و گاز و پتروشیمی، معدن و شهرهای هوشمند.',
  },
  technology: {
    title: 'فناوری سیمرغ | بینایی ماشین، Document AI، گراف دانش و RAG',
    description: 'یک لایه هوشمندی زیر همه محصولات: بینایی ماشین، استخراج هوشمند اسناد فنی، هوش مصنوعی مهندسی، RAG، گراف دانش، عامل‌های هوشمند و دوقلوی دیجیتال.',
  },
  insights: {
    title: 'مقالات و اخبار سیمرغ | هوش مصنوعی در صنعت و مهندسی',
    description: 'مقالات فنی، مطالعات موردی و ویدیوهای تیم مهندسی سیمرغ درباره هوش مصنوعی صنعتی، اتوماسیون طراحی و تحول دیجیتال.',
  },
  company: {
    title: `درباره ما و تیم | ${BRAND.nameFa}`,
    description: 'سیمرغ گروهی از متخصصان مهندسی و فناوری است که با تلفیق دانش عمیق صنعتی و هوش مصنوعی، چالش‌های زیرساختی، صنعتی و سازمانی را حل می‌کند. با تیم ما آشنا شوید.',
    keywords: 'درباره سیمرغ, تیم سیمرغ, شرکت هوش مصنوعی ایرانی',
  },
  contact: {
    title: `تماس با ما | ${BRAND.nameFa}`,
    description: 'برای مشاوره تخصصی، فروش، همکاری و پشتیبانی با سیمرغ فن‌آوری هوشمند ایرانیان تماس بگیرید: info@simorghai.com',
  },
  requestDemo: {
    title: 'درخواست دمو | سیمرغ',
    description: 'پلتفرم سیمرغ را روی نمونه‌ای از اسناد، داده‌ها یا نقشه‌های خودتان ببینید. درخواست نمایش رایگان.',
  },
};

/** "%s | SIMORGH" in each language. */
export function titleTemplate(c: SiteContent, locale: Locale) {
  return locale === 'fa' ? `%s | ${BRAND.short_fa}` : c.seo.titleTemplate;
}

export function defaultTitle(c: SiteContent, locale: Locale) {
  return locale === 'fa' ? FA_PAGES.home.title : c.seo.defaultTitle;
}
