import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function csrfCheck(req: NextRequest): boolean {
  const origin = req.headers.get("origin") || req.headers.get("referer");
  if (!origin) return false;
  return origin.includes(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
}

export async function PUT(req: NextRequest) {
  if (!csrfCheck(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.userId;
  const body = await req.json();
  const { name, email } = body;

  if (!name || !email) {
    return NextResponse.json(
      { error: "name and email are required" },
      { status: 400 }
    );
  }

  // Check if email is already taken by another user
  const existing = await prisma.user.findFirst({
    where: { email, NOT: { id: userId } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Este e-mail já está em uso" },
      { status: 409 }
    );
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, email },
  });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
