import { useHydratedTranslation } from "../hooks/useHydratedTranslation";
import { useThemedStyles } from "../hooks/useTheme";

export function LanguageSwitcher() {
  const { i18n } = useHydratedTranslation();
  const { colors } = useThemedStyles();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select
      value={i18n.language}
      onChange={handleLanguageChange}
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
    >
      <option value="en">English</option>
      <option value="ja">日本語</option>
    </select>
  );
}
