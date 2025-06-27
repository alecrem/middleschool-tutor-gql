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
    }
  };
}