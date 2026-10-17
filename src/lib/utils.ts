import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Acceptă doar căi relative din site, ca un link de login să nu poată
// redirecționa spre alt domeniu (ex: "//evil.com" sau "https://...").
export function safeCallbackUrl(value: unknown, fallback = "/") {
  if (typeof value !== "string") return fallback
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback
  }
  return value
}
