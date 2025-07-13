import { describe, expect, it } from "vitest";
import {
  validateDeck,
  calculateCardCount,
  consolidateCardsForDisplay,
  separateDeckSectionsForDisplay,
} from "./deckValidation";
import type { DeckValidationResult } from "./types";

describe("deckValidation", () => {
  describe("calculateCardCount", () => {
    it("should calculate total card count correctly", () => {
      const cards: DeckValidationResult[] = [
        {
          name: "Lightning Bolt",
          quantity: 4,
          found: true,
          banned: false,
          matchedName: "Lightning Bolt",
          matchedNameJa: null,
          section: "main",
        },
        {
          name: "Counterspell",
          quantity: 2,
          found: true,
          banned: false,
          matchedName: "Counterspell",
          matchedNameJa: null,
          section: "main",
        },
      ];

      expect(calculateCardCount(cards)).toBe(6);
    });
  });

  describe("validateDeck", () => {
    const createMockCard = (
      name: string,
      quantity: number,
      section: "main" | "sideboard" = "main",
      type: string = "Instant",
      banned: boolean = false
    ): DeckValidationResult => ({
      name,
      quantity,
      found: true,
      banned,
      matchedName: name,
      matchedNameJa: null,
      cardDetails: {
        // biome-ignore lint/style/useNamingConvention: API uses snake_case
        oracle_id: `test-${name.toLowerCase().replace(/\s+/g, "-")}`,
        name,
        // biome-ignore lint/style/useNamingConvention: API uses snake_case
        name_ja: null,
        banned,
        mv: 1,
        text: `${name} text`,
        type,
        power: null,
        toughness: null,
        w: false,
        u: false,
        b: false,
        r: true,
        g: false,
        c: false,
        // biome-ignore lint/style/useNamingConvention: API uses snake_case
        image_small: "test.jpg",
      },
      section,
    });

    it("should validate a legal deck with no violations", () => {
      const legalDeck = [
        createMockCard("Lightning Bolt", 4),
        createMockCard("Counterspell", 4),
        createMockCard("Island", 26, "main", "Basic Land — Island"),
        createMockCard("Mountain", 26, "main", "Basic Land — Mountain"),
        createMockCard("Pyroblast", 4, "sideboard"),
      ];

      const result = validateDeck(legalDeck);

      expect(result.isDeckValid).toBe(true);
      expect(result.hasCopyLimitViolations).toBe(false);
      expect(result.copyLimitViolations).toEqual([]);
    });

    it("should detect copy limit violations for non-basic cards", () => {
      const deckWith5LightningBolts = [
        createMockCard("Lightning Bolt", 4, "main"),
        createMockCard("Lightning Bolt", 2, "sideboard"), // Total: 6 copies
        createMockCard("Island", 30, "main", "Basic Land — Island"),
        createMockCard("Mountain", 20, "main", "Basic Land — Mountain"),
      ];

      const result = validateDeck(deckWith5LightningBolts);

      expect(result.isDeckValid).toBe(false);
      expect(result.hasCopyLimitViolations).toBe(true);
      expect(result.copyLimitViolations).toEqual(["Lightning Bolt"]);
    });

    it("should allow unlimited basic lands", () => {
      const deckWithManyBasicLands = [
        createMockCard("Lightning Bolt", 4),
        createMockCard("Forest", 40, "main", "Basic Land — Forest"),
        createMockCard("Forest", 10, "sideboard", "Basic Land — Forest"), // Total: 50 forests
        createMockCard("Island", 16, "main", "Basic Land — Island"),
      ];

      const result = validateDeck(deckWithManyBasicLands);

      expect(result.isDeckValid).toBe(true);
      expect(result.hasCopyLimitViolations).toBe(false);
      expect(result.copyLimitViolations).toEqual([]);
    });

    it("should allow unlimited basic snow lands", () => {
      const deckWithManyBasicSnowLands = [
        createMockCard("Lightning Bolt", 4),
        createMockCard(
          "Snow-Covered Forest",
          30,
          "main",
          "Basic Snow Land — Forest"
        ),
        createMockCard(
          "Snow-Covered Forest",
          10,
          "sideboard",
          "Basic Snow Land — Forest"
        ), // Total: 40 snow forests
        createMockCard(
          "Snow-Covered Island",
          26,
          "main",
          "Basic Snow Land — Island"
        ),
      ];

      const result = validateDeck(deckWithManyBasicSnowLands);

      expect(result.isDeckValid).toBe(true);
      expect(result.hasCopyLimitViolations).toBe(false);
      expect(result.copyLimitViolations).toEqual([]);
    });

    it("should allow unlimited mixed basic and basic snow lands", () => {
      const deckWithMixedBasicLands = [
        createMockCard("Lightning Bolt", 4),
        createMockCard("Forest", 14, "main", "Basic Land — Forest"),
        createMockCard(
          "Snow-Covered Forest",
          14,
          "main",
          "Basic Snow Land — Forest"
        ),
        createMockCard("Island", 14, "main", "Basic Land — Island"),
        createMockCard(
          "Snow-Covered Island",
          14,
          "main",
          "Basic Snow Land — Island"
        ),
      ];

      const result = validateDeck(deckWithMixedBasicLands);

      expect(result.isDeckValid).toBe(true);
      expect(result.hasCopyLimitViolations).toBe(false);
      expect(result.copyLimitViolations).toEqual([]);
    });

    it("should allow all types of basic snow lands", () => {
      const deckWithAllSnowLands = [
        createMockCard("Lightning Bolt", 4),
        createMockCard(
          "Snow-Covered Plains",
          12,
          "main",
          "Basic Snow Land — Plains"
        ),
        createMockCard(
          "Snow-Covered Island",
          12,
          "main",
          "Basic Snow Land — Island"
        ),
        createMockCard(
          "Snow-Covered Swamp",
          12,
          "main",
          "Basic Snow Land — Swamp"
        ),
        createMockCard(
          "Snow-Covered Mountain",
          12,
          "main",
          "Basic Snow Land — Mountain"
        ),
        createMockCard(
          "Snow-Covered Forest",
          8,
          "main",
          "Basic Snow Land — Forest"
        ),
      ];

      const result = validateDeck(deckWithAllSnowLands);

      expect(result.isDeckValid).toBe(true);
      expect(result.hasCopyLimitViolations).toBe(false);
      expect(result.copyLimitViolations).toEqual([]);
    });

    it("should handle multiple cards violating copy limits", () => {
      const deckWithMultipleViolations = [
        createMockCard("Lightning Bolt", 5, "main"), // 5 copies
        createMockCard("Counterspell", 3, "main"),
        createMockCard("Counterspell", 2, "sideboard"), // Total: 5 copies
        createMockCard("Island", 30, "main", "Basic Land — Island"),
        createMockCard("Mountain", 20, "main", "Basic Land — Mountain"),
      ];

      const result = validateDeck(deckWithMultipleViolations);

      expect(result.isDeckValid).toBe(false);
      expect(result.hasCopyLimitViolations).toBe(true);
      expect(result.copyLimitViolations.sort()).toEqual([
        "Counterspell",
        "Lightning Bolt",
      ]);
    });

    it("should work with existing validation rules", () => {
      const deckWithBannedAndCopyViolations = [
        createMockCard("Black Lotus", 2, "main", "Artifact", true), // Banned + copy violation
        createMockCard("Lightning Bolt", 5, "main"), // Copy violation
        createMockCard("Island", 30, "main", "Basic Land — Island"),
      ];

      const result = validateDeck(deckWithBannedAndCopyViolations);

      expect(result.isDeckValid).toBe(false);
      expect(result.hasBannedCards).toBe(true);
      expect(result.hasCopyLimitViolations).toBe(true);
      expect(result.copyLimitViolations).toEqual(["Lightning Bolt"]);
      expect(result.bannedCards.length).toBeGreaterThan(0);
    });

    it("should handle empty deck", () => {
      const result = validateDeck(null);

      expect(result.isDeckValid).toBe(true);
      expect(result.hasCopyLimitViolations).toBe(false);
      expect(result.copyLimitViolations).toEqual([]);
    });

    it("should consolidate same cards across multiple entries", () => {
      const deckWithDuplicateEntries = [
        createMockCard("Lightning Bolt", 2, "main"),
        createMockCard("Lightning Bolt", 2, "main"), // Same card, same section
        createMockCard("Lightning Bolt", 2, "sideboard"), // Total: 6 copies
        createMockCard("Island", 50, "main", "Basic Land — Island"),
      ];

      const result = validateDeck(deckWithDuplicateEntries);

      expect(result.isDeckValid).toBe(false);
      expect(result.hasCopyLimitViolations).toBe(true);
      expect(result.copyLimitViolations).toEqual(["Lightning Bolt"]);
    });
  });

  describe("consolidateCardsForDisplay", () => {
    const createMockCard = (
      name: string,
      quantity: number,
      section: "main" | "sideboard" = "main",
      matchedName?: string
    ): DeckValidationResult => ({
      name,
      quantity,
      found: true,
      banned: false,
      matchedName: matchedName || name,
      matchedNameJa: null,
      cardDetails: {
        // biome-ignore lint/style/useNamingConvention: API uses snake_case
        oracle_id: `test-${name.toLowerCase().replace(/\s+/g, "-")}`,
        name: matchedName || name,
        // biome-ignore lint/style/useNamingConvention: API uses snake_case
        name_ja: null,
        banned: false,
        mv: 1,
        text: `${name} text`,
        type: "Instant",
        power: null,
        toughness: null,
        w: false,
        u: false,
        b: false,
        r: true,
        g: false,
        c: false,
        // biome-ignore lint/style/useNamingConvention: API uses snake_case
        image_small: "test.jpg",
      },
      section,
    });

    it("should consolidate duplicate card entries", () => {
      const duplicateCards = [
        createMockCard("Disenchant", 1),
        createMockCard("Disenchant", 1),
        createMockCard("Disenchant", 1),
        createMockCard("Lightning Bolt", 4),
      ];

      const result = consolidateCardsForDisplay(duplicateCards);

      expect(result).toHaveLength(2);
      expect(result.find((card) => card.name === "Disenchant")?.quantity).toBe(
        3
      );
      expect(
        result.find((card) => card.name === "Lightning Bolt")?.quantity
      ).toBe(4);
    });

    it("should handle cards with different original names but same matched name", () => {
      const cards = [
        createMockCard("disenchant", 1, "main", "Disenchant"),
        createMockCard("Disenchant", 2, "main", "Disenchant"),
        createMockCard("DISENCHANT", 1, "main", "Disenchant"),
      ];

      const result = consolidateCardsForDisplay(cards);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Disenchant");
      expect(result[0].quantity).toBe(4);
    });

    it("should preserve card details from the first occurrence", () => {
      const cards = [
        createMockCard("Lightning Bolt", 2),
        createMockCard("Lightning Bolt", 2),
      ];

      const result = consolidateCardsForDisplay(cards);

      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(4);
      expect(result[0].cardDetails?.name).toBe("Lightning Bolt");
      expect(result[0].found).toBe(true);
      expect(result[0].banned).toBe(false);
    });

    it("should handle empty array", () => {
      const result = consolidateCardsForDisplay([]);
      expect(result).toHaveLength(0);
    });
  });

  describe("separateDeckSectionsForDisplay", () => {
    const createMockCard = (
      name: string,
      quantity: number,
      section: "main" | "sideboard" = "main"
    ): DeckValidationResult => ({
      name,
      quantity,
      found: true,
      banned: false,
      matchedName: name,
      matchedNameJa: null,
      cardDetails: {
        // biome-ignore lint/style/useNamingConvention: API uses snake_case
        oracle_id: `test-${name.toLowerCase().replace(/\s+/g, "-")}`,
        name,
        // biome-ignore lint/style/useNamingConvention: API uses snake_case
        name_ja: null,
        banned: false,
        mv: 1,
        text: `${name} text`,
        type: "Instant",
        power: null,
        toughness: null,
        w: false,
        u: false,
        b: false,
        r: true,
        g: false,
        c: false,
        // biome-ignore lint/style/useNamingConvention: API uses snake_case
        image_small: "test.jpg",
      },
      section,
    });

    it("should consolidate cards within sections but keep sections separate", () => {
      const deckWithDuplicates = [
        createMockCard("Lightning Bolt", 2, "main"),
        createMockCard("Lightning Bolt", 2, "main"),
        createMockCard("Counterspell", 4, "main"),
        createMockCard("Disenchant", 1, "sideboard"),
        createMockCard("Disenchant", 1, "sideboard"),
        createMockCard("Disenchant", 1, "sideboard"),
      ];

      const result = separateDeckSectionsForDisplay(deckWithDuplicates);

      expect(result.mainDeckCards).toHaveLength(2);
      expect(result.sideboardCards).toHaveLength(1);

      const lightningBolt = result.mainDeckCards.find(
        (card) => card.name === "Lightning Bolt"
      );
      expect(lightningBolt?.quantity).toBe(4);

      const disenchant = result.sideboardCards.find(
        (card) => card.name === "Disenchant"
      );
      expect(disenchant?.quantity).toBe(3);

      expect(result.mainDeckCount).toBe(8); // 2 + 2 + 4 = 8
      expect(result.sideboardCount).toBe(3); // 1 + 1 + 1 = 3
    });

    it("should handle null input", () => {
      const result = separateDeckSectionsForDisplay(null);

      expect(result.mainDeckCards).toHaveLength(0);
      expect(result.sideboardCards).toHaveLength(0);
      expect(result.mainDeckCount).toBe(0);
      expect(result.sideboardCount).toBe(0);
    });
  });
});
