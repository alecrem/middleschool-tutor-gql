import type { CardSearchResult } from "./types";

const API_URL = process.env.API_URL || "http://localhost:3001/graphql";

export async function searchCards(
  query: string,
  limit: number = 50
): Promise<CardSearchResult> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query SearchCards($query: String!, $limit: Int) {
          searchCards(query: $query, limit: $limit) {
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
            }
            total
          }
        }
      `,
      variables: { query, limit },
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
