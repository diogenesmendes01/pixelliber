/**
 * Simple file-based user store for development/demo purposes.
 * In production, replace with a real database (Prisma, Drizzle, etc.)
 */
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const STORE_FILE = path.join(process.cwd(), ".user_store.json");

interface StoredUser {
  email: string;
  passwordHash: string;
}

function readStore(): Record<string, StoredUser> {
  try {
    if (!fs.existsSync(STORE_FILE)) return {};
    const raw = fs.readFileSync(STORE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeStore(data: Record<string, StoredUser>): void {
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
}

export async function updateUserPassword(email: string, newPassword: string): Promise<boolean> {
  const store = readStore();
  const user = store[email.toLowerCase()];
  if (!user) {
    // User not found — return true anyway to prevent email enumeration
    // In production, you would throw or return false
    return true;
  }
  const hash = await bcrypt.hash(newPassword, 12);
  store[email.toLowerCase()] = { ...user, passwordHash: hash };
  writeStore(store);
  return true;
}

export async function verifyUserPassword(email: string, password: string): Promise<boolean> {
  const store = readStore();
  const user = store[email.toLowerCase()];
  if (!user) return false;
  return bcrypt.compare(password, user.passwordHash);
}

export async function createUser(email: string, password: string): Promise<void> {
  const store = readStore();
  const hash = await bcrypt.hash(password, 12);
  store[email.toLowerCase()] = { email: email.toLowerCase(), passwordHash: hash };
  writeStore(store);
}
