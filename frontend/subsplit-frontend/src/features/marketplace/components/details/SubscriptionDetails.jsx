import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { AlignJustify, ChevronRight } from 'lucide-react';

function SubscriptionDetails({ listing }) {
  const [expanded, setExpanded] = useState(false);

  const {
    platform = '',
    billingCycle = 'Monthly',
    accessMethod = 'Email Invite',
    renewalDate = '',
    seatsLeft = 0,
    totalSeats = 4,
    memberCount = 0,
  } = listing || {};

  const filledSeats = totalSeats - seatsLeft;
  const expectedJoinTime = '< 2 minutes';

  const facts = [
    { label: 'Platform', value: platform },
    { label: 'Plan type', value: `${billingCycle} subscription` },
    { label: 'Access method', value: accessMethod },
    { label: 'Billing cycle', value: billingCycle },
    { label: 'Seats available', value: `${seatsLeft} of ${totalSeats}` },
    { label: 'Renewal date', value: renewalDate || 'Next billing cycle' },
    { label: 'Expected join time', value: expectedJoinTime },
    { label: 'Members joined', value: String(memberCount || filledSeats) },
  ].filter((f) => f.value && f.value !== '' && f.value !== 'undefined');

  return (
    <Box sx={{ mb: 3 }}>
      <Accordion
        expanded={expanded}
        onChange={(_, isExpanded) => setExpanded(isExpanded)}
        elevation={0}
        disableGutters
        sx={{
          background: '#111114',
          border: '1px solid #2A2A30',
          borderRadius: '14px !important',
          '&:before': { display: 'none' },
          overflow: 'hidden',
        }}
      >
        <AccordionSummary
          sx={{
            px: 2.5,
            py: 0.5,
            minHeight: 52,
            '& .MuiAccordionSummary-content': { my: 0 },
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <AlignJustify size={17} color="#A1A1AA" />
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                Listing Details
              </Typography>
            </Stack>
            <ChevronRight
              size={18}
              color="#A1A1AA"
              style={{
                transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </Stack>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            px: 2.5,
            pt: 0,
            pb: 2.5,
            borderTop: '1px solid #2A2A30',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: '0px 24px',
              mt: 2,
            }}
          >
            {facts.map(({ label, value }) => (
              <Stack
                key={label}
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                sx={{
                  py: 1.1,
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <Typography sx={{ fontSize: '0.82rem', color: '#71717A', fontWeight: 500, flexShrink: 0, mr: 1 }}>
                  {label}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700, textAlign: 'right' }}>
                  {value}
                </Typography>
              </Stack>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default SubscriptionDetails;
