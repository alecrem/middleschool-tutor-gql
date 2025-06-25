export function generateScryfallUrl(cardName: string): string {
  // URL encode the card name for safe inclusion in URL
  const encodedName = encodeURIComponent(cardName);
  
  // Scryfall URL format: prefer:oldest !"CardName"
  // URL encoded: prefer%3Aoldest%20!%22CardName%22
  return `https://scryfall.com/search?q=prefer%3Aoldest%20!%22${encodedName}%22`;
}

export function generateScryfallImageUrl(oracleId: string): string {
  // Scryfall image URL format: https://cards.scryfall.io/small/front/6/d/{oracle_id}.jpg
  // Extract first 2 characters for directory structure
  const firstChar = oracleId.charAt(0);
  const secondChar = oracleId.charAt(1);
  
  return `https://cards.scryfall.io/small/front/${firstChar}/${secondChar}/${oracleId}.jpg`;
}