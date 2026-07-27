import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Stack,
  IconButton,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Sparkles,
  Tv,
  Music,
  Bot,
  Video,
  Palette,
  Cloud,
  Gamepad2,
  BookOpen,
  CheckCircle,
  PlusCircle,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { createNewListing, fetchMarketplaceListings } from '../marketplaceSlice';

const POPULAR_PLATFORMS = [
  { name: 'Netflix 4K', category: 'OTT', icon: Tv, color: '#e50914', price: 129, seats: 4 },
  { name: 'Spotify Family', category: 'Music', icon: Music, color: '#1db954', price: 59, seats: 6 },
  { name: 'ChatGPT Plus', category: 'AI & Tools', icon: Bot, color: '#10a37f', price: 399, seats: 5 },
  { name: 'YouTube Premium', category: 'OTT', icon: Video, color: '#ff0000', price: 106, seats: 5 },
  { name: 'Canva Pro', category: 'Productivity', icon: Palette, color: '#00c4cc', price: 89, seats: 10 },
  { name: 'Microsoft 365', category: 'Cloud Storage', icon: Cloud, color: '#0078d4', price: 149, seats: 6 },
  { name: 'PlayStation Plus', category: 'Gaming', icon: Gamepad2, color: '#00439c', price: 249, seats: 3 },
  { name: 'Udemy Pro', category: 'Learning', icon: BookOpen, color: '#a435f0', price: 199, seats: 5 },
];

const CATEGORIES = [
  'OTT',
  'Music',
  'AI & Tools',
  'Productivity',
  'Gaming',
  'Cloud Storage',
  'Learning',
  'General',
];

const STEPS = ['Select Platform', 'Listing Details', 'Pricing & Capacity'];

function CreateListingModal({ open, onClose }) {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [formData, setFormData] = useState({
    providerName: 'Netflix 4K',
    categoryName: 'OTT',
    planName: 'Premium Pass',
    title: 'Netflix Premium 4K UHD Slot',
    description: 'Get your dedicated screen slot on an official Netflix 4K UHD account.',
    seatPrice: '129',
    totalSeats: '4',
    availableSeats: '4',
    billingCycle: 'MONTHLY',
  });

  const handleSelectPlatform = (platform) => {
    setFormData((prev) => ({
      ...prev,
      providerName: platform.name,
      categoryName: platform.category,
      title: `${platform.name} Shared Slot`,
      seatPrice: String(platform.price),
      totalSeats: String(platform.seats),
      availableSeats: String(platform.seats),
    }));
    setActiveStep(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.seatPrice || !formData.totalSeats) {
      setErrorMsg('Please fill in all required fields (Title, Seat Price, Total Seats).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const payload = {
      providerName: formData.providerName || 'Custom Subscription',
      categoryName: formData.categoryName || 'General',
      planName: formData.planName || 'Standard Plan',
      title: formData.title,
      description: formData.description || 'Shared subscription group slot available.',
      seatPrice: parseFloat(formData.seatPrice),
      totalSeats: parseInt(formData.totalSeats, 10),
      availableSeats: parseInt(formData.availableSeats || formData.totalSeats, 10),
      billingCycle: formData.billingCycle || 'MONTHLY',
    };

    try {
      const resultAction = await dispatch(createNewListing(payload));
      if (createNewListing.fulfilled.match(resultAction)) {
        setSuccessMsg('🎉 Listing created successfully!');
        dispatch(fetchMarketplaceListings({ page: 0, size: 20 }));
        setTimeout(() => {
          setSuccessMsg(null);
          setActiveStep(0);
          onClose();
        }, 1200);
      } else {
        setErrorMsg(resultAction.payload || 'Failed to create listing');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: '#0e1014',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 3,
          background: 'linear-gradient(180deg, rgba(37,99,235,0.12) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlusCircle size={22} color="#ffffff" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', color: '#ffffff', lineHeight: 1.2 }}>
              List Your Subscription
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Share extra seats and recover up to 80% of your subscription cost
            </Typography>
          </Box>
        </Stack>

        <IconButton size="small" onClick={onClose} sx={{ color: '#9ca3af', '&:hover': { color: '#ffffff' } }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3.5 }}>
        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 4,
            '& .MuiStepLabel-label': { color: '#6b7280', fontSize: '0.78rem', fontWeight: 600 },
            '& .MuiStepLabel-label.Mui-active': { color: '#3b82f6', fontWeight: 800 },
            '& .MuiStepLabel-label.Mui-completed': { color: '#22c55e', fontWeight: 700 },
            '& .MuiStepIcon-root': { color: '#1f2937' },
            '& .MuiStepIcon-root.Mui-active': { color: '#2563eb' },
            '& .MuiStepIcon-root.Mui-completed': { color: '#22c55e' },
          }}
        >
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: '12px', background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
            {successMsg}
          </Alert>
        )}

        {/* Step 1: Platform Selection */}
        {activeStep === 0 && (
          <Box>
            <Typography sx={{ fontSize: '0.9rem', color: '#9ca3af', mb: 2, fontWeight: 600 }}>
              Select a popular subscription service to populate defaults:
            </Typography>

            <Grid container spacing={2}>
              {POPULAR_PLATFORMS.map((plat) => {
                const Icon = plat.icon;
                const isSelected = formData.providerName === plat.name;

                return (
                  <Grid item xs={6} sm={3} key={plat.name}>
                    <Paper
                      elevation={0}
                      onClick={() => handleSelectPlatform(plat)}
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        background: isSelected ? 'rgba(37,99,235,0.15)' : '#14161d',
                        border: isSelected ? '2px solid #2563eb' : '1px solid rgba(255,255,255,0.08)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: plat.color,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          background: `${plat.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1.5,
                        }}
                      >
                        <Icon size={24} color={plat.color} />
                      </Box>

                      <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff', mb: 0.5 }}>
                        {plat.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#6b7280' }}>
                        ₹{plat.price}/mo • {plat.seats} seats
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af', mb: 1 }}>
                Don't see your subscription platform?
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    providerName: 'Custom Subscription',
                    categoryName: 'General',
                  }));
                  setActiveStep(1);
                }}
                sx={{
                  borderRadius: '10px',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { borderColor: '#3b82f6', background: 'rgba(59,130,246,0.1)' },
                }}
              >
                Configure Custom Subscription
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 2: Listing Details */}
        {activeStep === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', mb: 1 }}>
                Provider / Platform Name *
              </Typography>
              <TextField
                fullWidth
                name="providerName"
                value={formData.providerName}
                onChange={handleChange}
                placeholder="e.g. Netflix, Spotify, ChatGPT"
                variant="outlined"
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', mb: 1 }}>
                Category *
              </Typography>
              <TextField
                select
                fullWidth
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                variant="outlined"
                sx={inputStyle}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', mb: 1 }}>
                Listing Title *
              </Typography>
              <TextField
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Netflix Premium 4K UHD Dedicated Screen"
                variant="outlined"
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', mb: 1 }}>
                Description & Access Instructions
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Specify screen rules, automated invite info, or group guidelines..."
                variant="outlined"
                sx={inputStyle}
              />
            </Grid>
          </Grid>
        )}

        {/* Step 3: Pricing & Capacity */}
        {activeStep === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', mb: 1 }}>
                Monthly Seat Price (₹) *
              </Typography>
              <TextField
                fullWidth
                type="number"
                name="seatPrice"
                value={formData.seatPrice}
                onChange={handleChange}
                placeholder="149"
                InputProps={{
                  startAdornment: <InputAdornment position="start" sx={{ color: '#3b82f6', fontWeight: 800 }}>₹</InputAdornment>,
                }}
                variant="outlined"
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', mb: 1 }}>
                Total Seats in Group *
              </Typography>
              <TextField
                fullWidth
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                placeholder="4"
                variant="outlined"
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', mb: 1 }}>
                Available Seats *
              </Typography>
              <TextField
                fullWidth
                type="number"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleChange}
                placeholder="4"
                variant="outlined"
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', mb: 1 }}>
                Billing Cycle
              </Typography>
              <TextField
                select
                fullWidth
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
                variant="outlined"
                sx={inputStyle}
              >
                <MenuItem value="MONTHLY">Monthly</MenuItem>
                <MenuItem value="YEARLY">Yearly</MenuItem>
              </TextField>
            </Grid>

            {/* Live Preview Card */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  background: '#14161e',
                  border: '1px dashed rgba(59,130,246,0.4)',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Zap size={18} color="#3b82f6" />
                  <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#3b82f6' }}>
                    Live Marketplace Preview
                  </Typography>
                </Stack>
                <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', color: '#ffffff', mb: 0.5 }}>
                  {formData.title || 'Untitled Listing'}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    label={formData.categoryName || 'General'}
                    size="small"
                    sx={{ background: 'rgba(37,99,235,0.2)', color: '#60a5fa', fontWeight: 700, fontSize: '0.72rem' }}
                  />
                  <Typography sx={{ fontSize: '0.82rem', color: '#22c55e', fontWeight: 800 }}>
                    ₹{formData.seatPrice || '0'}/mo
                  </Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                    {formData.availableSeats || '0'} of {formData.totalSeats || '0'} seats left
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Footer Actions */}
        <Stack direction="row" spacing={2} justifyContent="space-between" mt={4}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={() => setActiveStep((prev) => prev - 1)}
            sx={{ color: '#9ca3af', fontWeight: 700, textTransform: 'none' }}
          >
            Back
          </Button>

          {activeStep < STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => setActiveStep((prev) => prev + 1)}
              sx={{
                borderRadius: '12px',
                fontWeight: 800,
                px: 4,
                py: 1.2,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
              }}
            >
              Continue to {STEPS[activeStep + 1]}
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleSubmit}
              sx={{
                borderRadius: '12px',
                fontWeight: 800,
                px: 4,
                py: 1.2,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                boxShadow: '0 4px 14px rgba(34,197,94,0.4)',
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Publish Listing Now'}
            </Button>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: '#181b22',
    color: '#ffffff',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
    '&:hover fieldset': { borderColor: '#3b82f6' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
  },
  '& .MuiInputBase-input': { fontSize: '0.9rem' },
};

export default CreateListingModal;
