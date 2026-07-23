import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, Chip } from '@mui/material';
import { ShieldCheck, TrendingDown, Users, Flame, Sparkles, Tv2, Music, Bot, ShoppingBag } from 'lucide-react';

const LIVE_FEEDS = [
  'Rohan joined Netflix Premium 2m ago',
  'Ananya listed Spotify Family 5m ago',
  'Arjun joined ChatGPT Plus 8m ago',
  'Priya verified YouTube slot 12m ago',
];

function AuthFloatingElements() {
  const [feedIndex, setFeedIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedIndex((prev) => (prev + 1) % LIVE_FEEDS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        display: { xs: 'none', lg: 'block' },
      }}
    >
      {/* ── 1. Top Left Floating Card (Netflix) ── */}
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          top: '6%',
          left: '5%',
          transform: 'rotate(-4deg)',
          p: 1.75,
          px: 2.25,
          borderRadius: '16px',
          background: '#14161a',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          animation: 'floatSlow 6s ease-in-out infinite',
          '@keyframes floatSlow': {
            '0%, 100%': { transform: 'rotate(-4deg) translateY(0px)' },
            '50%': { transform: 'rotate(-4deg) translateY(-6px)' },
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Tv2 size={18} color="#ef4444" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#f3f4f6', lineHeight: 1.2 }}>
              Netflix Premium 4K
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 800 }}>
              ₹129/mo <Box component="span" sx={{ color: '#22c55e', ml: 0.5 }}>Save 80%</Box>
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* ── 2. Top Right Floating Card (Spotify) ── */}
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          top: '8%',
          right: '5%',
          transform: 'rotate(3deg)',
          p: 1.75,
          px: 2.25,
          borderRadius: '16px',
          background: '#14161a',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          animation: 'floatSlow2 7s ease-in-out infinite',
          '@keyframes floatSlow2': {
            '0%, 100%': { transform: 'rotate(3deg) translateY(0px)' },
            '50%': { transform: 'rotate(3deg) translateY(-8px)' },
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Music size={18} color="#22c55e" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#f3f4f6', lineHeight: 1.2 }}>
              Spotify Family
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 800 }}>
              ₹59/mo <Box component="span" sx={{ color: '#22c55e', ml: 0.5 }}>Save 67%</Box>
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* ── 3. Middle Left Live Activity Feed ── */}
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          top: '42%',
          left: '3%',
          transform: 'rotate(-2deg)',
          p: 1.5,
          px: 2,
          borderRadius: '14px',
          background: '#1c1e24',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          maxWidth: 240,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e',
            }}
          />
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#22c55e', textTransform: 'uppercase' }}>
            Live Feed
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#f3f4f6', mt: 0.5 }}>
          {LIVE_FEEDS[feedIndex]}
        </Typography>
      </Paper>

      {/* ── 4. Middle Right Trending Badge ── */}
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          top: '40%',
          right: '4%',
          transform: 'rotate(2deg)',
          p: 1.25,
          px: 2,
          borderRadius: '12px',
          background: '#1c1e24',
          border: '1px solid rgba(244,63,94,0.3)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Flame size={16} color="#f43f5e" />
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: '#f43f5e' }}>
            🔥 Trending Marketplace
          </Typography>
        </Stack>
      </Paper>

      {/* ── 5. Bottom Left Floating Card (ChatGPT Plus) ── */}
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          bottom: '8%',
          left: '6%',
          transform: 'rotate(3deg)',
          p: 1.75,
          px: 2.25,
          borderRadius: '16px',
          background: '#14161a',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          animation: 'floatSlow3 8s ease-in-out infinite',
          '@keyframes floatSlow3': {
            '0%, 100%': { transform: 'rotate(3deg) translateY(0px)' },
            '50%': { transform: 'rotate(3deg) translateY(-7px)' },
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'rgba(20,184,166,0.12)',
              border: '1px solid rgba(20,184,166,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot size={18} color="#14b8a6" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#f3f4f6', lineHeight: 1.2 }}>
              ChatGPT Plus Team
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 800 }}>
              ₹399/mo <Box component="span" sx={{ color: '#22c55e', ml: 0.5 }}>Save 80%</Box>
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* ── 6. Bottom Right Floating Card (Prime Video) ── */}
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          bottom: '7%',
          right: '6%',
          transform: 'rotate(-3deg)',
          p: 1.75,
          px: 2.25,
          borderRadius: '16px',
          background: '#14161a',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBag size={18} color="#f59e0b" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#f3f4f6', lineHeight: 1.2 }}>
              Prime Video 4K
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 800 }}>
              ₹79/mo <Box component="span" sx={{ color: '#22c55e', ml: 0.5 }}>Save 47%</Box>
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* ── 7. Upper Center Savings Counter Badge ── */}
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          top: '3%',
          left: '50%',
          transform: 'translateX(-50%)',
          p: 1,
          px: 2.5,
          borderRadius: '12px',
          background: '#14161a',
          border: '1px solid rgba(34,197,94,0.3)',
          boxShadow: '0 8px 24px rgba(34,197,94,0.15)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <TrendingDown size={16} color="#22c55e" />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#22c55e' }}>
            ₹4,280 Saved Today by Members
          </Typography>
        </Stack>
      </Paper>

      {/* ── 8. Lower Center Trust Bar ── */}
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          bottom: '3%',
          left: '50%',
          transform: 'translateX(-50%)',
          p: 1,
          px: 3,
          borderRadius: '12px',
          background: '#14161a',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2.5}>
          <Stack direction="row" alignItems="center" spacing={0.6}>
            <ShieldCheck size={14} color="#22c55e" />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
              Verified Host
            </Typography>
          </Stack>
          <Typography sx={{ color: '#252830', fontSize: '0.75rem' }}>•</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>
            Escrow Protected
          </Typography>
          <Typography sx={{ color: '#252830', fontSize: '0.75rem' }}>•</Typography>
          <Stack direction="row" alignItems="center" spacing={0.6}>
            <Users size={14} color="#9ca3af" />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
              50K+ Members
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

export default AuthFloatingElements;
