import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Ban,
  MessageCircleQuestion,
} from "lucide-react";
import { useThemedStyles } from "../hooks/useTheme";
import { Icon } from "./Icon";
import { CardDetails } from "./CardDetails";
import type { DeckValidationResult } from "../lib/types";

interface ExpandableCardRowProps {
  result: DeckValidationResult;
  index: number;
  isJapanese?: boolean;
  isLast?: boolean;
}

export function ExpandableCardRow({
  result,
  index: _index,
  isJapanese = false,
  isLast = false,
}: ExpandableCardRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { colors } = useThemedStyles();

  // Handle responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check (client-side only)
    if (typeof window !== "undefined") {
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const canExpand = result.found && result.matchedName && result.cardDetails;

  const toggleExpanded = () => {
    if (canExpand) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      {/* Clickable row wrapper */}
      <button
        type="button"
        onClick={toggleExpanded}
        disabled={!canExpand}
        aria-label={
          canExpand
            ? isExpanded
              ? "Collapse card details"
              : "Expand card details"
            : undefined
        }
        style={{
          display: "contents",
          cursor: canExpand ? "pointer" : "default",
          background: "none",
          border: "none",
          padding: 0,
          margin: 0,
          font: "inherit",
          color: "inherit",
        }}
      >
        {/* Main card row */}
        <div
          style={{
            color: result.banned
              ? colors.accent.red
              : !result.found
                ? colors.accent.orange
                : "inherit",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {result.quantity}{" "}
          {result.found && result.matchedName
            ? result.matchedName
            : result.name}
        </div>

        {/* Japanese name column (if applicable) */}
        {isJapanese && (
          <div
            style={{
              color: result.banned
                ? colors.accent.red
                : !result.found
                  ? colors.accent.orange
                  : "inherit",
              textAlign: "left",
            }}
          >
            {result.quantity}{" "}
            {result.found && result.matchedNameJa
              ? result.matchedNameJa
              : result.found && result.matchedName
                ? result.matchedName
                : result.name}
          </div>
        )}

        {/* Status column */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {result.banned && (
            <Icon icon={Ban} size="sm" color={colors.accent.red} />
          )}
          {!result.found && (
            <Icon
              icon={MessageCircleQuestion}
              size="sm"
              color={colors.accent.orange}
            />
          )}
        </div>

        {/* Expand button column - dedicated column for consistent alignment */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2rem",
            flexShrink: 0,
            marginLeft: "-0.5rem",
          }}
        >
          {canExpand ? (
            <div
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: colors.text.secondary,
                display: "flex",
                alignItems: "center",
                padding: "0.25rem",
                borderRadius: "4px",
              }}
              title={
                isExpanded ? "Collapse card details" : "Expand card details"
              }
            >
              <Icon icon={isExpanded ? ChevronDown : ChevronRight} size="sm" />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.25rem",
                opacity: 0.3,
              }}
            >
              <Icon
                icon={ChevronRight}
                size="sm"
                color={colors.text.secondary}
              />
            </div>
          )}
        </div>
      </button>

      {/* Expanded card details - using pre-loaded data */}
      {isExpanded && canExpand && result.cardDetails && (
        <div
          style={{
            gridColumn: isJapanese ? "span 4" : "span 3",
            padding: "1rem",
            backgroundColor: colors.background.secondary,
            borderRadius: "8px",
            margin: "0.5rem 0",
            border: `1px solid ${colors.border.primary}`,
          }}
        >
          <CardDetails card={result.cardDetails} isMobile={isMobile} />
        </div>
      )}

      {/* Full-width border separator after complete card (except for last card) */}
      {!isLast && (
        <div
          style={{
            gridColumn: isJapanese ? "span 4" : "span 3",
            borderBottom: `1px solid ${colors.border.primary}`,
            paddingBottom: "0.5rem",
            marginBottom: "0.5rem",
            marginLeft: "-1rem",
            marginRight: "-1rem",
          }}
        />
      )}
    </>
  );
}
