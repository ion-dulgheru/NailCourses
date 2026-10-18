import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { getAccessibleBlock } from "@/lib/block-access";
import { getSignedVideoUrl, SIGNED_URL_TTL_SECONDS, videoExists } from "@/lib/storage";
import { parseVideoSource } from "@/lib/video";

// Linkul temporar al unui videoclip. Se emite doar dacă userul are rând în `enrollments` pentru
// cursul lecției (sau dacă lecția e probă gratuită). Răspunsul nu se pune în cache.
const noStore = { "Cache-Control": "private, no-store" };

export async function GET(_req: Request, { params }: { params: Promise<{ blockId: string }> }) {
  const { blockId } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "neautentificat" }, { status: 401, headers: noStore });

  // 404, nu 403: nu confirmăm că videoclipul există pentru cine n-are acces.
  const block = await getAccessibleBlock(blockId, "video", user);
  if (!block) return NextResponse.json({ error: "negasit" }, { status: 404, headers: noStore });

  const source = parseVideoSource(block.videoKey);
  if (source?.kind !== "fisier") return NextResponse.json({ url: null }, { headers: noStore });

  // Fișier încă neurcat → `url: null`, iar playerul afișează „disponibil în curând”, nu o eroare.
  if ((await videoExists(source.key)) === false) return NextResponse.json({ url: null }, { headers: noStore });

  const url = await getSignedVideoUrl(source.key);
  return NextResponse.json({ url, expiresIn: url ? SIGNED_URL_TTL_SECONDS : null }, { headers: noStore });
}
