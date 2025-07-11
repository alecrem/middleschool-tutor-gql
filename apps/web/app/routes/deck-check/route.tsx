import type { MetaFunction } from "@remix-run/node";
import {
  useLoaderData,
  Form,
  useNavigation,
  useLocation,
} from "@remix-run/react";
import { useState, useEffect, useCallback } from "react";
import { Check, Copy, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { ExpandableCardRow } from "../../components/ExpandableCardRow";
import { useHydratedTranslation } from "../../hooks/useHydratedTranslation";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";
import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/Navigation";
import { ShareButton } from "../../components/ShareButton";
import { useThemedStyles } from "../../hooks/useTheme";
import { Icon } from "../../components/Icon";
import { generateDeckCheckShareUrl } from "../../lib/urlUtils";
import { decompressString } from "../../lib/utils";
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
  const loaderData = useLoaderData<typeof loader>();
  const { results, deckList, error } = loaderData;
  const compressed =
    "compressed" in loaderData ? loaderData.compressed : undefined;
  const { t, i18n } = useHydratedTranslation();
  const navigation = useNavigation();
  const location = useLocation();
  const { colors } = useThemedStyles();
  const isValidating =
    navigation.state === "loading" &&
    (navigation.location?.search.includes("decklist=") ||
      navigation.location?.search.includes("compressed="));

  const bannedCards = results?.filter((result) => result.banned) ?? [];
  const notFoundCards = results?.filter((result) => !result.found) ?? [];
  const isDeckValid = bannedCards.length + notFoundCards.length === 0;

  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [currentDeckList, setCurrentDeckList] = useState(deckList);
  const [lineCount, setLineCount] = useState(0);
  const [shareUrl, setShareUrl] = useState("/deck-check");
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(!!deckList?.trim());

  // Helper function to generate formatted deck list from validation results
  const generateFormattedDeckList = useCallback(
    (validationResults: typeof results) => {
      if (!validationResults) return "";

      return validationResults
        .map((result) => {
          // Clean quantity - remove 'x' suffix and ensure it's a number
          const cleanQuantity = result.quantity.toString().replace(/x$/i, "");
          const quantity = Number.parseInt(cleanQuantity) || 1;

          // Use English matched name if found, otherwise original input
          const cardName =
            result.found && result.matchedName
              ? result.matchedName
              : result.name;

          return `${quantity} ${cardName}`;
        })
        .join("\n");
    },
    []
  );

  // Count lines in deck list
  useEffect(() => {
    const lines = currentDeckList
      .split("\n")
      .filter((line) => line.trim().length > 0);
    setLineCount(lines.length);
  }, [currentDeckList]);

  // Generate share URL for current deck check
  useEffect(() => {
    const generateUrl = async () => {
      if (results) {
        const deckListToShare = generateFormattedDeckList(results);
        setIsGeneratingUrl(true);
        try {
          const url = await generateDeckCheckShareUrl(deckListToShare);
          setShareUrl(url);
        } catch (error) {
          console.error("Failed to generate share URL:", error);
          setShareUrl("/deck-check");
        } finally {
          setIsGeneratingUrl(false);
        }
      } else {
        setShareUrl("/deck-check");
        setIsGeneratingUrl(false);
      }
    };
    generateUrl();
  }, [results, generateFormattedDeckList]);

  // Handle client-side decompression when compressed data is received from server
  useEffect(() => {
    if (compressed) {
      const handleDecompression = async () => {
        try {
          const decompressedDeckList = await decompressString(compressed);
          setCurrentDeckList(decompressedDeckList);

          // Auto-submit the form with the decompressed deck list
          const form = document.querySelector(
            'form[method="get"]'
          ) as HTMLFormElement;
          if (form) {
            const formData = new FormData(form);
            formData.set("decklist", decompressedDeckList);

            // Convert FormData to URL search params and navigate
            const params = new URLSearchParams();
            for (const [key, value] of formData.entries()) {
              if (typeof value === "string") {
                params.set(key, value);
              }
            }

            window.location.search = params.toString();
          }
        } catch (error) {
          console.error("Failed to decompress deck list on client:", error);
          // Handle decompression error - could show an error message
        }
      };
      handleDecompression();
    }
  }, [compressed]);

  const isOverLimit = lineCount > 100;
  const isNearLimit = lineCount > 90 && lineCount <= 100;
  const isDeckListEmpty = currentDeckList.trim().length === 0;

  const copyDeckListToClipboard = async () => {
    if (!results) return;

    try {
      const deckListText = generateFormattedDeckList(results);
      await navigator.clipboard.writeText(deckListText);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (_error) {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.8",
        backgroundColor: colors.background.primary,
        color: colors.text.primary,
        minHeight: "100vh",
        transition: "background-color 0.2s ease, color 0.2s ease",
      }}
    >
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <Navigation currentPath={location.pathname} />

        <div
          style={{
            backgroundColor: colors.background.secondary,
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          <Form
            method="get"
            onSubmit={(e) => {
              if (isOverLimit || isDeckListEmpty) {
                e.preventDefault();
              }
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <h2 style={{ margin: 0 }}>{t("deckCheck")}</h2>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: isOverLimit
                      ? colors.accent.red
                      : isNearLimit
                        ? colors.accent.orange
                        : colors.text.secondary,
                    fontWeight: isOverLimit || isNearLimit ? "600" : "normal",
                  }}
                >
                  {lineCount}/100 {t("lines")}
                </div>
              </div>
              <p>
                {t("deckCheckDescriptionBefore")}
                <a
                  href="https://www.eternalcentral.com/middleschoolrules/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  {t("deckCheckDescriptionLink")}
                </a>
                {t("deckCheckDescriptionAfter")}
              </p>
              {isOverLimit && (
                <div
                  style={{
                    backgroundColor: colors.background.error,
                    color: colors.text.error,
                    padding: "0.75rem",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                    border: `1px solid ${colors.border.error}`,
                    fontSize: "0.875rem",
                  }}
                >
                  {t("deckLineLimitExceeded", { current: lineCount })}
                </div>
              )}
              {isNearLimit && !isOverLimit && (
                <div
                  style={{
                    backgroundColor: "#fff3cd",
                    color: "#856404",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                    border: "1px solid #ffeaa7",
                    fontSize: "0.875rem",
                  }}
                >
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
              disabled={isValidating || isOverLimit || isDeckListEmpty}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor:
                  isValidating || isOverLimit || isDeckListEmpty
                    ? colors.button.disabled
                    : colors.button.primary,
                color: colors.button.text,
                border: "none",
                borderRadius: "6px",
                fontSize: "1rem",
                cursor:
                  isValidating || isOverLimit || isDeckListEmpty
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  isValidating || isOverLimit || isDeckListEmpty ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Icon icon={Check} size="sm" />
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
              <h2
                style={{
                  fontSize: "1.5rem",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Icon
                  icon={isDeckValid ? CheckCircle : AlertTriangle}
                  size="sm"
                  color={isDeckValid ? colors.accent.green : colors.text.error}
                />
                {t("deckResults")}:{" "}
                {isDeckValid
                  ? t("deckValid")
                  : `${bannedCards.length + notFoundCards.length} ${t(
                      "cardsNotAllowed"
                    )}`}
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={copyDeckListToClipboard}
                  disabled={copyStatus !== "idle"}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor:
                      copyStatus === "success"
                        ? colors.background.secondary
                        : copyStatus === "error"
                          ? colors.background.error
                          : colors.background.secondary,
                    color:
                      copyStatus === "success"
                        ? colors.text.primary
                        : copyStatus === "error"
                          ? colors.text.error
                          : colors.text.primary,
                    border: `1px solid ${colors.border.primary}`,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    cursor: copyStatus === "idle" ? "pointer" : "default",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Icon
                    icon={
                      copyStatus === "success"
                        ? CheckCircle
                        : copyStatus === "error"
                          ? XCircle
                          : Copy
                    }
                    size="xs"
                  />
                  {copyStatus === "success"
                    ? t("copied")
                    : copyStatus === "error"
                      ? t("copyFailed")
                      : t("copyDeckList")}
                </button>
                <ShareButton
                  url={shareUrl}
                  label={t("shareDeckCheck")}
                  size="sm"
                  disabled={!isDeckValid || isGeneratingUrl}
                />
              </div>
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
                    i18n.language === "ja"
                      ? "1fr 1fr auto auto"
                      : "1fr auto auto",
                  gap: "0.5rem 0.5rem",
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                }}
              >
                {results.map((result, index) => (
                  <ExpandableCardRow
                    key={`${result.name}-${result.found ? "found" : "not-found"}-${index}`}
                    result={result}
                    index={index}
                    isJapanese={i18n.language === "ja"}
                    isLast={index === results.length - 1}
                  />
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
