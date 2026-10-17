import "server-only";

// Spațiul de stocare pentru videoclipuri (Cloudflare R2, bucket privat). Elevul primește doar
// linkuri semnate care expiră în câteva minute, emise după verificarea accesului.
export const SIGNED_URL_TTL_SECONDS = 5 * 60;

export function isStorageConfigured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET,
  );
}

// `null` cât timp R2 nu e configurat: playerul afișează „Videoclipul va fi disponibil în curând”.
export async function getSignedVideoUrl(key: string): Promise<string | null> {
  if (!isStorageConfigured()) return null;
  // TODO(R2): link GET presemnat pentru `key`, valabil SIGNED_URL_TTL_SECONDS.
  void key;
  return null;
}
