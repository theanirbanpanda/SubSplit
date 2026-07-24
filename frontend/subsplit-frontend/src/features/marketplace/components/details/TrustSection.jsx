import React from 'react';
import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import { TrendingDown, Zap, ShieldCheck, Lock } from 'lucide-react';

const WHY_LISTING_CARDS = [
  {
    icon: TrendingDown,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
    title: 'Lowest Monthly Cost',
    description: 'Pay only your fair share of the multi-screen family subscription.',
  },
  {
    icon: Zap,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.3)',
    title: 'Instant Digital Access',
    description: 'Automated invite link delivered to your dashboard in under 2 minutes.',
  },
  {
    icon: ShieldCheck,
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.3)',
    title: 'Trusted KYC Host',
    description: 'Identity verified host with high ratings and fast response times.',
  },
  {
    icon: Lock,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.3)',
    title: 'Protected Payments',
    description: 'SubSplit escrow holds funds until you verify active access.',
  },
];

function TrustSection() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', mb: 2, fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
        Why Join This Listing
      </Typography>

      <Grid container spacing={2}>
        {WHY_LISTING_CARDS.map(({ icon: Icon, color, bg, border, title, description }) => (
          <Grid item xs={12} sm={6} key={title}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '18px',
                background: '#111114',
                border: '1px solid #2A2A30',
                height: '100%',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: color,
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} mb={1.25}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '11px',
                    background: bg,
                    border: `1px solid ${border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} color={color} />
                </Box>

                <Typography sx={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff' }}>
                  {title}
                </Typography>
              </Stack>

              <Typography sx={{ fontSize: '0.85rem', color: '#A1A1AA', lineHeight: 1.5 }}>
                {description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default TrustSection;
