import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findUserWithCompany, subscriptionActive } from "@/lib/user-company";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await findUserWithCompany(session.user.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.company?.id ?? null,
    assinaturaAtiva: subscriptionActive(user.company),
    company: user.company
      ? {
          name: user.company.name,
          cnpj: user.company.cnpj,
          statusAssinatura: user.company.statusAssinatura,
        }
      : null,
  });
}
