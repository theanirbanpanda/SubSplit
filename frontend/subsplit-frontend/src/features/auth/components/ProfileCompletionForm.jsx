import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Paper,
  Avatar,
  InputAdornment,
  Grid,
} from '@mui/material';
import { User, MapPin, CreditCard, ArrowRight, Sparkles, Check } from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Streaming',
  'Music',
  'AI',
  'Gaming',
  'Productivity',
  'Education',
];

const AVATAR_COLORS = ['#2563eb', '#10b981', '#7c3aed', '#ec4899', '#f59e0b'];

function ProfileCompletionForm({ onComplete, loading }) {
  const [displayName, setDisplayName] = useState('Anirban Panda');
  const [upiId, setUpiId] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [avatarColor, setAvatarColor] = useState('#2563eb');
  const [selectedCategories, setSelectedCategories] = useState(['Streaming', 'AI', 'Music']);

  const handleCategoryToggle = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({
      displayName,
      upiId,
      city,
      avatarColor,
      preferredCategories: selectedCategories,
    });
  };

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3.5, sm: 4.5 },
        borderRadius: '24px',
        background: '#111114',
        border: '1px solid #2A2A30',
        color: '#ffffff',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, color: '#ffffff', fontSize: '1.6rem', letterSpacing: '-0.03em' }}
          >
            Complete Your Profile
          </Typography>
          <Chip
            icon={<Sparkles size={12} color="#3b82f6" />}
            label="Step 2 of 2"
            size="small"
            sx={{
              background: 'rgba(59,130,246,0.15)',
              color: '#3b82f6',
              fontWeight: 800,
              fontSize: '0.68rem',
              border: '1px solid rgba(59,130,246,0.3)',
            }}
          />
        </Stack>

        <Typography sx={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Tailor your SubSplit marketplace experience and set up your preferred categories.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Avatar Color Picker */}
        <Box mb={2.5}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#E4E4E7', mb: 1.25 }}>
            Profile Avatar Accent
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: avatarColor,
                fontWeight: 900,
                fontSize: '1.1rem',
                border: '2px solid #ffffff',
              }}
            >
              {initials || 'AP'}
            </Avatar>

            <Stack direction="row" spacing={1}>
              {AVATAR_COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => setAvatarColor(color)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: color,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: avatarColor === color ? '2px solid #ffffff' : 'none',
                    transition: 'transform 0.15s ease',
                    '&:hover': { transform: 'scale(1.15)' },
                  }}
                >
                  {avatarColor === color && <Check size={14} color="#fff" />}
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>

        {/* Display Name */}
        <Box mb={2}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#E4E4E7', mb: 0.75 }}>
            Display Name
          </Typography>
          <TextField
            fullWidth
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <User size={18} color="#A1A1AA" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                background: '#18181C',
                color: '#ffffff',
                fontSize: '0.92rem',
                border: '1px solid #2A2A30',
                '& fieldset': { border: 'none' },
                '&:hover': { borderColor: '#3b82f6' },
                '&.Mui-focused': { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.2)' },
              },
            }}
          />
        </Box>

        <Grid container spacing={2} mb={2.5}>
          {/* City */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#E4E4E7', mb: 0.75 }}>
              City
            </Typography>
            <TextField
              fullWidth
              value={city}
              onChange={(e) => setCity(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MapPin size={18} color="#A1A1AA" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  background: '#18181C',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  border: '1px solid #2A2A30',
                  '& fieldset': { border: 'none' },
                  '&:hover': { borderColor: '#3b82f6' },
                  '&.Mui-focused': { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.2)' },
                },
              }}
            />
          </Grid>

          {/* UPI ID */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#E4E4E7', mb: 0.75 }}>
              UPI ID (Optional)
            </Typography>
            <TextField
              fullWidth
              placeholder="user@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCard size={18} color="#A1A1AA" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  background: '#18181C',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  border: '1px solid #2A2A30',
                  '& fieldset': { border: 'none' },
                  '&:hover': { borderColor: '#3b82f6' },
                  '&.Mui-focused': { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.2)' },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Preferred Categories Chips */}
        <Box mb={3.5}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#E4E4E7', mb: 1 }}>
            Preferred Subscription Categories
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={1}>
            {CATEGORY_OPTIONS.map((cat) => {
              const selected = selectedCategories.includes(cat);
              return (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  onClick={() => handleCategoryToggle(cat)}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    borderRadius: '8px',
                    px: 0.5,
                    background: selected
                      ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                      : '#18181C',
                    color: selected ? '#ffffff' : '#A1A1AA',
                    border: selected ? 'none' : '1px solid #2A2A30',
                  }}
                />
              );
            })}
          </Stack>
        </Box>

        {/* Primary CTA */}
        <Button
          fullWidth
          type="submit"
          disabled={loading}
          variant="contained"
          size="large"
          endIcon={<ArrowRight size={18} />}
          sx={{
            fontWeight: 800,
            fontSize: '0.95rem',
            py: 1.3,
            borderRadius: '12px',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 18px rgba(37, 99, 235, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
            },
          }}
        >
          {loading ? 'Setting up profile...' : 'Complete Profile & Launch'}
        </Button>
      </Box>
    </Paper>
  );
}

export default ProfileCompletionForm;
