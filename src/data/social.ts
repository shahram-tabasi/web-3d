import type { Settings } from '../content/types';

export type SocialKey = keyof Settings['social'];

/** The profile's address on each network, for a bare handle typed in the admin (with or without @). */
const BASE: Record<SocialKey, string> = {
  linkedin: 'https://www.linkedin.com/in/',
  instagram: 'https://www.instagram.com/',
  telegram: 'https://t.me/',
  x: 'https://x.com/',
  youtube: 'https://www.youtube.com/@',
  aparat: 'https://www.aparat.com/',
  github: 'https://github.com/',
};

export const SOCIAL_LABEL: Record<SocialKey, { en: string; fa: string }> = {
  linkedin: { en: 'LinkedIn', fa: 'لینکدین' },
  instagram: { en: 'Instagram', fa: 'اینستاگرام' },
  telegram: { en: 'Telegram', fa: 'تلگرام' },
  x: { en: 'X', fa: 'ایکس' },
  youtube: { en: 'YouTube', fa: 'یوتیوب' },
  aparat: { en: 'Aparat', fa: 'آپارات' },
  github: { en: 'GitHub', fa: 'گیت‌هاب' },
};

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

/** "https://…" as is; "@name" or "name" → the network's profile address. Empty → null. */
export function socialUrl(key: SocialKey, raw: string | undefined): string | null {
  const v = (raw ?? '').trim().replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^(www\.)?[a-z0-9-]+\.[a-z]{2,}\//i.test(v)) return `https://${v}`;
  const handle = v.replace(/^@/, '').replace(/^\/+|\/+$/g, '');
  return /^[\w.-]{1,100}$/.test(handle) ? BASE[key] + handle : null;
}

/** Every filled-in profile, in a fixed order. */
export function socialLinks(social: Settings['social']): { key: SocialKey; url: string }[] {
  return (Object.keys(BASE) as SocialKey[])
    .map((key) => ({ key, url: socialUrl(key, social?.[key]) }))
    .filter((x): x is { key: SocialKey; url: string } => !!x.url);
}
