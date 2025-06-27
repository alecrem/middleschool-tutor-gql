import { Form, useNavigation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Accordion } from "./Accordion";
import { useTheme } from "../hooks/useTheme";

interface SearchControlsProps {
  query: string;
  cardType: string;
}

export function SearchControls({ query, cardType }: SearchControlsProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  
  const isSearching =
    navigation.state === "loading" &&
    navigation.location?.search.includes("query=");

  const cardTypes = [
    { value: "", label: t("allCardTypes") },
    { value: "artifact", label: t("artifact") },
    { value: "creature", label: t("creature") },
    { value: "enchantment", label: t("enchantment") },
    { value: "instant", label: t("instant") },
    { value: "land", label: t("land") },
    { value: "sorcery", label: t("sorcery") },
  ];

  return (
    <div
      style={{
        backgroundColor: colors.background.secondary,
        padding: "1.5rem",
        borderRadius: "8px",
        marginBottom: "2rem",
      }}
    >
      <h2>{t("searchCards")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("description") }} />

      <Form method="get">
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder={t("searchPlaceholder")}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "0.75rem",
              border: `1px solid ${colors.border.primary}`,
              borderRadius: "6px",
              fontSize: "1rem",
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
            }}
          />
          <button
            type="submit"
            disabled={isSearching}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: isSearching ? colors.button.disabled : colors.button.primary,
              color: colors.button.text,
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              cursor: isSearching ? "not-allowed" : "pointer",
            }}
          >
            {isSearching ? t("searching") : t("search")}
          </button>
        </div>

        <Accordion title={t("advancedSearch")} defaultExpanded={cardType !== ""}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label
                htmlFor="cardType"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: colors.text.primary,
                }}
              >
                {t("cardType")}
              </label>
              <select
                id="cardType"
                name="cardType"
                defaultValue={cardType}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: `1px solid ${colors.border.primary}`,
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {cardTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Accordion>
      </Form>
    </div>
  );
}