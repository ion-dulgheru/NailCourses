import type { CourseLevel } from "@/generated/prisma/client";

// Formatare pentru cursuri, fără acces la baza de date (sigur de importat și în componente client).

export const LEVELS: { value: CourseLevel; label: string; param: string }[] = [
  { value: "incepator", label: "Începător", param: "incepator" },
  { value: "intermediar", label: "Intermediar", param: "intermediar" },
  { value: "avansat", label: "Avansat", param: "avansat" },
];

export function levelLabel(level: CourseLevel) {
  return LEVELS.find((l) => l.value === level)?.label ?? level;
}

export function parseLevel(param: string | undefined): CourseLevel | undefined {
  return LEVELS.find((l) => l.param === param)?.value;
}

// „1 200 MDL” cu spațiu nedespărțit, ca pe restul site-ului.
export function formatMdl(amount: number) {
  return `${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} MDL`;
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

export function lessonsLabel(count: number) {
  return count === 1 ? "1 lecție" : `${count} lecții`;
}
