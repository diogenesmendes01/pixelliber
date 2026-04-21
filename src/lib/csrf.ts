import { NextRequest, NextResponse } from "next/server";

/**
 * CSRF protection utility
 * Uses double-submit cookie pattern for stateless validation.
 * See: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
 */

const CSRF_SECRET = process.env.CSRF_SECRET ?? "pixelliber-csrf-fallback-secret";
const CSRF_TOKEN_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";

/**
 * Generate a CSRF token using HMAC-SHA256.
 * Tokens are time-limited (2 hours default).
 */
export async function generateCsrfToken(sessionId: string): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const data = `${sessionId}:${timestamp}`;
  const key = new TextEncoder().encode(CSRF_SECRET);
  const dataEncoded = new TextEncoder().encode(data);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, dataEncoded);
  const signatureHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${timestamp}.${signatureHex}`;
}

/**
 * Verify a CSRF token.
 * Returns true if valid, false otherwise.
 */
export async function verifyCsrfToken(
  token: string,
  sessionId: string
): Promise<boolean> {
  try {
    const [timestampStr, signature] = token.split(".");
    const timestamp = parseInt(timestampStr, 10);

    // Token expires after 2 hours
    const age = Math.floor(Date.now() / 1000) - timestamp;
    if (age > 2 * 60 * 60 || age < 0) {
      return false;
    }

    const data = `${sessionId}:${timestamp}`;
    const key = new TextEncoder().encode(CSRF_SECRET);
    const dataEncoded = new TextEncoder().encode(data);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const expectedSignature = await crypto.subtle.sign("HMAC", cryptoKey, dataEncoded);
    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return signature === expectedHex;
  } catch {
    return false;
  }
}

/**
 * Validate CSRF from an incoming request.
 * Checks both the token cookie and the x-csrf-token header (double-submit).
 * Returns an error NextResponse if invalid, or null if valid.
 */
export async function validateCsrfRequest(
  req: NextRequest,
  sessionId: string
): Promise<NextResponse | null> {
  // Require the CSRF header
  const token = req.headers.get(CSRF_HEADER);
  if (!token) {
    return NextResponse.json(
      { error: "CSRF token missing" },
      { status: 403 }
    );
  }

  // Require the cookie
  const cookieValue = req.cookies.get(CSRF_TOKEN_COOKIE)?.value;
  if (!cookieValue) {
    return NextResponse.json(
      { error: "CSRF cookie missing" },
      { status: 403 }
    );
  }

  // Verify double-submit
  if (token !== cookieValue) {
    return NextResponse.json(
      { error: "CSRF token mismatch" },
      { status: 403 }
    );
  }

  // Verify token signature and expiry
  const valid = await verifyCsrfToken(token, sessionId);
  if (!valid) {
    return NextResponse.json(
      { error: "CSRF token invalid or expired" },
      { status: 403 }
    );
  }

  return null;
}

export { CSRF_TOKEN_COOKIE, CSRF_HEADER };
