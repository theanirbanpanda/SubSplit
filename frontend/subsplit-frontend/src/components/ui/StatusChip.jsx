import React from 'react';
import { Chip } from '@mui/material';

const statusStyles = {
  completed: { bg: '#dcfce7', color: '#15803d' },
  pending: { bg: '#fef3c7', color: '#b45309' },
  owe: { bg: '#fee2e2', color: '#b91c1c' },
  owed: { bg: '#dcfce7', color: '#15803d' },
  settled: { bg: '#e0e7ff', color: '#4338ca' },
  default: { bg: '#f1f5f9', color: '#475569' },
};

const getStatusTheme = (label = '') => {
  const lower = label.toLowerCase();
  if (lower.includes('completed') || lower.includes('paid')) return statusStyles.completed;
  if (lower.includes('pending')) return statusStyles.pending;
  if (lower.includes('you owe')) return statusStyles.owe;
  if (lower.includes('owed')) return statusStyles.owed;
  if (lower.includes('settled')) return statusStyles.settled;
  return statusStyles.default;
};

const StatusChip = ({ label, size = 'small', sx = {}, ...props }) => {
  const theme = getStatusTheme(label);

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        bgcolor: theme.bg,
        color: theme.color,
        fontWeight: 600,
        borderRadius: '6px',
        fontSize: '12px',
        ...sx,
      }}
      {...props}
    />
  );
};

export default StatusChip;
