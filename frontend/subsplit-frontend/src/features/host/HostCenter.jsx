import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHostJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  fetchMyListings,
} from '../marketplace/marketplaceSlice';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { ShieldCheck, TrendingUp, Users, Plus, ArrowUpRight, CheckCircle2, Clock, MessageSquare, XCircle, Sparkles, Edit, Pause, Copy, Flame, Tv2, Music, Bot, Layers, Zap, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateListingModal from '../marketplace/components/CreateListingModal';
import RaiseDisputeModal from '../disputes/RaiseDisputeModal';
import styles from './HostCenter.module.scss';


const LISTINGS_DATA = [
  {
    id: 'host-nflx',
    title: 'Netflix Premium 4K UHD',
    platform: 'Netflix',
    monthlyEarnings: 387,
    filledSeats: 3,
    totalSeats: 4,
    renewalDate: 'Aug 15, 2026',
    status: 'Active',
    health: 'Excellent',
    healthColor: '#22c55e',
    Icon: Tv2,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
  },
  {
    id: 'host-sptf',
    title: 'Spotify Premium Family',
    platform: 'Spotify',
    monthlyEarnings: 295,
    filledSeats: 5,
    totalSeats: 6,
    renewalDate: 'Aug 18, 2026',
    status: 'Active',
    health: 'Excellent',
    healthColor: '#22c55e',
    Icon: Music,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
  },
  {
    id: 'host-gpt',
    title: 'ChatGPT Plus Team',
    platform: 'OpenAI',
    monthlyEarnings: 1596,
    filledSeats: 4,
    totalSeats: 5,
    renewalDate: 'Aug 22, 2026',
    status: 'Active',
    health: 'Needs Attention',
    healthColor: '#f59e0b',
    Icon: Bot,
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
    border: 'rgba(20,184,166,0.3)',
  },
];

const RECENT_EARNINGS = [
  { text: 'Escrow Released for Netflix 4K', amount: '+₹299', date: 'Today, 1:20 PM', color: '#22c55e' },
  { text: 'Spotify Slot Joined by Ananya', amount: '+₹149', date: 'Yesterday', color: '#22c55e' },
  { text: 'Payout Transferred to UPI', amount: '-₹2,500', date: 'Aug 12, 2026', color: '#3b82f6' },
];

const AI_RECOMMENDATIONS = [
  {
    title: 'High Demand for ChatGPT Plus',
    suggestion: 'Create 1 more ChatGPT Plus listing to earn an extra ₹1,596/mo.',
    action: 'Create Listing',
    color: '#14b8a6',
  },
  {
    title: 'Optimize Spotify Slot Pricing',
    suggestion: 'Increase Spotify slot price by ₹15 (similar groups sell at ₹74/mo).',
    action: 'Update Price',
    color: '#22c55e',
  },
];

import ShareCredentialsModal from './components/ShareCredentialsModal';

function HostCenter() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [selectedRequestForCreds, setSelectedRequestForCreds] = useState(null);
  const [raiseDisputeOpen, setRaiseDisputeOpen] = useState(false);
  const [disputeTargetRequest, setDisputeTargetRequest] = useState(null);
  const { hostJoinRequests = [] } = useSelector((state) => state.marketplace);

  useEffect(() => {
    dispatch(fetchHostJoinRequests());
    dispatch(fetchMyListings());
  }, [dispatch]);

  const handleOpenCredentialsModal = (requestItem) => {
    setSelectedRequestForCreds(requestItem);
    setCredentialsModalOpen(true);
  };

  const handleShareCredentialsSubmit = async (credentialsData) => {
    if (!selectedRequestForCreds) return;
    await dispatch(
      acceptJoinRequest({
        requestId: selectedRequestForCreds.id,
        ...credentialsData,
      })
    );
    dispatch(fetchHostJoinRequests());
  };

  const handleRejectRequest = async (requestId) => {
    await dispatch(rejectJoinRequest(requestId));
    dispatch(fetchHostJoinRequests());
  };



  return (
    <div className={styles.hostContainer}>
      {/* Header & Top Actions */}
      <div className={styles.headerSection}>
        <div className={styles.headerInfo}>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>Host Center Workspace</h1>
            <Chip
              icon={<ShieldCheck size={13} color="#22c55e" />}
              label="Super Host Status"
              size="small"
              sx={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', fontWeight: 800, border: '1px solid rgba(34,197,94,0.3)' }}
            />
          </div>
          <p className={styles.subtitle}>
            Manage your subscription sharing business, pending member approvals, and monthly earnings.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            variant="contained"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={() => setCreateModalOpen(true)}
            sx={{
              borderRadius: '0.75rem',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.875rem',
              py: 1,
              px: 2.5,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            }}
          >
            List New Pass
          </Button>
        </div>

      </div>

      {/* Row 1: 4 Metric Overview Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Monthly Host Earnings</div>
          <div className={styles.metricValue} style={{ color: '#22c55e' }}>₹8,450 / mo</div>
          <Chip label="+18.4% this month" size="small" sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.66rem', height: 18 }} />
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Active Groups</div>
          <div className={styles.metricValue} style={{ color: '#f3f4f6' }}>4 Listings</div>
          <div className={styles.metricSubtext} style={{ color: '#9ca3af' }}>Netflix, Spotify, ChatGPT, Disney+</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Occupancy Rate</div>
          <div className={styles.metricValue} style={{ color: '#3b82f6' }}>91.6%</div>
          <div className={styles.metricSubtext} style={{ color: '#9ca3af' }}>11 of 12 Total Seats Filled</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Pending Requests</div>
          <div className={styles.metricValue} style={{ color: '#f59e0b' }}>2 Approvals</div>
          <div className={styles.metricSubtext} style={{ color: '#f59e0b' }}>Requires host action</div>
        </div>
      </div>


      {/* ─── Row 2: 60% / 40% Split (Listings Performance & Earnings Timeline) ─── */}
      <Grid container spacing={3} mb={4}>
        {/* Left 60%: Listing Performance Cards */}
        <Grid item xs={12} md={7.2}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '22px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.15rem' }}>
                Listing Performance Overview
              </Typography>
              <Button size="small" startIcon={<Plus size={14} />} onClick={() => setCreateModalOpen(true)} sx={{ textTransform: 'none', fontWeight: 700, color: '#3b82f6', fontSize: '0.82rem' }}>
                Add New
              </Button>
            </Stack>

            <Stack spacing={2}>
              {LISTINGS_DATA.map(({ id, title, monthlyEarnings, filledSeats, totalSeats, renewalDate, status, health, healthColor, Icon, color, bg, border }) => {
                const progress = (filledSeats / totalSeats) * 100;
                return (
                  <Paper
                    key={id}
                    elevation={0}
                    sx={{
                      p: 2.25,
                      borderRadius: '16px',
                      background: '#1c1e24',
                      border: '1px solid rgba(255,255,255,0.08)',
                      transition: 'border-color 0.15s ease',
                      '&:hover': { borderColor: '#2563eb' },
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={18} color={color} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                            {title}
                          </Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.2 }}>
                            Renews: {renewalDate}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip label={health} size="small" sx={{ background: `${healthColor}15`, color: healthColor, fontWeight: 800, fontSize: '0.64rem', height: 18 }} />
                        <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#22c55e' }}>
                          +₹{monthlyEarnings}/mo
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box sx={{ flexGrow: 1, mr: 3 }}>
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                            Occupancy ({filledSeats}/{totalSeats} Seats)
                          </Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, backgroundColor: '#252830', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #3b82f6 0%, #22c55e 100%)' } }} />
                      </Box>

                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#3b82f6' } }}>
                          <Edit size={15} />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#f59e0b' } }}>
                          <Pause size={15} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </Paper>
        </Grid>

        {/* Right 40%: Recent Earnings Timeline */}
        <Grid item xs={12} md={4.8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '22px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.1rem', mb: 2.5 }}>
              Recent Earnings & Payouts
            </Typography>

            <Stack spacing={2}>
              {RECENT_EARNINGS.map(({ text, amount, date, color }, idx) => (
                <Stack key={idx} direction="row" alignItems="center" justifyContent="space-between" p={1.75} sx={{ borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                      {text}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 0.3 }}>
                      {date}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '0.95rem', color }}>
                    {amount}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* ─── Row 3: Pending Join Requests (NO Tables!) ─── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', mb: 2.5, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
          Pending Member Join Requests
        </Typography>

        <Grid container spacing={2.5}>
          {hostJoinRequests && hostJoinRequests.length > 0 ? (
            hostJoinRequests.map((req) => {
              const { id, memberName, listingTitle, platform, price, status, message } = req;
              const isApproved = status === 'APPROVED';
              const isRejected = status === 'REJECTED';
              const isCredentialsShared = status === 'CREDENTIALS_SHARED';
              const initials = memberName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'M';

              return (
                <Grid item xs={12} md={6} key={id}>
                  <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: '#2563eb', fontWeight: 900, fontSize: '0.9rem' }}>
                          {initials}
                        </Avatar>
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={0.75}>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#f3f4f6' }}>
                              {memberName}
                            </Typography>
                            <ShieldCheck size={14} color="#22c55e" />
                          </Stack>
                          <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                            Reserved in Escrow: <Box component="span" sx={{ color: '#22c55e', fontWeight: 800 }}>₹{price}</Box>
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip label={platform || 'Pass'} size="small" sx={{ background: 'rgba(37,99,235,0.12)', color: '#3b82f6', fontWeight: 800, fontSize: '0.68rem' }} />
                    </Stack>

                    <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af', mb: 1 }}>
                      Requested: <Box component="span" sx={{ color: '#f3f4f6', fontWeight: 700 }}>{listingTitle}</Box>
                    </Typography>

                    {message && (
                      <Typography sx={{ fontSize: '0.76rem', color: '#6b7280', mb: 2, fontStyle: 'italic' }}>
                        "{message}"
                      </Typography>
                    )}

                    {isApproved ? (
                      <Box>
                        <Box sx={{ p: 1.25, borderRadius: '10px', background: 'rgba(34,197,94,0.15)', textAlign: 'center', mb: 1 }}>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#22c55e' }}>
                            ✓ Request Approved! Escrow payment released to wallet.
                          </Typography>
                        </Box>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          startIcon={<AlertTriangle size={14} />}
                          onClick={() => { setDisputeTargetRequest(req); setRaiseDisputeOpen(true); }}
                          sx={{ borderRadius: '9px', fontWeight: 700, textTransform: 'none', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', fontSize: '0.75rem', '&:hover': { borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)' } }}
                        >
                          Report Member Issue / Raise Dispute
                        </Button>
                      </Box>
                    ) : isCredentialsShared ? (
                      <Box>
                        <Box sx={{ p: 1.25, borderRadius: '10px', background: 'rgba(245,158,11,0.15)', textAlign: 'center', mb: 1 }}>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b' }}>
                            🔑 Credentials Shared! Awaiting Member Login Proof (24h Deadline).
                          </Typography>
                        </Box>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          startIcon={<AlertTriangle size={14} />}
                          onClick={() => { setDisputeTargetRequest(req); setRaiseDisputeOpen(true); }}
                          sx={{ borderRadius: '9px', fontWeight: 700, textTransform: 'none', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', fontSize: '0.75rem', '&:hover': { borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)' } }}
                        >
                          Report Member Issue / Raise Dispute
                        </Button>
                      </Box>
                    ) : isRejected ? (
                      <Box sx={{ p: 1.25, borderRadius: '10px', background: 'rgba(239,68,68,0.15)', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef4444' }}>
                          ✕ Request Declined. Funds refunded to member.
                        </Typography>
                      </Box>
                    ) : (
                      <Stack direction="row" spacing={1.5} mt={1}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          onClick={() => handleOpenCredentialsModal(req)}
                          sx={{ borderRadius: '10px', fontWeight: 800, textTransform: 'none', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                        >
                          Accept Request
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          onClick={() => handleRejectRequest(id)}
                          sx={{ borderRadius: '10px', fontWeight: 700, color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', textTransform: 'none', '&:hover': { borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)' } }}
                        >
                          Decline
                        </Button>
                      </Stack>
                    )}

                  </Paper>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', background: '#14161a', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: 600 }}>
                  No pending member join requests at this moment.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

      </Box>

      {/* ─── Row 4: Smart AI Recommendations ─── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', mb: 2.5, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
          Smart Host AI Recommendations
        </Typography>

        <Grid container spacing={2.5}>
          {AI_RECOMMENDATIONS.map(({ title, suggestion, action, color }) => (
            <Grid item xs={12} sm={6} key={title}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Stack direction="row" alignItems="center" spacing={1.25} mb={1}>
                  <Sparkles size={18} color={color} />
                  <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#f3f4f6' }}>
                    {title}
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af', mb: 2, lineHeight: 1.5 }}>
                  {suggestion}
                </Typography>
                <Button size="small" variant="outlined" sx={{ borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'none', color, borderColor: color }}>
                  {action}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Multi-step Create Listing Dialog */}
      <CreateListingModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />

      {/* Share Subscription Credentials Modal */}
      <ShareCredentialsModal
        open={credentialsModalOpen}
        onClose={() => setCredentialsModalOpen(false)}
        onSubmit={handleShareCredentialsSubmit}
        requestItem={selectedRequestForCreds}
      />

      {/* Host Raise Dispute Modal */}
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
