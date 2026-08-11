import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHostJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  fetchMyListings,
} from '../marketplace/marketplaceSlice';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Avatar,
  Collapse,
} from '@mui/material';
import {
  ShieldCheck,
  Plus,
  CheckCircle2,
  XCircle,
  Key,
  AlertTriangle,
  Layers,
  Sparkles,
  ChevronRight,
  Tv2,
  Music,
  Bot,
  Zap,
  CircleDollarSign,
  PieChart,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateListingModal from '../marketplace/components/CreateListingModal';
import RaiseDisputeModal from '../disputes/RaiseDisputeModal';
import ShareCredentialsModal from './components/ShareCredentialsModal';
import TrustRail from '../dashboard/components/TrustRail';
import styles from './HostCenter.module.scss';

// ── Provider icon theme map ───────────────────────────────────────────────────
const PROVIDER_ICONS = {
  netflix:  { Icon: Tv2,   color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.3)' },
  spotify:  { Icon: Music, color: '#22c55e', bg: 'rgba(34,197,94,0.15)',   border: 'rgba(34,197,94,0.3)' },
  chatgpt:  { Icon: Bot,   color: '#14b8a6', bg: 'rgba(20,184,166,0.15)', border: 'rgba(20,184,166,0.3)' },
};
const DEFAULT_ICON = { Icon: Zap, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' };

function getProviderTheme(platform = '') {
  const key = Object.keys(PROVIDER_ICONS).find((k) => platform.toLowerCase().includes(k));
  return key ? PROVIDER_ICONS[key] : DEFAULT_ICON;
}

// Gradient avatar background cycles per name initial
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
  'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
];
function avatarGradient(name = '') {
  return AVATAR_GRADIENTS[(name.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length];
}

function HostCenter() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const [createModalOpen,         setCreateModalOpen]         = useState(false);
  const [credentialsModalOpen,     setCredentialsModalOpen]     = useState(false);
  const [selectedRequestForCreds,  setSelectedRequestForCreds]  = useState(null);
  const [raiseDisputeOpen,         setRaiseDisputeOpen]         = useState(false);
  const [disputeTargetRequest,     setDisputeTargetRequest]     = useState(null);
  const [listingsOpen,             setListingsOpen]             = useState(false);
  const [aiInsightsOpen,           setAiInsightsOpen]           = useState(false);

  const pendingReviewRef = useRef(null);

  const { hostJoinRequests = [], myListings = [], loading } = useSelector((state) => state.marketplace);

  useEffect(() => {
    dispatch(fetchHostJoinRequests());
    dispatch(fetchMyListings());
  }, [dispatch]);

  // ── Handlers (wired exactly as before) ──────────────────────────────────────
  const handleOpenCredentialsModal = (requestItem) => {
    setSelectedRequestForCreds(requestItem);
    setCredentialsModalOpen(true);
  };

  const handleShareCredentialsSubmit = async (credentialsData) => {
    if (!selectedRequestForCreds) return;
    await dispatch(acceptJoinRequest({ requestId: selectedRequestForCreds.id, ...credentialsData }));
    dispatch(fetchHostJoinRequests());
  };

  const handleRejectRequest = async (requestId) => {
    await dispatch(rejectJoinRequest(requestId));
    dispatch(fetchHostJoinRequests());
  };

  // ── Derived stats from real data ─────────────────────────────────────────────
  // Monthly earnings: sum of (price × filledSeats) per listing
  // memberCount = totalSeats − seatsLeft (from normalizeListing)
  const totalMonthlyEarnings = myListings.reduce((sum, l) => {
    const filled = l.memberCount ?? ((l.totalSeats ?? 0) - (l.seatsLeft ?? 0));
    return sum + (Number(l.price) || 0) * filled;
  }, 0);

  const totalSeats  = myListings.reduce((sum, l) => sum + (Number(l.totalSeats) || 0), 0);
  const filledSeats = myListings.reduce((sum, l) => {
    const filled = l.memberCount ?? ((l.totalSeats ?? 0) - (l.seatsLeft ?? 0));
    return sum + filled;
  }, 0);
  const occupancyRate = totalSeats > 0 ? ((filledSeats / totalSeats) * 100).toFixed(1) : null;

  // "Needs review" = PENDING host join requests only
  const needsReviewCount = hostJoinRequests.filter((r) => r.status === 'PENDING').length;

  // "Needs action" section = PENDING + CREDENTIALS_SHARED
  const actionableRequests = hostJoinRequests.filter(
    (r) => r.status === 'PENDING' || r.status === 'CREDENTIALS_SHARED'
  );

  const activeListingsCount = myListings.filter(
    (l) => l.status?.toUpperCase() !== 'INACTIVE' && l.status?.toUpperCase() !== 'PAUSED'
  ).length;

  const handleNeedsReviewClick = () => {
    if (pendingReviewRef.current) {
      pendingReviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ── Small section icon chip ──────────────────────────────────────────────────
  const SectionChip = ({ icon: Icon, color, bg, border }) => (
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

  // ── Section count badge ──────────────────────────────────────────────────────
  const CountBadge = ({ count }) => (
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
      {count}
    </Box>
  );

  return (
    <div className={styles.hostContainer}>

      {/* ── Hero Card ──────────────────────────────────────────────────────── */}
      <div className={styles.heroCard}>
        {/* Top row */}
        <div className={styles.heroTopRow}>
          <div className={styles.heroTitleGroup}>
            <div className={styles.heroIconTile}>
              <ShieldCheck size={26} color="#fff" strokeWidth={2} />
            </div>
            <div className={styles.heroTitleStack}>
              <div className={styles.heroEyebrow}>
                <ShieldCheck size={11} color="#22c55e" />
                <span>SUPER HOST</span>
              </div>
              <h1 className={styles.heroPageTitle}>Host Center</h1>
            </div>
          </div>

          <button
            className={styles.heroListBtn}
            onClick={() => setCreateModalOpen(true)}
            id="host-list-new-pass-btn"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>List New Pass</span>
          </button>
        </div>

        {/* Divider */}
        <div className={styles.heroDivider} />

        {/* Stats row */}
        <div className={styles.heroStatsRow}>
          {/* Monthly earnings chip */}
          <div className={styles.heroStatChip}>
            <div className={styles.heroChipIcon} data-color="green">
              <CircleDollarSign size={14} color="#22c55e" />
            </div>
            <div className={styles.heroChipText}>
              {myListings.length === 0 && loading ? (
                <strong className={styles.heroStatLoading}>—</strong>
              ) : myListings.length > 0 ? (
                <strong className={styles.heroStatGreen}>
                  Rs.{totalMonthlyEarnings.toLocaleString('en-IN')}
                </strong>
              ) : (
                <strong className={styles.heroStatLoading}>—</strong>
              )}
              <span className={styles.heroChipLabel}>earned/mo</span>
            </div>
          </div>

          {/* Occupancy chip */}
          <div className={styles.heroStatChip}>
            <div className={styles.heroChipIcon} data-color="blue">
              <PieChart size={14} color="#3b82f6" />
            </div>
            <div className={styles.heroChipText}>
              {occupancyRate != null ? (
                <strong className={styles.heroStatWhite}>{occupancyRate}%</strong>
              ) : (
                <strong className={styles.heroStatLoading}>—</strong>
              )}
              <span className={styles.heroChipLabel}>occupied</span>
            </div>
          </div>

          {/* Needs review pill */}
          {needsReviewCount > 0 && (
            <button
              className={styles.heroNeedsReviewPill}
              onClick={handleNeedsReviewClick}
              id="host-needs-review-pill"
            >
              <span className={styles.heroPillDot} />
              <span>{needsReviewCount} need your review</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Section: Needs Your Action ────────────────────────────────────── */}
      <Box ref={pendingReviewRef} id="host-needs-action">
        <Stack direction="row" alignItems="center" spacing={1.25} mb={2.5}>
          <SectionChip
            icon={AlertTriangle}
            color="#f59e0b"
            bg="rgba(245,158,11,0.12)"
            border="rgba(245,158,11,0.3)"
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.25rem', letterSpacing: '-0.02em' }}
          >
            Needs Your Action
          </Typography>
          {actionableRequests.length > 0 && <CountBadge count={actionableRequests.length} />}
        </Stack>

        {actionableRequests.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 3.5, borderRadius: '18px', background: '#14161a',
              border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center',
            }}
          >
            <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: 600 }}>
              No pending member join requests at this moment.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={1.5}>
            {actionableRequests.map((req) => {
              const { id, memberName, listingTitle, platform, price, status, message } = req;
              const isPending          = status === 'PENDING';
              const isCredentialsShared = status === 'CREDENTIALS_SHARED';
              const initials = (memberName || '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
              const gradBg   = avatarGradient(memberName || '');

              return (
                <Paper
                  key={id}
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: '18px',
                    background: '#14161a',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderLeft: '3px solid #f59e0b',
                    overflow: 'hidden',
                  }}
                >
                  {/* Member row */}
                  <Stack direction="row" alignItems="center" spacing={1.5} mb={0.75}>
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        background: gradBg,
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.97rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                          {memberName || 'Member'}
                        </Typography>
                        <ShieldCheck size={14} color="#22c55e" />
                      </Stack>
                      {price != null && (
                        <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          Escrow reserved:{' '}
                          <Box component="span" sx={{ color: '#22c55e', fontWeight: 700 }}>
                            Rs.{price}
                          </Box>
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  {/* Listing title */}
                  <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af', mb: 1.5 }}>
                    Requested{' '}
                    <Box component="span" sx={{ color: '#f3f4f6', fontWeight: 700 }}>
                      {listingTitle || 'Subscription Group'}
                    </Box>
                  </Typography>

                  {/* Trust Rail — hostView shifts PENDING to step 1 */}
                  <TrustRail status={status} hostView />

                  {/* Status banner */}
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
                      <Key size={14} color="#f59e0b" />
                      <Typography sx={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>
                        Awaiting member login proof · 24h left
                      </Typography>
                    </Box>
                  )}

                  {/* Action buttons */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} mt={2}>
                    {isPending ? (
                      <>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<CheckCircle2 size={16} />}
                          onClick={() => handleOpenCredentialsModal(req)}
                          id={`host-accept-${id}`}
                          sx={{
                            borderRadius: '10px',
                            fontWeight: 800,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            py: 1,
                            fontSize: '0.9rem',
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<XCircle size={16} />}
                          onClick={() => handleRejectRequest(id)}
                          id={`host-decline-${id}`}
                          sx={{
                            borderRadius: '10px',
                            fontWeight: 700,
                            color: '#ef4444',
                            borderColor: 'rgba(239,68,68,0.35)',
                            textTransform: 'none',
                            py: 1,
                            fontSize: '0.9rem',
                            '&:hover': { borderColor: '#ef4444', background: 'rgba(239,68,68,0.08)' },
                          }}
                        >
                          Decline
                        </Button>
                      </>
                    ) : isCredentialsShared ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AlertTriangle size={15} />}
                        onClick={() => { setDisputeTargetRequest(req); setRaiseDisputeOpen(true); }}
                        id={`host-dispute-${id}`}
                        sx={{
                          borderRadius: '10px',
                          fontWeight: 700,
                          color: '#ef4444',
                          borderColor: 'rgba(239,68,68,0.35)',
                          textTransform: 'none',
                          py: 1,
                          fontSize: '0.9rem',
                          '&:hover': { borderColor: '#ef4444', background: 'rgba(239,68,68,0.08)' },
                        }}
                      >
                        Raise Dispute
                      </Button>
                    ) : null}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* ── Section: Your Listings (accordion) ────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '18px',
          background: '#14161a',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Accordion header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          px={2.5}
          py={2}
          onClick={() => setListingsOpen((o) => !o)}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
          id="host-listings-accordion"
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
              <Layers size={16} color="#a1a1aa" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.97rem', color: '#f3f4f6' }}>
                Your Listings
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                {loading && myListings.length === 0
                  ? 'Loading…'
                  : `${activeListingsCount || myListings.length} active`}
              </Typography>
            </Box>
          </Stack>
          <ChevronRight
            size={18}
            color="#9ca3af"
            style={{
              transition: 'transform 0.25s ease',
              transform: listingsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </Stack>

        <Collapse in={listingsOpen}>
          <Box px={2.5} pb={2.5} pt={0.5}>
            {myListings.length === 0 ? (
              <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af', py: 1.5 }}>
                No listings yet. Create your first pass!
              </Typography>
            ) : (
              <Stack spacing={1.25}>
                {myListings.map((listing) => {
                  const theme = getProviderTheme(listing.platform || listing.title || '');
                  const filled = listing.memberCount ?? ((listing.totalSeats ?? 0) - (listing.seatsLeft ?? 0));
                  const total  = listing.totalSeats ?? 0;
                  const earning = listing.price != null ? Number(listing.price) * filled : null;

                  return (
                    <Stack
                      key={listing.id}
                      direction={{ xs: 'column', sm: 'row' }}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      spacing={1.5}
                      px={1.5}
                      py={1.25}
                      sx={{
                        borderRadius: '12px',
                        background: '#1c1e24',
                        border: '1px solid rgba(255,255,255,0.06)',
                        transition: 'border-color 0.18s ease',
                        '&:hover': { borderColor: 'rgba(34,197,94,0.3)' },
                      }}
                    >
                      {/* Provider icon */}
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '10px',
                          background: theme.bg,
                          border: `1px solid ${theme.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <theme.Icon size={18} color={theme.color} />
                      </Box>

                      {/* Name + renewal */}
                      <Box flex={1} minWidth={0}>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                          {listing.title}
                        </Typography>
                        {listing.renewalDate && (
                          <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', mt: 0.2 }}>
                            Renews: {listing.renewalDate}
                          </Typography>
                        )}
                      </Box>

                      {/* Seat count */}
                      <Typography
                        sx={{ fontSize: '0.78rem', color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }}
                      >
                        {filled}/{total} seats
                      </Typography>

                      {/* Earning */}
                      {earning != null && (
                        <Typography
                          sx={{ fontWeight: 900, fontSize: '0.92rem', color: '#22c55e', whiteSpace: 'nowrap', flexShrink: 0 }}
                        >
                          +Rs.{earning}/mo
                        </Typography>
                      )}
                    </Stack>
                  );
                })}
              </Stack>
            )}

            {/* Settlements link */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              mt={2}
              p={1.5}
              onClick={() => navigate('/app/settlements')}
              sx={{
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.07)',
                cursor: 'pointer',
                color: '#9ca3af',
                transition: 'all 0.18s ease',
                '&:hover': { borderColor: 'rgba(34,197,94,0.3)', color: '#22c55e' },
              }}
              id="host-view-payouts-link"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate('/app/settlements'); }}
            >
              <ExternalLink size={14} />
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'inherit' }}>
                View all payouts &amp; settlements
              </Typography>
            </Stack>
          </Box>
        </Collapse>
      </Paper>

      {/* ── Section: AI Insights (accordion, static empty state) ──────────── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '18px',
          background: '#14161a',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Accordion header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          px={2.5}
          py={2}
          onClick={() => setAiInsightsOpen((o) => !o)}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
          id="host-ai-accordion"
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                background: 'rgba(168,85,247,0.12)',
                border: '1px solid rgba(168,85,247,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={16} color="#a855f7" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.97rem', color: '#f3f4f6' }}>
                AI Insights
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                Not available yet
              </Typography>
            </Box>
          </Stack>
          <ChevronRight
            size={18}
            color="#9ca3af"
            style={{
              transition: 'transform 0.25s ease',
              transform: aiInsightsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </Stack>

        <Collapse in={aiInsightsOpen}>
          <Box px={2.5} pb={2.5} pt={0.5}>
            <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.6 }}>
              AI-powered hosting recommendations are not available yet. Check back soon.
            </Typography>
          </Box>
        </Collapse>
      </Paper>

      {/* ── Modals (all handlers wired exactly as before) ─────────────────── */}
      <CreateListingModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />

      <ShareCredentialsModal
        open={credentialsModalOpen}
        onClose={() => setCredentialsModalOpen(false)}
        onSubmit={handleShareCredentialsSubmit}
        requestItem={selectedRequestForCreds}
      />

      <RaiseDisputeModal
        open={raiseDisputeOpen}
        onClose={() => { setRaiseDisputeOpen(false); setDisputeTargetRequest(null); }}
        listing={disputeTargetRequest ? { id: disputeTargetRequest.listingId, title: disputeTargetRequest.listingTitle } : null}
        joinRequest={disputeTargetRequest}
      />
    </div>
  );
}



export default HostCenter;
