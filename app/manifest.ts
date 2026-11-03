import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'سیمرغ فن‌آوری هوشمند ایرانیان — Simorgh Intelligent Iranian Technology',
    short_name: 'SIMORGH',
    description: 'Engineering intelligence for a smarter world.',
    start_url: '/',
    display: 'standalone',
    background_color: '#04060e',
    theme_color: '#04060e',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  };
}
