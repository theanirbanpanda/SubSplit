import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Tv2,
  Music,
  Video,
  Bot,
  PenTool,
  Briefcase,
  ShoppingBag,
  Flame,
} from 'lucide-react';

const PLATFORMS = [
  {
    id: 'netflix',
    name: 'Netflix Premium 4K',
    Icon: Tv2,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
    startingFrom: 129,
    savings: 80,
    listings: 42,
  },
  {
    id: 'spotify',
    name: 'Spotify Premium Family',
    Icon: Music,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
    startingFrom: 59,
    savings: 67,
    listings: 64,
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    Icon: Video,
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.12)',
    border: 'rgba(244,63,94,0.3)',
    startingFrom: 106,
    savings: 29,
    listings: 38,
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT Plus Team',
    Icon: Bot,
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
    border: 'rgba(20,184,166,0.3)',
    startingFrom: 399,
    savings: 80,
    listings: 29,
  },
  {
    id: 'amazon',
    name: 'Amazon Prime Video',
    Icon: ShoppingBag,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.3)',
    startingFrom: 79,
    savings: 47,
    listings: 31,
  },
  {
    id: 'microsoft',
    name: 'Microsoft 365 Family',
    Icon: Briefcase,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.3)',
    startingFrom: 149,
    savings: 76,
    listings: 23,
  },
  {
    id: 'adobe',
    name: 'Adobe Creative Cloud',
    Icon: PenTool,
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.3)',
    startingFrom: 499,
    savings: 85,
    listings: 18,
  },
  {
    id: 'disney',
    name: 'Disney+ Hotstar 4K',
    Icon: Flame,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.3)',
    startingFrom: 99,
    savings: 60,
    listings: 26,
  },
];

function PlatformCard({ name, Icon, color, bg, border, startingFrom, savings, listings }) {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      onClick={() => navigate('/app/marketplace')}
      sx={{
        borderRadius: '18px',
        border: '1px solid #2A2A30',
        background: '#18181C',
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: color,
          boxShadow: `0 12px 32px ${color}20`,
        },
      }}
    >
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '13px',
              background: bg,
              border: `1px solid ${border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={24} color={color} />
          </Box>

          <Chip
            label={`Save ${savings}%`}
            size="small"
            sx={{
              background: 'rgba(34,197,94,0.15)',
              color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.3)',
              fontWeight: 800,
              fontSize: '0.68rem',
              height: 22,
              borderRadius: '6px',
            }}
          />
        </Stack>

        <Typography
          sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.98rem', lineHeight: 1.3, mb: 0.5 }}
        >
          {name}
        </Typography>

        <Typography sx={{ color: '#A1A1AA', fontSize: '0.8rem', mb: 1.5 }}>
          Starting from{' '}
          <Box component="span" sx={{ fontWeight: 800, color: '#ffffff' }}>
            ₹{startingFrom}
          </Box>
          /mo
        </Typography>
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between" pt={1.5} sx={{ borderTop: '1px solid #2A2A30' }}>
        <Typography sx={{ fontSize: '0.72rem', color: '#A1A1AA', fontWeight: 600 }}>
          {listings} Live Listings
        </Typography>

        <Button
          variant="outlined"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/app/marketplace');
          }}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.75rem',
            borderRadius: '8px',
            borderColor: '#2A2A30',
            color: '#ffffff',
            py: 0.4,
            px: 1.5,
            minWidth: 'auto',
            '&:hover': {
              borderColor: color,
              background: bg,
              color: color,
            },
          }}
        >
          Explore
        </Button>
      </Stack>
    </Paper>
  );
}

function FeaturedPlatforms() {
  return (
    <Box
      id="marketplace"
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
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <Typography
            variant="overline"
            sx={{ color: '#3b82f6', fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.72rem' }}
          >
            Featured Platforms
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 900,
              color: '#ffffff',
              mt: 0.5,
              fontSize: { xs: '1.6rem', md: '2.1rem' },
              letterSpacing: '-0.03em',
            }}
          >
            All Your Favourites, at a Fraction of the Cost
          </Typography>
          <Typography
            sx={{
              color: '#A1A1AA',
              mt: 1,
              fontSize: '0.95rem',
              maxWidth: 480,
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            Browse verified groups across popular streaming, productivity, and learning platforms.
          </Typography>
        </Box>

        {/* 4-column Desktop, 2-column Mobile/Tablet Grid */}
        <Grid container spacing={2.5}>
          {PLATFORMS.map((platform) => (
            <Grid item xs={6} md={3} key={platform.id}>
              <PlatformCard {...platform} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default FeaturedPlatforms;
