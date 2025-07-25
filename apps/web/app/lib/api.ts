import type { CardSearchResult } from "./types";

const API_URL = process.env.API_URL || "http://localhost:3001/graphql";

export async function searchCards(
  query: string,
  cardType?: string,
  colors?: string[],
  limit: number = 20,
  offset: number = 0,
  powerMin?: number,
  powerMax?: number,
  toughnessMin?: number,
  toughnessMax?: number,
  cmcMin?: number,
  cmcMax?: number
): Promise<CardSearchResult> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query SearchCards($query: String!, $cardType: String, $colors: [String!], $limit: Int, $offset: Int, $powerMin: Int, $powerMax: Int, $toughnessMin: Int, $toughnessMax: Int, $cmcMin: Int, $cmcMax: Int) {
          searchCards(query: $query, cardType: $cardType, colors: $colors, limit: $limit, offset: $offset, powerMin: $powerMin, powerMax: $powerMax, toughnessMin: $toughnessMin, toughnessMax: $toughnessMax, cmcMin: $cmcMin, cmcMax: $cmcMax) {
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
              perfectMatch
              image_small
            }
            total
          }
        }
      `,
      variables: {
        query,
        cardType,
        colors,
        limit,
        offset,
        powerMin,
        powerMax,
        toughnessMin,
        toughnessMax,
        cmcMin,
        cmcMax,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to search cards");
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0]?.message || "GraphQL error");
  }

  return data.data.searchCards;
}

export async function validateCards(
  cardNames: string[]
): Promise<
  Array<{
    name: string;
    found: boolean;
    banned: boolean;
    matchedName: string | null;
    matchedNameJa: string | null;
  }>
> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query ValidateCards($cardNames: [String!]!) {
          validateCards(cardNames: $cardNames) {
            name
            found
            banned
            matchedName
            matchedNameJa
          }
        }
      `,
      variables: { cardNames },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to validate cards");
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0]?.message || "GraphQL error");
  }

  return data.data.validateCards;
}
