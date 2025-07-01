import { useTheme as useThemeContext } from '../contexts/ThemeContext';

export function useTheme() {
  return useThemeContext();
}

// Helper hook for getting theme-aware styles
export function useThemedStyles() {
  const { colors } = useThemeContext();
  
  return {
    colors,
    // Common style patterns
    page: {
      backgroundColor: colors.background.primary,
      color: colors.text.primary,
      minHeight: '100vh',
    },
    card: {
      backgroundColor: colors.background.card,
      border: `1px solid ${colors.border.primary}`,
      borderRadius: '8px',
    },
    secondaryBackground: {
      backgroundColor: colors.background.secondary,
    },
    button: {
      primary: {
        backgroundColor: colors.button.primary,
        color: colors.button.text,
        border: 'none',
      },
      disabled: {
        backgroundColor: colors.button.disabled,
        color: colors.button.text,
        border: 'none',
      },
    },
    link: {
      color: colors.text.link,
      textDecoration: 'underline',
    },
    error: {
      backgroundColor: colors.background.error,
      color: colors.text.error,
      border: `1px solid ${colors.border.error}`,
    },
    // Layout helpers
    flexRow: {
      display: 'flex' as const,
      alignItems: 'center' as const,
      gap: '0.5rem',
    },
    flexColumn: {
      display: 'flex' as const,
      flexDirection: 'column' as const,
      gap: '1rem',
    },
    flexWrap: {
      display: 'flex' as const,
      flexWrap: 'wrap' as const,
      gap: '0.5rem',
    },
    // Typography helpers
    smallText: {
      fontSize: '0.875rem',
      color: colors.text.secondary,
    },
    labelText: {
      fontSize: '0.875rem',
      fontWeight: '600' as const,
      color: colors.text.primary,
    },
    // Card image helpers
    cardImage: {
      width: '200px',
      height: '280px',
      aspectRatio: '5/7' as const,
      borderRadius: '8px',
      backgroundColor: colors.background.secondary,
    },
    // Form helpers
    formGroup: {
      display: 'flex' as const,
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },
    // Border helpers
    topBorder: {
      borderTop: `1px solid ${colors.border.primary}`,
      paddingTop: '1rem',
    },
  };
}