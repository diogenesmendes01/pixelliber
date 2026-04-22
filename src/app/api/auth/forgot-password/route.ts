import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import { createResetToken, logRecoveryAttempt } from "@/lib/token-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email é obrigatório." },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido." },
        { status: 400 }
      );
    }

    // Rate limiting check
    if (isRateLimited(email)) {
      logRecoveryAttempt(email, false, "rate_limited");
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em 1 hora." },
        { status: 429 }
      );
    }

    // In production: check if email exists in database and send real email
    // For now, we always return success to prevent email enumeration
    const { token } = await createResetToken(email);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // Import and call email sender (logs in dev)
    const { sendResetEmail } = await import("@/lib/email");
    await sendResetEmail({ to: email, resetLink });

    logRecoveryAttempt(email, true);

    return NextResponse.json({
      message: "Se o email estiver cadastrado, você receberá um link de recuperação.",
    });
  } catch (error) {
    console.error("[ForgotPassword] Error:", error);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}