import React, { lazy, Suspense } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../../../utils/tokenUtils';

import PublicNavbar from '../components/PublicNavbar';
import HeroSection from '../components/HeroSection';
import TrustStrip from '../components/TrustStrip';
import ScrollToTop from '../components/ScrollToTop';

const MarketplacePreview = lazy(() => import('../components/MarketplacePreview'));
const WhySubSplit = lazy(() => import('../components/WhySubSplit'));
const FAQSection = lazy(() => import('../components/FAQSection'));
const Footer = lazy(() => import('../components/Footer'));

function LandingPage() {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const currentToken = token || localStorage.getItem('token');
  const isAuth = isAuthenticated && !!currentToken && isTokenValid(currentToken);

  if (isAuth) {
    return <Navigate to="/app/marketplace" replace />;
  }

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
