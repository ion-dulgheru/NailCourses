"use server";

import { refresh } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { issueCertificateIfComplete } from "@/lib/certificates";

// Marchează / demarchează o lecție ca terminată. Verifică pe server că elevul are acces la curs.
export async function setLessonCompleted(lessonId: string, completed: boolean) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Nu ești autentificat");

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { courseId: true } });
  if (!lesson) throw new Error("Lecția nu există");

  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.courseId } },
    select: { id: true },
  });
  if (!enrolled) throw new Error("Nu ai acces la acest curs");

  if (completed) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId },
      update: {},
    });
    // Ultima lecție terminată → certificatul se emite automat.
    await issueCertificateIfComplete(userId, lesson.courseId);
  } else {
    await prisma.lessonProgress.deleteMany({ where: { userId, lessonId } });
  }

  refresh();
}
