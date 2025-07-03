import { LucideIcon } from 'lucide-react';
import { useThemedStyles } from '../hooks/useTheme';
import type { ComponentSize } from '../lib/theme';

export interface IconProps {
  icon: LucideIcon;
  size?: ComponentSize | number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ 
  icon: IconComponent, 
  size = 'md', 
  color, 
  className, 
  style: customStyle 
}: IconProps) {
  const { colors, utilities } = useThemedStyles();
  
  const getSizeValue = () => {
    if (typeof size === 'number') {
      return size;
    }
    
    switch (size) {
      case 'xs':
        return 12;
      case 'sm':
        return 16;
      case 'md':
        return 20;
      case 'lg':
        return 24;
      case 'xl':
        return 32;
      default:
        return 20;
    }
  };
  
  const iconSize = getSizeValue();
  const iconColor = color || colors.text.primary;
  
  const baseStyles: React.CSSProperties = {
    width: iconSize,
    height: iconSize,
    color: iconColor,
    display: 'inline-block',
    verticalAlign: 'middle',
    flexShrink: 0,
    transition: utilities.transition('color'),
  };
  
  const combinedStyles = {
    ...baseStyles,
    ...customStyle,
  };
  
  return (
    <IconComponent
      size={iconSize}
      color={iconColor}
      className={className}
      style={combinedStyles}
    />
  );
}