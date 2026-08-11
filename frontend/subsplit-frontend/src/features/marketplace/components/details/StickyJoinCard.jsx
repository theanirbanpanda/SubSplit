import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ShieldCheck, Heart, Share2, Users, ArrowRight, Zap, AlertTriangle, Crown, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import RaiseDisputeModal from '../../../disputes/RaiseDisputeModal';

function StickyJoinCard({ listing, onJoinClick, isAlreadyJoined, isHost, myRequest }) {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [raiseDisputeOpen, setRaiseDisputeOpen] = useState(false);

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

  const isConfirmedMember = myRequest?.status === 'APPROVED' || myRequest?.status === 'CREDENTIALS_SHARED' || myRequest?.status === 'ACCEPTED';

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

      {/* Dynamic Membership / Join CTA */}
      {isHost ? (
        <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', mb: 2, textAlign: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={0.5}>
            <Crown size={18} color="#f59e0b" />
            <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', color: '#f59e0b' }}>
              You Host This Listing
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: '0.78rem', color: '#A1A1AA', mb: 1.5 }}>
            You manage this group pass and can review joinee credentials.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate('/app/host')}
            sx={{
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#000000',
            }}
          >
            Manage Group & Requests →
          </Button>
        </Paper>
      ) : isAlreadyJoined ? (
        <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: isConfirmedMember ? 'rgba(34,197,94,0.08)' : 'rgba(59,130,246,0.08)', border: `1px solid ${isConfirmedMember ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)'}`, mb: 2, textAlign: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={0.5}>
            {isConfirmedMember ? <CheckCircle2 size={18} color="#22c55e" /> : <Clock size={18} color="#3b82f6" />}
            <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', color: isConfirmedMember ? '#22c55e' : '#3b82f6' }}>
              {isConfirmedMember ? 'Active Group Member' : 'Join Request Active'}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: '0.78rem', color: '#A1A1AA', mb: 1.5 }}>
            {isConfirmedMember ? 'You have joined this group. Your access credentials and escrow pass are ready.' : 'Your join request is active. Track status and access credentials.'}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate('/app/joinee')}
            sx={{
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'none',
              background: isConfirmedMember ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            }}
          >
            {isConfirmedMember ? 'View Your Group Pass →' : 'View Request Status →'}
          </Button>
        </Paper>
      ) : seatsLeft === 0 ? (
        <Button
          fullWidth
          variant="contained"
          disabled
          size="large"
          sx={{
            fontWeight: 800,
            fontSize: '0.95rem',
            py: 1.4,
            borderRadius: '14px',
            textTransform: 'none',
            background: '#2A2A30',
            color: '#6b7280',
            mb: 2,
          }}
        >
          Group Pass Full (0 Seats Left)
        </Button>
      ) : (
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
      )}

      {/* Report Issue / Dispute button */}
      <Button
        fullWidth
        variant="outlined"
        size="small"
        startIcon={<AlertTriangle size={15} />}
        onClick={() => setRaiseDisputeOpen(true)}
        sx={{
          borderRadius: '11px',
          borderColor: 'rgba(239,68,68,0.35)',
          color: '#ef4444',
          background: 'rgba(239,68,68,0.07)',
          textTransform: 'none',
          fontSize: '0.8rem',
          fontWeight: 700,
          py: 0.8,
          mb: 2,
          '&:hover': { borderColor: '#ef4444', background: 'rgba(239,68,68,0.15)' },
        }}
      >
        Report Issue / Raise Dispute
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

      {/* Raise Dispute Modal */}
      <RaiseDisputeModal
        open={raiseDisputeOpen}
        onClose={() => setRaiseDisputeOpen(false)}
        listing={listing}
      />
    </Paper>
  );
}

export default StickyJoinCard;
