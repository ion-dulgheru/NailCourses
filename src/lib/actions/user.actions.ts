"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn, signOut } from "../../auth";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "../db";
import { signInSchema, signUpSchema } from "../validators";
import { safeCallbackUrl } from "../utils";
import { ZodError } from "zod";

const INVALID_LOGIN_MESSAGE = "Email sau parolă incorecte";

export type AuthFormState = {
  success: boolean;
  message: string;
  // Valorile trimise, ca formularul să nu se golească după o eroare (fără parole).
  fields?: Record<string, string>;
};

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

    await prisma.user.create({
      data: {
        name: user.name,
        surname: user.surname,
        email: user.email,
        password: hashedPassword,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirectTo: safeCallbackUrl(formData.get("callbackUrl")),
    });

    return { success: true, message: "Înregistrare reușită" };
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

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
