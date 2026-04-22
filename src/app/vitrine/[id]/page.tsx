import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findUserWithCompany, subscriptionActive } from "@/lib/user-company";
import EbookDetailClient from "./EbookDetailClient";

export default async function EbookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const [dbUser, ebook] = await Promise.all([
    findUserWithCompany(session.user.userId),
    prisma.ebook.findUnique({ where: { id } }),
  ]);

  if (!dbUser) redirect("/login");
  if (!subscriptionActive(dbUser.company)) redirect("/acesso-bloqueado");
  if (!ebook) notFound();

  return (
    <EbookDetailClient
      ebook={ebook}
      user={{
        name: dbUser.name,
        email: dbUser.email,
        companyName: dbUser.company?.name ?? null,
        role: dbUser.role,
      }}
    />
  );
}
