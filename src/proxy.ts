import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Routes that require authentication + active subscription
const SUBSCRIPTION_PROTECTED_ROUTES = ["/vitrine"];
const BASIC_PROTECTED_ROUTES = ["/minha-conta"];

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
      const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback-secret");
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
      const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback-secret");
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
