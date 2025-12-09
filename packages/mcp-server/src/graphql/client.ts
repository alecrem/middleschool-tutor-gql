import fetch from "node-fetch";

// Use the deployed API endpoint
const API_ENDPOINT =
  process.env.API_ENDPOINT || "https://middleschool-api.vercel.app/graphql";

export async function graphqlRequest(
  query: string,
  variables?: Record<string, any>
) {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const json = (await response.json()) as { data?: any; errors?: any[] };

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data;
}
