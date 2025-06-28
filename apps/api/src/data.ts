import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { MagicCard } from "./types.js";

// Handle both ES modules and CommonJS
const getCurrentDir = (): string => {
  if (typeof import.meta !== "undefined" && import.meta.url) {
    return dirname(fileURLToPath(import.meta.url));
  }
  return process.cwd();
};
const __dirname: string = getCurrentDir();

let cardsData: MagicCard[] | null = null;

export function loadCards(): MagicCard[] {
  if (cardsData === null) {
    const cardsPath = join(__dirname, "assets/cards.json");
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
  limit: number = 50
): { cards: MagicCard[]; total: number } {
  const cards = loadCards();

  if (!query.trim()) {
    return {
      cards: cards.slice(0, limit),
      total: cards.length,
    };
  }

  const searchTerm = query.toLowerCase().trim();

  let matches = cards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchTerm) ||
      (card.name_ja && card.name_ja.toLowerCase().includes(searchTerm)) ||
      card.type.toLowerCase().includes(searchTerm) ||
      card.text.toLowerCase().includes(searchTerm)
  );

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

  // Add perfectMatch flag and sort matches to prioritize perfect matches
  const cardsWithPerfectMatch = matches.map((card) => {
    const cardNameLower = card.name.toLowerCase();
    const cardNameJa = card.name_ja?.toLowerCase();
    
    const isExactMatch = cardNameLower === searchTerm;
    const isExactMatchJa = cardNameJa === searchTerm;
    const perfectMatch = isExactMatch || isExactMatchJa;
    
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
    cards: sortedMatches.slice(0, limit),
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
): Array<{ name: string; found: boolean; banned: boolean; matchedName: string | null; matchedNameJa: string | null }> {
  const cards = loadCards();
  
  return cardNames.map((cardName) => {
    const trimmedName = cardName.trim();
    const normalizedName = trimmedName.toLowerCase();
    
    // Find card by exact name match (case-insensitive)
    const foundCard = cards.find(
      (card) =>
        card.name.toLowerCase() === normalizedName ||
        (card.name_ja && card.name_ja.toLowerCase() === normalizedName)
    );
    
    return {
      name: trimmedName,
      found: !!foundCard,
      banned: foundCard?.banned ?? false,
      matchedName: foundCard?.name ?? null,
      matchedNameJa: foundCard?.name_ja ?? null,
    };
  });
}
