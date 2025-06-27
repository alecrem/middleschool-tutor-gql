import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";
import type { ThemeMode } from "../lib/theme";

export function ThemeSwitcher() {
  const { t } = useTranslation();
  const { mode, colors, setTheme } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as ThemeMode);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <label
        htmlFor="theme-selector"
        style={{
          fontSize: "0.875rem",
          color: colors.text.secondary,
          fontWeight: "500",
        }}
      >
        {t("theme")}:
      </label>
      <select
        id="theme-selector"
        value={mode}
        onChange={handleThemeChange}
        style={{
          padding: "0.25rem 0.5rem",
          fontSize: "0.875rem",
          backgroundColor: colors.background.secondary,
          color: colors.text.primary,
          border: `1px solid ${colors.border.primary}`,
          borderRadius: "4px",
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