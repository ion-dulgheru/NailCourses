// Sursa unui bloc video, independent de furnizor. Fără acces la server: se poate folosi și în admin (client).
//  - link YouTube → player YouTube (public; potrivit doar pentru lecțiile de probă)
//  - orice altceva → cheia unui fișier din spațiul de stocare (R2), servit prin link semnat temporar
export type VideoSource = { kind: "youtube"; id: string } | { kind: "fisier"; key: string };

const YOUTUBE =
  /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([\w-]{11})/i;

export function parseVideoSource(value: string | null | undefined): VideoSource | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const youtube = trimmed.match(YOUTUBE);
  if (youtube) return { kind: "youtube", id: youtube[1] };
  if (/^https?:\/\//i.test(trimmed)) return null; // alte linkuri externe nu sunt acceptate

  return { kind: "fisier", key: trimmed.replace(/^\/+/, "") };
}

export function youtubeEmbedUrl(id: string) {
  // fs=0: ecranul complet trece prin butonul nostru, ca filigranul să rămână vizibil.
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&fs=0&playsinline=1`;
}
