import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { MOCK_LISTINGS } from '../../data/mockListings';
import MarketplaceCard from '../MarketplaceCard';

function RelatedListings({ currentId, category }) {
  const related = MOCK_LISTINGS.filter(
    (item) => item.id !== currentId
  ).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <Box sx={{ mt: 6, pt: 6, borderTop: '1px solid #2A2A30' }}>
      <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', mb: 3, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
        Similar Subscription Groups You Might Like
      </Typography>

      <Grid container spacing={3}>
        {related.map((listing) => (
          <Grid item xs={12} sm={6} md={4} key={listing.id}>
            <MarketplaceCard listing={listing} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RelatedListings;
