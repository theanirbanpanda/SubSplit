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

const PAYMENT_METHODS = [
  { id: 'pm-1', name: 'Google Pay UPI', detail: 'anirban@okaxis', type: 'UPI', isDefault: true, icon: QrCode, color: '#3b82f6' },
  { id: 'pm-2', name: 'HDFC Bank Visa Debit', detail: '•••• •••• •••• 4829', type: 'Debit Card', isDefault: false, icon: CreditCard, color: '#a855f7' },
  { id: 'pm-3', name: 'ICICI Platinum Credit', detail: '•••• •••• •••• 9102', type: 'Credit Card', isDefault: false, icon: CreditCard, color: '#f59e0b' },
];

function Settlements() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wallet } = useSelector((state) => state.wallet);

  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('500');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchMyWallet());
  }, [dispatch]);

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

  const balanceVal = wallet?.balance != null ? wallet.balance : 0;
  const balanceDisplay = `₹${balanceVal.toFixed(2)}`;
  const recentTransactions = wallet?.recentTransactions || [];


  return (
    <Box sx={{ color: '#f3f4f6' }}>
      {/* ─── Header & Top Actions ─── */}
      <Box sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="flex-start" justifyContent="space-between" spacing={2.5} mb={3}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 900, fontSize: { xs: '1.75rem', md: '2.1rem' }, color: '#f3f4f6', letterSpacing: '-0.03em' }}
              >
                Wallet & Escrow Control
              </Typography>
              <Chip
                icon={<ShieldCheck size={13} color="#22c55e" />}
                label="100% Escrow Shield"
                size="small"
                sx={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', fontWeight: 800, border: '1px solid rgba(34,197,94,0.3)' }}
              />
            </Stack>
            <Typography sx={{ color: '#9ca3af', fontSize: '0.95rem' }}>
              Your financial dashboard for escrow deposits, subscription payments, and instant payouts.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/app/settlements')}
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '0.88rem', py: 1, px: 2.2 }}
            >
              Withdraw Payouts
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<Plus size={16} />}
              onClick={() => setAddMoneyOpen(true)}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 800,
                fontSize: '0.88rem',
                py: 1,
                px: 2.5,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
              }}
            >
              Add Money
            </Button>
          </Stack>
        </Stack>

        {/* ─── Row 1: 3 Financial Overview Cards ─── */}
        <Grid container spacing={2.5}>
          {/* Card 1: Wallet Balance */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '22px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af' }}>
                  Total Wallet Balance
                </Typography>
                <Box sx={{ p: 1, borderRadius: '12px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)' }}>
                  <Wallet size={20} color="#3b82f6" />
                </Box>
              </Stack>

              <Typography sx={{ fontWeight: 900, fontSize: '2.4rem', color: '#f3f4f6', lineHeight: 1, letterSpacing: '-0.03em', mb: 2.5 }}>
                {balanceDisplay}
              </Typography>

              <Grid container spacing={1.5} sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>
                    Available Funds
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#22c55e' }}>
                    {balanceDisplay}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>
                    Locked in Escrow
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#3b82f6' }}>
                    ₹400.00
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Card 2: Savings Tracker */}
          <Grid item xs={12} sm={6} md={3.5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '22px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af' }}>
                  Monthly Savings
                </Typography>
                <Box sx={{ p: 1, borderRadius: '12px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <TrendingDown size={20} color="#22c55e" />
                </Box>
              </Stack>

              <Typography sx={{ fontWeight: 900, fontSize: '2.1rem', color: '#22c55e', lineHeight: 1, letterSpacing: '-0.03em', mb: 2 }}>
                ₹1,240.00
              </Typography>

              <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Lifetime Saved:{' '}
                  <Box component="span" sx={{ color: '#f3f4f6', fontWeight: 800 }}>
                    ₹8,196.00
                  </Box>
                </Typography>
                <Chip
                  label="+78% vs Retail Cost"
                  size="small"
                  sx={{ mt: 0.8, background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.66rem', height: 18 }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Card 3: Upcoming Payments */}
          <Grid item xs={12} sm={6} md={3.5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '22px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af' }}>
                  Upcoming Due
                </Typography>
                <Box sx={{ p: 1, borderRadius: '12px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <Zap size={20} color="#f59e0b" />
                </Box>
              </Stack>

              <Typography sx={{ fontWeight: 900, fontSize: '2.1rem', color: '#f59e0b', lineHeight: 1, letterSpacing: '-0.03em', mb: 2 }}>
                ₹129.00
              </Typography>

              <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Netflix Premium (Due Aug 15)
                </Typography>
                <Chip
                  label="AutoPay Secured"
                  size="small"
                  sx={{ mt: 0.8, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', fontWeight: 800, fontSize: '0.66rem', height: 18 }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* ─── Row 2: 65% / 35% Split (Transactions & Escrow Control) ─── */}
      <Grid container spacing={3} mb={4}>
        {/* Left 65%: Recent Transactions Timeline */}
        <Grid item xs={12} md={7.8}>
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
        <Grid item xs={12} md={4.2}>
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
    </Box>
  );
}


export default Settlements;
