import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/esqueceu-senha",
  "/acesso-bloqueado",
  "/reset-password",
];

const PUBLIC_PREFIXES = [
  "/convite/",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and all auth API routes
  if (
    PUBLIC_PATHS.some((p) => pathname === p) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/api/contact")
  ) {
    return NextResponse.next();
  }

  // Allow static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/ebooks") ||
    pathname.startsWith("/videos") ||
    pathname.startsWith("/bg") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyToken(token);

  if (!payload) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("auth_token", "", { httpOnly: true, maxAge: 0, path: "/" });
    return response;
  }

  // Authenticated — redirect /login to /vitrine
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/vitrine", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
