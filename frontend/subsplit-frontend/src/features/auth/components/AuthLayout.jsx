import React from 'react';
import { Box } from '@mui/material';

function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0d0e11',
        color: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        p: { xs: 2, sm: 4 },
        overflow: 'hidden',
      }}
    >
      {/* Background Radial Glow */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '300px', md: '700px' },
          height: { xs: '300px', md: '700px' },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Faint Abstract Mesh Grid */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 0.75px, transparent 0.75px)',
          backgroundSize: '24px 24px',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      />

      {/* ── CENTERED AUTHENTICATION CARD (Focal Point — Max 500px) ── */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 500,
          mx: 'auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default AuthLayout;
