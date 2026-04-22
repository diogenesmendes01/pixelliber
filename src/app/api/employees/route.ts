import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

import { validateCsrfRequest } from "@/lib/csrf";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = (session.user as any).companyId;
  if (!companyId) {
    return NextResponse.json({ error: "No company associated" }, { status: 400 });
  }

  const employees = await prisma.employee.findMany({
    where: { companyId },
    include: { user: { select: { lastLoginAt: true, isActive: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(employees);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).userId;
  const csrfError = await validateCsrfRequest(req, userId);
  if (csrfError) return csrfError;

  const companyId = (session.user as any).companyId;
  if (!companyId) {
    return NextResponse.json({ error: "No company associated" }, { status: 400 });
  }

  const body = await req.json();
  const { fullName, corporateEmail, role, department, initialPassword } = body;

  if (!fullName || !corporateEmail) {
    return NextResponse.json(
      { error: "fullName and corporateEmail are required" },
      { status: 400 }
    );
  }

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email: corporateEmail } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  const password = initialPassword || crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: fullName,
      email: corporateEmail,
      passwordHash: hashedPassword,
      role: "USER",
      companyId,
    },
  });

  const employee = await prisma.employee.create({
    data: {
      fullName,
      corporateEmail,
      role: role || null,
      department: department || null,
      companyId,
      userId: user.id,
    },
    include: { user: { select: { lastLoginAt: true, isActive: true } } },
  });

  return NextResponse.json({ employee, tempPassword: password }, { status: 201 });
}
