import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import { Search, Shield, Sparkles } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: Search,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.3)',
    title: 'Choose a Plan',
    description:
      'Browse hundreds of verified subscription listings across platforms. Filter by price, seats, and verification status.',
  },
  {
    number: '02',
    icon: Shield,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
    title: 'Pay Securely',
    description:
      'Your payment stays in escrow and is only released to the host after you confirm successful access.',
  },
  {
    number: '03',
    icon: Sparkles,
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.3)',
    title: 'Enjoy & Save',
    description:
      'Start using premium services immediately while paying only your fair share — no hidden fees.',
  },
];

function StepCard({ number, icon: Icon, color, bg, border, title, description, isLast }) {
  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px',
          border: '1px solid #2A2A30',
          background: '#111114',
          p: { xs: 3, md: 3.5 },
          height: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: color,
            boxShadow: `0 12px 40px ${color}18`,
          },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Step number — large faded background */}
        <Typography
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: -10,
            right: 16,
            fontSize: '5rem',
            fontWeight: 900,
            color: `${color}18`,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {number}
        </Typography>

        {/* Icon */}
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
            mb: 2.5,
          }}
        >
          <Icon size={24} color={color} />
        </Box>

        {/* Step badge */}
        <Box
          sx={{
            display: 'inline-block',
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: '6px',
            px: 1,
            py: 0.3,
            mb: 1.25,
          }}
        >
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color, letterSpacing: '0.07em' }}>
            STEP {number}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: '#ffffff',
            mb: 1,
            fontSize: '1.05rem',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: '#A1A1AA', lineHeight: 1.7, fontSize: '0.87rem' }}
        >
          {description}
        </Typography>
      </Paper>

      {/* Desktop connector arrow */}
      {!isLast && (
        <Box
          aria-hidden="true"
          sx={{
            display: { xs: 'none', md: 'flex' },
            position: 'absolute',
            top: '50%',
            right: { md: '-28px' },
            transform: 'translateY(-50%)',
            zIndex: 2,
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#18181C',
            border: '1.5px solid #2A2A30',
          }}
        >
          <Typography sx={{ fontSize: '0.9rem', color: '#A1A1AA', lineHeight: 1 }}>→</Typography>
        </Box>
      )}
    </Box>
  );
}

function HowItWorks() {
  return (
    <Box
      id="how-it-works"
      component="section"
      sx={{ py: { xs: 5, md: 7 }, background: '#09090B', borderTop: '1px solid #2A2A30' }}
    >
      <Box
        sx={{
          width: '92%',
          maxWidth: '1440px',
          mx: 'auto',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <Typography
            variant="overline"
            sx={{ color: '#3b82f6', fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.72rem' }}
          >
            How It Works
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 900,
              color: '#ffffff',
              mt: 0.5,
              fontSize: { xs: '1.5rem', md: '1.9rem' },
              letterSpacing: '-0.03em',
            }}
          >
            Start saving in 3 simple steps
          </Typography>
          <Typography
            sx={{
              color: '#A1A1AA',
              mt: 1,
              fontSize: '0.95rem',
              maxWidth: 460,
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            Simple, safe, and transparent subscription sharing from browse to access in minutes.
          </Typography>
        </Box>

        {/* Steps grid */}
        <Grid container spacing={3} alignItems="stretch">
          {STEPS.map((step, index) => (
            <Grid item xs={12} md={4} key={step.number}>
              <StepCard {...step} isLast={index === STEPS.length - 1} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default HowItWorks;
