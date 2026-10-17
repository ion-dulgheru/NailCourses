"use server";

import { refresh } from "next/cache";
import { compareSync, hashSync } from "bcrypt-ts-edge";
import { z } from "zod";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { PASSWORD_MIN_LENGTH } from "@/lib/validators";
import { isRateLimited, registerAttempt, resetAttempts } from "@/lib/rate-limit";

// Verificările parolei actuale au aceeași limită ca autentificarea: 5 greșeli pe minut.
const MAX_PASSWORD_ATTEMPTS = 5;
const PASSWORD_WINDOW_MS = 60 * 1000;
const TOO_MANY = "Prea multe încercări greșite. Așteaptă un minut și încearcă din nou.";

export type AccountFormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

async function currentUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Nu ești autentificat");
  return session.user.id;
}

function fieldErrors(error: z.ZodError): AccountFormState {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) errors[String(issue.path[0])] ??= issue.message;
  return { ok: false, message: "", errors };
}

const nameSchema = z.object({
  surname: z.string().trim().min(2, "Prenumele trebuie să aibă cel puțin 2 caractere").max(100),
  name: z.string().trim().min(2, "Numele trebuie să aibă cel puțin 2 caractere").max(100),
});

export async function updateName(prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const userId = await currentUserId();
  const parsed = nameSchema.safeParse({ surname: formData.get("surname"), name: formData.get("name") });
  if (!parsed.success) return fieldErrors(parsed.error);

  await prisma.user.update({ where: { id: userId }, data: parsed.data });
  refresh();
  return { ok: true, message: "Datele au fost salvate." };
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Introdu parola actuală"),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Parola nouă trebuie să aibă cel puțin ${PASSWORD_MIN_LENGTH} caractere`)
      .max(128),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Parolele nu se potrivesc",
    path: ["confirmPassword"],
  });

export async function changePassword(prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const userId = await currentUserId();
  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return fieldErrors(parsed.error);

  const limitKey = `password:${userId}`;
  if (isRateLimited(limitKey, MAX_PASSWORD_ATTEMPTS)) return { ok: false, message: TOO_MANY };

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { password: true } });
  if (!user?.password || !compareSync(parsed.data.currentPassword, user.password)) {
    registerAttempt(limitKey, PASSWORD_WINDOW_MS);
    return { ok: false, message: "", errors: { currentPassword: "Parola actuală nu este corectă" } };
  }
  resetAttempts(limitKey);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashSync(parsed.data.newPassword, 10) },
  });
  return { ok: true, message: "Parola a fost schimbată." };
}

export async function deleteAccount(prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const userId = await currentUserId();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true, role: true, _count: { select: { orders: true } } },
  });
  if (!user) return { ok: false, message: "Contul nu a fost găsit." };

  if (user.role === "admin") {
    return { ok: false, message: "Contul de administrator nu poate fi șters de aici." };
  }
  const limitKey = `password:${userId}`;
  if (isRateLimited(limitKey, MAX_PASSWORD_ATTEMPTS)) return { ok: false, message: TOO_MANY };
  if (!user.password || !compareSync(password, user.password)) {
    registerAttempt(limitKey, PASSWORD_WINDOW_MS);
    return { ok: false, message: "", errors: { password: "Parola nu este corectă" } };
  }
  resetAttempts(limitKey);
  // Comenzile plătite se păstrează pentru evidența contabilă; ștergerea se face atunci manual.
  if (user._count.orders > 0) {
    return {
      ok: false,
      message: "Contul are comenzi înregistrate. Scrie-ne și îl ștergem noi, păstrând doar ce cere legea.",
    };
  }

  // Înscrierile, progresul și certificatele se șterg în cascadă.
  await prisma.user.delete({ where: { id: userId } });
  await signOut({ redirectTo: "/" });
  return { ok: true, message: "" };
}
