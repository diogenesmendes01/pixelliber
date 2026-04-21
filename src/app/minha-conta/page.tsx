import { redirect } from "next/navigation";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import MinhaContaClient from "./MinhaContaClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getUserData(session: any) {
  const userId = (session.user as any).userId;
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

  const user = await getUserData(session);
  if (!user) {
    redirect("/login");
  }

  const isAdmin = (session.user as any).role === "ADMIN";

  return (
    <>
      <Header />
      <MinhaContaClient user={user} isAdmin={isAdmin} />
      <WhatsAppButton />
    </>
  );
}
