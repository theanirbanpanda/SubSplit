import React, { lazy, Suspense } from 'react';
import { Box } from '@mui/material';

import PublicNavbar from '../components/PublicNavbar';
import HeroSection from '../components/HeroSection';
import TrustStrip from '../components/TrustStrip';
import ScrollToTop from '../components/ScrollToTop';

const MarketplacePreview = lazy(() => import('../components/MarketplacePreview'));
const WhySubSplit = lazy(() => import('../components/WhySubSplit'));
const FAQSection = lazy(() => import('../components/FAQSection'));
const Footer = lazy(() => import('../components/Footer'));

function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#09090B',
        color: '#ffffff',
        overflowX: 'hidden',
      }}
    >
      <PublicNavbar />

      <HeroSection />

      <TrustStrip />

      <Suspense fallback={null}>
        <MarketplacePreview />
      </Suspense>

      <Suspense fallback={null}>
        <WhySubSplit />
      </Suspense>

      <Suspense fallback={null}>
        <FAQSection />
      </Suspense>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      <ScrollToTop />
    </Box>
  );
}

export default LandingPage;
