import React from 'react';
import { Box, Typography, Container, Breadcrumbs, Link as MuiLink, Grid, Paper, Button } from '@mui/material';
import { ChevronRight, Search, Handshake, CheckCircle2, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AboutUs() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Breadcrumbs 
          separator={<ChevronRight size={14} color="#6b7280" />} 
          aria-label="breadcrumb"
          sx={{ mb: 4, color: '#9ca3af', fontSize: '0.875rem' }}
        >
          <MuiLink 
            component="button" 
            variant="body2" 
            onClick={() => navigate('/')} 
            sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#ffffff' } }}
          >
            Home
          </MuiLink>
          <Typography color="#ffffff" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            About Us
          </Typography>
        </Breadcrumbs>

        <Box sx={{ mb: 8, maxWidth: '800px' }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800, color: '#ffffff', mb: 2, letterSpacing: '-0.02em' }}>
            About SubSplit
          </Typography>
          <Typography sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, color: '#22c55e', fontWeight: 600, mb: 2 }}>
            Share the subscriptions you already have. Access the ones you need. Pay only for your share.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 8, md: 12 } }}>
          
          {/* Section 1 & 2: What is SubSplit & The Problem */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', mb: 3 }}>
                What is SubSplit?
              </Typography>
              <Typography sx={{ color: '#d1d5db', fontSize: '1.1rem', lineHeight: 1.7 }}>
                SubSplit is a marketplace designed to help people access eligible shared subscription plans without paying for an entire unused plan. We connect users who have spare capacity on their existing subscriptions with those looking for affordable, shared access.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', mb: 3 }}>
                The Problem
              </Typography>
              <Typography sx={{ color: '#d1d5db', fontSize: '1.1rem', lineHeight: 1.7 }}>
                Many subscription plans support multiple members, seats, or devices. However, individual users often use only one portion of that capacity, leaving the rest unused. Hosts have unused capacity, and buyers want affordable access. SubSplit connects both sides through a structured, secure marketplace.
              </Typography>
            </Grid>
          </Grid>

          {/* Section 3: How SubSplit Works (4-step visual) */}
          <Box>
            <Typography variant="h2" sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', mb: 4, textAlign: 'center' }}>
              How SubSplit Works
            </Typography>
            <Grid container spacing={3}>
              {[
                { title: 'Browse', desc: 'Find the subscription you need from our verified catalog.', icon: <Search size={24} color="#22c55e" /> },
                { title: 'Choose a Share', desc: 'Select an available seat with pricing that fits your budget.', icon: <CheckCircle2 size={24} color="#22c55e" /> },
                { title: 'Request a Seat', desc: 'Send a request and secure your payment in escrow.', icon: <Handshake size={24} color="#22c55e" /> },
                { title: 'Get Access', desc: 'The host fulfills your access via the supported sharing method.', icon: <ArrowRight size={24} color="#22c55e" /> }
              ].map((step, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper sx={{ 
                    p: 4, 
                    height: '100%', 
                    background: '#111114', 
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', borderColor: 'rgba(34, 197, 94, 0.3)' }
                  }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                      {step.icon}
                    </Box>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', mb: 1 }}>
                      {index + 1}. {step.title}
                    </Typography>
                    <Typography sx={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {step.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Section 4: Built Around Trust */}
          <Box sx={{ background: '#111114', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', p: { xs: 4, md: 6 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <ShieldCheck size={32} color="#22c55e" />
              <Typography variant="h2" sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>
                Built Around Trust
              </Typography>
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box component="ul" sx={{ pl: 2, m: 0, color: '#d1d5db', fontSize: '1.1rem', lineHeight: 1.8, '& li': { mb: 1.5 } }}>
                  <li><strong>Verified host profiles:</strong> We check who is hosting.</li>
                  <li><strong>Verified subscription info:</strong> Proof of ownership may be required.</li>
                  <li><strong>Admin-reviewed catalog:</strong> Ensuring quality and fair pricing.</li>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box component="ul" sx={{ pl: 2, m: 0, color: '#d1d5db', fontSize: '1.1rem', lineHeight: 1.8, '& li': { mb: 1.5 } }}>
                  <li><strong>Listing validation:</strong> Preventing invalid or duplicate shares.</li>
                  <li><strong>Structured fulfillment:</strong> No raw password sharing (unless explicitly supported).</li>
                  <li><strong>Transaction protection:</strong> Escrow ensures safe payments.</li>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Section 5 & 6: For Hosts & For Buyers */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: { xs: 4, md: 5 }, height: '100%', background: 'linear-gradient(145deg, #111114 0%, #0a100d 100%)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '24px' }}>
                <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e', mb: 3 }}>
                  For Hosts
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0, color: '#d1d5db', fontSize: '1.05rem', lineHeight: 1.7, '& li': { mb: 1.5 } }}>
                  <li>Add eligible subscriptions from our catalog</li>
                  <li>List unused capacity and set a supported price</li>
                  <li>Respond to buyer requests easily</li>
                  <li>Fulfil access through supported sharing methods (e.g. family invite)</li>
                  <li>Track earnings and manage active shares in one place</li>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: { xs: 4, md: 5 }, height: '100%', background: 'linear-gradient(145deg, #111114 0%, #0d0f12 100%)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '24px' }}>
                <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6', mb: 3 }}>
                  For Buyers
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0, color: '#d1d5db', fontSize: '1.05rem', lineHeight: 1.7, '& li': { mb: 1.5 } }}>
                  <li>Browse verified listings safely</li>
                  <li>Compare prices and availability</li>
                  <li>Purchase an available seat or share with secure escrow</li>
                  <li>Receive access through the official fulfillment method</li>
                  <li>Track all your active subscriptions centrally</li>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Section 7: Our Principle & CTAs */}
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff', fontStyle: 'italic', mb: 6 }}>
              "Make subscription sharing simpler, more transparent and more trustworthy."
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/app/marketplace')}
                sx={{ 
                  background: '#22c55e', 
                  color: '#000000', 
                  fontWeight: 700, 
                  px: 4, 
                  py: 1.5, 
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': { background: '#16a34a' }
                }}
              >
                Explore Marketplace
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/auth')}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.2)', 
                  color: '#ffffff', 
                  fontWeight: 600, 
                  px: 4, 
                  py: 1.5, 
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': { borderColor: '#ffffff', background: 'rgba(255,255,255,0.05)' }
                }}
              >
                Become a Host
              </Button>
            </Box>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}

export default AboutUs;
