// Structured data (schema.org JSON-LD): what lets Google show the company,
// products, articles, breadcrumbs and FAQs as rich results.

import React from 'react';
import { socialLinks } from '../data/social';
import type { Thread } from '../comments/store';
import type { Article, ProductEntry, SiteContent, TeamMember } from '../content/types';
import type { Locale } from '../i18n-dictionaries';
import { localizePath } from '../i18n-routing';
import { BRAND } from '../data/brand';
import { absoluteUrl } from './metadata';

/** A placeholder number ("+98 21 0000 0000") is worse than none: search engines show it. */
const realPhone = (p: string) => (p && !/0000\s*0000/.test(p) ? p : undefined);

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be raw JSON; "<" is escaped so no content can close the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function organizationLd(c: SiteContent) {
  const sameAs = socialLinks(c.settings.social).map((s) => s.url);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl(c, '/#organization'),
    name: c.settings.legalName || BRAND.nameEn,
    legalName: c.settings.legalName || BRAND.nameEn,
    alternateName: [...new Set([c.settings.legalNameFa, ...BRAND.alternateNames, c.settings.siteName, 'سیمرغ'].filter(Boolean))],
    url: absoluteUrl(c, '/'),
    logo: { '@type': 'ImageObject', url: absoluteUrl(c, BRAND.logoSquare), width: 600, height: 600 },
    image: absoluteUrl(c, BRAND.logoSquare),
    email: c.settings.email || undefined,
    telephone: realPhone(c.settings.phone),
    address: c.settings.address ? { '@type': 'PostalAddress', streetAddress: c.settings.address, addressCountry: 'IR' } : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function websiteLd(c: SiteContent, locale: Locale = 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl(c, '/#website'),
    name: locale === 'fa' ? (c.settings.legalNameFa || BRAND.nameFa) : c.settings.siteName,
    alternateName: [c.settings.legalNameFa || BRAND.nameFa, c.settings.legalName || BRAND.nameEn, 'Simorgh AI'],
    url: absoluteUrl(c, localizePath('/', locale)),
    publisher: { '@id': absoluteUrl(c, '/#organization') },
    inLanguage: ['en', 'fa', 'ar', 'tr', 'de', 'fr', 'es', 'zh', 'ja', 'ru'],
  };
}

export function breadcrumbLd(c: SiteContent, trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: absoluteUrl(c, t.path),
    })),
  };
}

export function productLd(c: SiteContent, p: ProductEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.name,
    alternateName: p.short,
    description: p.seo.description || p.summary,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Windows',
    image: p.image ? absoluteUrl(c, p.image) : undefined,
    url: absoluteUrl(c, `/products/${p.slug}`),
    publisher: { '@id': absoluteUrl(c, '/#organization') },
    featureList: p.capabilities.map((f) => f.title),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function articleLd(c: SiteContent, a: Article, thread?: Thread) {
  const image = a.seo.image || a.cover;
  return {
    '@context': 'https://schema.org',
    '@type': a.kind === 'News' ? 'NewsArticle' : a.kind === 'Video' ? 'VideoObject' : 'Article',
    headline: a.title,
    name: a.title,
    description: a.seo.description || a.excerpt,
    datePublished: a.date,
    uploadDate: a.kind === 'Video' ? a.date : undefined,
    thumbnailUrl: a.kind === 'Video' && image ? absoluteUrl(c, image) : undefined,
    contentUrl: a.kind === 'Video' && a.video ? absoluteUrl(c, a.video) : undefined,
    image: image ? absoluteUrl(c, image) : undefined,
    author: { '@type': 'Organization', name: a.author || c.settings.siteName },
    publisher: { '@id': absoluteUrl(c, '/#organization') },
    mainEntityOfPage: absoluteUrl(c, `/insights/${a.slug}`),
    articleSection: a.category,
    commentCount: thread?.count || undefined,
    // Up to 20 recent top-level comments, the way readers see them.
    comment: thread?.comments.length
      ? thread.comments.slice(0, 20).map((cm) => ({
        '@type': 'Comment',
        text: cm.text,
        dateCreated: cm.createdAt,
        url: absoluteUrl(c, `/insights/${a.slug}#comment-${cm.id}`),
        author: cm.team ? { '@type': 'Organization', name: c.settings.siteName } : { '@type': 'Person', name: cm.name },
      }))
      : undefined,
    interactionStatistic: thread?.likes ? { '@type': 'InteractionCounter', interactionType: 'https://schema.org/LikeAction', userInteractionCount: thread.likes } : undefined,
  };
}

/** The team on the Company page, as people who work for the organisation. */
export function teamLd(c: SiteContent, team: TeamMember[], locale: Locale = 'en') {
  return team.filter((m) => m.name || m.nameFa).map((m) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': absoluteUrl(c, `/company#${m.id}`),
    name: (locale === 'fa' ? m.nameFa || m.name : m.name || m.nameFa),
    alternateName: m.name && m.nameFa ? (locale === 'fa' ? m.name : m.nameFa) : undefined,
    jobTitle: (locale === 'fa' ? m.roleFa || m.role : m.role || m.roleFa) || undefined,
    description: (locale === 'fa' ? m.bioFa || m.bio : m.bio || m.bioFa) || undefined,
    image: m.photo ? absoluteUrl(c, m.photo) : undefined,
    knowsAbout: m.expertise.length ? m.expertise : undefined,
    alumniOf: m.education || undefined,
    sameAs: m.linkedin ? [m.linkedin] : undefined,
    worksFor: { '@id': absoluteUrl(c, '/#organization') },
    url: absoluteUrl(c, `${localizePath('/company', locale)}#${m.id}`),
  }));
}
