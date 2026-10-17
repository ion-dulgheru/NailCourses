"use server";

import { randomUUID } from "node:crypto";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
import { completeOrder, createPaymentRedirect, getOwnOrder, isTestPaymentMode } from "@/lib/payments";

export type CheckoutState = { message: string };

// O comandă „în așteptare” recentă pentru același curs se refolosește, ca reîncercările
// să nu umple istoricul cu comenzi abandonate.
const REUSE_PENDING_MS = 30 * 60 * 1000;

export async function startCheckout(prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const slug = String(formData.get("slug") ?? "");
  const user = await getCurrentUser();
  if (!user) redirect(`/autentificare?callbackUrl=${encodeURIComponent(`/checkout/${slug}`)}`);

  if (formData.get("acceptTerms") !== "on") {
    return { message: "Bifează acordul cu termenii și politica de rambursare ca să continui." };
  }

  const course = await prisma.course.findFirst({
    where: { slug, status: "publicat" },
    select: { id: true, priceMdl: true },
  });
  if (!course) return { message: "Cursul nu mai este disponibil." };

  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    select: { id: true },
  });
  if (enrolled) redirect(`/cursurile-mele/${slug}`);

  // Prețul se copiază în comandă: o schimbare ulterioară de preț nu atinge comenzile vechi.
  const order =
    (await prisma.order.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
        status: "in_asteptare",
        amountMdl: course.priceMdl,
        createdAt: { gte: new Date(Date.now() - REUSE_PENDING_MS) },
      },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    })) ??
    (await prisma.order.create({
      data: { userId: user.id, courseId: course.id, amountMdl: course.priceMdl },
      select: { id: true },
    }));

  let paymentUrl: string;
  try {
    paymentUrl = await createPaymentRedirect(order.id);
  } catch (error) {
    console.error("Checkout error:", error);
    return { message: "Plata online nu este disponibilă momentan. Te rugăm să ne contactezi." };
  }
  redirect(paymentUrl);
}

// Banca de test: face exact ce va face callback-ul maib, apoi trimite elevul înapoi pe site.
export async function simulateTestPayment(orderId: string, outcome: "succes" | "esec") {
  if (!isTestPaymentMode()) notFound();

  const user = await getCurrentUser();
  const order = user && (await getOwnOrder(orderId, user.id));
  if (!order) notFound();

  await completeOrder(
    order.id,
    outcome === "succes"
      ? { ok: true, transactionId: `TEST-${randomUUID()}`, amountMdl: order.amountMdl }
      : { ok: false },
  );
  redirect(`/checkout/${outcome}?comanda=${order.id}`);
}
