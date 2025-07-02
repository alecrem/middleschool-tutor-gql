import { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { generateAllCSSVariables, variablesToCSSString } from '../lib/cssVariables';

export function BodyStyle() {
  const { colors } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    
    // Generate and apply CSS custom properties
    const cssVariables = generateAllCSSVariables(colors);
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Set body background color for overscroll bounce
    document.body.style.backgroundColor = colors.background.primary;
    
    return () => {
      // Clean up CSS variables on unmount (though this component shouldn't unmount)
      Object.keys(cssVariables).forEach((property) => {
        root.style.removeProperty(property);
      });
      document.body.style.backgroundColor = '';
    };
  }, [colors]);

  return null; // This component doesn't render anything
}