import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/vitrine");

  const [dbUser, employees, ebooks, history] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: {
          select: {
            id: true,
            name: true,
            cnpj: true,
            statusAssinatura: true,
          },
        },
      },
    }),
    prisma.employee.findMany({
      where: { companyId: session.user.companyId ?? undefined },
      include: { user: { select: { lastLoginAt: true, isActive: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ebook.findMany({ orderBy: { contadorDownloads: "desc" }, take: 20 }),
    prisma.readingHistory.findMany({
      where: {
        user: { companyId: session.user.companyId ?? undefined },
      },
      include: {
        ebook: { select: { id: true, titulo: true, categoria: true, tags: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { lastReadAt: "desc" },
      take: 100,
    }),
  ]);

  if (!dbUser) redirect("/login");

  return (
    <AdminClient
      user={{
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        company: dbUser.company,
      }}
      employees={employees.map((e) => ({
        id: e.id,
        fullName: e.fullName,
        corporateEmail: e.corporateEmail,
        role: e.role,
        isActive: e.isActive,
        lastLoginAt: e.user?.lastLoginAt ? e.user.lastLoginAt.toISOString() : null,
      }))}
      ebooks={ebooks.map((e) => ({
        id: e.id,
        titulo: e.titulo,
        autor: e.autor,
        categoria: e.categoria,
        tags: e.tags,
        contadorDownloads: e.contadorDownloads,
      }))}
      historyCount={history.length}
      historyEntries={history.map((h) => ({
        ebookId: h.ebookId,
        ebookTitulo: h.ebook.titulo,
        ebookCategoria: h.ebook.categoria,
        ebookTags: h.ebook.tags,
        userId: h.userId,
        userName: h.user.name,
        progressPct: h.progressPct,
        lastReadAt: h.lastReadAt.toISOString(),
      }))}
    />
  );
}
