import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

// Imaginile din public/images, ca opțiuni pentru coperta cursului (până avem încărcare de fișiere).
export async function listPublicImages() {
  try {
    const files = await readdir(path.join(process.cwd(), "public", "images"));
    return files.filter((f) => IMAGE_EXT.test(f)).sort().map((f) => `/images/${f}`);
  } catch {
    return [];
  }
}
