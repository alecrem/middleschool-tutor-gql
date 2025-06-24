import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface MagicCard {
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
}

function parseCSV(csvContent: string): MagicCard[] {
  const lines = csvContent.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  const cards: MagicCard[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV with proper quote handling
    const values = parseCSVLine(line);
    if (values.length < headers.length) continue;

    const card: any = {};
    headers.forEach((header, index) => {
      let value = values[index]?.trim() || "";

      // Clean up header names
      const cleanHeader = header
        .replace(/^["']|["']$/g, "")
        .replace("Unnamed: 0", "index");

      // Convert values based on header
      switch (cleanHeader) {
        case "banned":
        case "w":
        case "u":
        case "b":
        case "r":
        case "g":
        case "c":
          card[cleanHeader] = value.toLowerCase() === "true";
          break;
        case "mv":
          card[cleanHeader] = parseInt(value) || 0;
          break;
        case "name_ja":
        case "power":
        case "toughness":
          card[cleanHeader] = value === "" ? null : value;
          break;
        case "index":
          // Skip index column
          break;
        default:
          card[cleanHeader] = value.replace(/^["']|["']$/g, "");
      }
    });

    if (card.oracle_id && card.name) {
      cards.push(card as MagicCard);
    }
  }

  return cards;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// Convert CSV to JSON
const csvPath = join(
  __dirname,
  "../data/middleschool_extra_fields_with_banned.csv"
);
const jsonPath = join(__dirname, "assets/cards.json");

try {
  const csvContent = readFileSync(csvPath, "utf-8");
  const cards = parseCSV(csvContent);

  // Ensure assets directory exists
  mkdirSync(dirname(jsonPath), { recursive: true });
  
  writeFileSync(jsonPath, JSON.stringify(cards, null, 2));
  console.log(`✅ Converted ${cards.length} cards to JSON`);
  console.log(`📁 Saved to: ${jsonPath}`);
} catch (error) {
  console.error("❌ Error converting CSV to JSON:", error);
  process.exit(1);
}
