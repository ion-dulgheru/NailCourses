import type { OrderStatus } from "@/generated/prisma/client";

// Etichete și culori pentru stările unei comenzi (folosite în admin și în istoricul elevului).
export const ORDER_STATUS: Record<OrderStatus, { label: string; className: string }> = {
  in_asteptare: { label: "În așteptare", className: "bg-amber-50 text-amber-900" },
  platita: { label: "Plătită", className: "bg-emerald-50 text-emerald-800" },
  esuata: { label: "Eșuată", className: "bg-red-50 text-red-800" },
  rambursata: { label: "Rambursată", className: "bg-stone/10 text-stone" },
};

export function parseOrderStatus(value: string | undefined): OrderStatus | undefined {
  return value && value in ORDER_STATUS ? (value as OrderStatus) : undefined;
}
