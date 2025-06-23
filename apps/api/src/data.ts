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

  const matches = cards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchTerm) ||
      (card.name_ja && card.name_ja.toLowerCase().includes(searchTerm)) ||
      card.type.toLowerCase().includes(searchTerm) ||
      card.text.toLowerCase().includes(searchTerm)
  );

  return {
    cards: matches.slice(0, limit),
    total: matches.length,
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
