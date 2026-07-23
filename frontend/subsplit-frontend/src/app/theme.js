import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d0e11',
      paper: '#14161a',
    },
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0d9488',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },

  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.035em' },
    h2: { fontWeight: 900, letterSpacing: '-0.03em' },
    h3: { fontWeight: 900, letterSpacing: '-0.025em' },
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 800, letterSpacing: '-0.015em' },
    h6: { fontWeight: 800, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 700 },
  },

  shape: {
    borderRadius: 16,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0d0e11',
          color: '#f3f4f6',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          scrollbarColor: '#252830 #0d0e11',
          '& ::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '& ::-webkit-scrollbar-track': {
            background: '#0d0e11',
          },
          '& ::-webkit-scrollbar-thumb': {
            background: '#252830',
            borderRadius: '4px',
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 22px',
          fontSize: '0.9rem',
          boxShadow: 'none',
          transition: 'transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 'none',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          color: '#f3f4f6',
          '&:hover': {
            borderColor: '#2563eb',
            background: 'rgba(37, 99, 235, 0.08)',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#14161a',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#14161a',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
          transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            borderColor: '#2563eb',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1c1e24',
            borderRadius: 12,
            color: '#f3f4f6',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: '#2563eb',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2563eb',
              borderWidth: '1.5px',
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
        },
      },
    },
  },
});

export default theme;
