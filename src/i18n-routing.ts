// Language in the address: English lives at /products, every other language at
// /<code>/products (/fa/products, /ar/products …). middleware.ts rewrites the
// prefixed addresses onto the same pages and tells them the language, so each
// language has its own crawlable, indexable URL. Safe on server and client.
import { languages } from './data/site';
import type { Locale } from './i18n-dictionaries';

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALES = languages.map((l) => l.code) as Locale[];
export const PREFIXED = LOCALES.filter((l) => l !== DEFAULT_LOCALE);
/** Request header middleware.ts sets on a prefixed address. */
export const LOCALE_HEADER = 'x-simorgh-locale';

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (LOCALES as string[]).includes(v);
export const dirOf = (l: Locale) => languages.find((x) => x.code === l)?.dir ?? 'ltr';

/** The language an address is in, and the address without its prefix. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const m = /^\/([a-z]{2})(?=\/|$)(.*)$/.exec(pathname);
  if (m && isLocale(m[1]) && m[1] !== DEFAULT_LOCALE) return { locale: m[1], path: m[2] || '/' };
  return { locale: DEFAULT_LOCALE, path: pathname || '/' };
}

/** An internal address in `locale`: "/products" → "/fa/products". Leaves external, hash, admin, API and file links alone. */
export function localizePath(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const bare = splitLocale(href.replace(/[?#].*$/, '')).path;
  const rest = href.slice(href.replace(/[?#].*$/, '').length);
  if (/^\/(admin|api|media|_next)(\/|$)/.test(bare) || /\.[a-z0-9]{2,5}$/i.test(bare)) return href;
  if (locale === DEFAULT_LOCALE) return bare + rest;
  return (bare === '/' ? `/${locale}` : `/${locale}${bare}`) + rest;
}

export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US', fa: 'fa_IR', ar: 'ar_AE', tr: 'tr_TR', de: 'de_DE', fr: 'fr_FR', es: 'es_ES', zh: 'zh_CN', ja: 'ja_JP', ru: 'ru_RU',
};
