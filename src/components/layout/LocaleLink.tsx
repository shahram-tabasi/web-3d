'use client';

// next/link that keeps the visitor in their language: on /fa pages,
// href="/products" points at /fa/products, so search engines follow the
// Persian pages from one to the next.
import React from 'react';
import NextLink from 'next/link';
import { useI18n } from '../../i18n';
import { localizePath } from '../../i18n-routing';

type Props = React.ComponentProps<typeof NextLink>;

const LocaleLink = React.forwardRef<HTMLAnchorElement, Props>(function LocaleLink({ href, ...rest }, ref) {
  const { locale } = useI18n();
  const to = typeof href === 'string' ? localizePath(href, locale) : href;
  return <NextLink ref={ref} href={to} {...rest} />;
});

export default LocaleLink;
