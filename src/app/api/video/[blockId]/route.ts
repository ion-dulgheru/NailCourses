import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/db";
import { getSignedVideoUrl, SIGNED_URL_TTL_SECONDS } from "@/lib/storage";
import { parseVideoSource } from "@/lib/video";

// Linkul temporar al unui videoclip. Se emite doar dacă userul are rând în `enrollments` pentru
// cursul lecției (sau dacă lecția e probă gratuită). Răspunsul nu se pune în cache.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const noStore = { "Cache-Control": "private, no-store" };

export async function GET(_req: Request, { params }: { params: Promise<{ blockId: string }> }) {
  const { blockId } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "neautentificat" }, { status: 401, headers: noStore });
  if (!UUID.test(blockId)) return NextResponse.json({ error: "negasit" }, { status: 404, headers: noStore });

  const block = await prisma.lessonBlock.findFirst({
    where: { id: blockId, type: "video" },
    select: { videoKey: true, lesson: { select: { isFreePreview: true, courseId: true } } },
  });
  if (!block) return NextResponse.json({ error: "negasit" }, { status: 404, headers: noStore });

  const hasAccess =
    block.lesson.isFreePreview ||
    user.role === "admin" ||
    !!(await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: block.lesson.courseId } },
      select: { id: true },
    }));
  // 404, nu 403: nu confirmăm că videoclipul există pentru cine n-are acces.
  if (!hasAccess) return NextResponse.json({ error: "negasit" }, { status: 404, headers: noStore });

  const source = parseVideoSource(block.videoKey);
  if (source?.kind !== "fisier") return NextResponse.json({ url: null }, { headers: noStore });

  const url = await getSignedVideoUrl(source.key);
  return NextResponse.json({ url, expiresIn: url ? SIGNED_URL_TTL_SECONDS : null }, { headers: noStore });
}
