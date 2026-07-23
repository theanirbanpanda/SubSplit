import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import { Search, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'OTT',
  'Music',
  'AI',
  'Productivity',
  'Gaming',
  'Education',
  'Cloud Storage',
];

function SearchBar({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Large Premium Search Bar */}
      <TextField
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search Netflix, Spotify, ChatGPT, YouTube..."
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={20} color="#3b82f6" />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ color: '#A1A1AA' }}>
                <X size={16} />
              </IconButton>
            </InputAdornment>
          ) : null,
          sx: {
            borderRadius: '16px',
            background: '#111114',
            color: '#ffffff',
            fontSize: '0.98rem',
            px: 1,
            border: '1px solid #2A2A30',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease',
            '& fieldset': { border: 'none' },
            '&:hover': {
              borderColor: '#3b82f6',
            },
            '&.Mui-focused': {
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 3px rgba(59,130,246,0.2)',
            },
          },
        }}
      />

      {/* Quick Category Filter Chips */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mt: 2,
          overflowX: 'auto',
          pb: 0.5,
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <Chip
              key={cat}
              label={cat}
              clickable
              onClick={() => setSelectedCategory(cat)}
              sx={{
                fontWeight: 700,
                fontSize: '0.82rem',
                borderRadius: '10px',
                px: 1,
                py: 0.5,
                background: active
                  ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                  : '#111114',
                color: active ? '#ffffff' : '#A1A1AA',
                border: active ? 'none' : '1px solid #2A2A30',
                boxShadow: active ? '0 4px 14px rgba(37,99,235,0.35)' : 'none',
                '&:hover': {
                  background: active
                    ? 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)'
                    : '#18181C',
                  color: '#ffffff',
                },
                transition: 'all 0.15s ease',
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

export default SearchBar;
