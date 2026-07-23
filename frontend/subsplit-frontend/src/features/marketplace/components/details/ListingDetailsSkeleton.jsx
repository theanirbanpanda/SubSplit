import React from 'react';
import { Box, Container, Grid, Skeleton, Stack, Paper } from '@mui/material';

function ListingDetailsSkeleton() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stack direction="row" spacing={2} mb={3}>
            <Skeleton variant="rounded" width={72} height={72} sx={{ borderRadius: '18px' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="30%" height={24} />
            </Box>
          </Stack>

          <Paper sx={{ p: 3, borderRadius: '20px', mb: 3 }}>
            <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: '12px' }} />
          </Paper>

          <Paper sx={{ p: 3, borderRadius: '20px', mb: 3 }}>
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '12px' }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: '24px' }}>
            <Skeleton variant="text" width="50%" height={48} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={48} sx={{ borderRadius: '14px', mb: 2 }} />
            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '12px' }} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ListingDetailsSkeleton;
