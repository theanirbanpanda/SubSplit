import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Avatar,
  CircularProgress,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  ArrowLeft,
  Tv2,
  Music,
  Bot,
  Zap,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Lock,
} from 'lucide-react';
import { fetchMySubscriptionByIdApi, fetchSubscriptionCredentialsApi } from '../api/subscriptionsApi';
import RaiseDisputeModal from '../../disputes/RaiseDisputeModal';

const PROVIDER_ICONS = {
  netflix:  { Icon: Tv2,   color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.3)' },
  spotify:  { Icon: Music, color: '#22c55e', bg: 'rgba(34,197,94,0.15)',   border: 'rgba(34,197,94,0.3)' },
  chatgpt:  { Icon: Bot,   color: '#14b8a6', bg: 'rgba(20,184,166,0.15)', border: 'rgba(20,184,166,0.3)' },
};

const DEFAULT_THEME = { Icon: Zap, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' };

function PassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [pass, setPass] = useState(null);
  const [creds, setCreds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const passRes = await fetchMySubscriptionByIdApi(id);
        if (passRes?.data) setPass(passRes.data);
        
        try {
          const credsRes = await fetchSubscriptionCredentialsApi(id);
          if (credsRes?.data) setCreds(credsRes.data);
        } catch (e) {
          // If credentials aren't available yet or are invite link only, that's fine
          console.log("Credentials fetch error:", e);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load pass details.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  if (error || !pass) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
        <Typography variant="h6" sx={{ color: '#ef4444', mb: 2 }}>{error || 'Pass not found'}</Typography>
        <Button variant="contained" onClick={() => navigate('/app/dashboard')}>Return to Dashboard</Button>
      </Box>
    );
  }

  const prov = (pass.providerName || pass.title || '').toLowerCase();
  const themeKey = Object.keys(PROVIDER_ICONS).find((k) => prov.includes(k));
  const theme = themeKey ? PROVIDER_ICONS[themeKey] : DEFAULT_THEME;
  const { Icon, color, bg, border } = theme;

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', pb: 8, pt: { xs: 2, md: 4 }, px: { xs: 2, md: 0 } }}>
      {/* Header section */}
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <IconButton 
          onClick={() => navigate('/app/dashboard')}
          sx={{ background: 'rgba(255,255,255,0.05)', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
        >
          <ArrowLeft size={20} color="#fff" />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
          Pass Details
        </Typography>
      </Stack>

      <Stack spacing={3}>
        {/* Main Info Card */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '24px',
            background: 'linear-gradient(180deg, #1f2229 0%, #14161a 100%)',
            border: `1px solid rgba(255,255,255,0.05)`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'absolute', top: 0, right: 0, p: 4, opacity: 0.1 }}>
            <Icon size={120} color={color} />
          </Box>
          
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Box sx={{ p: 2, borderRadius: '16px', background: bg, color: color, border: `1px solid ${border}` }}>
              <Icon size={32} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', mb: 0.5 }}>
                {pass.title}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip 
                  icon={<CheckCircle2 size={14} color="#22c55e" />} 
                  label="Active Pass" 
                  size="small"
                  sx={{ 
                    background: 'rgba(34,197,94,0.1)', 
                    color: '#22c55e', 
                    fontWeight: 700,
                    border: '1px solid rgba(34,197,94,0.2)',
                  }} 
                />
                <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  Seat {pass.seatNumber} of {pass.totalSeats}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Box flex={1}>
              <Typography sx={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Host
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar sx={{ width: 32, height: 32, background: color, fontWeight: 800, fontSize: '0.9rem' }}>
                  {pass.host?.fullName?.charAt(0) || '?'}
                </Avatar>
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>{pass.host?.fullName || 'Host'}</Typography>
              </Stack>
            </Box>
            <Box flex={1}>
              <Typography sx={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Next Renewal
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Calendar size={18} color="#9ca3af" />
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>{pass.renewalDate || 'N/A'}</Typography>
              </Stack>
            </Box>
            <Box flex={1}>
              <Typography sx={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pricing
              </Typography>
              <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>
                ₹{pass.price} <Typography component="span" sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>/mo</Typography>
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Credentials / Access Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '24px',
            background: '#14161a',
            border: `1px solid rgba(255,255,255,0.05)`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
            <Lock size={20} color={color} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>Access Details</Typography>
          </Stack>

          {creds ? (
            <Box>
              {creds.credentialType === 'LINK' ? (
                <Box sx={{ p: 3, borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem', mb: 1 }}>Invitation Link</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ color: '#60a5fa', fontWeight: 600, wordBreak: 'break-all' }}>
                      {creds.inviteLink}
                    </Typography>
                    <Tooltip title="Copy Link">
                      <IconButton onClick={() => handleCopy(creds.inviteLink, 'link')} sx={{ color: copied === 'link' ? '#22c55e' : '#9ca3af' }}>
                        {copied === 'link' ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                      </IconButton>
                    </Tooltip>
                    <Button 
                      variant="contained" 
                      onClick={() => window.open(creds.inviteLink, '_blank')}
                      endIcon={<ExternalLink size={16} />}
                      sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', background: color, color: '#000', '&:hover': { background: color, opacity: 0.9 } }}
                    >
                      Open Link
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Stack spacing={2}>
                  <Box sx={{ p: 3, borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', mb: 0.5 }}>Username / Email</Typography>
                      <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>{creds.username}</Typography>
                    </Box>
                    <Tooltip title="Copy Username">
                      <IconButton onClick={() => handleCopy(creds.username, 'user')} sx={{ color: copied === 'user' ? '#22c55e' : '#9ca3af', background: 'rgba(255,255,255,0.05)' }}>
                        {copied === 'user' ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ p: 3, borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', mb: 0.5 }}>Password</Typography>
                      <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>{creds.password}</Typography>
                    </Box>
                    <Tooltip title="Copy Password">
                      <IconButton onClick={() => handleCopy(creds.password, 'pass')} sx={{ color: copied === 'pass' ? '#22c55e' : '#9ca3af', background: 'rgba(255,255,255,0.05)' }}>
                        {copied === 'pass' ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {creds.instructions && (
                    <Box sx={{ p: 3, borderRadius: '16px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <Typography sx={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700, mb: 1 }}>Host Instructions:</Typography>
                      <Typography sx={{ color: '#fcd34d', fontSize: '0.9rem' }}>{creds.instructions}</Typography>
                    </Box>
                  )}
                </Stack>
              )}
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <Typography sx={{ color: '#9ca3af' }}>Credentials have not been shared yet or are unavailable.</Typography>
            </Box>
          )}

          <Stack direction="row" alignItems="center" spacing={1} mt={3} sx={{ p: 2, borderRadius: '12px', background: 'rgba(34,197,94,0.05)' }}>
            <ShieldCheck size={18} color="#22c55e" />
            <Typography sx={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: 600 }}>
              This pass is secured by SubSplit Escrow Protection.
            </Typography>
          </Stack>
        </Paper>

        {/* Support & Actions Section */}
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mt: 2, mb: 1 }}>Support & Actions</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Paper
            elevation={0}
            onClick={() => navigate(`/app/messages?recipientId=${pass.host?.id}`)}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: '16px',
              background: '#14161a',
              border: '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': { background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.3)' }
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1.5, borderRadius: '12px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                <MessageCircle size={24} />
              </Box>
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 700 }}>Message Host</Typography>
                <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>Contact {pass.host?.fullName || 'the host'} for help.</Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            onClick={() => setDisputeModalOpen(true)}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: '16px',
              background: '#14161a',
              border: '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': { background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.3)' }
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1.5, borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                <AlertTriangle size={24} />
              </Box>
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 700 }}>Raise a Dispute</Typography>
                <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>Report issues with access or payments.</Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Stack>

      <RaiseDisputeModal 
        open={disputeModalOpen} 
        onClose={() => setDisputeModalOpen(false)}
        listing={{ id: pass.listingId }}
        joinRequest={{ id: pass.id }}
        onSuccess={() => {
          setDisputeModalOpen(false);
          // Optional: re-fetch or show a success snackbar
        }}
      />
    </Box>
  );
}

export default PassDetails;
