import type { HTMLAttributes, ReactNode } from 'react';
import { useThemedStyles } from '../hooks/useTheme';

export type ContainerVariant = 'default' | 'card' | 'section' | 'highlighted';
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg';

interface StyledContainerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ContainerVariant;
  padding?: ContainerPadding;
  children: ReactNode;
  fullWidth?: boolean;
}

export function StyledContainer({
  variant = 'default',
  padding = 'md',
  children,
  fullWidth = false,
  style: customStyle,
  ...props
}: StyledContainerProps) {
  const { colors } = useThemedStyles();

  const getBaseStyles = () => ({
    borderRadius: '8px',
    width: fullWidth ? '100%' : 'auto',
  });

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return { padding: '0' };
      case 'sm':
        return { padding: '0.75rem' };
      case 'lg':
        return { padding: '2rem' };
      default: // md
        return { padding: '1.5rem' };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return {
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.border.primary}`,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        };
      case 'section':
        return {
          backgroundColor: colors.background.secondary,
          marginBottom: '2rem',
        };
      case 'highlighted':
        return {
          backgroundColor: colors.background.card,
          border: `3px solid ${colors.text.primary}`,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        };
      default:
        return {
          backgroundColor: colors.background.secondary,
        };
    }
  };

  const combinedStyles = {
    ...getBaseStyles(),
    ...getPaddingStyles(),
    ...getVariantStyles(),
    ...customStyle,
  };

  return (
    <div
      style={combinedStyles}
      {...props}
    >
      {children}
    </div>
  );
}