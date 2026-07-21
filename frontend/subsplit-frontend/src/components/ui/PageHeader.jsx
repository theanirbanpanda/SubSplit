import React from 'react';
import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, subtitle, action }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 4,
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

export default PageHeader;
