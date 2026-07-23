import React from 'react';
import {
  Box,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Chip,
} from '@mui/material';
import { ArrowUpDown } from 'lucide-react';

function FilterBar({ sortBy, setSortBy, totalResults }) {
  return (
    <Box
      sx={{
        py: 2,
        px: 2.5,
        mb: 3,
        borderRadius: '16px',
        background: '#111114',
        border: '1px solid #2A2A30',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      {/* Total Results Counter */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>
          {totalResults} Group{totalResults !== 1 ? 's' : ''} Available
        </Typography>
        <Chip
          label="Live Marketplace"
          size="small"
          sx={{
            background: 'rgba(34,197,94,0.15)',
            color: '#22c55e',
            border: '1px solid rgba(34,197,94,0.3)',
            fontWeight: 800,
            fontSize: '0.65rem',
            height: 20,
            borderRadius: '6px',
          }}
        />
      </Stack>

      {/* Sort Dropdown */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <ArrowUpDown size={14} color="#A1A1AA" />
          <Typography sx={{ fontSize: '0.82rem', color: '#A1A1AA', fontWeight: 600 }}>
            Sort by:
          </Typography>
        </Stack>

        <FormControl size="small">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{
              background: '#18181C',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '10px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2A2A30' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
              '& .MuiSelect-icon': { color: '#A1A1AA' },
            }}
          >
            <MenuItem value="trending">🔥 Trending</MenuItem>
            <MenuItem value="price_low">₹ Lowest Price</MenuItem>
            <MenuItem value="savings_high">% Highest Savings</MenuItem>
            <MenuItem value="rating_high">⭐ Highest Rated</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}

export default FilterBar;
