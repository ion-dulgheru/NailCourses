"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { assertAdmin, slugify } from "@/lib/admin";
import { Prisma } from "@/generated/prisma/client";
import { SETTING_FIELDS } from "@/lib/settings";
import { parseVideoSource } from "@/lib/video";

export type AdminFormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  // Valorile trimise, ca formularul să nu se golească după o eroare.
  values?: Record<string, string>;
};

const lines = z
  .string()
  .default("")
  .transform((value) =>
    value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
  );

const courseSchema = z.object({
  title: z.string().trim().min(3, "Titlul trebuie să aibă cel puțin 3 caractere").max(120),
  slug: z.string().trim().max(80).default(""),
  category: z.string().trim().max(60).default(""),
  shortDescription: z.string().trim().min(10, "Scrie o frază de prezentare (minimum 10 caractere)").max(300),
  longDescription: z.string().trim().max(5000).default(""),
  level: z.enum(["incepator", "intermediar", "avansat"], { error: "Alege nivelul" }),
  priceMdl: z.coerce.number({ error: "Prețul trebuie să fie un număr" }).int("Prețul se scrie în lei întregi").min(0).max(1_000_000),
  coverImage: z.string().trim().min(1, "Alege o imagine de copertă"),
  coverAlt: z.string().trim().max(200).default(""),
  whatYouLearn: lines,
  forWho: lines,
  materials: lines,
  status: z.enum(["ciorna", "publicat"]),
});

const lessonSchema = z.object({
  title: z.string().trim().min(2, "Titlul lecției e obligatoriu").max(160),
  description: z.string().trim().max(3000).default(""),
  durationMinutes: z.coerce.number({ error: "Durata trebuie să fie un număr" }).int().min(0).max(600),
  isFreePreview: z.boolean(),
});

function formValues(formData: FormData) {
  const values: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
  });
  return values;
}

function fieldErrors(error: z.ZodError, values: Record<string, string>): AdminFormState {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    errors[key] ??= issue.message;
  }
  return { ok: false, message: "Verifică câmpurile marcate.", errors, values };
}

function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

// ─── Cursuri ────────────────────────────────────────────────────────────────

export async function saveCourse(prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await assertAdmin();

  const id = formData.get("id");
  const values = formValues(formData);
  const parsed = courseSchema.safeParse(values);
  if (!parsed.success) return fieldErrors(parsed.error, values);

  const data = { ...parsed.data, slug: slugify(parsed.data.slug || parsed.data.title) };
  if (!data.slug) {
    return { ok: false, message: "Verifică câmpurile marcate.", errors: { slug: "Adresa nu poate fi goală" }, values };
  }

  let courseId: string;
  try {
    if (typeof id === "string" && id) {
      await prisma.course.update({ where: { id }, data });
      courseId = id;
    } else {
      const last = await prisma.course.aggregate({ _max: { position: true } });
      const created = await prisma.course.create({
        data: { ...data, position: (last._max.position ?? -1) + 1 },
      });
      courseId = created.id;
    }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        ok: false,
        message: "Verifică câmpurile marcate.",
        errors: { slug: "Există deja un curs cu această adresă" },
        values,
      };
    }
    throw error;
  }

  if (!id) redirect(`/admin/cursuri/${courseId}?creat=1`);
  refresh();
  return { ok: true, message: "Modificările au fost salvate." };
}

export async function deleteCourse(courseId: string): Promise<AdminFormState> {
  await assertAdmin();

  const [enrollments, orders] = await Promise.all([
    prisma.enrollment.count({ where: { courseId } }),
    prisma.order.count({ where: { courseId } }),
  ]);
  if (enrollments > 0 || orders > 0) {
    return {
      ok: false,
      message: "Cursul are elevi sau comenzi și nu poate fi șters. Trece-l pe „Ciornă” ca să-l ascunzi.",
    };
  }

  await prisma.course.delete({ where: { id: courseId } });
  redirect("/admin/cursuri");
}

// ─── Lecții ─────────────────────────────────────────────────────────────────

async function uniqueLessonSlug(courseId: string, title: string, exceptId?: string) {
  const base = slugify(title) || "lectie";
  let slug = base;
  for (let i = 2; ; i++) {
    const clash = await prisma.lesson.findFirst({
      where: { courseId, slug, ...(exceptId && { NOT: { id: exceptId } }) },
      select: { id: true },
    });
    if (!clash) return slug;
    slug = `${base}-${i}`;
  }
}

export async function saveLesson(prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await assertAdmin();

  const courseId = String(formData.get("courseId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");
  const values = formValues(formData);
  const parsed = lessonSchema.safeParse({
    ...values,
    isFreePreview: formData.get("isFreePreview") === "on",
  });
  if (!parsed.success) return fieldErrors(parsed.error, values);

  const { durationMinutes, ...rest } = parsed.data;
  const data = { ...rest, durationSeconds: durationMinutes * 60 };

  if (lessonId) {
    const existing = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { title: true } });
    const slug =
      existing && existing.title !== data.title
        ? await uniqueLessonSlug(courseId, data.title, lessonId)
        : undefined;
    await prisma.lesson.update({ where: { id: lessonId }, data: { ...data, ...(slug && { slug }) } });
  } else {
    const last = await prisma.lesson.aggregate({ where: { courseId }, _max: { position: true } });
    await prisma.lesson.create({
      data: {
        ...data,
        courseId,
        slug: await uniqueLessonSlug(courseId, data.title),
        position: (last._max.position ?? -1) + 1,
      },
    });
  }

  refresh();
  return { ok: true, message: lessonId ? "Lecția a fost salvată." : "Lecția a fost adăugată." };
}

export async function deleteLesson(lessonId: string) {
  await assertAdmin();
  await prisma.lesson.delete({ where: { id: lessonId } });
  refresh();
}

export async function moveLesson(lessonId: string, direction: "up" | "down") {
  await assertAdmin();

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return;

  const neighbor = await prisma.lesson.findFirst({
    where: {
      courseId: lesson.courseId,
      position: direction === "up" ? { lt: lesson.position } : { gt: lesson.position },
    },
    orderBy: { position: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.lesson.update({ where: { id: lesson.id }, data: { position: neighbor.position } }),
    prisma.lesson.update({ where: { id: neighbor.id }, data: { position: lesson.position } }),
  ]);
  refresh();
}

// ─── Conținutul lecției (blocuri) ───────────────────────────────────────────

const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("titlu"), text: z.string().trim().min(1, "Scrie titlul").max(200) }),
  z.object({ type: z.literal("text"), text: z.string().trim().min(1, "Scrie textul").max(10000) }),
  z.object({
    type: z.literal("video"),
    text: z.string().trim().max(300).default(""),
    videoKey: z
      .string()
      .trim()
      .min(1, "Adaugă linkul YouTube sau numele fișierului")
      .max(500)
      .refine((v) => parseVideoSource(v) !== null, "Folosește un link YouTube sau numele fișierului din spațiul de stocare"),
  }),
]);

export async function saveBlock(prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await assertAdmin();

  const lessonId = String(formData.get("lessonId") ?? "");
  const blockId = String(formData.get("blockId") ?? "");
  const values = formValues(formData);
  const parsed = blockSchema.safeParse(values);
  if (!parsed.success) return fieldErrors(parsed.error, values);

  const data = {
    type: parsed.data.type,
    text: parsed.data.text,
    videoKey: parsed.data.type === "video" ? parsed.data.videoKey : null,
  };

  if (blockId) {
    await prisma.lessonBlock.update({ where: { id: blockId }, data });
  } else {
    const last = await prisma.lessonBlock.aggregate({ where: { lessonId }, _max: { position: true } });
    await prisma.lessonBlock.create({ data: { ...data, lessonId, position: (last._max.position ?? -1) + 1 } });
  }

  refresh();
  return { ok: true, message: blockId ? "Blocul a fost salvat." : "Blocul a fost adăugat." };
}

export async function deleteBlock(blockId: string) {
  await assertAdmin();
  await prisma.lessonBlock.delete({ where: { id: blockId } });
  refresh();
}

export async function moveBlock(blockId: string, direction: "up" | "down") {
  await assertAdmin();

  const block = await prisma.lessonBlock.findUnique({ where: { id: blockId } });
  if (!block) return;

  const neighbor = await prisma.lessonBlock.findFirst({
    where: {
      lessonId: block.lessonId,
      position: direction === "up" ? { lt: block.position } : { gt: block.position },
    },
    orderBy: { position: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.lessonBlock.update({ where: { id: block.id }, data: { position: neighbor.position } }),
    prisma.lessonBlock.update({ where: { id: neighbor.id }, data: { position: block.position } }),
  ]);
  refresh();
}

// ─── Acces elevi ────────────────────────────────────────────────────────────

export async function grantAccess(prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await assertAdmin();

  const userId = String(formData.get("userId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  if (!userId || !courseId) return { ok: false, message: "Alege un curs." };

  try {
    await prisma.enrollment.create({ data: { userId, courseId, source: "manual" } });
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, message: "Elevul are deja acces la acest curs." };
    throw error;
  }

  refresh();
  return { ok: true, message: "Accesul a fost acordat." };
}

export async function revokeAccess(enrollmentId: string) {
  await assertAdmin();
  await prisma.enrollment.delete({ where: { id: enrollmentId } });
  refresh();
}

// ─── Comenzi ────────────────────────────────────────────────────────────────

// Rambursarea se marchează manual (banii se returnează din contul maib). Accesul se verifică
// doar în `Enrollment`, deci ștergerea înscrierii legate de comandă retrage accesul.
export async function refundOrder(orderId: string): Promise<AdminFormState> {
  await assertAdmin();

  const order = await prisma.order.findUnique({ where: { id: orderId }, select: { status: true } });
  if (!order) return { ok: false, message: "Comanda nu există." };
  if (order.status !== "platita") return { ok: false, message: "Doar o comandă plătită poate fi rambursată." };

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: "rambursata" } }),
    prisma.enrollment.deleteMany({ where: { orderId } }),
  ]);
  refresh();
  return { ok: true, message: "Comanda a fost marcată ca rambursată, iar accesul a fost retras." };
}

// ─── Setări ─────────────────────────────────────────────────────────────────

export async function saveSettings(prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await assertAdmin();

  const values = formValues(formData);
  const errors: Record<string, string> = {};
  const entries = SETTING_FIELDS.map(({ key }) => [key, (values[key] ?? "").trim().slice(0, 1000)] as const);

  for (const [key, value] of entries) {
    if (key.endsWith("_url") && value && !/^https:\/\/\S+$/.test(value)) {
      errors[key] = "Scrie adresa completă, care începe cu https://";
    }
    if (key === "contact_email" && value && !z.email().safeParse(value).success) {
      errors[key] = "Adresa de email nu este validă";
    }
  }
  if (Object.keys(errors).length > 0) return { ok: false, message: "Verifică câmpurile marcate.", errors, values };

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.setting.upsert({ where: { key }, create: { key, value }, update: { value } }),
    ),
  );
  refresh();
  return { ok: true, message: "Setările au fost salvate." };
}
