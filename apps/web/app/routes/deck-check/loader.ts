import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { validateCards } from "../../lib/api";
import { parseDeckList } from "../../lib/deck-parser";
import type { DeckValidationResult } from "../../lib/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const deckList = url.searchParams.get("decklist");

  if (!deckList || deckList.trim() === "") {
    return json({ results: null, deckList: "", error: null });
  }

  // Check line count before processing
  const lines = deckList.split('\n').filter(line => line.trim().length > 0);
  if (lines.length > 100) {
    return json({
      results: null,
      deckList,
      error: "deckLineLimitError",
    });
  }

  try {
    const entries = parseDeckList(deckList);
    const cardNames = entries.map((entry) => entry.name);
    const validationResults = await validateCards(cardNames);

    const results: DeckValidationResult[] = entries.map((entry) => {
      const validation = validationResults.find((v) => v.name === entry.name);
      return {
        name: entry.name,
        quantity: entry.quantity,
        found: validation?.found ?? false,
        banned: validation?.banned ?? false,
        matchedName: validation?.matchedName ?? null,
        matchedNameJa: validation?.matchedNameJa ?? null,
      };
    });

    return json({ results, deckList, error: null });
  } catch (error) {
    console.error("Deck validation error:", error);
    return json({
      results: null,
      deckList,
      error: "deckValidationError",
    });
  }
}