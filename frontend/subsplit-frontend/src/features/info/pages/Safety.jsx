import React from 'react';
import { Box, Typography, Container, Breadcrumbs, Link as MuiLink, Grid, Paper, Button } from '@mui/material';
import { ChevronRight, ShieldCheck, CheckCircle2, Lock, Scale, Tag, UserCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Safety() {
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
            Safety & Trust
          </Typography>
        </Breadcrumbs>

        <Box sx={{ mb: 8, maxWidth: '800px' }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800, color: '#ffffff', mb: 2, letterSpacing: '-0.02em' }}>
            Safety & Trust
          </Typography>
          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: '#22c55e', fontWeight: 600, mb: 2 }}>
            SubSplit is designed around verified users, structured listings and protected transactions.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {[
            {
              title: '1. Verified Hosts',
              icon: <UserCheck size={28} color="#3b82f6" />,
              content: (
                <Box component="ul" sx={{ pl: 2, m: 0, color: '#d1d5db', lineHeight: 1.7, '& li': { mb: 1 } }}>
                  <li>Hosts may be required to complete identity/KYC verification.</li>
                  <li>Verification status is shown on profiles where applicable.</li>
                  <li>Verification helps establish account authenticity but does not guarantee every aspect of a third-party subscription.</li>
                </Box>
              )
            },
            {
              title: '2. Verified Listings',
              icon: <CheckCircle2 size={28} color="#22c55e" />,
              content: (
                <Box component="ul" sx={{ pl: 2, m: 0, color: '#d1d5db', lineHeight: 1.7, '& li': { mb: 1 } }}>
                  <li>Hosts select products from the controlled SubSplit catalog.</li>
                  <li>Product, plan, capacity and supported sharing methods are predefined.</li>
                  <li>Hosts may need to provide subscription or ownership evidence.</li>
                  <li>Listings can require admin approval before publication.</li>
                </Box>
              )
            }
          ].map((section, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Paper sx={{ p: 4, height: '100%', background: '#111114', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  {section.icon}
                  <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff' }}>
                    {section.title}
                  </Typography>
                </Box>
                {section.content}
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 8, background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '16px', p: { xs: 4, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Lock size={28} color="#ef4444" />
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff' }}>
              3. No Credential Sharing
            </Typography>
          </Box>
          <Typography sx={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 600, mb: 3 }}>
            SubSplit does not rely on hosts sharing raw passwords or private credentials as the standard fulfillment method.
          </Typography>
          <Typography sx={{ color: '#d1d5db', fontSize: '1.05rem', mb: 2 }}>
            Access should use supported methods such as:
          </Typography>
          <Grid container spacing={2}>
            {['Family invitation', 'Team invitation', 'Workspace invitation', 'Licence assignment', 'Account/device allocation', 'Other configured fulfillment methods'].map((method, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                  <Typography sx={{ color: '#d1d5db' }}>{method}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {[
            {
              title: '4. Protected Transactions',
              icon: <Scale size={28} color="#eab308" />,
              content: (
                <>
                  <Typography sx={{ color: '#d1d5db', mb: 2, lineHeight: 1.7 }}>
                    SubSplit uses an escrow system to protect payments:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', color: '#9ca3af', fontSize: '0.9rem', fontWeight: 600 }}>
                    <span style={{ color: '#ffffff' }}>Buyer pays</span> ➔ 
                    <span>payment secured</span> ➔ 
                    <span>host accepts</span> ➔ 
                    <span>host fulfils</span> ➔ 
                    <span>access confirmed</span> ➔ 
                    <span style={{ color: '#22c55e' }}>transaction settled</span>
                  </Box>
                </>
              )
            },
            {
              title: '5. Pricing Protection',
              icon: <Tag size={28} color="#a855f7" />,
              content: (
                <Typography sx={{ color: '#d1d5db', lineHeight: 1.7 }}>
                  Listing prices are checked against the official catalog benchmark. Listings that fall outside the supported fair-pricing range may be rejected or blocked to ensure affordability and prevent price gouging.
                </Typography>
              )
            }
          ].map((section, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Paper sx={{ p: 4, height: '100%', background: '#111114', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  {section.icon}
                  <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff' }}>
                    {section.title}
                  </Typography>
                </Box>
                {section.content}
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4, borderLeft: '4px solid #3b82f6', background: 'linear-gradient(90deg, rgba(59,130,246,0.05) 0%, transparent 100%)' }}>
              <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', mb: 3 }}>
                6. Buyer Safety
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, color: '#d1d5db', lineHeight: 1.7, '& li': { mb: 1 } }}>
                <li>Verify listing details before purchasing.</li>
                <li>Check the specified fulfillment method.</li>
                <li>Never share unnecessary personal credentials.</li>
                <li>Keep all communication inside SubSplit.</li>
                <li>Report suspicious behaviour immediately.</li>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4, borderLeft: '4px solid #22c55e', background: 'linear-gradient(90deg, rgba(34,197,94,0.05) 0%, transparent 100%)' }}>
              <Typography variant="h2" sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', mb: 3 }}>
                7. Host Safety
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, color: '#d1d5db', lineHeight: 1.7, '& li': { mb: 1 } }}>
                <li>Only list subscriptions you are authorized to share.</li>
                <li>Never request unnecessary buyer credentials.</li>
                <li>Fulfil only through supported methods.</li>
                <li>Keep subscription information accurate.</li>
                <li>Maintain current renewal information.</li>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', py: 6, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', mb: 4 }}>
            8. Report a Problem
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 5 }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<AlertTriangle size={18} />}
              onClick={() => navigate('/contact')}
              sx={{ 
                background: '#ef4444', 
                color: '#ffffff', 
                fontWeight: 600, 
                px: 4, 
                py: 1.5, 
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1.05rem',
                '&:hover': { background: '#dc2626' }
              }}
            >
              Report a Listing
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<ShieldCheck size={18} />}
              onClick={() => navigate('/contact')}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.2)', 
                color: '#ffffff', 
                fontWeight: 600, 
                px: 4, 
                py: 1.5, 
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1.05rem',
                '&:hover': { borderColor: '#ffffff', background: 'rgba(255,255,255,0.05)' }
              }}
            >
              Contact Safety Support
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 3, background: '#111114', borderRadius: '12px', maxWidth: '600px', mx: 'auto', textAlign: 'left' }}>
            <AlertCircle size={24} color="#9ca3af" style={{ flexShrink: 0, marginTop: '2px' }} />
            <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <strong>Disclaimer:</strong> Verification and marketplace controls reduce risk but cannot guarantee uninterrupted access to a third-party subscription. SubSplit does not own the underlying services.
            </Typography>
          </Box>
        </Box>

      </Container>
    </Box>
  );
}

export default Safety;
