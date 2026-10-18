import "server-only";
import { prisma } from "@/lib/db";

type BlockUser = { id: string; role: string };

// Blocul (video sau PDF) dacă userul are voie la el: rând în `enrollments` pentru cursul lecției,
// lecție de probă gratuită sau admin. Altfel null, fără să spunem dacă blocul există.
export async function getAccessibleBlock(blockId: string, type: "video" | "pdf", user: BlockUser) {
  const block = await prisma.lessonBlock
    .findFirst({
      where: { id: blockId, type },
      select: { text: true, videoKey: true, lesson: { select: { isFreePreview: true, courseId: true } } },
    })
    .catch(() => null); // id care nu e uuid
  if (!block) return null;

  const hasAccess =
    block.lesson.isFreePreview ||
    user.role === "admin" ||
    !!(await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: block.lesson.courseId } },
      select: { id: true },
    }));
  return hasAccess ? block : null;
}
