import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, Form, useNavigation, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { generateScryfallUrl } from "../../lib/utils";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";
import { Footer } from "../../components/Footer";
import { useThemedStyles } from "../../hooks/useTheme";
import { loader } from "./loader";

export { loader };

export const meta: MetaFunction = () => {
  return [
    { title: "Deck Check - Middle School Tutor" },
    {
      name: "description",
      content: "Validate your deck list for Middle School legality",
    },
  ];
};

export default function DeckCheck() {
  const { results, deckList, error } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { colors } = useThemedStyles();
  const isValidating =
    navigation.state === "loading" &&
    navigation.location?.search.includes("decklist=");

  const bannedCards = results?.filter((result) => result.banned) ?? [];
  const notFoundCards = results?.filter((result) => !result.found) ?? [];

  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentDeckList, setCurrentDeckList] = useState(deckList);
  const [lineCount, setLineCount] = useState(0);

  // Count lines in deck list
  useEffect(() => {
    const lines = currentDeckList.split('\n').filter(line => line.trim().length > 0);
    setLineCount(lines.length);
  }, [currentDeckList]);

  const isOverLimit = lineCount > 100;
  const isNearLimit = lineCount > 90 && lineCount <= 100;

  const copyDeckListToClipboard = async () => {
    if (!results) return;

    try {
      const deckListText = results
        .map((result) => {
          // Clean quantity - remove 'x' suffix and ensure it's a number
          const cleanQuantity = result.quantity.toString().replace(/x$/i, '');
          const quantity = parseInt(cleanQuantity) || 1;
          
          // Use English matched name if found, otherwise original input
          const cardName = result.found && result.matchedName ? result.matchedName : result.name;
          
          return `${quantity} ${cardName}`;
        })
        .join('\n');

      await navigator.clipboard.writeText(deckListText);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  return (
    <div style={{ 
      fontFamily: "system-ui, sans-serif", 
      lineHeight: "1.8",
      backgroundColor: colors.background.primary,
      color: colors.text.primary,
      minHeight: "100vh",
      transition: "background-color 0.2s ease, color 0.2s ease"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", margin: 0 }}>
            {t("title")}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <Link
            to="/"
            aria-label={t("cardSearchLink")}
            style={{
              color: colors.text.link,
              textDecoration: "underline",
              fontSize: "0.875rem",
            }}
          >
            {t("cardSearchLink")}
          </Link>
        </div>

        <div
          style={{
            backgroundColor: colors.background.secondary,
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          <Form method="get" onSubmit={(e) => {
            if (isOverLimit) {
              e.preventDefault();
            }
          }}>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <h2 style={{ margin: 0 }}>{t("deckCheck")}</h2>
                <div style={{ 
                  fontSize: "0.875rem", 
                  color: isOverLimit ? colors.accent.red : isNearLimit ? colors.accent.orange : colors.text.secondary,
                  fontWeight: isOverLimit || isNearLimit ? "600" : "normal"
                }}>
                  {lineCount}/100 {t("lines")}
                </div>
              </div>
              <p
                dangerouslySetInnerHTML={{ __html: t("deckCheckDescription") }}
              />
              {isOverLimit && (
                <div style={{
                  backgroundColor: colors.background.error,
                  color: colors.text.error,
                  padding: "0.75rem",
                  borderRadius: "6px",
                  marginBottom: "1rem",
                  border: `1px solid ${colors.border.error}`,
                  fontSize: "0.875rem"
                }}>
                  {t("deckLineLimitExceeded", { current: lineCount })}
                </div>
              )}
              {isNearLimit && !isOverLimit && (
                <div style={{
                  backgroundColor: "#fff3cd",
                  color: "#856404",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  marginBottom: "1rem",
                  border: "1px solid #ffeaa7",
                  fontSize: "0.875rem"
                }}>
                  {t("deckLineLimitWarning", { current: lineCount })}
                </div>
              )}
              <textarea
                id="decklist"
                name="decklist"
                value={currentDeckList}
                onChange={(e) => setCurrentDeckList(e.target.value)}
                placeholder={t("deckListPlaceholder")}
                rows={10}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: `1px solid ${isOverLimit ? colors.border.error : colors.border.primary}`,
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                  resize: "vertical",
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isValidating || isOverLimit}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: (isValidating || isOverLimit) ? colors.button.disabled : colors.button.primary,
                color: colors.button.text,
                border: "none",
                borderRadius: "6px",
                fontSize: "1rem",
                cursor: (isValidating || isOverLimit) ? "not-allowed" : "pointer",
                opacity: (isValidating || isOverLimit) ? 0.6 : 1,
              }}
            >
              {isValidating ? t("validating") : t("validateDeck")}
            </button>
          </Form>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: colors.background.error,
              color: colors.text.error,
              padding: "1rem",
              borderRadius: "6px",
              marginBottom: "2rem",
              border: `1px solid ${colors.border.error}`,
            }}
          >
{t(error)}
          </div>
        )}

        {results && (
          <div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "1rem",
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              <h2 style={{ fontSize: "1.5rem", margin: 0 }}>
                {t("deckResults")}:{" "}
                {bannedCards.length + notFoundCards.length === 0
                  ? t("deckValid")
                  : `${bannedCards.length + notFoundCards.length} ${t(
                      "cardsNotAllowed"
                    )}`}
              </h2>
              <button
                onClick={copyDeckListToClipboard}
                disabled={copyStatus !== 'idle'}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: copyStatus === 'success' ? colors.button.success : copyStatus === 'error' ? colors.button.error : colors.background.secondary,
                  color: copyStatus === 'success' || copyStatus === 'error' ? colors.button.text : colors.text.primary,
                  border: `1px solid ${colors.border.primary}`,
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  cursor: copyStatus === 'idle' ? "pointer" : "default",
                  transition: "all 0.2s ease",
                }}
              >
                {copyStatus === 'success' ? t("copied") : copyStatus === 'error' ? t("copyFailed") : t("copyDeckList")}
              </button>
            </div>

            <div
              style={{
                border: `1px solid ${colors.border.primary}`,
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: colors.background.card,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    i18n.language === "ja" ? "1fr 1fr auto" : "1fr auto",
                  gap: "0.5rem 1rem",
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                }}
              >
                {results.map((result, index) => (
                  <>
                    <div key={`${index}-en`} style={{ 
                      color: result.banned ? colors.accent.red : !result.found ? colors.accent.orange : "inherit" 
                    }}>
                      {result.quantity}{" "}
                      {result.found && result.matchedName ? (
                        <a
                          href={generateScryfallUrl(result.matchedName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "inherit",
                            textDecoration: "underline",
                            textDecorationColor: colors.text.secondary,
                          }}
                        >
                          {result.matchedName}
                        </a>
                      ) : (
                        result.name
                      )}
                    </div>
                    {i18n.language === "ja" && (
                      <div key={`${index}-ja`} style={{ 
                        color: result.banned ? colors.accent.red : !result.found ? colors.accent.orange : "inherit" 
                      }}>
                        {result.quantity}{" "}
                        {result.found && result.matchedNameJa
                          ? result.matchedNameJa
                          : result.found && result.matchedName
                          ? result.matchedName
                          : result.name}
                      </div>
                    )}
                    <div key={`${index}-status`}>
                      {result.banned && (
                        <span style={{ color: colors.accent.red, fontWeight: "600" }}>
                          {t("bannedLabel")}
                        </span>
                      )}
                      {!result.found && (
                        <span style={{ color: colors.accent.orange, fontWeight: "600" }}>
                          {t("notFound")}
                        </span>
                      )}
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}