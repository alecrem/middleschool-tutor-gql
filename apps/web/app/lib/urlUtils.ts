/**
 * URL generation utilities for sharing search results and deck checks
 */

export interface SearchParams {
  query?: string;
  cardType?: string;
  colors?: string[];
  powerMin?: number;
  powerMax?: number;
  toughnessMin?: number;
  toughnessMax?: number;
  cmcMin?: number;
  cmcMax?: number;
}

/**
 * Generate a shareable URL for card search with all current parameters
 * Always resets page to 1 for consistent sharing
 */
export function generateSearchShareUrl(searchParams: SearchParams): string {
  const params = new URLSearchParams();

  // Add all search parameters if they exist
  if (searchParams.query && searchParams.query.trim()) {
    params.set('query', searchParams.query.trim());
  }
  
  if (searchParams.cardType && searchParams.cardType !== 'all') {
    params.set('cardType', searchParams.cardType);
  }
  
  if (searchParams.colors && searchParams.colors.length > 0) {
    params.set('colors', searchParams.colors.join(','));
  }
  
  if (searchParams.powerMin !== undefined && searchParams.powerMin !== null) {
    params.set('powerMin', searchParams.powerMin.toString());
  }
  
  if (searchParams.powerMax !== undefined && searchParams.powerMax !== null) {
    params.set('powerMax', searchParams.powerMax.toString());
  }
  
  if (searchParams.toughnessMin !== undefined && searchParams.toughnessMin !== null) {
    params.set('toughnessMin', searchParams.toughnessMin.toString());
  }
  
  if (searchParams.toughnessMax !== undefined && searchParams.toughnessMax !== null) {
    params.set('toughnessMax', searchParams.toughnessMax.toString());
  }
  
  if (searchParams.cmcMin !== undefined && searchParams.cmcMin !== null) {
    params.set('cmcMin', searchParams.cmcMin.toString());
  }
  
  if (searchParams.cmcMax !== undefined && searchParams.cmcMax !== null) {
    params.set('cmcMax', searchParams.cmcMax.toString());
  }

  // Return URL with parameters (no page parameter needed)
  if (params.toString()) {
    return `/?${params.toString()}`;
  }

  return '/';
}

/**
 * Generate a shareable URL for deck check with the current deck list
 */
export function generateDeckCheckShareUrl(deckList: string): string {
  if (deckList && deckList.trim()) {
    const params = new URLSearchParams();
    params.set('decklist', deckList.trim());
    return `/deck-check?${params.toString()}`;
  }

  return '/deck-check';
}

/**
 * Extract search parameters from current URL search params
 */
export function extractSearchParamsFromUrl(searchParams: URLSearchParams): SearchParams {
  const result: SearchParams = {};

  const query = searchParams.get('query');
  if (query) result.query = query;

  const cardType = searchParams.get('cardType');
  if (cardType) result.cardType = cardType;

  const colors = searchParams.get('colors');
  if (colors) result.colors = colors.split(',').filter(Boolean);

  const powerMin = searchParams.get('powerMin');
  if (powerMin !== null) result.powerMin = parseInt(powerMin, 10);

  const powerMax = searchParams.get('powerMax');
  if (powerMax !== null) result.powerMax = parseInt(powerMax, 10);

  const toughnessMin = searchParams.get('toughnessMin');
  if (toughnessMin !== null) result.toughnessMin = parseInt(toughnessMin, 10);

  const toughnessMax = searchParams.get('toughnessMax');
  if (toughnessMax !== null) result.toughnessMax = parseInt(toughnessMax, 10);

  const cmcMin = searchParams.get('cmcMin');
  if (cmcMin !== null) result.cmcMin = parseInt(cmcMin, 10);

  const cmcMax = searchParams.get('cmcMax');
  if (cmcMax !== null) result.cmcMax = parseInt(cmcMax, 10);

  return result;
}