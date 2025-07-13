import { describe, expect, it, vi } from "vitest";
import { useDeckList } from "./useDeckList";
import type { DeckValidationResult } from "../lib/types";
import { renderHook } from "@testing-library/react";

describe("useDeckList", () => {
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

  describe("copy/share consolidation", () => {
    it("should consolidate duplicate cards in copied deck lists", async () => {
      const resultsWithDuplicates = [
        createMockCard("Lightning Bolt", 4, "main"),
        createMockCard("Disenchant", 1, "main"),
        createMockCard("Disenchant", 1, "main"),
        createMockCard("Disenchant", 1, "main"),
        createMockCard("Island", 20, "main"),
        createMockCard("Pyroblast", 1, "sideboard"),
        createMockCard("Pyroblast", 1, "sideboard"),
        createMockCard("Red Elemental Blast", 2, "sideboard"),
      ];

      const { result } = renderHook(() =>
        useDeckList("", undefined, resultsWithDuplicates, true)
      );

      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });

      await result.current.copyDeckListToClipboard();

      const expectedDeckList = [
        "4 Lightning Bolt",
        "3 Disenchant", // Consolidated from 3 separate entries
        "20 Island",
        "",
        "2 Pyroblast", // Consolidated from 2 separate entries
        "2 Red Elemental Blast",
      ].join("\n");

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expectedDeckList
      );
    });

    it("should handle main deck only (no sideboard)", async () => {
      const mainDeckOnly = [
        createMockCard("Lightning Bolt", 2, "main"),
        createMockCard("Lightning Bolt", 2, "main"),
        createMockCard("Counterspell", 4, "main"),
      ];

      const { result } = renderHook(() =>
        useDeckList("", undefined, mainDeckOnly, true)
      );

      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });

      await result.current.copyDeckListToClipboard();

      const expectedDeckList = [
        "4 Lightning Bolt", // Consolidated from 2+2
        "4 Counterspell",
      ].join("\n");

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expectedDeckList
      );
    });

    it("should preserve card order within sections", async () => {
      const orderedCards = [
        createMockCard("Alpha Card", 1, "main"),
        createMockCard("Beta Card", 2, "main"),
        createMockCard("Alpha Card", 1, "main"), // Duplicate of first card
        createMockCard("Sideboard Card", 1, "sideboard"),
      ];

      const { result } = renderHook(() =>
        useDeckList("", undefined, orderedCards, true)
      );

      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });

      await result.current.copyDeckListToClipboard();

      const copiedText = (
        navigator.clipboard.writeText as ReturnType<typeof vi.fn>
      ).mock.calls[0][0];

      // Should consolidate Alpha Card to 2 copies
      expect(copiedText).toContain("2 Alpha Card");
      expect(copiedText).toContain("2 Beta Card");
      expect(copiedText).toContain("1 Sideboard Card");

      // Should have sideboard separated by double newline
      expect(copiedText).toMatch(
        /Alpha Card[\s\S]*Beta Card[\s\S]*\n\n[\s\S]*Sideboard Card/
      );
    });
  });
});
