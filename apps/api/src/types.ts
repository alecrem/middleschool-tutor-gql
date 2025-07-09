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

// Partial card interface for parsing (allows gradual property assignment)
export interface PartialMagicCard {
  oracle_id?: string;
  name?: string;
  name_ja?: string | null;
  banned?: boolean;
  mv?: number;
  text?: string;
  type?: string;
  power?: string | null;
  toughness?: string | null;
  w?: boolean;
  u?: boolean;
  b?: boolean;
  r?: boolean;
  g?: boolean;
  c?: boolean;
  perfectMatch?: boolean;
  image_small?: string;
  [key: string]: unknown; // Allow additional properties during parsing
}
