import type { LoaderFunctionArgs } from "@remix-run/node";
import { searchCards } from "../../lib/api";
import type { CardSearchResult } from "../../lib/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  const cardType = url.searchParams.get("cardType") || "";
  const colors = url.searchParams.getAll("colors");
  const page = Number.parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  // Parse power/toughness/CMC parameters with defaults
  const powerMinParam = url.searchParams.get("powerMin");
  const powerMin = powerMinParam ? Number.parseInt(powerMinParam) : 0;
  const powerMaxParam = url.searchParams.get("powerMax");
  const powerMax = powerMaxParam ? Number.parseInt(powerMaxParam) : 13;
  const toughnessMinParam = url.searchParams.get("toughnessMin");
  const toughnessMin = toughnessMinParam
    ? Number.parseInt(toughnessMinParam)
    : 0;
  const toughnessMaxParam = url.searchParams.get("toughnessMax");
  const toughnessMax = toughnessMaxParam
    ? Number.parseInt(toughnessMaxParam)
    : 13;
  const cmcMinParam = url.searchParams.get("cmcMin");
  const cmcMin = cmcMinParam ? Number.parseInt(cmcMinParam) : 0;
  const cmcMaxParam = url.searchParams.get("cmcMax");
  const cmcMax = cmcMaxParam ? Number.parseInt(cmcMaxParam) : 16;

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
