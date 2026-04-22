import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
    prisma.user.findUnique({
      where: { id: session.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: {
          select: {
            name: true,
            cnpj: true,
            statusAssinatura: true,
          },
        },
      },
    }),
    prisma.ebook.findUnique({ where: { id } }),
    prisma.readingHistory.findFirst({
      where: {
        userId: session.user.userId,
        ebookId: id,
      },
    }),
  ]);

  if (!dbUser) redirect("/login");
  if (dbUser.company?.statusAssinatura !== "ativa") redirect("/acesso-bloqueado");
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
