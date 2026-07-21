import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, X } from 'lucide-react';

const SearchBox = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  fullWidth = true,
  sx = {},
  ...props
}) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth={fullWidth}
      variant="outlined"
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search size={18} style={{ color: '#64748b' }} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={onClear}
              aria-label="clear search"
              edge="end"
            >
              <X size={16} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          bgcolor: '#fff',
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default SearchBox;
