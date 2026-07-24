import React from 'react';
import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import { ArrowUp } from 'lucide-react';

function ScrollToTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 300,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={trigger}>
      <Fab
        size="small"
        aria-label="scroll back to top"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 1000,
          background: '#18181C',
          color: '#ffffff',
          border: '1px solid #2A2A30',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
          '&:hover': {
            background: '#2563eb',
            borderColor: '#2563eb',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <ArrowUp size={18} />
      </Fab>
    </Zoom>
  );
}

export default ScrollToTop;
