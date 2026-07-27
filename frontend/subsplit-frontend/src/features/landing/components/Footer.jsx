import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useLogoClick from '../../../hooks/useLogoClick';
import { FOOTER_COLUMNS, SOCIAL_LINKS, PAYMENT_METHODS } from '../data/footer';
import styles from './Footer.module.scss';

/* ── Inline Social Icon SVGs ── */
function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  );
}

const SOCIAL_ICON_MAP = {
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  discord: DiscordIcon,
  github: GitHubIcon,
};

function Footer() {
  const navigate = useNavigate();
  const handleLogoClick = useLogoClick();
  const [email, setEmail] = useState('');
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLinkClick = (link) => {
    if (link.isRoute) {
      navigate(link.href);
    } else if (link.href.startsWith('#')) {
      const el = document.querySelector(link.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer
      className={styles.footer}
      ref={footerRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <div className={styles.container}>
        {/* ── Top Grid ── */}
        <div className={styles.topGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
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
                gap: 1
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
            <p className={styles.brandTagline}>
              The smartest way to share subscriptions and save more every month.
            </p>
            <div className={styles.socialRow}>
              {SOCIAL_LINKS.map(({ label, icon, href }) => {
                const IconComp = SOCIAL_ICON_MAP[icon];
                return (
                  <a
                    key={label}
                    href={href}
                    className={styles.socialIcon}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {IconComp && <IconComp />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_COLUMNS.map(({ title, links }) => (
            <div className={styles.linkCol} key={title}>
              <h4 className={styles.colTitle}>{title}</h4>
              <div className={styles.colLinks}>
                {links.map((link) => (
                  <button
                    key={link.label}
                    className={styles.colLink}
                    onClick={() => handleLinkClick(link)}
                    type="button"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className={styles.newsletterCol}>
            <h4 className={styles.newsletterTitle}>Stay Updated</h4>
            <p className={styles.newsletterDesc}>
              Get the latest deals and offers in your inbox.
            </p>
            <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                className={styles.newsletterInput}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className={styles.newsletterBtn}
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className={styles.divider} />

        {/* ── Bottom Bar ── */}
        <div className={styles.bottomBar}>
          <span className={styles.copyright}>
            © 2026 SubSplit. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
