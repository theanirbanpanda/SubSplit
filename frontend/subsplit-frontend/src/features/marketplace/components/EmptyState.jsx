import React from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { SearchX, RotateCcw } from 'lucide-react';

function EmptyState({ onReset }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, md: 6 },
        borderRadius: '24px',
        background: '#111114',
        border: '1px dashed #2A2A30',
        textAlign: 'center',
        my: 4,
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '16px',
          background: 'rgba(59,130,246,0.12)',
          border: '1px solid rgba(59,130,246,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2.5,
        }}
      >
        <SearchX size={30} color="#3b82f6" />
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 800, color: '#ffffff', mb: 1, fontSize: '1.25rem' }}>
        No Subscription Groups Found
      </Typography>

      <Typography sx={{ color: '#A1A1AA', fontSize: '0.9rem', maxWidth: 420, mx: 'auto', mb: 3.5, lineHeight: 1.6 }}>
        We couldn't find any active groups matching your criteria. Try adjusting your filters or search terms.
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          onClick={onReset}
          startIcon={<RotateCcw size={16} />}
          sx={{
            fontWeight: 700,
            fontSize: '0.88rem',
            px: 3,
            py: 1,
            borderRadius: '11px',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          }}
        >
          Reset All Filters
        </Button>
      </Stack>
    </Paper>
  );
}

export default EmptyState;
