import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findUserWithCompany, subscriptionActive } from "@/lib/user-company";
import LeituraClient from "./LeituraClient";

export default async function LerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ p?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const { p } = await searchParams;

  const [dbUser, ebook, history] = await Promise.all([
    findUserWithCompany(session.user.userId),
    prisma.ebook.findUnique({ where: { id } }),
    prisma.readingHistory.findFirst({
      where: {
        userId: session.user.userId,
        ebookId: id,
      },
    }),
  ]);

  if (!dbUser) redirect("/login");
  if (!subscriptionActive(dbUser.company)) redirect("/acesso-bloqueado");
  if (!ebook) notFound();

  const initialPage = p ? parseInt(p, 10) : history?.lastPage ?? 1;

  return (
    <LeituraClient
      ebook={{
        id: ebook.id,
        titulo: ebook.titulo,
        autor: ebook.autor,
        tags: ebook.tags,
        categoria: ebook.categoria,
      }}
      initialPage={initialPage || 1}
      reader={{
        name: dbUser.name ?? "Leitor",
        cnpj: dbUser.company?.cnpj ?? "",
        company: dbUser.company?.name ?? "",
      }}
    />
  );
}
