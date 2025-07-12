import type { DeckEntry } from "./types";

export function parseDeckList(deckListText: string): DeckEntry[] {
  // Find the last "\n\n" that has valid cards after it
  const doubleLinesBreak = "\n\n";
  let sideboardStartIndex = -1;

  // Look for all double line breaks and check if there are valid cards after each
  let searchIndex = deckListText.indexOf(doubleLinesBreak);
  while (searchIndex !== -1) {
    const textAfter = deckListText.substring(
      searchIndex + doubleLinesBreak.length
    );
    const linesAfter = textAfter
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Check if any of the lines after this break contain valid cards
    const hasValidCards = linesAfter.some(
      (line) => parseDeckLine(line) !== null
    );

    if (hasValidCards) {
      sideboardStartIndex = searchIndex + doubleLinesBreak.length;
    }

    searchIndex = deckListText.indexOf(doubleLinesBreak, searchIndex + 1);
  }

  let mainDeckText: string;
  let sideboardText: string;

  if (sideboardStartIndex !== -1) {
    mainDeckText = deckListText.substring(
      0,
      sideboardStartIndex - doubleLinesBreak.length
    );
    sideboardText = deckListText.substring(sideboardStartIndex);
  } else {
    mainDeckText = deckListText;
    sideboardText = "";
  }

  const entries: DeckEntry[] = [];

  // Parse main deck
  const mainLines = mainDeckText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  for (const line of mainLines) {
    const entry = parseDeckLine(line);
    if (entry) {
      entries.push({ ...entry, section: "main" });
    }
  }

  // Parse sideboard
  const sideboardLines = sideboardText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  for (const line of sideboardLines) {
    const entry = parseDeckLine(line);
    if (entry) {
      entries.push({ ...entry, section: "sideboard" });
    }
  }

  return entries;
}

function parseDeckLine(line: string): Omit<DeckEntry, "section"> | null {
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
