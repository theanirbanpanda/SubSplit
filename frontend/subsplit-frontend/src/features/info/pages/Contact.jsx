import React, { useState } from 'react';
import { Box, Typography, Container, Breadcrumbs, Link as MuiLink, Grid, Paper, Button, TextField, MenuItem } from '@mui/material';
import { ChevronRight, ShoppingBag, Store, CreditCard, HelpCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'support@subsplit.in';

const ISSUE_TYPES = [
  'Account',
  'Purchase',
  'Access/Fulfillment',
  'Host Listing',
  'Verification',
  'Payment',
  'Refund',
  'Other'
];

function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: '',
    orderId: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    alert('Thank you! Your request has been submitted to ' + SUPPORT_EMAIL);
    setFormData({ name: '', email: '', issueType: '', orderId: '', message: '' });
  };

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
            Contact Support
          </Typography>
        </Breadcrumbs>

        <Box sx={{ mb: 8, maxWidth: '800px' }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800, color: '#ffffff', mb: 2, letterSpacing: '-0.02em' }}>
            Contact SubSplit
          </Typography>
          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: '#9ca3af', lineHeight: 1.6 }}>
            Need help with a purchase, listing, payment or account? We're here to help.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {[
            { 
              title: 'Buyer Support', 
              icon: <ShoppingBag size={24} color="#3b82f6" />, 
              desc: ['Purchase issues', 'Access not received', 'Subscription access problems', 'Cancellation/refund questions'],
              cta: 'Get Buyer Support',
              color: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 0.2)'
            },
            { 
              title: 'Host Support', 
              icon: <Store size={24} color="#22c55e" />, 
              desc: ['Listing issues', 'Verification', 'Buyer requests', 'Fulfillment problems', 'Earnings'],
              cta: 'Get Host Support',
              color: 'rgba(34, 197, 94, 0.1)',
              borderColor: 'rgba(34, 197, 94, 0.2)'
            },
            { 
              title: 'Payment Support', 
              icon: <CreditCard size={24} color="#eab308" />, 
              desc: ['Payment issues', 'Escrow/transaction status', 'Wallet/settlement questions', 'Refunds'],
              cta: 'Payment Support',
              color: 'rgba(234, 179, 8, 0.1)',
              borderColor: 'rgba(234, 179, 8, 0.2)'
            },
            { 
              title: 'General Enquiries', 
              icon: <HelpCircle size={24} color="#a855f7" />, 
              desc: ['Partnerships', 'Product feedback', 'Business enquiries', 'Catalog requests'],
              cta: 'Contact SubSplit',
              color: 'rgba(168, 85, 247, 0.1)',
              borderColor: 'rgba(168, 85, 247, 0.2)'
            }
          ].map((cat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ p: 3, height: '100%', background: '#111114', border: `1px solid ${cat.borderColor}`, borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  {cat.icon}
                </Box>
                <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', mb: 2 }}>
                  {cat.title}
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0, mb: 3, color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, '& li': { mb: 0.5 }, flexGrow: 1 }}>
                  {cat.desc.map((item, i) => <li key={i}>{item}</li>)}
                </Box>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => { document.getElementById('support-form').scrollIntoView({ behavior: 'smooth' }) }}
                  sx={{ borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', textTransform: 'none', '&:hover': { background: 'rgba(255,255,255,0.05)' } }}
                >
                  {cat.cta}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Contact Form Area */}
        <Box id="support-form" sx={{ maxWidth: '700px', mx: 'auto', mt: 8, scrollMarginTop: '100px' }}>
          <Paper sx={{ p: { xs: 3, md: 5 }, background: '#111114', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px' }}>
            <Typography variant="h3" sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', mb: 1 }}>
              Submit a Request
            </Typography>
            <Typography sx={{ color: '#9ca3af', fontSize: '0.95rem', mb: 4 }}>
              Fill out the form below. Typical response time: within 1 business day.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    variant="outlined" 
                    sx={inputStyles} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Email Address" 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    variant="outlined" 
                    sx={inputStyles} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    select 
                    fullWidth 
                    label="Issue Type" 
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleChange}
                    required 
                    variant="outlined" 
                    sx={inputStyles}
                  >
                    {ISSUE_TYPES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Order/Listing ID (Optional)" 
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    variant="outlined" 
                    sx={inputStyles} 
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={5} 
                    label="Message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required 
                    variant="outlined" 
                    sx={inputStyles} 
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ mb: 2, background: 'rgba(255,255,255,0.05)', color: '#ffffff', textTransform: 'none', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
                  >
                    Attach File (Optional)
                    <input type="file" hidden />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
                    fullWidth 
                    endIcon={<Send size={18} />}
                    sx={{ background: '#22c55e', color: '#000000', fontWeight: 700, py: 1.5, borderRadius: '12px', textTransform: 'none', fontSize: '1.05rem', '&:hover': { background: '#16a34a' } }}
                  >
                    Submit Request
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>

      </Container>
    </Box>
  );
}

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
    '&.Mui-focused fieldset': { borderColor: '#22c55e' },
  },
  '& .MuiInputLabel-root': { color: '#9ca3af' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#22c55e' },
  '& .MuiSvgIcon-root': { color: '#9ca3af' },
};

export default Contact;
