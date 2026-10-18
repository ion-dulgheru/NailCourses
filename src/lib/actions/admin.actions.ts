"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/admin";
import { slugify } from "@/lib/slug";
import { Prisma } from "@/generated/prisma/client";
import { SETTING_FIELDS } from "@/lib/settings";
import { parseVideoSource } from "@/lib/video";
import {
  deleteStoredFile,
  getSignedUploadUrl,
  getStorageUsage,
  isStorageConfigured,
  MAX_UPLOAD_BYTES,
  STORAGE_LIMIT_BYTES,
  videoExists,
} from "@/lib/storage";

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
  coverImage: z
    .string()
    .trim()
    .min(1, "Alege o imagine de copertă")
    .refine((v) => /^\/(images|coperte)\/[\w.-]+$/.test(v), "Alege o imagine din listă sau încarcă una"),
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
      const before = await prisma.course.findUnique({ where: { id }, select: { coverImage: true } });
      await prisma.course.update({ where: { id }, data });
      courseId = id;
      if (before && before.coverImage !== data.coverImage) await removeUnusedCover(before.coverImage);
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

// Șterge din R2 fișierele video pe care nu le mai folosește niciun bloc (după o ștergere sau o
// înlocuire în baza de date). Un fișier folosit și în altă lecție rămâne. O eroare la R2 nu
// anulează ștergerea din baza de date: fișierul rămas se poate șterge din dashboard-ul Cloudflare.
async function removeUnusedVideos(videoKeys: (string | null)[]) {
  for (const videoKey of new Set(videoKeys)) {
    const source = parseVideoSource(videoKey);
    if (source?.kind !== "fisier") continue;
    const stillUsed = await prisma.lessonBlock.count({ where: { videoKey } });
    if (stillUsed) continue;
    await deleteStoredFile(source.key).catch((error) =>
      console.error(`[r2] ștergerea fișierului ${source.key} a eșuat:`, error),
    );
  }
}

// Coperta încărcată (/coperte/…) se șterge din R2 când nu mai e folosită de niciun curs.
// Imaginile din public/images rămân neatinse.
async function removeUnusedCover(coverImage: string) {
  if (!coverImage.startsWith("/coperte/")) return;
  if (await prisma.course.count({ where: { coverImage } })) return;
  const key = coverImage.slice(1);
  await deleteStoredFile(key).catch((error) => console.error(`[r2] ștergerea copertei ${key} a eșuat:`, error));
}

async function videoKeysOf(where: { lesson: { courseId: string } } | { lessonId: string }) {
  const blocks = await prisma.lessonBlock.findMany({
    where: { ...where, type: { in: ["video", "pdf"] } },
    select: { videoKey: true },
  });
  return blocks.map((b) => b.videoKey);
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

  const videoKeys = await videoKeysOf({ lesson: { courseId } });
  const course = await prisma.course.delete({ where: { id: courseId }, select: { coverImage: true } });
  await removeUnusedVideos(videoKeys);
  await removeUnusedCover(course.coverImage);
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
  const videoKeys = await videoKeysOf({ lessonId });
  await prisma.lesson.delete({ where: { id: lessonId } });
  await removeUnusedVideos(videoKeys);
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
  z.object({
    type: z.literal("pdf"),
    text: z.string().trim().min(1, "Scrie numele materialului (ex: Fișa de lucru)").max(200),
    videoKey: z
      .string()
      .trim()
      .min(1, "Încarcă fișierul PDF")
      .max(500)
      .refine((v) => parseVideoSource(v)?.kind === "fisier" && /\.pdf$/i.test(v), "Încarcă un fișier PDF"),
  }),
]);

export async function saveBlock(prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await assertAdmin();

  const lessonId = String(formData.get("lessonId") ?? "");
  const blockId = String(formData.get("blockId") ?? "");
  const values = formValues(formData);
  const parsed = blockSchema.safeParse(values);
  if (!parsed.success) return fieldErrors(parsed.error, values);

  const current = blockId
    ? await prisma.lessonBlock.findUnique({ where: { id: blockId }, select: { videoKey: true } })
    : null;

  // O greșeală de scriere în numele fișierului s-ar vedea abia la elevă; o prindem la salvare.
  // Doar când numele se schimbă, ca adminul să poată edita legenda înainte să urce fișierul.
  if (parsed.data.type === "video" || parsed.data.type === "pdf") {
    const source = parseVideoSource(parsed.data.videoKey);
    const changed = current?.videoKey?.trim() !== parsed.data.videoKey;
    if (source?.kind === "fisier" && changed && (await videoExists(source.key)) === false) {
      return {
        ok: false,
        message: "Verifică câmpurile marcate.",
        errors: { videoKey: `Fișierul „${source.key}” nu există în spațiul de stocare. Urcă-l întâi în R2 sau verifică numele.` },
        values,
      };
    }
  }

  const data = {
    type: parsed.data.type,
    text: parsed.data.text,
    videoKey: parsed.data.type === "video" || parsed.data.type === "pdf" ? parsed.data.videoKey : null,
  };

  if (blockId) {
    await prisma.lessonBlock.update({ where: { id: blockId }, data });
    // Fișierul înlocuit (video sau PDF) nu mai e folosit: se șterge din R2.
    if (current?.videoKey && current.videoKey !== data.videoKey) await removeUnusedVideos([current.videoKey]);
  } else {
    const last = await prisma.lessonBlock.aggregate({ where: { lessonId }, _max: { position: true } });
    await prisma.lessonBlock.create({ data: { ...data, lessonId, position: (last._max.position ?? -1) + 1 } });
  }

  refresh();
  return { ok: true, message: blockId ? "Blocul a fost salvat." : "Blocul a fost adăugat." };
}

// ─── Încărcarea fișierelor (video, PDF) în R2 ────────────────────────────────

const UPLOAD_KINDS = {
  video: {
    types: { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" } as Record<string, string>,
    maxBytes: MAX_UPLOAD_BYTES,
    wrongType: "Alege un fișier video MP4, WebM sau MOV.",
    tooBig: "Fișierul depășește 5 GB. Micșorează-l (export la 1080p) și încearcă din nou.",
  },
  pdf: {
    types: { "application/pdf": "pdf" } as Record<string, string>,
    maxBytes: 100 * 1024 ** 2,
    wrongType: "Alege un fișier PDF.",
    tooBig: "PDF-ul depășește 100 MB. Micșorează-l (ex: „Salvează ca PDF redus”) și încearcă din nou.",
  },
  coperta: {
    types: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as Record<string, string>,
    maxBytes: 5 * 1024 ** 2,
    wrongType: "Alege o imagine JPG, PNG sau WebP.",
    tooBig: "Imaginea depășește 5 MB. Micșoreaz-o (ex: 1600 px lățime) și încearcă din nou.",
  },
};

export type UploadResult = { ok: true; url: string; key: string } | { ok: false; message: string };

// Emite linkul de încărcare doar dacă fișierul încape în limita de 10 GB a spațiului de stocare.
// Fișierul urcă direct din browser în R2 (nu prin server), apoi cheia se pune în bloc.
export async function requestUpload(input: {
  lessonId?: string;
  kind: "video" | "pdf" | "coperta";
  fileName: string;
  size: number;
  contentType: string;
}): Promise<UploadResult> {
  await assertAdmin();
  if (!isStorageConfigured()) return { ok: false, message: "Spațiul de stocare nu este conectat." };

  const kind = UPLOAD_KINDS[input.kind];
  if (!kind) return { ok: false, message: "Tip de fișier necunoscut." };
  const ext = kind.types[input.contentType];
  if (!ext) return { ok: false, message: kind.wrongType };
  if (!Number.isSafeInteger(input.size) || input.size <= 0) return { ok: false, message: "Fișierul este gol." };
  if (input.size > kind.maxBytes) return { ok: false, message: kind.tooBig };

  const lesson =
    input.kind === "coperta"
      ? null
      : await prisma.lesson.findUnique({ where: { id: input.lessonId }, select: { course: { select: { slug: true } } } });
  if (input.kind !== "coperta" && !lesson) return { ok: false, message: "Lecția nu mai există." };

  const used = await getStorageUsage();
  if (used + input.size > STORAGE_LIMIT_BYTES) {
    return {
      ok: false,
      message: "Nu poți adăuga fișiere: spațiul de stocare de 10 GB este plin. Contactează creatorul site-ului.",
    };
  }

  // Nume curat și unic, ca un fișier nou să nu-l suprascrie pe altul cu același nume.
  const base = slugify(input.fileName.replace(/\.[^.]+$/, "")) || input.kind;

  // Copertele sunt publice și păstrate în cache la nesfârșit: fiecare încărcare primește alt nume.
  if (!lesson) {
    const key = `coperte/${base.slice(0, 60)}-${randomUUID().slice(0, 8)}.${ext}`;
    return { ok: true, url: await getSignedUploadUrl(key, input.contentType, input.size), key };
  }

  let key = `cursuri/${lesson.course.slug}/${base}.${ext}`;
  for (let i = 2; ; i++) {
    const exists = await videoExists(key);
    if (exists === false) break;
    if (exists === null || i > 50) return { ok: false, message: "Nu am putut pregăti încărcarea. Încearcă din nou." };
    key = `cursuri/${lesson.course.slug}/${base}-${i}.${ext}`;
  }

  return { ok: true, url: await getSignedUploadUrl(key, input.contentType, input.size), key };
}

export async function deleteBlock(blockId: string) {
  await assertAdmin();
  const block = await prisma.lessonBlock.delete({ where: { id: blockId }, select: { videoKey: true } });
  await removeUnusedVideos([block.videoKey]);
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
