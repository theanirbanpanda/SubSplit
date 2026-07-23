import React from 'react';
import { Alert, AlertTitle, Collapse } from '@mui/material';

function ValidationAlert({ error, success, onClose }) {
  if (!error && !success) return null;

  return (
    <Collapse in={Boolean(error || success)}>
      {error && (
        <Alert
          severity="error"
          onClose={onClose}
          sx={{
            borderRadius: '12px',
            mb: 2.5,
            fontSize: '0.85rem',
            '& .MuiAlert-icon': { alignItems: 'center' },
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          onClose={onClose}
          sx={{
            borderRadius: '12px',
            mb: 2.5,
            fontSize: '0.85rem',
            '& .MuiAlert-icon': { alignItems: 'center' },
          }}
        >
          {success}
        </Alert>
      )}
    </Collapse>
  );
}

export default ValidationAlert;
