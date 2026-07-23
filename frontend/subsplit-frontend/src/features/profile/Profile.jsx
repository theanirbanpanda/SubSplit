import React, { useState } from 'react';
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
  Switch,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  ShieldCheck,
  Award,
  TrendingDown,
  CreditCard,
  Lock,
  Smartphone,
  Mail,
  User,
  MapPin,
  Sparkles,
  Share2,
  Edit,
  CheckCircle2,
  Key,
  Shield,
  Download,
  AlertTriangle,
  Globe,
  Bell,
  Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ACHIEVEMENTS_DATA = [
  { title: 'Founding Member', detail: 'Joined SubSplit in early 2024', icon: Award, color: '#f59e0b' },
  { title: 'KYC Verified Host', detail: 'Government ID & Identity Verified', icon: ShieldCheck, color: '#22c55e' },
  { title: '100+ Escrow Payments', detail: 'Zero dispute record across all groups', icon: ZapIcon, color: '#3b82f6' },
  { title: '₹10K+ Savings Club', detail: 'Saved over ₹14,880 in subscription fees', icon: TrendingDown, color: '#a855f7' },
];

function ZapIcon(props) {
  return <Sparkles {...props} />;
}

function Profile() {
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // User Profile State
  const [name, setName] = useState('Anirban Panda');
  const [username, setUsername] = useState('anirban.panda');
  const [email, setEmail] = useState('anirban@subsplit.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [city, setCity] = useState('Bengaluru, Karnataka');
  const [bio, setBio] = useState('Product designer & tech enthusiast sharing 4K streaming and AI subscriptions.');

  // Preference Switches State
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <Box sx={{ color: '#f3f4f6' }}>
      {/* ─── Profile Hero Banner (Apple ID & GitHub Style) ─── */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: '24px',
          background: '#14161a',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="flex-start" justifyContent="space-between" spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start" spacing={3}>
            {/* Avatar with Glowing Border */}
            <Avatar
              sx={{
                width: 88,
                height: 88,
                bgcolor: '#2563eb',
                fontWeight: 900,
                fontSize: '2.2rem',
                border: '3px solid #3b82f6',
                boxShadow: '0 0 24px rgba(59,130,246,0.4)',
              }}
            >
              AP
            </Avatar>

            <Box>
              <Stack direction="row" alignItems="center" spacing={1.25} mb={0.5}>
                <Typography variant="h3" sx={{ fontWeight: 900, fontSize: '1.8rem', color: '#f3f4f6', letterSpacing: '-0.03em' }}>
                  {name}
                </Typography>
                <Chip
                  icon={<ShieldCheck size={13} color="#22c55e" />}
                  label="KYC Verified"
                  size="small"
                  sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, border: '1px solid rgba(34,197,94,0.3)' }}
                />
              </Stack>

              <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', mb: 1.5 }}>
                @{username} • Member since Jan 2024 • {city}
              </Typography>

              <Typography sx={{ color: '#f3f4f6', fontSize: '0.88rem', maxWidth: 520, lineHeight: 1.5, mb: 2 }}>
                "{bio}"
              </Typography>

              {/* Profile Completion Bar */}
              <Box sx={{ maxWidth: 360 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography sx={{ fontSize: '0.74rem', fontWeight: 700, color: '#9ca3af' }}>
                    Profile Reputation Score
                  </Typography>
                  <Typography sx={{ fontSize: '0.74rem', fontWeight: 900, color: '#22c55e' }}>
                    95% Complete
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={95}
                  sx={{ height: 6, borderRadius: 3, backgroundColor: '#252830', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #3b82f6 0%, #22c55e 100%)' } }}
                />
              </Box>
            </Box>
          </Stack>

          {/* Action CTAs */}
          <Stack direction="row" spacing={1.5}>
            <Tooltip title={copiedShare ? 'Profile Link Copied!' : 'Share Digital Pass'}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Share2 size={16} />}
                onClick={handleShareProfile}
                sx={{ borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', textTransform: 'none', py: 1, px: 2 }}
              >
                {copiedShare ? 'Copied' : 'Share'}
              </Button>
            </Tooltip>

            <Button
              variant="contained"
              size="small"
              startIcon={<Edit size={16} />}
              onClick={() => setEditModalOpen(true)}
              sx={{ borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', textTransform: 'none', py: 1, px: 2.2, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
            >
              Edit Profile
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* ─── Row 1: 4 Reputation Metric Cards ─── */}
      <Grid container spacing={2.5} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af' }}>
              Trust Reputation
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5} mt={0.5}>
              <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#22c55e', lineHeight: 1 }}>
                4.9 / 5.0
              </Typography>
              <Star size={18} fill="#f59e0b" color="#f59e0b" style={{ marginLeft: 4 }} />
            </Stack>
            <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 1 }}>
              Top 2% Trusted Member
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af' }}>
              Lifetime Savings
            </Typography>
            <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#3b82f6', mt: 0.5, lineHeight: 1 }}>
              ₹14,880
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#22c55e', mt: 1, fontWeight: 700 }}>
              Saved 78% overall
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af' }}>
              Active Memberships
            </Typography>
            <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#f3f4f6', mt: 0.5, lineHeight: 1 }}>
              3 Passes
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 1 }}>
              Netflix, Spotify, ChatGPT
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '20px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af' }}>
              Host Rating
            </Typography>
            <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#a855f7', mt: 0.5, lineHeight: 1 }}>
              4.9★ Super Host
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', mt: 1 }}>
              14 Completed Groups
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ─── Row 2 & 3: Personal Information & Trust Verification ─── */}
      <Grid container spacing={3} mb={4}>
        {/* Left: Personal Information Cards */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3.5, borderRadius: '22px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.15rem' }}>
                Identity & Contact Details
              </Typography>
              <IconButton size="small" onClick={() => setEditModalOpen(true)} sx={{ color: '#3b82f6' }}>
                <Edit size={16} />
              </IconButton>
            </Stack>

            <Stack spacing={2}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>Full Name</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#f3f4f6', mt: 0.2 }}>{name}</Typography>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>Email Address</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#f3f4f6', mt: 0.2 }}>{email}</Typography>
                  </Box>
                  <Chip label="Verified" size="small" sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.66rem' }} />
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>Phone Number</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#f3f4f6', mt: 0.2 }}>{phone}</Typography>
                  </Box>
                  <Chip label="Verified" size="small" sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.66rem' }} />
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>Preferred Categories</Typography>
                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" gap={0.5}>
                  {['Streaming', 'Music', 'AI & Productivity', 'Gaming'].map((cat) => (
                    <Chip key={cat} label={cat} size="small" sx={{ background: '#252830', color: '#f3f4f6', fontWeight: 700, fontSize: '0.72rem' }} />
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Paper>
        </Grid>

        {/* Right: Trust & Verification Dashboard */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3.5, borderRadius: '22px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={1.25} mb={2.5}>
              <ShieldCheck size={22} color="#22c55e" />
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#f3f4f6', fontSize: '1.15rem' }}>
                Trust & Security Verifications
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(34,197,94,0.3)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <ShieldCheck size={20} color="#22c55e" />
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#f3f4f6' }}>
                        Government KYC Identity
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                        Aadhaar / PAN Verified (Unlocks Escrow Hosting)
                      </Typography>
                    </Box>
                  </Stack>
                  <Chip label="Verified" size="small" sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: '0.68rem' }} />
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(34,197,94,0.3)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Lock size={20} color="#3b82f6" />
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#f3f4f6' }}>
                        Two-Factor Authentication (2FA)
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                        Authenticator App Active
                      </Typography>
                    </Box>
                  </Stack>

                  <Switch
                    size="small"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#3b82f6' } }}
                  />
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Smartphone size={20} color="#a855f7" />
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#f3f4f6' }}>
                        Active Device Session
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                        MacBook Pro • Chrome (Bengaluru, Active Now)
                      </Typography>
                    </Box>
                  </Stack>
                  <Chip label="Active" size="small" sx={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', fontWeight: 800, fontSize: '0.68rem' }} />
                </Stack>
              </Paper>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* ─── Row 4: Collectible Achievements ─── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#f3f4f6', mb: 2.5, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
          Collectible Reputation Badges
        </Typography>

        <Grid container spacing={2.5}>
          {ACHIEVEMENTS_DATA.map(({ title, detail, icon: Icon, color }) => (
            <Grid item xs={12} sm={6} md={3} key={title}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: `${color}15`, border: `1.5px solid ${color}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                  <Icon size={22} color={color} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#f3f4f6', mb: 0.5 }}>
                  {title}
                </Typography>
                <Typography sx={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                  {detail}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ─── Edit Profile Modal ─── */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: '#14161a',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#f3f4f6',
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.1rem' }}>
          Edit Profile Information
        </DialogTitle>

        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
              multiline
              rows={2}
              size="small"
            />

            <Button
              fullWidth
              variant="contained"
              onClick={() => setEditModalOpen(false)}
              sx={{ mt: 1, py: 1.1, borderRadius: '10px', fontWeight: 800, textTransform: 'none', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
            >
              Save Profile Changes
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Profile;
