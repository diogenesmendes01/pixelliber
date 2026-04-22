import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EquipeClient from "./EquipeClient";

export default async function EquipePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.userId },
    include: { company: true },
  });
  if (!user || user.role !== "ADMIN") redirect("/minha-conta");

  return (
    <EquipeClient
      companyName={user.company?.name ?? "Empresa"}
      userName={user.name}
    />
  );
}
