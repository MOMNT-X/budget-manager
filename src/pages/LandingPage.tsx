import React from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import ProductHighlights from '@/components/landing/ProductHighlights';
import InteractiveDemo from '@/components/landing/InteractiveDemo';
import FeatureDeepDive from '@/components/landing/FeatureDeepDive';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import SecurityTrust from '@/components/landing/SecurityTrust';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';
import SmoothScroll from '@/components/landing/SmoothScroll';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SmoothScroll />
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Product Highlights */}
      <ProductHighlights />
      
      {/* Interactive Demo */}
      <InteractiveDemo />
      
      {/* Feature Deep Dive */}
      <FeatureDeepDive />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Pricing */}
      <Pricing />
      
      {/* Security & Trust */}
      <SecurityTrust />
      
      {/* FAQ */}
      <FAQ />
      
      {/* Final CTA */}
      <FinalCTA />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;