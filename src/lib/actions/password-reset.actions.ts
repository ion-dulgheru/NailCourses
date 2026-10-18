"use server";

import { redirect } from "next/navigation";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "../db";
import { sendEmail } from "../email";
import { createResetToken, siteUrl, verifyResetToken } from "../password-reset";
import { isRateLimited, registerAttempt } from "../rate-limit";
import { forgotPasswordSchema, resetPasswordSchema } from "../validators";

const MAX_RESET_REQUESTS = 3;
const RESET_WINDOW_MS = 15 * 60 * 1000;

export type ResetFormState = {
  sent?: boolean;
  message: string;
  fields?: Record<string, string>;
};

export async function requestPasswordReset(prev: ResetFormState, formData: FormData): Promise<ResetFormState> {
  const email = String(formData.get("email") ?? "");
  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) return { message: "Adresa de email este invalidă", fields: { email } };

  const limitKey = `reset:${parsed.data.email}`;
  if (isRateLimited(limitKey, MAX_RESET_REQUESTS)) {
    return { message: "Prea multe cereri. Încearcă din nou peste 15 minute.", fields: { email } };
  }
  registerAttempt(limitKey, RESET_WINDOW_MS);

  // Același răspuns indiferent dacă adresa are cont, ca să nu dezvăluim cine e înregistrat.
  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, email: true, password: true },
  });
  if (user) {
    const link = `${await siteUrl()}/parola-noua?token=${createResetToken(user)}`;
    const sent = await sendEmail({
      to: user.email,
      subject: "Resetează parola — GJ Nail Academy",
      text: [
        "Ai cerut o parolă nouă pentru contul tău GJ Nail Academy.",
        "",
        `Alege parola nouă aici (linkul e valabil o oră): ${link}`,
        "",
        "Dacă nu tu ai cerut resetarea, ignoră acest email. Parola actuală rămâne neschimbată.",
      ].join("\n"),
    });
    // Până se conectează serviciul de email, linkul apare în consola serverului de dezvoltare.
    if (!sent && process.env.NODE_ENV !== "production") {
      console.info(`[resetare parolă] ${user.email}: ${link}`);
    }
  }

  return { sent: true, message: "" };
}

export async function resetPassword(prev: ResetFormState, formData: FormData): Promise<ResetFormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Date invalide" };

  const user = await verifyResetToken(parsed.data.token);
  if (!user) return { message: "Linkul a expirat sau a fost deja folosit. Cere unul nou." };

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashSync(parsed.data.password, 10) },
  });
  // Linkul a venit pe email, deci adresa e dovedită: un cont neconfirmat devine confirmat.
  await prisma.user.updateMany({ where: { id: user.id, emailVerified: null }, data: { emailVerified: new Date() } });

  redirect("/autentificare?parola=noua");
}
