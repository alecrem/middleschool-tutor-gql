import { InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';
import { useThemedStyles } from '../hooks/useTheme';
import type { ComponentSize } from '../lib/theme';
import { Icon } from './Icon';

export type InputVariant = 'default' | 'search';
export type InputSize = ComponentSize;

interface StyledInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  fullWidth?: boolean;
  icon?: LucideIcon;
}

export function StyledInput({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  icon,
  style: customStyle,
  ...props
}: StyledInputProps) {
  const { colors, utilities } = useThemedStyles();

  const getBaseStyles = () => ({
    border: `1px solid ${colors.border.primary}`,
    borderRadius: utilities.borderRadius('md'),
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    transition: utilities.transition('border-color'),
    fontFamily: 'inherit',
  });

  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return {
          padding: utilities.spacing('xs'),
          fontSize: utilities.fontSize('xs'),
          minHeight: '1.5rem',
        };
      case 'sm':
        return {
          padding: utilities.spacing('sm'),
          fontSize: utilities.fontSize('sm'),
          minHeight: '2rem',
        };
      case 'lg':
        return {
          padding: utilities.spacing('lg'),
          fontSize: utilities.fontSize('lg'),
          minHeight: '3rem',
        };
      case 'xl':
        return {
          padding: utilities.spacing('xl'),
          fontSize: utilities.fontSize('xl'),
          minHeight: '3.5rem',
        };
      default: // md
        return {
          padding: utilities.spacing('md'),
          fontSize: utilities.fontSize('base'),
          minHeight: '2.5rem',
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'search':
        return {
          flex: 1,
          minWidth: '200px',
        };
      default:
        return {};
    }
  };

  const combinedStyles = {
    ...getBaseStyles(),
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...customStyle,
  };

  // If no icon, render simple input
  if (!icon) {
    return (
      <input
        style={combinedStyles}
        {...props}
      />
    );
  }

  // With icon, render input with icon wrapper
  const iconSize = size === 'xs' || size === 'sm' ? 'xs' : 'sm';
  const iconPadding = utilities.spacing('sm');
  
  const wrapperStyles = {
    position: 'relative' as const,
    display: 'inline-block',
    width: fullWidth ? '100%' : 'auto',
  };

  const inputWithIconStyles = {
    ...combinedStyles,
    paddingLeft: `calc(${iconPadding} + 20px + ${iconPadding})`, // icon size + padding
  };

  const iconWrapperStyles = {
    position: 'absolute' as const,
    left: iconPadding,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
    zIndex: 1,
  };

  return (
    <div style={wrapperStyles}>
      <div style={iconWrapperStyles}>
        <Icon icon={icon} size={iconSize} />
      </div>
      <input
        style={inputWithIconStyles}
        {...props}
      />
    </div>
  );
}