import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function FinalCTA() {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        background: '#09090B',
        borderTop: '1px solid #2A2A30',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow accent */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '300px', md: '600px' },
          height: { xs: '300px', md: '600px' },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          width: '92%',
          maxWidth: '1440px',
          mx: 'auto',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '1.7rem', sm: '2.2rem', md: '2.6rem' },
            letterSpacing: '-0.03em',
            mb: 1.5,
            lineHeight: 1.15,
          }}
        >
          Ready to Stop Paying Full Price?
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            color: '#A1A1AA',
            maxWidth: 520,
            mx: 'auto',
            mb: 3.5,
            lineHeight: 1.6,
          }}
        >
          Join thousands of smart savers across India and start getting premium access at up to 80% off today.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowRight size={18} />}
            onClick={() => navigate('/app/marketplace')}
            sx={{
              fontWeight: 700,
              fontSize: '0.95rem',
              px: 4,
              py: 1.3,
              borderRadius: '12px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                boxShadow: '0 6px 28px rgba(37, 99, 235, 0.55)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Browse Marketplace
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/auth')}
            sx={{
              fontWeight: 600,
              fontSize: '0.95rem',
              px: 4,
              py: 1.3,
              borderRadius: '12px',
              textTransform: 'none',
              borderColor: '#2A2A30',
              color: '#ffffff',
              background: '#111114',
              '&:hover': {
                borderColor: '#3b82f6',
                background: '#18181C',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Become a Host
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default FinalCTA;
