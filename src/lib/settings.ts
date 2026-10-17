import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";

// Datele generale ale site-ului (tabelul `Setting`, cheie → valoare). Le editează adminul
// în /admin/setari; apar în subsol, pe pagina de contact, în paginile legale și pe certificat.
export const SETTING_FIELDS = [
  { key: "firma_denumire", label: "Denumirea firmei", group: "firma", hint: "Ex: GJ Nail Studio SRL" },
  { key: "firma_idno", label: "Număr de înregistrare (IDNO)", group: "firma" },
  { key: "firma_adresa", label: "Adresa juridică", group: "firma" },
  { key: "firma_telefon", label: "Telefon", group: "firma", hint: "Ex: +373 60 206 061" },
  { key: "contact_email", label: "Email de contact", group: "contact", hint: "Aici ajung mesajele din formularul de contact." },
  { key: "instagram_url", label: "Link Instagram", group: "contact", hint: "Adresa completă, cu https://" },
  { key: "facebook_url", label: "Link Facebook", group: "contact", hint: "Opțional" },
  { key: "tiktok_url", label: "Link TikTok", group: "contact", hint: "Opțional" },
  { key: "certificat_semnatura", label: "Semnătura de pe certificat", group: "certificat", hint: "Numele instructoarei, așa cum apare sub linia de semnătură." },
  { key: "certificat_text", label: "Textul certificatului", group: "certificat", hint: "Fraza de sub numele elevului. Ex: a absolvit cu succes cursul" },
] as const;

export type SettingKey = (typeof SETTING_FIELDS)[number]["key"];
export type SiteSettings = Record<SettingKey, string>;

const DEFAULTS: SiteSettings = {
  firma_denumire: "",
  firma_idno: "",
  firma_adresa: "Ialoveni, Republica Moldova",
  firma_telefon: "+373 60 206 061",
  contact_email: "",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
  certificat_semnatura: "Fondatoarea GJ Nail Studio",
  certificat_text: "",
};

// O singură interogare per cerere, oricâte componente cer setările.
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await prisma.setting.findMany({
    where: { key: { in: SETTING_FIELDS.map((f) => f.key) } },
  });
  const settings = { ...DEFAULTS };
  for (const row of rows) {
    if (row.value.trim()) settings[row.key as SettingKey] = row.value;
  }
  return settings;
});

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
