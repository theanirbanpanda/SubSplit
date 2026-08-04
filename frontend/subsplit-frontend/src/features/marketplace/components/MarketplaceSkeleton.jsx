import React from 'react';
import { Grid, Card, CardContent, Skeleton, Box, Stack } from '@mui/material';

function MarketplaceSkeleton({ count = 8 }) {
  return (
    <Grid container spacing={3}>
      {[...Array(count)].map((_, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
          <Card
            elevation={0}
            sx={{
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#14161e',
              p: 1,
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: '12px' }} />
                <Skeleton variant="rounded" width={60} height={20} sx={{ borderRadius: '6px' }} />
              </Stack>
              <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" height={36} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="50%" height={20} sx={{ mb: 3 }} />
              <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: '11px' }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default MarketplaceSkeleton;
