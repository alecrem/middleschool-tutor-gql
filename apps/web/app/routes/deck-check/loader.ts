import type { LoaderFunctionArgs } from "@remix-run/node";
import { validateCards, searchCards } from "../../lib/api";
import { parseDeckList } from "../../lib/deck-parser";
import type { DeckValidationResult } from "../../lib/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const deckList = url.searchParams.get("decklist");

  if (!deckList || deckList.trim() === "") {
    return { results: null, deckList: "", error: null };
  }

  // Check line count before processing
  const lines = deckList.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length > 100) {
    return {
      results: null,
      deckList,
      error: "deckLineLimitError",
    };
  }

  try {
    const entries = parseDeckList(deckList);
    const cardNames = entries.map((entry) => entry.name);
    const validationResults = await validateCards(cardNames);

    // Get unique found card names for fetching details
    const foundCardNames = validationResults
      .filter((v) => v.found && v.matchedName)
      .map((v) => v.matchedName as string)
      .filter((name, index, arr) => arr.indexOf(name) === index); // Remove duplicates

    // Fetch card details for all found cards
    const cardDetailsMap = new Map();
    if (foundCardNames.length > 0) {
      try {
        const cardDetailsPromises = foundCardNames.map((cardName) =>
          searchCards(cardName, undefined, undefined, 1, 0)
            .then(({ cards }) => ({ cardName, details: cards[0] || null }))
            .catch(() => ({ cardName, details: null }))
        );

        const cardDetailsResults = await Promise.all(cardDetailsPromises);
        cardDetailsResults.forEach(({ cardName, details }) => {
          if (details) {
            cardDetailsMap.set(cardName, details);
          }
        });
      } catch (error) {
        console.error("Failed to fetch some card details:", error);
      }
    }

    const results: DeckValidationResult[] = entries.map((entry) => {
      const validation = validationResults.find((v) => v.name === entry.name);
      const cardDetails = validation?.matchedName
        ? cardDetailsMap.get(validation.matchedName) || null
        : null;

      return {
        name: entry.name,
        quantity: entry.quantity,
        found: validation?.found ?? false,
        banned: validation?.banned ?? false,
        matchedName: validation?.matchedName ?? null,
        matchedNameJa: validation?.matchedNameJa ?? null,
        cardDetails,
      };
    });

    return { results, deckList, error: null };
  } catch (error) {
    console.error("Deck validation error:", error);
    return {
      results: null,
      deckList,
      error: "deckValidationError",
    };
  }
}
