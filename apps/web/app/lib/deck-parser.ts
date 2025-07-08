import type { DeckEntry } from "./types";

export function parseDeckList(deckListText: string): DeckEntry[] {
  const lines = deckListText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

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
  // Remove comments (everything after // that's not part of a split card name)
  // Split card names use " // " (space before and after), comments use "//" without spaces
  let cleanLine = line;
  
  // Handle comments vs split cards more carefully
  // Split cards are typically at the start/middle of card names, comments are at the end
  if (line.includes('//')) {
    // Look for known split card patterns first
    const knownSplitCardPattern = /\b(Fire|Life|Assault|Night|Illusion|Rise|Wax|Order|Stand|Turn|Hit)\s*\/\/\s*\w+/i;
    
    if (knownSplitCardPattern.test(line)) {
      // This contains a known split card, check if there's a comment after it
      const match = line.match(/^(.*?\b\w+\s*\/\/\s*\w+)(.*)/);
      if (match?.[2].trim().startsWith('//')) {
        // There's a comment after the split card
        cleanLine = match[1].trim();
      }
      // Otherwise leave the line as-is (it's just a split card)
    } else {
      // No known split card pattern, treat // as comment
      const commentIndex = line.indexOf('//');
      cleanLine = line.substring(0, commentIndex).trim();
    }
  }
  
  if (!cleanLine) return null;

  // Pattern 1: "40 Lightning Bolt" or "40x Lightning Bolt"
  const quantityFirst = cleanLine.match(/^(\d+)x?\s+(.+)$/);
  if (quantityFirst) {
    return {
      quantity: Number.parseInt(quantityFirst[1], 10),
      name: quantityFirst[2].trim()
    };
  }

  // Pattern 2: "Lightning Bolt x40" or "Lightning Bolt 40"
  const quantityLast = cleanLine.match(/^(.+?)\s+(?:x)?(\d+)$/);
  if (quantityLast) {
    return {
      quantity: Number.parseInt(quantityLast[2], 10),
      name: quantityLast[1].trim()
    };
  }

  // Pattern 3: Just card name (default quantity 1)
  if (cleanLine.length > 0) {
    return {
      quantity: 1,
      name: cleanLine
    };
  }

  return null;
}