import { useCallback } from "react";
import type { DeckValidationResult } from "../lib/types";
import {
  separateDeckSections,
  separateDeckSectionsForDisplay,
  validateDeck,
  getValidationErrors,
  getValidationMessage,
} from "../lib/deckValidation";

/**
 * Custom hook for deck validation logic
 */
export function useDeckValidation(
  results: DeckValidationResult[] | null,
  t: (key: string) => string,
  language: string
) {
  // Calculate deck sections and counts (for validation)
  const deckSections = separateDeckSections(results);

  // Calculate consolidated deck sections (for display)
  const displaySections = separateDeckSectionsForDisplay(results);

  // Perform validation
  const validation = validateDeck(results);

  // Generate validation message
  const getValidationMessageCallback = useCallback(() => {
    return getValidationMessage(validation, t, language);
  }, [validation, t, language]);

  // Get validation errors for bullet list
  const getValidationErrorsCallback = useCallback(() => {
    return getValidationErrors(validation, t);
  }, [validation, t]);

  return {
    // Deck sections and counts (for validation logic)
    ...deckSections,

    // Consolidated deck sections (for display)
    mainDeckCardsDisplay: displaySections.mainDeckCards,
    sideboardCardsDisplay: displaySections.sideboardCards,

    // Validation results
    ...validation,

    // Message generation functions
    getValidationMessage: getValidationMessageCallback,
    getValidationErrors: getValidationErrorsCallback,
  };
}
