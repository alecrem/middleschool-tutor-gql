import { Link, useSearchParams } from "@remix-run/react";
import { useHydratedTranslation } from "../hooks/useHydratedTranslation";
import { useThemedStyles } from "../hooks/useTheme";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasResults: boolean;
}

export function Pagination({ currentPage, totalPages, hasResults }: PaginationProps) {
  const [searchParams] = useSearchParams();
  const { t } = useHydratedTranslation();
  const { colors } = useThemedStyles();

  // Don't show pagination if no results or only one page
  if (!hasResults || totalPages <= 1) {
    return null;
  }

  // Create URL with page parameter
  const createPageUrl = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    return `?${newParams.toString()}`;
  };

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        padding: "20px 0",
        borderTop: `1px solid ${colors.border.primary}`,
        marginTop: "20px",
      }}
    >
      {/* Previous button */}
      {hasPrevious ? (
        <Link
          to={createPageUrl(currentPage - 1)}
          style={{
            padding: "8px 16px",
            backgroundColor: colors.background.secondary,
            border: `1px solid ${colors.border.primary}`,
            borderRadius: "4px",
            textDecoration: "none",
            color: colors.text.primary,
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
          }}
        >
          ← {t("previous")}
        </Link>
      ) : (
        <span
          style={{
            padding: "8px 16px",
            backgroundColor: colors.button.disabled,
            border: `1px solid ${colors.border.secondary}`,
            borderRadius: "4px",
            color: colors.text.secondary,
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          ← {t("previous")}
        </span>
      )}

      {/* Page info */}
      <span
        style={{
          color: colors.text.secondary,
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        {t("pageInfo", { current: currentPage, total: totalPages })}
      </span>

      {/* Next button */}
      {hasNext ? (
        <Link
          to={createPageUrl(currentPage + 1)}
          style={{
            padding: "8px 16px",
            backgroundColor: colors.background.secondary,
            border: `1px solid ${colors.border.primary}`,
            borderRadius: "4px",
            textDecoration: "none",
            color: colors.text.primary,
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
          }}
        >
          {t("next")} →
        </Link>
      ) : (
        <span
          style={{
            padding: "8px 16px",
            backgroundColor: colors.button.disabled,
            border: `1px solid ${colors.border.secondary}`,
            borderRadius: "4px",
            color: colors.text.secondary,
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {t("next")} →
        </span>
      )}
    </div>
  );
}