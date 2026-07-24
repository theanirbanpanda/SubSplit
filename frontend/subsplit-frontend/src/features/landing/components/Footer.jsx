import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Stack,
  Link,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useLogoClick from '../../../hooks/useLogoClick';

function Footer() {
  const navigate = useNavigate();
  const handleLogoClick = useLogoClick();

  return (
    <Box component="footer" sx={{ background: '#09090B', borderTop: '1px solid #2A2A30', color: '#A1A1AA', pt: 8, pb: 4 }}>
      <Box
        sx={{
          width: '92%',
          maxWidth: '1440px',
          mx: 'auto',
        }}
      >
        <Grid container spacing={4} mb={6}>
          {/* Column 1 — Brand Wordmark */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', mb: 2 }}
              onClick={handleLogoClick}
            >
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: '1.4rem',
                  color: '#ffffff',
                  letterSpacing: '-0.04em',
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                Sub<Box component="span" sx={{ color: '#3b82f6' }}>Split</Box>
              </Typography>
            </Box>

            <Typography sx={{ fontSize: '0.88rem', color: '#A1A1AA', lineHeight: 1.7, maxWidth: 300, mb: 2 }}>
              India's premier marketplace for verified subscription sharing. Save up to 80% with escrow security and AI listing verification.
            </Typography>
          </Grid>

          {/* Column 2 — Marketplace */}
          <Grid item xs={6} sm={4} md={2.5}>
            <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', mb: 2.5 }}>
              Marketplace
            </Typography>
            <Stack spacing={1.25}>
              {['Browse Plans', 'Popular Platforms', 'Become a Host'].map((link) => (
                <Link
                  key={link}
                  underline="none"
                  onClick={() => navigate('/app/marketplace')}
                  sx={{
                    color: '#A1A1AA',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    '&:hover': { color: '#3b82f6' },
                    transition: 'color 0.15s ease',
                  }}
                >
                  {link}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Column 3 — Company */}
          <Grid item xs={6} sm={4} md={2.5}>
            <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', mb: 2.5 }}>
              Company
            </Typography>
            <Stack spacing={1.25}>
              {['About', 'Blog', 'Careers', 'Contact'].map((link) => (
                <Link
                  key={link}
                  underline="none"
                  href="#"
                  sx={{
                    color: '#A1A1AA',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    '&:hover': { color: '#3b82f6' },
                    transition: 'color 0.15s ease',
                  }}
                >
                  {link}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Column 4 — Support */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', mb: 2.5 }}>
              Support & Legal
            </Typography>
            <Stack spacing={1.25}>
              {['Help Center', 'Safety & Verification', 'Privacy Policy', 'Terms & Conditions'].map((link) => (
                <Link
                  key={link}
                  underline="none"
                  href="#"
                  sx={{
                    color: '#A1A1AA',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    '&:hover': { color: '#3b82f6' },
                    transition: 'color 0.15s ease',
                  }}
                >
                  {link}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: '#2A2A30', mb: 4 }} />

        {/* Bottom Bar */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography sx={{ fontSize: '0.8rem', color: '#71717A' }}>
            © {new Date().getFullYear()} SubSplit. All rights reserved.
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#71717A' }}>
            Made with ❤️ in India
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

export default Footer;
