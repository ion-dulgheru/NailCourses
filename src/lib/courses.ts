import { prisma } from "@/lib/db";
import "server-only";
import type { CourseLevel } from "@/generated/prisma/client";

// Citiri pentru paginile publice: doar cursurile publicate.
export {
  LEVELS,
  formatDuration,
  formatMdl,
  lessonsLabel,
  levelLabel,
  parseLevel,
} from "@/lib/course-format";

export async function getPublishedCourses({ level, take }: { level?: CourseLevel; take?: number } = {}) {
  const courses = await prisma.course.findMany({
    where: { status: "publicat", ...(level && { level }) },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    take,
    include: { lessons: { select: { durationSeconds: true } } },
  });

  return courses.map(({ lessons, ...course }) => ({
    ...course,
    lessonCount: lessons.length,
    totalSeconds: lessons.reduce((sum, l) => sum + l.durationSeconds, 0),
  }));
}

export type CourseCardData = Awaited<ReturnType<typeof getPublishedCourses>>[number];

export async function getPublishedCourse(slug: string) {
  const course = await prisma.course.findFirst({
    where: { slug, status: "publicat" },
    include: {
      lessons: {
        orderBy: { position: "asc" },
        select: { id: true, slug: true, title: true, durationSeconds: true, isFreePreview: true },
      },
    },
  });
  if (!course) return null;

  return {
    ...course,
    totalSeconds: course.lessons.reduce((sum, l) => sum + l.durationSeconds, 0),
  };
}
