import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'Is subscription sharing legal?',
    answer:
      'Yes, SubSplit facilitates family and multi-seat slot sharing strictly within the terms allowed by platform family/multi-user tier plans. Hosts list slots that they legitimately own and pay for.',
  },
  {
    question: 'How does escrow work?',
    answer:
      'When you join a group, your payment is safely held in SubSplit escrow. The funds are only transferred to the host after you verify credentials and confirm active access.',
  },
  {
    question: 'What if I lose access?',
    answer:
      'If your access is revoked or disrupted during your active subscription period, our automated dispute resolution system will attempt host re-verification or instantly issue a pro-rata refund.',
  },
  {
    question: 'How are hosts verified?',
    answer:
      'All hosts undergo strict KYC identity verification and automated AI proof-of-ownership checks on their active subscription before their listings are published.',
  },
  {
    question: 'Can I earn by hosting subscriptions?',
    answer:
      'Yes! If you own a multi-screen or family subscription plan (like Netflix Premium, Spotify Family, or Canva Pro), you can list your unused slots on SubSplit and offset up to 80% of your bill.',
  },
  {
    question: 'Which subscriptions are supported?',
    answer:
      'SubSplit supports popular streaming, productivity, and AI tools including Netflix, Spotify, YouTube Premium, ChatGPT Plus, Canva Pro, Microsoft 365, Amazon Prime, Apple Music, and more.',
  },
  {
    question: 'How quickly do I get access?',
    answer:
      'Access credentials or invite links are shared securely through your dashboard immediately upon completing checkout and host automated verification.',
  },
  {
    question: 'Is my payment secure?',
    answer:
      '100%. All transactions are processed using industry-grade encrypted payment gateways with full escrow protection. We never store raw payment credentials.',
  },
];

function FAQSection() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      id="faq"
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
            Got Questions?
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
            Frequently Asked Questions
          </Typography>
          <Typography
            sx={{
              color: '#A1A1AA',
              mt: 1,
              fontSize: '0.95rem',
              maxWidth: 460,
              mx: 'auto',
              lineHeight: 1.5,
            }}
          >
            Everything you need to know about SubSplit, escrow safety, and subscription sharing.
          </Typography>
        </Box>

        {/* Accordions */}
        <Box sx={{ maxWidth: 840, mx: 'auto' }}>
          {FAQS.map((faq, index) => {
            const panelId = `panel${index}`;
            return (
              <Accordion
                key={faq.question}
                expanded={expanded === panelId}
                onChange={handleChange(panelId)}
                elevation={0}
                sx={{
                  mb: 1.5,
                  borderRadius: '14px !important',
                  border: '1px solid #2A2A30',
                  background: '#111114',
                  color: '#ffffff',
                  '&:before': { display: 'none' },
                  boxShadow: expanded === panelId ? '0 4px 20px rgba(59,130,246,0.15)' : 'none',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                }}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown size={20} color={expanded === panelId ? '#3b82f6' : '#A1A1AA'} />}
                  sx={{
                    px: 3,
                    py: 1,
                    '& .MuiAccordionSummary-content': { my: 1 },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.98rem',
                      color: expanded === panelId ? '#3b82f6' : '#ffffff',
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 2.5, pt: 0 }}>
                  <Typography sx={{ color: '#A1A1AA', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default FAQSection;
