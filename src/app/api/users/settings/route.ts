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
    const ns = typeof body.notifSettings === "string"
      ? (() => { try { return JSON.parse(body.notifSettings); } catch { return null; } })()
      : body.notifSettings;

    if (!ns || typeof ns !== "object") {
      return NextResponse.json({ error: "notifSettings inválido." }, { status: 400 });
    }

    // Only allow known boolean keys
    const allowedKeys = ["novosLivros", "equipe", "plano", "dicas"] as const;
    const validated: Record<string, boolean> = {};
    for (const key of allowedKeys) {
      if (key in ns) {
        if (typeof ns[key] !== "boolean") {
          return NextResponse.json({ error: `notifSettings.${key} deve ser boolean.` }, { status: 400 });
        }
        validated[key] = ns[key];
      }
    }
    data.notifSettings = JSON.stringify(validated);
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
