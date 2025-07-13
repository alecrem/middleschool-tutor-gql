import type { DeckValidationResult } from "./types";

/**
 * Check if a card is a basic land based on its type line
 * This covers both regular basic lands and basic snow lands
 */
function isBasicLand(cardDetails?: { type: string } | null): boolean {
  if (!cardDetails?.type) return false;
  return (
    cardDetails.type.includes("Basic") && cardDetails.type.includes("Land")
  );
}

/**
 * Count total copies of each unique card name across all sections
 * Returns a map of card name -> total copies
 */
function countCardCopies(results: DeckValidationResult[]): Map<string, number> {
  const cardCounts = new Map<string, number>();

  for (const result of results) {
    // Use the matched name if available, otherwise fall back to the original name
    const cardName = result.matchedName || result.name;
    const quantity =
      Number.parseInt(result.quantity.toString().replace(/x$/i, "")) || 1;

    cardCounts.set(cardName, (cardCounts.get(cardName) || 0) + quantity);
  }

  return cardCounts;
}

/**
 * Validate the 4-copy rule and return cards that violate it
 * Basic lands are exempt from this rule
 */
function validateCopyLimits(results: DeckValidationResult[]): string[] {
  const cardCounts = countCardCopies(results);
  const violatingCards: string[] = [];

  // Create a map of card names to their details for basic land checking
  const cardDetailsMap = new Map<string, DeckValidationResult>();
  for (const result of results) {
    const cardName = result.matchedName || result.name;
    if (!cardDetailsMap.has(cardName)) {
      cardDetailsMap.set(cardName, result);
    }
  }

  for (const [cardName, totalCopies] of cardCounts) {
    if (totalCopies > 4) {
      const cardResult = cardDetailsMap.get(cardName);

      // Check if this is a basic land (exempt from 4-copy rule)
      if (!isBasicLand(cardResult?.cardDetails)) {
        violatingCards.push(cardName);
      }
    }
  }

  return violatingCards;
}

/**
 * Consolidate duplicate card entries for display purposes
 * Groups cards by name and sums their quantities
 */
export function consolidateCardsForDisplay(
  results: DeckValidationResult[]
): DeckValidationResult[] {
  const cardMap = new Map<string, DeckValidationResult>();

  for (const result of results) {
    // Use the matched name if available, otherwise fall back to the original name
    const cardName = result.matchedName || result.name;

    if (cardMap.has(cardName)) {
      // Add to existing entry
      const existing = cardMap.get(cardName);
      if (!existing) continue;
      const quantity =
        Number.parseInt(result.quantity.toString().replace(/x$/i, "")) || 1;
      const existingQuantity =
        Number.parseInt(existing.quantity.toString().replace(/x$/i, "")) || 1;

      existing.quantity = existingQuantity + quantity;
    } else {
      // Create new entry (make a copy to avoid mutating original)
      cardMap.set(cardName, {
        ...result,
        name: cardName, // Use the matched name for consistency
        quantity:
          Number.parseInt(result.quantity.toString().replace(/x$/i, "")) || 1,
      });
    }
  }

  return Array.from(cardMap.values());
}

/**
 * Calculate the total number of cards in a deck section
 */
export function calculateCardCount(cards: DeckValidationResult[]): number {
  return cards.reduce((sum, result) => {
    const quantity =
      Number.parseInt(result.quantity.toString().replace(/x$/i, "")) || 1;
    return sum + quantity;
  }, 0);
}

/**
 * Separate validation results by deck section
 */
export function separateDeckSections(results: DeckValidationResult[] | null) {
  if (!results) {
    return {
      mainDeckCards: [],
      sideboardCards: [],
      mainDeckCount: 0,
      sideboardCount: 0,
    };
  }

  const mainDeckCards = results.filter((result) => result.section === "main");
  const sideboardCards = results.filter(
    (result) => result.section === "sideboard"
  );

  return {
    mainDeckCards,
    sideboardCards,
    mainDeckCount: calculateCardCount(mainDeckCards),
    sideboardCount: calculateCardCount(sideboardCards),
  };
}

/**
 * Separate validation results by deck section with consolidated display
 * Consolidates duplicate card entries for better UI display
 */
export function separateDeckSectionsForDisplay(
  results: DeckValidationResult[] | null
) {
  if (!results) {
    return {
      mainDeckCards: [],
      sideboardCards: [],
      mainDeckCount: 0,
      sideboardCount: 0,
    };
  }

  const mainDeckCards = results.filter((result) => result.section === "main");
  const sideboardCards = results.filter(
    (result) => result.section === "sideboard"
  );

  const consolidatedMainDeck = consolidateCardsForDisplay(mainDeckCards);
  const consolidatedSideboard = consolidateCardsForDisplay(sideboardCards);

  return {
    mainDeckCards: consolidatedMainDeck,
    sideboardCards: consolidatedSideboard,
    mainDeckCount: calculateCardCount(mainDeckCards), // Use original for accurate count
    sideboardCount: calculateCardCount(sideboardCards), // Use original for accurate count
  };
}

/**
 * Perform all deck validation checks
 */
export function validateDeck(results: DeckValidationResult[] | null) {
  if (!results) {
    return {
      bannedCards: [],
      notFoundCards: [],
      copyLimitViolations: [],
      hasBannedCards: false,
      hasUnknownCards: false,
      hasCopyLimitViolations: false,
      mainDeckTooSmall: false,
      sideboardTooLarge: false,
      isDeckValid: true,
    };
  }

  const bannedCards = results.filter((result) => result.banned);
  const notFoundCards = results.filter((result) => !result.found);
  const copyLimitViolations = validateCopyLimits(results);
  const { mainDeckCount, sideboardCount } = separateDeckSections(results);

  const hasBannedCards = bannedCards.length > 0;
  const hasUnknownCards = notFoundCards.length > 0;
  const hasCopyLimitViolations = copyLimitViolations.length > 0;
  const mainDeckTooSmall = results.length > 0 && mainDeckCount < 60;
  const sideboardTooLarge = sideboardCount > 15;

  const isDeckValid =
    !hasBannedCards &&
    !hasUnknownCards &&
    !hasCopyLimitViolations &&
    !mainDeckTooSmall &&
    !sideboardTooLarge;

  return {
    bannedCards,
    notFoundCards,
    copyLimitViolations,
    hasBannedCards,
    hasUnknownCards,
    hasCopyLimitViolations,
    mainDeckTooSmall,
    sideboardTooLarge,
    isDeckValid,
  };
}

/**
 * Get all validation error reasons
 */
export function getValidationErrors(
  validation: ReturnType<typeof validateDeck>,
  t: (key: string) => string
): string[] {
  if (validation.isDeckValid) return [];

  const errors: string[] = [];
  if (validation.hasBannedCards) errors.push(t("deckContainsBannedCards"));
  if (validation.hasUnknownCards) errors.push(t("deckContainsUnknownCards"));
  if (validation.hasCopyLimitViolations)
    errors.push(t("deckContainsTooManyCopies"));
  if (validation.mainDeckTooSmall) errors.push(t("mainDeckTooFew"));
  if (validation.sideboardTooLarge) errors.push(t("sideboardTooMany"));

  return errors;
}

/**
 * Generate the main validation message
 */
export function getValidationMessage(
  validation: ReturnType<typeof validateDeck>,
  t: (key: string) => string,
  language: string
): string {
  if (validation.isDeckValid) return t("deckValid");

  const errors = getValidationErrors(validation, t);

  if (errors.length === 1) {
    const separator = language === "ja" ? "" : " ";
    return t("deckNotValid") + separator + errors[0];
  } else {
    return t("deckNotValid");
  }
}
