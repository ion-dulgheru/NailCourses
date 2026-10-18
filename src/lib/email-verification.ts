import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "./db";
import { sendEmail } from "./email";
import { siteUrl } from "./password-reset";

// Link de confirmare a emailului, fără tabel în baza de date (ca la resetarea parolei): tokenul e
// semnat (HMAC cu AUTH_SECRET) peste id-ul utilizatorului, expirare și adresa de email.

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;

function signature(userId: string, expires: number, email: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET lipsește");
  return createHmac("sha256", secret).update(`email:${userId}:${expires}:${email}`).digest("base64url");
}

function createVerifyToken(user: { id: string; email: string }) {
  const expires = Date.now() + VERIFY_TTL_MS;
  const payload = Buffer.from(`${user.id}.${expires}`).toString("base64url");
  return `${payload}.${signature(user.id, expires, user.email)}`;
}

// Utilizatorul căruia îi aparține un token valid, sau null (format greșit, expirat, alt email).
export async function verifyEmailToken(token: unknown) {
  if (typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const [userId, expiresRaw] = Buffer.from(payload, "base64url").toString().split(".");
  const expires = Number(expiresRaw);
  if (!userId || !Number.isFinite(expires) || expires < Date.now()) return null;

  const user = await prisma.user
    .findUnique({ where: { id: userId }, select: { id: true, email: true, emailVerified: true } })
    .catch(() => null); // id care nu e uuid
  if (!user) return null;

  const expected = Buffer.from(signature(user.id, expires, user.email));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  return user;
}

export async function sendVerificationEmail(user: { id: string; email: string; name: string }) {
  const link = `${await siteUrl()}/confirmare-email?token=${createVerifyToken(user)}`;
  const sent = await sendEmail({
    to: user.email,
    subject: "Confirmă-ți emailul — GJ Nail Academy",
    text: [
      `Bună, ${user.name}!`,
      "",
      "Mulțumim că ți-ai creat cont la GJ Nail Academy. Confirmă adresa de email ca să poți intra în cont:",
      link,
      "",
      "Linkul e valabil 24 de ore. Dacă nu tu ți-ai creat contul, ignoră acest email.",
    ].join("\n"),
  });
  // Fără serviciu de email, linkul apare în consola serverului de dezvoltare.
  if (!sent && process.env.NODE_ENV !== "production") {
    console.info(`[confirmare email] ${user.email}: ${link}`);
  }
  return sent;
}
