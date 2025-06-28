import type { CardSearchResult, SearchParams } from "./types";

const API_URL = process.env.API_URL || "http://localhost:3001/graphql";

export async function searchCards(
  query: string,
  cardType?: string,
  colors?: string[],
  limit: number = 50
): Promise<CardSearchResult> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query SearchCards($query: String!, $cardType: String, $colors: [String!], $limit: Int) {
          searchCards(query: $query, cardType: $cardType, colors: $colors, limit: $limit) {
            cards {
              oracle_id
              name
              name_ja
              banned
              mv
              rarity
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
      variables: { query, cardType, colors, limit },
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
): Promise<Array<{ name: string; found: boolean; banned: boolean; matchedName: string | null; matchedNameJa: string | null }>> {
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
