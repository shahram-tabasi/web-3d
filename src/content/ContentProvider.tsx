'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { NavItem } from '../types/content';
import type { PublicContent } from './types';

// The site's editable content, handed down from the (server) site layout.
// Components read it with useContent() instead of importing the data files,
// so whatever the admin saves is what the pages show.

type ContentValue = PublicContent & { navigation: NavItem[] };

const ContentContext = createContext<ContentValue | null>(null);

function buildNavigation(content: PublicContent): NavItem[] {
  return [
    {
      label: 'Products',
      to: '/products',
      children: content.products.map((p) => ({ label: p.short, to: `/products/${p.slug}`, note: p.tagline })),
    },
    { label: 'Services', to: '/solutions' },
    {
      label: 'Industries',
      to: '/industries',
      children: content.industries.slice(0, 6).map((i) => ({ label: i.name, to: `/industries/${i.slug}` })),
    },
    { label: 'Company', to: '/company' },
    { label: 'Contact', to: '/contact' },
  ];
}

export function ContentProvider({ content, children }: { content: PublicContent; children: React.ReactNode }) {
  const value = useMemo(() => ({ ...content, navigation: buildNavigation(content) }), [content]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const value = useContext(ContentContext);
  if (!value) throw new Error('useContent must be used inside ContentProvider');
  return value;
}

export function useProduct(slug: string | undefined) {
  const { products } = useContent();
  return products.find((p) => p.slug === slug);
}

export function useIndustry(slug: string | undefined) {
  const { industries } = useContent();
  return industries.find((i) => i.slug === slug);
}
