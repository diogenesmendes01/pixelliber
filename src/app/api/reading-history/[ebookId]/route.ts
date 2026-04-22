import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ ebookId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { ebookId } = await params;

  const body = await request.json().catch(() => ({}));
  const progressPct = typeof body.progressPct === "number" ? body.progressPct : undefined;
  const lastPage = typeof body.lastPage === "number" ? body.lastPage : undefined;

  const entry = await prisma.readingHistory.upsert({
    where: {
      userId_ebookId: {
        userId: session.user.userId,
        ebookId,
      },
    },
    update: {
      ...(progressPct !== undefined ? { progressPct } : {}),
      ...(lastPage !== undefined ? { lastPage } : {}),
      lastReadAt: new Date(),
    },
    create: {
      userId: session.user.userId,
      ebookId,
      progressPct: progressPct ?? 0,
      lastPage: lastPage ?? 0,
    },
  });

  return NextResponse.json({ ok: true, entry });
}
