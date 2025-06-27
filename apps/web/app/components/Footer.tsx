import { useTranslation } from "react-i18next";
import { useThemedStyles } from "../hooks/useTheme";

export function Footer() {
  const { t } = useTranslation();
  const { colors } = useThemedStyles();

  return (
    <footer
      style={{
        marginTop: "4rem",
        padding: "2rem 1rem",
        borderTop: `1px solid ${colors.border.primary}`,
        backgroundColor: colors.background.secondary,
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Legal disclaimer - always in English */}
        <div
          style={{
            fontSize: "0.75rem",
            color: colors.text.secondary,
            lineHeight: "1.4",
            marginBottom: "1rem",
          }}
        >
          <p style={{ margin: "0 0 0.5rem 0" }}>
            {t("legalDisclaimer")}
          </p>
        </div>

        {/* License footer */}
        <div
          style={{
            fontSize: "0.875rem",
            color: colors.text.secondary,
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0 }}>
            {t("footerLicense")}{" "}
            <a
              href="https://github.com/alecrem/middleschool-tutor-gql"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: colors.text.link,
                textDecoration: "underline",
              }}
            >
              alecrem
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}