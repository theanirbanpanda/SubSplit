import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error = false,
  helperText,
  required = false,
  fullWidth = true,
  disabled = false,
  startIcon,
  endIcon,
  variant = 'outlined',
  sx = {},
  ...props
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      required={required}
      fullWidth={fullWidth}
      disabled={disabled}
      variant={variant}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : null,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : null,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default Input;
