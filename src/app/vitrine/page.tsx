import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import VitrineClient from "./VitrineClient";

export default async function VitrinePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.userId },
    include: { company: true },
  });
  if (!dbUser) redirect("/login");
  if (dbUser.company?.statusAssinatura !== "ativa") redirect("/acesso-bloqueado");

  return (
    <VitrineClient
      user={{
        name: dbUser.name,
        email: dbUser.email,
        companyName: dbUser.company?.name ?? null,
        role: dbUser.role,
      }}
    />
  );
}
