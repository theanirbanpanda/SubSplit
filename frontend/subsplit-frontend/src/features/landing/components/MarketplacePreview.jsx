import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import { ArrowRight, ShieldCheck, Users, Star, Flame, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LIVE_LISTINGS = [
  {
    title: 'Netflix Premium 4K UHD',
    price: 149,
    original: 649,
    seatsLeft: 2,
    rating: 4.9,
    badge: 'Verified Host',
    tag: '🔥 Trending',
    tagColor: '#ef4444',
    tagBg: 'rgba(239,68,68,0.12)',
  },
  {
    title: 'Spotify Family Plan',
    price: 59,
    original: 179,
    seatsLeft: 4,
    rating: 4.8,
    badge: 'AI Verified',
    tag: '✨ New Listing',
    tagColor: '#3b82f6',
    tagBg: 'rgba(59,130,246,0.12)',
  },
  {
    title: 'ChatGPT Plus Team',
    price: 399,
    original: 1999,
    seatsLeft: 1,
    rating: 4.95,
    badge: 'Escrow Protected',
    tag: '⚠️ 1 Seat Left',
    tagColor: '#f59e0b',
    tagBg: 'rgba(245,158,11,0.12)',
  },
  {
    title: 'YouTube Premium Family',
    price: 106,
    original: 149,
    seatsLeft: 2,
    rating: 4.85,
    badge: 'Verified Host',
    tag: '🔥 Trending',
    tagColor: '#ef4444',
    tagBg: 'rgba(239,68,68,0.12)',
  },
  {
    title: 'Canva Pro Enterprise',
    price: 89,
    original: 499,
    seatsLeft: 5,
    rating: 4.75,
    badge: 'Escrow Protected',
    tag: '✨ New Listing',
    tagColor: '#3b82f6',
    tagBg: 'rgba(59,130,246,0.12)',
  },
  {
    title: 'Microsoft 365 Family',
    price: 149,
    original: 619,
    seatsLeft: 3,
    rating: 4.8,
    badge: 'AI Verified',
    tag: '🛡️ Verified',
    tagColor: '#22c55e',
    tagBg: 'rgba(34,197,94,0.12)',
  },
  {
    title: 'Adobe Creative Cloud All Apps',
    price: 499,
    original: 2399,
    seatsLeft: 1,
    rating: 4.9,
    badge: 'Escrow Protected',
    tag: '⚠️ 1 Seat Left',
    tagColor: '#f59e0b',
    tagBg: 'rgba(245,158,11,0.12)',
  },
  {
    title: 'Amazon Prime Video 4K',
    price: 79,
    original: 149,
    seatsLeft: 3,
    rating: 4.7,
    badge: 'Verified Host',
    tag: '🔥 Trending',
    tagColor: '#ef4444',
    tagBg: 'rgba(239,68,68,0.12)',
  },
];

function LiveListingCard({ title, price, original, seatsLeft, rating, badge, tag, tagColor, tagBg }) {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      onClick={() => navigate('/app/marketplace')}
      sx={{
        p: 2,
        borderRadius: '16px',
        border: '1px solid #2A2A30',
        background: '#18181C',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: '#3b82f6',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Chip
          label={tag}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.65rem',
            fontWeight: 800,
            background: tagBg,
            color: tagColor,
            border: `1px solid ${tagColor}44`,
            borderRadius: '6px',
          }}
        />

        <Stack direction="row" alignItems="center" spacing={0.3}>
          <Star size={12} fill="#f59e0b" color="#f59e0b" />
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffffff' }}>
            {rating}
          </Typography>
        </Stack>
      </Stack>

      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff', lineHeight: 1.3, mb: 1 }}>
        {title}
      </Typography>

      <Stack direction="row" alignItems="baseline" justifyContent="space-between">
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', color: '#3b82f6', lineHeight: 1 }}>
            ₹{price}
            <Typography component="span" sx={{ fontSize: '0.7rem', color: '#A1A1AA', ml: 0.3 }}>
              /mo
            </Typography>
          </Typography>
          <Typography sx={{ fontSize: '0.68rem', color: '#71717A', textDecoration: 'line-through' }}>
            ₹{original}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/app/marketplace');
          }}
          sx={{
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.72rem',
            py: 0.4,
            px: 1.5,
            minWidth: 'auto',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          }}
        >
          Join
        </Button>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1.25} pt={1} sx={{ borderTop: '1px solid #2A2A30' }}>
        <Stack direction="row" alignItems="center" spacing={0.4}>
          <ShieldCheck size={12} color="#22c55e" />
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#22c55e' }}>
            {badge}
          </Typography>
        </Stack>

        <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#A1A1AA' }}>
          {seatsLeft} Seats Left
        </Typography>
      </Stack>
    </Paper>
  );
}

function MarketplacePreview() {
  const navigate = useNavigate();

  return (
    <Box
      id="trending"
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
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* ── Left Column (40%) ── */}
          <Grid item xs={12} md={4.8}>
            <Chip
              icon={<Sparkles size={13} color="#3b82f6" />}
              label="Live SubSplit Marketplace"
              size="small"
              sx={{
                background: '#111114',
                color: '#3b82f6',
                fontWeight: 800,
                fontSize: '0.74rem',
                border: '1px solid #2A2A30',
                mb: 2,
                borderRadius: '8px',
                py: 0.4,
              }}
            />

            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 900,
                color: '#ffffff',
                fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.5rem' },
                lineHeight: 1.15,
                letterSpacing: '-0.035em',
                mb: 2,
              }}
            >
              Browse Active Groups Ready for Instant Joining
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#A1A1AA',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                lineHeight: 1.6,
                mb: 3.5,
              }}
            >
              Discover active, verified groups ready for instant joining with escrow protection.
            </Typography>

            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={18} />}
              onClick={() => navigate('/app/marketplace')}
              sx={{
                fontWeight: 700,
                fontSize: '0.95rem',
                px: 4,
                py: 1.3,
                borderRadius: '12px',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                  boxShadow: '0 6px 28px rgba(37, 99, 235, 0.55)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Browse Marketplace
            </Button>
          </Grid>

          {/* ── Right Column (60%) — Live Marketplace Preview Grid ── */}
          <Grid item xs={12} md={7.2}>
            <Grid container spacing={2}>
              {LIVE_LISTINGS.map((listing) => (
                <Grid item xs={12} sm={6} key={listing.title}>
                  <LiveListingCard {...listing} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default MarketplacePreview;
