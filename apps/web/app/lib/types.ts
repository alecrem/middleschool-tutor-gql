export interface MagicCard {
  oracle_id: string;
  name: string;
  name_ja: string | null;
  banned: boolean;
  mv: number;
  text: string;
  type: string;
  power: string | null;
  toughness: string | null;
  w: boolean;
  u: boolean;
  b: boolean;
  r: boolean;
  g: boolean;
  c: boolean;
  perfectMatch?: boolean;
  image_small: string;
}

export interface CardSearchResult {
  cards: MagicCard[];
  total: number;
}

export interface DeckEntry {
  quantity: number;
  name: string;
  section: "main" | "sideboard";
}

export interface DeckValidationResult {
  name: string;
  quantity: number;
  found: boolean;
  banned: boolean;
  matchedName: string | null;
  matchedNameJa: string | null;
  cardDetails?: MagicCard | null;
  section: "main" | "sideboard";
}

export interface SearchParams {
  query: string;
  cardType?: string;
  colors?: string[];
  limit?: number;
  powerMin?: number;
  powerMax?: number;
  toughnessMin?: number;
  toughnessMax?: number;
  cmcMin?: number;
  cmcMax?: number;
}
