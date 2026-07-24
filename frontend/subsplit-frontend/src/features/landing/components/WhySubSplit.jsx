import React from 'react';
import { Box, Grid, Typography, Paper, Stack, Chip } from '@mui/material';
import { ShieldCheck, UserCheck, Zap, Scale } from 'lucide-react';

const WHY_FEATURES = [
  {
    icon: UserCheck,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.3)',
    title: 'Verified Hosts',
    description: 'Every subscription host undergoes identity verification before listing any slot on the marketplace.',
    metric: '99.8% Success Rate',
  },
  {
    icon: ShieldCheck,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
    title: 'Secure Escrow Payments',
    description: 'Your money is safely locked in escrow and only released to the host after you verify credential access.',
    metric: '100% Guaranteed',
  },
  {
    icon: Zap,
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.3)',
    title: 'Instant Digital Access',
    description: 'Credentials and invite links are encrypted and transmitted through protected, automated systems.',
    metric: '< 2 Min Access',
  },
  {
    icon: Scale,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.3)',
    title: 'Smart Dispute Resolution',
    description: 'Automated AI checks and human resolution ensure immediate refunds if credentials ever fail.',
    metric: '24/7 Shield',
  },
];

function WidgetCard({ icon: Icon, color, bg, border, title, description, metric }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '22px',
        border: '1px solid #2A2A30',
        background: '#111114',
        p: { xs: 3, sm: 4 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: color,
          boxShadow: `0 16px 40px rgba(0,0,0,0.6)`,
        },
      }}
    >
      {/* Large subtle background glow */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              background: bg,
              border: `1px solid ${border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={26} color={color} />
          </Box>

          <Chip
            label={metric}
            size="small"
            sx={{
              background: bg,
              color: color,
              fontWeight: 800,
              fontSize: '0.74rem',
              border: `1px solid ${border}`,
              borderRadius: '8px',
              px: 0.5,
            }}
          />
        </Stack>

        <Typography
          variant="h5"
          sx={{ fontWeight: 900, color: '#ffffff', mb: 1.25, fontSize: '1.3rem', letterSpacing: '-0.02em' }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: '#A1A1AA', lineHeight: 1.65, fontSize: '0.92rem' }}
        >
          {description}
        </Typography>
      </Box>
    </Paper>
  );
}

function WhySubSplit() {
  return (
    <Box
      id="safety"
      component="section"
      sx={{ py: { xs: 6, md: 8 }, background: '#09090B', borderTop: '1px solid #2A2A30' }}
    >
      <Box
        sx={{
          width: '92%',
          maxWidth: '1440px',
          mx: 'auto',
        }}
      >
        {/* Section label */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <Typography
            variant="overline"
            sx={{
              color: '#3b82f6',
              fontWeight: 800,
              letterSpacing: '0.1em',
              fontSize: '0.74rem',
            }}
          >
            Why SubSplit
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: '#ffffff',
              mt: 0.5,
              fontSize: { xs: '1.6rem', md: '2.1rem' },
              letterSpacing: '-0.03em',
            }}
          >
            Built for trust, designed for savings
          </Typography>
        </Box>

        {/* 2 x 2 Linear-style Desktop Grid */}
        <Grid container spacing={3} alignItems="stretch">
          {WHY_FEATURES.map((item) => (
            <Grid item xs={12} md={6} key={item.title}>
              <WidgetCard {...item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default WhySubSplit;
