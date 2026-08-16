import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyWallet, addMoneyToWallet } from './walletSlice';
import {

  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Wallet,
  TrendingDown,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  CreditCard,
  QrCode,
  CheckCircle2,
  Lock,
  Zap,
  Sparkles,
  Gift,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RaiseDisputeModal from '../disputes/RaiseDisputeModal';
import { fetchMyDisputesApi } from '../disputes/api/disputeApi';
import KycUploadModal from '../profile/components/KycUploadModal';
import { fetchCurrentUser, fetchKycStatus } from '../auth/authSlice';
import { AlertTriangle, Loader2 } from 'lucide-react';
import styles from './Settlements.module.scss';

const PAYMENT_METHODS = [
  { id: 'pm-1', name: 'Google Pay UPI', detail: 'anirban@okaxis', type: 'UPI', isDefault: true, icon: QrCode, color: '#3b82f6' },
  { id: 'pm-2', name: 'HDFC Bank Visa Debit', detail: '•••• •••• •••• 4829', type: 'Debit Card', isDefault: false, icon: CreditCard, color: '#a855f7' },
  { id: 'pm-3', name: 'ICICI Platinum Credit', detail: '•••• •••• •••• 9102', type: 'Credit Card', isDefault: false, icon: CreditCard, color: '#f59e0b' },
];

function Settlements() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wallet } = useSelector((state) => state.wallet);
  const { user, kycStatus } = useSelector((state) => state.auth);

  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('500');
  const [adding, setAdding] = useState(false);

  const [raiseDisputeOpen, setRaiseDisputeOpen] = useState(false);
  const [disputesList, setDisputesList] = useState([]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchMyWallet());
    loadDisputes();
  }, [dispatch]);

  // Polling for live KYC updates if currently verifying
  useEffect(() => {
    let interval;
    if (kycStatus?.kycStatus === 'VERIFYING' || kycStatus?.kycStatus === 'IN_PROGRESS') {
      interval = setInterval(() => {
        dispatch(fetchKycStatus());
        dispatch(fetchCurrentUser());
        dispatch(fetchMyWallet());
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dispatch, kycStatus?.kycStatus]);

  const loadDisputes = async () => {
    try {
      const data = await fetchMyDisputesApi();
      setDisputesList(data);
    } catch (err) {
      console.error('Failed to load user disputes:', err);
    }
  };

  const handleAddMoneySubmit = async (e) => {
    e.preventDefault();
    const val = parseFloat(topUpAmount);
    if (!isNaN(val) && val > 0) {
      try {
        setAdding(true);
        await dispatch(addMoneyToWallet(val)).unwrap();
        setAddMoneyOpen(false);
      } catch (err) {
        alert(err || 'Failed to add money to wallet.');
      } finally {
        setAdding(false);
      }
    }
  };

  const isKycVerified = Boolean(user?.emailVerified) || kycStatus?.isKycVerified || kycStatus?.kycStatus === 'VERIFIED';
  const isVerifying = kycStatus?.kycStatus === 'VERIFYING' || kycStatus?.kycStatus === 'IN_PROGRESS';

  // ─── If KYC is NOT verified, restrict wallet page completely ───
  if (!isKycVerified) {
    return (
      <div className={styles.settlementsContainer}>
        {/* Header */}
        <div className={styles.headerSection}>
          <div className={styles.headerInfo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 className={styles.pageTitle}>Wallet & Escrow Protection</h1>
              <Chip
                icon={<Lock size={13} color="#f59e0b" />}
                label="KYC Required • Wallet Locked"
                size="small"
                sx={{
                  background: 'rgba(245,158,11,0.12)',
                  color: '#f59e0b',
                  fontWeight: 800,
                  border: '1px solid rgba(245,158,11,0.3)',
                }}
              />
            </div>
            <p className={styles.subtitle}>
              Access to SubSplit escrow balances, deposits, and settlement payouts is guarded by identity KYC verification.
            </p>
          </div>
        </div>

        {/* Locked Wallet Hero Gate Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5 },
            borderRadius: '28px',
            background: 'linear-gradient(145deg, #14161a 0%, #171a21 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            textAlign: 'center',
            maxWidth: 760,
            mx: 'auto',
            my: { xs: 2, sm: 4 },
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: isVerifying ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
              border: isVerifying ? '2px solid #3b82f6' : '2px solid #f59e0b',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2.5,
              boxShadow: isVerifying ? '0 0 30px rgba(59,130,246,0.3)' : '0 0 30px rgba(245,158,11,0.3)',
            }}
          >
            {isVerifying ? (
              <Loader2 size={40} color="#3b82f6" className="animate-spin" style={{ animation: 'spin 1.5s linear infinite' }} />
            ) : (
              <Lock size={40} color="#f59e0b" />
            )}
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: { xs: '1.4rem', sm: '1.8rem' }, letterSpacing: '-0.02em', mb: 1 }}>
            {isVerifying ? 'AI KYC Verification in Progress' : 'SubSplit Wallet is Locked'}
          </Typography>

          <Typography sx={{ color: '#9ca3af', fontSize: '0.92rem', maxWidth: 580, mx: 'auto', lineHeight: 1.6, mb: 3.5 }}>
            {isVerifying
              ? 'SubSplit AI is currently analyzing your uploaded government ID. Your wallet will automatically unlock as soon as verification completes!'
              : 'To comply with financial escrow regulations, prevent fraudulent access, and protect group funds, you must complete your 1-click government identity (KYC) verification before accessing your wallet.'}
          </Typography>

          {isVerifying && (
            <Box sx={{ maxWidth: 440, mx: 'auto', mb: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography sx={{ fontSize: '0.78rem', color: '#3b82f6', fontWeight: 800 }}>
                  OCR & AI Biometric Scanning...
                </Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                  Live Status
                </Typography>
              </Stack>
              <LinearProgress
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#1c1e24',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 50%, #22c55e 100%)',
                  },
                }}
              />
            </Box>
          )}

          {/* 3 Step Visual Blueprint */}
          <Grid container spacing={2} sx={{ mb: 4, textAlign: 'left' }}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.06)', height: '100%' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#f3f4f6', mb: 0.5 }}>
                  1. Upload Govt ID
                </Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af', lineHeight: 1.4 }}>
                  Aadhaar Card, PAN Card, Passport, or Driving License document photo.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.06)', height: '100%' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#f3f4f6', mb: 0.5 }}>
                  2. 5-Sec AI Check
                </Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af', lineHeight: 1.4 }}>
                  Automated OCR text extraction, integrity check, and instant matching.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.06)', height: '100%' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#22c55e', mb: 0.5 }}>
                  3. Full Wallet Access
                </Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af', lineHeight: 1.4 }}>
                  Add funds, join groups, lock escrow protection, and receive payouts.
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Action CTAs */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            {isVerifying ? (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/app/profile')}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                }}
              >
                View AI Verification on Profile →
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={<ShieldCheck size={20} />}
                onClick={() => setKycModalOpen(true)}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 8px 25px rgba(37,99,235,0.4)',
                }}
              >
                Complete KYC Verification Now
              </Button>
            )}

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/app/marketplace')}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '0.9rem',
                textTransform: 'none',
                color: '#9ca3af',
                borderColor: 'rgba(255,255,255,0.15)',
                '&:hover': { color: '#ffffff', borderColor: '#ffffff' },
              }}
            >
              Browse Marketplace
            </Button>
          </Stack>
        </Paper>

        {/* KYC Upload Modal */}
        <KycUploadModal
          open={kycModalOpen}
          onClose={() => setKycModalOpen(false)}
          onSuccess={() => {
            dispatch(fetchCurrentUser());
            dispatch(fetchKycStatus());
            dispatch(fetchMyWallet());
          }}
        />
      </div>
    );
  }

  const balanceVal = wallet?.balance != null ? wallet.balance : 0;
  const balanceDisplay = `₹${balanceVal.toFixed(2)}`;
  const recentTransactions = wallet?.recentTransactions || [];


  return (
    <div className={styles.settlementsContainer}>
      {/* Header & Top Actions */}
      <div className={styles.headerSection}>
        <div className={styles.headerInfo}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 className={styles.pageTitle}>Wallet & Escrow Control</h1>
            <Chip
              icon={<ShieldCheck size={13} color="#22c55e" />}
              label="100% Escrow Shield"
              size="small"
              sx={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', fontWeight: 800, border: '1px solid rgba(34,197,94,0.3)' }}
            />
          </div>
          <p className={styles.subtitle}>
            Your financial dashboard for escrow deposits, subscription payments, and instant payouts.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setRaiseDisputeOpen(true)}
            sx={{
              borderRadius: '0.75rem',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.875rem',
              py: 1,
              px: 2,
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.4)',
              background: 'rgba(239,68,68,0.08)',
              '&:hover': { background: 'rgba(239,68,68,0.18)', borderColor: '#ef4444' },
            }}
          >
            Report Issue / Raise Dispute
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={() => setAddMoneyOpen(true)}
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
            Add Money
          </Button>
        </div>


      </div>

      {/* Financial Overview Metrics */}
      <div className={styles.metricsGrid}>
        {/* Card 1: Wallet Balance */}
        <div className={styles.metricCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.75rem' }}>
            <span className={styles.metricLabel}>Total Wallet Balance</span>
            <Box sx={{ p: 1, borderRadius: '0.75rem', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)' }}>
              <Wallet size={20} color="#3b82f6" />
            </Box>
          </div>
          <div className={styles.metricValue} style={{ color: '#f3f4f6' }}>{balanceDisplay}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', pt: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '0.75rem' }}>
            <div>
              <span className={styles.metricSubtext} style={{ color: '#9ca3af', display: 'block' }}>Available Funds</span>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#22c55e' }}>{balanceDisplay}</span>
            </div>
            <div>
              <span className={styles.metricSubtext} style={{ color: '#9ca3af', display: 'block' }}>Locked in Escrow</span>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#3b82f6' }}>₹400.00</span>
            </div>
          </div>
        </div>

        {/* Card 2: Savings Tracker */}
        <div className={styles.metricCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.75rem' }}>
            <span className={styles.metricLabel}>Monthly Savings</span>
            <Box sx={{ p: 1, borderRadius: '0.75rem', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <TrendingDown size={20} color="#22c55e" />
            </Box>
          </div>
          <div className={styles.metricValue} style={{ color: '#22c55e' }}>₹1,240.00</div>
          <div className={styles.metricSubtext} style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
            Lifetime Saved: <strong style={{ color: '#f3f4f6' }}>₹8,196.00</strong>
          </div>
          <Chip label="+78% vs Retail Cost" size="small" sx={{ mt: 0.8, background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.66rem', height: 18 }} />
        </div>

        {/* Card 3: Upcoming Payments */}
        <div className={styles.metricCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.75rem' }}>
            <span className={styles.metricLabel}>Upcoming Due</span>
            <Box sx={{ p: 1, borderRadius: '0.75rem', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <Zap size={20} color="#f59e0b" />
            </Box>
          </div>
          <div className={styles.metricValue} style={{ color: '#f59e0b' }}>₹129.00</div>
          <div className={styles.metricSubtext} style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Netflix Premium (Due Aug 15)</div>
          <Chip label="AutoPay Secured" size="small" sx={{ mt: 0.8, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', fontWeight: 800, fontSize: '0.66rem', height: 18 }} />
        </div>
      </div>


      {/* ─── Row 2: 65% / 35% Split (Transactions & Escrow Control) ─── */}

      <Grid container spacing={3} mb={4}>
        {/* Left 65%: Recent Transactions Timeline */}
        <Grid size={{ xs: 12, md: 7.8 }}>
          <Paper elevation={0} sx={{ p: 3.5, borderRadius: '22px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.15rem' }}>
                Recent Wallet Transactions
              </Typography>
              <Button size="small" endIcon={<ChevronRight size={16} />} sx={{ textTransform: 'none', fontWeight: 700, color: '#3b82f6', fontSize: '0.82rem' }}>
                Export History
              </Button>
            </Stack>

            <Stack spacing={2}>
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((tx) => {
                  const isCredit = tx.type === 'CREDIT';
                  const isEscrow = tx.type === 'ESCROW_LOCK';
                  const Icon = isCredit ? ArrowDownLeft : (isEscrow ? Lock : TrendingDown);
                  const color = isCredit ? '#22c55e' : (isEscrow ? '#3b82f6' : '#ef4444');
                  const statusBg = isCredit ? 'rgba(34,197,94,0.15)' : (isEscrow ? 'rgba(59,130,246,0.15)' : 'rgba(239,68,68,0.15)');
                  const dateStr = tx.createdAt ? new Date(tx.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';

                  return (
                    <Paper
                      key={tx.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        background: '#1c1e24',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'transform 0.15s ease',
                        '&:hover': { transform: 'translateX(3px)' },
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: '12px',
                            background: `${color}15`,
                            border: `1px solid ${color}33`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={20} color={color} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#f3f4f6', lineHeight: 1.2 }}>
                            {tx.remarks || (isCredit ? 'Wallet Top-up' : 'Escrow Seat Reservation')}
                          </Typography>
                          <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af', mt: 0.3 }}>
                            {tx.type} • {dateStr}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', color: isCredit ? '#22c55e' : '#f3f4f6' }}>
                          {isCredit ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                        </Typography>

                        <Chip
                          label={tx.type}
                          size="small"
                          sx={{
                            background: statusBg,
                            color: color,
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            height: 20,
                          }}
                        />
                      </Stack>
                    </Paper>
                  );
                })
              ) : (
                <Box sx={{ textAlign: 'center', py: 4, color: '#9ca3af' }}>
                  <Typography sx={{ fontSize: '0.9rem' }}>No wallet transactions recorded yet.</Typography>
                </Box>
              )}
            </Stack>

          </Paper>
        </Grid>

        {/* Right 35%: SubSplit Escrow Trust Control Card */}
        <Grid size={{ xs: 12, md: 4.2 }}>
          <Paper elevation={0} sx={{ p: 3.5, borderRadius: '22px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={1.25} mb={2.5}>
              <ShieldCheck size={22} color="#22c55e" />
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.1rem' }}>
                Escrow Protection System
              </Typography>
            </Stack>

            <Box sx={{ p: 2.25, borderRadius: '16px', background: '#1c1e24', border: '1px solid rgba(34,197,94,0.3)', mb: 3 }}>
              <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600, mb: 0.5 }}>
                Current Locked Escrow
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.8rem', color: '#22c55e', lineHeight: 1, mb: 1 }}>
                ₹400.00
              </Typography>
              <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af', lineHeight: 1.5 }}>
                Funds stay safely locked in SubSplit Escrow and are released to hosts only after credentials verification.
              </Typography>
            </Box>

            <Stack spacing={2} mb={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af' }}>
                  Total Escrow Released
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#f3f4f6' }}>
                  ₹2,480.00
                </Typography>
              </Stack>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontSize: '0.82rem', color: '#9ca3af' }}>
                  Protection Guarantee
                </Typography>
                <Chip label="100% Refundable" size="small" sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.68rem' }} />
              </Stack>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#252830',
                '& .MuiLinearProgress-bar': { backgroundColor: '#22c55e' },
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* ─── Row 3: Saved Payment Methods ─── */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
            Saved Payment Methods
          </Typography>
          <Button size="small" startIcon={<Plus size={14} />} sx={{ textTransform: 'none', fontWeight: 700, color: '#3b82f6', fontSize: '0.82rem' }}>
            Add New Method
          </Button>
        </Stack>

        <Grid container spacing={2.5}>
          {PAYMENT_METHODS.map(({ id, name, detail, type, isDefault, icon: Icon, color }) => (
            <Grid item xs={12} sm={4} key={id}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: `${color}15`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={color} />
                  </Box>
                  {isDefault && (
                    <Chip label="Default" size="small" sx={{ background: 'rgba(37,99,235,0.15)', color: '#3b82f6', fontWeight: 800, fontSize: '0.64rem', height: 18 }} />
                  )}
                </Stack>

                <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#f3f4f6' }}>
                  {name}
                </Typography>
                <Typography sx={{ fontSize: '0.76rem', color: '#9ca3af', mt: 0.3 }}>
                  {detail} ({type})
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ─── Row 4: My Disputes & Claims ─── */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
              My Reported Disputes & Claims
            </Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
              Track reported access problems, credential issues, and admin refund resolutions.
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setRaiseDisputeOpen(true)}
            sx={{ textTransform: 'none', fontWeight: 800, color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', borderRadius: '10px' }}
          >
            Raise New Dispute
          </Button>
        </Stack>

        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {disputesList.length > 0 ? (
            <Stack spacing={1.5}>
              {disputesList.map((d) => (
                <Paper key={d.id} elevation={0} sx={{ p: 2, borderRadius: '12px', background: '#1c1e24', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#f3f4f6' }}>
                        {d.listingTitle}
                      </Typography>
                      <Chip label={`Dispute #${d.id}`} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800, background: 'rgba(255,255,255,0.08)', color: '#9ca3af' }} />
                    </Stack>
                    <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', mt: 0.5 }}>
                      Reason: {d.reason} • {d.description}
                    </Typography>
                    {d.resolutionNotes && (
                      <Typography sx={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 700, mt: 0.5 }}>
                        Admin Note: {d.resolutionNotes}
                      </Typography>
                    )}
                  </Box>

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography sx={{ fontWeight: 900, color: '#22c55e', fontSize: '0.9rem' }}>
                      ₹{d.amount}
                    </Typography>
                    <Chip
                      label={d.status}
                      size="small"
                      sx={{
                        background: d.status === 'RESOLVED_REFUNDED' ? 'rgba(34,197,94,0.15)' : d.status === 'RESOLVED_REJECTED' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                        color: d.status === 'RESOLVED_REFUNDED' ? '#22c55e' : d.status === 'RESOLVED_REJECTED' ? '#ef4444' : '#f59e0b',
                        fontWeight: 800,
                        fontSize: '0.68rem',
                      }}
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography sx={{ color: '#9ca3af', fontSize: '0.88rem' }}>
                You have not raised any disputes or claims. All your subscriptions are operating cleanly!
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Raise Dispute Modal */}
      <RaiseDisputeModal
        open={raiseDisputeOpen}
        onClose={() => setRaiseDisputeOpen(false)}
        onSuccess={() => loadDisputes()}
      />


      {/* Top-up Dialog */}
      <Dialog
        open={addMoneyOpen}
        onClose={() => !adding && setAddMoneyOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: '#111114',
            border: '1px solid #2A2A30',
            color: '#f3f4f6',
            width: '100%',
            maxWidth: 420,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.2rem', pb: 1 }}>
          Add Money to Wallet
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAddMoneySubmit}>
            <Typography sx={{ fontSize: '0.8rem', color: '#9ca3af', mb: 1, fontWeight: 600 }}>
              Enter Amount to Add (₹)
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ color: '#22c55e', fontWeight: 900, fontSize: '1.2rem' }}>₹</InputAdornment>,
                sx: { borderRadius: '14px', background: '#18181C', color: '#ffffff', fontSize: '1.3rem', fontWeight: 900 },
              }}
            />

            {/* Quick Select Chips */}
            <Stack direction="row" spacing={1} mt={2} mb={3}>
              {['100', '250', '500', '1000'].map((amt) => (
                <Chip
                  key={amt}
                  label={`+₹${amt}`}
                  onClick={() => setTopUpAmount(amt)}
                  clickable
                  sx={{
                    background: topUpAmount === amt ? 'rgba(34,197,94,0.2)' : '#18181C',
                    color: topUpAmount === amt ? '#22c55e' : '#A1A1AA',
                    border: topUpAmount === amt ? '1px solid #22c55e' : '1px solid #2A2A30',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                  }}
                />
              ))}
            </Stack>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={adding || !topUpAmount || parseFloat(topUpAmount) <= 0}
              sx={{
                py: 1.3,
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.95rem',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              }}
            >
              {adding ? 'Adding Funds...' : `Add ₹${topUpAmount || '0'} to Wallet`}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}



export default Settlements;
