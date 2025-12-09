import { graphqlRequest } from "../graphql/client.js";

interface SearchCardsArgs {
  query: string;
  cardType?: string;
  colors?: string[];
  limit?: number;
  offset?: number;
  powerMin?: number;
  powerMax?: number;
  toughnessMin?: number;
  toughnessMax?: number;
  cmcMin?: number;
  cmcMax?: number;
}

const SEARCH_CARDS_QUERY = `
  query SearchCards(
    $query: String!
    $cardType: String
    $colors: [String!]
    $limit: Int
    $offset: Int
    $powerMin: Int
    $powerMax: Int
    $toughnessMin: Int
    $toughnessMax: Int
    $cmcMin: Int
    $cmcMax: Int
  ) {
    searchCards(
      query: $query
      cardType: $cardType
      colors: $colors
      limit: $limit
      offset: $offset
      powerMin: $powerMin
      powerMax: $powerMax
      toughnessMin: $toughnessMin
      toughnessMax: $toughnessMax
      cmcMin: $cmcMin
      cmcMax: $cmcMax
    ) {
      cards {
        oracle_id
        name
        name_ja
        banned
        mv
        text
        type
        power
        toughness
        w
        u
        b
        r
        g
        c
        image_small
      }
      total
    }
  }
`;

export async function searchCards(args: SearchCardsArgs) {
  return await graphqlRequest(SEARCH_CARDS_QUERY, args);
}

export const searchCardsToolDefinition = {
  name: "search_cards",
  description:
    "Search for Magic: The Gathering cards in the Middle School format. Supports text search across card names (English and Japanese), types, and card text. Can filter by card type, colors, power/toughness, and converted mana cost (CMC).",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query to match against card names, types, or text",
      },
      cardType: {
        type: "string",
        description:
          "Filter by card type (e.g., 'Creature', 'Instant', 'Sorcery', 'Enchantment', 'Artifact', 'Planeswalker')",
      },
      colors: {
        type: "array",
        items: { type: "string" },
        description:
          "Filter by colors. Use color codes: 'w' (white), 'u' (blue), 'b' (black), 'r' (red), 'g' (green). Cards must have ALL specified colors.",
      },
      limit: {
        type: "number",
        description: "Maximum number of cards to return (default: 20)",
      },
      offset: {
        type: "number",
        description: "Number of cards to skip for pagination (default: 0)",
      },
      powerMin: {
        type: "number",
        description: "Minimum power for creature cards",
      },
      powerMax: {
        type: "number",
        description: "Maximum power for creature cards",
      },
      toughnessMin: {
        type: "number",
        description: "Minimum toughness for creature cards",
      },
      toughnessMax: {
        type: "number",
        description: "Maximum toughness for creature cards",
      },
      cmcMin: {
        type: "number",
        description: "Minimum converted mana cost",
      },
      cmcMax: {
        type: "number",
        description: "Maximum converted mana cost",
      },
    },
    required: ["query"],
  },
};
