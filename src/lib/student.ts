import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/db";

// Zona elevului: accesul la un curs se verifică DOAR în `enrollments`, pe server, la fiecare cerere.

export async function requireStudent(callbackUrl: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/autentificare?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return user;
}

type LessonRef = { id: string; slug: string };

function progressOf(lessons: LessonRef[], completed: Set<string>) {
  const done = lessons.filter((l) => completed.has(l.id)).length;
  const next = lessons.find((l) => !completed.has(l.id)) ?? lessons[0];
  return {
    total: lessons.length,
    done,
    percent: lessons.length ? Math.round((done / lessons.length) * 100) : 0,
    finished: lessons.length > 0 && done === lessons.length,
    nextLessonSlug: next?.slug ?? null,
  };
}

async function completedLessonIds(userId: string, courseId?: string) {
  const rows = await prisma.lessonProgress.findMany({
    where: { userId, ...(courseId && { lesson: { courseId } }) },
    select: { lessonId: true },
  });
  return new Set(rows.map((r) => r.lessonId));
}

export async function getMyCourses(userId: string) {
  const [enrollments, completed] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      orderBy: { grantedAt: "desc" },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            category: true,
            coverImage: true,
            coverAlt: true,
            lessons: { orderBy: { position: "asc" }, select: { id: true, slug: true } },
          },
        },
      },
    }),
    completedLessonIds(userId),
  ]);

  return enrollments.map(({ course, grantedAt }) => ({
    ...course,
    grantedAt,
    progress: progressOf(course.lessons, completed),
  }));
}

export async function getMyCourse(userId: string, slug: string) {
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId, course: { slug } },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              durationSeconds: true,
            },
          },
        },
      },
    },
  });
  if (!enrollment) return null;

  const completed = await completedLessonIds(userId, enrollment.course.id);
  return {
    course: enrollment.course,
    completed,
    progress: progressOf(enrollment.course.lessons, completed),
  };
}
