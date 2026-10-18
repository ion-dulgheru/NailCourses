import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { getAccessibleBlock } from "@/lib/block-access";
import { getSignedPdfUrl, videoExists } from "@/lib/storage";
import { parseVideoSource } from "@/lib/video";

// Materialul PDF al unei lecții. Linkul din lecție deschide această adresă într-un tab nou; după
// verificarea accesului (aceleași reguli ca la video) trimitem browserul la un link R2 temporar.
const noStore = { "Cache-Control": "private, no-store" };

function unavailable(status: number) {
  return new NextResponse("Materialul nu este disponibil.", {
    status,
    headers: { ...noStore, "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function GET(req: Request, { params }: { params: Promise<{ blockId: string }> }) {
  const { blockId } = await params;
  const user = await getCurrentUser();
  if (!user) {
    const login = new URL("/autentificare", req.url);
    login.searchParams.set("callbackUrl", new URL(req.url).pathname);
    return NextResponse.redirect(login);
  }

  const block = await getAccessibleBlock(blockId, "pdf", user);
  const source = parseVideoSource(block?.videoKey);
  if (!block || source?.kind !== "fisier") return unavailable(404);
  if ((await videoExists(source.key)) === false) return unavailable(404);

  const url = await getSignedPdfUrl(source.key, block.text);
  if (!url) return unavailable(503);
  return NextResponse.redirect(url, { headers: noStore });
}
