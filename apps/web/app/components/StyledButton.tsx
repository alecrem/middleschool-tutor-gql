import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useThemedStyles, useDesignTokens } from '../hooks/useTheme';
import type { ComponentSize, } from '../lib/theme';
import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'disabled';
export type ButtonSize = ComponentSize;

interface StyledButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export function StyledButton({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
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

  const getIconSize = () => {
    switch (size) {
      case 'xs':
      case 'sm':
        return 'xs';
      case 'lg':
      case 'xl':
        return 'sm';
      default:
        return 'xs';
    }
  };

  const renderContent = () => {
    if (!icon) {
      return children;
    }

    const iconElement = <Icon icon={icon} size={getIconSize()} />;
    const gap = utilities.spacing('xs');

    if (iconPosition === 'right') {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap }}>
          {children}
          {iconElement}
        </span>
      );
    }

    return (
      <span style={{ display: 'flex', alignItems: 'center', gap }}>
        {iconElement}
        {children}
      </span>
    );
  };

  return (
    <button
      style={combinedStyles}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {renderContent()}
    </button>
  );
}