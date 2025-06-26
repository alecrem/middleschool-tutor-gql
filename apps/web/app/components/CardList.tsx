import { useTranslation } from "react-i18next";
import { useRef, useEffect, useState } from "react";
import type { MagicCard } from "../lib/types";
import { generateScryfallUrl } from "../lib/utils";

interface CardListProps {
  cards: MagicCard[];
}

interface CardImageProps {
  imageUrl: string;
  cardName: string;
}

function CardImage({ imageUrl, cardName }: CardImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="card-image" style={{ 
      width: "200px", 
      height: "280px", 
      flexShrink: 0,
      maxWidth: "30vw",
      aspectRatio: "5/7" // Standard Magic card ratio
    }}>
      {isVisible && !hasError && (
        <img
          src={imageUrl}
          alt={cardName}
          onError={() => setHasError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
            backgroundColor: "#f3f4f6"
          }}
        />
      )}
      {isVisible && hasError && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            fontSize: "0.875rem"
          }}
        >
          No image
        </div>
      )}
      {!isVisible && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px"
          }}
        />
      )}
    </div>
  );
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
            border: card.perfectMatch 
              ? "3px solid #374151" 
              : "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "1rem",
            backgroundColor: "#ffffff",
            boxShadow: card.perfectMatch
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}
        >
          {/* Mobile-first layout with responsive image placement */}
          <div className="card-layout" style={{
            display: "flex", 
            flexDirection: "row", 
            gap: "1rem",
            minWidth: 0 // Allow flex items to shrink below their content size
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.5rem",
                  flexWrap: "wrap",
                  gap: "0.5rem"
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    margin: 0,
                    color: card.banned ? "#dc2626" : "#111827",
                    minWidth: 0,
                    wordBreak: "break-word"
                  }}
                >
                  {i18n.language === "ja" &&
                    card.name_ja !== null &&
                    `${card.name_ja} • `}
                  <a
                    href={generateScryfallUrl(card.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "inherit",
                      textDecoration: "underline",
                      textDecorationColor: "#9ca3af",
                    }}
                  >
                    {card.name}
                  </a>
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
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  flexWrap: "wrap"
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
                    wordBreak: "break-word"
                  }}
                >
                  {card.text}
                </p>
              )}
            </div>
            
            {/* Image container with responsive sizing */}
            <div style={{ flexShrink: 0 }}>
              <CardImage imageUrl={card.image_small} cardName={card.name} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
