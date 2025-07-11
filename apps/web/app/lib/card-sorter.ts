import type { DeckValidationResult, MagicCard } from "./types";

// Card type priority order as specified in the requirements
const CARD_TYPE_PRIORITY = {
  creature: 1,
  sorcery: 2,
  instant: 3,
  enchantment: 4,
  artifact: 5,
  land: 6,
} as const;

/**
 * Extracts the primary card type from a type line string
 * Handles multi-type cards by returning the first recognized type
 */
function getPrimaryCardType(typeLine: string): string {
  const normalizedType = typeLine.toLowerCase();

  // Check for each type in priority order
  for (const [type] of Object.entries(CARD_TYPE_PRIORITY)) {
    if (normalizedType.includes(type)) {
      return type;
    }
  }

  // If no recognized type found, return the first word as fallback
  return normalizedType.split(" ")[0] || "unknown";
}

/**
 * Gets the sort priority for a card type
 * Lower numbers sort first
 */
function getCardTypePriority(typeLine: string): number {
  const primaryType = getPrimaryCardType(typeLine);
  return (
    CARD_TYPE_PRIORITY[primaryType as keyof typeof CARD_TYPE_PRIORITY] || 999
  );
}

/**
 * Sorts deck validation results by card type, mana value, and English name
 * Cards not found in the database maintain their original relative order at the end
 */
export function sortDeckValidationResults(
  results: DeckValidationResult[]
): DeckValidationResult[] {
  return results.sort((a, b) => {
    // Cards not found should maintain their original order at the end
    if (!a.found && !b.found) return 0;
    if (!a.found) return 1;
    if (!b.found) return -1;

    // Both cards are found - sort by hierarchy
    const aCard = a.cardDetails;
    const bCard = b.cardDetails;

    // If either card lacks details, maintain original order
    if (!aCard || !bCard) return 0;

    // 1. Sort by card type
    const aTypePriority = getCardTypePriority(aCard.type);
    const bTypePriority = getCardTypePriority(bCard.type);

    if (aTypePriority !== bTypePriority) {
      return aTypePriority - bTypePriority;
    }

    // 2. Sort by mana value (ascending)
    if (aCard.mv !== bCard.mv) {
      return aCard.mv - bCard.mv;
    }

    // 3. Sort by English card name (alphabetical)
    return aCard.name.localeCompare(bCard.name);
  });
}

/**
 * Sorts an array of MagicCard objects by the same hierarchy
 * Used for contexts where we have direct card objects
 */
export function sortMagicCards(cards: MagicCard[]): MagicCard[] {
  return cards.sort((a, b) => {
    // 1. Sort by card type
    const aTypePriority = getCardTypePriority(a.type);
    const bTypePriority = getCardTypePriority(b.type);

    if (aTypePriority !== bTypePriority) {
      return aTypePriority - bTypePriority;
    }

    // 2. Sort by mana value (ascending)
    if (a.mv !== b.mv) {
      return a.mv - b.mv;
    }

    // 3. Sort by English card name (alphabetical)
    return a.name.localeCompare(b.name);
  });
}
