import { InputHTMLAttributes } from 'react';
import { useThemedStyles } from '../hooks/useTheme';
import type { ComponentSize } from '../lib/theme';

export type InputVariant = 'default' | 'search';
export type InputSize = ComponentSize;

interface StyledInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  fullWidth?: boolean;
}

export function StyledInput({
  variant = 'default',
  size = 'md',
  fullWidth = false,
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

  return (
    <input
      style={combinedStyles}
      {...props}
    />
  );
}