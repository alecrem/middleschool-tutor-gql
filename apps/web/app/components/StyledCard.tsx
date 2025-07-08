import type { HTMLAttributes, ReactNode } from 'react';
import { useThemedStyles } from '../hooks/useTheme';

interface StyledCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  highlighted?: boolean;
}

export function StyledCard({
  children,
  highlighted = false,
  style: customStyle,
  ...props
}: StyledCardProps) {
  const { colors } = useThemedStyles();

  const cardStyles = {
    border: highlighted
      ? `3px solid ${colors.text.primary}`
      : `1px solid ${colors.border.primary}`,
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: colors.background.card,
    boxShadow: highlighted
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    ...customStyle,
  };

  return (
    <div style={cardStyles} {...props}>
      {children}
    </div>
  );
}

interface CardLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function StyledCardLayout({
  children,
  style: customStyle,
  ...props
}: CardLayoutProps) {
  const layoutStyles = {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '1rem',
    minWidth: 0, // Allow flex items to shrink below their content size
    ...customStyle,
  };

  return (
    <div style={layoutStyles} {...props}>
      {children}
    </div>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function StyledCardContent({
  children,
  style: customStyle,
  ...props
}: CardContentProps) {
  const contentStyles = {
    flex: 1,
    minWidth: 0,
    ...customStyle,
  };

  return (
    <div style={contentStyles} {...props}>
      {children}
    </div>
  );
}

interface CardImageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function StyledCardImageContainer({
  children,
  style: customStyle,
  ...props
}: CardImageContainerProps) {
  const containerStyles = {
    flexShrink: 0,
    ...customStyle,
  };

  return (
    <div style={containerStyles} {...props}>
      {children}
    </div>
  );
}