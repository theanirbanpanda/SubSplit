import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHostJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  fetchMyListings,
  deleteListing,
  fetchUserReviews,
} from '../marketplace/marketplaceSlice';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Avatar,
  Collapse,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
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
  Trash2,
  Calendar,
  Users,
  Star,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateListingModal from '../marketplace/components/CreateListingModal';
import RaiseDisputeModal from '../disputes/RaiseDisputeModal';
import ManageListingModal from '../marketplace/components/ManageListingModal';
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
  const [manageModalOpen,         setManageModalOpen]         = useState(false);
  const [selectedManageListing,   setSelectedManageListing]   = useState(null);
  const [credentialsModalOpen,     setCredentialsModalOpen]     = useState(false);
  const [selectedRequestForCreds,  setSelectedRequestForCreds]  = useState(null);
  const [raiseDisputeOpen,         setRaiseDisputeOpen]         = useState(false);
  const [disputeTargetRequest,     setDisputeTargetRequest]     = useState(null);
  const [listingsOpen,             setListingsOpen]             = useState(true);
  const [reviewsOpen,              setReviewsOpen]              = useState(true);
  const [aiInsightsOpen,           setAiInsightsOpen]           = useState(true);
  const [deleteDialogOpen,         setDeleteDialogOpen]         = useState(false);
  const [listingToDelete,          setListingToDelete]          = useState(null);

  const pendingReviewRef = useRef(null);

  const { user } = useSelector((state) => state.auth || {});
  const { hostJoinRequests = [], myListings = [], userReviews, loading } = useSelector((state) => state.marketplace);

  useEffect(() => {
    dispatch(fetchHostJoinRequests());
    dispatch(fetchMyListings());
    if (user?.id) {
      dispatch(fetchUserReviews(user.id));
    }
  }, [dispatch, user?.id]);

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

  const confirmDeleteListing = (listing) => {
    setListingToDelete(listing);
    setDeleteDialogOpen(true);
  };

  const handleDeleteListing = async () => {
    if (listingToDelete) {
      await dispatch(deleteListing(listingToDelete.id));
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  // ── Derived stats from real data ─────────────────────────────────────────────
  let totalMonthlyEarnings = 0;
  let totalEarningsAllTime = 0;
  let totalSeats = 0;
  let filledSeats = 0;

  myListings.forEach((l) => {
    if (l.status?.toUpperCase() !== 'CANCELLED') {
      const filled = l.memberCount ?? ((l.totalSeats ?? 0) - (l.seatsLeft ?? 0));
      const monthly = (Number(l.price) || 0) * filled;
      totalMonthlyEarnings += monthly;

      let monthsActive = 1;
      if (l.createdAt || l.startDate) {
        const start = new Date(l.startDate || l.createdAt);
        const now = new Date();
        monthsActive = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
        if (monthsActive < 1) monthsActive = 1;
      }
      totalEarningsAllTime += (monthly * monthsActive);

      totalSeats += (Number(l.totalSeats) || 0);
      filledSeats += filled;
    }
  });

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
            <span>List Subscription</span>
          </button>
        </div>

        {/* Divider */}
        <div className={styles.heroDivider} />

        {/* Stats row */}
        <div className={styles.heroStatsRow}>
          {/* Earned this month chip */}
          <div className={styles.heroStatChip}>
            <div className={styles.heroChipIcon} data-color="green">
              <CircleDollarSign size={14} color="#22c55e" />
            </div>
            <div className={styles.heroChipText}>
              {myListings.length === 0 && loading ? (
                <strong className={styles.heroStatLoading}>—</strong>
              ) : (
                <strong className={styles.heroStatGreen}>
                  Rs.{totalMonthlyEarnings.toLocaleString('en-IN')}
                </strong>
              )}
              <span className={styles.heroChipLabel}>earned this month</span>
            </div>
          </div>

          {/* Earned total chip */}
          <div className={styles.heroStatChip}>
            <div className={styles.heroChipIcon} data-color="gold" style={{ background: 'rgba(250,204,21,0.15)' }}>
              <TrendingUp size={14} color="#facc15" />
            </div>
            <div className={styles.heroChipText}>
              {myListings.length === 0 && loading ? (
                <strong className={styles.heroStatLoading}>—</strong>
              ) : (
                <strong className={styles.heroStatWhite} style={{ color: '#facc15' }}>
                  Rs.{totalEarningsAllTime.toLocaleString('en-IN')}
                </strong>
              )}
              <span className={styles.heroChipLabel}>earned total</span>
            </div>
          </div>

          {/* Seats occupied chip */}
          <div className={styles.heroStatChip}>
            <div className={styles.heroChipIcon} data-color="blue">
              <Users size={14} color="#3b82f6" />
            </div>
            <div className={styles.heroChipText}>
              {occupancyRate != null ? (
                <strong className={styles.heroStatWhite}>
                  {filledSeats} / {totalSeats} <span style={{ fontSize: '0.8em', opacity: 0.7, fontWeight: 500 }}>({occupancyRate}%)</span>
                </strong>
              ) : (
                <strong className={styles.heroStatLoading}>—</strong>
              )}
              <span className={styles.heroChipLabel}>seats occupied</span>
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
          <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3, pt: 1 }}>
            {myListings.filter(l => l.status !== 'CANCELLED').length === 0 ? (
              <Typography sx={{ fontSize: '0.88rem', color: '#9ca3af', py: 2, textAlign: 'center' }}>
                No listings yet. Create your first pass!
              </Typography>
            ) : (
              <Stack spacing={1.75}>
                {myListings.filter(l => l.status !== 'CANCELLED').map((listing) => {
                  const theme = getProviderTheme(listing.platform || listing.title || '');
                  const filled = listing.memberCount ?? ((listing.totalSeats ?? 0) - (listing.seatsLeft ?? 0));
                  const total  = listing.totalSeats ?? 0;

                  return (
                    <Box
                      key={listing.id}
                      sx={{
                        borderRadius: '14px',
                        background: 'linear-gradient(180deg, #1a1c22 0%, #15171b 100%)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        px: { xs: 2, sm: 2.5 },
                        py: 2,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: { xs: 'flex-start', md: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          borderColor: 'rgba(255,255,255,0.18)',
                          boxShadow: '0 6px 20px -4px rgba(0,0,0,0.3)',
                          transform: 'translateY(-1px)'
                        },
                      }}
                    >
                      {/* Left Group: Logo + Title/Validity */}
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0, flex: 1 }}>
                        {/* Provider icon / Logo */}
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
                            borderRadius: '12px',
                            background: theme.bg,
                            border: `1px solid ${theme.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            overflow: 'hidden',
                          }}
                        >
                          {listing.logoUrl ? (
                            <img 
                              src={listing.logoUrl} 
                              alt={listing.platform || listing.title} 
                              style={{ width: '65%', height: '65%', objectFit: 'contain' }}
                              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'block'; }} 
                            />
                          ) : null}
                          <theme.Icon size={22} color={theme.color} style={{ display: listing.logoUrl ? 'none' : 'block' }} />
                        </Box>

                        {/* Title & Validity Row */}
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography 
                            sx={{ 
                              fontWeight: 700, 
                              fontSize: '0.96rem', 
                              color: '#ffffff', 
                              lineHeight: 1.35,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {listing.title}
                          </Typography>
                          {listing.renewalDate && (
                            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.5 }}>
                              <Calendar size={13} color="#9ca3af" />
                              <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 500 }}>
                                Validity: <Box component="span" sx={{ color: '#d1d5db', fontWeight: 600 }}>{listing.renewalDate}</Box>
                              </Typography>
                            </Stack>
                          )}
                        </Box>
                      </Stack>

                      {/* Right Group: Seats Pill + Manage + Delete */}
                      <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={1.5}
                        sx={{ 
                          width: { xs: '100%', md: 'auto' }, 
                          justifyContent: { xs: 'space-between', md: 'flex-end' },
                          flexShrink: 0,
                          pt: { xs: 1, md: 0 },
                          borderTop: { xs: '1px solid rgba(255,255,255,0.05)', md: 'none' }
                        }}
                      >
                        {/* Seat count pill */}
                        <Box sx={{
                          background: 'rgba(255,255,255,0.04)',
                          px: 1.75,
                          py: 0.65,
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75
                        }}>
                          <Users size={14} color="#9ca3af" />
                          <Typography
                            sx={{ fontSize: '0.82rem', color: '#9ca3af', whiteSpace: 'nowrap', fontWeight: 600 }}
                          >
                            <Box component="span" sx={{ color: filled > 0 ? '#22c55e' : '#9ca3af', fontWeight: 800 }}>{filled}</Box> / {total} seats
                          </Typography>
                        </Box>

                        {/* Manage Button */}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedManageListing(listing);
                            setManageModalOpen(true);
                          }}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            color: '#60a5fa',
                            borderColor: 'rgba(59,130,246,0.3)',
                            background: 'rgba(59,130,246,0.06)',
                            minWidth: '80px',
                            height: '36px',
                            px: 2,
                            '&:hover': {
                              borderColor: '#3b82f6',
                              background: 'rgba(59,130,246,0.15)',
                            },
                          }}
                        >
                          Manage
                        </Button>

                        {/* Delete Button */}
                        {(() => {
                          const hasActiveMembers = filled > 0;
                          const hasPendingRequests = hostJoinRequests.some(
                            req => req.listingId === listing.id && 
                            ['PENDING', 'CREDENTIALS_SHARED', 'PROOF_SUBMITTED'].includes(req.status)
                          );
                          const cannotDelete = hasActiveMembers || hasPendingRequests;

                          return (
                            <Tooltip 
                              title={cannotDelete ? "Cannot delete: Listing has active members or pending payments." : "Delete Listing"} 
                              arrow 
                              placement="top"
                            >
                              <span>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  disabled={cannotDelete}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDeleteListing(listing);
                                  }}
                                  sx={{
                                    borderRadius: '8px',
                                    minWidth: '36px',
                                    width: '36px',
                                    height: '36px',
                                    p: 0,
                                    color: '#ef4444',
                                    borderColor: 'rgba(239,68,68,0.3)',
                                    background: 'rgba(239,68,68,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                      borderColor: '#ef4444',
                                      background: 'rgba(239,68,68,0.15)',
                                    },
                                    '&.Mui-disabled': {
                                      borderColor: 'rgba(255,255,255,0.06)',
                                      color: 'rgba(255,255,255,0.2)',
                                      background: 'rgba(255,255,255,0.02)',
                                    }
                                  }}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </span>
                            </Tooltip>
                          );
                        })()}
                      </Stack>
                    </Box>
                  );
                })}

                {/* Settlements link */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  spacing={1.25}
                  py={1.5}
                  px={2.5}
                  onClick={() => navigate('/app/settlements')}
                  sx={{
                    borderRadius: '12px',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    background: 'rgba(34, 197, 94, 0.04)',
                    cursor: 'pointer',
                    color: '#22c55e',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      borderColor: 'rgba(34, 197, 94, 0.45)', 
                      background: 'rgba(34, 197, 94, 0.09)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 16px -2px rgba(34, 197, 94, 0.15)'
                    },
                  }}
                  id="host-view-payouts-link"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate('/app/settlements'); }}
                >
                  <ExternalLink size={16} color="#22c55e" />
                  <Typography sx={{ fontSize: '0.86rem', fontWeight: 700, color: '#22c55e' }}>
                    View all payouts &amp; settlements
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Box>
        </Collapse>
      </Paper>

      {/* ── Section: Ratings and Reviews (accordion, dynamic) ────────────────── */}
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
          onClick={() => setReviewsOpen((o) => !o)}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
          id="host-reviews-accordion"
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.97rem', color: '#f3f4f6' }}>
                Ratings &amp; Reviews
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                {userReviews?.totalReviews > 0
                  ? `${userReviews.totalReviews} verified ${userReviews.totalReviews === 1 ? 'review' : 'reviews'} • ${userReviews.averageRating?.toFixed(1) || '5.0'} ★`
                  : '0 reviews received'}
              </Typography>
            </Box>
          </Stack>
          <ChevronRight
            size={18}
            color="#9ca3af"
            style={{
              transition: 'transform 0.25s ease',
              transform: reviewsOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </Stack>

        <Collapse in={reviewsOpen}>
          <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3, pt: 1 }}>
            {!userReviews?.reviews || userReviews.reviews.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4.5,
                  px: 2,
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(255,255,255,0.08)',
                }}
              >
                <MessageSquare size={36} color="#64748b" style={{ marginBottom: 10 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#f3f4f6', mb: 0.5 }}>
                  No Reviews Received Yet
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af', maxWidth: 420, mx: 'auto', lineHeight: 1.5 }}>
                  When joinees purchase passes from your subscription listings and submit ratings, their verified feedback will appear here dynamically.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {/* Modern Rating Summary Card */}
                <Box
                  sx={{
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #1a1c22 0%, #15171b 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    p: 2.5,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2.5}>
                    <Typography sx={{ fontWeight: 900, fontSize: '2.5rem', color: '#ffffff', lineHeight: 1 }}>
                      {userReviews.averageRating?.toFixed(1) || '5.0'}
                    </Typography>
                    <Box>
                      <Stack direction="row" spacing={0.4} sx={{ mb: 0.5 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            fill={star <= Math.round(userReviews.averageRating || 5) ? '#22c55e' : 'transparent'}
                            color={star <= Math.round(userReviews.averageRating || 5) ? '#22c55e' : 'rgba(255,255,255,0.2)'}
                          />
                        ))}
                      </Stack>
                      <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 500 }}>
                        Based on {userReviews.totalReviews} verified {userReviews.totalReviews === 1 ? 'review' : 'reviews'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Reviews List - Modern Google Play / App Store style */}
                {userReviews.reviews.map((rev) => {
                  const rawName = rev.reviewerName || 'Verified Joinee';
                  const cleanName = rawName.includes('@') ? rawName.split('@')[0] : rawName;
                  const displayName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
                  const initials = rev.reviewerInitials || displayName.slice(0, 2).toUpperCase();
                  const rating = rev.rating || 5;
                  const date = rev.formattedDate || 'Recently';
                  const listingTitle = rev.listingTitle;

                  return (
                    <Box
                      key={rev.id}
                      sx={{
                        borderRadius: '14px',
                        background: '#16181d',
                        border: '1px solid rgba(255,255,255,0.07)',
                        p: { xs: 2, sm: 2.5 },
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.15)',
                          background: '#191b21',
                        },
                      }}
                    >
                      {/* Top Row: User Avatar, Name & Options */}
                      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5} sx={{ mb: 1.5 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
                          <Avatar
                            src={rev.reviewerAvatar}
                            sx={{
                              width: 36,
                              height: 36,
                              background: rev.avatarBg || avatarGradient(displayName),
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              color: '#ffffff',
                            }}
                          >
                            {initials}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.92rem', color: '#ffffff', lineHeight: 1.3 }}>
                              {displayName}
                            </Typography>
                          </Box>
                        </Stack>

                        {listingTitle && (
                          <Chip
                            label={listingTitle}
                            size="small"
                            sx={{
                              background: 'rgba(59,130,246,0.08)',
                              color: '#60a5fa',
                              border: '1px solid rgba(59,130,246,0.2)',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              height: 22,
                              maxWidth: { xs: 140, sm: 260 },
                            }}
                          />
                        )}
                      </Stack>

                      {/* Second Row: Star rating & Date */}
                      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.25 }}>
                        <Stack direction="row" spacing={0.3}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={13}
                              fill={star <= rating ? '#22c55e' : 'transparent'}
                              color={star <= rating ? '#22c55e' : 'rgba(255,255,255,0.2)'}
                            />
                          ))}
                        </Stack>
                        <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 500 }}>
                          {date}
                        </Typography>
                      </Stack>

                      {/* Third Row: Review text full width clean paragraph */}
                      {rev.reviewText && (
                        <Typography
                          sx={{
                            fontSize: '0.88rem',
                            color: '#d1d5db',
                            lineHeight: 1.6,
                            fontWeight: 400,
                            letterSpacing: '0.01em',
                          }}
                        >
                          {rev.reviewText}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            )}
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

      <ManageListingModal 
        open={manageModalOpen} 
        handleClose={() => setManageModalOpen(false)} 
        listing={selectedManageListing}
      />

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

      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: '#1c1e24',
            color: '#f3f4f6',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Delete Listing</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#9ca3af' }}>
            Are you sure you want to delete the listing 
            <Box component="span" sx={{ color: '#f3f4f6', fontWeight: 700, mx: 0.5 }}>
              "{listingToDelete?.title}"
            </Box>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            sx={{ color: '#9ca3af', textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteListing} 
            variant="contained" 
            color="error"
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}



export default HostCenter;
