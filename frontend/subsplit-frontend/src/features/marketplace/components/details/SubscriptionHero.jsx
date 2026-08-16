import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Breadcrumbs,
  Link,
  Paper,
} from '@mui/material';
import { ShieldCheck, Star, Zap, Clock, Users, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SubscriptionHero({ listing }) {
  const navigate = useNavigate();
  const {
    title,
    platform,
    category,
    rating,
    reviewCount,
    isVerifiedHost,
    isEscrowProtected,
    iconColor = '#3b82f6',
    iconBg = 'rgba(59,130,246,0.12)',
    logoUrl,
    createdAt,
    memberCount = 2,
    host = {},
  } = listing;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently Listed';

  return (
    <Box sx={{ mb: 4, color: '#ffffff' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<Typography sx={{ color: '#71717A', fontSize: '0.8rem' }}>/</Typography>}
        sx={{ mb: 2.5 }}
      >
        <Link
          underline="hover"
          onClick={() => navigate('/app/marketplace')}
          sx={{ color: '#A1A1AA', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}
        >
          Marketplace
        </Link>
        <Link
          underline="hover"
          onClick={() => navigate('/app/marketplace')}
          sx={{ color: '#A1A1AA', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}
        >
          {category}
        </Link>
        <Typography sx={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: 700 }}>
          {platform}
        </Typography>
      </Breadcrumbs>

      {/* Main Header Title & Badges */}
      <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" mb={2}>
        <Chip
          icon={<ShieldCheck size={13} color="#22c55e" />}
          label={isVerifiedHost ? 'Verified Host' : 'Escrow Protected'}
          size="small"
          sx={{
            background: 'rgba(34,197,94,0.15)',
            color: '#22c55e',
            border: '1px solid rgba(34,197,94,0.3)',
            fontWeight: 800,
            fontSize: '0.72rem',
            borderRadius: '6px',
          }}
        />

        <Chip
          icon={<Award size={13} color="#f59e0b" />}
          label="Top Rated Group"
          size="small"
          sx={{
            background: 'rgba(245,158,11,0.15)',
            color: '#f59e0b',
            border: '1px solid rgba(245,158,11,0.3)',
            fontWeight: 800,
            fontSize: '0.72rem',
            borderRadius: '6px',
          }}
        />

        <Chip
          icon={<Zap size={13} color="#a855f7" />}
          label="Instant Access"
          size="small"
          sx={{
            background: 'rgba(168,85,247,0.15)',
            color: '#a855f7',
            border: '1px solid rgba(168,85,247,0.3)',
            fontWeight: 800,
            fontSize: '0.72rem',
            borderRadius: '6px',
          }}
        />
      </Stack>

      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontWeight: 900,
          fontSize: { xs: '1.8rem', sm: '2.4rem', md: '2.75rem' },
          color: '#ffffff',
          lineHeight: 1.15,
          letterSpacing: '-0.035em',
          mb: 2,
        }}
      >
        {title}
      </Typography>

      {/* Rating & Stats Bar */}
      <Stack direction="row" alignItems="center" spacing={2.5} flexWrap="wrap" mb={3}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Star size={18} fill="#f59e0b" color="#f59e0b" />
          <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
            {rating}
          </Typography>
          <Typography sx={{ color: '#A1A1AA', fontSize: '0.85rem' }}>
            ({reviewCount || 38} reviews)
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.6}>
          <Users size={16} color="#3b82f6" />
          <Typography sx={{ fontSize: '0.88rem', color: '#A1A1AA', fontWeight: 600 }}>
            {memberCount + 2} Members Joined
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.6}>
          <Clock size={16} color="#71717A" />
          <Typography sx={{ fontSize: '0.88rem', color: '#71717A' }}>
            Listed {formattedDate}
          </Typography>
        </Stack>
      </Stack>

      {/* Large Dark Gradient Subscription Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #111114 0%, #18181C 100%)',
          border: '1px solid #2A2A30',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2.5}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '18px',
              background: iconBg,
              border: `1.5px solid ${iconColor}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${iconColor}25`,
              overflow: 'hidden',
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={platform}
                style={{ width: 40, height: 40, objectFit: 'contain' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <Typography
              sx={{
                display: logoUrl ? 'none' : 'flex',
                fontWeight: 900,
                fontSize: '1.6rem',
                color: iconColor,
                lineHeight: 1,
              }}
            >
              {platform.charAt(0)}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#ffffff', lineHeight: 1.2 }}>
              Official {platform} Subscription
            </Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#A1A1AA', mt: 0.5 }}>
              Managed by super host {host.name || 'Vikram S.'} • Verified KYC ID
            </Typography>
          </Box>
        </Stack>

        <Chip
          label="Escrow Protected"
          sx={{
            background: 'rgba(34,197,94,0.15)',
            color: '#22c55e',
            border: '1px solid rgba(34,197,94,0.3)',
            fontWeight: 800,
            fontSize: '0.78rem',
            px: 1,
            display: { xs: 'none', sm: 'inline-flex' },
          }}
        />
      </Paper>
    </Box>
  );
}

export default SubscriptionHero;
