import React from 'react';
import { Box, Typography, Stack, Paper, Chip } from '@mui/material';
import { ShieldCheck, TrendingDown, Users, Sparkles, Tv2, Music, Bot, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useLogoClick from '../../../hooks/useLogoClick';

const BRAND_CARDS = [
  {
    title: 'Netflix Premium 4K',
    price: 129,
    savings: 80,
    badge: 'Verified Host',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
    Icon: Tv2,
  },
  {
    title: 'Spotify Family Plan',
    price: 59,
    savings: 67,
    badge: 'AI Verified',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
    Icon: Music,
  },
  {
    title: 'ChatGPT Plus Team',
    price: 399,
    savings: 80,
    badge: 'Escrow Protected',
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
    border: 'rgba(20,184,166,0.3)',
    Icon: Bot,
  },
  {
    title: 'YouTube Premium',
    price: 106,
    savings: 29,
    badge: 'Verified Host',
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.12)',
    border: 'rgba(244,63,94,0.3)',
    Icon: Video,
  },
];

function AuthIllustrationPanel() {
  const navigate = useNavigate();
  const handleLogoClick = useLogoClick();

  return (
    <Box
      sx={{
        p: { md: 5, lg: 6 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Background radial blue glow */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Bar: Wordmark */}
      <Box
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={handleLogoClick}
      >
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: '1.5rem',
            color: '#ffffff',
            letterSpacing: '-0.04em',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Sub<Box component="span" sx={{ color: '#3b82f6' }}>Split</Box>
        </Typography>
      </Box>

      {/* Middle: Headline & Supporting Text */}
      <Box sx={{ my: 'auto', py: 4 }}>
        <Chip
          icon={<Sparkles size={13} color="#3b82f6" />}
          label="India's #1 Subscription Sharing Platform"
          size="small"
          sx={{
            background: '#18181C',
            color: '#3b82f6',
            fontWeight: 800,
            fontSize: '0.74rem',
            border: '1px solid #2A2A30',
            mb: 2.5,
            borderRadius: '8px',
          }}
        />

        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            color: '#ffffff',
            fontSize: { md: '2.4rem', lg: '2.8rem' },
            lineHeight: 1.15,
            letterSpacing: '-0.035em',
            mb: 2,
          }}
        >
          Share Premium.{' '}
          <Box component="span" sx={{ color: '#3b82f6' }}>
            Spend Smarter.
          </Box>
        </Typography>

        <Typography
          sx={{
            color: '#A1A1AA',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            maxWidth: 440,
            mb: 4,
          }}
        >
          Join verified subscription groups and save up to 80% with escrow security and automated access delivery.
        </Typography>

        {/* Live Marketplace Preview Cards Stack */}
        <Stack spacing={1.5} sx={{ maxWidth: 440 }}>
          {BRAND_CARDS.map(({ title, price, savings, badge, color, bg, border, Icon }) => (
            <Paper
              key={title}
              elevation={0}
              sx={{
                p: 1.75,
                px: 2.25,
                borderRadius: '16px',
                background: '#18181C',
                border: '1px solid #2A2A30',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                  transform: 'translateX(4px)',
                  borderColor: color,
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
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
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff', lineHeight: 1.2 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#A1A1AA' }}>
                    {badge}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#3b82f6' }}>
                  ₹{price}/mo
                </Typography>
                <Chip
                  label={`-${savings}%`}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    background: 'rgba(34,197,94,0.15)',
                    color: '#22c55e',
                    borderRadius: '5px',
                  }}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>

      {/* Bottom Floating Trust Chips */}
      <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
        <Chip
          icon={<TrendingDown size={13} color="#22c55e" />}
          label="₹8,196/yr Avg Saved"
          size="small"
          sx={{
            background: '#18181C',
            color: '#22c55e',
            fontWeight: 800,
            fontSize: '0.72rem',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '8px',
          }}
        />
        <Chip
          icon={<ShieldCheck size={13} color="#3b82f6" />}
          label="100% Escrow Protected"
          size="small"
          sx={{
            background: '#18181C',
            color: '#3b82f6',
            fontWeight: 800,
            fontSize: '0.72rem',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '8px',
          }}
        />
      </Stack>
    </Box>
  );
}

export default AuthIllustrationPanel;
