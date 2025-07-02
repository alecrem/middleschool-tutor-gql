import { useTheme as useThemeContext } from '../contexts/ThemeContext';
import { designTokens, type Spacing, type FontSize, type BorderRadius, type Shadow } from '../lib/designTokens';
import type { StyleUtilities, LayoutStyles, TypographyStyles } from '../lib/theme';
import { cssVariables, createTransition } from '../lib/cssVariables';

export function useTheme() {
  return useThemeContext();
}

// Enhanced hook for getting theme-aware styles with design tokens
export function useThemedStyles() {
  const { colors } = useThemeContext();
  
  // Design token utility functions
  const utilities: StyleUtilities = {
    spacing: (size: Spacing) => designTokens.spacing[size],
    fontSize: (size: FontSize) => designTokens.typography.fontSize[size],
    borderRadius: (size: BorderRadius) => designTokens.borderRadius[size],
    shadow: (level: Shadow) => designTokens.shadows[level],
    transition: (property = designTokens.transitions.property.default, duration = designTokens.transitions.duration.base) => 
      `${property} ${duration} ${designTokens.transitions.easing.inOut}`,
  };

  // Enhanced layout utilities using design tokens
  const layout: LayoutStyles = {
    flexRow: {
      display: 'flex',
      alignItems: 'center',
      gap: designTokens.spacing.sm,
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: designTokens.spacing.sm,
    },
    flexCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    flexBetween: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    gridBase: {
      display: 'grid',
      gap: designTokens.spacing.lg,
    },
    gridResponsive: {
      display: 'grid',
      gap: designTokens.spacing.lg,
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    },
  };

  // Enhanced typography utilities using design tokens
  const typography: TypographyStyles = {
    heading: {
      fontSize: designTokens.typography.fontSize.xl,
      fontWeight: designTokens.typography.fontWeight.semibold,
      lineHeight: designTokens.typography.lineHeight.tight,
      color: colors.text.primary,
      margin: 0,
    },
    subheading: {
      fontSize: designTokens.typography.fontSize.lg,
      fontWeight: designTokens.typography.fontWeight.medium,
      lineHeight: designTokens.typography.lineHeight.snug,
      color: colors.text.primary,
      margin: 0,
    },
    body: {
      fontSize: designTokens.typography.fontSize.base,
      fontWeight: designTokens.typography.fontWeight.normal,
      lineHeight: designTokens.typography.lineHeight.normal,
      color: colors.text.primary,
      margin: 0,
    },
    caption: {
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: designTokens.typography.fontWeight.normal,
      lineHeight: designTokens.typography.lineHeight.normal,
      color: colors.text.secondary,
      margin: 0,
    },
    label: {
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: designTokens.typography.fontWeight.medium,
      lineHeight: designTokens.typography.lineHeight.normal,
      color: colors.text.primary,
      margin: 0,
    },
  };
  
  return {
    colors,
    tokens: designTokens,
    utilities,
    layout,
    typography,
    
    // Legacy style patterns (maintained for backward compatibility)
    page: {
      backgroundColor: colors.background.primary,
      color: colors.text.primary,
      minHeight: '100vh',
    },
    card: {
      backgroundColor: colors.background.card,
      border: `1px solid ${colors.border.primary}`,
      borderRadius: designTokens.borderRadius.lg,
      padding: designTokens.spacing.lg,
      boxShadow: designTokens.shadows.base,
    },
    secondaryBackground: {
      backgroundColor: colors.background.secondary,
    },
    button: {
      primary: {
        backgroundColor: colors.button.primary,
        color: colors.button.text,
        border: 'none',
        borderRadius: designTokens.borderRadius.md,
        padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
        fontSize: designTokens.typography.fontSize.base,
        fontWeight: designTokens.typography.fontWeight.medium,
        cursor: 'pointer',
        transition: utilities.transition('all'),
      },
      disabled: {
        backgroundColor: colors.button.disabled,
        color: colors.button.text,
        border: 'none',
        borderRadius: designTokens.borderRadius.md,
        padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
        fontSize: designTokens.typography.fontSize.base,
        fontWeight: designTokens.typography.fontWeight.medium,
        cursor: 'not-allowed',
        opacity: 0.6,
      },
    },
    link: {
      color: colors.text.link,
      textDecoration: 'underline',
      transition: utilities.transition('color'),
    },
    error: {
      backgroundColor: colors.background.error,
      color: colors.text.error,
      border: `1px solid ${colors.border.error}`,
      borderRadius: designTokens.borderRadius.md,
      padding: designTokens.spacing.md,
    },
    
    // Enhanced helpers using design tokens
    flexRow: layout.flexRow,
    flexColumn: layout.flexColumn,
    flexWrap: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: designTokens.spacing.sm,
    },
    smallText: typography.caption,
    labelText: typography.label,
    
    // Card image helpers with design tokens
    cardImage: {
      width: '200px',
      height: '280px',
      aspectRatio: '5/7' as const,
      borderRadius: designTokens.borderRadius.lg,
      backgroundColor: colors.background.secondary,
      boxShadow: designTokens.shadows.sm,
    },
    
    // Form helpers with design tokens
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: designTokens.spacing.sm,
    },
    
    // Border helpers with design tokens
    topBorder: {
      borderTop: `1px solid ${colors.border.primary}`,
      paddingTop: designTokens.spacing.lg,
    },
  };
}

// New utility hook for accessing design tokens directly
export function useDesignTokens() {
  return designTokens;
}

// New utility hook for creating responsive styles
export function useResponsive() {
  const tokens = useDesignTokens();
  
  return {
    mediaQuery: (breakpoint: keyof typeof tokens.breakpoints) => 
      `@media (min-width: ${tokens.breakpoints[breakpoint]})`,
    containerQuery: (width: string) => 
      `@container (min-width: ${width})`,
  };
}

// New utility hook for CSS custom properties
export function useCSSVariables() {
  return {
    variables: cssVariables,
    createTransition,
    
    // Utility function to use CSS variables in styles
    useVar: (path: string) => `var(--${path})`,
    
    // Pre-built style patterns using CSS variables
    styles: {
      card: {
        backgroundColor: cssVariables.colors.background.card,
        border: `1px solid ${cssVariables.colors.border.primary}`,
        borderRadius: cssVariables.borderRadius.lg,
        padding: cssVariables.spacing.lg,
        boxShadow: cssVariables.shadows.base,
      },
      button: {
        primary: {
          backgroundColor: cssVariables.colors.button.primary,
          color: cssVariables.colors.button.text,
          border: 'none',
          borderRadius: cssVariables.borderRadius.md,
          padding: `${cssVariables.spacing.md} ${cssVariables.spacing.lg}`,
          fontSize: cssVariables.typography.fontSize.base,
          fontWeight: cssVariables.typography.fontWeight.medium,
          cursor: 'pointer',
          transition: createTransition('all'),
        },
        secondary: {
          backgroundColor: 'transparent',
          color: cssVariables.colors.text.primary,
          border: `1px solid ${cssVariables.colors.border.primary}`,
          borderRadius: cssVariables.borderRadius.md,
          padding: `${cssVariables.spacing.md} ${cssVariables.spacing.lg}`,
          fontSize: cssVariables.typography.fontSize.base,
          fontWeight: cssVariables.typography.fontWeight.medium,
          cursor: 'pointer',
          transition: createTransition('all'),
        },
      },
      input: {
        backgroundColor: cssVariables.colors.background.primary,
        color: cssVariables.colors.text.primary,
        border: `1px solid ${cssVariables.colors.border.primary}`,
        borderRadius: cssVariables.borderRadius.md,
        padding: cssVariables.spacing.md,
        fontSize: cssVariables.typography.fontSize.base,
        transition: createTransition('border-color'),
      },
      text: {
        heading: {
          fontSize: cssVariables.typography.fontSize.xl,
          fontWeight: cssVariables.typography.fontWeight.semibold,
          lineHeight: cssVariables.typography.lineHeight.tight,
          color: cssVariables.colors.text.primary,
          margin: 0,
        },
        body: {
          fontSize: cssVariables.typography.fontSize.base,
          fontWeight: cssVariables.typography.fontWeight.normal,
          lineHeight: cssVariables.typography.lineHeight.normal,
          color: cssVariables.colors.text.primary,
          margin: 0,
        },
        caption: {
          fontSize: cssVariables.typography.fontSize.sm,
          color: cssVariables.colors.text.secondary,
          margin: 0,
        },
      },
    },
  };
}