import { NextResponse } from 'next/server';
import { protectedPattern, protectedTerms } from '@/src/data/glossary';
import { llmChat, llmConfigured } from '@/src/lib/llm';

// Fallback translator for text the bundled catalogs (src/locales) do not
// cover — admin-edited content, new pages. Needs LLM_API_KEY (the office LLM,
// src/lib/llm.ts); without it
// the response says `unavailable: true` and the client stops asking. Any other
// `fallback: true` is a failed attempt: the client shows English and does not cache it.
//
// Protected terms (product names, software, standards, acronyms) are swapped
// for numbered tokens before the text leaves the server and put back
// afterwards, so they come back exactly as written whatever the model does.

const token = (index: number) => `⟦${index}⟧`;

function mask(text: string) {
  const terms: string[] = [];
  const masked = text.replace(new RegExp(protectedPattern.source, 'g'), (term) => {
    terms.push(term);
    return token(terms.length - 1);
  });
  return { masked, terms };
}

function unmask(text: string, terms: string[]) {
  return text.replace(/⟦(\d+)⟧/g, (whole, index) => terms[Number(index)] ?? whole);
}

// Answers already given, per process: the same team page asked by many
// visitors costs the LLM once. Bounded so it cannot grow without end.
const memo = new Map<string, string>();
const MEMO_MAX = 5000;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { texts = [], locale = 'en' } = body;
    // `from: 'fa'`: content typed only in Persian, wanted in English.
    const from = body.from === 'fa' ? 'fa' : 'en';
    if ((locale === 'en' && from === 'en') || !Array.isArray(texts) || texts.length === 0) return NextResponse.json({ translations: texts });
    if (texts.length > 80) return NextResponse.json({ translations: texts, fallback: true });
    if (!llmConfigured()) return NextResponse.json({ translations: texts, fallback: true, unavailable: true });

    const key = (t: string) => `${from}>${locale}:${t}`;
    const strings = texts.map((t: unknown) => String(t).slice(0, 2000));
    if (strings.every((t: string) => memo.has(key(t)))) return NextResponse.json({ translations: strings.map((t: string) => memo.get(key(t))) });

    const masked = strings.map((text: string) => mask(text));

    const raw = await llmChat(
      [
        {
          role: 'system',
          content: `You are the translation engine for the SIMORGH website. Translate UI and editorial website text${from === 'fa' ? ' from Persian (Farsi)' : ''} into locale ${locale}. Durations such as "۱۴ سال" become "14 years"; Persian digits become Latin digits. Return JSON only: {"translations":[...]} in exactly the same order and count. Preserve HTML-free plain text. Tokens like ⟦0⟧ stand for protected names: copy every token unchanged into the translation, in the grammatically right place. NEVER translate, transliterate, or alter protected technical terms, product names, software names, company names, acronyms, model names, standards, protocols, URLs, numbers, units, or codes. Protected examples: ${protectedTerms.join(', ')}. Translate natural-language UI around those terms. Do not add explanations.`
        },
        { role: 'user', content: JSON.stringify(masked.map((item: { masked: string }) => item.masked)) }
      ],
      { temperature: 0, json: true, maxTokens: 4000 }
    );
    if (!raw) return NextResponse.json({ translations: texts, fallback: true });
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.translations) || parsed.translations.length !== texts.length) return NextResponse.json({ translations: texts, fallback: true });
    const translations = parsed.translations.map((text: string, index: number) => unmask(String(text), masked[index].terms));
    if (memo.size > MEMO_MAX) memo.clear();
    strings.forEach((t: string, i: number) => memo.set(key(t), translations[i]));
    return NextResponse.json({ translations });
  } catch (error) {
    console.error('translate:', error instanceof Error ? error.message : error);
    return NextResponse.json({ translations: [], fallback: true }, { status: 500 });
  }
}
