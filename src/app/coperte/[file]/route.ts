import { getStoredFile } from "@/lib/storage";

// Copertele încărcate din admin stau în R2 (bucket privat) la `coperte/<fișier>`; aici le servim
// public, pentru catalog, pagina cursului și Google. Numele e unic la fiecare încărcare, deci
// browserul și Vercel le pot păstra în cache pentru totdeauna.
const FILE = /^[a-z0-9-]+\.(jpg|png|webp)$/;

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!FILE.test(file)) return new Response("Negăsit", { status: 404 });

  const stored = await getStoredFile(`coperte/${file}`);
  if (!stored) return new Response("Negăsit", { status: 404 });

  return new Response(stored.body, {
    headers: {
      "Content-Type": stored.contentType,
      ...(stored.contentLength ? { "Content-Length": String(stored.contentLength) } : {}),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
