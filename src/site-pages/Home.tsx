'use client';

import React from 'react';
import { Hero } from '../components/home/Hero';
import { ServicesSection } from '../components/home/ServicesSection';
import { ProductGrid } from '../components/product/ProductGrid';
import { IndustriesBand } from '../components/home/IndustriesBand';
import { AboutCTA } from '../components/home/AboutCTA';
import { StatementBand } from '../components/home/StatementBand';
import { InsightsSection } from '../components/home/InsightsSection';

// The home page: the slogan, the brochure's line, the five things we do, the
// products, where we work, the latest articles by topic, who we are and how
// to reach us.
export function Home() {
  return (
    <>
      <Hero />
      <StatementBand />
      <ServicesSection />
      <ProductGrid />
      <IndustriesBand />
      <InsightsSection />
      <AboutCTA />
    </>);

}
