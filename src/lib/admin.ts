import "server-only";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// Rolul se citește din baza de date la fiecare cerere, nu din sesiune (JWT-ul poate fi vechi).
async function currentAdmin() {
  const session = await auth();
  if (!session?.user?.id) return { session: null, admin: null };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, surname: true, email: true, role: true },
  });
  return { session, admin: user?.role === "admin" ? user : null };
}

// Pentru pagini: nelogat → login; logat dar fără rol admin → 404 (nu dezvăluim panoul).
export async function requireAdminPage(callbackUrl = "/admin") {
  const { session, admin } = await currentAdmin();
  if (!session) redirect(`/autentificare?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  if (!admin) notFound();
  return admin;
}

// Pentru acțiuni de server: fiecare acțiune verifică singură, independent de pagină.
export async function assertAdmin() {
  const { admin } = await currentAdmin();
  if (!admin) throw new Error("Acces interzis");
  return admin;
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
