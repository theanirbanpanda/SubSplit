import React from 'react';
import { Box, Grid, Typography, Stack } from '@mui/material';
import { ShieldCheck, Lock, Zap, Star, TrendingDown, Users } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    color: '#22c55e',
    value: 'Verified Hosts',
    label: 'KYC Verified',
  },
  {
    icon: Lock,
    color: '#3b82f6',
    value: 'Escrow Protected',
    label: '100% Safe Payment',
  },
  {
    icon: Zap,
    color: '#a855f7',
    value: 'Instant Access',
    label: '< 2 Min Delivery',
  },
  {
    icon: Star,
    color: '#f59e0b',
    value: '4.9 Avg Rating',
    label: '10K+ Reviews',
  },
  {
    icon: TrendingDown,
    color: '#10b981',
    value: '₹ 12L+ Saved',
    label: 'Monthly Savings',
  },
  {
    icon: Users,
    color: '#06b6d4',
    value: '50K+ Members',
    label: 'Active Nationwide',
  },
];

function TrustStrip() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 2.5, md: 3 },
        background: '#111114',
        borderTop: '1px solid #2A2A30',
        borderBottom: '1px solid #2A2A30',
        backdropFilter: 'blur(16px)',
      }}
    >
      <Box
        sx={{
          width: '92%',
          maxWidth: '1440px',
          mx: 'auto',
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} alignItems="center" justifyContent="space-between">
          {TRUST_ITEMS.map(({ icon: Icon, color, value, label }) => (
            <Grid item xs={6} sm={4} md={2} key={value}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  p: 1.25,
                  px: 1.75,
                  borderRadius: '12px',
                  background: '#18181C',
                  border: '1px solid #2A2A30',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: color,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 16px ${color}20`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '9px',
                    background: `${color}15`,
                    border: `1px solid ${color}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={color} />
                </Box>
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      color: '#ffffff',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {value}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.68rem',
                      color: '#A1A1AA',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default TrustStrip;
