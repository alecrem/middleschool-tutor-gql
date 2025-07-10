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

/**
 * Compress a string using gzip compression and base64 encoding
 * Browser-only implementation using CompressionStream
 */
export async function compressString(input: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const compressionStream = new CompressionStream("gzip");
    const compressed = await new Response(data).body?.pipeThrough(
      compressionStream
    );
    if (!compressed) throw new Error("Failed to create compression stream");
    const compressedData = new Uint8Array(
      await new Response(compressed).arrayBuffer()
    );

    // Convert to base64
    const base64String = btoa(String.fromCharCode(...compressedData));
    return base64String;
  } catch (error) {
    throw new Error(`Compression failed: ${error}`);
  }
}

/**
 * Decompress a base64 encoded gzip compressed string
 * Browser-only implementation using DecompressionStream
 */
export async function decompressString(
  compressedInput: string
): Promise<string> {
  try {
    // Decode from base64
    const binaryString = atob(compressedInput);
    const compressedData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      compressedData[i] = binaryString.charCodeAt(i);
    }

    const decompressionStream = new DecompressionStream("gzip");
    const decompressed = await new Response(compressedData).body?.pipeThrough(
      decompressionStream
    );
    if (!decompressed) throw new Error("Failed to create decompression stream");
    const decompressedData = new Uint8Array(
      await new Response(decompressed).arrayBuffer()
    );

    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decompressedData);
  } catch (error) {
    throw new Error(`Decompression failed: ${error}`);
  }
}
