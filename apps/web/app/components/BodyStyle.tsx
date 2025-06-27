import { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

export function BodyStyle() {
  const { colors } = useTheme();

  useEffect(() => {
    // Set body background color for overscroll bounce
    document.body.style.backgroundColor = colors.background.primary;
    
    return () => {
      // Clean up on unmount (though this component shouldn't unmount)
      document.body.style.backgroundColor = '';
    };
  }, [colors.background.primary]);

  return null; // This component doesn't render anything
}