"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { getSettings } from "@/lib/settings";
import { isRateLimited, registerAttempt } from "@/lib/rate-limit";

export type ContactFormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

const MAX_MESSAGES = 5;
const WINDOW_MS = 60 * 60 * 1000;

const contactSchema = z.object({
  name: z.string().trim().min(2, "Scrie-ți numele").max(100),
  email: z.email("Adresa de email nu este validă").trim().max(200),
  message: z.string().trim().min(10, "Mesajul e prea scurt (minimum 10 caractere)").max(3000, "Mesajul e prea lung"),
});

export async function sendContactMessage(prev: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Câmp ascuns pe care doar roboții îl completează: le răspundem „trimis” fără să facem nimic.
  if (String(formData.get("website") ?? "")) return { ok: true, message: "Mesajul a fost trimis. Îți răspundem curând." };

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { ok: false, message: "", errors, values };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "necunoscut";
  const limitKey = `contact:${ip}`;
  if (isRateLimited(limitKey, MAX_MESSAGES)) {
    return { ok: false, message: "Ai trimis prea multe mesaje. Încearcă din nou mai târziu.", values };
  }

  const settings = await getSettings();
  const fallback = settings.contact_email
    ? `Scrie-ne direct la ${settings.contact_email} sau sună la ${settings.firma_telefon}.`
    : `Sună-ne la ${settings.firma_telefon}.`;

  const sent =
    !!settings.contact_email &&
    (await sendEmail({
      to: settings.contact_email,
      replyTo: parsed.data.email,
      subject: `Mesaj nou de pe site de la ${parsed.data.name}`,
      text: `Nume: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
    }));

  if (!sent) {
    return { ok: false, message: `Mesajul nu a putut fi trimis momentan. ${fallback}`, values };
  }

  registerAttempt(limitKey, WINDOW_MS);
  return { ok: true, message: "Mesajul a fost trimis. Îți răspundem curând pe email." };
}
