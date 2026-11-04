'use client';

import React from 'react';
import { Hero } from '../components/home/Hero';
import { ServicesSection } from '../components/home/ServicesSection';
import { ProductCarousel } from '../components/product/ProductCarousel';
import { IndustriesBand } from '../components/home/IndustriesBand';
import { AboutCTA } from '../components/home/AboutCTA';

// The home page tells the brochure's story and nothing more: what we bridge,
// the five things we do, the products, where we work, who we are and how to
// reach us.
export function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <ProductCarousel heading="h2" />
      <IndustriesBand />
      <AboutCTA />
    </>);

}
