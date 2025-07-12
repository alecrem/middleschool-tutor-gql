import { describe, test, expect } from "vitest";
import { parseDeckList } from "./deck-parser";

describe("parseDeckList", () => {
  test("should parse basic deck list with quantities", () => {
    const deckList = `4 Lightning Bolt
2 Counterspell
1 Black Lotus`;

    const result = parseDeckList(deckList);

    expect(result).toEqual([
      { quantity: 4, name: "Lightning Bolt", section: "main" },
      { quantity: 2, name: "Counterspell", section: "main" },
      { quantity: 1, name: "Black Lotus", section: "main" },
    ]);
  });

  test("should handle empty lines and whitespace", () => {
    const deckList = `4 Lightning Bolt

2 Counterspell
   
1 Black Lotus   `;

    const result = parseDeckList(deckList);

    // The double newline after "Lightning Bolt" creates a sideboard section
    expect(result).toEqual([
      { quantity: 4, name: "Lightning Bolt", section: "main" },
      { quantity: 2, name: "Counterspell", section: "sideboard" },
      { quantity: 1, name: "Black Lotus", section: "sideboard" },
    ]);
  });
});

describe("parseDeckLine", () => {
  // Import the internal function for more detailed testing
  // Note: This would need to be exported from deck-parser.ts for testing
  // For now, we'll test through parseDeckList

  test("should parse split cards with spaces", () => {
    const result = parseDeckList("4 Fire // Ice");
    expect(result).toEqual([
      { quantity: 4, name: "Fire // Ice", section: "main" },
    ]);
  });

  test("should parse split cards without spaces around slashes", () => {
    const result = parseDeckList("4 Fire//Ice");
    expect(result).toEqual([
      { quantity: 4, name: "Fire//Ice", section: "main" },
    ]);
  });

  test("should parse split cards with single slash and spaces", () => {
    const result = parseDeckList("1 Fire / Ice");
    expect(result).toEqual([
      { quantity: 1, name: "Fire / Ice", section: "main" },
    ]);
  });

  test("should parse split cards with single slash no spaces", () => {
    const result = parseDeckList("1 Fire/Ice");
    expect(result).toEqual([
      { quantity: 1, name: "Fire/Ice", section: "main" },
    ]);
  });

  test("should treat // as part of card names (no comment parsing)", () => {
    const result = parseDeckList("2 Lightning Bolt // comment here");
    expect(result).toEqual([
      { quantity: 2, name: "Lightning Bolt // comment here", section: "main" },
    ]);
  });

  test("should treat multiple // as part of card names", () => {
    const result = parseDeckList("1 Fire // Ice // this is a comment");
    expect(result).toEqual([
      {
        quantity: 1,
        name: "Fire // Ice // this is a comment",
        section: "main",
      },
    ]);
  });

  test("should handle card names with just quantity", () => {
    const result = parseDeckList("Fire // Ice");
    expect(result).toEqual([
      { quantity: 1, name: "Fire // Ice", section: "main" },
    ]);
  });

  test("should handle different quantity formats", () => {
    const deckList = `4x Lightning Bolt
2 Counterspell
Counterspell x3
Black Lotus 1`;

    const result = parseDeckList(deckList);

    expect(result).toEqual([
      { quantity: 4, name: "Lightning Bolt", section: "main" },
      { quantity: 2, name: "Counterspell", section: "main" },
      { quantity: 3, name: "Counterspell", section: "main" },
      { quantity: 1, name: "Black Lotus", section: "main" },
    ]);
  });

  test("should handle complex split card names", () => {
    const deckList = `1 Life // Death
2 Assault // Battery
1 Night // Day`;

    const result = parseDeckList(deckList);

    expect(result).toEqual([
      { quantity: 1, name: "Life // Death", section: "main" },
      { quantity: 2, name: "Assault // Battery", section: "main" },
      { quantity: 1, name: "Night // Day", section: "main" },
    ]);
  });

  test("should treat lines starting with // as card names", () => {
    const deckList = `4 Lightning Bolt
// This is a comment line
2 Counterspell`;

    const result = parseDeckList(deckList);

    expect(result).toEqual([
      { quantity: 4, name: "Lightning Bolt", section: "main" },
      { quantity: 1, name: "// This is a comment line", section: "main" },
      { quantity: 2, name: "Counterspell", section: "main" },
    ]);
  });

  test("should separate main deck and sideboard using double newlines", () => {
    const deckList = `4 Lightning Bolt
2 Counterspell

4 Pyroblast
2 Red Elemental Blast`;

    const result = parseDeckList(deckList);

    expect(result).toEqual([
      { quantity: 4, name: "Lightning Bolt", section: "main" },
      { quantity: 2, name: "Counterspell", section: "main" },
      { quantity: 4, name: "Pyroblast", section: "sideboard" },
      { quantity: 2, name: "Red Elemental Blast", section: "sideboard" },
    ]);
  });

  test("should treat comment lines as card names in sideboard section", () => {
    const deckList = `4 Lightning Bolt
2 Counterspell

// Comment line`;

    const result = parseDeckList(deckList);

    // The double newline creates a sideboard, and "// Comment line" is treated as a card name
    expect(result).toEqual([
      { quantity: 4, name: "Lightning Bolt", section: "main" },
      { quantity: 2, name: "Counterspell", section: "main" },
      { quantity: 1, name: "// Comment line", section: "sideboard" },
    ]);
  });

  test("should handle multiple double newlines and use the last one with cards", () => {
    const deckList = `4 Lightning Bolt


2 Counterspell

4 Pyroblast`;

    const result = parseDeckList(deckList);

    expect(result).toEqual([
      { quantity: 4, name: "Lightning Bolt", section: "main" },
      { quantity: 2, name: "Counterspell", section: "main" },
      { quantity: 4, name: "Pyroblast", section: "sideboard" },
    ]);
  });

  test("should treat deck as main only when no double newlines exist", () => {
    const deckList = `4 Lightning Bolt
2 Counterspell
1 Black Lotus`;

    const result = parseDeckList(deckList);

    expect(result).toEqual([
      { quantity: 4, name: "Lightning Bolt", section: "main" },
      { quantity: 2, name: "Counterspell", section: "main" },
      { quantity: 1, name: "Black Lotus", section: "main" },
    ]);
  });
});
