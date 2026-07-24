import React, { useState } from 'react';
import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useScrollTrigger,
} from '@mui/material';
import { Menu as MenuIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useLogoClick from '../../../hooks/useLogoClick';
import { NAV_LINKS } from '../data/navigation';
import styles from './PublicNavbar.module.scss';

function PublicNavbar() {
  const navigate = useNavigate();
  const handleLogoClick = useLogoClick();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 40,
  });

  const handleNavClick = (href) => {
    setDrawerOpen(false);
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
            <div
              className={styles.logo}
              onClick={handleLogoClick}
              role="link"
              tabIndex={0}
              aria-label="SubSplit home"
              onKeyDown={(e) => e.key === 'Enter' && handleLogoClick()}
            >
              <span className={styles.logoText}>
                Sub<span className={styles.logoAccent}>Split</span>
              </span>
            </div>

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

            {/* ── Mobile Hamburger ── */}
            <IconButton
              aria-label="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
              className={styles.hamburger}
            >
              <MenuIcon size={24} />
            </IconButton>
          </div>
        </div>
      </AppBar>

      {/* ── Mobile Drawer ── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ className: styles.drawerPaper }}
      >
        <div className={styles.drawerHeader}>
          <span className={styles.logoText}>
            Sub<span className={styles.logoAccent}>Split</span>
          </span>
          <IconButton
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            size="small"
            sx={{ color: '#A1A1AA' }}
          >
            <X size={20} />
          </IconButton>
        </div>

        <Divider sx={{ mb: 1, borderColor: '#2A2A30' }} />

        <List sx={{ px: 1.5 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(href)}
                className={styles.drawerLink}
              >
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    color: '#A1A1AA',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2, borderColor: '#2A2A30' }} />

        <div className={styles.drawerActions}>
          <button
            className={styles.ctaSecondary}
            onClick={() => { setDrawerOpen(false); navigate('/auth'); }}
            type="button"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Login
          </button>
          <button
            className={styles.signupBtn}
            onClick={() => { setDrawerOpen(false); navigate('/auth'); }}
            type="button"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Sign Up
          </button>
        </div>
      </Drawer>
    </>
  );
}

export default PublicNavbar;
