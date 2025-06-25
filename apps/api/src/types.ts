export interface MagicCard {
  oracle_id: string;
  name: string;
  name_ja: string | null;
  banned: boolean;
  mv: number;
  rarity: string;
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
  image_small: string;
}

export interface CardSearchResult {
  cards: MagicCard[];
  total: number;
}
