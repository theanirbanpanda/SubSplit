import React from 'react';
import { Box } from '@mui/material';
import LandingPage from '../../landing/pages/LandingPage';

function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Background Layer: Landing Page */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: 'none', // Prevent interaction with landing page elements
        }}
      >
        <LandingPage />
      </Box>

      {/* Blur Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(9, 9, 11, 0.65)', // Tasteful dark overlay
        }}
      />

      {/* Foreground Layer: Auth Card Container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
          overflowY: 'auto',
        }}
      >
        {/* ── CENTERED AUTHENTICATION CARD (Focal Point) ── */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            mx: 'auto',
            transform: 'translateY(-5%)', // Slight upward shift for flying effect
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default AuthLayout;
