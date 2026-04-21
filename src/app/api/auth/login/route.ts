import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { validateCNPJ } from "@/lib/cnpj";
import bcrypt from "bcryptjs";
import { isRateLimited, recordAttempt } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";

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

    if (isRateLimited(cnpjCleaned, ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    if (!validateCNPJ(cnpjCleaned)) {
      recordAttempt(cnpjCleaned, ip);
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
      recordAttempt(cnpjCleaned, ip);
      return NextResponse.json(
        { error: "CNPJ ou senha incorretos" },
        { status: 401 }
      );
    }

    const user = company.users[0];
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      recordAttempt(cnpjCleaned, ip);
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
      { status: 200 }
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
    recordAttempt("unknown", ip);
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
