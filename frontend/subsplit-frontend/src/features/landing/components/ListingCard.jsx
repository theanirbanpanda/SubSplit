import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { Shield, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BADGE_BG = {
  'Verified Host': 'rgba(34, 197, 94, 0.15)',
  'AI Verified': 'rgba(59, 130, 246, 0.15)',
  'Escrow Protected': 'rgba(168, 85, 247, 0.15)',
};

const BADGE_COLOR_HEX = {
  'Verified Host': '#22c55e',
  'AI Verified': '#3b82f6',
  'Escrow Protected': '#a855f7',
};

function ListingCard({
  title,
  price,
  badge,
  seatsLeft,
  ratingValue,
  fullStars = 5,
  halfStar = false,
}) {
  const navigate = useNavigate();
  const badgeBg = BADGE_BG[badge] ?? 'rgba(255,255,255,0.06)';
  const badgeColor = BADGE_COLOR_HEX[badge] ?? '#A1A1AA';

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />);
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(
          <Box key={i} sx={{ position: 'relative', display: 'inline-flex' }}>
            <Star size={13} color="#2A2A30" fill="#2A2A30" />
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
              <Star size={13} fill="#f59e0b" color="#f59e0b" />
            </Box>
          </Box>
        );
      } else {
        stars.push(<Star key={i} size={13} color="#2A2A30" fill="#2A2A30" />);
      }
    }
    return stars;
  };

  return (
    <Card
      elevation={0}
      onClick={() => navigate('/app/marketplace')}
      sx={{
        borderRadius: '16px',
        border: '1px solid #2A2A30',
        background: '#18181C',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: '#3b82f6',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Header row */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={1.5}>
          <Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem', lineHeight: 1.3 }}
            >
              {title}
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: '#3b82f6', fontSize: '1.15rem', mt: 0.3 }}
            >
              ₹{price.toLocaleString('en-IN')}
              <Typography
                component="span"
                sx={{ fontWeight: 400, color: '#A1A1AA', fontSize: '0.75rem', ml: 0.5 }}
              >
                /month
              </Typography>
            </Typography>
          </Box>

          {/* Verification badge */}
          <Box
            sx={{
              background: badgeBg,
              border: `1px solid ${badgeColor}44`,
              borderRadius: '8px',
              px: 1,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Shield size={11} color={badgeColor} />
            <Typography sx={{ fontSize: '0.63rem', fontWeight: 800, color: badgeColor, whiteSpace: 'nowrap' }}>
              {badge}
            </Typography>
          </Box>
        </Stack>

        {/* Seats & Rating */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" alignItems="center" gap={0.6}>
            <Users size={13} color="#A1A1AA" />
            <Typography sx={{ fontSize: '0.78rem', color: '#A1A1AA', fontWeight: 500 }}>
              {seatsLeft} Seat{seatsLeft !== 1 ? 's' : ''} Left
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={0.3}>
            {renderStars()}
            <Typography sx={{ fontSize: '0.75rem', color: '#A1A1AA', fontWeight: 600, ml: 0.4 }}>
              {ratingValue}
            </Typography>
          </Stack>
        </Stack>

        {/* CTA */}
        <Button
          fullWidth
          variant="contained"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/app/marketplace');
          }}
          sx={{
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.82rem',
            py: 0.9,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.45)',
            },
          }}
        >
          Join Now
        </Button>
      </CardContent>
    </Card>
  );
}

export default ListingCard;
