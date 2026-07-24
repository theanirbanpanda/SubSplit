import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CURRENT = [
  { name: 'Netflix Premium', price: 649 },
  { name: 'Spotify Premium', price: 179 },
  { name: 'YouTube Premium', price: 149 },
];

const SUBSPLIT = [
  { name: 'Netflix', price: 129 },
  { name: 'Spotify', price: 59 },
  { name: 'YouTube', price: 106 },
];

const currentTotal = CURRENT.reduce((s, i) => s + i.price, 0);
const splitTotal = SUBSPLIT.reduce((s, i) => s + i.price, 0);
const savedMonthly = currentTotal - splitTotal;
const savedYearly = savedMonthly * 12;

function PriceRow({ name, price, dimmed = false }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ py: 1.1 }}
    >
      <Typography
        sx={{
          fontSize: '0.88rem',
          color: dimmed ? '#71717A' : '#E4E4E7',
          fontWeight: 500,
        }}
      >
        {name}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.88rem',
          fontWeight: 700,
          color: dimmed ? '#71717A' : '#ffffff',
          textDecoration: dimmed ? 'line-through' : 'none',
        }}
      >
        ₹{price.toLocaleString('en-IN')}
      </Typography>
    </Stack>
  );
}

function ComparisonCard({ label, accentColor, accentBg, items, total, isAfter }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '20px',
        border: `2px solid ${isAfter ? accentColor : '#2A2A30'}`,
        background: '#111114',
        p: 3,
        boxShadow: isAfter
          ? `0 8px 40px ${accentColor}22`
          : '0 2px 16px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Label badge */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.6,
          background: accentBg,
          border: `1px solid ${accentColor}44`,
          borderRadius: '8px',
          px: 1.25,
          py: 0.4,
          mb: 2.5,
        }}
      >
        <Typography
          sx={{ fontSize: '0.7rem', fontWeight: 800, color: accentColor, letterSpacing: '0.06em' }}
        >
          {label}
        </Typography>
      </Box>

      {/* Rows */}
      <Box>
        {items.map((item, i) => (
          <Box key={item.name}>
            <PriceRow name={item.name} price={item.price} dimmed={!isAfter} />
            {i < items.length - 1 && <Divider sx={{ borderColor: '#2A2A30' }} />}
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2, borderColor: '#2A2A30' }} />

      {/* Total */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontWeight: 700, color: '#A1A1AA', fontSize: '0.9rem' }}>
          Total / month
        </Typography>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '1.25rem',
            color: accentColor,
          }}
        >
          ₹{total.toLocaleString('en-IN')}
        </Typography>
      </Stack>
    </Paper>
  );
}

function SavingsComparison() {
  const navigate = useNavigate();

  return (
    <Box
      id="savings"
      component="section"
      sx={{ py: { xs: 5, md: 7 }, background: '#09090B', borderTop: '1px solid #2A2A30' }}
    >
      <Box
        sx={{
          width: '92%',
          maxWidth: '1440px',
          mx: 'auto',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <Typography
            variant="overline"
            sx={{ color: '#3b82f6', fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.72rem' }}
          >
            Savings Calculator
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 900,
              color: '#ffffff',
              mt: 0.5,
              fontSize: { xs: '1.5rem', md: '1.9rem' },
              letterSpacing: '-0.03em',
            }}
          >
            See How Much You Can Save
          </Typography>
          <Typography
            sx={{
              color: '#A1A1AA',
              mt: 1,
              fontSize: '0.95rem',
              maxWidth: 480,
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            Join verified subscription groups and reduce your monthly subscription costs.
          </Typography>
        </Box>

        {/* Comparison layout */}
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          {/* Current cost card */}
          <Grid item xs={12} sm={5}>
            <ComparisonCard
              label="CURRENT COST"
              accentColor="#ef4444"
              accentBg="rgba(239,68,68,0.15)"
              items={CURRENT}
              total={currentTotal}
              isAfter={false}
            />
          </Grid>

          {/* Arrow */}
          <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(37,99,235,0.4)',
                }}
              >
                <ArrowRight size={22} color="#fff" />
              </Box>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#A1A1AA', mt: 0.5 }}>
                Switch
              </Typography>
            </Box>
          </Grid>

          {/* SubSplit cost card */}
          <Grid item xs={12} sm={5}>
            <ComparisonCard
              label="WITH SUBSPLIT"
              accentColor="#22c55e"
              accentBg="rgba(34,197,94,0.15)"
              items={SUBSPLIT}
              total={splitTotal}
              isAfter={true}
            />
          </Grid>
        </Grid>

        {/* Savings highlight */}
        <Box
          sx={{
            mt: 4,
            mx: 'auto',
            maxWidth: 560,
            borderRadius: '20px',
            background: '#111114',
            border: '2px solid rgba(34,197,94,0.4)',
            p: { xs: 3, md: 4 },
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(34,197,94,0.1)',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              mb: 1.5,
            }}
          >
            <TrendingDown size={20} color="#22c55e" />
            <Typography
              sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#22c55e', letterSpacing: '0.05em' }}
            >
              YOUR ANNUAL SAVINGS
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 4 }}
            justifyContent="center"
            alignItems="center"
          >
            <Box>
              <Typography
                sx={{ fontWeight: 900, color: '#22c55e', fontSize: { xs: '2rem', md: '2.4rem' }, lineHeight: 1 }}
              >
                ₹{savedMonthly.toLocaleString('en-IN')}
              </Typography>
              <Typography sx={{ color: '#4ade80', fontSize: '0.82rem', fontWeight: 600, mt: 0.4 }}>
                saved per month
              </Typography>
            </Box>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: 'none', sm: 'block' }, borderColor: '#2A2A30' }}
            />
            <Box>
              <Typography
                sx={{ fontWeight: 900, color: '#22c55e', fontSize: { xs: '2rem', md: '2.4rem' }, lineHeight: 1 }}
              >
                ₹{savedYearly.toLocaleString('en-IN')}
              </Typography>
              <Typography sx={{ color: '#4ade80', fontSize: '0.82rem', fontWeight: 600, mt: 0.4 }}>
                saved per year
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/app/marketplace')}
            sx={{
              mt: 3,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '12px',
              px: 3.5,
              py: 1.3,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              boxShadow: '0 4px 16px rgba(34,197,94,0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                boxShadow: '0 6px 24px rgba(34,197,94,0.45)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Browse Marketplace
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default SavingsComparison;
