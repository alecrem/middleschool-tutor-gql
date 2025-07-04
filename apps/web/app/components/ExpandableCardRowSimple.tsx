import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { generateScryfallUrl } from '../lib/utils';
import { useThemedStyles } from '../hooks/useTheme';
import { Icon } from './Icon';
import type { DeckValidationResult } from '../lib/types';
import { useHydratedTranslation } from '../hooks/useHydratedTranslation';

interface ExpandableCardRowProps {
  result: DeckValidationResult;
  index: number;
  isJapanese?: boolean;
}

export function ExpandableCardRowSimple({ result, index, isJapanese = false }: ExpandableCardRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { colors } = useThemedStyles();
  const { t } = useHydratedTranslation();

  const canExpand = result.found && result.matchedName && result.cardDetails;

  const toggleExpanded = () => {
    if (canExpand) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <React.Fragment key={`${index}-expandable-row`}>
      {/* Main card row */}
      <div style={{ 
        color: result.banned ? colors.accent.red : !result.found ? colors.accent.orange : "inherit",
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {result.quantity}{" "}
        {result.found && result.matchedName ? (
          <a
            href={generateScryfallUrl(result.matchedName)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "underline",
              textDecorationColor: colors.text.secondary,
            }}
          >
            {result.matchedName}
          </a>
        ) : (
          result.name
        )}
      </div>
      
      {/* Japanese name column (if applicable) */}
      {isJapanese && (
        <div style={{ 
          color: result.banned ? colors.accent.red : !result.found ? colors.accent.orange : "inherit" 
        }}>
          {result.quantity}{" "}
          {result.found && result.matchedNameJa
            ? result.matchedNameJa
            : result.found && result.matchedName
            ? result.matchedName
            : result.name}
        </div>
      )}
      
      {/* Status column with expand button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {result.banned && (
          <span style={{ color: colors.accent.red, fontWeight: "600" }}>
            {t("bannedLabel")}
          </span>
        )}
        {!result.found && (
          <span style={{ color: colors.accent.orange, fontWeight: "600" }}>
            {t("notFound")}
          </span>
        )}
        {canExpand && (
          <button
            onClick={toggleExpanded}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.text.secondary,
              display: 'flex',
              alignItems: 'center',
              padding: '0.25rem',
              borderRadius: '4px',
            }}
            title={isExpanded ? 'Collapse card details' : 'Expand card details'}
          >
            <Icon 
              icon={isExpanded ? ChevronDown : ChevronRight} 
              size="sm" 
            />
          </button>
        )}
      </div>
      
      {/* Expanded card details - using pre-loaded data */}
      {isExpanded && canExpand && result.cardDetails && (
        <div style={{ 
          gridColumn: isJapanese ? 'span 3' : 'span 2',
          padding: '1rem',
          backgroundColor: colors.background.secondary,
          borderRadius: '8px',
          margin: '0.5rem 0',
          border: `1px solid ${colors.border.primary}`,
        }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '1rem',
            alignItems: 'start'
          }}>
            {/* Card image */}
            <div style={{ minWidth: '150px', maxWidth: '200px' }}>
              <img
                src={result.cardDetails.image_small}
                alt={result.cardDetails.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border.primary}`,
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            
            {/* Card details text */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              minWidth: 0
            }}>
              <h4 style={{ 
                margin: 0,
                fontSize: '1.125rem',
                fontWeight: '600',
                color: result.cardDetails.banned ? colors.accent.red : colors.text.primary
              }}>
                {result.cardDetails.name}
                {result.cardDetails.name_ja && (
                  <div style={{ 
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    color: colors.text.secondary,
                    marginTop: '0.25rem'
                  }}>
                    {result.cardDetails.name_ja}
                  </div>
                )}
              </h4>
              
              <div style={{ fontSize: '0.875rem' }}>
                <div><strong>Type:</strong> {result.cardDetails.type}</div>
                <div><strong>Mana Value:</strong> {result.cardDetails.mv}</div>
                {result.cardDetails.power && result.cardDetails.toughness && (
                  <div><strong>P/T:</strong> {result.cardDetails.power}/{result.cardDetails.toughness}</div>
                )}
                <div><strong>Rarity:</strong> {result.cardDetails.rarity}</div>
              </div>
              
              {result.cardDetails.text && (
                <div style={{ 
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  color: colors.text.primary,
                  backgroundColor: colors.background.primary,
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: `1px solid ${colors.border.primary}`,
                }}>
                  {result.cardDetails.text}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}