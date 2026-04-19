import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { validateCNPJ } from "@/lib/cnpj";
import bcrypt from "bcryptjs";
import { checkLoginRateLimit, recordFailedLogin } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Get client IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";

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
    const body = await request.json();
    const { cnpj, password, rememberMe } = body;

    if (!cnpj || !password) {
      return NextResponse.json(
        { error: "CNPJ e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const cnpjCleaned = cnpj.replace(/[^\d]/g, "");
    if (!validateCNPJ(cnpjCleaned)) {
      recordFailedLogin(ip);
      return NextResponse.json(
        { error: "CNPJ ou senha incorretos" },
        { status: 401 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { cnpj: cnpjCleaned },
      include: { users: true },
    });

    if (!company || company.users.length === 0) {
      recordFailedLogin(ip);
      return NextResponse.json(
        { error: "CNPJ ou senha incorretos" },
        { status: 401 }
      );
    }

    const user = company.users[0];
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      recordFailedLogin(ip);
      return NextResponse.json(
        { error: "CNPJ ou senha incorretos" },
        { status: 401 }
      );
    }

    const token = await signToken(
      {
        userId: user.id,
        companyId: company.id,
        cnpj: cnpjCleaned,
        name: company.name,
      },
      !!rememberMe
    );

    const response = NextResponse.json(
      { message: "Login realizado com sucesso", company: { name: company.name, cnpj: company.cnpj } },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Limit": "5",
        },
      }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 2,
      path: "/",
    });

    return response;
  } catch (error) {
    recordFailedLogin(ip);
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}