// Limitator simplu în memorie (fereastră fixă). Ajunge pentru un singur server;
// pe mai multe instanțe/serverless trebuie mutat într-un store comun (ex: Redis).

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function isRateLimited(key: string, limit: number): boolean {
  const bucket = buckets.get(key);
  return !!bucket && bucket.resetAt > Date.now() && bucket.count >= limit;
}

export function registerAttempt(key: string, windowMs: number): void {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count++;
}

export function resetAttempts(key: string): void {
  buckets.delete(key);
}
