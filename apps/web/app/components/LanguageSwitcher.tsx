import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select
      value={i18n.language}
      onChange={handleLanguageChange}
      style={{
        padding: "0.5rem",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        fontSize: "0.875rem",
        backgroundColor: "white",
      }}
    >
      <option value="en">English</option>
      <option value="ja">日本語</option>
    </select>
  );
}
