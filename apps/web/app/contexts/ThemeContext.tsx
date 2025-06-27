import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ThemeMode, ThemeColors } from '../lib/theme';
import { themes, getSystemTheme, getStoredTheme, setStoredTheme, getActiveTheme } from '../lib/theme';

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      setMode(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleSystemThemeChange = (e: MediaQueryList | MediaQueryListEvent) => {
      if (mode === 'system') {
        // Force re-render when system theme changes while in system mode
        setMode('system');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [mode, mounted]);

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    setStoredTheme(newMode);
  };

  const activeTheme = mounted ? getActiveTheme(mode) : 'light';
  const colors = themes[activeTheme];

  return (
    <ThemeContext.Provider value={{ mode, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}