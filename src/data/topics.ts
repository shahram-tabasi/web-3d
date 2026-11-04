// The knowledge centre's topics: a short fixed list that follows what the
// company does (the brochure's areas of work), so a reader always knows where
// an article belongs and where to look. An article's `category` holds one of
// these keys; older free-text categories are mapped by `topicOf`.
import type { Bi } from './brochure';

export interface Topic {
  key: string;
  icon: string;
  /** Accent colour of the topic's chip and card edge. */
  color: string;
  title: Bi;
  blurb: Bi;
  /** Older category names that belong here. */
  aliases: string[];
}

export const TOPICS: Topic[] = [
  {
    key: 'industrial-ai',
    icon: 'brain',
    color: '#7ce6f7',
    title: { en: 'Industrial AI', fa: 'هوش مصنوعی صنعتی' },
    blurb: { en: 'Models that read engineering documents, drawings and plant data.', fa: 'مدل‌هایی که اسناد مهندسی، نقشه‌ها و داده‌ی کارخانه را می‌فهمند.' },
    aliases: ['ai', 'industrial ai', 'engineering ai', 'document ai', 'rag', 'computer vision', 'digital twin'],
  },
  {
    key: 'engineering-automation',
    icon: 'drafting',
    color: '#5c8dff',
    title: { en: 'Engineering automation', fa: 'اتوماسیون مهندسی' },
    blurb: { en: 'Switchboard design, EPLAN and drawings generated from the specification.', fa: 'طراحی تابلو برق، EPLAN و تولید خودکار نقشه از روی مشخصات فنی.' },
    aliases: ['engineering', 'design', 'eplan', 'switchgear', 'smart grid'],
  },
  {
    key: 'process-engineering',
    icon: 'workflow',
    color: '#a48bff',
    title: { en: 'Process engineering', fa: 'مهندسی فرآیند' },
    blurb: { en: 'Workflows measured, simulated and improved before they are changed.', fa: 'جریان‌های کاری که پیش از تغییر، اندازه‌گیری و شبیه‌سازی می‌شوند.' },
    aliases: ['process intelligence', 'process', 'bpm', 'simulation'],
  },
  {
    key: 'enterprise-erp',
    icon: 'ledger',
    color: '#e8b65a',
    title: { en: 'ERP & enterprise', fa: 'ERP و سازمان' },
    blurb: { en: 'From the order to the service report: Kara, ERP, PLM and the shop floor.', fa: 'از سفارش تا گزارش خدمات: کارا، ERP، PLM و کارگاه.' },
    aliases: ['platform', 'erp', 'kara', 'enterprise', 'software'],
  },
  {
    key: 'iot-equipment',
    icon: 'cpu',
    color: '#4fd1a5',
    title: { en: 'IoT & equipment', fa: 'IoT و تجهیزات' },
    blurb: { en: 'Sensors on existing machines, and the data they start to give.', fa: 'سنسور روی ماشین‌آلات موجود و داده‌ای که از آن به دست می‌آید.' },
    aliases: ['iot', 'equipment', 'retrofit', 'sensors'],
  },
  {
    key: 'news',
    icon: 'bolt',
    color: '#ff8f8f',
    title: { en: 'Simorgh news', fa: 'اخبار سیمرغ' },
    blurb: { en: 'Releases, projects and events.', fa: 'انتشار نسخه‌ها، پروژه‌ها و رویدادها.' },
    aliases: ['news', 'announcement', 'release'],
  },
];

const byKey = new Map(TOPICS.map((t) => [t.key, t]));

/** The topic an article belongs to: its key, an old category name, or News for news items. */
export function topicOf(a: { category: string; kind?: string }): Topic {
  const c = (a.category || '').trim().toLowerCase();
  const direct = byKey.get(c);
  if (direct) return direct;
  const alias = TOPICS.find((t) => t.aliases.includes(c) || t.title.en.toLowerCase() === c || t.title.fa === a.category);
  if (alias) return alias;
  if (a.kind === 'News') return byKey.get('news')!;
  return byKey.get('industrial-ai')!;
}

/** The article formats, as readers name them. */
export const FORMATS: Record<string, Bi> = {
  'Technical Article': { en: 'Article', fa: 'مقاله' },
  'Case Study': { en: 'Case study', fa: 'مطالعه‌ی موردی' },
  Video: { en: 'Video', fa: 'ویدیو' },
  Whitepaper: { en: 'Whitepaper', fa: 'گزارش فنی' },
  News: { en: 'News', fa: 'خبر' },
};

/** "14 min read" → "۱۴ دقیقه مطالعه". */
export function readTimeLabel(readTime: string, fa: boolean) {
  if (!fa) return readTime;
  const n = /\d+/.exec(readTime)?.[0];
  return n ? `${Number(n).toLocaleString('fa-IR')} دقیقه مطالعه` : readTime;
}

export function dateLabel(date: string, fa: boolean) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(fa ? 'fa-IR' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}
