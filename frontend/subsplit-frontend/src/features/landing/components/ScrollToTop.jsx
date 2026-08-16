import React, { useState, useEffect } from 'react';
import { Fab, Zoom, Tooltip } from '@mui/material';
import { ArrowUp } from 'lucide-react';

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const mainEl = document.querySelector('main');
      const mainScroll = mainEl ? mainEl.scrollTop : 0;
      const winScroll = window.scrollY || document.documentElement.scrollTop || 0;
      if (mainScroll > 250 || winScroll > 250) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.addEventListener('scroll', checkScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', checkScroll);
      if (mainEl) {
        mainEl.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Zoom in={visible}>
      <Tooltip title="Scroll to top" placement="left" arrow>
        <Fab
          size="medium"
          aria-label="scroll back to top"
          onClick={handleClick}
          sx={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 1100,
            background: 'linear-gradient(135deg, #18181C 0%, #111114 100%)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              borderColor: '#3b82f6',
              boxShadow: '0 10px 35px rgba(37, 99, 235, 0.5)',
              transform: 'translateY(-3px) scale(1.05)',
            },
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </Fab>
      </Tooltip>
    </Zoom>
  );
}

export default ScrollToTop;

