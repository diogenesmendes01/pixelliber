import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, verifyToken } from "@/lib/auth";
import { checkInviteRateLimit, getRateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const { allowed, resetAt } = checkInviteRateLimit(request);
  if (!allowed) return getRateLimitResponse(resetAt);

  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token e senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 8 caracteres." },
        { status: 400 }
      );
    }

    // Validar token — o invite link carrega um JWT assinado com {userId, companyId, cnpj, name}.
    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: "Convite inválido ou expirado." },
        { status: 401 }
      );
    }

    // Buscar user e confirmar que ainda não fez login (convite é de uso único).
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        company: true,
        employee: { include: { company: true } },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Convite inválido ou expirado." },
        { status: 404 }
      );
    }

    if (user.lastLoginAt) {
      return NextResponse.json(
        { error: "Este convite já foi aceito. Faça login com sua senha." },
        { status: 409 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Convite desativado. Fale com o administrador." },
        { status: 403 }
      );
    }

    const company = user.company ?? user.employee?.company ?? null;
    if (!company) {
      return NextResponse.json(
        { error: "Vínculo com empresa não encontrado." },
        { status: 404 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Troca senha + marca lastLoginAt — essa marcação também invalida o token (uso único).
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        lastLoginAt: new Date(),
      },
    });

    const sessionToken = await signToken(
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
    response.cookies.set("auth_token", sessionToken, {
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
