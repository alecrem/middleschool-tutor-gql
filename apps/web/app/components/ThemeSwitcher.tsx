import { useHydratedTranslation } from "../hooks/useHydratedTranslation";
import { useTheme } from "../hooks/useTheme";
import type { ThemeMode } from "../lib/theme";

export function ThemeSwitcher() {
  const { t } = useHydratedTranslation();
  const { mode, colors, setTheme } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as ThemeMode);
  };

  return (
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
  );
}