import { NextRequest, NextResponse } from "next/server";
import { signIn } from "next-auth/react";
import { checkLoginRateLimit, recordFailedLogin } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Get client IP
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "unknown";

  // Check rate limit
  const { allowed, remaining, resetIn } = checkLoginRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      {
        error: "Too many login attempts. Please try again later.",
        retryAfter: resetIn,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(resetIn),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Reset": String(Date.now() + resetIn * 1000),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Call NextAuth signIn
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      recordFailedLogin(ip);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Limit": "5",
        },
      }
    );
  } catch (error) {
    recordFailedLogin(ip);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}