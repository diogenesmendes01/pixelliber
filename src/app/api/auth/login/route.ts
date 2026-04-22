import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { checkLoginRateLimit, getRateLimitResponse } from "@/lib/rate-limit";
import { validateCNPJ, cleanCNPJ } from "@/lib/cnpj";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  // Check rate limit
  const { allowed, resetAt } = checkLoginRateLimit(request);
  if (!allowed) {
    return getRateLimitResponse(resetAt);
  }

  try {
    const body = await request.json();
    const { cnpj, password, rememberMe } = body;

    // Validate required fields
    if (!cnpj || !password) {
      return NextResponse.json(
        { error: "CNPJ e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Validate CNPJ format with full digit verification
    const cnpjCleaned = cleanCNPJ(cnpj);
    if (!validateCNPJ(cnpjCleaned)) {
      return NextResponse.json(
        { error: "CNPJ ou senha incorretos" },
        { status: 401 }
      );
    }

    // Find company and user
    const company = await prisma.company.findUnique({
      where: { cnpj: cnpjCleaned },
      include: { user: true },
    });

    if (!company || !company.user) {
      return NextResponse.json(
        { error: "CNPJ ou senha incorretos" },
        { status: 401 }
      );
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, company.user.passwordHash);
    if (!validPassword) {
      return NextResponse.json(
        { error: "CNPJ ou senha incorretos" },
        { status: 401 }
      );
    }

    const firstAccess = company.user.lastLoginAt === null;

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: company.user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT
    const token = await signToken(
      {
        userId: company.user.id,
        companyId: company.id,
        cnpj: cnpjCleaned,
        name: company.name,
        role: company.user.role,
      },
      !!rememberMe
    );

    // Set HTTP-only cookie
    const response = NextResponse.json(
      {
        message: "Login realizado com sucesso",
        firstAccess,
        company: { name: company.name, cnpj: company.cnpj },
      },
      { status: 200 }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 2, // 30 days or 2 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
