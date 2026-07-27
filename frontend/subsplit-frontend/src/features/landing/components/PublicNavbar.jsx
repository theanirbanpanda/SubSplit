import React, { useState } from 'react';
import {
  AppBar,
  useScrollTrigger,
  Box,
  Typography,
} from '@mui/material';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useLogoClick from '../../../hooks/useLogoClick';
import { NAV_LINKS } from '../data/navigation';
import styles from './PublicNavbar.module.scss';

function PublicNavbar() {
  const navigate = useNavigate();
  const handleLogoClick = useLogoClick();

  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 40,
  });

  const handleNavClick = (href) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        className={scrolled ? styles.navbarScrolled : styles.navbarTransparent}
        sx={{ color: '#ffffff', boxShadow: 'none' }}
      >
        <div className={styles.container}>
          <div className={styles.toolbar}>
            {/* ── Logo ── */}
            <Box 
              onClick={handleLogoClick}
              role="link"
              tabIndex={0}
              aria-label="SubSplit home"
              onKeyDown={(e) => e.key === 'Enter' && handleLogoClick()}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                gap: 1,
                mr: 'auto', // Pushes everything else to the right
              }}
            >
              <Box sx={{ 
                width: 28, 
                height: 28, 
                background: '#22c55e', 
                borderRadius: '6px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#09090b'
              }}>
                <Shield size={16} fill="currentColor" />
              </Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: '1.35rem',
                  color: '#ffffff',
                  letterSpacing: '-0.04em',
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                Sub<Box component="span" sx={{ color: '#22c55e' }}>Split</Box>
              </Typography>
            </Box>

            {/* ── Desktop Nav Links ── */}
            <nav className={styles.navLinks} aria-label="Primary navigation">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  className={styles.navLink}
                  onClick={() => handleNavClick(href)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* ── Auth Buttons ── */}
            <div className={styles.authButtons}>
              <button
                className={styles.loginBtn}
                onClick={() => navigate('/auth')}
                type="button"
              >
                Login
              </button>
              <button
                className={styles.signupBtn}
                onClick={() => navigate('/auth')}
                type="button"
              >
                Sign Up
              </button>
            </div>

          </div>
        </div>
      </AppBar>
    </>
  );
}

export default PublicNavbar;
