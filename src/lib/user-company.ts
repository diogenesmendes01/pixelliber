import { prisma } from "@/lib/prisma";

export interface ResolvedCompany {
  id: string;
  name: string;
  cnpj: string;
  statusAssinatura: string | null;
}

export interface UserWithCompany {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  twoFaEnabled?: boolean;
  notifSettings?: string | null;
  isActive?: boolean;
  company: ResolvedCompany | null;
}

/**
 * Resolve o vínculo empresa de um usuário.
 *
 * O admin da empresa é ligado via `User.companyId` (unique). Funcionários
 * são ligados via `Employee.userId` + `Employee.companyId`. Esta função
 * cobre os dois casos e retorna a empresa efetiva.
 */
export async function findUserWithCompany(userId: string): Promise<UserWithCompany | null> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      company: true,
      employee: { include: { company: true } },
    },
  });
  if (!u) return null;
  const co = u.company ?? u.employee?.company ?? null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    twoFaEnabled: u.twoFaEnabled,
    notifSettings: u.notifSettings,
    isActive: u.isActive,
    company: co
      ? {
          id: co.id,
          name: co.name,
          cnpj: co.cnpj,
          statusAssinatura: co.statusAssinatura,
        }
      : null,
  };
}

export function subscriptionActive(company: ResolvedCompany | null | undefined): boolean {
  return company?.statusAssinatura === "ativa";
}
