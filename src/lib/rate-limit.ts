import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOGIN_MAX_ATTEMPTS = 5;

export function checkLoginRateLimit(request: NextRequest): { allowed: boolean; remaining: number; resetAt: number } {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";

  const now = Date.now();
  const key = `login:${ip}`;

  const entry = rateLimitStore.get(key);

  // Clean up if window has passed or entry doesn't exist
  if (!entry || now > entry.resetAt) {
    const resetAt = now + LOGIN_WINDOW_MS;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: LOGIN_MAX_ATTEMPTS - 1, resetAt };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  if (entry.count > LOGIN_MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: LOGIN_MAX_ATTEMPTS - entry.count, resetAt: entry.resetAt };
}

export function getRateLimitResponse(resetAt: number): NextResponse {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
  return NextResponse.json(
    { error: "Muitas tentativas de login. Tente novamente mais tarde." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Reset": String(resetAt),
      },
    }
  );
}

const EMAIL_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const EMAIL_MAX_ATTEMPTS = 3;

export function isRateLimited(email: string): boolean {
  const now = Date.now();
  const key = `email:${email}`;
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + EMAIL_WINDOW_MS });
    return false;
  }
  
  if (entry.count >= EMAIL_MAX_ATTEMPTS) {
    return true;
  }
  
  entry.count++;
  rateLimitStore.set(key, entry);
  return false;
}
