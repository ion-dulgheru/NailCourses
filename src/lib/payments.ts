import "server-only";
import { prisma } from "@/lib/db";

// Plățile, independent de bancă. Accesul la curs se acordă DOAR din `completeOrder`, apelată de
// callback-ul băncii (sau de banca de test în dezvoltare), niciodată de pagina de succes.

// Banca de test simulează maib local. În producție e dezactivată, ca nimeni să nu-și poată
// „plăti” singur un curs. Când se conectează maib, `createPaymentRedirect` cere sesiunea reală.
export function isTestPaymentMode() {
  return process.env.NODE_ENV !== "production";
}

export async function createPaymentRedirect(orderId: string): Promise<string> {
  if (isTestPaymentMode()) return `/checkout/test-banca?comanda=${orderId}`;
  // TODO(maib): cere băncii o sesiune de plată (/api/plata/maib/creare) și întoarce URL-ul ei.
  throw new Error("Plățile online nu sunt încă activate.");
}

type PaymentResult =
  | { ok: true; transactionId: string; amountMdl: number }
  | { ok: false; transactionId?: string };

// Idempotentă: o comandă trece din „în așteptare” o singură dată, oricâte callback-uri ar veni.
export async function completeOrder(orderId: string, result: PaymentResult) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== "in_asteptare") return order;

    if (!result.ok) {
      await tx.order.updateMany({
        where: { id: orderId, status: "in_asteptare" },
        data: { status: "esuata", maibTransactionId: result.transactionId ?? null },
      });
      return tx.order.findUnique({ where: { id: orderId } });
    }

    // Suma confirmată de bancă trebuie să fie exact cea din comandă.
    if (result.amountMdl !== order.amountMdl) {
      throw new Error(`Suma plătită (${result.amountMdl}) diferă de comandă (${order.amountMdl}) pentru ${orderId}`);
    }

    // Condiția pe stare face actualizarea sigură și la două callback-uri simultane.
    const { count } = await tx.order.updateMany({
      where: { id: orderId, status: "in_asteptare" },
      data: { status: "platita", paidAt: new Date(), maibTransactionId: result.transactionId },
    });
    if (count === 0) return tx.order.findUnique({ where: { id: orderId } });

    // Dacă elevul are deja acces (ex: acordat manual), înscrierea existentă rămâne neschimbată.
    await tx.enrollment.upsert({
      where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
      create: { userId: order.userId, courseId: order.courseId, source: "plata", orderId },
      update: {},
    });

    return tx.order.findUnique({ where: { id: orderId } });
  });
}

// Comanda elevului logat, cu cursul ei. Altcineva primește `null` (paginile răspund cu 404).
export async function getOwnOrder(orderId: string | undefined, userId: string) {
  if (!orderId || !/^[0-9a-f-]{36}$/i.test(orderId)) return null;
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { course: { select: { slug: true, title: true, coverImage: true, coverAlt: true } } },
  });
}
