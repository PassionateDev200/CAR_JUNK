/**
 * LinkedIn-Inspired MUI Theme Configuration
 * 
 * This theme provides a professional, clean design system inspired by LinkedIn's UI.
 * Use this with MUI's ThemeProvider for consistent styling across the application.
 * 
 * Usage:
 * import { ThemeProvider } from '@mui/material/styles';
 * import { linkedinTheme } from '@/theme/linkedinTheme';
 * 
 * <ThemeProvider theme={linkedinTheme}>
 *   <App />
 * </ThemeProvider>
 */

import { createTheme } from '@mui/material/styles';

export const linkedinTheme = createTheme({
  palette: {
    primary: {
      main: '#0a66c2', // LinkedIn blue
      light: '#378fe9',
      dark: '#004182',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#70b5f9',
      light: '#9ccbf9',
      dark: '#4a8fc9',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f3f2ef', // LinkedIn's background
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.9)', // Strong black for headings
      secondary: 'rgba(0, 0, 0, 0.6)', // Medium gray for body text
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    success: {
      main: '#057642', // Professional green
      light: '#43a047',
      dark: '#004d2a',
    },
    error: {
      main: '#c44036', // Professional red
      light: '#d32f2f',
      dark: '#8e2c27',
    },
    warning: {
      main: '#915907', // Professional amber
      light: '#f57c00',
      dark: '#5d3900',
    },
    info: {
      main: '#0a66c2',
      light: '#378fe9',
      dark: '#004182',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: 'rgba(0, 0, 0, 0.9)',
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
      color: 'rgba(0, 0, 0, 0.6)',
    },
    button: {
      textTransform: 'none', // LinkedIn doesn't uppercase buttons
      fontWeight: 600,
      fontSize: '1rem',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: 'rgba(0, 0, 0, 0.6)',
    },
  },
  shape: {
    borderRadius: 8, // Rounded corners, professional but not too soft
  },
  shadows: [
    'none',
    '0px 0px 0px 1px rgba(0,0,0,0.08), 0px 1px 2px 0px rgba(0,0,0,0.1)',
    '0px 0px 0px 1px rgba(0,0,0,0.08), 0px 2px 4px 0px rgba(0,0,0,0.12)',
    '0px 0px 0px 1px rgba(0,0,0,0.08), 0px 4px 8px 0px rgba(0,0,0,0.12)',
    '0px 0px 0px 1px rgba(0,0,0,0.08), 0px 6px 12px 0px rgba(0,0,0,0.15)',
    ...Array(20).fill('0px 0px 0px 1px rgba(0,0,0,0.08), 0px 8px 16px 0px rgba(0,0,0,0.15)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24, // Pill-shaped buttons like LinkedIn
          padding: '8px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: '#004182',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(10, 102, 194, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation0: {
          border: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
});

/**
 * Common spacing tokens for consistent layout
 */
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

/**
 * Common elevation styles (LinkedIn-style borders with subtle shadows)
 */
export const elevations = {
  card: {
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    bgcolor: 'background.paper',
  },
  hover: {
    '&:hover': {
      boxShadow: '0px 0px 0px 1px rgba(0,0,0,0.08), 0px 4px 8px 0px rgba(0,0,0,0.12)',
      transition: 'box-shadow 0.2s ease',
    },
  },
};

