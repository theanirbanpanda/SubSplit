import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cancelJoinRequest } from '../../marketplaceSlice';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
} from '@mui/material';
import {
  ShieldCheck,
  ArrowRight,
  Crown,
  CheckCircle2,
  Clock,
  Flag,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// NOTE: RaiseDisputeModal is intentionally NOT imported here.
// The dispute flow requires an active purchase. Opening it from a pre-purchase
// listing page was a logic bug — removed. A plain "Report this listing" link
// navigates to support instead.

function StickyJoinCard({ listing, onJoinClick, isAlreadyJoined, isHost, myRequest }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const {
    price,
    originalPrice,
    savingsPercent,
    seatsLeft,
    id,
    rawId,
  } = listing;

  // Fix: only show discount when originalPrice strictly greater than price
  const hasDiscount = originalPrice && Number(originalPrice) > Number(price);
  const displaySavings = hasDiscount && savingsPercent;

  const isConfirmedMember =
    myRequest?.status === 'APPROVED' ||
    myRequest?.status === 'CREDENTIALS_SHARED' ||
    myRequest?.status === 'ACCEPTED';

  const listingId = rawId || id;

  return (
    <Paper
      elevation={0}
      sx={{
        position: { xs: 'static', sm: 'sticky' },
        top: { sm: 90 },
        p: { xs: 2.5, md: 3 },
        borderRadius: '18px',
        background: '#111114',
        border: '1px solid #2A2A30',
        color: '#ffffff',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Price */}
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" mb={0.75}>
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '2.1rem', color: '#3b82f6', lineHeight: 1 }}>
            ₹{price}
            <Typography component="span" sx={{ fontSize: '0.88rem', color: '#A1A1AA', ml: 0.5, fontWeight: 500 }}>
              /month
            </Typography>
          </Typography>
          {hasDiscount && (
            <Typography sx={{ fontSize: '0.8rem', color: '#71717A', textDecoration: 'line-through', mt: 0.3 }}>
              ₹{originalPrice} /month
            </Typography>
          )}
        </Box>
        {displaySavings && (
          <Chip
            label={`Save ${savingsPercent}%`}
            sx={{
              background: 'rgba(34,197,94,0.15)',
              color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.3)',
              fontWeight: 900,
              fontSize: '0.76rem',
              borderRadius: '8px',
              px: 0.5,
            }}
          />
        )}
      </Stack>

      {/* Seats remaining */}
      <Stack direction="row" alignItems="center" spacing={0.75} mb={2.5}>
        <ShieldCheck size={14} color="#22c55e" />
        <Typography sx={{ fontSize: '0.82rem', color: '#A1A1AA' }}>
          <Typography component="span" sx={{ fontWeight: 800, color: '#22c55e', fontSize: '0.82rem' }}>
            {seatsLeft} seat{seatsLeft !== 1 ? 's' : ''}
          </Typography>
          {' remaining'}
        </Typography>
      </Stack>

      {/* CTA */}
      {isHost ? (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '12px',
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.3)',
            mb: 2,
            textAlign: 'center',
          }}
        >
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
            Manage Group &amp; Requests →
          </Button>
        </Paper>
      ) : isAlreadyJoined ? (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '12px',
            background: isConfirmedMember
              ? 'rgba(34,197,94,0.08)'
              : 'rgba(59,130,246,0.08)',
            border: `1px solid ${isConfirmedMember ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)'}`,
            mb: 2,
            textAlign: 'center',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={0.5}>
            {isConfirmedMember ? (
              <CheckCircle2 size={18} color="#22c55e" />
            ) : (
              <Clock size={18} color="#3b82f6" />
            )}
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: '0.95rem',
                color: isConfirmedMember ? '#22c55e' : '#3b82f6',
              }}
            >
              {isConfirmedMember ? 'Active Group Member' : 'Join Request Active'}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: '0.78rem', color: '#A1A1AA', mb: 1.5 }}>
            {isConfirmedMember
              ? 'You have joined this group. Your access credentials and escrow pass are ready.'
              : 'Your join request is active. Escrow is locked.'}
          </Typography>
          {isConfirmedMember ? (
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/app/joinee')}
              sx={{
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              }}
            >
              View Your Group Pass →
            </Button>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setOpenCancelDialog(true)}
              sx={{
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                textTransform: 'none',
                color: '#ef4444',
                borderColor: 'rgba(239,68,68,0.3)',
                '&:hover': {
                  background: 'rgba(239,68,68,0.08)',
                  borderColor: '#ef4444'
                }
              }}
            >
              Delete this request
            </Button>
          )}
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
            borderRadius: '12px',
            textTransform: 'none',
            background: '#2A2A30',
            color: '#6b7280',
            mb: 2,
          }}
        >
          Group Full — No Seats Left
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
            borderRadius: '12px',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            boxShadow: '0 4px 20px rgba(34, 197, 94, 0.35)',
            mb: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              boxShadow: '0 6px 28px rgba(34, 197, 94, 0.5)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Buy
        </Button>
      )}

      {!isHost && (
        <Button
          fullWidth
          variant="outlined"
          startIcon={<MessageSquare size={18} />}
          onClick={() => {
            const hostId = listing.host?.id || listing.hostId;
            if (hostId) {
              navigate(`/app/messages?recipientId=${hostId}&listingId=${listingId}`);
            }
          }}
          sx={{
            mb: 2,
            borderRadius: '12px',
            fontWeight: 700,
            py: 1.2,
            color: '#e4e4e7',
            borderColor: 'rgba(255,255,255,0.12)',
            textTransform: 'none',
            '&:hover': {
              color: '#ffffff',
              borderColor: 'rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.04)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Chat with Host
        </Button>
      )}

      {/* Escrow reassurance — one line */}
      <Stack direction="row" alignItems="center" spacing={0.75} mb={2}>
        <ShieldCheck size={14} color="#22c55e" style={{ flexShrink: 0 }} />
        <Typography sx={{ fontSize: '0.78rem', color: '#A1A1AA' }}>
          Payment held in escrow until you confirm access.
        </Typography>
      </Stack>

      {/* Report this listing — minor, no modal */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          component="button"
          onClick={() =>
            navigate(`/app/support?report=listing&id=${listingId}`)
          }
          sx={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.75rem',
            color: '#71717A',
            fontWeight: 500,
            fontFamily: 'inherit',
            '&:hover': { color: '#A1A1AA' },
            transition: 'color 0.15s ease',
          }}
        >
          <Flag size={12} />
          Report this listing
        </Typography>
      </Box>

      {/* Custom Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenCancelDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1,
            maxWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
          <Box sx={{ p: 1, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex' }}>
            <AlertTriangle size={24} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            Cancel Join Request
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText sx={{ color: '#4b5563', fontSize: '0.95rem' }}>
            Are you sure you want to delete this request? Your escrow deposit will be fully refunded to your wallet immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setOpenCancelDialog(false)} 
            sx={{ color: '#6b7280', fontWeight: 600, textTransform: 'none' }}
          >
            Keep Request
          </Button>
          <Button 
            onClick={() => {
              dispatch(cancelJoinRequest(myRequest.id));
              setOpenCancelDialog(false);
            }} 
            variant="contained" 
            color="error"
            sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none', boxShadow: 'none' }}
          >
            Yes, Cancel It
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default StickyJoinCard;
