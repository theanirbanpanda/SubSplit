import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Grid,
} from '@mui/material';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Users,
  Flame,
  TrendingDown,
  Tv2,
  Music,
  Video,
  Bot,
  Briefcase,
  PenTool,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TRUST_CHECK_ITEMS = [
  'Verified Hosts',
  'Secure Payments',
  'Instant Access',
];

const COMPACT_CARDS = [
  {
    title: 'Netflix Premium 4K',
    price: 129,
    original: 649,
    savings: 80,
    seatsLeft: 2,
    rating: 4.9,
    badge: 'Verified Host',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
    Icon: Tv2,
  },
  {
    title: 'Spotify Family Plan',
    price: 59,
    original: 179,
    savings: 67,
    seatsLeft: 4,
    rating: 4.8,
    badge: 'AI Verified',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
    Icon: Music,
  },
  {
    title: 'ChatGPT Plus Team',
    price: 399,
    original: 1999,
    savings: 80,
    seatsLeft: 3,
    rating: 4.95,
    badge: 'Escrow Protected',
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
    border: 'rgba(20,184,166,0.3)',
    Icon: Bot,
  },
  {
    title: 'YouTube Premium',
    price: 106,
    original: 149,
    savings: 29,
    seatsLeft: 2,
    rating: 4.85,
    badge: 'Verified Host',
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.12)',
    border: 'rgba(244,63,94,0.3)',
    Icon: Video,
  },
  {
    title: 'Microsoft 365 Family',
    price: 149,
    original: 619,
    savings: 76,
    seatsLeft: 3,
    rating: 4.8,
    badge: 'AI Verified',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.3)',
    Icon: Briefcase,
  },
  {
    title: 'Canva Pro Enterprise',
    price: 89,
    original: 499,
    savings: 82,
    seatsLeft: 5,
    rating: 4.7,
    badge: 'Escrow Protected',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.3)',
    Icon: PenTool,
  },
];

function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      sx={{
        pt: { xs: 11, md: 14 },
        pb: { xs: 6, md: 8 },
        minHeight: { md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        background: '#09090B',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      {/* Background Dark Radial Glow */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '-150px',
          right: '-100px',
          width: { xs: '300px', md: '600px' },
          height: { xs: '300px', md: '600px' },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          width: '92%',
          maxWidth: '1440px',
          mx: 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* ─── LEFT COLUMN (50%) ─── */}
          <Grid item xs={12} md={6}>
            {/* Eyebrow badge */}
            <Chip
              icon={<Sparkles size={13} color="#3b82f6" />}
              label="India's #1 Subscription Sharing Marketplace"
              size="small"
              sx={{
                background: '#111114',
                color: '#3b82f6',
                fontWeight: 700,
                fontSize: '0.74rem',
                border: '1px solid #2A2A30',
                mb: 2.5,
                borderRadius: '8px',
                py: 0.4,
                '& .MuiChip-icon': { ml: 0.8 },
              }}
            />

            {/* Headline — Max 2 lines */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 900,
                color: '#ffffff',
                fontSize: { xs: '2rem', sm: '2.6rem', md: '3.1rem' },
                lineHeight: 1.12,
                letterSpacing: '-0.035em',
                mb: 2,
              }}
            >
              Stop Paying Full Price for{' '}
              <Box
                component="span"
                sx={{
                  color: '#3b82f6',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '4px',
                    left: 0,
                    width: '100%',
                    height: '3px',
                    background: 'rgba(59,130,246,0.4)',
                    borderRadius: '2px',
                  },
                }}
              >
                Premium Subscriptions.
              </Box>
            </Typography>

            {/* Short supporting paragraph — Max 2 lines */}
            <Typography
              variant="body1"
              sx={{
                color: '#A1A1AA',
                fontSize: { xs: '1rem', md: '1.08rem' },
                lineHeight: 1.6,
                mb: 3.5,
                fontWeight: 500,
                maxWidth: '520px',
              }}
            >
              Join verified subscription groups, save up to 80%, and enjoy instant access protected by escrow security.
            </Typography>

            {/* Two Action Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3.5}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowRight size={18} />}
                onClick={() => navigate('/app/marketplace')}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  px: 3.75,
                  py: 1.4,
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

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/auth')}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.98rem',
                  px: 3.75,
                  py: 1.4,
                  borderRadius: '12px',
                  textTransform: 'none',
                  borderColor: '#2A2A30',
                  color: '#ffffff',
                  background: '#111114',
                  '&:hover': {
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    background: '#18181C',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Become a Host
              </Button>
            </Stack>

            {/* Single Horizontal Trust Row */}
            <Stack direction="row" alignItems="center" spacing={2.5} flexWrap="wrap">
              {TRUST_CHECK_ITEMS.map((item) => (
                <Stack direction="row" alignItems="center" spacing={0.75} key={item}>
                  <CheckCircle2 size={16} color="#22c55e" />
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#A1A1AA' }}>
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          {/* ─── RIGHT COLUMN (50%) — DOMINANT INTERACTIVE MARKETPLACE COMPOSITION ─── */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                p: { xs: 2, sm: 2.5 },
                borderRadius: '24px',
                background: '#111114',
                border: '1px solid #2A2A30',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
              }}
            >
              {/* Floating Banner Chips */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Chip
                  icon={<Flame size={14} color="#f43f5e" />}
                  label="🔥 Trending Marketplace"
                  size="small"
                  sx={{
                    background: 'rgba(244,63,94,0.15)',
                    color: '#f43f5e',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    border: '1px solid rgba(244,63,94,0.3)',
                    borderRadius: '8px',
                  }}
                />

                <Chip
                  icon={<Users size={13} color="#3b82f6" />}
                  label="8,000+ Active Members"
                  size="small"
                  sx={{
                    background: 'rgba(59,130,246,0.15)',
                    color: '#3b82f6',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: '8px',
                  }}
                />

                <Chip
                  label="98% Success"
                  size="small"
                  sx={{
                    background: 'rgba(34,197,94,0.15)',
                    color: '#22c55e',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: '8px',
                    display: { xs: 'none', sm: 'inline-flex' },
                  }}
                />
              </Stack>

              {/* 2-Column Dense Grid of 6 Dark Marketplace Cards */}
              <Grid container spacing={1.75}>
                {COMPACT_CARDS.map(({ title, price, original, savings, seatsLeft, badge, color, bg, border, Icon }) => (
                  <Grid item xs={12} sm={6} key={title}>
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
                          boxShadow: `0 10px 28px rgba(0,0,0,0.5)`,
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              width: 34,
                              height: 34,
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
                          <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#ffffff', lineHeight: 1.2 }}>
                            {title}
                          </Typography>
                        </Stack>

                        <Chip
                          label={`-${savings}%`}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            background: 'rgba(34,197,94,0.15)',
                            color: '#22c55e',
                            border: '1px solid rgba(34,197,94,0.3)',
                            borderRadius: '5px',
                          }}
                        />
                      </Stack>

                      {/* Price & Seats row */}
                      <Stack direction="row" alignItems="baseline" justifyContent="space-between" mt={1.25}>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#3b82f6', lineHeight: 1 }}>
                            ₹{price}
                            <Typography component="span" sx={{ fontSize: '0.7rem', color: '#A1A1AA', ml: 0.3 }}>
                              /mo
                            </Typography>
                          </Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: '#71717A', textDecoration: 'line-through' }}>
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

                      {/* Footer info line */}
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1.25} pt={1} sx={{ borderTop: '1px solid #2A2A30' }}>
                        <Stack direction="row" alignItems="center" spacing={0.3}>
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
                  </Grid>
                ))}
              </Grid>

              {/* Bottom Floating Savings Chip */}
              <Box
                sx={{
                  mt: 2,
                  p: 1.25,
                  px: 2,
                  borderRadius: '12px',
                  background: '#18181C',
                  border: '1px solid rgba(34,197,94,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TrendingDown size={18} color="#22c55e" />
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#22c55e' }}>
                    Escrow Protected Transactions
                  </Typography>
                </Stack>
                <Chip
                  label="₹450 Avg Saved / mo"
                  size="small"
                  sx={{
                    background: 'rgba(34,197,94,0.15)',
                    color: '#22c55e',
                    fontWeight: 800,
                    fontSize: '0.68rem',
                    borderRadius: '6px',
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default HeroSection;
