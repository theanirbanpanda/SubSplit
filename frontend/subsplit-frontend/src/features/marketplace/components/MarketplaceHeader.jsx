import React from 'react';
import { Box, Grid, Typography, Paper, Stack } from '@mui/material';
import { ShieldCheck, TrendingDown, Users, Sparkles } from 'lucide-react';

const METRICS = [
  {
    value: '240+',
    label: 'Active Listings',
    icon: Sparkles,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.3)',
  },
  {
    value: '180+',
    label: 'Verified Hosts',
    icon: ShieldCheck,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
  },
  {
    value: '₹12.5L+',
    label: 'Saved This Month',
    icon: TrendingDown,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.3)',
  },
  {
    value: '₹450',
    label: 'Avg Monthly Savings',
    icon: Users,
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.3)',
  },
];

function MarketplaceHeader() {
  return (
    <Box sx={{ pt: { xs: 10, md: 13 }, pb: 4, background: '#09090B', color: '#ffffff' }}>
      <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
        {/* ── Left Side (50%) ── */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="overline"
            sx={{
              color: '#3b82f6',
              fontWeight: 800,
              letterSpacing: '0.1em',
              fontSize: '0.74rem',
            }}
          >
            SubSplit Marketplace
          </Typography>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 900,
              color: '#ffffff',
              fontSize: { xs: '1.85rem', sm: '2.4rem', md: '2.75rem' },
              lineHeight: 1.15,
              letterSpacing: '-0.035em',
              mt: 0.5,
              mb: 1.5,
            }}
          >
            Browse Premium Subscription Groups
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#A1A1AA',
              fontSize: { xs: '0.98rem', md: '1.08rem' },
              lineHeight: 1.6,
              maxWidth: 500,
            }}
          >
            Discover verified group listings across OTT, music, AI, and productivity tools. Pay only your fair share with escrow security.
          </Typography>
        </Grid>

        {/* ── Right Side (50%) — Metrics Panel ── */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {METRICS.map(({ value, label, icon: Icon, color, bg, border }) => (
              <Grid item xs={6} key={label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.25,
                    borderRadius: '16px',
                    background: '#111114',
                    border: '1px solid #2A2A30',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      borderColor: color,
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        background: bg,
                        border: `1px solid ${border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} color={color} />
                    </Box>

                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: '1.2rem', md: '1.4rem' },
                        color: '#ffffff',
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </Typography>
                  </Stack>

                  <Typography sx={{ fontSize: '0.78rem', color: '#A1A1AA', fontWeight: 600 }}>
                    {label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MarketplaceHeader;
