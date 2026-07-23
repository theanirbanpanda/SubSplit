import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@mui/material';
import { Menu as MenuIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Marketplace', href: '#marketplace' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Become a Host', href: '#become-a-host' },
  { label: 'Pricing', href: '#pricing' },
];

function PublicNavbar() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 40,
  });

  const handleNavClick = (href, label) => {
    setDrawerOpen(false);
    if (label === 'Marketplace') {
      navigate('/app/marketplace');
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled ? 'rgba(9, 9, 11, 0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid #2A2A30' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.5)' : 'none',
          transition: 'all 0.25s ease',
          color: '#ffffff',
        }}
      >
        <Box
          sx={{
            width: '92%',
            maxWidth: '1440px',
            mx: 'auto',
          }}
        >
          <Toolbar disableGutters sx={{ height: { xs: 64, md: 76 }, gap: 2 }}>
            {/* ── Left: Pure Typographic Startup Wordmark ── */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 'auto' }}
              onClick={() => navigate('/')}
              role="link"
              aria-label="SubSplit home"
            >
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: '1.4rem',
                  color: '#ffffff',
                  letterSpacing: '-0.04em',
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                Sub
                <Box component="span" sx={{ color: '#3b82f6' }}>
                  Split
                </Box>
              </Typography>
            </Box>

            {/* ── Center: Desktop Nav Links ── */}
            <Box
              component="nav"
              aria-label="Primary navigation"
              sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}
            >
              {NAV_LINKS.map(({ label, href }) => (
                <Button
                  key={label}
                  onClick={() => handleNavClick(href, label)}
                  sx={{
                    color: '#A1A1AA',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    textTransform: 'none',
                    px: 2,
                    py: 0.8,
                    borderRadius: '8px',
                    '&:hover': {
                      color: '#ffffff',
                      background: 'rgba(255, 255, 255, 0.05)',
                    },
                    transition: 'all 0.15s ease',
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>

            {/* ── Right: Auth Buttons ── */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <Button
                variant="text"
                onClick={() => navigate('/auth')}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: '#A1A1AA',
                  textTransform: 'none',
                  px: 2,
                  borderRadius: '8px',
                  '&:hover': { color: '#ffffff', background: 'rgba(255,255,255,0.05)' },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/app/marketplace')}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textTransform: 'none',
                  px: 2.75,
                  py: 0.9,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                    boxShadow: '0 6px 24px rgba(37, 99, 235, 0.45)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Start Saving
              </Button>
            </Box>

            {/* ── Mobile Hamburger ── */}
            <IconButton
              aria-label="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#ffffff', ml: 'auto' }}
            >
              <MenuIcon size={24} />
            </IconButton>
          </Toolbar>
        </Box>
      </AppBar>

      {/* ── Mobile Drawer ── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 290,
            pt: 2.5,
            pb: 3,
            background: '#111114',
            color: '#ffffff',
            borderLeft: '1px solid #2A2A30',
          },
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, mb: 1 }}
        >
          <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', color: '#ffffff', letterSpacing: '-0.04em' }}>
            Sub<Box component="span" sx={{ color: '#3b82f6' }}>Split</Box>
          </Typography>
          <IconButton
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            size="small"
            sx={{ color: '#A1A1AA' }}
          >
            <X size={20} />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 1, borderColor: '#2A2A30' }} />

        <List sx={{ px: 1.5 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(href, label)}
                sx={{
                  borderRadius: '9px',
                  mb: 0.5,
                  '&:hover': { background: '#18181C', color: '#3b82f6' },
                }}
              >
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.92rem', color: '#A1A1AA' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2, borderColor: '#2A2A30' }} />

        <Box sx={{ px: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => { setDrawerOpen(false); navigate('/auth'); }}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '11px',
              borderColor: '#2A2A30',
              color: '#ffffff',
              py: 1.1,
              '&:hover': { borderColor: '#3b82f6', background: 'rgba(59,130,246,0.1)' },
            }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => { setDrawerOpen(false); navigate('/app/marketplace'); }}
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '11px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
              py: 1.1,
            }}
          >
            Start Saving
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default PublicNavbar;
