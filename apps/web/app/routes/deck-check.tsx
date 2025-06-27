import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useNavigation, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { validateCards } from "../lib/api";
import { parseDeckList } from "../lib/deck-parser";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { Footer } from "../components/Footer";
import type { DeckValidationResult } from "../lib/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Deck Check - Middle School Tutor" },
    {
      name: "description",
      content: "Validate your deck list for Middle School legality",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const deckList = url.searchParams.get("decklist");

  if (!deckList || deckList.trim() === "") {
    return json({ results: null, deckList: "", error: null });
  }

  try {
    const entries = parseDeckList(deckList);
    const cardNames = entries.map((entry) => entry.name);
    const validationResults = await validateCards(cardNames);

    const results: DeckValidationResult[] = entries.map((entry) => {
      const validation = validationResults.find((v) => v.name === entry.name);
      return {
        name: entry.name,
        quantity: entry.quantity,
        found: validation?.found ?? false,
        banned: validation?.banned ?? false,
        matchedName: validation?.matchedName ?? null,
        matchedNameJa: validation?.matchedNameJa ?? null,
      };
    });

    return json({ results, deckList, error: null });
  } catch (error) {
    console.error("Deck validation error:", error);
    return json({
      results: null,
      deckList,
      error: "deckValidationError",
    });
  }
}

export default function DeckCheck() {
  const { results, deckList, error } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const isValidating =
    navigation.state === "loading" &&
    navigation.location?.search.includes("decklist=");

  const bannedCards = results?.filter((result) => result.banned) ?? [];
  const notFoundCards = results?.filter((result) => !result.found) ?? [];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
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
          <LanguageSwitcher />
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <Link
            to="/"
            aria-label={t("cardSearchLink")}
            style={{
              color: "#3b82f6",
              textDecoration: "underline",
              fontSize: "0.875rem",
            }}
          >
            {t("cardSearchLink")}
          </Link>
        </div>

        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          <Form method="get">
            <div style={{ marginBottom: "1rem" }}>
              <h2>{t("deckCheck")}</h2>
              <p
                dangerouslySetInnerHTML={{ __html: t("deckCheckDescription") }}
              />
              <textarea
                id="decklist"
                name="decklist"
                defaultValue={deckList}
                placeholder={t("deckListPlaceholder")}
                rows={10}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                  resize: "vertical",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isValidating}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: isValidating ? "#9ca3af" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "1rem",
                cursor: isValidating ? "not-allowed" : "pointer",
              }}
            >
              {isValidating ? t("validating") : t("validateDeck")}
            </button>
          </Form>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              padding: "1rem",
              borderRadius: "6px",
              marginBottom: "2rem",
              border: "1px solid #fecaca",
            }}
          >
            {t("deckValidationError")}
          </div>
        )}

        {results && (
          <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              {t("deckResults")}:{" "}
              {bannedCards.length + notFoundCards.length === 0
                ? t("deckValid")
                : `${bannedCards.length + notFoundCards.length} ${t(
                    "cardsNotAllowed"
                  )}`}
            </h2>

            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: "#ffffff",
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
                    <div key={`${index}-en`}>
                      {result.quantity}{" "}
                      {result.found && result.matchedName
                        ? result.matchedName
                        : result.name}
                    </div>
                    {i18n.language === "ja" && (
                      <div key={`${index}-ja`}>
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
                        <span style={{ color: "#dc2626", fontWeight: "600" }}>
                          {t("bannedLabel")}
                        </span>
                      )}
                      {!result.found && (
                        <span style={{ color: "#f59e0b", fontWeight: "600" }}>
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
