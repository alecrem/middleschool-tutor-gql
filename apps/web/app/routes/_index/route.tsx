import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { useHydratedTranslation } from "../../hooks/useHydratedTranslation";
import { CardList } from "../../components/CardList";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";
import { SearchControls } from "../../components/SearchControls";
import { Footer } from "../../components/Footer";
import { Pagination } from "../../components/Pagination";
import { Navigation } from "../../components/Navigation";
import { ShareButton } from "../../components/ShareButton";
import { useThemedStyles } from "../../hooks/useTheme";
import { generateSearchShareUrl, extractSearchParamsFromUrl } from "../../lib/urlUtils";
import { loader } from "./loader";

export { loader };

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
  const { t } = useHydratedTranslation();
  const { colors } = useThemedStyles();
  const location = useLocation();

  // Generate share URL for current search
  const currentSearchParams = extractSearchParamsFromUrl(new URLSearchParams(location.search));
  const shareUrl = generateSearchShareUrl(currentSearchParams);

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
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "1rem", 
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              <div style={{ color: colors.text.secondary }}>
                {searchResult.total > searchResult.cards.length
                  ? t("foundCardsGenericPartial", {
                      total: searchResult.total,
                      start: (page - 1) * 20 + 1,
                      end: (page - 1) * 20 + searchResult.cards.length,
                    })
                  : t("foundCardsGeneric", {
                      total: searchResult.total,
                    })}
              </div>
              {searchResult.total > 0 && (
                <ShareButton
                  url={shareUrl}
                  label={t("shareSearch")}
                  size="sm"
                />
              )}
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