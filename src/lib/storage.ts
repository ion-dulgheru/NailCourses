import "server-only";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  NotFound,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Spațiul de stocare pentru videoclipuri (Cloudflare R2, bucket privat). Elevul primește doar
// linkuri semnate care expiră în câteva minute, emise după verificarea accesului.
export const SIGNED_URL_TTL_SECONDS = 5 * 60;

// Planul gratuit R2 include 10 GB; peste limită adminul nu mai poate urca și e trimis la creatorul site-ului.
export const STORAGE_LIMIT_BYTES = 10 * 1024 ** 3;
// Limita R2 pentru o singură încărcare (fără upload în bucăți).
export const MAX_UPLOAD_BYTES = 5 * 1024 ** 3;
// Linkul de încărcare trebuie să reziste cât durează urcarea unui fișier mare.
const UPLOAD_URL_TTL_SECONDS = 6 * 60 * 60;

export function isStorageConfigured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET,
  );
}

let client: S3Client | null = null;

// R2 vorbește API-ul S3; regiunea e mereu „auto”.
function getClient() {
  client ??= new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  return client;
}

// `false` doar când R2 confirmă că fișierul lipsește; `null` dacă nu putem afla (R2 neconfigurat
// sau eroare de rețea), ca o problemă trecătoare să nu blocheze adminul sau redarea.
export async function videoExists(key: string): Promise<boolean | null> {
  if (!isStorageConfigured()) return null;
  try {
    await getClient().send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
    return true;
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
    return error instanceof NotFound || status === 404 ? false : null;
  }
}

// Șterge definitiv un fișier din bucket. Un fișier care nu există nu e o eroare.
export async function deleteVideoFile(key: string) {
  if (!isStorageConfigured()) return;
  await getClient().send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
}

// Totalul ocupat în bucket, în octeți (R2 nu are un apel direct, așa că adunăm din listare).
export async function getStorageUsage(): Promise<number> {
  let total = 0;
  let token: string | undefined;
  do {
    const page = await getClient().send(
      new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET, ContinuationToken: token }),
    );
    for (const object of page.Contents ?? []) total += object.Size ?? 0;
    token = page.NextContinuationToken;
  } while (token);
  return total;
}

// Link de încărcare directă din browser în R2. Mărimea e inclusă în semnătură, deci R2 refuză
// un fișier mai mare decât cel declarat (și verificat față de limită).
export async function getSignedUploadUrl(key: string, contentType: string, size: number) {
  return getSignedUrl(
    getClient(),
    new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, ContentType: contentType, ContentLength: size }),
    { expiresIn: UPLOAD_URL_TTL_SECONDS },
  );
}

// `null` cât timp R2 nu e configurat: playerul afișează „Videoclipul va fi disponibil în curând”.
// Semnarea se face local (fără cerere la R2), deci nu verifică existența fișierului.
export async function getSignedVideoUrl(key: string): Promise<string | null> {
  if (!isStorageConfigured()) return null;
  return getSignedUrl(getClient(), new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }), {
    expiresIn: SIGNED_URL_TTL_SECONDS,
  });
}
