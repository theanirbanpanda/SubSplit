import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Star, ShieldCheck } from 'lucide-react';
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
    host = {},
    billingCycle = 'monthly',
    accessMethod = 'email invite',
  } = listing;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently Listed';

  const hostName = host?.name || listing?.hostName || 'Super Host';
  const billingLabel = billingCycle?.toLowerCase() === 'yearly' ? 'Billed yearly' : 'Billed monthly';
  const accessLabel = (accessMethod || '').toLowerCase().includes('instant') ? 'seats open now' : 'access upon join';
  const escrowLabel = isEscrowProtected !== false ? 'protected in escrow' : null;

  // Strip things like " — 1 Seat Available" from the title for a cleaner display
  const cleanTitle = (title || '').replace(/\s*[—|-]\s*\d+\s*Seat(s)?\s*Available/i, '').trim();

  // Check if we actually have rating data
  const hasReviews = rating > 0 && reviewCount > 0;

  return (
    <Box sx={{ mb: 3.5, color: '#ffffff' }}>
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

      {/* Escrow eyebrow */}
      {isEscrowProtected !== false && (
        <Stack direction="row" alignItems="center" spacing={0.6} mb={1.25}>
          <ShieldCheck size={13} color="#22c55e" />
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#22c55e', letterSpacing: '0.01em' }}>
            Escrow Protected
          </Typography>
        </Stack>
      )}

      {/* Identity block: Bigger icon tile + title */}
      <Stack direction="row" alignItems="flex-start" spacing={2.5} mb={2}>
        {/* Icon tile - Fixed larger size to match a 2-line title perfectly */}
        <Box
          sx={{
            width: { xs: 72, sm: 84 },
            height: { xs: 72, sm: 84 },
            borderRadius: '16px',
            background: iconBg,
            border: `1.5px solid ${iconColor}44`,
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
              alt={platform}
              style={{ width: '55%', height: '55%', objectFit: 'contain' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <Typography
            sx={{
              display: logoUrl ? 'none' : 'flex',
              fontWeight: 900,
              fontSize: '2.2rem',
              color: iconColor,
              lineHeight: 1,
            }}
          >
            {(platform || 'S').charAt(0)}
          </Typography>
        </Box>

        {/* Title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', pt: 0.5 }}>
          <Typography
            component="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.6rem', sm: '2rem', md: '2.4rem' },
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              mb: 1.25,
            }}
          >
            {cleanTitle}
          </Typography>
        </Box>
      </Stack>

      {/* Description paragraph — kept short and clear */}
      <Box sx={{ pt: 1 }}>
        <Typography
          sx={{
            fontSize: '0.95rem',
            color: '#A1A1AA',
            lineHeight: 1.7,
            maxWidth: 720,
          }}
        >
          {'Shared access to '}
          <Typography component="span" sx={{ color: '#f3f4f6', fontWeight: 600, fontSize: 'inherit' }}>
            {cleanTitle}
          </Typography>
          {' from a '}
          <Typography component="span" sx={{ color: '#22c55e', fontWeight: 700, fontSize: 'inherit' }}>
            {isVerifiedHost ? `KYC-verified ${hostName}` : hostName}
          </Typography>
          {'. '}
          {billingLabel}, {accessLabel}
          {escrowLabel && (
            <>
              {' — your payment stays '}
              <Typography component="span" sx={{ color: '#22c55e', fontWeight: 700, fontSize: 'inherit' }}>
                {escrowLabel}
              </Typography>
              {' until you confirm access works.'}
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
}

export default SubscriptionHero;

