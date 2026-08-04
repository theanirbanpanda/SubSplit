import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#09090b',
      paper: '#14161e',
    },
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#22c55e',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    success: {
      main: '#22c55e',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
      disabled: '#475569',
    },
    divider: 'rgba(255, 255, 255, 0.07)',
  },

  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    h1: { fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.1 },
    h2: { fontWeight: 900, letterSpacing: '-0.03em',  lineHeight: 1.15 },
    h3: { fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.2 },
    h4: { fontWeight: 800, letterSpacing: '-0.02em',  lineHeight: 1.25 },
    h5: { fontWeight: 800, letterSpacing: '-0.015em' },
    h6: { fontWeight: 800, letterSpacing: '-0.01em'  },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0' },
    body2: { color: '#94a3b8' },
    caption: { color: '#64748b', fontWeight: 500 },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    // ─── CSS Baseline ─────────────────────────────────────────────────────────
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#09090b',
          color: '#f1f5f9',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        },
      },
    },

    // ─── Button ───────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { disableRipple: false, disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '9px 20px',
          fontSize: '0.875rem',
          fontWeight: 700,
          boxShadow: 'none',
          transition: 'transform 140ms ease, background 140ms ease, box-shadow 200ms ease, border-color 140ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 'none',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        sizeSmall: {
          padding: '6px 14px',
          fontSize: '0.8125rem',
          borderRadius: 10,
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '0.95rem',
          borderRadius: 14,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.45)',
          },
        },
        containedSuccess: {
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.12)',
          color: '#f1f5f9',
          '&:hover': {
            borderColor: '#3b82f6',
            background: 'rgba(59, 130, 246, 0.07)',
          },
        },
        text: {
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },

    // ─── Paper ────────────────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#14161e',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: 20,
        },
      },
    },

    // ─── Card ─────────────────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#14161e',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: 20,
          transition: 'transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.55)',
          },
        },
      },
    },

    // ─── TextField ────────────────────────────────────────────────────────────
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1c1e28',
            borderRadius: 12,
            color: '#f1f5f9',
            fontSize: '0.875rem',
            transition: 'background 140ms ease',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.09)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
            '&.Mui-focused': { backgroundColor: '#1e2030' },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6',
              borderWidth: '1.5px',
            },
          },
          '& .MuiInputLabel-root': { color: '#64748b', fontSize: '0.875rem' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#60a5fa' },
        },
      },
    },

    // ─── Select ───────────────────────────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.09)',
          },
        },
      },
    },

    // ─── Menu ─────────────────────────────────────────────────────────────────
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1c1e28',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 14,
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.7)',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: '8px 16px',
          borderRadius: 8,
          margin: '1px 6px',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.06)' },
          '&.Mui-selected': {
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.18)' },
          },
        },
      },
    },

    // ─── Chip ─────────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
          fontSize: '0.75rem',
          height: 26,
        },
        sizeSmall: { height: 22, fontSize: '0.7rem' },
      },
    },

    // ─── Tabs ─────────────────────────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            height: 2,
            borderRadius: 2,
          },
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '0.8375rem',
          fontWeight: 600,
          textTransform: 'none',
          minHeight: 44,
          padding: '8px 16px',
          '&.Mui-selected': { fontWeight: 800 },
        },
      },
    },

    // ─── Table ────────────────────────────────────────────────────────────────
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: '#1c1e28',
            fontWeight: 700,
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: '#64748b',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '10px 16px',
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.06)',
          padding: '12px 16px',
          fontSize: '0.875rem',
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.025)' },
        },
      },
    },

    // ─── Dialog ───────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#14161e',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          borderRadius: 22,
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.8)',
        },
      },
    },

    // ─── Tooltip ──────────────────────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1e2030',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          fontSize: '0.78rem',
          fontWeight: 600,
          padding: '6px 12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        },
        arrow: { color: '#1e2030' },
      },
    },

    // ─── Snackbar ─────────────────────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          fontWeight: 600,
          fontSize: '0.875rem',
        },
        filled: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        },
      },
    },

    // ─── Avatar ───────────────────────────────────────────────────────────────
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 800,
        },
      },
    },

    // ─── Skeleton ─────────────────────────────────────────────────────────────
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.06)',
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
          },
        },
      },
    },
  },
});

export default theme;
