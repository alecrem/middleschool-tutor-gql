import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { MagicCard, PartialMagicCard } from "./types.js";

const Dirname = dirname(fileURLToPath(import.meta.url));

function parseCSVRecords(csvContent: string): string[] {
  const records: string[] = [];
  let currentRecord = "";
  let inQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];

    if (char === '"') {
      // Handle escaped quotes ("")
      if (nextChar === '"' && inQuotes) {
        currentRecord += '""';
        i++; // Skip the next quote
      } else {
        inQuotes = !inQuotes;
        currentRecord += char;
      }
    } else if (char === "\n" && !inQuotes) {
      // End of record (only when not in quotes)
      if (currentRecord.trim()) {
        records.push(currentRecord);
      }
      currentRecord = "";
    } else {
      currentRecord += char;
    }
  }

  // Add the last record if it exists
  if (currentRecord.trim()) {
    records.push(currentRecord);
  }

  return records;
}

function parseCSV(csvContent: string): MagicCard[] {
  // Split into records properly handling multiline quoted fields
  const records = parseCSVRecords(csvContent);
  const headers = parseCSVLine(records[0]).map((h) => h.trim());

  const cards: MagicCard[] = [];

  for (let i = 1; i < records.length; i++) {
    const record = records[i].trim();
    if (!record) continue;

    // Parse CSV with proper quote handling
    const values = parseCSVLine(record);
    if (values.length < headers.length) continue;

    const card: PartialMagicCard = {};
    headers.forEach((header, index) => {
      const value = values[index]?.trim() || "";

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
          card[cleanHeader] = Number.parseInt(value) || 0;
          break;
        case "name_ja":
        case "power":
        case "toughness":
          card[cleanHeader] = value === "" ? null : value;
          break;
        case "text":
          // Clean up text field - remove surrounding quotes and normalize newlines
          card[cleanHeader] = value
            .replace(/^["']|["']$/g, "")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n");
          break;
        case "image_small":
          card[cleanHeader] = value.replace(/^["']|["']$/g, "");
          break;
        case "index":
          // Skip index column
          break;
        case "rarity":
          // Skip rarity field - removed from MagicCard data model (see issue #66)
          // The rarity field is present in the CSV but is not used in the application
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

  for (const char of line) {
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
  Dirname,
  "../data/middleschool_extra_fields_with_banned_images_fixed_splits.csv"
);
const jsonPath = join(Dirname, "assets/cards.json");

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
