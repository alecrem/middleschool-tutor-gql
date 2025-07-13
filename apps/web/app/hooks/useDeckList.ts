import { useState, useEffect, useCallback } from "react";
import type { DeckValidationResult } from "../lib/types";
import { generateDeckCheckShareUrl } from "../lib/urlUtils";
import { decompressString } from "../lib/utils";
import { consolidateCardsForDisplay } from "../lib/deckValidation";

/**
 * Custom hook for deck list state and operations
 */
export function useDeckList(
  initialDeckList: string,
  compressed: string | undefined,
  results: DeckValidationResult[] | null,
  _isDeckValid: boolean
) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [currentDeckList, setCurrentDeckList] = useState(initialDeckList);
  const [lineCount, setLineCount] = useState(0);
  const [shareUrl, setShareUrl] = useState("/deck-check");
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(
    !!initialDeckList?.trim()
  );

  // Helper function to generate formatted deck list from validation results
  const generateFormattedDeckList = useCallback(
    (validationResults: typeof results) => {
      if (!validationResults) return "";

      const mainDeckCards = validationResults.filter(
        (result) => result.section === "main"
      );
      const sideboardCards = validationResults.filter(
        (result) => result.section === "sideboard"
      );

      // Consolidate duplicate cards within each section
      const consolidatedMainDeck = consolidateCardsForDisplay(mainDeckCards);
      const consolidatedSideboard = consolidateCardsForDisplay(sideboardCards);

      const formatCards = (cards: typeof validationResults) => {
        return cards
          .map((result) => {
            // Clean quantity - remove 'x' suffix and ensure it's a number
            const cleanQuantity = result.quantity.toString().replace(/x$/i, "");
            const quantity = Number.parseInt(cleanQuantity) || 1;

            // Use English matched name if found, otherwise original input
            const cardName =
              result.found && result.matchedName
                ? result.matchedName
                : result.name;

            return `${quantity} ${cardName}`;
          })
          .join("\n");
      };

      const mainDeckText = formatCards(consolidatedMainDeck);
      const sideboardText = formatCards(consolidatedSideboard);

      if (consolidatedSideboard.length > 0) {
        return `${mainDeckText}\n\n${sideboardText}`;
      } else {
        return mainDeckText;
      }
    },
    []
  );

  // Count lines in deck list
  useEffect(() => {
    const lines = currentDeckList
      .split("\n")
      .filter((line) => line.trim().length > 0);
    setLineCount(lines.length);
  }, [currentDeckList]);

  // Generate share URL for current deck check
  useEffect(() => {
    const generateUrl = async () => {
      if (results) {
        const deckListToShare = generateFormattedDeckList(results);
        setIsGeneratingUrl(true);
        try {
          const url = await generateDeckCheckShareUrl(deckListToShare);
          setShareUrl(url);
        } catch (error) {
          console.error("Failed to generate share URL:", error);
          setShareUrl("/deck-check");
        } finally {
          setIsGeneratingUrl(false);
        }
      } else {
        setShareUrl("/deck-check");
        setIsGeneratingUrl(false);
      }
    };
    generateUrl();
  }, [results, generateFormattedDeckList]);

  // Handle client-side decompression when compressed data is received from server
  useEffect(() => {
    if (compressed) {
      const handleDecompression = async () => {
        try {
          const decompressedDeckList = await decompressString(compressed);
          setCurrentDeckList(decompressedDeckList);

          // Auto-submit the form with the decompressed deck list
          const form = document.querySelector(
            'form[method="get"]'
          ) as HTMLFormElement;
          if (form) {
            const formData = new FormData(form);
            formData.set("decklist", decompressedDeckList);

            // Convert FormData to URL search params and navigate
            const params = new URLSearchParams();
            for (const [key, value] of formData.entries()) {
              if (typeof value === "string") {
                params.set(key, value);
              }
            }

            window.location.search = params.toString();
          }
        } catch (error) {
          console.error("Failed to decompress deck list on client:", error);
          // Handle decompression error - could show an error message
        }
      };
      handleDecompression();
    }
  }, [compressed]);

  // Copy deck list to clipboard
  const copyDeckListToClipboard = useCallback(async () => {
    if (!results) return;

    try {
      const deckListText = generateFormattedDeckList(results);
      await navigator.clipboard.writeText(deckListText);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (_error) {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  }, [results, generateFormattedDeckList]);

  const isOverLimit = lineCount > 100;
  const isNearLimit = lineCount > 90 && lineCount <= 100;
  const isDeckListEmpty = currentDeckList.trim().length === 0;

  return {
    // State
    copyStatus,
    currentDeckList,
    lineCount,
    shareUrl,
    isGeneratingUrl,

    // Derived state
    isOverLimit,
    isNearLimit,
    isDeckListEmpty,

    // Actions
    setCurrentDeckList,
    copyDeckListToClipboard,
  };
}
