import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "./db";

// Link de resetare fără tabel în baza de date: tokenul e semnat (HMAC cu AUTH_SECRET) peste
// id-ul utilizatorului, expirare și hash-ul parolei curente. Când parola se schimbă, hash-ul
// se schimbă și el, deci linkul devine automat invalid — se poate folosi o singură dată.

export const RESET_TTL_MS = 60 * 60 * 1000;

function signature(userId: string, expires: number, passwordHash: string | null) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET lipsește");
  return createHmac("sha256", secret)
    .update(`parola:${userId}:${expires}:${passwordHash ?? ""}`)
    .digest("base64url");
}

export function createResetToken(user: { id: string; password: string | null }) {
  const expires = Date.now() + RESET_TTL_MS;
  const payload = Buffer.from(`${user.id}.${expires}`).toString("base64url");
  return `${payload}.${signature(user.id, expires, user.password)}`;
}

// Utilizatorul căruia îi aparține un token valid, sau null (format greșit, expirat, deja folosit).
export async function verifyResetToken(token: unknown) {
  if (typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const [userId, expiresRaw] = Buffer.from(payload, "base64url").toString().split(".");
  const expires = Number(expiresRaw);
  if (!userId || !Number.isFinite(expires) || expires < Date.now()) return null;

  const user = await prisma.user
    .findUnique({ where: { id: userId }, select: { id: true, email: true, password: true } })
    .catch(() => null); // id care nu e uuid
  if (!user) return null;

  const expected = Buffer.from(signature(user.id, expires, user.password));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  return { id: user.id, email: user.email };
}

// Adresa site-ului pentru linkurile din emailuri. În producție vine DOAR din SITE_URL:
// antetul Host poate fi falsificat, iar linkul de resetare ar ajunge pe alt domeniu.
export async function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") throw new Error("SITE_URL lipsește");
  const h = await headers();
  return `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}`;
}
