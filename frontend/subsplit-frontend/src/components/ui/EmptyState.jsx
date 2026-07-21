import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No Data Found',
  description = 'There are no items to display right now.',
  action = null,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 5,
        textAlign: 'center',
        border: '1px border-dashed #cbd5e1',
        borderRadius: '12px',
        bgcolor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          mb: 2,
        }}
      >
        <Icon size={28} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748b', mb: action ? 3 : 0, maxWidth: 360 }}>
        {description}
      </Typography>
      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Paper>
  );
};

export default EmptyState;
