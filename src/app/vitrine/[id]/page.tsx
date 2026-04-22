import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
    prisma.user.findUnique({
      where: { id: session.user.userId },
      include: { company: true },
    }),
    prisma.ebook.findUnique({ where: { id } }),
  ]);

  if (!dbUser) redirect("/login");
  if (dbUser.company?.statusAssinatura !== "ativa") redirect("/acesso-bloqueado");
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
