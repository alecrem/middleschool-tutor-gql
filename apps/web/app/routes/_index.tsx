import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useNavigation } from "@remix-run/react";
import { searchCards } from "../lib/api";
import { CardList } from "../components/CardList";
import type { CardSearchResult } from "../lib/types";

export const meta: MetaFunction = () => {
  return [
    { title: "MTG Middle School" },
    {
      name: "description",
      content:
        "Search Magic: The Gathering cards legal in Middle School format",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  if (!query || query.trim() === "") {
    return json({ searchResult: null, query: "", error: null });
  }

  try {
    const searchResult = await searchCards(query.trim());
    return json({ searchResult, query, error: null });
  } catch (error) {
    console.error("Search error:", error);
    return json({
      searchResult: { cards: [], total: 0 } as CardSearchResult,
      query,
      error: "Failed to search cards. Please try again.",
    });
  }
}

export default function Index() {
  const { searchResult, query, error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSearching =
    navigation.state === "loading" &&
    navigation.location?.search.includes("query=");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          MTG Middle School
        </h1>
        <p
          style={{ fontSize: "1.1rem", color: "#6b7280", marginBottom: "2rem" }}
        >
          Search and explore Magic: The Gathering cards legal in the Middle
          School format
        </p>

        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Search Cards
          </h2>
          <Form method="get">
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                name="query"
                defaultValue={query}
                placeholder="Search for cards..."
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "1rem",
                }}
              />
              <button
                type="submit"
                disabled={isSearching}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: isSearching ? "#9ca3af" : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  cursor: isSearching ? "not-allowed" : "pointer",
                }}
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </Form>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              padding: "1rem",
              borderRadius: "6px",
              marginBottom: "2rem",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </div>
        )}

        {searchResult ? (
          <div>
            <div style={{ marginBottom: "1rem", color: "#6b7280" }}>
              {searchResult.total > searchResult.cards.length ? (
                <>
                  Found {searchResult.total} cards for "{query}" — showing the
                  first {searchResult.cards.length}
                </>
              ) : (
                <>
                  Found {searchResult.total} cards for "{query}"
                </>
              )}
            </div>
            <CardList cards={searchResult.cards} />
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            <p>Enter a card name to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
