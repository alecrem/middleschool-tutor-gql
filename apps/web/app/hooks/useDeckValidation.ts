import { useCallback } from "react";
import type { DeckValidationResult } from "../lib/types";
import {
  separateDeckSections,
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
  // Calculate deck sections and counts
  const deckSections = separateDeckSections(results);

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
    // Deck sections and counts
    ...deckSections,

    // Validation results
    ...validation,

    // Message generation functions
    getValidationMessage: getValidationMessageCallback,
    getValidationErrors: getValidationErrorsCallback,
  };
}
