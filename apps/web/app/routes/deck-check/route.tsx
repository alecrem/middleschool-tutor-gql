import type { MetaFunction } from "@remix-run/node";
import {
  useLoaderData,
  Form,
  useNavigation,
  useLocation,
} from "@remix-run/react";
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
import { useDeckValidation } from "../../hooks/useDeckValidation";
import { useDeckList } from "../../hooks/useDeckList";
import { loader } from "./loader";
import { ExternalLink } from "../../components/ExternalLink";

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

  // Use custom hooks for validation and deck list management
  const validation = useDeckValidation(results, t, i18n.language);
  const deckListState = useDeckList(
    deckList,
    compressed,
    results,
    validation.isDeckValid
  );

  // Extract values from hooks for easier access
  const {
    isDeckValid,
    mainDeckCount,
    sideboardCount,
    mainDeckCardsDisplay: mainDeckCards,
    sideboardCardsDisplay: sideboardCards,
  } = validation;
  const {
    copyStatus,
    currentDeckList,
    lineCount,
    shareUrl,
    isGeneratingUrl,
    isOverLimit,
    isNearLimit,
    isDeckListEmpty,
    setCurrentDeckList,
    copyDeckListToClipboard,
  } = deckListState;

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
                <ExternalLink
                  href="https://www.eternalcentral.com/middleschoolrules/"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  {t("deckCheckDescriptionLink")}
                </ExternalLink>
                {t("deckCheckDescriptionAfter")}
                <br />
                {t("sideboardInstructions")}
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

        {results &&
          (() => {
            return (
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
                  <div
                    style={{
                      color: isDeckValid
                        ? colors.text.primary
                        : colors.text.error,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Icon
                        icon={isDeckValid ? CheckCircle : AlertTriangle}
                        size="sm"
                        color={
                          isDeckValid ? colors.accent.green : colors.text.error
                        }
                      />
                      {validation.getValidationMessage()}
                    </p>
                    {!isDeckValid &&
                      validation.getValidationErrors().length > 1 && (
                        <ul
                          style={{
                            margin: "0.5rem 0 0 2rem",
                            padding: 0,
                            fontSize: "1rem",
                          }}
                        >
                          {validation.getValidationErrors().map((error) => (
                            <li key={error} style={{ marginBottom: "0.25rem" }}>
                              {error}
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                </div>

                {/* Main Deck Section */}
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
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      margin: 0,
                      color: colors.text.primary,
                    }}
                  >
                    {t("mainDeckCount", { count: mainDeckCount })}
                  </h3>
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
                    {mainDeckCards.map((result, index) => (
                      <ExpandableCardRow
                        key={`main-${result.name}-${result.found ? "found" : "not-found"}-${index}`}
                        result={result}
                        index={index}
                        isJapanese={i18n.language === "ja"}
                        isLast={index === mainDeckCards.length - 1}
                      />
                    ))}
                  </div>
                </div>

                {/* Sideboard Section */}
                {sideboardCards.length > 0 && (
                  <>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        margin: "2rem 0 1rem 0",
                        color: colors.text.primary,
                      }}
                    >
                      {t("sideboardCount", { count: sideboardCount })}
                    </h3>
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
                        {sideboardCards.map((result, index) => (
                          <ExpandableCardRow
                            key={`sideboard-${result.name}-${result.found ? "found" : "not-found"}-${index}`}
                            result={result}
                            index={index + mainDeckCards.length}
                            isJapanese={i18n.language === "ja"}
                            isLast={index === sideboardCards.length - 1}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })()}
      </div>
      <Footer />
    </div>
  );
}
