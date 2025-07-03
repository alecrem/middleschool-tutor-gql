import React, { useState } from 'react';
import { Share, Check, AlertCircle } from 'lucide-react';
import { useHydratedTranslation } from '../hooks/useHydratedTranslation';
import { useThemedStyles } from '../hooks/useTheme';
import { Icon } from './Icon';
import { ComponentSize } from '../lib/theme';

interface ShareButtonProps {
  url: string;
  label: string;
  size?: ComponentSize;
  className?: string;
  disabled?: boolean;
}

type CopyStatus = 'idle' | 'success' | 'error';

export function ShareButton({ url, label, size = 'sm', className, disabled = false }: ShareButtonProps) {
  const { t } = useHydratedTranslation();
  const { colors, utilities } = useThemedStyles();
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const handleShare = async () => {
    if (copyStatus !== 'idle' || disabled) return;

    try {
      // Convert relative URLs to absolute URLs for sharing
      const absoluteUrl = url.startsWith('/') 
        ? `${window.location.origin}${url}`
        : url;
      await navigator.clipboard.writeText(absoluteUrl);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const getButtonStyles = () => ({
    display: 'flex',
    alignItems: 'center',
    gap: utilities.spacing('xs'),
    padding: size === 'xs' 
      ? `${utilities.spacing('xs')} ${utilities.spacing('sm')}` 
      : `${utilities.spacing('sm')} ${utilities.spacing('md')}`,
    backgroundColor: disabled
      ? colors.button.disabled
      : copyStatus === 'success' 
        ? colors.accent.green 
        : copyStatus === 'error' 
          ? colors.background.error 
          : colors.background.secondary,
    color: disabled
      ? colors.text.secondary
      : copyStatus === 'success'
        ? '#ffffff'
        : copyStatus === 'error'
          ? colors.text.error
          : colors.text.primary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: utilities.borderRadius('md'),
    fontSize: utilities.fontSize(size === 'xs' ? 'xs' : 'sm'),
    fontWeight: '500',
    cursor: disabled || copyStatus !== 'idle' ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: utilities.transition('all'),
    whiteSpace: 'nowrap' as const,
    minWidth: 'max-content',
  });

  const getIcon = () => {
    switch (copyStatus) {
      case 'success':
        return Check;
      case 'error':
        return AlertCircle;
      default:
        return Share;
    }
  };

  const getButtonText = () => {
    switch (copyStatus) {
      case 'success':
        return t('urlCopied');
      case 'error':
        return t('copyUrlFailed');
      default:
        return label;
    }
  };

  // Generate absolute URL for display purposes
  const displayUrl = typeof window !== 'undefined' && url.startsWith('/') 
    ? `${window.location.origin}${url}`
    : url;

  return (
    <button
      onClick={handleShare}
      disabled={disabled || copyStatus !== 'idle'}
      style={getButtonStyles()}
      className={className}
      aria-label={disabled ? `${label} (disabled - deck contains invalid cards)` : `${label} - ${displayUrl}`}
      title={disabled ? "Deck must be valid to share" : displayUrl}
    >
      <Icon 
        icon={getIcon()} 
        size={size === 'xs' ? 'xs' : 'sm'}
      />
      <span>{getButtonText()}</span>
    </button>
  );
}