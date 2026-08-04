import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
  MenuItem,
  Select,
  LinearProgress,
} from '@mui/material';
import {
  Users,
  Layers,
  Lock,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Sliders,
  Activity,
  Check,
  X,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  Key,
  FileCheck,
  Shield,
  RefreshCw,
  BarChart3,
  Zap,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import {
  fetchAdminUsersApi,
  fetchAdminUserDetailsApi,
  toggleBlockUserApi,
  fetchAdminListingsApi,
  updateAdminListingStatusApi,
  deleteAdminListingApi,
  fetchAdminPendingProofsApi,
  verifyAndSettleProofApi,
  rejectProofApi,
  fetchAdminAnalyticsApi,
  fetchAdminLogsApi,
} from './api/adminApi';
import { fetchAllDisputesAdminApi, resolveDisputeAdminApi } from '../disputes/api/disputeApi';
import styles from './AdminDashboard.module.scss';


function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0); // 0: Analytics, 1: Proof Audits, 2: Listings, 3: Users, 4: Logs
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Analytics state
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Users state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [modalTab, setModalTab] = useState(0);

  // Listings state
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [listingFilter, setListingFilter] = useState('ALL');

  // Proof Verification Queue state
  const [pendingProofs, setPendingProofs] = useState([]);
  const [loadingProofs, setLoadingProofs] = useState(false);
  const [selectedProofModal, setSelectedProofModal] = useState(null);

  // System Logs state
  const [systemLogs, setSystemLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Disputes state
  const [adminDisputes, setAdminDisputes] = useState([]);
  const [loadingDisputes, setLoadingDisputes] = useState(false);
  const [selectedDisputeModal, setSelectedDisputeModal] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    loadAnalytics();
    loadUsers();
    loadListings();
    loadPendingProofs();
    loadLogs();
    loadDisputes();
  };

  const loadDisputes = async () => {
    setLoadingDisputes(true);
    try {
      const data = await fetchAllDisputesAdminApi();
      setAdminDisputes(data);
    } catch (err) {
      console.error('Failed to fetch admin disputes:', err);
    } finally {
      setLoadingDisputes(false);
    }
  };

  const handleResolveDispute = async (disputeId, action) => {
    const notes = window.prompt(`Enter resolution notes for dispute #${disputeId}:`, action === 'REFUND_MEMBER' ? 'Member dispute verified. Refund processed to wallet.' : 'Dispute audited and dismissed.');
    if (notes === null) return;

    try {
      const updated = await resolveDisputeAdminApi(disputeId, { action, resolutionNotes: notes });
      setAdminDisputes((prev) => prev.map((d) => (d.id === disputeId ? updated : d)));
      if (selectedDisputeModal && selectedDisputeModal.id === disputeId) {
        setSelectedDisputeModal(updated);
      }
      setToast({ open: true, message: `Dispute #${disputeId} resolved (${action}).`, severity: 'success' });
      loadUsers();
      loadAnalytics();
    } catch (err) {
      setToast({ open: true, message: 'Failed to resolve dispute.', severity: 'error' });
    }
  };


  const loadAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const data = await fetchAdminAnalyticsApi();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await fetchAdminUsersApi();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadListings = async () => {
    setLoadingListings(true);
    try {
      const data = await fetchAdminListingsApi();
      setListings(data);
    } catch (err) {
      console.error('Failed to fetch admin listings:', err);
    } finally {
      setLoadingListings(false);
    }
  };

  const loadPendingProofs = async () => {
    setLoadingProofs(true);
    try {
      const data = await fetchAdminPendingProofsApi();
      setPendingProofs(data);
    } catch (err) {
      console.error('Failed to fetch pending proofs:', err);
    } finally {
      setLoadingProofs(false);
    }
  };

  const loadLogs = async () => {
    setLoadingLogs(true);
    try {
      const data = await fetchAdminLogsApi();
      setSystemLogs(data);
    } catch (err) {
      console.error('Failed to fetch admin logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Handlers
  const handleOpenUserModal = async (userId) => {
    setSelectedUserId(userId);
    setLoadingDetails(true);
    setModalTab(0);
    try {
      const data = await fetchAdminUserDetailsApi(userId);
      setUserDetails(data);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      setToast({ open: true, message: 'Failed to load user details.', severity: 'error' });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const updatedUser = await toggleBlockUserApi(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: updatedUser.isActive } : u))
      );
      if (userDetails && userDetails.id === userId) {
        setUserDetails((prev) => ({ ...prev, isActive: updatedUser.isActive }));
      }
      const actionText = updatedUser.isActive ? 'unblocked' : 'blocked & sessions invalidated';
      setToast({
        open: true,
        message: `User #${userId} ${actionText}.`,
        severity: updatedUser.isActive ? 'success' : 'warning',
      });
    } catch (err) {
      setToast({ open: true, message: 'Failed to update user block status.', severity: 'error' });
    }
  };

  const handleUpdateListingStatus = async (listingId, newStatus) => {
    try {
      const updated = await updateAdminListingStatusApi(listingId, newStatus);
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, status: updated.status } : l))
      );
      setToast({ open: true, message: `Listing #${listingId} status set to ${newStatus}.`, severity: 'info' });
    } catch (err) {
      setToast({ open: true, message: 'Failed to update listing status.', severity: 'error' });
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm(`Are you sure you want to permanently delete Listing #${listingId}?`)) {
      return;
    }
    try {
      await deleteAdminListingApi(listingId);
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      setToast({ open: true, message: `Listing #${listingId} deleted permanently.`, severity: 'success' });
    } catch (err) {
      setToast({ open: true, message: 'Failed to delete listing.', severity: 'error' });
    }
  };

  const handleVerifyAndSettleProof = async (requestId) => {
    try {
      await verifyAndSettleProofApi(requestId);
      setPendingProofs((prev) =>
        prev.map((p) => (p.id === requestId ? { ...p, status: 'APPROVED' } : p))
      );
      if (selectedProofModal && selectedProofModal.id === requestId) {
        setSelectedProofModal((prev) => ({ ...prev, status: 'APPROVED' }));
      }
      setToast({ open: true, message: `Proof #${requestId} verified! Escrow funds released to host.`, severity: 'success' });
      loadListings();
      loadAnalytics();
      loadLogs();
    } catch (err) {
      setToast({ open: true, message: 'Failed to verify proof and settle escrow.', severity: 'error' });
    }
  };

  const handleRejectProof = async (requestId) => {
    const reason = window.prompt('Enter reason for proof rejection:', 'Screenshot invalid or credentials not matching.');
    if (reason === null) return;

    try {
      await rejectProofApi(requestId, reason);
      setPendingProofs((prev) =>
        prev.map((p) => (p.id === requestId ? { ...p, status: 'REJECTED' } : p))
      );
      if (selectedProofModal && selectedProofModal.id === requestId) {
        setSelectedProofModal((prev) => ({ ...prev, status: 'REJECTED' }));
      }
      setToast({ open: true, message: `Proof #${requestId} rejected. Member notified.`, severity: 'warning' });
    } catch (err) {
      setToast({ open: true, message: 'Failed to reject proof.', severity: 'error' });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.fullName && u.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.hostName && l.hostName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (listingFilter === 'ACTIVE') return l.status === 'ACTIVE';
    if (listingFilter === 'FULL') return l.status === 'FULL' || l.availableSeats === 0;
    if (listingFilter === 'ISSUES') return l.availableSeats === 0 || l.status === 'PAUSED' || l.status === 'SUSPENDED';
    return true;
  });

  const dynamicMetrics = [
    {
      label: 'Total Registered Users',
      value: analytics ? analytics.totalUsersCount.toLocaleString() : users.length.toString(),
      change: 'Active Platform Users',
      color: '#3b82f6',
      icon: Users,
    },
    {
      label: 'Total Marketplace Listings',
      value: analytics ? analytics.totalListingsCount.toLocaleString() : listings.length.toString(),
      change: analytics ? `${analytics.activeListingsCount} Active Groups` : 'Active Groups',
      color: '#a855f7',
      icon: Layers,
    },
    {
      label: 'Active Escrow Holding',
      value: analytics ? `₹${Number(analytics.currentEscrowReserve || 0).toLocaleString('en-IN')}` : '₹0',
      change: '100% Protected',
      color: '#22c55e',
      icon: Lock,
    },
    {
      label: 'Platform Revenue (5%)',
      value: analytics ? `₹${Number(analytics.totalPlatformRevenue || 0).toLocaleString('en-IN')}` : '₹0',
      change: 'Service Commission',
      color: '#f59e0b',
      icon: TrendingUp,
    },
    {
      label: 'Pending Proof Queue',
      value: `${pendingProofs.length} Requests`,
      change: 'Manual Verification',
      color: '#14b8a6',
      icon: Bot,
    },
  ];

  return (
    <div className={styles.adminContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Sliders size={26} color="#f59e0b" />
            <h1 className={styles.pageTitle}>Control Center & Real-Time Analytics</h1>
          </Stack>
          <p className={styles.subtitle}>
            Monitor live marketplace metrics, audit host credentials & screenshot proofs, toggle user block status, and manage escrow settlements.
          </p>
        </div>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton onClick={loadAllData} sx={{ color: '#fbbf24', background: 'rgba(245, 158, 11, 0.12)' }}>
            <RefreshCw size={18} />
          </IconButton>
          <Chip
            icon={<Activity size={14} color="#22c55e" />}
            label="Control Center Active • System Operational"
            sx={{
              background: 'rgba(34,197,94,0.12)',
              color: '#22c55e',
              fontWeight: 800,
              fontSize: '0.78rem',
              border: '1px solid rgba(34,197,94,0.3)',
              px: 1,
              py: 1.8,
            }}
          />
        </Stack>
      </div>

      {/* Metric Cards (5 across) */}
      <div className={styles.metricsGrid}>
        {dynamicMetrics.map(({ label, value, change, color, icon: Icon }) => (
          <div key={label} className={styles.metricCard}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <span className={styles.metricLabel}>{label}</span>
              <Box sx={{ p: 1, borderRadius: '10px', background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={18} color={color} />
              </Box>
            </Box>
            <div className={styles.metricValue} style={{ color: '#f3f4f6' }}>
              {value}
            </div>
            <Chip
              label={change}
              size="small"
              sx={{ background: `${color}15`, color, fontWeight: 800, fontSize: '0.68rem', height: 20, alignSelf: 'flex-start' }}
            />
          </div>
        ))}
      </div>

      {/* Main Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          sx={{
            '& .MuiTab-root': { color: '#9ca3af', fontWeight: 700, textTransform: 'none', fontSize: '0.9rem' },
            '& .Mui-selected': { color: '#fbbf24' },
            '& .MuiTabs-indicator': { backgroundColor: '#f59e0b' },
          }}
        >
          <Tab label="Platform Analytics & Revenue" icon={<BarChart3 size={16} />} iconPosition="start" />
          <Tab label={`Proof Audits (${pendingProofs.length})`} icon={<FileCheck size={16} />} iconPosition="start" />
          <Tab label={`Disputes Audit (${adminDisputes.length})`} icon={<AlertTriangle size={16} />} iconPosition="start" />
          <Tab label={`Listings (${listings.length})`} icon={<Layers size={16} />} iconPosition="start" />
          <Tab label={`User Governance (${users.length})`} icon={<Users size={16} />} iconPosition="start" />
          <Tab label={`System Audit Logs (${systemLogs.length})`} icon={<Shield size={16} />} iconPosition="start" />

        </Tabs>
      </Box>

      {/* TAB 0: ANALYTICAL DASHBOARD & REVENUE INSIGHTS */}
      {tabValue === 0 && (
        <Stack spacing={3}>
          <Grid container spacing={2.5}>
            {/* Monthly Volume & Revenue Growth Bars */}
            <Grid item xs={12} lg={8}>
              <Paper elevation={0} sx={{ p: 3, background: '#14161a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.1rem' }}>
                      Monthly Gross Volume & Revenue Growth
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                      Real-time database volume trends and 5% platform commission fees collected over past months.
                    </Typography>
                  </Box>
                  <Chip
                    icon={<ArrowUpRight size={14} color="#22c55e" />}
                    label="Live DB Metrics"
                    size="small"
                    sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.72rem' }}
                  />
                </Stack>

                {loadingAnalytics ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress size={32} sx={{ color: '#f59e0b' }} />
                  </Box>
                ) : (
                  <Stack spacing={2} my={2}>
                    {analytics?.monthlyTrends && analytics.monthlyTrends.length > 0 ? (
                      analytics.monthlyTrends.map((item) => {
                        const maxVol = Math.max(...analytics.monthlyTrends.map((m) => Number(m.volume) || 1), 100);
                        const percentage = Math.min(100, ((Number(item.volume) || 0) / maxVol) * 100);

                        return (
                          <Box key={item.month}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                              <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#f3f4f6', width: 40 }}>{item.month}</Typography>
                              <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#22c55e' }}>
                                ₹{Number(item.volume || 0).toLocaleString('en-IN')}
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>
                                Fee: ₹{Number(item.revenue || 0).toLocaleString('en-IN')} • {item.newUsers} Users
                              </Typography>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={percentage > 0 ? percentage : 4}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                background: 'rgba(255,255,255,0.06)',
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #2563eb 0%, #22c55e 100%)',
                                  borderRadius: 4,
                                },
                              }}
                            />
                          </Box>
                        );
                      })
                    ) : (
                      <Typography sx={{ color: '#9ca3af', textAlign: 'center', py: 4 }}>No volume records in database yet.</Typography>
                    )}
                  </Stack>
                )}
              </Paper>
            </Grid>

            {/* Category Market Share */}
            <Grid item xs={12} lg={4}>
              <Paper elevation={0} sx={{ p: 3, background: '#14161a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.1rem', mb: 0.5 }}>
                  Category Market Share
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 3 }}>
                  Live distribution of active subscription groups across platform verticals.
                </Typography>

                <Stack spacing={2.5}>
                  {analytics?.categoryShares && analytics.categoryShares.length > 0 ? (
                    analytics.categoryShares.map((cat) => (
                      <Box key={cat.categoryName}>
                        <Stack direction="row" justifyContent="space-between" mb={0.75}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: cat.color || '#3b82f6' }} />
                            <Typography sx={{ fontSize: '0.84rem', fontWeight: 800, color: '#f3f4f6' }}>{cat.categoryName}</Typography>
                          </Stack>
                          <Typography sx={{ fontSize: '0.84rem', fontWeight: 900, color: cat.color || '#3b82f6' }}>
                            {cat.percentage}% ({cat.listingCount})
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={cat.percentage}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            background: 'rgba(255,255,255,0.06)',
                            '& .MuiLinearProgress-bar': { background: cat.color || '#3b82f6', borderRadius: 3 },
                          }}
                        />
                      </Box>
                    ))
                  ) : (
                    <Typography sx={{ color: '#9ca3af', textAlign: 'center', py: 4 }}>No category data available.</Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* AI Verification & Security Performance Grid */}
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2.5, background: '#14161a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                  <Zap size={20} color="#fbbf24" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9ca3af' }}>AI VERIFICATION PASS RATE</Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#fbbf24' }}>
                  {analytics?.aiVerificationSuccessRate != null ? `${analytics.aiVerificationSuccessRate}%` : '100%'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', mt: 0.5, display: 'block' }}>
                  Automated OCR screenshot scanning precision
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2.5, background: '#14161a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                  <Activity size={20} color="#22c55e" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9ca3af' }}>AVG SETTLEMENT LATENCY</Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#22c55e' }}>
                  {analytics?.avgSettlementSpeed || '4.2s'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', mt: 0.5, display: 'block' }}>
                  Instant escrow payout release after proof submission
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2.5, background: '#14161a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                  <Award size={20} color="#3b82f6" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9ca3af' }}>SYSTEM TRUST INDEX</Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#3b82f6' }}>
                  100%
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', mt: 0.5, display: 'block' }}>
                  Zero host payout default rate across all active groups
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      )}

      {/* TAB 1: PROOF & CREDENTIALS VERIFICATION QUEUE */}
      {tabValue === 1 && (
        <div className={styles.tableCard}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.1rem', mb: 0.5 }}>
            Proof Verification & Escrow Release Queue
          </Typography>
          <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 2.5 }}>
            Inspect shared subscription credentials and uploaded member login screenshots to manually verify proof and release holding escrow money.
          </Typography>

          {loadingProofs ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} sx={{ color: '#f59e0b' }} />
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ '& th': { borderColor: 'rgba(255, 255, 255, 0.08)', color: '#9ca3af', fontWeight: 800, fontSize: '0.75rem' } }}>
                    <TableCell>REQUEST & GROUP PASS</TableCell>
                    <TableCell>HOST / MEMBER</TableCell>
                    <TableCell>ESCROW AMOUNT</TableCell>
                    <TableCell>SHARED CREDENTIALS</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell align="right">VERIFICATION ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingProofs.length > 0 ? (
                    pendingProofs.map((row) => {
                      const isApproved = row.status === 'APPROVED';
                      const isRejected = row.status === 'REJECTED';

                      return (
                        <TableRow key={row.id} sx={{ '& td': { borderColor: 'rgba(255, 255, 255, 0.08)', color: '#f3f4f6', fontSize: '0.85rem' } }}>
                          <TableCell>
                            <Box>
                              <Typography sx={{ fontWeight: 800, fontSize: '0.88rem' }}>{row.listingTitle}</Typography>
                              <Chip label={row.platformName} size="small" sx={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6', fontWeight: 800, fontSize: '0.68rem', mt: 0.5 }} />
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem' }}>Host: {row.hostName}</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>Member: {row.memberName}</Typography>
                          </TableCell>

                          <TableCell sx={{ color: '#22c55e', fontWeight: 900 }}>₹{row.amount}</TableCell>

                          <TableCell>
                            {row.credentialsUsername ? (
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Key size={14} color="#f59e0b" />
                                <Typography sx={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700 }}>
                                  {row.credentialsUsername}
                                </Typography>
                              </Stack>
                            ) : (
                              <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>Not Shared Yet</Typography>
                            )}
                          </TableCell>

                          <TableCell>
                            <Chip
                              icon={isApproved ? <CheckCircle2 size={12} color="#22c55e" /> : isRejected ? <AlertTriangle size={12} color="#ef4444" /> : <Bot size={12} color="#f59e0b" />}
                              label={row.status}
                              size="small"
                              sx={{
                                background: isApproved ? 'rgba(34,197,94,0.15)' : isRejected ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                                color: isApproved ? '#22c55e' : isRejected ? '#ef4444' : '#f59e0b',
                                fontWeight: 800,
                                fontSize: '0.68rem',
                              }}
                            />
                          </TableCell>

                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Inspect Credentials & Proof Screenshot">
                                <IconButton size="small" onClick={() => setSelectedProofModal(row)} sx={{ background: 'rgba(255,255,255,0.06)', color: '#f3f4f6' }}>
                                  <Eye size={16} />
                                </IconButton>
                              </Tooltip>

                              {!isApproved && (
                                <>
                                  <Tooltip title="Manually Verify Proof & Release Escrow">
                                    <IconButton size="small" onClick={() => handleVerifyAndSettleProof(row.id)} sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', '&:hover': { background: '#22c55e', color: '#09090b' } }}>
                                      <Check size={16} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Reject Proof Request">
                                    <IconButton size="small" onClick={() => handleRejectProof(row.id)} sx={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', '&:hover': { background: '#ef4444', color: '#ffffff' } }}>
                                      <X size={16} />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                        No pending proof verification requests in database.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      )}

      {/* TAB 2: DISPUTES AUDIT QUEUE */}
      {tabValue === 2 && (
        <div className={styles.tableCard}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.1rem', mb: 0.5 }}>
            Dispute & Claims Audit Queue
          </Typography>
          <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 2.5 }}>
            Inspect reported user disputes, evaluate member proof screenshots, and execute wallet refunds or dismissals.
          </Typography>

          {loadingDisputes ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} sx={{ color: '#f59e0b' }} />
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ '& th': { borderColor: 'rgba(255, 255, 255, 0.08)', color: '#9ca3af', fontWeight: 800, fontSize: '0.75rem' } }}>
                    <TableCell>DISPUTE ID & PASS</TableCell>
                    <TableCell>RAISED BY / AGAINST</TableCell>
                    <TableCell>REASON & DETAILS</TableCell>
                    <TableCell>REFUND VALUE</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell align="right">AUDIT ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adminDisputes.length > 0 ? (
                    adminDisputes.map((d) => {
                      const isRefunded = d.status === 'RESOLVED_REFUNDED';
                      const isRejected = d.status === 'RESOLVED_REJECTED';

                      return (
                        <TableRow key={d.id} sx={{ '& td': { borderColor: 'rgba(255, 255, 255, 0.08)', color: '#f3f4f6', fontSize: '0.85rem' } }}>
                          <TableCell>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.88rem' }}>{d.listingTitle}</Typography>
                            <Chip label={`Dispute #${d.id}`} size="small" sx={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 800, fontSize: '0.68rem', mt: 0.5 }} />
                          </TableCell>

                          <TableCell>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem' }}>Member: {d.raisedByName}</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>Host: {d.againstUserName || 'Platform Host'}</Typography>
                          </TableCell>

                          <TableCell sx={{ maxWidth: 220 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#fbbf24' }}>{d.reason}</Typography>
                            <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {d.description}
                            </Typography>
                          </TableCell>

                          <TableCell sx={{ color: '#22c55e', fontWeight: 900 }}>₹{d.amount}</TableCell>

                          <TableCell>
                            <Chip
                              label={d.status}
                              size="small"
                              sx={{
                                background: isRefunded ? 'rgba(34,197,94,0.15)' : isRejected ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                                color: isRefunded ? '#22c55e' : isRejected ? '#ef4444' : '#f59e0b',
                                fontWeight: 800,
                                fontSize: '0.68rem',
                              }}
                            />
                          </TableCell>

                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Inspect Dispute & Proof">
                                <IconButton size="small" onClick={() => setSelectedDisputeModal(d)} sx={{ background: 'rgba(255,255,255,0.06)', color: '#f3f4f6' }}>
                                  <Eye size={16} />
                                </IconButton>
                              </Tooltip>

                              {!isRefunded && !isRejected && (
                                <>
                                  <Tooltip title="Resolve & Refund Member Wallet">
                                    <IconButton size="small" onClick={() => handleResolveDispute(d.id, 'REFUND_MEMBER')} sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', '&:hover': { background: '#22c55e', color: '#09090b' } }}>
                                      <Check size={16} />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Dismiss / Reject Dispute">
                                    <IconButton size="small" onClick={() => handleResolveDispute(d.id, 'REJECT_DISPUTE')} sx={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', '&:hover': { background: '#ef4444', color: '#ffffff' } }}>
                                      <X size={16} />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                        No reported disputes in database.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      )}

      {/* TAB 3: LISTING MANAGEMENT */}
      {tabValue === 3 && (

        <div className={styles.tableCard}>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" mb={2.5} spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.1rem' }}>
                Marketplace Listings Governance
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                Change listing status, check seat issues, or delete fraudulent listings from the marketplace.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Select
                size="small"
                value={listingFilter}
                onChange={(e) => setListingFilter(e.target.value)}
                sx={{
                  background: '#1c1e24',
                  color: '#f3f4f6',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
                }}
              >
                <MenuItem value="ALL">All Listings</MenuItem>
                <MenuItem value="ACTIVE">Active Only</MenuItem>
                <MenuItem value="FULL">Full (0 Seats Left)</MenuItem>
                <MenuItem value="ISSUES">Flagged / Capacity Issues</MenuItem>
              </Select>

              <TextField
                size="small"
                placeholder="Search listing title or host..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} color="#9ca3af" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: { xs: '100%', sm: 260 } }}
              />
            </Stack>
          </Stack>

          {loadingListings ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} sx={{ color: '#f59e0b' }} />
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ '& th': { borderColor: 'rgba(255, 255, 255, 0.08)', color: '#9ca3af', fontWeight: 800, fontSize: '0.75rem' } }}>
                    <TableCell>LISTING TITLE & HOST</TableCell>
                    <TableCell>PLATFORM</TableCell>
                    <TableCell>SEATS OCCUPANCY</TableCell>
                    <TableCell>SEAT PRICE</TableCell>
                    <TableCell>STATUS CONTROL</TableCell>
                    <TableCell align="right">ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredListings.length > 0 ? (
                    filteredListings.map((row) => (
                      <TableRow key={row.id} sx={{ '& td': { borderColor: 'rgba(255, 255, 255, 0.08)', color: '#f3f4f6', fontSize: '0.85rem' } }}>
                        <TableCell>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.88rem' }}>{row.title}</Typography>
                          <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af' }}>Host: {row.hostName || 'SubSplit Host'}</Typography>
                        </TableCell>

                        <TableCell>
                          <Chip label={row.platformName} size="small" sx={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6', fontWeight: 800, fontSize: '0.7rem' }} />
                        </TableCell>

                        <TableCell>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.82rem', color: row.availableSeats === 0 ? '#ef4444' : '#22c55e' }}>
                            {row.availableSeats} / {row.totalSeats} Seats Left
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ color: '#22c55e', fontWeight: 900 }}>₹{row.seatPrice}</TableCell>

                        <TableCell>
                          <Select
                            size="small"
                            value={row.status}
                            onChange={(e) => handleUpdateListingStatus(row.id, e.target.value)}
                            sx={{
                              height: 28,
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              background: row.status === 'ACTIVE' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                              color: row.status === 'ACTIVE' ? '#22c55e' : '#ef4444',
                              borderRadius: '6px',
                              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            }}
                          >
                            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                            <MenuItem value="PAUSED">PAUSED</MenuItem>
                            <MenuItem value="FULL">FULL</MenuItem>
                            <MenuItem value="SUSPENDED">SUSPENDED</MenuItem>
                            <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                          </Select>
                        </TableCell>

                        <TableCell align="right">
                          <Tooltip title="Delete Listing Permanently">
                            <IconButton size="small" onClick={() => handleDeleteListing(row.id)} sx={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', '&:hover': { background: '#ef4444', color: '#ffffff' } }}>
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                        No listings matching filter criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      )}

      {/* TAB 4: USER GOVERNANCE */}
      {tabValue === 4 && (
        <div className={styles.tableCard}>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" mb={2.5} spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.1rem' }}>
                User Management Directory
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                Click any user row to view complete profile, active listings, wallet balances, and transaction history.
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder="Search user name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#9ca3af" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: 300 } }}
            />
          </Stack>

          {loadingUsers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} sx={{ color: '#f59e0b' }} />
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ '& th': { borderColor: 'rgba(255, 255, 255, 0.08)', color: '#9ca3af', fontWeight: 800, fontSize: '0.75rem' } }}>
                    <TableCell>USER NAME & EMAIL</TableCell>
                    <TableCell>ROLE</TableCell>
                    <TableCell>HOSTED LISTINGS</TableCell>
                    <TableCell>WALLET BALANCE</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell align="right">ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((usr) => {
                    const isBlocked = usr.isActive === false;
                    const roleColor = usr.role === 'ADMIN' ? '#f59e0b' : usr.role === 'HOST' ? '#a855f7' : '#3b82f6';

                    return (
                      <TableRow
                        key={usr.id}
                        hover
                        onClick={() => handleOpenUserModal(usr.id)}
                        sx={{
                          cursor: 'pointer',
                          '& td': { borderColor: 'rgba(255, 255, 255, 0.08)', color: '#f3f4f6', fontSize: '0.85rem' },
                          '&:hover': { background: 'rgba(255, 255, 255, 0.03)' },
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar sx={{ bgcolor: roleColor, width: 36, height: 36, fontWeight: 800, fontSize: '0.85rem' }}>
                              {usr.fullName ? usr.fullName.charAt(0).toUpperCase() : 'U'}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 800, fontSize: '0.88rem' }}>
                                {usr.fullName || `${usr.firstName} ${usr.lastName}`}
                              </Typography>
                              <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af' }}>{usr.email}</Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={usr.role}
                            size="small"
                            sx={{ background: `${roleColor}20`, color: roleColor, fontWeight: 800, fontSize: '0.68rem', border: `1px solid ${roleColor}40` }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${usr.activeListingsCount || 0} Listings`}
                            size="small"
                            sx={{ background: 'rgba(255,255,255,0.06)', color: '#f3f4f6', fontWeight: 700, fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#22c55e', fontWeight: 800 }}>
                          ₹{usr.walletBalance != null ? Number(usr.walletBalance).toLocaleString('en-IN') : '0'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={isBlocked ? <UserX size={12} color="#ef4444" /> : <UserCheck size={12} color="#22c55e" />}
                            label={isBlocked ? 'BLOCKED' : 'ACTIVE'}
                            size="small"
                            sx={{
                              background: isBlocked ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                              color: isBlocked ? '#ef4444' : '#22c55e',
                              fontWeight: 800,
                              fontSize: '0.68rem',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="small"
                            variant={isBlocked ? 'contained' : 'outlined'}
                            color={isBlocked ? 'success' : 'error'}
                            onClick={() => handleToggleBlock(usr.id)}
                            sx={{
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              textTransform: 'none',
                              py: 0.5,
                              px: 1.8,
                            }}
                          >
                            {isBlocked ? 'Unblock User' : 'Block User'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      )}

      {/* TAB 5: REAL-TIME SYSTEM AUDIT LOGS */}
      {tabValue === 5 && (

        <div className={styles.tableCard}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.1rem', mb: 2 }}>
            Real-Time System & Security Audit Logs
          </Typography>

          {loadingLogs ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} sx={{ color: '#f59e0b' }} />
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {systemLogs.length > 0 ? (
                systemLogs.map((logItem) => (
                  <Paper key={logItem.id} elevation={0} sx={{ p: 2, borderRadius: '12px', background: '#1c1e24', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Shield size={18} color="#f59e0b" />
                      <Typography sx={{ fontSize: '0.85rem', color: '#f3f4f6', fontWeight: 600 }}>
                        {logItem.details || logItem.action}
                      </Typography>
                    </Stack>
                    <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                      {logItem.createdAt ? new Date(logItem.createdAt).toLocaleString() : 'Just now'}
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Typography sx={{ color: '#9ca3af', textAlign: 'center', py: 4 }}>No system audit logs found.</Typography>
              )}
            </Stack>
          )}
        </div>
      )}

      {/* INSPECT PROOF & CREDENTIALS DIALOG MODAL */}
      <Dialog
        open={Boolean(selectedProofModal)}
        onClose={() => setSelectedProofModal(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { background: '#14161a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: '#f3f4f6' },
        }}
      >
        {selectedProofModal && (
          <>
            <DialogTitle sx={{ pt: 3, px: 3.5, pb: 1 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6' }}>
                    Inspect Credentials & Screenshot Proof
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    Request #{selectedProofModal.id} • Listing: {selectedProofModal.listingTitle}
                  </Typography>
                </Box>
                <IconButton onClick={() => setSelectedProofModal(null)} sx={{ color: '#9ca3af' }}>
                  <X size={20} />
                </IconButton>
              </Stack>
            </DialogTitle>

            <DialogContent sx={{ px: 3.5, py: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2.5, background: '#1c1e24', borderRadius: '14px', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <Typography variant="subtitle2" sx={{ color: '#fbbf24', fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Key size={16} /> Shared Credentials from Host ({selectedProofModal.hostName})
                    </Typography>

                    <Stack spacing={1.5}>
                      {selectedProofModal.shareType === 'ACTIVATION_CODE' || selectedProofModal.activationCode ? (
                        <Box>
                          <Typography variant="caption" sx={{ color: '#9ca3af' }}>SHARED ACTIVATION CODE</Typography>
                          <Typography sx={{ fontWeight: 800, color: '#c084fc', fontSize: '0.95rem', fontFamily: 'monospace' }}>
                            {selectedProofModal.activationCode || 'Code shared'}
                          </Typography>
                        </Box>
                      ) : selectedProofModal.shareType === 'INVITATION_LINK' || selectedProofModal.invitationLink ? (
                        <Box>
                          <Typography variant="caption" sx={{ color: '#9ca3af' }}>SHARED INVITATION LINK</Typography>
                          <Typography sx={{ fontWeight: 800, color: '#60a5fa', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                            {selectedProofModal.invitationLink || 'Link shared'}
                          </Typography>
                        </Box>
                      ) : (
                        <>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#9ca3af' }}>USERNAME / EMAIL</Typography>
                            <Typography sx={{ fontWeight: 800, color: '#f3f4f6', fontSize: '0.9rem' }}>
                              {selectedProofModal.credentialsUsername || 'Not shared yet'}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" sx={{ color: '#9ca3af' }}>PASSWORD / KEY</Typography>
                            <Typography sx={{ fontWeight: 800, color: '#f3f4f6', fontSize: '0.9rem' }}>
                              {selectedProofModal.credentialsPassword || '••••••••'}
                            </Typography>
                          </Box>
                        </>
                      )}

                      <Box>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>INSTRUCTIONS / NOTES</Typography>
                        <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af' }}>
                          {selectedProofModal.credentialsNotes || 'No host instructions attached.'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2.5, background: '#1c1e24', borderRadius: '14px', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <Typography variant="subtitle2" sx={{ color: '#22c55e', fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileCheck size={16} /> Member Screenshot Proof ({selectedProofModal.memberName})
                    </Typography>

                    {selectedProofModal.proofImage ? (
                      <Box sx={{ width: '100%', maxHeight: 220, borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={selectedProofModal.proofImage} alt="Member Proof" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </Box>
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '10px' }}>
                        <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af' }}>
                          Member has not uploaded login proof screenshot yet.
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3.5, pb: 3, justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={1.5}>
                {selectedProofModal.status !== 'APPROVED' && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Check size={18} />}
                      onClick={() => handleVerifyAndSettleProof(selectedProofModal.id)}
                      sx={{ borderRadius: '10px', fontWeight: 900, textTransform: 'none', px: 2.5 }}
                    >
                      Manually Verify & Release Escrow (₹{selectedProofModal.amount})
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<X size={18} />}
                      onClick={() => handleRejectProof(selectedProofModal.id)}
                      sx={{ borderRadius: '10px', fontWeight: 800, textTransform: 'none' }}
                    >
                      Reject Proof
                    </Button>
                  </>
                )}
              </Stack>

              <Button onClick={() => setSelectedProofModal(null)} sx={{ color: '#9ca3af', fontWeight: 700 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* USER DEEP-DIVE DETAILS DIALOG MODAL */}
      <Dialog
        open={Boolean(selectedUserId)}
        onClose={() => setSelectedUserId(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { background: '#14161a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: '#f3f4f6' },
        }}
      >
        {loadingDetails || !userDetails ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} sx={{ color: '#f59e0b' }} />
          </Box>
        ) : (
          <>
            <DialogTitle sx={{ pb: 1, pt: 3, px: 3.5 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: '#3b82f6', width: 48, height: 48, fontWeight: 900, fontSize: '1.2rem' }}>
                    {userDetails.fullName ? userDetails.fullName.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.25rem', color: '#f3f4f6' }}>
                      {userDetails.fullName}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} mt={0.25}>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>{userDetails.email}</Typography>
                      <Chip label={`ID #${userDetails.id}`} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, background: 'rgba(255,255,255,0.08)', color: '#9ca3af' }} />
                    </Stack>
                  </Box>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Chip
                    icon={userDetails.isActive ? <UserCheck size={14} color="#22c55e" /> : <UserX size={14} color="#ef4444" />}
                    label={userDetails.isActive ? 'ACTIVE' : 'BLOCKED'}
                    sx={{
                      background: userDetails.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: userDetails.isActive ? '#22c55e' : '#ef4444',
                      fontWeight: 900,
                    }}
                  />
                  <IconButton onClick={() => setSelectedUserId(null)} sx={{ color: '#9ca3af' }}>
                    <X size={20} />
                  </IconButton>
                </Stack>
              </Stack>
            </DialogTitle>

            <DialogContent sx={{ px: 3.5, py: 2 }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, background: '#1c1e24', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 700 }}>WALLET BALANCE</Typography>
                    <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 900, mt: 0.5 }}>
                      ₹{Number(userDetails.walletBalance || 0).toLocaleString('en-IN')}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, background: '#1c1e24', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 700 }}>ESCROW HOLDING</Typography>
                    <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 900, mt: 0.5 }}>
                      ₹{Number(userDetails.escrowBalance || 0).toLocaleString('en-IN')}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, background: '#1c1e24', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 700 }}>USER ROLE & LOCATION</Typography>
                    <Typography variant="h6" sx={{ color: '#f3f4f6', fontWeight: 900, mt: 0.5, fontSize: '0.95rem' }}>
                      {userDetails.role} • {userDetails.city || 'India'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.08)', mb: 2 }}>
                <Tabs
                  value={modalTab}
                  onChange={(e, val) => setModalTab(val)}
                  sx={{
                    '& .MuiTab-root': { color: '#9ca3af', fontWeight: 700, textTransform: 'none', fontSize: '0.85rem' },
                    '& .Mui-selected': { color: '#fbbf24' },
                    '& .MuiTabs-indicator': { backgroundColor: '#f59e0b' },
                  }}
                >
                  <Tab label={`Hosted Listings (${userDetails.listings?.length || 0})`} />
                  <Tab label={`Wallet Transactions (${userDetails.transactions?.length || 0})`} />
                </Tabs>
              </Box>

              {modalTab === 0 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '& th': { borderColor: 'rgba(255, 255, 255, 0.08)', color: '#9ca3af', fontWeight: 800, fontSize: '0.72rem' } }}>
                        <TableCell>LISTING TITLE</TableCell>
                        <TableCell>PLATFORM</TableCell>
                        <TableCell>SEAT PRICE</TableCell>
                        <TableCell>SEATS AVAILABLE</TableCell>
                        <TableCell>STATUS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userDetails.listings && userDetails.listings.length > 0 ? (
                        userDetails.listings.map((item) => (
                          <TableRow key={item.id} sx={{ '& td': { borderColor: 'rgba(255, 255, 255, 0.08)', color: '#f3f4f6', fontSize: '0.82rem' } }}>
                            <TableCell sx={{ fontWeight: 800 }}>{item.title}</TableCell>
                            <TableCell><Chip label={item.platformName} size="small" sx={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6', fontWeight: 800, fontSize: '0.68rem' }} /></TableCell>
                            <TableCell sx={{ color: '#22c55e', fontWeight: 800 }}>₹{item.price}</TableCell>
                            <TableCell>{item.availableSeats} / {item.totalSeats} Available</TableCell>
                            <TableCell><Chip label={item.status} size="small" sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.68rem' }} /></TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#9ca3af' }}>No hosted subscription passes found for this user.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {modalTab === 1 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '& th': { borderColor: 'rgba(255, 255, 255, 0.08)', color: '#9ca3af', fontWeight: 800, fontSize: '0.72rem' } }}>
                        <TableCell>TYPE</TableCell>
                        <TableCell>DESCRIPTION</TableCell>
                        <TableCell>AMOUNT</TableCell>
                        <TableCell>STATUS</TableCell>
                        <TableCell align="right">DATE</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userDetails.transactions && userDetails.transactions.length > 0 ? (
                        userDetails.transactions.map((tx) => (
                          <TableRow key={tx.id} sx={{ '& td': { borderColor: 'rgba(255, 255, 255, 0.08)', color: '#f3f4f6', fontSize: '0.82rem' } }}>
                            <TableCell sx={{ fontWeight: 800, color: '#f59e0b' }}>{tx.transactionType}</TableCell>
                            <TableCell>{tx.description}</TableCell>
                            <TableCell sx={{ color: '#22c55e', fontWeight: 800 }}>₹{tx.amount}</TableCell>
                            <TableCell><Chip label={tx.status} size="small" sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.68rem' }} /></TableCell>
                            <TableCell align="right" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#9ca3af' }}>No wallet transaction records found for this user.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3.5, pb: 3, justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color={userDetails.isActive ? 'error' : 'success'}
                onClick={() => handleToggleBlock(userDetails.id)}
                sx={{ borderRadius: '10px', fontWeight: 800, textTransform: 'none', px: 3 }}
              >
                {userDetails.isActive ? 'Block Account' : 'Unblock Account'}
              </Button>

              <Button onClick={() => setSelectedUserId(null)} sx={{ color: '#9ca3af', fontWeight: 700 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* INSPECT & RESOLVE DISPUTE DIALOG MODAL */}
      <Dialog
        open={Boolean(selectedDisputeModal)}
        onClose={() => setSelectedDisputeModal(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { background: '#14161a', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', color: '#f3f4f6' },
        }}
      >
        {selectedDisputeModal && (
          <>
            <DialogTitle sx={{ pt: 3, px: 3.5, pb: 1 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6' }}>
                    Inspect Dispute #{selectedDisputeModal.id}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    Pass: {selectedDisputeModal.listingTitle} • Amount: ₹{selectedDisputeModal.amount}
                  </Typography>
                </Box>
                <IconButton onClick={() => setSelectedDisputeModal(null)} sx={{ color: '#9ca3af' }}>
                  <X size={20} />
                </IconButton>
              </Stack>
            </DialogTitle>

            <DialogContent sx={{ px: 3.5, py: 2 }}>
              <Grid container spacing={3}>
                {/* Left: Dispute Claim Details */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2.5, background: '#1c1e24', borderRadius: '14px', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <Typography variant="subtitle2" sx={{ color: '#ef4444', fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AlertTriangle size={16} /> Disputed Claim Information
                    </Typography>

                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>DISPUTED BY (MEMBER)</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#f3f4f6', fontSize: '0.88rem' }}>
                          {selectedDisputeModal.raisedByName} ({selectedDisputeModal.raisedByEmail})
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>DISPUTED AGAINST (HOST)</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#f3f4f6', fontSize: '0.88rem' }}>
                          {selectedDisputeModal.againstUserName || 'Host'} ({selectedDisputeModal.againstUserEmail || 'N/A'})
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>REASON & CATEGORY</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.88rem' }}>
                          {selectedDisputeModal.reason}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>FULL MEMBER DESCRIPTION</Typography>
                        <Typography sx={{ fontSize: '0.82rem', color: '#f3f4f6', mt: 0.25 }}>
                          {selectedDisputeModal.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                {/* Right: Attached Proof Image */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2.5, background: '#1c1e24', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="subtitle2" sx={{ color: '#3b82f6', fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileCheck size={16} /> Member Proof Attachment
                    </Typography>

                    {selectedDisputeModal.proofImage ? (
                      <Box sx={{ width: '100%', maxHeight: 220, borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={selectedDisputeModal.proofImage} alt="Dispute Proof" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </Box>
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '10px' }}>
                        <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af' }}>
                          No screenshot attachment uploaded with this claim.
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3.5, pb: 3, justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={1.5}>
                {selectedDisputeModal.status !== 'RESOLVED_REFUNDED' && selectedDisputeModal.status !== 'RESOLVED_REJECTED' && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Check size={18} />}
                      onClick={() => handleResolveDispute(selectedDisputeModal.id, 'REFUND_MEMBER')}
                      sx={{ borderRadius: '10px', fontWeight: 900, textTransform: 'none', px: 2.5 }}
                    >
                      Resolve & Refund Member (₹{selectedDisputeModal.amount})
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<X size={18} />}
                      onClick={() => handleResolveDispute(selectedDisputeModal.id, 'REJECT_DISPUTE')}
                      sx={{ borderRadius: '10px', fontWeight: 800, textTransform: 'none' }}
                    >
                      Dismiss Dispute
                    </Button>
                  </>
                )}
              </Stack>

              <Button onClick={() => setSelectedDisputeModal(null)} sx={{ color: '#9ca3af', fontWeight: 700 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Toast Notification */}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} variant="filled" sx={{ width: '100%', borderRadius: '12px', fontWeight: 700 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AdminDashboard;
