import React, { useState, useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchMySubscriptions,
  fetchSubscriptionSummary,
  cancelSubscription,
  toggleAutoRenew,
} from '../groups/subscriptionsSlice';
import { fetchMyWallet } from '../settlements/walletSlice';
import { fetchMyJoinRequests, submitProofAndSettle } from '../marketplace/marketplaceSlice';
import ViewCredentialsAndProofModal from '../marketplace/components/ViewCredentialsAndProofModal';
import VerificationOverlayModal from '../marketplace/components/VerificationOverlayModal';

import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Snackbar,
  Alert,
  Collapse,
} from '@mui/material';

import {
  Clock,
  ShieldCheck,
  Tv2,
  Music,
  Bot,
  Zap,
  CheckCircle2,
  ChevronRight,
  Search,
  AlertTriangle,
  Lock,
  Bell,
} from 'lucide-react';

import DashboardHero from './components/DashboardHero';
import RenewalList from './components/RenewalList';
import ActivityFeed from './components/ActivityFeed';
import TrustRail from './components/TrustRail';
import ProtectionBanner from '../marketplace/components/ProtectionBanner';

import styles from './Dashboard.module.scss';


const PROVIDER_ICONS = {
  netflix:  { Icon: Tv2,   color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.3)' },
  spotify:  { Icon: Music, color: '#22c55e', bg: 'rgba(34,197,94,0.15)',   border: 'rgba(34,197,94,0.3)' },
  chatgpt:  { Icon: Bot,   color: '#14b8a6', bg: 'rgba(20,184,166,0.15)', border: 'rgba(20,184,166,0.3)' },
};

const DEFAULT_THEME = { Icon: Zap, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' };

// Gradient avatar background — cycles through a small palette per initial letter
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
  'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
];
function avatarGradient(name = '') {
  const code = (name.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[code];
}

function Dashboard() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { subscriptions, summaryStats, loading: subsLoading } = useSelector((state) => state.subscriptions);
  const { wallet } = useSelector((state) => state.wallet);
  const { myJoinRequests } = useSelector((state) => state.marketplace);

  const [copiedId, setCopiedId]   = useState(null);
  const [chatHost, setChatHost]   = useState(null);
  const [renewalsOpen, setRenewalsOpen]   = useState(false);
  const [activityOpen, setActivityOpen]   = useState(false);

  const pendingSentRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMySubscriptions());
    dispatch(fetchSubscriptionSummary());
    dispatch(fetchMyWallet());
    dispatch(fetchMyJoinRequests());
  }, [dispatch]);

  // ── Modal / proof state ──────────────────────────────────────────────────────
  const activeProofRef = useRef({ req: null, proof: null });
  const [viewCredsModalOpen, setViewCredsModalOpen] = useState(false);
  const [selectedCredsReq,   setSelectedCredsReq]   = useState(null);
  const [verifyingModalOpen, setVerifyingModalOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleOpenCredsModal = (reqItem) => {
    setSelectedCredsReq(reqItem);
    setViewCredsModalOpen(true);
  };

  const handleProofSelected = (proofImageData) => {
    activeProofRef.current = { req: selectedCredsReq, proof: proofImageData };
    setViewCredsModalOpen(false);
    setVerifyingModalOpen(true);
  };

  const handleVerificationComplete = async () => {
    const { req, proof } = activeProofRef.current;
    setVerifyingModalOpen(false);

    if (req && proof) {
      try {
        await dispatch(
          submitProofAndSettle({
            requestId: req.id,
            proofImage: proof,
          })
        ).unwrap();

        dispatch(fetchMyJoinRequests());
        dispatch(fetchMyWallet());
        dispatch(fetchMySubscriptions());
        setToast({
          open: true,
          message: 'Login Proof Verified! Pass activated & holding payment settled to host wallet.',
          severity: 'success',
        });
      } catch (err) {
        dispatch(fetchMyJoinRequests());
        dispatch(fetchMyWallet());
        dispatch(fetchMySubscriptions());
        setToast({
          open: true,
          message: typeof err === 'string' ? err : 'Failed to process proof verification.',
          severity: 'error',
        });
      } finally {
        activeProofRef.current = { req: null, proof: null };
        setSelectedCredsReq(null);
      }
    }
  };

  const handleCancelPass = (id) => {
    if (window.confirm('Are you sure you want to cancel your slot membership? You will retain access until the end of your billing period.')) {
      dispatch(cancelSubscription(id));
    }
  };

  // ── Derived data ─────────────────────────────────────────────────────────────

  // Map subscriptions to UI theme — no hardcoded fallback values for real data fields
  const activeMemberships = subscriptions.map((item) => {
    const prov = (item.providerName || item.title || '').toLowerCase();
    const themeKey = Object.keys(PROVIDER_ICONS).find((k) => prov.includes(k));
    const theme = themeKey ? PROVIDER_ICONS[themeKey] : DEFAULT_THEME;

    let statusColor  = '#22c55e';
    let statusBg     = 'rgba(34,197,94,0.15)';
    let statusBorder = 'rgba(34,197,94,0.3)';

    if (item.statusDisplay === 'Renewing Soon' || (item.daysLeft != null && item.daysLeft <= 7 && item.daysLeft > 0)) {
      statusColor  = '#f59e0b';
      statusBg     = 'rgba(245,158,11,0.15)';
      statusBorder = 'rgba(245,158,11,0.3)';
    } else if (item.statusDisplay === 'Expired' || item.statusDisplay === 'Cancelled') {
      statusColor  = '#ef4444';
      statusBg     = 'rgba(239,68,68,0.15)';
      statusBorder = 'rgba(239,68,68,0.3)';
    }

    return {
      ...item,
      ...theme,
      statusColor,
      statusBg,
      statusBorder,
      statusText: item.statusDisplay || 'Active',
      host: item.host || { name: 'Verified Host', initials: 'VH', rating: null, responseTime: null, isVerified: true, avatarBg: '#2563eb' },
    };
  });

  // "Needs action" = pending or credentials shared (awaiting buyer confirmation)
  const needsActionCount = (myJoinRequests || []).filter(
    (r) => r.status === 'PENDING' || r.status === 'CREDENTIALS_SHARED'
  ).length;

  // Show requests that are not yet fully resolved (PENDING or CREDENTIALS_SHARED)
  const pendingRequests = (myJoinRequests || []).filter(
    (r) => r.status === 'PENDING' || r.status === 'CREDENTIALS_SHARED'
  );

  const handleNeedsActionClick = () => {
    if (pendingSentRef.current) {
      pendingSentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ── Compact section icon chip helper ────────────────────────────────────────
  const SectionIconChip = ({ icon: Icon, color, bg, border }) => (
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
        flexShrink: 0,
      }}
    >
      <Icon size={16} color={color} />
    </Box>
  );

  // ── Renewal summary for accordion subtitle ───────────────────────────────────
  const nextRenewal = subscriptions
    .filter((s) => s.daysLeft != null && s.daysLeft > 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];
  const renewalSubtitle = nextRenewal
    ? `Next in ${nextRenewal.daysLeft} day${nextRenewal.daysLeft === 1 ? '' : 's'}`
    : subscriptions.length > 0
      ? 'No upcoming renewals'
      : subsLoading
        ? 'Loading…'
        : 'No subscriptions';

  const activitySubtitle = `${(myJoinRequests || []).length} update${(myJoinRequests || []).length === 1 ? '' : 's'}`;

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className={styles.dashboardContainer}>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className={styles.heroWrapper}>
        <DashboardHero onNeedsActionClick={handleNeedsActionClick} />
      </div>

      {/* ── Section 1: My Active Passes ──────────────────────────────────────── */}
      <Box id="my-subscriptions">
        {/* Section header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <SectionIconChip
              icon={ShieldCheck}
              color="#3b82f6"
              bg="rgba(37,99,235,0.12)"
              border="rgba(37,99,235,0.3)"
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.25rem', letterSpacing: '-0.02em' }}
            >
              My Active Passes
            </Typography>
            {activeMemberships.length > 0 && (
              <Box
                sx={{
                  background: '#2563eb',
                  color: '#fff',
                  borderRadius: '999px',
                  fontWeight: 900,
                  fontSize: '0.72rem',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {activeMemberships.length}
              </Box>
            )}
          </Stack>
        </Stack>

        {/* Pass cards */}
        {subsLoading && activeMemberships.length === 0 ? (
          <Paper elevation={0} sx={{ p: 3, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#9ca3af' }}>Loading your passes…</Typography>
          </Paper>
        ) : activeMemberships.length === 0 ? (
          <Paper elevation={0} sx={{ p: 3.5, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#9ca3af', mb: 1.5 }}>
              You don't have any active passes yet.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Search size={14} />}
              onClick={() => navigate('/app/marketplace')}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.82rem' }}
            >
              Find a Pass
            </Button>
          </Paper>
        ) : (
          <Stack spacing={1.5}>
            {activeMemberships.map((mem) => {
              const {
                id,
                listingId,
                title,
                price,
                filledSeats,
                totalSeats,
                Icon,
                color,
                bg,
                border,
                host,
              } = mem;

              const seatLabel =
                filledSeats != null && totalSeats != null
                  ? `seat ${filledSeats}/${totalSeats}`
                  : null;

              return (
                <Paper
                  key={id}
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 2.25 },
                    borderRadius: '18px',
                    background: '#14161a',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'border-color 0.2s ease',
                    '&:hover': { borderColor: 'rgba(59,130,246,0.35)' },
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                  >
                    {/* Provider icon */}
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        background: bg,
                        border: `1px solid ${border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={24} color={color} />
                    </Box>

                    {/* Name + host + status */}
                    <Box flex={1} minWidth={0}>
                      <Typography
                        sx={{ fontWeight: 900, fontSize: '1rem', color: '#f3f4f6', lineHeight: 1.2, mb: 0.3 }}
                      >
                        {title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.76rem', color: '#9ca3af' }}>
                        Host: {host.name}
                        {seatLabel && ` · ${seatLabel}`}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                        <CheckCircle2 size={12} color="#22c55e" />
                        <Typography sx={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 700 }}>
                          Verified &amp; Protected
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Price + action */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{ flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}
                    >
                      {price != null && (
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography
                            sx={{ fontWeight: 900, fontSize: '1.05rem', color: '#f3f4f6', lineHeight: 1 }}
                          >
                            Rs.{price}
                          </Typography>
                          <Typography sx={{ fontSize: '0.68rem', color: '#9ca3af' }}>/mo</Typography>
                        </Box>
                      )}

                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/app/marketplace/${listingId || id}`)}
                        id={`dashboard-open-access-${id}`}
                        sx={{
                          borderRadius: '10px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          py: 0.75,
                          px: 2,
                          textTransform: 'none',
                          color: '#f3f4f6',
                          borderColor: 'rgba(255,255,255,0.2)',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            borderColor: '#3b82f6',
                            color: '#3b82f6',
                            background: 'rgba(59,130,246,0.08)',
                          },
                          width: { xs: '100%', sm: 'auto' },
                        }}
                      >
                        Open Access
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* ── Section 2: My Requests Sent ──────────────────────────────────────── */}
      <Box ref={pendingSentRef} id="my-requests-sent">
        {/* Section header */}
        <Stack direction="row" alignItems="center" spacing={1.25} mb={2.5}>
          <SectionIconChip
            icon={Clock}
            color="#f59e0b"
            bg="rgba(245,158,11,0.12)"
            border="rgba(245,158,11,0.3)"
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.25rem', letterSpacing: '-0.02em' }}
          >
            My Requests Sent
          </Typography>
          {pendingRequests.length > 0 && (
            <Box
              sx={{
                background: '#2563eb',
                color: '#fff',
                borderRadius: '999px',
                fontWeight: 900,
                fontSize: '0.72rem',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {pendingRequests.length}
            </Box>
          )}
        </Stack>

        {pendingRequests.length === 0 ? (
          <Paper elevation={0} sx={{ p: 3.5, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#9ca3af', mb: 1.5 }}>
              You have no pending requests.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/app/marketplace')}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.82rem' }}
            >
              Browse Available Groups
            </Button>
          </Paper>
        ) : (
          <Stack spacing={1.5}>
            {pendingRequests.map((req) => {
              const isCredentialsShared = req.status === 'CREDENTIALS_SHARED';
              const hostInitials = (req.hostName || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
              const gradientBg = avatarGradient(req.hostName || '');

              return (
                <Paper
                  key={req.id}
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: '18px',
                    background: '#14161a',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderLeft: '3px solid #f59e0b',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Host row */}
                  <Stack direction="row" alignItems="center" spacing={1.5} mb={0.75}>
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        background: gradientBg,
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        flexShrink: 0,
                      }}
                    >
                      {hostInitials}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                        Host: {req.hostName || 'Verified Host'}
                      </Typography>
                      {req.price != null && (
                        <Typography sx={{ fontSize: '0.76rem', color: '#9ca3af' }}>
                          Your escrow, held safe:{' '}
                          <span style={{ color: '#3b82f6', fontWeight: 700 }}>Rs.{req.price}</span>
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  {/* Listing title */}
                  <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af', mb: 1.5 }}>
                    Requested{' '}
                    <span style={{ color: '#f3f4f6', fontWeight: 700 }}>
                      {req.listingTitle || 'Subscription Group'}
                    </span>
                  </Typography>

                  {/* Trust Rail */}
                  <TrustRail status={req.status} />

                  {/* Action banner for CREDENTIALS_SHARED */}
                  {isCredentialsShared && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: '10px',
                        background: 'rgba(245,158,11,0.08)',
                        border: '1px solid rgba(245,158,11,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Lock size={14} color="#f59e0b" />
                      <Typography sx={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>
                        Host shared access · confirm it works to release payment
                      </Typography>
                    </Box>
                  )}

                  {/* Action buttons */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} mt={2}>
                    {isCredentialsShared ? (
                      <>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<CheckCircle2 size={16} />}
                          onClick={() => handleOpenCredsModal(req)}
                          id={`dashboard-confirm-unlock-${req.id}`}
                          sx={{
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            py: 1,
                          }}
                        >
                          Confirm &amp; Unlock
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<AlertTriangle size={15} />}
                          onClick={() => handleOpenCredsModal(req)}
                          id={`dashboard-report-issue-${req.id}`}
                          sx={{
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            color: '#ef4444',
                            borderColor: 'rgba(239,68,68,0.3)',
                            py: 1,
                            '&:hover': { borderColor: '#ef4444', background: 'rgba(239,68,68,0.08)' },
                          }}
                        >
                          Report an Issue
                        </Button>
                      </>
                    ) : req.listingId && (
                      <Button
                        fullWidth
                        size="small"
                        endIcon={<ChevronRight size={14} />}
                        onClick={() => navigate(`/app/marketplace/${req.listingId}`)}
                        id={`dashboard-view-listing-${req.id}`}
                        sx={{
                          borderRadius: '10px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          textTransform: 'none',
                          color: '#3b82f6',
                          border: '1px solid rgba(59,130,246,0.3)',
                          py: 0.75,
                          '&:hover': { background: 'rgba(59,130,246,0.1)' },
                        }}
                      >
                        View Listing Details
                      </Button>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* ── Upcoming Renewals (collapsed accordion) ──────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '18px',
          background: '#14161a',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          px={2.5}
          py={2}
          onClick={() => setRenewalsOpen((o) => !o)}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
          id="dashboard-renewals-accordion"
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                background: 'rgba(161,161,170,0.1)',
                border: '1px solid rgba(161,161,170,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={16} color="#a1a1aa" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#f3f4f6' }}>
                Upcoming Renewals
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>{renewalSubtitle}</Typography>
            </Box>
          </Stack>
          <ChevronRight
            size={18}
            color="#9ca3af"
            style={{
              transition: 'transform 0.25s ease',
              transform: renewalsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </Stack>

        <Collapse in={renewalsOpen}>
          <Box px={2.5} pb={2.5} pt={0}>
            <RenewalList />
          </Box>
        </Collapse>
      </Paper>

      {/* ── Recent Activity (collapsed accordion) ────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '18px',
          background: '#14161a',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          px={2.5}
          py={2}
          onClick={() => setActivityOpen((o) => !o)}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
          id="dashboard-activity-accordion"
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                background: 'rgba(161,161,170,0.1)',
                border: '1px solid rgba(161,161,170,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={16} color="#a1a1aa" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#f3f4f6' }}>
                Recent Activity
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>{activitySubtitle}</Typography>
            </Box>
          </Stack>
          <ChevronRight
            size={18}
            color="#9ca3af"
            style={{
              transition: 'transform 0.25s ease',
              transform: activityOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </Stack>

        <Collapse in={activityOpen}>
          <Box px={2.5} pb={2.5} pt={0}>
            <ActivityFeed />
          </Box>
        </Collapse>
      </Paper>

      {/* ── Protection Banner ────────────────────────────────────────────────── */}
      <ProtectionBanner />

      {/* ── Host Chat Dialog ─────────────────────────────────────────────────── */}
      <Dialog
        open={Boolean(chatHost)}
        onClose={() => setChatHost(null)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: '#14161a',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#f3f4f6',
            width: '100%',
            maxWidth: 420,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
          Chat with Host ({chatHost?.name})
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, borderRadius: '12px', background: '#1c1e24', mb: 2 }}>
            <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af' }}>
              Send a secure message directly to your group host regarding access credentials or renewal updates.
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Type your message to host..."
            variant="outlined"
          />
          <Button
            fullWidth
            variant="contained"
            onClick={() => setChatHost(null)}
            sx={{ mt: 2, borderRadius: '10px', fontWeight: 800, py: 1.1, textTransform: 'none', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
          >
            Send Message
          </Button>
        </DialogContent>
      </Dialog>

      {/* ── Member View Credentials & Upload Proof Modal ─────────────────────── */}
      <ViewCredentialsAndProofModal
        open={viewCredsModalOpen}
        onClose={() => setViewCredsModalOpen(false)}
        requestItem={selectedCredsReq}
        onSubmitProof={handleProofSelected}
      />

      {/* ── Verification Overlay Modal ───────────────────────────────────────── */}
      <VerificationOverlayModal
        open={verifyingModalOpen}
        onComplete={handleVerificationComplete}
      />

      {/* ── Toast Notification ───────────────────────────────────────────────── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
          icon={toast.severity === 'success' ? <CheckCircle2 size={18} /> : undefined}
          sx={{ width: '100%', borderRadius: '12px', fontWeight: 700 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}



export default Dashboard;
