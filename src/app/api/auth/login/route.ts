import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { checkLoginRateLimit, getRateLimitResponse } from "@/lib/rate-limit";
import { validateCNPJ, cleanCNPJ } from "@/lib/cnpj";
import bcrypt from "bcryptjs";

/**
 * Login via CNPJ (empresa) ou e-mail (usuário).
 * Aceita: { identifier, password, rememberMe }
 * identifier = CNPJ formatado/não, ou email cadastrado
 */
export async function POST(request: NextRequest) {
  // Check rate limit
  const { allowed, resetAt } = checkLoginRateLimit(request);
  if (!allowed) {
    return getRateLimitResponse(resetAt);
  }

  try {
    const body = await request.json();
    // Aceita tanto 'identifier' (novo) quanto 'cnpj' (legacy)
    const identifier = body.identifier ?? body.cnpj;
    const { password, rememberMe } = body;

    // Validate required fields
    if (!identifier || !password) {
      return NextResponse.json(
        { error: "CNPJ/e-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const isEmail = identifier.includes("@");
    let user = null;
    let company = null;

    if (isEmail) {
      // Validação de formato antes de consultar DB
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        return NextResponse.json(
          { error: "E-mail inválido", errorCode: "EMAIL_INVALID" },
          { status: 400 }
        );
      }

      // Login via e-mail
      user = await prisma.user.findUnique({
        where: { email: identifier.toLowerCase() },
        include: { company: true },
      });

      if (!user) {
        return NextResponse.json(
          { error: "E-mail não encontrado", errorCode: "EMAIL_NOT_FOUND" },
          { status: 401 }
        );
      }

      company = user.company;
    } else {
      // Login via CNPJ
      const cnpjCleaned = cleanCNPJ(identifier);

      if (!validateCNPJ(cnpjCleaned)) {
        return NextResponse.json(
          { error: "CNPJ inválido", errorCode: "CNPJ_INVALID" },
          { status: 400 }
        );
      }

      company = await prisma.company.findUnique({
        where: { cnpj: cnpjCleaned },
        include: { user: true },
      });

      if (!company) {
        return NextResponse.json(
          { error: "CNPJ não encontrado", errorCode: "CNPJ_NOT_FOUND" },
          { status: 401 }
        );
      }

      if (!company.user) {
        return NextResponse.json(
          { error: "Conta não encontrada para esta empresa", errorCode: "CNPJ_NOT_FOUND" },
          { status: 401 }
        );
      }

      user = company.user;
    }

    // Se não encontrou usuário
    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas", errorCode: "INVALID" },
        { status: 401 }
      );
    }

    // Verifica se usuário está ativo
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Conta desativada. Entre em contato com o administrador.", errorCode: "ACCOUNT_DISABLED" },
        { status: 403 }
      );
    }

    // Verifica senha
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Senha incorreta", errorCode: "WRONG_PASSWORD" },
        { status: 401 }
      );
    }

    const firstAccess = user.lastLoginAt === null;

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Gera JWT
    const token = await signToken(
      {
        userId: user.id,
        companyId: company!.id,
        cnpj: company!.cnpj,
        name: user.name || company!.name,
        role: user.role,
      },
      !!rememberMe
    );

    // Define cookie HTTP-only
    const response = NextResponse.json(
      {
        message: "Login realizado com sucesso",
        firstAccess,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
        company: {
          name: company!.name,
          cnpj: company!.cnpj,
        },
      },
      { status: 200 }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 2, // 30 dias ou 2 horas
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
