import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "pixelliber-fallback-secret-change-me"
);

export interface JWTPayload {
  userId: string;
  companyId: string;
  cnpj: string;
  name?: string;
  role?: string;
  rememberMe?: boolean;
  [key: string]: unknown;
}

const ALGORITHM = "HS256";

export async function signToken(
  payload: JWTPayload,
  rememberMe: boolean
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(rememberMe ? "30d" : "2h")
    .sign(SECRET);
}

export async function verifyToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
}

export async function auth(): Promise<{ user: JWTPayload } | null> {
  const token = await getTokenFromCookies();
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  return { user: payload };
}
