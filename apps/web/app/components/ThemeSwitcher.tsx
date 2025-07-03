import { useState, useEffect } from 'react';
import { useHydratedTranslation } from "../hooks/useHydratedTranslation";
import { useTheme } from "../hooks/useTheme";
import { Sun, Moon, Monitor } from 'lucide-react';
import { Icon } from './Icon';
import type { ThemeMode } from "../lib/theme";
import { getSystemTheme } from "../lib/theme";

export function ThemeSwitcher() {
  const { t } = useHydratedTranslation();
  const { mode, colors, setTheme } = useTheme();
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as ThemeMode);
  };

  // Track system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateSystemTheme = () => {
      setSystemTheme(getSystemTheme());
    };

    // Set initial system theme
    updateSystemTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateSystemTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateSystemTheme);
    };
  }, []);

  const getThemeIcon = () => {
    switch (mode) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
        // Show Sun or Moon based on actual system preference
        return systemTheme === 'dark' ? Moon : Sun;
      default:
        return systemTheme === 'dark' ? Moon : Sun;
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Icon icon={getThemeIcon()} size="sm" />
      <select
        id="theme-selector"
        value={mode}
        onChange={handleThemeChange}
        style={{
          padding: "0.5rem",
          border: `1px solid ${colors.border.primary}`,
          borderRadius: "6px",
          fontSize: "0.875rem",
          backgroundColor: colors.background.secondary,
          color: colors.text.primary,
          cursor: "pointer",
          outline: "none",
        }}
        aria-label={t("selectTheme")}
      >
        <option value="system">{t("themeSystem")}</option>
        <option value="light">{t("themeLight")}</option>
        <option value="dark">{t("themeDark")}</option>
      </select>
    </div>
  );
}