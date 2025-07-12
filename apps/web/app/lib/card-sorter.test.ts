import { describe, test, expect } from "vitest";
import { sortDeckValidationResults, sortMagicCards } from "./card-sorter";
import type { DeckValidationResult, MagicCard } from "./types";

// Mock card data following the exact MagicCard interface structure
// Note: Properties use snake_case to match API interface exactly
const mockCards = {
  stripMine: {
    oracle_id: "f57fd4c9-b013-4a76-825f-24e8b9b5138b",
    name: "Strip Mine",
    name_ja: "露天鉱床",
    banned: false,
    mv: 0,
    text: "{T}: Add {C}.\n{T}, Sacrifice Strip Mine: Destroy target land.",
    type: "Land",
    power: null,
    toughness: null,
    w: false,
    u: false,
    b: false,
    r: false,
    g: false,
    c: true,
    image_small:
      "https://cards.scryfall.io/small/front/f/5/f57fd4c9-b013-4a76-825f-24e8b9b5138b.jpg",
  },
  lightningBolt: {
    oracle_id: "b1bc6a3b-4a38-4d8c-aaff-2e3c7a5e4c7f",
    name: "Lightning Bolt",
    name_ja: "稲妻",
    banned: false,
    mv: 1,
    text: "Lightning Bolt deals 3 damage to any target.",
    type: "Instant",
    power: null,
    toughness: null,
    w: false,
    u: false,
    b: false,
    r: true,
    g: false,
    c: false,
    image_small:
      "https://cards.scryfall.io/small/front/a/e/ae5f9fb1-5a55-4db3-98a1-2628e3598c18.jpg",
  },
  serraAngel: {
    oracle_id: "84544e2e-5616-4f2e-84b7-cc4e1b7c7b8d",
    name: "Serra Angel",
    name_ja: "セラの天使",
    banned: false,
    mv: 5,
    text: "Flying, vigilance",
    type: "Creature — Angel",
    power: "4",
    toughness: "4",
    w: true,
    u: false,
    b: false,
    r: false,
    g: false,
    c: false,
    image_small:
      "https://cards.scryfall.io/small/front/9/0/9067f035-3437-4152-8e28-a0a5c3a5f5fa.jpg",
  },
  blackLotus: {
    oracle_id: "bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd",
    name: "Black Lotus",
    name_ja: "ブラック・ロータス",
    banned: true,
    mv: 0,
    text: "{T}, Sacrifice Black Lotus: Add three mana of any one color.",
    type: "Artifact",
    power: null,
    toughness: null,
    w: false,
    u: false,
    b: false,
    r: false,
    g: false,
    c: true,
    image_small:
      "https://cards.scryfall.io/small/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg",
  },
  ancestralRecall: {
    oracle_id: "2398892d-28e9-4009-81ec-0d544af79d2b",
    name: "Ancestral Recall",
    name_ja: "先祖の記憶",
    banned: true,
    mv: 1,
    text: "Target player draws three cards.",
    type: "Instant",
    power: null,
    toughness: null,
    w: false,
    u: true,
    b: false,
    r: false,
    g: false,
    c: false,
    image_small:
      "https://cards.scryfall.io/small/front/2/3/2398892d-28e9-4009-81ec-0d544af79d2b.jpg",
  },
  worship: {
    oracle_id: "4ad20044-8ed8-49ae-9a07-d4cb18527cc7",
    name: "Worship",
    name_ja: "崇拝",
    banned: false,
    mv: 4,
    text: "If you control a creature, damage that would reduce your life total to less than 1 reduces it to 1 instead.",
    type: "Enchantment",
    power: null,
    toughness: null,
    w: true,
    u: false,
    b: false,
    r: false,
    g: false,
    c: false,
    image_small:
      "https://cards.scryfall.io/small/front/4/a/4ad20044-8ed8-49ae-9a07-d4cb18527cc7.jpg",
  },
  shivanDragon: {
    oracle_id: "f6b6c4db-f5b1-4b9c-8f3a-7d7c2f5e4a9b",
    name: "Shivan Dragon",
    name_ja: "シヴァン・ドラゴン",
    banned: false,
    mv: 6,
    text: "Flying\n{R}: Shivan Dragon gets +1/+0 until end of turn.",
    type: "Creature — Dragon",
    power: "5",
    toughness: "5",
    w: false,
    u: false,
    b: false,
    r: true,
    g: false,
    c: false,
    image_small:
      "https://cards.scryfall.io/small/front/f/6/f6b6c4db-f5b1-4b9c-8f3a-7d7c2f5e4a9b.jpg",
  },
  hypnoticSpecter: {
    oracle_id: "060b2cb0-6c94-4e3b-b7a4-95c082a4c3a9",
    name: "Hypnotic Specter",
    name_ja: "催眠スペクター",
    banned: false,
    mv: 3,
    text: "Flying\nWhenever Hypnotic Specter deals damage to an opponent, that player discards a card at random.",
    type: "Creature — Specter",
    power: "2",
    toughness: "2",
    w: false,
    u: false,
    b: true,
    r: false,
    g: false,
    c: false,
    image_small:
      "https://cards.scryfall.io/small/front/0/6/060b2cb0-6c94-4e3b-b7a4-95c082a4c3a9.jpg",
  },
  savannahLions: {
    oracle_id: "ac3a9841-85fb-48f7-b9c6-c0d951dd81db",
    name: "Savannah Lions",
    name_ja: "サバンナ・ライオン",
    banned: false,
    mv: 1,
    text: "",
    type: "Creature — Cat",
    power: "2",
    toughness: "1",
    w: true,
    u: false,
    b: false,
    r: false,
    g: false,
    c: false,
    image_small:
      "https://cards.scryfall.io/small/front/a/c/ac3a9841-85fb-48f7-b9c6-c0d951dd81db.jpg",
  },
  swordsToPlowshares: {
    oracle_id: "6ff9af62-1895-465a-b1f3-61f0d8318958",
    name: "Swords to Plowshares",
    name_ja: "剣を鋤に",
    banned: false,
    mv: 1,
    text: "Exile target creature. Its controller gains life equal to its power.",
    type: "Instant",
    power: null,
    toughness: null,
    w: true,
    u: false,
    b: false,
    r: false,
    g: false,
    c: false,
    image_small:
      "https://cards.scryfall.io/small/front/6/f/6ff9af62-1895-465a-b1f3-61f0d8318958.jpg",
  },
  darkRitual: {
    oracle_id: "95f27eeb-6f14-4db3-adb9-9be5ed76b34b",
    name: "Dark Ritual",
    name_ja: "暗黒の儀式",
    banned: false,
    mv: 1,
    text: "Add {B}{B}{B}.",
    type: "Instant",
    power: null,
    toughness: null,
    w: false,
    u: false,
    b: true,
    r: false,
    g: false,
    c: false,
    image_small:
      "https://cards.scryfall.io/small/front/9/5/95f27eeb-6f14-4db3-adb9-9be5ed76b34b.jpg",
  },
  brainstorm: {
    oracle_id: "e989a7d4-e852-4ea6-ad73-c9dc5d2d2107",
    name: "Brainstorm",
    name_ja: "渦まく知識",
    banned: false,
    mv: 1,
    text: "Draw three cards, then put two cards from your hand on top of your library in any order.",
    type: "Instant",
    power: null,
    toughness: null,
    w: false,
    u: true,
    b: false,
    r: false,
    g: false,
    c: false,
    image_small:
      "https://cards.scryfall.io/small/front/e/9/e989a7d4-e852-4ea6-ad73-c9dc5d2d2107.jpg",
  },
  demonic_tutor: {
    oracle_id: "3bdbc231-5316-4abd-9d8d-d87cff2c9847",
    name: "Demonic Tutor",
    name_ja: "悪魔の教示者",
    banned: false,
    mv: 2,
    text: "Search your library for a card, put that card into your hand, then shuffle.",
    type: "Sorcery",
    power: null,
    toughness: null,
    w: false,
    u: false,
    b: true,
    r: false,
    g: false,
    c: false,
    image_small:
      "https://cards.scryfall.io/small/front/3/b/3bdbc231-5316-4abd-9d8d-d87cff2c9847.jpg",
  },
} as const;

// Helper function to create complete MagicCard objects
// Note: Properties use snake_case to match API interface exactly
function createMockCard(
  name: string,
  type: string,
  mv: number,
  power?: string,
  toughness?: string
): MagicCard {
  return {
    oracle_id: `mock-${name.replace(/\s+/g, "-").toLowerCase()}`,
    name,
    name_ja: name,
    banned: false,
    mv,
    text: `Mock text for ${name}`,
    type,
    power: power || null,
    toughness: toughness || null,
    w: false,
    u: false,
    b: false,
    r: false,
    g: false,
    c: false,
    image_small: "https://example.com/mock-image.jpg",
  };
}

describe("sortDeckValidationResults", () => {
  test("should sort cards by type hierarchy (creature, sorcery, instant, enchantment, artifact, land)", () => {
    const mockResults: DeckValidationResult[] = [
      {
        name: "Strip Mine",
        quantity: 4,
        found: true,
        banned: false,
        matchedName: "Strip Mine",
        matchedNameJa: "露天鉱床",
        cardDetails: mockCards.stripMine,
        section: "main" as const,
      },
      {
        name: "Lightning Bolt",
        quantity: 4,
        found: true,
        banned: false,
        matchedName: "Lightning Bolt",
        matchedNameJa: "稲妻",
        cardDetails: mockCards.lightningBolt,
        section: "main" as const,
      },
      {
        name: "Serra Angel",
        quantity: 2,
        found: true,
        banned: false,
        matchedName: "Serra Angel",
        matchedNameJa: "セラの天使",
        cardDetails: mockCards.serraAngel,
        section: "main" as const,
      },
      {
        name: "Black Lotus",
        quantity: 1,
        found: true,
        banned: true,
        matchedName: "Black Lotus",
        matchedNameJa: "ブラック・ロータス",
        cardDetails: mockCards.blackLotus,
        section: "main" as const,
      },
      {
        name: "Demonic Tutor",
        quantity: 1,
        found: true,
        banned: false,
        matchedName: "Demonic Tutor",
        matchedNameJa: "悪魔の教示者",
        cardDetails: mockCards.demonic_tutor,
        section: "main" as const,
      },
      {
        name: "Worship",
        quantity: 1,
        found: true,
        banned: false,
        matchedName: "Worship",
        matchedNameJa: "崇拝",
        cardDetails: mockCards.worship,
        section: "main" as const,
      },
    ];

    const sorted = sortDeckValidationResults(mockResults);

    // Check that types are in correct order
    expect(sorted[0].cardDetails?.type).toMatch(/creature/i);
    expect(sorted[1].cardDetails?.type).toMatch(/sorcery/i);
    expect(sorted[2].cardDetails?.type).toMatch(/instant/i);
    expect(sorted[3].cardDetails?.type).toMatch(/enchantment/i);
    expect(sorted[4].cardDetails?.type).toMatch(/artifact/i);
    expect(sorted[5].cardDetails?.type).toMatch(/land/i);
  });

  test("should sort within same type by mana value (ascending)", () => {
    const mockResults: DeckValidationResult[] = [
      {
        name: "Shivan Dragon",
        quantity: 1,
        found: true,
        banned: false,
        matchedName: "Shivan Dragon",
        matchedNameJa: "シヴァン・ドラゴン",
        cardDetails: mockCards.shivanDragon,
        section: "main" as const,
      },
      {
        name: "Hypnotic Specter",
        quantity: 4,
        found: true,
        banned: false,
        matchedName: "Hypnotic Specter",
        matchedNameJa: "催眠スペクター",
        cardDetails: mockCards.hypnoticSpecter,
        section: "main" as const,
      },
      {
        name: "Serra Angel",
        quantity: 2,
        found: true,
        banned: false,
        matchedName: "Serra Angel",
        matchedNameJa: "セラの天使",
        cardDetails: mockCards.serraAngel,
        section: "main" as const,
      },
      {
        name: "Savannah Lions",
        quantity: 4,
        found: true,
        banned: false,
        matchedName: "Savannah Lions",
        matchedNameJa: "サバンナ・ライオン",
        cardDetails: mockCards.savannahLions,
        section: "main" as const,
      },
    ];

    const sorted = sortDeckValidationResults(mockResults);

    // Check that mana values are in ascending order
    expect(sorted[0].cardDetails?.mv).toBe(1);
    expect(sorted[1].cardDetails?.mv).toBe(3);
    expect(sorted[2].cardDetails?.mv).toBe(5);
    expect(sorted[3].cardDetails?.mv).toBe(6);
  });

  test("should sort within same type and mana value by name (alphabetical)", () => {
    const mockResults: DeckValidationResult[] = [
      {
        name: "Swords to Plowshares",
        quantity: 2,
        found: true,
        banned: false,
        matchedName: "Swords to Plowshares",
        matchedNameJa: "剣を鋤に",
        cardDetails: mockCards.swordsToPlowshares,
        section: "main" as const,
      },
      {
        name: "Lightning Bolt",
        quantity: 4,
        found: true,
        banned: false,
        matchedName: "Lightning Bolt",
        matchedNameJa: "稲妻",
        cardDetails: mockCards.lightningBolt,
        section: "main" as const,
      },
      {
        name: "Dark Ritual",
        quantity: 4,
        found: true,
        banned: false,
        matchedName: "Dark Ritual",
        matchedNameJa: "暗黒の儀式",
        cardDetails: mockCards.darkRitual,
        section: "main" as const,
      },
      {
        name: "Brainstorm",
        quantity: 1,
        found: true,
        banned: false,
        matchedName: "Brainstorm",
        matchedNameJa: "渦まく知識",
        cardDetails: mockCards.brainstorm,
        section: "main" as const,
      },
    ];

    const sorted = sortDeckValidationResults(mockResults);

    // Check that names are in alphabetical order
    expect(sorted[0].cardDetails?.name).toBe("Brainstorm");
    expect(sorted[1].cardDetails?.name).toBe("Dark Ritual");
    expect(sorted[2].cardDetails?.name).toBe("Lightning Bolt");
    expect(sorted[3].cardDetails?.name).toBe("Swords to Plowshares");
  });

  test("should handle multi-type cards by prioritizing first recognized type", () => {
    const mockResults: DeckValidationResult[] = [
      {
        name: "Artifact Creature",
        quantity: 1,
        found: true,
        banned: false,
        matchedName: "Artifact Creature",
        matchedNameJa: "アーティファクト・クリーチャー",
        cardDetails: createMockCard(
          "Artifact Creature",
          "Artifact Creature",
          2,
          "2",
          "2"
        ),
        section: "main" as const,
      },
      {
        name: "Pure Creature",
        quantity: 1,
        found: true,
        banned: false,
        matchedName: "Pure Creature",
        matchedNameJa: "純粋クリーチャー",
        cardDetails: createMockCard("Pure Creature", "Creature", 2, "2", "2"),
        section: "main" as const,
      },
      {
        name: "Creature Artifact",
        quantity: 1,
        found: true,
        banned: false,
        matchedName: "Creature Artifact",
        matchedNameJa: "クリーチャー・アーティファクト",
        cardDetails: createMockCard(
          "Creature Artifact",
          "Creature Artifact",
          2,
          "2",
          "2"
        ),
        section: "main" as const,
      },
    ];

    const sorted = sortDeckValidationResults(mockResults);

    // All should be treated as creatures (first recognized type)
    expect(sorted[0].cardDetails?.name).toBe("Artifact Creature");
    expect(sorted[1].cardDetails?.name).toBe("Creature Artifact");
    expect(sorted[2].cardDetails?.name).toBe("Pure Creature");
  });

  test("should place cards not found at the end", () => {
    const mockResults: DeckValidationResult[] = [
      {
        name: "Valid Card",
        quantity: 1,
        found: true,
        banned: false,
        matchedName: "Valid Card",
        matchedNameJa: "有効カード",
        cardDetails: createMockCard("Valid Card", "Creature", 2, "2", "2"),
        section: "main" as const,
      },
      {
        name: "Invalid Card",
        quantity: 1,
        found: false,
        banned: false,
        matchedName: null,
        matchedNameJa: null,
        cardDetails: null,
        section: "main" as const,
      },
      {
        name: "Another Valid Card",
        quantity: 1,
        found: true,
        banned: false,
        matchedName: "Another Valid Card",
        matchedNameJa: "もう一つの有効カード",
        cardDetails: createMockCard("Another Valid Card", "Instant", 1),
        section: "main" as const,
      },
    ];

    const sorted = sortDeckValidationResults(mockResults);

    // Valid cards should be sorted first, invalid cards at the end
    expect(sorted[0].cardDetails?.name).toBe("Valid Card");
    expect(sorted[1].cardDetails?.name).toBe("Another Valid Card");
    expect(sorted[2].found).toBe(false);
    expect(sorted[2].name).toBe("Invalid Card");
  });

  test("should handle edge cases like split cards", () => {
    const mockResults: DeckValidationResult[] = [
      {
        name: "Fire // Ice",
        quantity: 1,
        found: true,
        banned: false,
        matchedName: "Fire // Ice",
        matchedNameJa: "火炎 // 氷",
        cardDetails: createMockCard("Fire // Ice", "Instant // Instant", 1),
        section: "main" as const,
      },
      {
        name: "Lightning Bolt",
        quantity: 1,
        found: true,
        banned: false,
        matchedName: "Lightning Bolt",
        matchedNameJa: "稲妻",
        cardDetails: mockCards.lightningBolt,
        section: "main" as const,
      },
    ];

    const sorted = sortDeckValidationResults(mockResults);

    // Should sort alphabetically within same type and mana value
    expect(sorted[0].cardDetails?.name).toBe("Fire // Ice");
    expect(sorted[1].cardDetails?.name).toBe("Lightning Bolt");
  });
});

describe("sortMagicCards", () => {
  test("should sort MagicCard objects by the same hierarchy", () => {
    const mockCardsArray: MagicCard[] = [
      mockCards.stripMine,
      mockCards.lightningBolt,
      mockCards.serraAngel,
      mockCards.blackLotus,
    ];

    const sorted = sortMagicCards(mockCardsArray);

    // Check that types are in correct order
    expect(sorted[0].type).toMatch(/creature/i);
    expect(sorted[1].type).toMatch(/instant/i);
    expect(sorted[2].type).toMatch(/artifact/i);
    expect(sorted[3].type).toMatch(/land/i);
  });
});
