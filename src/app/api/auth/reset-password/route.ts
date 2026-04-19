import { NextRequest, NextResponse } from "next/server";
import { validateResetToken, invalidateToken, logRecoveryAttempt } from "@/lib/token-store";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword, confirmPassword } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token é obrigatório." },
        { status: 400 }
      );
    }

    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Nova senha e confirmação são obrigatórias." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "As senhas não coincidem." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    // Validate token first to get email for rate limiting
    const tokenResult = validateResetToken(token);

    if (!tokenResult.valid) {
      logRecoveryAttempt(token, false, tokenResult.reason ?? "invalid_token");
      return NextResponse.json(
        { error: "Link inválido ou expirado. Solicite uma nova recuperação." },
        { status: 400 }
      );
    }

    const email = tokenResult.email!;

    // Rate limit check on the email
    if (isRateLimited(email)) {
      logRecoveryAttempt(email, false, "rate_limited");
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em 1 hora." },
        { status: 429 }
      );
    }

    // In production: update password in database here
    // await db.user.update({ where: { email }, data: { password: hash(newPassword) } })

    // Invalidate token (single use)
    invalidateToken(token);

    logRecoveryAttempt(email, true, "password_reset_success");

    return NextResponse.json({
      message: "Senha alterada com sucesso. Faça login com a nova senha.",
    });
  } catch (error) {
    console.error("[ResetPassword] Error:", error);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}