import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { searchCards } from "../lib/api";
import { CardList } from "../components/CardList";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { SearchControls } from "../components/SearchControls";
import { Footer } from "../components/Footer";
import { Pagination } from "../components/Pagination";
import { useThemedStyles } from "../hooks/useTheme";
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
  const cardType = url.searchParams.get("cardType") || "";
  const colors = url.searchParams.getAll("colors");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  // Parse power/toughness/CMC parameters with defaults
  const powerMin = url.searchParams.get("powerMin")
    ? parseInt(url.searchParams.get("powerMin")!)
    : 0;
  const powerMax = url.searchParams.get("powerMax")
    ? parseInt(url.searchParams.get("powerMax")!)
    : 13;
  const toughnessMin = url.searchParams.get("toughnessMin")
    ? parseInt(url.searchParams.get("toughnessMin")!)
    : 0;
  const toughnessMax = url.searchParams.get("toughnessMax")
    ? parseInt(url.searchParams.get("toughnessMax")!)
    : 13;
  const cmcMin = url.searchParams.get("cmcMin")
    ? parseInt(url.searchParams.get("cmcMin")!)
    : 0;
  const cmcMax = url.searchParams.get("cmcMax")
    ? parseInt(url.searchParams.get("cmcMax")!)
    : 16;

  // Check if there are any filters applied
  const hasFilters =
    cardType !== "" ||
    colors.length > 0 ||
    powerMin !== 0 ||
    powerMax !== 13 ||
    toughnessMin !== 0 ||
    toughnessMax !== 13 ||
    cmcMin !== 0 ||
    cmcMax !== 16;

  if (!query || query.trim() === "") {
    // If no query and no filters, show empty state
    if (!hasFilters) {
      return json({
        searchResult: null,
        query: "",
        cardType,
        colors,
        powerMin,
        powerMax,
        toughnessMin,
        toughnessMax,
        cmcMin,
        cmcMax,
        page: 1,
        totalPages: 0,
        error: null,
      });
    }
    // If filters but no query, search with empty query (will return filtered results)
  }

  try {
    // Only pass power/toughness parameters if they differ from defaults
    const searchResult = await searchCards(
      query ? query.trim() : "",
      cardType,
      colors,
      limit,
      offset,
      powerMin !== 0 || powerMax !== 13 ? powerMin : undefined,
      powerMin !== 0 || powerMax !== 13 ? powerMax : undefined,
      toughnessMin !== 0 || toughnessMax !== 13 ? toughnessMin : undefined,
      toughnessMin !== 0 || toughnessMax !== 13 ? toughnessMax : undefined,
      cmcMin !== 0 || cmcMax !== 16 ? cmcMin : undefined,
      cmcMin !== 0 || cmcMax !== 16 ? cmcMax : undefined
    );
    return json({
      searchResult,
      query,
      cardType,
      colors,
      powerMin,
      powerMax,
      toughnessMin,
      toughnessMax,
      cmcMin,
      cmcMax,
      page,
      totalPages: Math.ceil(searchResult.total / limit),
      error: null,
    });
  } catch (error) {
    console.error("Search error:", error);
    return json({
      searchResult: { cards: [], total: 0 } as CardSearchResult,
      query,
      cardType,
      colors,
      powerMin,
      powerMax,
      toughnessMin,
      toughnessMax,
      cmcMin,
      cmcMax,
      page,
      totalPages: 0,
      error: "searchError", // Pass translation key instead of hardcoded text
    });
  }
}

export default function Index() {
  const {
    searchResult,
    query,
    cardType,
    colors: selectedColors,
    powerMin,
    powerMax,
    toughnessMin,
    toughnessMax,
    cmcMin,
    cmcMax,
    page,
    totalPages,
    error,
  } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const { colors } = useThemedStyles();

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

        <div style={{ marginBottom: "2rem" }}>
          <Link
            to="/deck-check"
            aria-label={t("deckCheckLink")}
            style={{
              color: colors.text.link,
              textDecoration: "underline",
              fontSize: "0.875rem",
            }}
          >
            {t("deckCheckLink")}
          </Link>
        </div>

        <SearchControls
          query={query || ""}
          cardType={cardType}
          colors={selectedColors}
          powerMin={powerMin}
          powerMax={powerMax}
          toughnessMin={toughnessMin}
          toughnessMax={toughnessMax}
          cmcMin={cmcMin}
          cmcMax={cmcMax}
        />

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

        {searchResult ? (
          <div>
            <div style={{ marginBottom: "1rem", color: colors.text.secondary }}>
              {searchResult.total > searchResult.cards.length
                ? t("foundCardsGenericPartial", {
                    total: searchResult.total,
                    shown: searchResult.cards.length,
                  })
                : t("foundCardsGeneric", {
                    total: searchResult.total,
                  })}
            </div>
            <CardList cards={searchResult.cards} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              hasResults={searchResult.total > 0}
            />
          </div>
        ) : (
          <div style={{ textAlign: "center", color: colors.text.secondary }}>
            <p>{t("enterCardName")}</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
