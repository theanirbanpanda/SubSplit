import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ message = 'Loading...', fullPage = false, size = 40 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        ...(fullPage && {
          minHeight: '60vh',
          width: '100%',
        }),
      }}
    >
      <CircularProgress size={size} sx={{ color: '#2563eb', mb: 2 }} />
      {message && (
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;
