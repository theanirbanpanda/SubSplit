import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, uploadProfilePicture, updateUserProfile, fetchKycStatus } from '../auth/authSlice';
import KycUploadModal from './components/KycUploadModal';
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
  CircularProgress,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { INDIAN_STATES_CITIES } from '../../data/indianStatesCities';
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
  Camera,
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
  const dispatch = useDispatch();
  const { user, loading, kycStatus } = useSelector((state) => state.auth);

  const fileInputRef = useRef(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);

  const [copiedShare, setCopiedShare] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editErrors, setEditErrors] = useState({});
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // User Profile State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [locationDisplay, setLocationDisplay] = useState('');
  const [bio, setBio] = useState('Product designer & tech enthusiast sharing 4K streaming and AI subscriptions.');

  // Preference Switches State
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchKycStatus());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const fn = user.firstName || '';
      const ln = user.lastName || '';
      const full = `${fn} ${ln}`.trim();
      setFirstName(fn);
      setLastName(ln);
      setName(full);
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setStateName(user.state || '');
      setCityName(user.city || '');
      if (user.bio) {
        setBio(user.bio);
      }
      if (user.city && user.state) {
        setLocationDisplay(`${user.city}, ${user.state}`);
      } else if (user.city || user.state) {
        setLocationDisplay(user.city || user.state);
      } else {
        setLocationDisplay('India');
      }
      if (user.email) {
        setUsername(user.email.split('@')[0]);
      }
    }
  }, [user]);

  const displayName = `${firstName} ${lastName}`.trim() || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (username || 'User'));

  const initials = firstName
    ? `${firstName[0]}${lastName ? lastName[0] : ''}`.toUpperCase()
    : user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`.toUpperCase()
    : 'U';

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleStateChangeInModal = (e) => {
    const val = e.target.value;
    setStateName(val);
    setCityName('');
    if (editErrors.stateName) {
      setEditErrors((prev) => ({ ...prev, stateName: '', cityName: '' }));
    }
  };

  const handleSaveProfile = async () => {
    const newErrors = {};
    if (!firstName.trim()) {
      newErrors.firstName = 'First Name is required.';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last Name is required.';
    }
    const cleanPhone = phone.trim().replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '');
    if (phone.trim() && !/^[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }

    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors);
      return;
    }

    setEditErrors({});
    try {
      setSavingProfile(true);
      await dispatch(updateUserProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        state: stateName.trim(),
        city: cityName.trim(),
        bio: bio.trim(),
      })).unwrap();

      const combinedName = `${firstName.trim()} ${lastName.trim()}`.trim();
      setName(combinedName);
      if (cityName && stateName) {
        setLocationDisplay(`${cityName}, ${stateName}`);
      } else if (cityName || stateName) {
        setLocationDisplay(cityName || stateName);
      }
      setToast({ open: true, message: 'Profile updated successfully!', severity: 'success' });
      setEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      const msg = typeof err === 'string' ? err : (err?.message || 'Failed to update profile.');
      setToast({ open: true, message: msg, severity: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleImageFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToast({ open: true, message: 'Please select a valid image file (PNG, JPG, WEBP).', severity: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = reader.result;
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 512;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        try {
          setUploadingImage(true);
          await dispatch(uploadProfilePicture(resizedDataUrl)).unwrap();
          setToast({ open: true, message: 'Profile picture updated successfully!', severity: 'success' });
        } catch (err) {
          console.error('Failed to upload profile picture:', err);
          const msg = typeof err === 'string' ? err : (err?.message || 'Failed to upload profile picture.');
          setToast({ open: true, message: msg, severity: 'error' });
        } finally {
          setUploadingImage(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };


  if (loading && !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#2563eb' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ color: '#f3f4f6' }}>
      {/* Hidden File Input for Profile Picture Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageFileSelect}
      />

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
            {/* Avatar with Glowing Border & Upload Camera Overlay */}
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={user?.profileImage || undefined}
                sx={{
                  width: 92,
                  height: 92,
                  bgcolor: '#2563eb',
                  fontWeight: 900,
                  fontSize: '2.2rem',
                  border: '3px solid #3b82f6',
                  boxShadow: '0 0 24px rgba(59,130,246,0.4)',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.85 },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingImage ? <CircularProgress size={28} sx={{ color: '#ffffff' }} /> : initials}
              </Avatar>

              <Tooltip title="Upload Profile Picture">
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: '2px solid #14161a',
                    '&:hover': { backgroundColor: '#1d4ed8' },
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  }}
                >
                  <Camera size={15} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box>
              <Stack direction="row" alignItems="center" spacing={1.25} mb={0.5}>
                <Typography variant="h3" sx={{ fontWeight: 900, fontSize: '1.8rem', color: '#f3f4f6', letterSpacing: '-0.03em' }}>
                  {displayName}
                </Typography>
                <Chip
                  icon={<ShieldCheck size={13} color="#22c55e" />}
                  label={user?.role ? `${user.role}` : 'Verified'}
                  size="small"
                  sx={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, border: '1px solid rgba(34,197,94,0.3)' }}
                />
              </Stack>

              <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', mb: 1.5 }}>
                @{username || 'user'} • {email} • {locationDisplay}
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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Paper elevation={0} sx={{ flex: 1, p: 2, borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>First Name</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#f3f4f6', mt: 0.2 }}>{firstName || '—'}</Typography>
                </Paper>

                <Paper elevation={0} sx={{ flex: 1, p: 2, borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>Last Name</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#f3f4f6', mt: 0.2 }}>{lastName || '—'}</Typography>
                </Paper>
              </Stack>

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

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Paper elevation={0} sx={{ flex: 1, p: 2, borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>State</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#f3f4f6', mt: 0.2 }}>{stateName || '—'}</Typography>
                </Paper>

                <Paper elevation={0} sx={{ flex: 1, p: 2, borderRadius: '14px', background: '#1c1e24', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>City</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#f3f4f6', mt: 0.2 }}>{cityName || '—'}</Typography>
                </Paper>
              </Stack>
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
import KycUploadModal from './components/KycUploadModal';

              <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#1c1e24', border: kycStatus?.isKycVerified ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(245,158,11,0.3)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <ShieldCheck size={20} color={kycStatus?.isKycVerified ? "#22c55e" : "#f59e0b"} />
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#f3f4f6' }}>
                        Government KYC Identity Status
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                        {kycStatus?.message || (kycStatus?.isKycVerified ? 'Govt ID Verified (Unlocks Escrow Hosting)' : 'Verification Needed')}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      label={kycStatus?.kycStatus || (user?.emailVerified ? 'VERIFIED' : 'UNVERIFIED')}
                      size="small"
                      sx={{
                        background: kycStatus?.isKycVerified ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                        color: kycStatus?.isKycVerified ? '#22c55e' : '#f59e0b',
                        fontWeight: 800,
                        fontSize: '0.68rem',
                      }}
                    />

                    {!kycStatus?.isKycVerified && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setKycModalOpen(true)}
                        sx={{
                          borderRadius: '8px',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          textTransform: 'none',
                          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        }}
                      >
                        Complete KYC Now
                      </Button>
                    )}
                  </Stack>
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
                        MacBook Pro • Chrome (Active Now)
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
            <Stack direction="row" spacing={1.5}>
              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (editErrors.firstName) setEditErrors((prev) => ({ ...prev, firstName: '' }));
                }}
                error={Boolean(editErrors.firstName)}
                helperText={editErrors.firstName}
                fullWidth
                size="small"
              />
              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (editErrors.lastName) setEditErrors((prev) => ({ ...prev, lastName: '' }));
                }}
                error={Boolean(editErrors.lastName)}
                helperText={editErrors.lastName}
                fullWidth
                size="small"
              />
            </Stack>

            <Stack direction="row" spacing={1.5}>
              {/* State Dropdown */}
              <TextField
                select
                label="State"
                value={stateName}
                onChange={handleStateChangeInModal}
                error={Boolean(editErrors.stateName)}
                helperText={editErrors.stateName}
                fullWidth
                size="small"
                SelectProps={{
                  displayEmpty: true,
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        background: '#18181C',
                        color: '#ffffff',
                        maxHeight: 260,
                        border: '1px solid #2A2A30',
                      },
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select State</em>
                </MenuItem>
                {Object.keys(INDIAN_STATES_CITIES).map((st) => (
                  <MenuItem key={st} value={st} sx={{ fontSize: '0.9rem', color: '#E4E4E7', '&:hover': { background: '#252830' } }}>
                    {st}
                  </MenuItem>
                ))}
              </TextField>

              {/* City Dropdown */}
              <TextField
                select
                label="City"
                disabled={!stateName}
                value={cityName}
                onChange={(e) => {
                  setCityName(e.target.value);
                  if (editErrors.cityName) setEditErrors((prev) => ({ ...prev, cityName: '' }));
                }}
                error={Boolean(editErrors.cityName)}
                helperText={editErrors.cityName}
                fullWidth
                size="small"
                SelectProps={{
                  displayEmpty: true,
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        background: '#18181C',
                        color: '#ffffff',
                        maxHeight: 260,
                        border: '1px solid #2A2A30',
                      },
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>{stateName ? 'Select City' : 'Choose State first'}</em>
                </MenuItem>
                {stateName &&
                  INDIAN_STATES_CITIES[stateName]?.map((ct) => (
                    <MenuItem key={ct} value={ct} sx={{ fontSize: '0.9rem', color: '#E4E4E7', '&:hover': { background: '#252830' } }}>
                      {ct}
                    </MenuItem>
                  ))}
              </TextField>
            </Stack>

            <TextField
              label="Phone Number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (editErrors.phone) setEditErrors((prev) => ({ ...prev, phone: '' }));
              }}
              error={Boolean(editErrors.phone)}
              helperText={editErrors.phone}
              fullWidth
              size="small"
              placeholder="+91 98765 43210"
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
              disabled={savingProfile}
              onClick={handleSaveProfile}
              sx={{ mt: 1, py: 1.1, borderRadius: '10px', fontWeight: 800, textTransform: 'none', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
            >
              {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ─── Toast Notification Snackbar ─── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: '100%',
            fontWeight: 700,
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            background: toast.severity === 'error' ? '#ef4444' : '#22c55e',
            color: '#ffffff',
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* KYC Document Upload & AI Verification Modal */}
      <KycUploadModal
        open={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        onSuccess={() => {
          dispatch(fetchKycStatus());
          setToast({ open: true, message: 'KYC Verification Successful! Account verified.', severity: 'success' });
        }}
      />
    </Box>
  );
}


export default Profile;
