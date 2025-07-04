import { useRef, useEffect, useState } from 'react';
import type { MagicCard } from '../lib/types';
import { generateScryfallUrl, formatPowerToughness } from '../lib/utils';
import { useThemedStyles } from '../hooks/useTheme';
import { useHydratedTranslation } from '../hooks/useHydratedTranslation';

interface CardDetailsProps {
  card: MagicCard;
  isMobile?: boolean;
}

function CardImage({ imageUrl, cardName }: { imageUrl: string; cardName: string }) {
  const { t } = useHydratedTranslation();
  const { colors } = useThemedStyles();
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

  const imageContainerStyle = {
    flexShrink: 0,
    maxWidth: "30vw",
    minWidth: "200px",
    width: "200px",
    height: "280px",
    aspectRatio: "5/7" as const,
    borderRadius: "8px",
    backgroundColor: colors.background.secondary,
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    borderRadius: "8px",
    backgroundColor: colors.background.secondary,
    border: `1px solid ${colors.border.primary}`,
  };

  const placeholderStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: colors.background.secondary,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    color: colors.text.secondary,
  };

  return (
    <div ref={imgRef} style={imageContainerStyle}>
      {isVisible && !hasError && (
        <img
          src={imageUrl}
          alt={cardName}
          onError={() => setHasError(true)}
          style={imageStyle}
        />
      )}
      {isVisible && hasError && (
        <div style={placeholderStyle}>
          {t("noImage")}
        </div>
      )}
      {!isVisible && (
        <div style={{ ...placeholderStyle, color: "transparent" }} />
      )}
    </div>
  );
}

export function CardDetails({ card, isMobile = false }: CardDetailsProps) {
  const { i18n, t } = useHydratedTranslation();
  const { colors } = useThemedStyles();

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '1.5rem',
      alignItems: 'flex-start'
    }}>
      {/* Card image */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexShrink: 0,
        width: isMobile ? '100%' : 'auto'
      }}>
        <CardImage imageUrl={card.image_small} cardName={card.name} />
      </div>
      
      {/* Card details text */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        width: '100%',
        minWidth: 0
      }}>
        {/* Card name with color indicators */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.5rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}>
          <h4 style={{ 
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: '600',
            color: card.banned ? colors.accent.red : colors.text.primary,
            minWidth: 0,
            wordBreak: "break-word",
          }}>
            {i18n.language === "ja" && card.name_ja !== null && `${card.name_ja} • `}
            <a
              href={generateScryfallUrl(card.name)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                textDecoration: "underline",
                textDecorationColor: colors.text.secondary,
              }}
            >
              {card.name}
            </a>
            {card.banned && (
              <span style={{ color: colors.accent.red, marginLeft: '0.5rem' }}>
                ({t('banned')})
              </span>
            )}
          </h4>
          
          {/* Color indicators */}
          <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
            {card.w && <span style={{ color: "#fbbf24" }}>W</span>}
            {card.u && <span style={{ color: "#3b82f6" }}>U</span>}
            {card.b && <span style={{ color: "#6b7280" }}>B</span>}
            {card.r && <span style={{ color: "#ef4444" }}>R</span>}
            {card.g && <span style={{ color: "#10b981" }}>G</span>}
            {card.c && <span style={{ color: "#9ca3af" }}>C</span>}
          </div>
        </div>
        
        {/* Type, mana value, power/toughness */}
        <div style={{ 
          fontSize: '0.875rem',
          marginBottom: '0.75rem'
        }}>
          <span>{card.type}</span>
          <span> • </span>
          <span>{t('cmc')}: {card.mv}</span>
          {card.power && card.toughness && (
            <>
              <span> • </span>
              <span>{formatPowerToughness(card.power)}/{formatPowerToughness(card.toughness)}</span>
            </>
          )}
        </div>
        
        {/* Card text in "well" style */}
        {card.text && (
          <div style={{ 
            fontSize: '0.875rem',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: colors.text.primary,
            backgroundColor: colors.background.primary,
            padding: '0.75rem',
            borderRadius: '6px',
            border: `1px solid ${colors.border.primary}`,
            margin: 0,
          }}>
            {card.text}
          </div>
        )}
      </div>
    </div>
  );
}