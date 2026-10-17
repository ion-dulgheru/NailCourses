import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// Utilizatorul logat, verificat în baza de date. Sesiunea (JWT) poate rămâne validă după
// ștergerea contului, deci nu ne bazăm doar pe ea când decidem redirecționări.
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, surname: true, email: true, role: true },
  });
}
