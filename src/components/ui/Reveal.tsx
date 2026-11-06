'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Content is simply there. (It used to fade in on scroll: until the script ran,
 * or for anyone scrolling fast, whole sections stood empty.)
 */
export function Reveal({ children, className = '' }: Props) {
  return <div className={className}>{children}</div>;
}
