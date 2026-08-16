import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Grid } from '@mui/material';
import MarketplaceCard from '../MarketplaceCard';
import { fetchSimilarListings } from '../../marketplaceSlice';

function RelatedListings({ currentId, category }) {
  const dispatch = useDispatch();
  const { listings, similarListings } = useSelector((state) => state.marketplace);

  useEffect(() => {
    if (currentId) {
      dispatch(fetchSimilarListings(currentId));
    }
  }, [currentId, dispatch]);

  const related = similarListings.length > 0
    ? similarListings
    : listings.filter((item) => String(item.id) !== String(currentId)).slice(0, 3);

  if (related.length === 0) return null;


  return (
    <Box sx={{ mt: 6, pt: 6, borderTop: '1px solid #2A2A30' }}>
      <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', mb: 3, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
        Similar Subscription Groups You Might Like
      </Typography>

      <Grid container spacing={3}>
        {related.map((listing) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={listing.id}>
            <MarketplaceCard listing={listing} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RelatedListings;
