import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 8 caracteres." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
        employee: { include: { company: true } },
      },
    });

    // Company pode vir do vínculo direto (admin) OU via Employee (funcionário)
    const company = user?.company ?? user?.employee?.company ?? null;

    if (!user || !company) {
      return NextResponse.json(
        { error: "Convite inválido ou expirado." },
        { status: 404 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        lastLoginAt: new Date(),
      },
    });

    const token = await signToken(
      {
        userId: user.id,
        companyId: company.id,
        cnpj: company.cnpj,
        name: company.name,
        role: user.role,
      },
      false
    );

    const response = NextResponse.json({ ok: true });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Accept invite error:", error);
    return NextResponse.json(
      { error: "Erro ao processar convite." },
      { status: 500 }
    );
  }
}
