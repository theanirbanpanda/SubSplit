import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ShieldCheck, Heart, Share2, Users, ArrowRight, Zap } from 'lucide-react';

function StickyJoinCard({ listing, onJoinClick }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    price,
    originalPrice,
    savingsPercent,
    seatsLeft,
    totalSeats = 4,
  } = listing;

  const filledSeats = totalSeats - seatsLeft;
  const progressPercent = (filledSeats / totalSeats) * 100;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'sticky',
        top: 90,
        p: { xs: 3, md: 3.5 },
        borderRadius: '24px',
        background: '#111114',
        border: '1px solid #2A2A30',
        color: '#ffffff',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Top Header: Price & Savings */}
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" mb={2}>
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '2.1rem', color: '#3b82f6', lineHeight: 1 }}>
            ₹{price}
            <Typography component="span" sx={{ fontSize: '0.88rem', color: '#A1A1AA', ml: 0.5, fontWeight: 500 }}>
              /month
            </Typography>
          </Typography>
          {originalPrice && (
            <Typography sx={{ fontSize: '0.82rem', color: '#71717A', textDecoration: 'line-through', mt: 0.3 }}>
              ₹{originalPrice} /month original
            </Typography>
          )}
        </Box>

        {savingsPercent && (
          <Chip
            label={`Save ${savingsPercent}%`}
            sx={{
              background: 'rgba(34,197,94,0.15)',
              color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.3)',
              fontWeight: 900,
              fontSize: '0.78rem',
              borderRadius: '8px',
              px: 0.5,
            }}
          />
        )}
      </Stack>

      {/* Seats progress indicator */}
      <Box sx={{ p: 2, borderRadius: '14px', background: '#18181C', border: '1px solid #2A2A30', mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Stack direction="row" alignItems="center" spacing={0.6}>
            <Users size={14} color="#3b82f6" />
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
              {filledSeats}/{totalSeats} Seats Occupied
            </Typography>
          </Stack>

          <Typography sx={{ fontSize: '0.82rem', fontWeight: 900, color: '#22c55e' }}>
            {seatsLeft} Seat{seatsLeft !== 1 ? 's' : ''} Remaining
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 7,
            borderRadius: 4,
            backgroundColor: '#2A2A30',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: 'linear-gradient(90deg, #3b82f6 0%, #22c55e 100%)',
            },
          }}
        />
      </Box>

      {/* Primary CTA button */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        endIcon={<ArrowRight size={18} />}
        onClick={onJoinClick}
        sx={{
          fontWeight: 800,
          fontSize: '1rem',
          py: 1.5,
          borderRadius: '14px',
          textTransform: 'none',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
          mb: 2,
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
            boxShadow: '0 6px 28px rgba(37, 99, 235, 0.55)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        Join Subscription Group
      </Button>

      {/* Actions row: Wishlist & Share */}
      <Stack direction="row" spacing={1.5} mb={3}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Heart size={16} fill={wishlisted ? '#ef4444' : 'none'} color={wishlisted ? '#ef4444' : '#A1A1AA'} />}
          onClick={() => setWishlisted(!wishlisted)}
          sx={{
            borderRadius: '11px',
            borderColor: '#2A2A30',
            color: wishlisted ? '#ef4444' : '#ffffff',
            textTransform: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            py: 0.9,
            '&:hover': { borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)' },
          }}
        >
          {wishlisted ? 'Saved' : 'Wishlist'}
        </Button>

        <Tooltip title={copied ? 'Link Copied!' : 'Share Group'}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Share2 size={16} color="#A1A1AA" />}
            onClick={handleShare}
            sx={{
              borderRadius: '11px',
              borderColor: '#2A2A30',
              color: '#ffffff',
              textTransform: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              py: 0.9,
              '&:hover': { borderColor: '#3b82f6', background: 'rgba(59,130,246,0.1)' },
            }}
          >
            {copied ? 'Copied' : 'Share'}
          </Button>
        </Tooltip>
      </Stack>

      {/* SubSplit Escrow Trust Guarantee Message */}
      <Box
        sx={{
          p: 2,
          borderRadius: '14px',
          background: '#18181C',
          border: '1px solid rgba(34,197,94,0.3)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.25,
        }}
      >
        <ShieldCheck size={20} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
        <Box>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#22c55e' }}>
            Protected by SubSplit Escrow
          </Typography>
          <Typography sx={{ fontSize: '0.74rem', color: '#A1A1AA', lineHeight: 1.5, mt: 0.3 }}>
            Your payment stays locked in escrow and is only released to the host after you verify credentials.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default StickyJoinCard;
