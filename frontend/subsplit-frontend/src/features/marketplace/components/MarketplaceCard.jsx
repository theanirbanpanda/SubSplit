import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  IconButton,
  LinearProgress,
  Chip,
} from '@mui/material';
import { ShieldCheck, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './MarketplaceCard.module.scss';

function MarketplaceCard({ listing }) {

  const navigate = useNavigate();

  const {
    id,
    title,
    price,
    originalPrice,
    savingsPercent,
    seatsLeft,
    totalSeats,
    rating,
    reviewCount,
    hostName,
    isVerifiedHost,
    isAiVerified,
    isEscrowProtected,
    iconColor = '#3b82f6',
    iconBg = 'rgba(59,130,246,0.12)',
    logoUrl,
    host = {},
  } = listing;

  const filledSeats = totalSeats - seatsLeft;
  const progressPercent = (filledSeats / totalSeats) * 100;

  return (
    <Card
      className={styles.card}
      elevation={0}
      onClick={() => navigate(`/app/marketplace/${id}`)}
    >
      <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar: Badge & Wishlist Heart */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Chip
            icon={<ShieldCheck size={13} color="#22c55e" />}
            label={isVerifiedHost ? 'Verified Host' : 'Escrow Protected'}
            size="small"
            sx={{
              background: 'rgba(34,197,94,0.12)',
              color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.3)',
              fontWeight: 800,
              fontSize: '0.68rem',
              height: 22,
              borderRadius: '6px',
            }}
          />
        </Stack>

        {/* Logo & Title */}
        <Stack direction="row" alignItems="center" spacing={1.5} mb={1.25}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={title}
                style={{ width: 20, height: 20, objectFit: 'contain' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: '1.2rem',
                color: iconColor,
                lineHeight: 1,
                display: logoUrl ? 'none' : 'flex'
              }}
            >
              {title.charAt(0)}
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: '1rem',
              color: '#ffffff',
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
        </Stack>

        {/* Price & Savings */}
        <Stack direction="row" alignItems="baseline" justifyContent="space-between" mb={2}>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', color: '#3b82f6', lineHeight: 1 }}>
              ₹{price}
              <Typography component="span" sx={{ fontSize: '0.75rem', color: '#A1A1AA', ml: 0.4 }}>
                /month
              </Typography>
            </Typography>
            {originalPrice && originalPrice > price && (
              <Typography sx={{ fontSize: '0.74rem', color: '#71717A', textDecoration: 'line-through', mt: 0.3, fontWeight: 600 }}>
                ₹{originalPrice}/month
              </Typography>
            )}
          </Box>

          {savingsPercent && (
            <Chip
              label={`Save ${savingsPercent}%`}
              size="small"
              sx={{
                background: 'rgba(34,197,94,0.15)',
                color: '#22c55e',
                border: '1px solid rgba(34,197,94,0.3)',
                fontWeight: 800,
                fontSize: '0.68rem',
                borderRadius: '6px',
              }}
            />
          )}
        </Stack>

        {/* Seats progress indicator */}
        <Box mb={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.75}>
            <Stack direction="row" alignItems="center" spacing={0.6}>
              <Users size={13} color="#A1A1AA" />
              <Typography sx={{ fontSize: '0.75rem', color: '#A1A1AA', fontWeight: 600 }}>
                {filledSeats}/{totalSeats} Seats Filled
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 800 }}>
              {seatsLeft} Left
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#2A2A30',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: 'linear-gradient(90deg, #3b82f6 0%, #22c55e 100%)',
              },
            }}
          />
        </Box>

        {/* Host info */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          pt={1.5}
          sx={{ borderTop: '1px solid #2A2A30' }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: host.avatarBg || '#2563eb',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.68rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {host.initials || hostName?.charAt(0) || 'H'}
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#E4E4E7', lineHeight: 1.1 }}>
                {hostName}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.3}>
                <Clock size={10} color="#71717A" />
                <Typography sx={{ fontSize: '0.65rem', color: '#71717A' }}>
                  {host.responseTime || '< 15m'}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        {/* Buy button */}
        <Button
          fullWidth
          variant="contained"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/app/marketplace/${id}`);
          }}
          sx={{
            borderRadius: '11px',
            fontWeight: 700,
            fontSize: '0.85rem',
            py: 1,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.45)',
            },
          }}
        >
          Buy Subscription
        </Button>
      </CardContent>
    </Card>
  );
}

export default MarketplaceCard;
