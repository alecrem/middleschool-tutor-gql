/**
 * CSS Custom Properties (Variables) for theme system
 * Provides better performance for theme switching and enables more efficient styling
 */

import type { ThemeColors } from './theme';
import { designTokens } from './designTokens';

// Generate CSS custom properties for colors
export function generateColorVariables(colors: ThemeColors): Record<string, string> {
  return {
    // Background colors
    '--color-bg-primary': colors.background.primary,
    '--color-bg-secondary': colors.background.secondary,
    '--color-bg-card': colors.background.card,
    '--color-bg-error': colors.background.error,
    
    // Text colors
    '--color-text-primary': colors.text.primary,
    '--color-text-secondary': colors.text.secondary,
    '--color-text-error': colors.text.error,
    '--color-text-link': colors.text.link,
    
    // Border colors
    '--color-border-primary': colors.border.primary,
    '--color-border-secondary': colors.border.secondary,
    '--color-border-error': colors.border.error,
    
    // Button colors
    '--color-button-primary': colors.button.primary,
    '--color-button-disabled': colors.button.disabled,
    '--color-button-success': colors.button.success,
    '--color-button-error': colors.button.error,
    '--color-button-text': colors.button.text,
    
    // Accent colors
    '--color-accent-red': colors.accent.red,
    '--color-accent-orange': colors.accent.orange,
    '--color-accent-green': colors.accent.green,
    '--color-accent-blue': colors.accent.blue,
  };
}

// Generate CSS custom properties for design tokens
export function generateTokenVariables(): Record<string, string> {
  const variables: Record<string, string> = {};
  
  // Spacing variables
  Object.entries(designTokens.spacing).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = value;
  });
  
  // Typography variables
  Object.entries(designTokens.typography.fontSize).forEach(([key, value]) => {
    variables[`--font-size-${key}`] = value;
  });
  
  Object.entries(designTokens.typography.fontWeight).forEach(([key, value]) => {
    variables[`--font-weight-${key}`] = value;
  });
  
  Object.entries(designTokens.typography.lineHeight).forEach(([key, value]) => {
    variables[`--line-height-${key}`] = value;
  });
  
  // Border radius variables
  Object.entries(designTokens.borderRadius).forEach(([key, value]) => {
    variables[`--border-radius-${key}`] = value;
  });
  
  // Shadow variables
  Object.entries(designTokens.shadows).forEach(([key, value]) => {
    variables[`--shadow-${key}`] = value;
  });
  
  // Transition variables
  Object.entries(designTokens.transitions.duration).forEach(([key, value]) => {
    variables[`--duration-${key}`] = value;
  });
  
  Object.entries(designTokens.transitions.easing).forEach(([key, value]) => {
    variables[`--easing-${key}`] = value;
  });
  
  // Breakpoint variables (for container queries)
  Object.entries(designTokens.breakpoints).forEach(([key, value]) => {
    variables[`--breakpoint-${key}`] = value;
  });
  
  return variables;
}

// Combine all CSS variables
export function generateAllCSSVariables(colors: ThemeColors): Record<string, string> {
  return {
    ...generateColorVariables(colors),
    ...generateTokenVariables(),
  };
}

// Convert variables object to CSS string
export function variablesToCSSString(variables: Record<string, string>): string {
  return Object.entries(variables)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n');
}

// CSS class names for accessing variables
export const cssVariables = {
  // Colors
  colors: {
    background: {
      primary: 'var(--color-bg-primary)',
      secondary: 'var(--color-bg-secondary)',
      card: 'var(--color-bg-card)',
      error: 'var(--color-bg-error)',
    },
    text: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
      error: 'var(--color-text-error)',
      link: 'var(--color-text-link)',
    },
    border: {
      primary: 'var(--color-border-primary)',
      secondary: 'var(--color-border-secondary)',
      error: 'var(--color-border-error)',
    },
    button: {
      primary: 'var(--color-button-primary)',
      disabled: 'var(--color-button-disabled)',
      success: 'var(--color-button-success)',
      error: 'var(--color-button-error)',
      text: 'var(--color-button-text)',
    },
    accent: {
      red: 'var(--color-accent-red)',
      orange: 'var(--color-accent-orange)',
      green: 'var(--color-accent-green)',
      blue: 'var(--color-accent-blue)',
    },
  },
  
  // Spacing
  spacing: {
    none: 'var(--spacing-none)',
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
    xl: 'var(--spacing-xl)',
    '2xl': 'var(--spacing-2xl)',
    '3xl': 'var(--spacing-3xl)',
    '4xl': 'var(--spacing-4xl)',
    '5xl': 'var(--spacing-5xl)',
    '6xl': 'var(--spacing-6xl)',
  },
  
  // Typography
  typography: {
    fontSize: {
      xs: 'var(--font-size-xs)',
      sm: 'var(--font-size-sm)',
      base: 'var(--font-size-base)',
      lg: 'var(--font-size-lg)',
      xl: 'var(--font-size-xl)',
      '2xl': 'var(--font-size-2xl)',
      '3xl': 'var(--font-size-3xl)',
      '4xl': 'var(--font-size-4xl)',
    },
    fontWeight: {
      normal: 'var(--font-weight-normal)',
      medium: 'var(--font-weight-medium)',
      semibold: 'var(--font-weight-semibold)',
      bold: 'var(--font-weight-bold)',
    },
    lineHeight: {
      tight: 'var(--line-height-tight)',
      snug: 'var(--line-height-snug)',
      normal: 'var(--line-height-normal)',
      relaxed: 'var(--line-height-relaxed)',
      loose: 'var(--line-height-loose)',
    },
  },
  
  // Border radius
  borderRadius: {
    none: 'var(--border-radius-none)',
    sm: 'var(--border-radius-sm)',
    base: 'var(--border-radius-base)',
    md: 'var(--border-radius-md)',
    lg: 'var(--border-radius-lg)',
    xl: 'var(--border-radius-xl)',
    '2xl': 'var(--border-radius-2xl)',
    full: 'var(--border-radius-full)',
  },
  
  // Shadows
  shadows: {
    none: 'var(--shadow-none)',
    sm: 'var(--shadow-sm)',
    base: 'var(--shadow-base)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
    inner: 'var(--shadow-inner)',
  },
  
  // Transitions
  transitions: {
    duration: {
      fast: 'var(--duration-fast)',
      base: 'var(--duration-base)',
      slow: 'var(--duration-slow)',
      slower: 'var(--duration-slower)',
    },
    easing: {
      linear: 'var(--easing-linear)',
      in: 'var(--easing-in)',
      out: 'var(--easing-out)',
      inOut: 'var(--easing-inOut)',
    },
  },
} as const;

// Utility function to create CSS transition using variables
export function createTransition(
  property = 'all',
  duration: keyof typeof cssVariables.transitions.duration = 'base',
  easing: keyof typeof cssVariables.transitions.easing = 'inOut'
): string {
  return `${property} ${cssVariables.transitions.duration[duration]} ${cssVariables.transitions.easing[easing]}`;
}