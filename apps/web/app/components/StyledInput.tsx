import { InputHTMLAttributes } from 'react';
import { useThemedStyles } from '../hooks/useTheme';

export type InputVariant = 'default' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';

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
  const { colors } = useThemedStyles();

  const getBaseStyles = () => ({
    border: `1px solid ${colors.border.primary}`,
    borderRadius: '6px',
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    transition: 'border-color 0.2s ease',
  });

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.5rem',
          fontSize: '0.875rem',
        };
      case 'lg':
        return {
          padding: '0.75rem',
          fontSize: '1rem',
        };
      default: // md
        return {
          padding: '0.75rem',
          fontSize: '1rem',
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