import { useState, useEffect } from "react";
import type { MagicCard } from "../lib/types";
import { useThemedStyles } from "../hooks/useTheme";
import { useHydratedTranslation } from "../hooks/useHydratedTranslation";
import { StyledCard } from "./StyledCard";
import { CardDetails } from "./CardDetails";

interface CardListProps {
  cards: MagicCard[];
}


export function CardList({ cards }: CardListProps) {
  const { t } = useHydratedTranslation();
  const { smallText } = useThemedStyles();
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);
  
  if (cards.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          ...smallText,
        }}
      >
        {t("noCardsFound")}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {cards.map((card) => (
        <StyledCard
          key={card.oracle_id}
          highlighted={card.perfectMatch}
        >
          <CardDetails card={card} isMobile={isMobile} />
        </StyledCard>
      ))}
    </div>
  );
}
