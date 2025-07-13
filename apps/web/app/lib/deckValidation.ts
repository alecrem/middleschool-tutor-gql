import type { DeckValidationResult } from "./types";

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
 * Perform all deck validation checks
 */
export function validateDeck(results: DeckValidationResult[] | null) {
  if (!results) {
    return {
      bannedCards: [],
      notFoundCards: [],
      hasBannedCards: false,
      hasUnknownCards: false,
      mainDeckTooSmall: false,
      sideboardTooLarge: false,
      isDeckValid: true,
    };
  }

  const bannedCards = results.filter((result) => result.banned);
  const notFoundCards = results.filter((result) => !result.found);
  const { mainDeckCount, sideboardCount } = separateDeckSections(results);

  const hasBannedCards = bannedCards.length > 0;
  const hasUnknownCards = notFoundCards.length > 0;
  const mainDeckTooSmall = results.length > 0 && mainDeckCount < 60;
  const sideboardTooLarge = sideboardCount > 15;

  const isDeckValid =
    !hasBannedCards &&
    !hasUnknownCards &&
    !mainDeckTooSmall &&
    !sideboardTooLarge;

  return {
    bannedCards,
    notFoundCards,
    hasBannedCards,
    hasUnknownCards,
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
