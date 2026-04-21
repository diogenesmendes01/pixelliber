import crypto from "crypto";
import fs from "fs";
import path from "path";

/**
 * File-based store for password reset tokens.
 * In production, replace with a database table.
 *
 * Token shape: { email, token, expiresAt, used }
 */
interface ResetToken {
  email: string;
  token: string;
  expiresAt: number;
  used: boolean;
}

const STORE_FILE = path.join(process.cwd(), ".reset_tokens.json");

function readTokens(): Record<string, ResetToken> {
  try {
    if (!fs.existsSync(STORE_FILE)) return {};
    const raw = fs.readFileSync(STORE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeTokens(data: Record<string, ResetToken>): void {
  // Prune expired tokens on every write to keep file clean
  const now = Date.now();
  const pruned: Record<string, ResetToken> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v.expiresAt > now) {
      pruned[k] = v;
    }
  }
  fs.writeFileSync(STORE_FILE, JSON.stringify(pruned, null, 2));
}

function generateToken(): string {
  return crypto.randomUUID();
}

export interface CreateTokenResult {
  token: string;
  expiresAt: number;
}

export function createResetToken(email: string): CreateTokenResult {
  const tokens = readTokens();

  // Invalidate any existing unused tokens for this email
  const updated: Record<string, ResetToken> = {};
  for (const [key, val] of Object.entries(tokens)) {
    if (val.email === email && !val.used) {
      continue; // drop it
    }
    updated[key] = val;
  }

  const token = generateToken();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  updated[token] = { email, token, expiresAt, used: false };
  writeTokens(updated);
  return { token, expiresAt };
}

export interface ValidateTokenResult {
  valid: boolean;
  email?: string;
  reason?: string;
}

export function validateResetToken(token: string): ValidateTokenResult {
  const tokens = readTokens();
  const record = tokens[token];

  if (!record) {
    return { valid: false, reason: "Token not found" };
  }

  if (record.used) {
    return { valid: false, reason: "Token already used" };
  }

  if (Date.now() > record.expiresAt) {
    return { valid: false, reason: "Token expired" };
  }

  return { valid: true, email: record.email };
}

export function invalidateToken(token: string): void {
  const tokens = readTokens();
  const record = tokens[token];
  if (record) {
    record.used = true;
    tokens[token] = record;
    writeTokens(tokens);
  }
}

export function getTokenRecord(token: string): ResetToken | undefined {
  const tokens = readTokens();
  return tokens[token];
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
