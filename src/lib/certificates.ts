import "server-only";
import { randomInt } from "node:crypto";
import { prisma } from "@/lib/db";

// Fără caractere ușor de confundat (0/O, 1/I/L).
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function newCode() {
  const random = Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return `GJ-${new Date().getFullYear()}-${random}`;
}

// Emite certificatul dacă elevul are acces și a terminat toate lecțiile. Idempotent.
export async function issueCertificateIfComplete(userId: string, courseId: string) {
  const [enrollment, totalLessons, doneLessons, existing] = await Promise.all([
    prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } }, select: { id: true } }),
    prisma.lesson.count({ where: { courseId } }),
    prisma.lessonProgress.count({ where: { userId, lesson: { courseId } } }),
    prisma.certificate.findUnique({ where: { userId_courseId: { userId, courseId } } }),
  ]);

  if (existing) return existing;
  if (!enrollment || totalLessons === 0 || doneLessons < totalLessons) return null;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await prisma.certificate.create({ data: { userId, courseId, code: newCode() } });
    } catch (error) {
      // Cod duplicat (foarte rar) → încearcă altul; certificat creat între timp → îl returnăm.
      const already = await prisma.certificate.findUnique({ where: { userId_courseId: { userId, courseId } } });
      if (already) return already;
      if (attempt === 4) throw error;
    }
  }
  return null;
}

// Emite certificatele pentru cursurile terminate care nu au încă unul (ex: terminate înainte de această funcție).
export async function issueEarnedCertificates(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId, course: { certificates: { none: { userId } } } },
    select: { courseId: true },
  });
  for (const { courseId } of enrollments) await issueCertificateIfComplete(userId, courseId);
}

export async function getMyCertificates(userId: string) {
  await issueEarnedCertificates(userId);
  return prisma.certificate.findMany({
    where: { userId },
    orderBy: { issuedAt: "desc" },
    include: { course: { select: { title: true, slug: true, coverImage: true, coverAlt: true } } },
  });
}

// Certificatul se vede doar de proprietar sau de admin.
export async function getCertificateForViewer(code: string, viewer: { id: string; role: string }) {
  const certificate = await prisma.certificate.findUnique({
    where: { code },
    include: {
      user: { select: { name: true, surname: true } },
      course: { select: { title: true, slug: true } },
    },
  });
  if (!certificate) return null;
  if (certificate.userId !== viewer.id && viewer.role !== "admin") return null;
  return certificate;
}
