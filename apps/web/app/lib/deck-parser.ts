import type { DeckEntry } from "./types";

export function parseDeckList(deckListText: string): DeckEntry[] {
  const lines = deckListText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const entries: DeckEntry[] = [];

  for (const line of lines) {
    const entry = parseDeckLine(line);
    if (entry) {
      entries.push(entry);
    }
  }

  return entries;
}

function parseDeckLine(line: string): DeckEntry | null {
  const cleanLine = line.trim();

  if (!cleanLine) return null;

  // Pattern 1: "40 Lightning Bolt" or "40x Lightning Bolt"
  const quantityFirst = cleanLine.match(/^(\d+)x?\s+(.+)$/);
  if (quantityFirst) {
    return {
      quantity: Number.parseInt(quantityFirst[1], 10),
      name: quantityFirst[2].trim(),
    };
  }

  // Pattern 2: "Lightning Bolt x40" or "Lightning Bolt 40"
  const quantityLast = cleanLine.match(/^(.+?)\s+(?:x)?(\d+)$/);
  if (quantityLast) {
    return {
      quantity: Number.parseInt(quantityLast[2], 10),
      name: quantityLast[1].trim(),
    };
  }

  // Pattern 3: Just card name (default quantity 1)
  if (cleanLine.length > 0) {
    return {
      quantity: 1,
      name: cleanLine,
    };
  }

  return null;
}
