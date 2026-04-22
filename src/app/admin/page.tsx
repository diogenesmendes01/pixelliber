import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findUserWithCompany, subscriptionActive } from "@/lib/user-company";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/vitrine");

  const dbUser = await findUserWithCompany(session.user.userId);
  if (!dbUser) redirect("/login");
  if (!subscriptionActive(dbUser.company)) redirect("/acesso-bloqueado");

  const companyId = dbUser.company?.id;

  // Funcionários: Employee.companyId da empresa. Inclui o próprio admin via OR.
  // Histórico: pertence a usuários da empresa — admin (User.companyId) OU funcionário (via Employee).
  const [employees, ebooks, history] = await Promise.all([
    prisma.employee.findMany({
      where: { companyId },
      include: { user: { select: { lastLoginAt: true, isActive: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ebook.findMany({ orderBy: { contadorDownloads: "desc" }, take: 20 }),
    prisma.readingHistory.findMany({
      where: {
        user: {
          OR: [
            { companyId },
            { employee: { companyId } },
          ],
        },
      },
      include: {
        ebook: { select: { id: true, titulo: true, categoria: true, tags: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { lastReadAt: "desc" },
      take: 100,
    }),
  ]);

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
