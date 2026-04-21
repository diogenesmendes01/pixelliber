import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/login", "/cadastro-assinante", "/contato", "/esqueceu-senha", "/api/auth/login", "/api/auth/logout"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith("/api/auth/"))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
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

  // Check auth token
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    // Not authenticated - redirect to login
    if (pathname === "/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyToken(token);

  if (!payload) {
    // Invalid token - redirect to login
    if (pathname === "/login") {
      return NextResponse.next();
    }
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Clear invalid cookie
    response.cookies.set("auth_token", "", { httpOnly: true, maxAge: 0, path: "/" });
    return response;
  }

  // Authenticated - redirect /login to /vitrine
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
