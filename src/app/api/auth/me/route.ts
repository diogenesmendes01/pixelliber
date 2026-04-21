import { NextResponse } from "next/server";
import { getTokenFromCookies, verifyToken } from "@/lib/auth";

export async function GET() {
  const token = await getTokenFromCookies();

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: payload.userId,
      companyId: payload.companyId,
      cnpj: payload.cnpj,
      name: payload.name,
    },
  });
}
