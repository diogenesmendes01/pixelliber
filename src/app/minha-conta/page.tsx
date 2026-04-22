import { redirect } from "next/navigation";
import MinhaContaClient from "./MinhaContaClient";
import { auth } from "@/lib/auth";
import { findUserWithCompany, subscriptionActive } from "@/lib/user-company";

export default async function MinhaContaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await findUserWithCompany(session.user.userId);
  if (!user) redirect("/login");

  const data = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    twoFaEnabled: user.twoFaEnabled ?? false,
    notifSettings: user.notifSettings ?? null,
    assinaturaAtiva: subscriptionActive(user.company),
    company: user.company
      ? {
          name: user.company.name,
          cnpj: user.company.cnpj,
          statusAssinatura: user.company.statusAssinatura || "inativo",
        }
      : null,
  };

  return <MinhaContaClient user={data} isAdmin={user.role === "ADMIN"} />;
}
