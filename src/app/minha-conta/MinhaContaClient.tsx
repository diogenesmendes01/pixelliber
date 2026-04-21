"use client";

import Link from "next/link";
import Image from "next/image";
import AccountForm from "@/components/AccountForm";
import ManageTeam from "@/components/ManageTeam";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  assinaturaAtiva: boolean;
  company: {
    name: string;
    cnpj: string | null;
    statusAssinatura: string;
  } | null;
}

interface Props {
  user: User;
  isAdmin: boolean;
}

export default function MinhaContaClient({ user, isAdmin }: Props) {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-[#121212] pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-6">
        {/* Welcome banner */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Olá, {user?.name ?? "Usuário"}
          </h1>
          <p className="text-gray-400 mt-1">
            CNPJ: {user?.company?.cnpj
              ? user.company.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
              : ""}
          </p>
        </div>

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
          <button onClick={handleLogout} className="action-card cursor-pointer">
            <Image
              src="/icons/logout.svg"
              alt="Sair"
              width={40}
              height={40}
              style={{ width: "40px", height: "40px", filter: "invert(1)" }}
            />
            <span className="font-semibold text-sm">Sair</span>
          </button>
        </div>

        {/* Account Header */}
        <div className="account-section">
          <h2 className="text-2xl font-bold mb-2">Dados da Conta</h2>
          <p className="text-gray-300 mb-8">
            Gerencie suas informações pessoais e altere sua senha quando necessário.
          </p>
        </div>

        {/* Account Form — interactive client component */}
        <AccountForm user={user} />

        {/* Team Management — Admin only */}
        {isAdmin && <ManageTeam />}
      </div>
    </main>
  );
}
