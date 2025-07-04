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
  
  // Only treat // as a comment if it's not part of a split card name
  // Split cards always have a specific pattern: "word // word" 
  // Comments are everything after // that isn't part of a split card
  if (line.includes('//')) {
    // Check if this looks like a split card pattern (word // word)
    const splitCardPattern = /\b\w+\s*\/\/\s*\w+\b/;
    if (!splitCardPattern.test(line)) {
      // No split card pattern found, treat // as comment
      const commentIndex = line.indexOf('//');
      cleanLine = line.substring(0, commentIndex).trim();
    } else {
      // Contains split card pattern, only remove comments after the split card
      const match = line.match(/^(.*?\b\w+\s*\/\/\s*\w+\b)(.*)/);
      if (match && match[2].includes('//')) {
        // There's a comment after the split card
        cleanLine = match[1].trim();
      }
    }
  }
  
  if (!cleanLine) return null;

  // Pattern 1: "40 Lightning Bolt" or "40x Lightning Bolt"
  const quantityFirst = cleanLine.match(/^(\d+)x?\s+(.+)$/);
  if (quantityFirst) {
    return {
      quantity: parseInt(quantityFirst[1], 10),
      name: quantityFirst[2].trim()
    };
  }

  // Pattern 2: "Lightning Bolt x40" or "Lightning Bolt 40"
  const quantityLast = cleanLine.match(/^(.+?)\s+(?:x)?(\d+)$/);
  if (quantityLast) {
    return {
      quantity: parseInt(quantityLast[2], 10),
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