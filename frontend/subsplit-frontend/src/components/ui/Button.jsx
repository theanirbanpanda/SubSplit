import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

const Button = ({
  children,
  loading = false,
  disabled = false,
  variant = 'contained',
  color = 'primary',
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  sx = {},
  ...props
}) => {
  return (
    <MuiButton
      type={type}
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={!loading ? startIcon : null}
      endIcon={!loading ? endIcon : null}
      onClick={onClick}
      sx={{
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 600,
        px: 2.5,
        py: 1,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
        ...sx,
      }}
      {...props}
    >
      {loading ? <CircularProgress size={22} color="inherit" /> : children}
    </MuiButton>
  );
};

export default Button;
