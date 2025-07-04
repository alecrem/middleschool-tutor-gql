import type { LoaderFunctionArgs } from "@remix-run/node";
import { searchCards } from "../../lib/api";
import type { CardSearchResult } from "../../lib/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  const cardType = url.searchParams.get("cardType") || "";
  const colors = url.searchParams.getAll("colors");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  // Parse power/toughness/CMC parameters with defaults
  const powerMin = url.searchParams.get("powerMin")
    ? parseInt(url.searchParams.get("powerMin")!)
    : 0;
  const powerMax = url.searchParams.get("powerMax")
    ? parseInt(url.searchParams.get("powerMax")!)
    : 13;
  const toughnessMin = url.searchParams.get("toughnessMin")
    ? parseInt(url.searchParams.get("toughnessMin")!)
    : 0;
  const toughnessMax = url.searchParams.get("toughnessMax")
    ? parseInt(url.searchParams.get("toughnessMax")!)
    : 13;
  const cmcMin = url.searchParams.get("cmcMin")
    ? parseInt(url.searchParams.get("cmcMin")!)
    : 0;
  const cmcMax = url.searchParams.get("cmcMax")
    ? parseInt(url.searchParams.get("cmcMax")!)
    : 16;

  // Check if there are any filters applied
  const hasFilters =
    cardType !== "" ||
    colors.length > 0 ||
    powerMin !== 0 ||
    powerMax !== 13 ||
    toughnessMin !== 0 ||
    toughnessMax !== 13 ||
    cmcMin !== 0 ||
    cmcMax !== 16;

  if (!query || query.trim() === "") {
    // If no query and no filters, show empty state
    if (!hasFilters) {
      return {
        searchResult: null,
        query: "",
        cardType,
        colors,
        powerMin,
        powerMax,
        toughnessMin,
        toughnessMax,
        cmcMin,
        cmcMax,
        page: 1,
        totalPages: 0,
        error: null,
      };
    }
    // If filters but no query, search with empty query (will return filtered results)
  }

  try {
    // Only pass power/toughness parameters if they differ from defaults
    const searchResult = await searchCards(
      query ? query.trim() : "",
      cardType,
      colors,
      limit,
      offset,
      powerMin !== 0 || powerMax !== 13 ? powerMin : undefined,
      powerMin !== 0 || powerMax !== 13 ? powerMax : undefined,
      toughnessMin !== 0 || toughnessMax !== 13 ? toughnessMin : undefined,
      toughnessMin !== 0 || toughnessMax !== 13 ? toughnessMax : undefined,
      cmcMin !== 0 || cmcMax !== 16 ? cmcMin : undefined,
      cmcMin !== 0 || cmcMax !== 16 ? cmcMax : undefined
    );
    return {
      searchResult,
      query,
      cardType,
      colors,
      powerMin,
      powerMax,
      toughnessMin,
      toughnessMax,
      cmcMin,
      cmcMax,
      page,
      totalPages: Math.ceil(searchResult.total / limit),
      error: null,
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      searchResult: { cards: [], total: 0 } as CardSearchResult,
      query,
      cardType,
      colors,
      powerMin,
      powerMax,
      toughnessMin,
      toughnessMax,
      cmcMin,
      cmcMax,
      page,
      totalPages: 0,
      error: "searchError", // Pass translation key instead of hardcoded text
    };
  }
}