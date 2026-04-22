import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const data: Record<string, unknown> = {};

  if (typeof body.twoFaEnabled === "boolean") {
    data.twoFaEnabled = body.twoFaEnabled;
  }

  if (body.notifSettings !== undefined) {
    data.notifSettings =
      typeof body.notifSettings === "string"
        ? body.notifSettings
        : JSON.stringify(body.notifSettings);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.userId },
    data,
    select: { twoFaEnabled: true, notifSettings: true },
  });

  return NextResponse.json({ ok: true, ...user });
}
