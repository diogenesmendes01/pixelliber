import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import ManageTeam from "@/components/ManageTeam";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountForm from "@/components/AccountForm";

export const metadata = {
  title: "Minha Conta — Pixel Liber",
};

async function getUserData(session: any) {
  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { company: true },
  });
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    assinaturaAtiva: user.company?.statusAssinatura === "ativa",
    company: user.company
      ? {
          name: user.company.name,
          cnpj: user.company.cnpj,
          statusAssinatura: user.company.statusAssinatura,
        }
      : null,
  };
}

export default async function MinhaContaPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = await getUserData(session);
  if (!user) {
    redirect("/login");
  }

  const isAdmin = (session.user as any).role === "ADMIN";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#121212] pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          {/* 3 Action Cards */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <Link href="/vitrine" className="action-card">
              <Image
                src="/icons/home-icon-silhouette.svg"
                alt="Vitrine"
                width={40}
                height={40}
                style={{ width: "40px", height: "40px", filter: "invert(1)" }}
              />
              <span className="font-semibold text-sm">Vitrine</span>
            </Link>
            <Link href="/minha-conta" className="action-card" style={{ border: "2px solid #D4AF37" }}>
              <Image
                src="/icons/user.svg"
                alt="Minha Conta"
                width={40}
                height={40}
                style={{ width: "40px", height: "40px", filter: "invert(1)" }}
              />
              <span className="font-semibold text-sm">Minha Conta</span>
            </Link>
            <Link href="/login" className="action-card">
              <Image
                src="/icons/logout.svg"
                alt="Sair"
                width={40}
                height={40}
                style={{ width: "40px", height: "40px", filter: "invert(1)" }}
              />
              <span className="font-semibold text-sm">Sair</span>
            </Link>
          </div>

          {/* Account Header */}
          <div className="account-section">
            <h2 className="text-2xl font-bold mb-2">Minha Conta</h2>
            <p className="text-gray-300 mb-8">
              Esse é o painel da sua conta. Aqui você pode acessar a vitrine de
              e-books, gerenciar suas informações e acompanhar sua assinatura.
            </p>
          </div>

          {/* Account Form — interactive client component */}
          <AccountForm user={user} />

          {/* Team Management — Admin only */}
          {isAdmin && <ManageTeam />}
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
