export function generateScryfallUrl(cardName: string): string {
  // URL encode the card name for safe inclusion in URL
  const encodedName = encodeURIComponent(cardName);
  
  // Scryfall URL format: prefer:oldest !"CardName"
  // URL encoded: prefer%3Aoldest%20!%22CardName%22
  return `https://scryfall.com/search?q=prefer%3Aoldest%20!%22${encodedName}%22`;
}

