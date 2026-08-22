import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LegalPageLayout({ title, subtitle, lastUpdated, sections }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');

  // Handle scroll spy using capturing scroll listener to catch nested scrolls
  useEffect(() => {
    const handleScroll = () => {
      let currentActiveId = sections[0]?.id;
      
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Trigger when the section's top crosses the 150px threshold from the viewport top
          if (rect.top <= 150) {
            currentActiveId = s.id;
          }
        }
      }
      
      setActiveSection((prev) => (prev !== currentActiveId ? currentActiveId : prev));
    };

    // Use capture: true to ensure we catch scroll events even if a child container is scrolling
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    
    // Initial check
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener('scroll', handleScroll, { capture: true });
  }, [sections]);

  // Handle initial hash routing
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection(id);
        }
      }, 100);
    }
  }, []);

  const handleNavClick = (id) => {
    setActiveSection(id); // Optimistically set active section for immediate color change
    const el = document.getElementById(id);
    if (el) {
      // Use scrollIntoView which natively handles any scroll container
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
    }
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
            {title}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ mb: 6, maxWidth: '800px' }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 800, color: '#ffffff', mb: 2, letterSpacing: '-0.02em' }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: '#9ca3af', lineHeight: 1.6, mb: 3 }}>
            {subtitle}
          </Typography>
          {lastUpdated && (
            <Typography sx={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
              Last updated: {lastUpdated}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 8 }, alignItems: 'flex-start' }}>
          
          {/* Left Sidebar Navigation */}
          <Box 
            component="nav" 
            sx={{ 
              width: { xs: '100%', md: '280px' }, 
              flexShrink: 0, 
              position: { md: 'sticky' }, 
              top: { md: 100 },
              maxHeight: { md: 'calc(100vh - 120px)' },
              overflowY: 'auto',
              pb: 4,
              display: { xs: 'none', md: 'block' },
              // Custom scrollbar for webkit
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '4px' },
              '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255,255,255,0.2)' }
            }}
          >
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 3, pl: 3 }}>
              On this page
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              borderLeft: '1px solid rgba(255,255,255,0.08)' 
            }}>
              {sections.map((section) => (
                <Typography
                  key={section.id}
                  onClick={() => handleNavClick(section.id)}
                  sx={{
                    py: 1,
                    pl: 3,
                    ml: '-1px', // Pull it back to overlap the borderLeft of the parent box
                    borderLeft: activeSection === section.id ? '2px solid #22c55e' : '2px solid transparent',
                    fontSize: '0.9rem',
                    fontWeight: activeSection === section.id ? 600 : 400,
                    color: activeSection === section.id ? '#22c55e' : '#9ca3af',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: activeSection === section.id ? '#22c55e' : '#ffffff',
                      borderLeft: activeSection === section.id ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.2)'
                    }
                  }}
                >
                  {section.title}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ flexGrow: 1, maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sections.map((section) => (
              <Box key={section.id} id={section.id} sx={{ scrollMarginTop: '100px' }}>
                <Typography variant="h2" sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', mb: 3 }}>
                  {section.title}
                </Typography>
                <Box sx={{ 
                  color: '#d1d5db', 
                  fontSize: '1.05rem', 
                  lineHeight: 1.7,
                  '& p': { mb: 2 },
                  '& ul': { pl: 3, mb: 2 },
                  '& li': { mb: 1 }
                }}>
                  {section.content}
                </Box>
              </Box>
            ))}
          </Box>

        </Box>
      </Container>
    </Box>
  );
}

export default LegalPageLayout;
