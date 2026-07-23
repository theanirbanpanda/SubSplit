import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  Stack,
} from '@mui/material';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Rahul Sharma',
    city: 'Pune',
    initials: 'RS',
    avatarBg: '#2563eb',
    rating: 5,
    review: 'Saved more than ₹7,000 this year using SubSplit. Verified hosts and super smooth access confirmation.',
  },
  {
    name: 'Priya Nair',
    city: 'Bengaluru',
    initials: 'PN',
    avatarBg: '#7c3aed',
    rating: 5,
    review: 'Much safer than random Telegram groups. The escrow protection gives complete peace of mind before paying.',
  },
  {
    name: 'Aman Verma',
    city: 'Delhi',
    initials: 'AV',
    avatarBg: '#16a34a',
    rating: 5,
    review: 'Clean UI, verified hosts and hassle-free experience. Joined a ChatGPT Plus group within 5 minutes.',
  },
];

function Testimonials() {
  return (
    <Box
      component="section"
      sx={{ py: { xs: 8, md: 10 }, background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Typography
            variant="overline"
            sx={{ color: '#2563eb', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.72rem' }}
          >
            User Reviews
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              color: '#0f172a',
              mt: 0.5,
              fontSize: { xs: '1.6rem', md: '2.1rem' },
              letterSpacing: '-0.03em',
            }}
          >
            Loved by Smart Savers
          </Typography>
          <Typography
            sx={{
              color: '#64748b',
              mt: 1.5,
              fontSize: '1rem',
              maxWidth: 460,
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            See how thousands of students and professionals across India save on their daily subscriptions.
          </Typography>
        </Box>

        {/* Testimonials Grid */}
        <Grid container spacing={3}>
          {TESTIMONIALS.map((t) => (
            <Grid item xs={12} md={4} key={t.name}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 16px rgba(15, 23, 42, 0.04)',
                  transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 36px rgba(37, 99, 235, 0.1)',
                  },
                }}
              >
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Stack direction="row" spacing={0.3}>
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </Stack>
                    <Quote size={20} color="#cbd5e1" />
                  </Stack>
                  <Typography
                    variant="body1"
                    sx={{ color: '#334155', lineHeight: 1.7, fontSize: '0.92rem', fontStyle: 'italic', mb: 3 }}
                  >
                    "{t.review}"
                  </Typography>
                </Box>

                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar
                    sx={{
                      bg: t.avatarBg,
                      bgcolor: t.avatarBg,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      width: 40,
                      height: 40,
                    }}
                  >
                    {t.initials}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', lineHeight: 1.2 }}>
                      {t.name}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.78rem' }}>
                      {t.city}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Testimonials;
