/** LinkedIn-inspired theme tokens for question components */

export const questionTheme = {
  // Color palette
  colors: {
    primary: {
      main: '#0a66c2',
      light: '#edf3f8',
      hover: '#004182',
    },
    success: {
      main: '#057642',
      light: '#f0f9f6',
      border: '#b9d6f2',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
      tertiary: '#9ca3af',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f3f2ef',
      accent: '#edf3f8',
      hover: '#fafafa',
    },
    border: {
      primary: '#e0dfdc',
      secondary: '#b9d6f2',
      focus: '#0a66c2',
    },
    error: {
      main: '#d32f2f',
      light: '#ffebee',
      border: '#ffcdd2',
    },
    warning: {
      main: '#f59e0b',
      light: '#fef3c7',
      border: '#fde68a',
    },
    info: {
      main: '#0a66c2',
      light: '#e3f0ff',
      border: '#b9d6f2',
    },
  },

  // Typography
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    sizes: {
      xs: '0.75rem',      // 12px
      sm: '0.813rem',     // 13px
      base: '0.875rem',   // 14px
      md: '0.938rem',     // 15px
      lg: '1.063rem',     // 17px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Spacing (8px base unit)
  spacing: {
    xs: 0.5,   // 4px
    sm: 1,     // 8px
    md: 1.5,   // 12px
    lg: 2,     // 16px
    xl: 3,     // 24px
    '2xl': 4,  // 32px
  },

  // Shadows
  shadows: {
    card: '0 0 0 1px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.08)',
    cardHover: '0 0 0 1px rgba(0,0,0,.08), 0 4px 8px rgba(0,0,0,.12)',
    subtle: '0 1px 3px rgba(0,0,0,.08)',
  },

  // Border radius
  borderRadius: {
    sm: 1,   // 8px
    md: 2,   // 16px
    lg: 3,   // 24px
  },

  // Transitions
  transitions: {
    default: 'all 0.2s ease',
    fast: 'all 0.15s ease',
  },
};

// MUI theme overrides for question components
export const muiQuestionTheme = {
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: questionTheme.shadows.card,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: questionTheme.typography.sizes.md,
          fontWeight: questionTheme.typography.weights.semibold,
          borderRadius: questionTheme.borderRadius.sm,
          padding: '10px 20px',
        },
        contained: {
          backgroundColor: questionTheme.colors.primary.main,
          '&:hover': {
            backgroundColor: questionTheme.colors.primary.hover,
          },
        },
        outlined: {
          borderColor: questionTheme.colors.border.primary,
          color: questionTheme.colors.text.primary,
          '&:hover': {
            backgroundColor: questionTheme.colors.background.hover,
            borderColor: questionTheme.colors.border.focus,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: questionTheme.colors.border.primary,
          '&.Mui-checked': {
            color: questionTheme.colors.primary.main,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: questionTheme.colors.border.primary,
          '&.Mui-checked': {
            color: questionTheme.colors.primary.main,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: questionTheme.borderRadius.sm,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: questionTheme.colors.border.focus,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: questionTheme.colors.primary.main,
            },
          },
        },
      },
    },
  },
};

