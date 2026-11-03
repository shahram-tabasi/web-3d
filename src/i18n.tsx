'use client';

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { dictionaries, type Dictionary, type Locale } from './i18n-dictionaries';
import { DEFAULT_LOCALE, dirOf, isLocale, localizePath, splitLocale } from './i18n-routing';

export type { Locale };

const STORAGE_KEY = 'simorgh-locale';

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  /** The current address without its language prefix ("/fa/products" → "/products"). */
  path: string;
}>({ locale: 'en', setLocale: () => undefined, t: dictionaries.en, path: '/' });

const readSaved = (): Locale | null => {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(v) ? v : null;
  } catch { return null; }
};

/**
 * The language comes from the address (/fa/… is Persian), so the server
 * renders the right lang/dir and search engines see one URL per language.
 * `initial` is what the server resolved for this request.
 */
export function I18nProvider({ children, initial = DEFAULT_LOCALE }: { children: React.ReactNode; initial?: Locale }) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const fromUrl = splitLocale(pathname);
  // usePathname may report the rewritten (unprefixed) path; the server's answer covers that case.
  const locale: Locale = fromUrl.locale !== DEFAULT_LOCALE ? fromUrl.locale : initial;
  const path = fromUrl.path;

  // A visitor who chose a language before and lands on an English address goes to their language.
  useEffect(() => {
    if (locale !== DEFAULT_LOCALE) return;
    const saved = readSaved();
    if (saved && saved !== DEFAULT_LOCALE) router.replace(localizePath(path, saved) + window.location.search + window.location.hash);
    // Only on arrival, not on every navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dirOf(locale);
    document.body.dataset.locale = locale;
    document.body.classList.toggle('locale-fa', locale === 'fa');
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    path,
    t: dictionaries[locale],
    setLocale: (next: Locale) => {
      try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* private mode */ }
      router.push(localizePath(path, next) + window.location.search);
    },
  }), [locale, path, router]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Every string a locale's dictionary already renders, lower-cased. These are
 * localised at the source, so the page translator must leave them alone
 * (German "Produkte" is not English waiting to be translated).
 */
export function dictionaryValues(locale: Locale) {
  const values = new Set<string>();
  const walk = (value: unknown) => {
    if (typeof value === 'string') values.add(value.replace(/\s+/g, ' ').trim().toLowerCase());
    else if (value && typeof value === 'object') Object.values(value).forEach(walk);
  };
  if (locale !== 'en') walk(dictionaries[locale]);
  return values;
}

export function useI18n() {
  return useContext(I18nContext);
}
