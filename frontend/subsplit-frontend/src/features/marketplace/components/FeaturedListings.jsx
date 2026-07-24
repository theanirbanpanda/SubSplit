import React from 'react';
import { Box, Typography, Grid, Stack, Chip } from '@mui/material';
import { Flame } from 'lucide-react';
import MarketplaceCard from './MarketplaceCard';

function FeaturedListings({ listings }) {
  const featured = listings.filter((item) => item.isFeatured).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <Box sx={{ mb: 5 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
        <Chip
          icon={<Flame size={14} color="#ef4444" />}
          label="Top Featured Deals"
          size="small"
          sx={{
            background: 'rgba(239,68,68,0.15)',
            color: '#ef4444',
            fontWeight: 800,
            fontSize: '0.74rem',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px',
          }}
        />
        <Typography sx={{ fontSize: '0.82rem', color: '#A1A1AA', fontWeight: 600 }}>
          Hand-picked verified groups with highest savings
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {featured.map((listing) => (
          <Grid item xs={12} sm={6} md={3} key={listing.id}>
            <MarketplaceCard listing={listing} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default FeaturedListings;
