export function generateScryfallUrl(cardName: string): string {
  // URL encode the card name for safe inclusion in URL
  const encodedName = encodeURIComponent(cardName);

  // Scryfall URL format: prefer:oldest !"CardName"
  // URL encoded: prefer%3Aoldest%20!%22CardName%22
  return `https://scryfall.com/search?q=prefer%3Aoldest%20!%22${encodedName}%22`;
}

export function formatPowerToughness(value: string): string {
  // Remove trailing .0 from values like "2.0" -> "2", but keep "1.5" -> "1.5"
  const num = Number.parseFloat(value);
  return num % 1 === 0 ? Math.floor(num).toString() : value;
}
