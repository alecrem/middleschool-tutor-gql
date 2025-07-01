import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useThemedStyles } from '../hooks/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'disabled';
export type ButtonSize = 'sm' | 'md' | 'lg';

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
  const { colors } = useThemedStyles();

  const getBaseStyles = () => ({
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    outline: 'none',
  });

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
        };
      case 'lg':
        return {
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
        };
      default: // md
        return {
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
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