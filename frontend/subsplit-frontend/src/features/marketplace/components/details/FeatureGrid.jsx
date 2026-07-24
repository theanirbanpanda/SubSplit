import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
} from '@mui/material';
import { CheckCircle2 } from 'lucide-react';

function FeatureGrid({ features = [] }) {
  const displayFeatures = features.length > 0 ? features : [
    '4K Ultra HD Streaming',
    'Offline Downloads',
    'Multi-Device Support',
    'No Advertising',
    'Instant Invite Link',
    '24/7 Dispute Support',
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        mb: 4,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2.5 }}>
        Included Features
      </Typography>

      <Grid container spacing={1.5}>
        {displayFeatures.map((feat) => (
          <Grid item xs={12} sm={6} key={feat}>
            <Box
              sx={{
                p: 1.5,
                px: 2,
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
              }}
            >
              <CheckCircle2 size={18} color="#16a34a" />
              <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#334155' }}>
                {feat}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default FeatureGrid;
