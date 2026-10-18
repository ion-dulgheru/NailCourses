import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Adresa de email este invalidă")
  .max(254);

const newPassword = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Parola trebuie să aibă cel puțin ${PASSWORD_MIN_LENGTH} caractere`)
  .max(128);

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Introdu parola"),
});

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Numele trebuie să aibă cel puțin 2 caractere").max(100),
    surname: z.string().trim().min(2, "Prenumele trebuie să aibă cel puțin 2 caractere").max(100),
    email,
    password: newPassword,
    confirmPassword: z.string(),
    acceptTerms: z.literal("on", {
      error: "Trebuie să fii de acord cu termenii și politica de confidențialitate",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu se potrivesc",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: newPassword,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu se potrivesc",
    path: ["confirmPassword"],
  });
