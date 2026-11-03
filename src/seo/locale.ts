// Server-only: the language of the current request (set by middleware.ts).
import { headers } from 'next/headers';
import { DEFAULT_LOCALE, isLocale, LOCALE_HEADER } from '../i18n-routing';
import type { Locale } from '../i18n-dictionaries';

export async function getRequestLocale(): Promise<Locale> {
  const h = (await headers()).get(LOCALE_HEADER);
  return isLocale(h) ? h : DEFAULT_LOCALE;
}
