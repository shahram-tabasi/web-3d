'use client';

import React from 'react';
import { PageHero } from '../components/ui/PageHero';
import { useContent } from '../content/ContentProvider';
import { AboutCTA } from '../components/home/AboutCTA';
import { TeamSection } from '../components/company/TeamSection';
import { BRAND } from '../data/brand';
import { useI18n } from '../i18n';

export function Company() {
  const { pages, settings } = useContent();
  const fa = useI18n().locale === 'fa';
  return (
    <>
      <div data-no-translate={fa ? '' : undefined}>
      <PageHero
        eyebrow={fa ? 'درباره ما' : 'COMPANY'}
        title={fa ? settings.legalNameFa || BRAND.nameFa : settings.legalName || BRAND.nameEn}
        lead={fa ? 'پل ارتباطی میان صنعت، مهندسی فرآیند و هوش مصنوعی پیشرفته' : 'Bridging industry, process engineering and advanced AI.'}
        crumbs={[{ label: fa ? 'درباره ما' : 'Company' }]}
        image={pages.company.heroImage}
        flip={pages.company.heroFlip} />
      </div>
      

      <AboutCTA />

      <TeamSection />
    </>);

}