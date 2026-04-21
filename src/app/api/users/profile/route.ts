import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateCsrfRequest } from "@/lib/csrf";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const csrfError = await validateCsrfRequest(req, userId);
  if (csrfError) return csrfError;

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
