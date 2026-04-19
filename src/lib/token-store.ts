/**
 * In-memory store for password reset tokens.
 * In production, this should be a database table.
 *
 * Token shape: { email, token, expiresAt }
 */
interface ResetToken {
  email: string;
  token: string;
  expiresAt: number;
  used: boolean;
}

const tokens = new Map<string, ResetToken>();

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export interface CreateTokenResult {
  token: string;
  expiresAt: number;
}

export function createResetToken(email: string): CreateTokenResult {
  // Invalidate any existing unused tokens for this email
  for (const [key, val] of tokens) {
    if (val.email === email && !val.used) {
      tokens.delete(key);
    }
  }

  const token = generateToken();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  tokens.set(token, { email, token, expiresAt, used: false });
  return { token, expiresAt };
}

export interface ValidateTokenResult {
  valid: boolean;
  email?: string;
  reason?: string;
}

export function validateResetToken(token: string): ValidateTokenResult {
  const record = tokens.get(token);

  if (!record) {
    return { valid: false, reason: "Token not found" };
  }

  if (record.used) {
    return { valid: false, reason: "Token already used" };
  }

  if (Date.now() > record.expiresAt) {
    tokens.delete(token);
    return { valid: false, reason: "Token expired" };
  }

  return { valid: true, email: record.email };
}

export function invalidateToken(token: string): void {
  const record = tokens.get(token);
  if (record) {
    record.used = true;
  }
}

export function getTokenRecord(token: string): ResetToken | undefined {
  return tokens.get(token);
}

/**
 * Log a recovery attempt. Never log sensitive data (email content).
 */
export function logRecoveryAttempt(email: string, success: boolean, reason?: string): void {
  const timestamp = new Date().toISOString();
  // We only log masked version to avoid exposing full emails in logs
  const masked = email.replace(/(.{2}).*(@.*)/, "$1***$2");
  console.log(`[PasswordRecovery] ${timestamp} | masked=${masked} | success=${success} | reason=${reason ?? "n/a"}`);
}