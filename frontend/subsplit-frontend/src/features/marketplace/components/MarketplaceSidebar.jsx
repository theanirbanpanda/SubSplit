import React from 'react';
import {
  Box,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Switch,
  Slider,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import { FilterX, ShieldCheck, Zap } from 'lucide-react';

const PLATFORMS_LIST = ['Netflix', 'Spotify', 'ChatGPT', 'YouTube', 'Canva', 'Microsoft 365'];

function MarketplaceSidebar({
  selectedPlatforms,
  setSelectedPlatforms,
  priceRange,
  setPriceRange,
  verifiedOnly,
  setVerifiedOnly,
  instantOnly,
  setInstantOnly,
  onReset,
}) {
  const handlePlatformToggle = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '20px',
        background: '#111114',
        border: '1px solid #2A2A30',
        color: '#ffffff',
        position: 'sticky',
        top: 90,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography sx={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff' }}>
          Filters
        </Typography>

        <Button
          size="small"
          onClick={onReset}
          startIcon={<FilterX size={14} />}
          sx={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#A1A1AA',
            textTransform: 'none',
            '&:hover': { color: '#ef4444' },
          }}
        >
          Reset
        </Button>
      </Stack>

      <Divider sx={{ borderColor: '#2A2A30', mb: 2.5 }} />

      {/* ── Toggle Switches ── */}
      <Stack spacing={1.5} mb={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ShieldCheck size={16} color="#22c55e" />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#E4E4E7' }}>
              Verified Hosts Only
            </Typography>
          </Stack>
          <Switch
            size="small"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#22c55e' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22c55e' },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Zap size={16} color="#a855f7" />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#E4E4E7' }}>
              Instant Access
            </Typography>
          </Stack>
          <Switch
            size="small"
            checked={instantOnly}
            onChange={(e) => setInstantOnly(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#a855f7' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#a855f7' },
            }}
          />
        </Box>
      </Stack>

      <Divider sx={{ borderColor: '#2A2A30', mb: 2.5 }} />

      {/* ── Price Range ── */}
      <Box mb={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#E4E4E7' }}>
            Max Price / Month
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#3b82f6' }}>
            ₹{priceRange}
          </Typography>
        </Stack>

        <Slider
          value={priceRange}
          min={50}
          max={600}
          step={25}
          onChange={(e, val) => setPriceRange(val)}
          sx={{
            color: '#3b82f6',
            '& .MuiSlider-thumb': {
              width: 16,
              height: 16,
              '&:hover, &.Mui-focused': { boxShadow: '0 0 0 8px rgba(59,130,246,0.2)' },
            },
            '& .MuiSlider-rail': { backgroundColor: '#2A2A30' },
          }}
        />
      </Box>

      <Divider sx={{ borderColor: '#2A2A30', mb: 2.5 }} />

      {/* ── Platforms Checkboxes ── */}
      <Box>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#E4E4E7', mb: 1 }}>
          Platform
        </Typography>
        <FormGroup sx={{ gap: 0.5 }}>
          {PLATFORMS_LIST.map((platform) => (
            <FormControlLabel
              key={platform}
              control={
                <Checkbox
                  size="small"
                  checked={selectedPlatforms.includes(platform)}
                  onChange={() => handlePlatformToggle(platform)}
                  sx={{
                    color: '#2A2A30',
                    '&.Mui-checked': { color: '#3b82f6' },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 500 }}>
                  {platform}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </Box>
    </Paper>
  );
}

export default MarketplaceSidebar;
