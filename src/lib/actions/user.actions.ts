"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { EmailNotVerified, signIn, signOut } from "../../auth";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "../db";
import { forgotPasswordSchema, signInSchema, signUpSchema } from "../validators";
import { sendVerificationEmail } from "../email-verification";
import { isRateLimited, registerAttempt } from "../rate-limit";
import { safeCallbackUrl } from "../utils";
import { ZodError } from "zod";

const INVALID_LOGIN_MESSAGE = "Email sau parolă incorecte";

export type AuthFormState = {
  success: boolean;
  message: string;
  // Valorile trimise, ca formularul să nu se golească după o eroare (fără parole).
  fields?: Record<string, string>;
  // Contul există, dar emailul nu e confirmat: formularul arată „Verifică emailul” și retrimiterea.
  verifyEmail?: string;
};

const MAX_VERIFY_EMAILS = 3;
const VERIFY_WINDOW_MS = 15 * 60 * 1000;

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function signInWithCredentials(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const fields = { email: formText(formData, "email") };
  const parsed = signInSchema.safeParse({
    email: fields.email,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, message: INVALID_LOGIN_MESSAGE, fields };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeCallbackUrl(formData.get("callbackUrl")),
    });

    return { success: true, message: "Autentificare reușită" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof EmailNotVerified) {
      return {
        success: false,
        message: "Confirmă-ți emailul înainte să intri în cont. Caută linkul primit la înregistrare.",
        fields,
        verifyEmail: parsed.data.email,
      };
    }

    return { success: false, message: INVALID_LOGIN_MESSAGE, fields };
  }
}


export async function signUpUser(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const fields = {
    name: formText(formData, "name"),
    surname: formText(formData, "surname"),
    email: formText(formData, "email"),
  };

  try {
    const user = signUpSchema.parse({
      ...fields,
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      acceptTerms: formData.get("acceptTerms"),
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    // Mesaj neutru: nu confirmăm că adresa există deja în sistem.
    if (existingUser) {
      return {
        success: false,
        message: "Nu am putut crea contul. Dacă ai deja cont, autentifică-te.",
        fields,
      };
    }

    const hashedPassword = hashSync(user.password, 10);

    const created = await prisma.user.create({
      data: {
        name: user.name,
        surname: user.surname,
        email: user.email,
        password: hashedPassword,
      },
    });

    // Contul se poate folosi abia după confirmarea emailului (vezi `authorize` din auth.ts).
    registerAttempt(`verify:${created.email}`, VERIFY_WINDOW_MS);
    await sendVerificationEmail(created);

    return { success: true, message: "", verifyEmail: created.email };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      return { success: false, message: error.issues[0].message, fields };
    }

    console.error("Sign-up error:", error);
    return { success: false, message: "Înregistrare eșuată. Încearcă din nou.", fields };
  }
}

// Retrimite linkul de confirmare. Același răspuns oricare ar fi adresa, ca să nu dezvăluim conturi.
export async function resendVerificationEmail(
  prevState: { message: string },
  formData: FormData
): Promise<{ message: string }> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { message: "Adresa de email este invalidă." };

  const limitKey = `verify:${parsed.data.email}`;
  if (isRateLimited(limitKey, MAX_VERIFY_EMAILS)) {
    return { message: "Ai cerut prea multe emailuri. Încearcă din nou peste 15 minute." };
  }
  registerAttempt(limitKey, VERIFY_WINDOW_MS);

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, email: true, name: true, emailVerified: true },
  });
  if (user && !user.emailVerified) await sendVerificationEmail(user);

  return { message: "Dacă adresa are un cont neconfirmat, ți-am trimis un link nou." };
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
