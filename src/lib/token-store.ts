import { prisma } from "./prisma";
import crypto from "crypto";

const TOKEN_EXPIRY_HOURS = 24;

export interface CreateTokenResult {
  token: string;
  expiresAt: Date;
}

export async function createResetToken(email: string): Promise<CreateTokenResult> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
  await prisma.passwordResetToken.create({ data: { email, token, expiresAt } });
  return { token, expiresAt };
}

export interface ValidateTokenResult {
  valid: boolean;
  email?: string;
  reason?: string;
}

export async function validateResetToken(token: string): Promise<ValidateTokenResult> {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record) return { valid: false, reason: "not_found" };
  if (record.usedAt) return { valid: false, reason: "already_used" };
  if (record.expiresAt < new Date()) return { valid: false, reason: "expired" };
  return { valid: true, email: record.email };
}

export async function invalidateToken(token: string): Promise<void> {
  await prisma.passwordResetToken.update({ where: { token }, data: { usedAt: new Date() } });
}

/**
 * Log a recovery attempt. Never log sensitive data (email content).
 */
export function logRecoveryAttempt(identifier: string, success: boolean, reason?: string): void {
  console.log(`[PasswordReset] ${success ? "SUCCESS" : "FAIL"} | ${identifier}${reason ? ` | ${reason}` : ""}`);
}
