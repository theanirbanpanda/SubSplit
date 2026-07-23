import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, IconButton, Slide } from '@mui/material';
import { X, Sparkles, UserCheck, Flame } from 'lucide-react';

const ACTIVITIES = [
  { text: 'Rahul joined Netflix Premium 4K', time: '2m ago', icon: Flame, color: '#ef4444' },
  { text: 'Sneha listed Spotify Family Plan', time: '5m ago', icon: Sparkles, color: '#22c55e' },
  { text: 'Amit joined ChatGPT Plus Team', time: '8m ago', icon: UserCheck, color: '#3b82f6' },
  { text: 'Priya verified YouTube Premium slot', time: '12m ago', icon: Sparkles, color: '#f59e0b' },
];

function LiveActivityWidget() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ACTIVITIES.length);
        setVisible(true);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  const current = ACTIVITIES[index];
  const Icon = current.icon;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 1200,
        display: { xs: 'none', sm: 'block' },
      }}
    >
      <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
        <Paper
          elevation={0}
          sx={{
            p: 1.75,
            px: 2.25,
            borderRadius: '16px',
            background: '#111114',
            border: '1px solid #2A2A30',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            maxWidth: 340,
          }}
        >
          {/* Live Dot */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '10px',
              background: `${current.color}15`,
              border: `1px solid ${current.color}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={16} color={current.color} />
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Stack direction="row" alignItems="center" spacing={0.75} mb={0.25}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 8px #22c55e',
                }}
              />
              <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#22c55e', textTransform: 'uppercase' }}>
                Live Marketplace
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: '#71717A', ml: 'auto' }}>
                {current.time}
              </Typography>
            </Stack>

            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
              {current.text}
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={() => setDismissed(true)}
            sx={{ color: '#71717A', p: 0.5, '&:hover': { color: '#ffffff' } }}
          >
            <X size={14} />
          </IconButton>
        </Paper>
      </Slide>
    </Box>
  );
}

export default LiveActivityWidget;
