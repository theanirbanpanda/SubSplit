import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { Tv, Monitor, ShieldAlert, Calendar, Globe, Key, UserCheck, HelpCircle, Sparkles } from 'lucide-react';

function SubscriptionDetails({ listing }) {
  const {
    platform = 'Netflix',
    quality = '4K Ultra HD + HDR',
    devices = '4 Screens (TV, Phone, Laptop)',
    billingCycle = 'Monthly',
    renewalDate = 'Next Month',
    region = 'India (en-IN)',
    accessMethod = 'Instant Email Invite / PIN',
    accountType = 'Legitimate Family Shared',
    supportAvailability = '24/7 Priority Resolution',
  } = listing || {};

  const SPECS = [
    { label: 'Platform', value: platform, icon: Sparkles, color: '#3b82f6' },
    { label: 'Plan Type', value: `${billingCycle} Family Tier`, icon: Calendar, color: '#a855f7' },
    { label: 'Screen Quality', value: quality, icon: Tv, color: '#ef4444' },
    { label: 'Supported Devices', value: devices, icon: Monitor, color: '#22c55e' },
    { label: 'Region', value: region, icon: Globe, color: '#06b6d4' },
    { label: 'Next Renewal Date', value: renewalDate, icon: Calendar, color: '#f59e0b' },
    { label: 'Access Method', value: accessMethod, icon: Key, color: '#10b981' },
    { label: 'Account Type', value: accountType, icon: UserCheck, color: '#3b82f6' },
    { label: 'Support Availability', value: supportAvailability, icon: HelpCircle, color: '#ec4899' },
  ];


  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', mb: 2, fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
        Subscription Specs & Details
      </Typography>

      <Grid container spacing={2}>
        {SPECS.map(({ label, value, icon: Icon, color }) => (
          <Grid item xs={12} sm={6} md={4} key={label}>
            <Paper
              elevation={0}
              sx={{
                p: 2.25,
                borderRadius: '16px',
                background: '#111114',
                border: '1px solid #2A2A30',
                height: '100%',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: color,
                },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  background: `${color}15`,
                  border: `1px solid ${color}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                }}
              >
                <Icon size={18} color={color} />
              </Box>

              <Typography sx={{ fontSize: '0.74rem', fontWeight: 600, color: '#A1A1AA', mb: 0.3 }}>
                {label}
              </Typography>

              <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3 }}>
                {value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SubscriptionDetails;
