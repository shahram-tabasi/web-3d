// What the company does, in the words of the brochure (Persian) and their
// English. The home page and the services page read from here, so the site
// and the printed brochure tell the same short story.

export type Bi = { en: string; fa: string };

export const ABOUT: { lead: Bi; belief: Bi; points: Bi[] } = {
  lead: {
    en: 'Simorgh AI (Simorgh Intelligent Iranian Technology) is a group of engineering and technology specialists. By combining deep industrial knowledge with modern artificial intelligence, we solve the hardest infrastructure, industrial and organisational problems.',
    fa: 'ما در «سیمرغ AI» (سیمرغ فن‌آوری هوشمند ایرانیان) گروهی از متخصصان مهندسی و فناوری هستیم که با تلفیق دانش عمیق صنعتی و فناوری‌های نوین هوش مصنوعی، پیچیده‌ترین چالش‌های زیرساختی، صنعتی و سازمانی را حل می‌کنیم.',
  },
  belief: {
    en: 'Real digitalisation happens when engineering processes are understood correctly and precisely — and intelligent tools are put to work for productivity.',
    fa: 'دیجیتال‌سازی واقعی زمانی رخ می‌دهد که فرآیندهای مهندسی به‌درستی و دقیق درک شوند و ابزارهای هوشمند در خدمت بهره‌وری قرار گیرند.',
  },
  points: [
    { en: 'A deep understanding of industrial processes', fa: 'شناخت عمیق فرآیندهای صنعتی' },
    { en: 'AI trained on engineering data', fa: 'هوش مصنوعی آموزش‌دیده بر داده‌ی مهندسی' },
    { en: 'From consulting to implementation, beside you', fa: 'از مشاوره تا پیاده‌سازی، در کنار شما' },
  ],
};

export const SERVICES: { icon: string; title: Bi; body: Bi }[] = [
  {
    icon: 'compass',
    title: { en: 'Strategic consulting', fa: 'مشاوره‌ی راهبردی' },
    body: {
      en: 'Diagnosis, technology architecture and the digital-transformation strategy for your industry.',
      fa: 'عارضه‌یابی، معماری کلان فناوری و استراتژی تحول دیجیتال صنایع.',
    },
  },
  {
    icon: 'workflow',
    title: { en: 'Process engineering', fa: 'مهندسی فرآیند' },
    body: {
      en: 'Standardising, optimising and automating engineering and operational workflows.',
      fa: 'استانداردسازی، بهینه‌سازی و خودکارسازی جریان‌های کاری مهندسی و عملیاتی.',
    },
  },
  {
    icon: 'code',
    title: { en: 'Digital solutions', fa: 'توسعه‌ی راهکارهای دیجیتال' },
    body: {
      en: 'Building dedicated software platforms, ERP systems and AI tools.',
      fa: 'پیاده‌سازی پلتفرم‌های نرم‌افزاری اختصاصی، سیستم‌های ERP و ابزارهای هوش مصنوعی.',
    },
  },
  {
    icon: 'brain',
    title: { en: 'Industrial AI', fa: 'هوش مصنوعی صنعتی' },
    body: {
      en: 'Dedicated tools that understand engineering data: from reading technical documents to generating drawings and reports automatically.',
      fa: 'ساخت ابزارهای اختصاصی که داده‌ی مهندسی را می‌فهمند: از استخراج اطلاعات مدارک فنی تا تولید خودکار نقشه و گزارش.',
    },
  },
  {
    icon: 'cpu',
    title: { en: 'Smart retrofit of existing equipment', fa: 'هوشمندسازی تجهیزات موجود' },
    body: {
      en: 'Don’t retire older machines: we choose or design the right sensors and IoT for them, so production data is collected, monitored and analysed.',
      fa: 'ماشین‌آلات قدیمی را کنار نگذارید: سنسور و راهکار IoT مناسب را برایشان انتخاب یا طراحی می‌کنیم تا داده‌ی تولید جمع‌آوری، پایش و تحلیل شود.',
    },
  },
];

export const PLATFORMS: { icon: string; title: Bi; body: Bi; examples: { label: string; to?: string; note?: Bi }[] }[] = [
  {
    icon: 'drafting',
    title: { en: 'Engineering & industrial automation', fa: 'اتوماسیون مهندسی و صنعتی' },
    body: {
      en: 'Advanced engineering-design tools that automate drawings and technical documents.',
      fa: 'راهکارهای پیشرفته‌ی طراحی مهندسی برای خودکارسازی نقشه‌ها و اسناد فنی.',
    },
    examples: [{ label: 'SIMORGH DESIGN SUITE', to: '/products/simorgh-design-suite', note: { en: 'Automatic design and drawing of switchboard schematics', fa: 'طراحی و ترسیم خودکار نقشه‌های تابلو برق' } }],
  },
  {
    icon: 'ledger',
    title: { en: 'Enterprise solutions', fa: 'راهکارهای جامع سازمانی' },
    body: {
      en: 'Integrated platforms for resources, operations, people and field service (ERP).',
      fa: 'پلتفرم‌های یکپارچه‌ی مدیریت منابع، عملیات، نیروی انسانی و خدمات میدانی (ERP).',
    },
    examples: [{ label: 'SIMORGH KARA', to: '/products/simorgh-kara' }, { label: 'SIMORGH ERP', to: '/products/simorgh-erp' }],
  },
  {
    icon: 'ai',
    title: { en: 'AI & data infrastructure', fa: 'هوش مصنوعی و زیرساخت داده' },
    body: {
      en: 'Sensors and IoT, machine vision, knowledge graphs and intelligent processing of technical documents and datasheets.',
      fa: 'سنسور و IoT، بینایی ماشین، گراف دانش و پردازش هوشمند اسناد فنی و دیتاشیت‌ها.',
    },
    examples: [{ label: 'IoT' }, { label: 'Computer Vision' }, { label: 'Knowledge Graph' }, { label: 'Document AI' }],
  },
];

export const TARGET_INDUSTRIES: { icon: string; to: string; title: Bi; note?: Bi }[] = [
  { icon: 'factory', to: '/industries/industrial-automation', title: { en: 'Manufacturing & industrial equipment', fa: 'صنایع تولیدی و تجهیزات صنعتی' } },
  { icon: 'bolt', to: '/industries/electricity-energy', title: { en: 'Power & energy', fa: 'برق و انرژی' }, note: { en: 'Switchboards, distribution and smart grids', fa: 'تابلو برق، توزیع و شبکه‌های هوشمند' } },
  { icon: 'drop', to: '/industries/oil-gas', title: { en: 'Oil, gas, petrochemicals & mining', fa: 'نفت، گاز، پتروشیمی و صنایع معدنی' } },
  { icon: 'city', to: '/industries/smart-cities', title: { en: 'Smart cities & urban infrastructure', fa: 'شهرهای هوشمند و زیرساخت‌های شهری' } },
];

/** The words that run across the industries band. */
export const TICKER: Bi[] = [
  { en: 'Switchboard design', fa: 'طراحی تابلو برق' },
  { en: 'EPLAN', fa: 'EPLAN' },
  { en: 'Manufacturing ERP', fa: 'ERP تولیدی' },
  { en: 'Industrial IoT', fa: 'IoT صنعتی' },
  { en: 'Machine vision', fa: 'بینایی ماشین' },
  { en: 'Document AI', fa: 'پردازش هوشمند اسناد' },
  { en: 'Process engineering', fa: 'مهندسی فرآیند' },
  { en: 'Smart grid', fa: 'شبکه‌ی هوشمند' },
  { en: 'Field service', fa: 'خدمات میدانی' },
  { en: 'Knowledge graph', fa: 'گراف دانش' },
];

export const pickBi = (b: Bi, fa: boolean) => (fa ? b.fa : b.en);
