import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

type Context = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Context) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: { user: { select: { lastLoginAt: true, isActive: true } } },
  });

  if (!employee) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(employee);
}

export async function PUT(req: NextRequest, { params }: Context) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { fullName, role, department, resetPassword } = body;

  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updateData: any = {};
  if (fullName !== undefined) updateData.fullName = fullName;
  if (role !== undefined) updateData.role = role;
  if (department !== undefined) updateData.department = department;

  const updated = await prisma.employee.update({
    where: { id },
    data: updateData,
    include: { user: { select: { lastLoginAt: true, isActive: true } } },
  });

  if (resetPassword && employee.userId) {
<    const newPassword = crypto.randomUUID().split('-')[0];
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: employee.userId },
      data: { passwordHash: hashed },
    });
    return NextResponse.json({ employee: updated, tempPassword: newPassword });
  }

  return NextResponse.json({ employee: updated });
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Soft delete: inactivate employee and associated user
  await prisma.employee.update({
    where: { id },
    data: { isActive: false },
  });

  if (employee.userId) {
    await prisma.user.update({
      where: { id: employee.userId },
      data: { isActive: false },
    });
  }

  return NextResponse.json({ success: true });
}
