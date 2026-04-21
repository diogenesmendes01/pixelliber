/**
 * In-memory rate limiter for login attempts.
 * Key: CNPJ + IP, Value: array of timestamps (last 15 minutes)
 *
 * This is more secure than IP-only limiting because it prevents an attacker
 * from exhausting login attempts for a target CNPJ from a single IP.
 */
const attempts = new Map<string, number[]>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function buildKey(cnpj: string, ip: string): string {
  return `${cnpj}:${ip}`;
}

export function isRateLimited(cnpj: string, ip: string): boolean {
  const now = Date.now();
  const key = buildKey(cnpj, ip);
  const record = attempts.get(key) ?? [];
  const recent = record.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_ATTEMPTS) {
    return true;
  }

  attempts.set(key, [...recent, now]);
  return false;
}

export function recordAttempt(cnpj: string, ip: string): void {
  const now = Date.now();
  const key = buildKey(cnpj, ip);
  const record = attempts.get(key) ?? [];
  const recent = record.filter((t) => now - t < WINDOW_MS);
  attempts.set(key, [...recent, now]);
}

export function clearAttempts(cnpj: string, ip: string): void {
  attempts.delete(buildKey(cnpj, ip));
}
