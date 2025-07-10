/**
 * Server-side compression utilities using Node.js zlib
 * This file is only imported on the server side
 */
import { gzip, gunzip } from "node:zlib";
import { promisify } from "node:util";

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

/**
 * Server-side compression using Node.js zlib
 */
export async function compressStringServer(input: string): Promise<string> {
  try {
    const buffer = Buffer.from(input, "utf8");
    const compressed = await gzipAsync(buffer);
    return compressed.toString("base64");
  } catch (error) {
    throw new Error(`Server compression failed: ${error}`);
  }
}

/**
 * Server-side decompression using Node.js zlib
 */
export async function decompressStringServer(
  compressedInput: string
): Promise<string> {
  try {
    const compressedBuffer = Buffer.from(compressedInput, "base64");
    const decompressed = await gunzipAsync(compressedBuffer);
    return decompressed.toString("utf8");
  } catch (error) {
    throw new Error(`Server decompression failed: ${error}`);
  }
}
