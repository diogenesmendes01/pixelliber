"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import ManageTeam from "@/components/ManageTeam";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountForm from "@/components/AccountForm";

interface UserInfo {
  userId: string;
  companyId: string;
  cnpj: string;
  name?: string;
}

export default function MinhaContaPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
        setLoading(false);
      });
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#121212] pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          {/* Welcome banner */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              Olá, {user?.name ?? "Usuário"}
            </h1>
            <p className="text-gray-400 mt-1">
              CNPJ: {user?.cnpj
                ? user.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
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

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Empresa</label>
                <input type="text" value={user?.name ?? ""} readOnly className="opacity-70" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">CNPJ</label>
                <input
                  type="text"
                  value={
                    user?.cnpj
                      ? user.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
                      : ""
                  }
                  readOnly
                  className="opacity-70"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Nova senha (deixe em branco para não alterar)</label>
                <input type="password" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Confirmar nova senha</label>
                <input type="password" />
              </div>
              <button className="btn-blue">Salvar alterações</button>
            </div>
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
