import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { findUserWithCompany, subscriptionActive } from "@/lib/user-company";
import VitrineClient from "./VitrineClient";

export default async function VitrinePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const dbUser = await findUserWithCompany(session.user.userId);
  if (!dbUser) redirect("/login");
  if (!subscriptionActive(dbUser.company)) redirect("/acesso-bloqueado");

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
