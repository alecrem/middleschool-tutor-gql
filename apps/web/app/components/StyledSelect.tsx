import { SelectHTMLAttributes, ReactNode } from 'react';
import { useThemedStyles } from '../hooks/useTheme';

export type SelectSize = 'sm' | 'md' | 'lg';

interface StyledSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: SelectSize;
  fullWidth?: boolean;
  children: ReactNode;
}

export function StyledSelect({
  size = 'md',
  fullWidth = true,
  children,
  style: customStyle,
  ...props
}: StyledSelectProps) {
  const { colors } = useThemedStyles();

  const getBaseStyles = () => ({
    border: `1px solid ${colors.border.primary}`,
    borderRadius: '6px',
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    cursor: 'pointer',
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    transition: 'border-color 0.2s ease',
  });

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.25rem 0.5rem',
          fontSize: '0.75rem',
        };
      case 'lg':
        return {
          padding: '0.75rem',
          fontSize: '1rem',
        };
      default: // md
        return {
          padding: '0.5rem',
          fontSize: '0.875rem',
        };
    }
  };

  const combinedStyles = {
    ...getBaseStyles(),
    ...getSizeStyles(),
    ...customStyle,
  };

  return (
    <select
      style={combinedStyles}
      {...props}
    >
      {children}
    </select>
  );
}