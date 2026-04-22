import { redirect } from "next/navigation";
import MinhaContaClient from "./MinhaContaClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { company: true },
  });
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    assinaturaAtiva: user.company?.statusAssinatura === "ativa",
    company: user.company
      ? {
          name: user.company.name,
          cnpj: user.company.cnpj,
          statusAssinatura: user.company.statusAssinatura || "inativo",
        }
      : null,
  };
}

export default async function MinhaContaPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.userId;
  const user = await getUserData(userId);
  if (!user) {
    redirect("/login");
  }

  const isAdmin = user.role === "ADMIN";

  return <MinhaContaClient user={user} isAdmin={isAdmin} />;
}
