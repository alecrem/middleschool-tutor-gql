import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useNavigation, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { searchCards } from "../lib/api";
import { CardList } from "../components/CardList";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { Footer } from "../components/Footer";
import type { CardSearchResult } from "../lib/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Middle School Tutor" },
    {
      name: "description",
      content:
        "Enter any English or Japanese text to find all Middle School legal card titles which include it.",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query || query.trim() === "") {
    return json({ searchResult: null, query: "", error: null });
  }

  try {
    const searchResult = await searchCards(query.trim());
    return json({ searchResult, query, error: null });
  } catch (error) {
    console.error("Search error:", error);
    return json({
      searchResult: { cards: [], total: 0 } as CardSearchResult,
      query,
      error: "searchError", // Pass translation key instead of hardcoded text
    });
  }
}

export default function Index() {
  const { searchResult, query, error } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isSearching =
    navigation.state === "loading" &&
    navigation.location?.search.includes("query=");

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
            to="/deck-check"
            aria-label={t("deckCheckLink")}
            style={{
              color: "#3b82f6",
              textDecoration: "underline",
              fontSize: "0.875rem",
            }}
          >
            {t("deckCheckLink")}
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
          <h2>{t("searchCards")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("description") }} />

          <Form method="get">
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <input
                type="text"
                name="query"
                defaultValue={query}
                placeholder={t("searchPlaceholder")}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "1rem",
                }}
              />
              <button
                type="submit"
                disabled={isSearching}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: isSearching ? "#9ca3af" : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  cursor: isSearching ? "not-allowed" : "pointer",
                }}
              >
                {isSearching ? t("searching") : t("search")}
              </button>
            </div>
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
            {t(error)}
          </div>
        )}

        {searchResult ? (
          <div>
            <div style={{ marginBottom: "1rem", color: "#6b7280" }}>
              {searchResult.total > searchResult.cards.length
                ? t("foundCardsPartial", {
                    total: searchResult.total,
                    query: query,
                    shown: searchResult.cards.length,
                  })
                : t("foundCards", {
                    total: searchResult.total,
                    query: query,
                  })}
            </div>
            <CardList cards={searchResult.cards} />
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            <p>{t("enterCardName")}</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
