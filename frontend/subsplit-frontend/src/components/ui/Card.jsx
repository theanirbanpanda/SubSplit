import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions } from '@mui/material';

export const Card = ({ children, header, actions, elevation = 0, sx = {}, ...props }) => {
  return (
    <MuiCard
      elevation={elevation}
      sx={{
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        ...sx,
      }}
      {...props}
    >
      {header && <CardHeader title={header} />}
      <CardContent>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
};

export default Card;
