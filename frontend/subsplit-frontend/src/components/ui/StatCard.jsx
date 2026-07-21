import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const StatCard = ({
  title,
  value,
  color = '#10b981',
  valueColor = '#065f46',
  icon: Icon = null,
  sx = {},
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...sx,
      }}
    >
      <Box>
        <Typography variant="caption" sx={{ color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ color: valueColor, fontWeight: 800, mt: 0.5 }}>
          {value}
        </Typography>
      </Box>
      {Icon && (
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            bgcolor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}
        >
          <Icon size={22} />
        </Box>
      )}
    </Paper>
  );
};

export default StatCard;
