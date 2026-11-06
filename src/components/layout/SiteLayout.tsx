'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { I18nProvider, type Locale } from '../../i18n';
import { AutoTranslate } from '../i18n/AutoTranslate';
import { SimorghAIChat } from '../ai/SimorghAIChat';
import { MeteorShower } from '../ui/MeteorShower';
import { ScrollProgress } from '../fx/ScrollProgress';

export function SiteLayout({ children, locale }: { children: React.ReactNode; locale?: Locale }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <I18nProvider initial={locale}>
      <div className="relative flex min-h-screen w-full flex-col">
      <ScrollProgress />
      <Header />
      <AutoTranslate />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <MeteorShower />
      <SimorghAIChat />
      </div>
    </I18nProvider>);

}