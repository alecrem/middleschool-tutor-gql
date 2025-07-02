import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useThemedStyles, useDesignTokens } from '../hooks/useTheme';
import type { ComponentSize, ComponentVariant } from '../lib/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'disabled';
export type ButtonSize = ComponentSize;

interface StyledButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function StyledButton({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  fullWidth = false,
  style: customStyle,
  onMouseEnter,
  onMouseLeave,
  ...props
}: StyledButtonProps) {
  const { colors, utilities } = useThemedStyles();
  const tokens = useDesignTokens();

  const getBaseStyles = () => ({
    border: 'none',
    borderRadius: utilities.borderRadius('md'),
    fontWeight: tokens.typography.fontWeight.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: utilities.transition('all'),
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return {
          padding: `${utilities.spacing('xs')} ${utilities.spacing('sm')}`,
          fontSize: utilities.fontSize('xs'),
          minHeight: '1.5rem',
        };
      case 'sm':
        return {
          padding: `${utilities.spacing('sm')} ${utilities.spacing('md')}`,
          fontSize: utilities.fontSize('sm'),
          minHeight: '2rem',
        };
      case 'lg':
        return {
          padding: `${utilities.spacing('lg')} ${utilities.spacing('xl')}`,
          fontSize: utilities.fontSize('lg'),
          minHeight: '3rem',
        };
      case 'xl':
        return {
          padding: `${utilities.spacing('xl')} ${utilities.spacing('2xl')}`,
          fontSize: utilities.fontSize('xl'),
          minHeight: '3.5rem',
        };
      default: // md
        return {
          padding: `${utilities.spacing('md')} ${utilities.spacing('lg')}`,
          fontSize: utilities.fontSize('base'),
          minHeight: '2.5rem',
        };
    }
  };

  const getVariantStyles = () => {
    if (disabled) {
      return {
        backgroundColor: colors.button.disabled,
        color: colors.button.text,
      };
    }

    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.background.primary,
          color: colors.text.primary,
          border: `1px solid ${colors.border.primary}`,
        };
      case 'primary':
      default:
        return {
          backgroundColor: colors.button.primary,
          color: colors.button.text,
        };
    }
  };

  const getHoverStyles = () => {
    if (disabled) return {};
    
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.background.secondary,
        };
      case 'primary':
      default:
        return {
          opacity: '0.9',
        };
    }
  };

  const combinedStyles = {
    ...getBaseStyles(),
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...customStyle,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      const hoverStyles = getHoverStyles();
      Object.assign(e.currentTarget.style, hoverStyles);
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      const originalStyles = getVariantStyles();
      Object.assign(e.currentTarget.style, originalStyles);
    }
    onMouseLeave?.(e);
  };

  return (
    <button
      style={combinedStyles}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
}