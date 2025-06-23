import { useTranslation } from "react-i18next";
import type { MagicCard } from "../lib/types";

interface CardListProps {
  cards: MagicCard[];
}

export function CardList({ cards }: CardListProps) {
  const { i18n } = useTranslation();
  if (cards.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
        No cards found. Try a different search term.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {cards.map((card) => (
        <div
          key={card.oracle_id}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "1.5rem",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "0.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                margin: 0,
                color: card.banned ? "#dc2626" : "#111827",
              }}
            >
              {i18n.language === "ja" &&
                card.name_ja !== null &&
                `${card.name_ja} • `}
              {card.name}
              {card.banned && (
                <span style={{ color: "#dc2626", marginLeft: "0.5rem" }}>
                  (Banned)
                </span>
              )}
            </h3>
            <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
              {card.w && <span style={{ color: "#fbbf24" }}>W</span>}
              {card.u && <span style={{ color: "#3b82f6" }}>U</span>}
              {card.b && <span style={{ color: "#6b7280" }}>B</span>}
              {card.r && <span style={{ color: "#ef4444" }}>R</span>}
              {card.g && <span style={{ color: "#10b981" }}>G</span>}
              {card.c && <span style={{ color: "#9ca3af" }}>C</span>}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "0.75rem",
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            <span>{card.type}</span>
            <span>•</span>
            <span>{card.rarity}</span>
            <span>•</span>
            <span>CMC {card.mv}</span>
            {card.power && card.toughness && (
              <>
                <span>•</span>
                <span>
                  {card.power}/{card.toughness}
                </span>
              </>
            )}
          </div>

          {card.text && (
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: "1.5",
                color: "#4b5563",
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {card.text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
