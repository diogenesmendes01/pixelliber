/**
 * In-memory rate limiter for password reset attempts.
 * Key: email, Value: array of timestamps (last hour)
 */
const attempts = new Map<string, number[]>();
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function isRateLimited(email: string): boolean {
  const now = Date.now();
  const record = attempts.get(email) ?? [];
  const recent = record.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_ATTEMPTS) {
    return true;
  }

  attempts.set(email, [...recent, now]);
  return false;
}

export function recordAttempt(email: string): void {
  const now = Date.now();
  const record = attempts.get(email) ?? [];
  const recent = record.filter((t) => now - t < WINDOW_MS);
  attempts.set(email, [...recent, now]);
}

export function clearAttempts(email: string): void {
  attempts.delete(email);
}