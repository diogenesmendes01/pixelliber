import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Routes that require authentication + active subscription
const SUBSCRIPTION_PROTECTED_ROUTES = ["/vitrine"];
const BASIC_PROTECTED_ROUTES = ["/minha-conta"];

// Validate secret lazily at runtime (not at module evaluation time)
function getSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET environment variable is required");
  }
  return new TextEncoder().encode(secret);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  // --- Check auth for /minha-conta ---
  if (BASIC_PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    try {
      const SECRET = getSecret();
      await jwtVerify(token, SECRET);
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // --- Check auth + subscription for /vitrine ---
  if (SUBSCRIPTION_PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    try {
      const SECRET = getSecret();
      const { payload } = await jwtVerify(token, SECRET);

      // Check subscriptionActive flag in token (set by NextAuth callback when user logs in)
      if (!payload.assinaturaAtiva) {
        return NextResponse.redirect(new URL("/acesso-bloqueado", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/vitrine/:path*", "/minha-conta/:path*"],
};