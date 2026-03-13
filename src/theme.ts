import { createTheme, alpha, type Components, type Theme } from '@mui/material/styles';

const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h5: { fontWeight: 700, letterSpacing: '-0.01em' },
  h6: { fontWeight: 600, letterSpacing: '-0.01em' },
};

const shape = { borderRadius: 16 };

function sharedComponents(mode: 'light' | 'dark'): Components<Theme> {
  const dark = mode === 'dark';
  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: dark
            ? 'linear-gradient(135deg, #0f172a 0%, #1a1040 35%, #0c1a3d 70%, #162032 100%)'
            : 'linear-gradient(135deg, #ede9fe 0%, #e0f2fe 35%, #f0fdf4 70%, #fef3c7 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: dark
            ? '0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.4)'
            : '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
          border: dark
            ? '1px solid rgba(255,255,255,0.06)'
            : '1px solid rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          backgroundColor: dark ? 'rgba(30,41,59,0.82)' : 'rgba(255,255,255,0.88)',
          transition: 'box-shadow 0.25s ease, transform 0.25s ease',
          '&:hover': {
            boxShadow: dark
              ? '0 4px 12px rgba(0,0,0,0.4), 0 12px 32px rgba(0,0,0,0.5)'
              : '0 4px 12px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 20 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          boxShadow: dark
            ? '0 8px 40px rgba(0,0,0,0.5)'
            : '0 8px 40px rgba(0,0,0,0.12)',
          border: dark
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(255,255,255,0.5)',
          backgroundColor: dark ? '#1e293b' : undefined,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px !important',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: 13,
          padding: '4px 12px',
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          gap: 4,
          '& .MuiToggleButtonGroup-grouped': {
            border: dark
              ? '1px solid rgba(255,255,255,0.1) !important'
              : '1px solid rgba(0,0,0,0.08) !important',
            '&.Mui-selected': {
              backgroundColor: alpha('#818cf8', dark ? 0.2 : 0.1),
              color: dark ? '#a5b4fc' : '#6366f1',
              borderColor: `${alpha('#818cf8', 0.3)} !important`,
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          boxShadow: dark
            ? '0 4px 20px rgba(0,0,0,0.5)'
            : '0 4px 20px rgba(0,0,0,0.1)',
          border: dark
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        },
        head: {
          backgroundColor: dark ? 'rgba(15,23,42,0.9)' : 'rgba(248,250,252,0.9)',
          fontWeight: 700,
          color: dark ? '#e2e8f0' : '#334155',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { borderRadius: 0 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: dark ? '#0f172a' : undefined,
        },
      },
    },
  };
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
    secondary: { main: '#a855f7', light: '#c084fc', dark: '#7c3aed' },
    income: { main: '#10b981', light: '#34d399', dark: '#059669' },
    expense: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
    background: { default: '#f0f2f8', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#64748b' },
  },
  typography,
  shape,
  components: sharedComponents('light'),
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#818cf8', light: '#a5b4fc', dark: '#6366f1' },
    secondary: { main: '#c084fc', light: '#d8b4fe', dark: '#a855f7' },
    income: { main: '#34d399', light: '#6ee7b7', dark: '#10b981' },
    expense: { main: '#f87171', light: '#fca5a5', dark: '#ef4444' },
    background: { default: '#0f172a', paper: '#1e293b' },
    text: { primary: '#f1f5f9', secondary: '#94a3b8' },
  },
  typography,
  shape,
  components: sharedComponents('dark'),
});
