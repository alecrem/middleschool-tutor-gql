import type { designTokens, Spacing, FontSize, BorderRadius, Shadow } from './designTokens';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    card: string;
    error: string;
  };
  text: {
    primary: string;
    secondary: string;
    error: string;
    link: string;
  };
  border: {
    primary: string;
    secondary: string;
    error: string;
  };
  button: {
    primary: string;
    disabled: string;
    success: string;
    error: string;
    text: string;
  };
  accent: {
    red: string;
    orange: string;
    green: string;
    blue: string;
  };
}

export const lightTheme: ThemeColors = {
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    card: '#ffffff',
    error: '#fef2f2',
  },
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    error: '#dc2626',
    link: '#3b82f6',
  },
  border: {
    primary: '#e5e7eb',
    secondary: '#d1d5db',
    error: '#fecaca',
  },
  button: {
    primary: '#3b82f6',
    disabled: '#9ca3af',
    success: '#10b981',
    error: '#ef4444',
    text: '#ffffff',
  },
  accent: {
    red: '#dc2626',
    orange: '#f59e0b',
    green: '#10b981',
    blue: '#3b82f6',
  },
};

export const darkTheme: ThemeColors = {
  background: {
    primary: '#111827',
    secondary: '#1f2937',
    card: '#1f2937',
    error: '#7f1d1d',
  },
  text: {
    primary: '#f9fafb',
    secondary: '#d1d5db',
    error: '#f87171',
    link: '#60a5fa',
  },
  border: {
    primary: '#374151',
    secondary: '#4b5563',
    error: '#dc2626',
  },
  button: {
    primary: '#3b82f6',
    disabled: '#6b7280',
    success: '#10b981',
    error: '#ef4444',
    text: '#ffffff',
  },
  accent: {
    red: '#f87171',
    orange: '#fbbf24',
    green: '#34d399',
    blue: '#60a5fa',
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('theme') as ThemeMode | null;
}

export function setStoredTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
}

export function getActiveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
}

// Enhanced Theme Interface combining colors with design tokens
export interface EnhancedTheme {
  colors: ThemeColors;
  tokens: typeof designTokens;
}

// Utility types for better TypeScript support
export type ThemeColorPath = 
  | `background.${keyof ThemeColors['background']}`
  | `text.${keyof ThemeColors['text']}`
  | `border.${keyof ThemeColors['border']}`
  | `button.${keyof ThemeColors['button']}`
  | `accent.${keyof ThemeColors['accent']}`;

// Component variant types for better intellisense
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Style utility types
export interface StyleUtilities {
  spacing: (size: Spacing) => string;
  fontSize: (size: FontSize) => string;
  borderRadius: (size: BorderRadius) => string;
  shadow: (level: Shadow) => string;
  transition: (property?: string, duration?: string) => string;
}

// Common component props interface
export interface BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  fullWidth?: boolean;
  disabled?: boolean;
}

// Layout utility types
export interface LayoutStyles {
  flexRow: React.CSSProperties;
  flexColumn: React.CSSProperties;
  flexCenter: React.CSSProperties;
  flexBetween: React.CSSProperties;
  gridBase: React.CSSProperties;
  gridResponsive: React.CSSProperties;
}

// Typography utility types
export interface TypographyStyles {
  heading: React.CSSProperties;
  subheading: React.CSSProperties;
  body: React.CSSProperties;
  caption: React.CSSProperties;
  label: React.CSSProperties;
}

// Complete theme context type
export interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  tokens: typeof designTokens;
  utilities: StyleUtilities;
  layout: LayoutStyles;
  typography: TypographyStyles;
  setTheme: (mode: ThemeMode) => void;
}