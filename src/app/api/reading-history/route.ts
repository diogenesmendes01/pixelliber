import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const history = await prisma.readingHistory.findMany({
    where: { userId: session.user.userId },
    orderBy: { lastReadAt: "desc" },
    take: 5,
    include: {
      ebook: {
        select: {
          id: true,
          titulo: true,
          autor: true,
          categoria: true,
          tags: true,
        },
      },
    },
  });

  return NextResponse.json({ history });
}
