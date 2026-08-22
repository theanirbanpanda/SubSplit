import React, { useState } from 'react';
import { Box, Typography, Container, Breadcrumbs, Link as MuiLink, TextField, InputAdornment, Accordion, AccordionSummary, AccordionDetails, Paper, Button } from '@mui/material';
import { ChevronRight, Search, ChevronDown, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HELP_CATEGORIES = [
  {
    title: 'Getting Started',
    faqs: [
      { q: 'What is SubSplit?', a: 'SubSplit is a subscription-sharing marketplace where you can share the cost of eligible multi-user subscriptions with others.' },
      { q: 'How does subscription sharing work?', a: 'Hosts list their available subscription seats on the marketplace. Buyers can browse, choose a share, and securely pay. The host then provides access via the supported sharing method.' },
      { q: 'How do I buy a share?', a: 'Browse the marketplace, select a listing, and click "Request Seat". You will pay the specified price into escrow, and once the host fulfills your access, the transaction completes.' },
      { q: 'How do I become a Host?', a: 'Sign up, complete any required verification, and navigate to the Host Center. From there, you can list an eligible subscription from our catalog.' }
    ]
  },
  {
    title: 'Buying',
    faqs: [
      { q: 'How do I purchase a seat?', a: 'Find a listing you like and use the checkout process. Your payment is held securely in escrow until access is confirmed.' },
      { q: 'What happens after I buy?', a: 'The host receives your request and has a set time window to fulfill it. You will be notified once access is granted.' },
      { q: 'How do I receive access?', a: 'Access is provided via official methods such as family invitations, workspace invites, or account allocations, depending on the subscription type. We do not use raw password sharing as the primary method.' },
      { q: 'Where can I see my active shares?', a: 'You can view all your active subscriptions and their details in your Dashboard under the "My Subscriptions" tab.' },
      { q: 'What happens if the host does not fulfill my request?', a: 'If the host fails to fulfill the request within the allotted time, your payment is automatically refunded from escrow.' },
      { q: 'Can I cancel a purchase?', a: 'You can cancel a request before the host accepts it. Once fulfilled, cancellations are subject to our refund policy and the specific listing terms.' }
    ]
  },
  {
    title: 'Hosting',
    faqs: [
      { q: 'How do I create a listing?', a: 'Go to the Host Center and click "Create Listing". Select the product from the catalog, set your price within the allowed benchmark, and submit for review if required.' },
      { q: 'Why must I select a catalog product?', a: 'We use a predefined catalog to ensure quality, enforce pricing benchmarks, and clearly define the expected fulfillment method for buyers.' },
      { q: 'What verification is required?', a: 'Hosts may be required to complete KYC/identity verification and provide proof of subscription ownership to ensure a trusted marketplace.' },
      { q: 'How is my listing price validated?', a: 'Listing prices are checked against catalog benchmarks. Prices outside the supported range may be rejected to ensure fair pricing.' },
      { q: 'How are available seats calculated?', a: 'Seats are based on the capacity defined by the official subscription plan minus the seats you are personally using or have already shared.' },
      { q: 'How do I accept a buyer request?', a: 'You will receive a notification. Go to your Host Center, review the request, and click "Accept". You must then fulfill the access.' },
      { q: 'How do I fulfill a request?', a: 'Use the official sharing method supported by the subscription (e.g., sending an invite link). Confirm fulfillment in the Host Center once done.' },
      { q: 'How do I pause a listing?', a: 'You can pause or deactivate an active listing from the Host Center at any time, preventing new requests.' },
      { q: 'How do I receive my earnings?', a: 'Once fulfillment is confirmed and the escrow period ends, earnings are added to your SubSplit Wallet, which you can withdraw to your bank account.' }
    ]
  },
  {
    title: 'Payments & Escrow',
    faqs: [
      { q: 'How does payment work?', a: 'Buyers pay upfront via UPI or cards. The funds are held in escrow.' },
      { q: 'What is escrow?', a: 'Escrow is a secure holding account. It protects the buyer by ensuring they get access before the host is paid, and protects the host by ensuring the buyer has funds.' },
      { q: 'When does the host receive payment?', a: 'The host receives payment in their wallet after the applicable transaction conditions and escrow period are met (usually after access is confirmed).' },
      { q: 'What happens during a refund?', a: 'Refunds are returned to the buyer’s original payment method or wallet, depending on the status of the transaction.' },
      { q: 'What happens if a transaction is disputed?', a: 'Our admin team will review the dispute, check fulfillment evidence, and resolve it according to our Terms of Service.' }
    ]
  },
  {
    title: 'Verification & Safety',
    faqs: [
      { q: 'Why is host verification required?', a: 'Verification helps establish account authenticity and prevents fraud, creating a safer environment for buyers.' },
      { q: 'What documents may be required?', a: 'We may require government-issued ID (KYC) and proof of purchase or billing for the subscription you wish to list.' },
      { q: 'How are subscription listings verified?', a: 'Listings may require admin approval and evidence of subscription validity before becoming active.' },
      { q: 'What does the verified badge mean?', a: 'It means the user has completed our identity verification process. It does not guarantee every aspect of a specific subscription.' },
      { q: 'How should I report suspicious activity?', a: 'Use the "Report" button on a listing or user profile, or contact Support immediately if you notice suspicious behavior.' }
    ]
  },
  {
    title: 'Account',
    faqs: [
      { q: 'How do I update my profile?', a: 'Go to your Profile settings from the top right dropdown menu to update your details and picture.' },
      { q: 'How do I manage notifications?', a: 'You can adjust your email and push notification preferences in your Account Settings.' },
      { q: 'How do I change my password?', a: 'Use the "Change Password" option in your Profile Settings.' },
      { q: 'How do I deactivate my account?', a: 'You can request account deactivation from your settings or by contacting Support.' }
    ]
  }
];

function HelpCentre() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPanel, setExpandedPanel] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const filteredCategories = HELP_CATEGORIES.map(category => {
    const filteredFaqs = category.faqs.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...category, faqs: filteredFaqs };
  }).filter(category => category.faqs.length > 0);

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
            Help Centre
          </Typography>
        </Breadcrumbs>

        <Box sx={{ mb: 8, maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800, color: '#ffffff', mb: 3, letterSpacing: '-0.02em' }}>
            Help Centre
          </Typography>
          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: '#9ca3af', lineHeight: 1.6, mb: 5 }}>
            Find answers about buying, hosting, payments and sharing.
          </Typography>
          
          <TextField
            fullWidth
            placeholder="Search SubSplit Help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color="#9ca3af" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: '#111114',
                color: '#ffffff',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '1.1rem',
                height: 56,
                '& fieldset': { border: 'none' },
                '&:hover': { border: '1px solid rgba(34,197,94,0.4)' },
                '&.Mui-focused': { border: '1px solid #22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.1)' }
              }
            }}
          />
        </Box>

        <Box sx={{ maxWidth: '800px', mx: 'auto', mb: 8 }}>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, catIndex) => (
              <Box key={catIndex} sx={{ mb: 6 }}>
                <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', mb: 3 }}>
                  {category.title}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {category.faqs.map((faq, faqIndex) => {
                    const panelId = `panel-${catIndex}-${faqIndex}`;
                    return (
                      <Accordion 
                        key={faqIndex}
                        expanded={expandedPanel === panelId}
                        onChange={handleAccordionChange(panelId)}
                        sx={{
                          background: '#111114',
                          color: '#ffffff',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px !important',
                          '&:before': { display: 'none' },
                          '&.Mui-expanded': {
                            borderColor: 'rgba(34,197,94,0.3)',
                            background: 'rgba(34,197,94,0.02)'
                          }
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ChevronDown color="#9ca3af" />}
                          sx={{ 
                            py: 1, 
                            px: 3,
                            '& .MuiAccordionSummary-content': { my: 1.5 },
                            '&.Mui-expanded': { minHeight: 48, '& .MuiAccordionSummary-content': { my: 1.5 } }
                          }}
                        >
                          <Typography sx={{ fontSize: '1.05rem', fontWeight: 600 }}>{faq.q}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                          <Typography sx={{ color: '#d1d5db', lineHeight: 1.7, fontSize: '1rem' }}>
                            {faq.a}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Box>
              </Box>
            ))
          ) : (
            <Paper sx={{ p: 6, textAlign: 'center', background: '#111114', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
              <Typography sx={{ color: '#ffffff', fontSize: '1.1rem', mb: 1 }}>No results found for "{searchQuery}"</Typography>
              <Typography sx={{ color: '#9ca3af' }}>Try adjusting your search terms.</Typography>
            </Paper>
          )}
        </Box>

        <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center', py: 6, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', mb: 3 }}>
            Still need help?
          </Typography>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/contact')}
            startIcon={<MessageSquare size={18} />}
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
            Contact Support
          </Button>
        </Box>

      </Container>
    </Box>
  );
}

export default HelpCentre;
