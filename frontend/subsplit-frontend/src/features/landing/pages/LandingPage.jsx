import React from 'react';
import { Box } from '@mui/material';
import PublicNavbar from '../components/PublicNavbar';
import HeroSection from '../components/HeroSection';
import TrustStrip from '../components/TrustStrip';
import FeaturedPlatforms from '../components/FeaturedPlatforms';
import MarketplacePreview from '../components/MarketplacePreview';
import WhySubSplit from '../components/WhySubSplit';
import SavingsComparison from '../components/SavingsComparison';
import HowItWorks from '../components/HowItWorks';
import FAQSection from '../components/FAQSection';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', background: '#09090B', color: '#ffffff', overflowX: 'hidden' }}>
      <PublicNavbar />
      <HeroSection />
      <TrustStrip />
      <FeaturedPlatforms />
      <MarketplacePreview />
      <WhySubSplit />
      <SavingsComparison />
      <HowItWorks />
      <FAQSection />
      <FinalCTA />
      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export default LandingPage;
