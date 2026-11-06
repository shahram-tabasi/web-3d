'use client';

import { useEffect, useState } from 'react';

// Persian → English for content typed only in Persian (a team member's
// expertise, experience, education before their English is filled in), so the
// English site never shows Persian. Uses /api/translate (the office LLM); each
// answer is remembered in the browser. Without a translator the text stays as
// typed. The other languages then follow from the English as usual.

const PERSIAN = /[؀-ۿ]/;
const KEY = 'simorgh-fa-en:v1:';
export const hasPersian = (s: string) => PERSIAN.test(s);

function cached(t: string): string | null {
  try { return localStorage.getItem(KEY + t); } catch { return null; }
}
function remember(t: string, v: string) {
  try { localStorage.setItem(KEY + t, v); } catch { /* private window: ask again next time */ }
}

export async function translateFromPersian(texts: string[]): Promise<string[]> {
  const need = [...new Set(texts.filter((t) => hasPersian(t) && cached(t) === null))];
  const local = new Map<string, string>();
  if (need.length) {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: need, locale: 'en', from: 'fa' }),
      });
      const data = await res.json();
      if (!data.fallback && Array.isArray(data.translations) && data.translations.length === need.length) {
        need.forEach((t, i) => { const v = String(data.translations[i]); local.set(t, v); remember(t, v); });
      }
    } catch { /* offline or no translator: keep the text as typed */ }
  }
  return texts.map((t) => (hasPersian(t) ? local.get(t) ?? cached(t) ?? t : t));
}

/** The texts in English: unchanged when `enabled` is false; null while a translation is on its way. */
export function useFromPersian(texts: string[], enabled: boolean): string[] | null {
  const signature = texts.join('\u0001');
  const [out, setOut] = useState<{ sig: string; texts: string[] } | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    translateFromPersian(texts).then((r) => { if (live) setOut({ sig: signature, texts: r }); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, enabled]);
  if (!enabled) return texts;
  return out && out.sig === signature ? out.texts : null;
}
