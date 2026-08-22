import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import PublicNavbar from '../../features/landing/components/PublicNavbar';
import Footer from '../../features/landing/components/Footer';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function InfoLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        background: '#09090B',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ScrollToTop />
      <PublicNavbar />
      
      {/* Spacer for fixed navbar */}
      <Box sx={{ height: { xs: 60, md: 80 } }} />
      
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}

export default InfoLayout;
