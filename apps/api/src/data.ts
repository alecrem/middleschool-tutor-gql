import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { MagicCard } from "./types.js";

// Handle both ES modules and CommonJS
const getCurrentDir = (): string => {
  if (typeof import.meta !== "undefined" && import.meta.url) {
    return dirname(fileURLToPath(import.meta.url));
  }
  return process.cwd();
};
const Dirname: string = getCurrentDir();

let cardsData: MagicCard[] | null = null;

export function loadCards(): MagicCard[] {
  if (cardsData === null) {
    const cardsPath = join(Dirname, "assets/cards.json");
    console.log(`🔍 Loading cards from: ${cardsPath}`);
    console.log(`📂 Current directory: ${Dirname}`);
    const rawData = readFileSync(cardsPath, "utf-8");
    cardsData = JSON.parse(rawData) as MagicCard[];
    console.log(`📚 Loaded ${cardsData.length} cards`);
  }
  return cardsData as MagicCard[];
}

export function searchCards(
  query: string,
  cardType?: string,
  colors?: string[],
  limit: number = 20,
  offset: number = 0,
  powerMin?: number,
  powerMax?: number,
  toughnessMin?: number,
  toughnessMax?: number,
  cmcMin?: number,
  cmcMax?: number
): { cards: MagicCard[]; total: number } {
  const cards = loadCards();

  // If no query but filters are applied, start with all cards
  let matches = cards;
  const searchTerm = query.toLowerCase().trim();

  if (!query.trim()) {
    // If there's no query and no filters, return empty result to prompt for search
    if (
      !cardType &&
      (!colors || colors.length === 0) &&
      powerMin === undefined &&
      powerMax === undefined &&
      toughnessMin === undefined &&
      toughnessMax === undefined &&
      cmcMin === undefined &&
      cmcMax === undefined
    ) {
      return {
        cards: [],
        total: 0,
      };
    }
    // If there are filters but no query, start with all cards
  } else {
    // Apply text search if query exists
    matches = cards.filter(
      (card) =>
        card.name.toLowerCase().includes(searchTerm) ||
        card.name_ja?.toLowerCase().includes(searchTerm) ||
        card.type.toLowerCase().includes(searchTerm) ||
        card.text.toLowerCase().includes(searchTerm) ||
        matchesSplitCardSearch(card, searchTerm)
    );
  }

  // Apply card type filter if specified
  if (cardType && cardType.trim() !== "") {
    const normalizedCardType = cardType.toLowerCase();
    matches = matches.filter((card) =>
      card.type.toLowerCase().includes(normalizedCardType)
    );
  }

  // Apply color filter if specified
  if (colors && colors.length > 0) {
    matches = matches.filter((card) => {
      return colors.every((color) => {
        switch (color.toLowerCase()) {
          case "w":
            return card.w;
          case "u":
            return card.u;
          case "b":
            return card.b;
          case "r":
            return card.r;
          case "g":
            return card.g;
          default:
            return false;
        }
      });
    });
  }

  // Apply power filter if specified (only filter if parameters are provided and not default range)
  if (powerMin !== undefined && powerMax !== undefined) {
    matches = matches.filter((card) => {
      const power = Number.parseFloat(card.power || "0");
      return power >= powerMin && power <= powerMax;
    });
  }

  // Apply toughness filter if specified (only filter if parameters are provided and not default range)
  if (toughnessMin !== undefined && toughnessMax !== undefined) {
    matches = matches.filter((card) => {
      const toughness = Number.parseFloat(card.toughness || "0");
      return toughness >= toughnessMin && toughness <= toughnessMax;
    });
  }

  // Apply CMC filter if specified (only filter if parameters are provided and not default range)
  if (cmcMin !== undefined && cmcMax !== undefined) {
    matches = matches.filter((card) => {
      return card.mv >= cmcMin && card.mv <= cmcMax;
    });
  }

  // Add perfectMatch flag and sort matches to prioritize perfect matches
  const cardsWithPerfectMatch = matches.map((card) => {
    const cardNameLower = card.name.toLowerCase();
    const cardNameJa = card.name_ja?.toLowerCase();

    const isExactMatch = cardNameLower === searchTerm;
    const isExactMatchJa = cardNameJa === searchTerm;

    // Check for normalized split card match
    const isNormalizedMatch =
      cardNameLower.includes(" // ") &&
      normalizeSlashPattern(cardNameLower) ===
        normalizeSlashPattern(searchTerm);

    const perfectMatch = isExactMatch || isExactMatchJa || isNormalizedMatch;

    return { ...card, perfectMatch };
  });

  const sortedMatches = cardsWithPerfectMatch.sort((a, b) => {
    // Perfect matches come first
    if (a.perfectMatch && !b.perfectMatch) {
      return -1;
    }
    if (b.perfectMatch && !a.perfectMatch) {
      return 1;
    }

    // If both or neither are perfect matches, maintain original order
    return 0;
  });

  return {
    cards: sortedMatches.slice(offset, offset + limit),
    total: sortedMatches.length,
  };
}

export function getCardById(oracleId: string): MagicCard | null {
  const cards = loadCards();
  return cards.find((card) => card.oracle_id === oracleId) || null;
}

export function getCardsByColor(colors: string[]): MagicCard[] {
  const cards = loadCards();

  return cards.filter((card) => {
    return colors.every((color) => {
      switch (color.toLowerCase()) {
        case "w":
          return card.w;
        case "u":
          return card.u;
        case "b":
          return card.b;
        case "r":
          return card.r;
        case "g":
          return card.g;
        case "c":
          return card.c;
        default:
          return false;
      }
    });
  });
}

export function validateCards(
  cardNames: string[]
): Array<{
  name: string;
  found: boolean;
  banned: boolean;
  matchedName: string | null;
  matchedNameJa: string | null;
}> {
  // Reject requests with more than 100 cards
  if (cardNames.length > 100) {
    throw new Error("Deck list must not exceed 100 lines");
  }

  const cards = loadCards();

  return cardNames.map((cardName) => {
    const trimmedName = cardName.trim();
    const normalizedName = trimmedName.toLowerCase();

    // Find card by exact name match (case-insensitive)
    let foundCard = cards.find(
      (card) =>
        card.name.toLowerCase() === normalizedName ||
        (card.name_ja && card.name_ja.toLowerCase() === normalizedName)
    );

    // If no exact match found, check for split card patterns
    if (!foundCard) {
      foundCard = findSplitCardMatch(cards, normalizedName);
    }

    return {
      name: trimmedName,
      found: !!foundCard,
      banned: foundCard?.banned ?? false,
      matchedName: foundCard?.name ?? null,
      matchedNameJa: foundCard?.name_ja ?? null,
    };
  });
}

function findSplitCardMatch(
  cards: MagicCard[],
  searchName: string
): MagicCard | undefined {
  // Normalize the search name by handling various slash patterns
  const normalizedSearchName = normalizeSlashPattern(searchName);

  return cards.find((card) => {
    const cardName = card.name.toLowerCase();

    // Check if this is a split card (contains " // ")
    if (cardName.includes(" // ")) {
      const normalizedCardName = normalizeSlashPattern(cardName);

      // Direct match after normalization
      if (normalizedCardName === normalizedSearchName) {
        return true;
      }
    }

    return false;
  });
}

function normalizeSlashPattern(name: string): string {
  // First handle double slashes, then single slashes (but not already processed ones)
  let result = name.replace(/\s*\/\/\s*/g, " // "); // "Fire//Ice" → "Fire // Ice"

  // Only replace single slashes if they're not already part of a " // " pattern
  if (!result.includes(" // ")) {
    result = result.replace(/\s*\/\s*/g, " // "); // "Fire / Ice" or "Fire/Ice" → "Fire // Ice"
  }

  return result.trim();
}

function matchesSplitCardSearch(card: MagicCard, searchTerm: string): boolean {
  const cardName = card.name.toLowerCase();

  // Check if this is a split card (contains " // ")
  if (cardName.includes(" // ")) {
    const normalizedSearchTerm = normalizeSlashPattern(searchTerm);
    const normalizedCardName = normalizeSlashPattern(cardName);

    // Direct match after normalization
    if (normalizedCardName.includes(normalizedSearchTerm)) {
      return true;
    }

    // Check if search matches either half of the split card
    const [leftHalf, rightHalf] = cardName.split(" // ");
    if (leftHalf.includes(searchTerm) || rightHalf.includes(searchTerm)) {
      return true;
    }
  }

  return false;
}
