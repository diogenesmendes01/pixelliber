"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  assinaturaAtiva: boolean;
  company: {
    name: string;
    cnpj: string | null;
    statusAssinatura: string;
  } | null;
}

interface AccountFormProps {
  user: UserData;
}

export default function AccountForm({ user }: AccountFormProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const isAdmin = user.role === "ADMIN";
  const assinaturaAtiva = user.company?.statusAssinatura === "ativa";

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoadingProfile(true);
    setProfileMsg(null);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileMsg({ type: "error", text: data.error || "Erro ao salvar" });
      } else {
        setProfileMsg({ type: "success", text: "Perfil atualizado com sucesso!" });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Erro ao conectar com o servidor" });
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "As senhas não coincidem" });
      setLoadingPassword(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "A nova senha deve ter pelo menos 8 caracteres" });
      setLoadingPassword(false);
      return;
    }

    try {
      const res = await fetch("/api/users/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordMsg({ type: "error", text: data.error || "Erro ao alterar senha" });
      } else {
        setPasswordMsg({ type: "success", text: "Senha alterada com sucesso!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Erro ao conectar com o servidor" });
    } finally {
      setLoadingPassword(false);
    }
  }

  async function handleLogout() {
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <form onSubmit={handleSaveProfile} className="account-form-section">
        <h3 className="text-xl font-bold mb-4">Editar Perfil</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Nome completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>
        </div>
        {profileMsg && (
          <p className={`mt-3 text-sm ${profileMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
            {profileMsg.text}
          </p>
        )}
        <button type="submit" className="btn-blue mt-4" disabled={loadingProfile}>
          {loadingProfile ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      {/* Password Section */}
      <form onSubmit={handleChangePassword} className="account-form-section">
        <h3 className="text-xl font-bold mb-4">Alterar Senha</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Senha atual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Nova senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Confirmar nova senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>
        </div>
        {passwordMsg && (
          <p className={`mt-3 text-sm ${passwordMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
            {passwordMsg.text}
          </p>
        )}
        <button type="submit" className="btn-blue mt-4" disabled={loadingPassword}>
          {loadingPassword ? "Alterando..." : "Alterar senha"}
        </button>
      </form>

      {/* Company Info — only if company exists */}
      {user.company && (
        <div className="account-form-section">
          <h3 className="text-xl font-bold mb-4">Dados da Empresa</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Empresa</label>
              <p className="text-white font-medium">{user.company.name}</p>
            </div>
            {user.company.cnpj && (
              <div>
                <label className="block text-sm text-gray-300 mb-1">CNPJ</label>
                <p className="text-white font-medium">{user.company.cnpj}</p>
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Assinatura</label>
              <p className={`font-semibold ${assinaturaAtiva ? "text-green-400" : "text-red-400"}`}>
                {assinaturaAtiva ? "Ativa ✓" : "Inativa ✗"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin: Team Management Card */}
      {isAdmin && (
        <Link href="/gerenciar-equipe" className="action-card">
          <Image
            src="/icons/users.svg"
            alt="Gerenciar Equipe"
            width={40}
            height={40}
            style={{ width: "40px", height: "40px", filter: "invert(1)" }}
          />
          <div>
            <span className="font-semibold text-sm">Gerenciar Equipe</span>
            <p className="text-xs text-gray-400 mt-1">Adicionar, editar ou remover membros</p>
          </div>
        </Link>
      )}

      {/* Logout Button */}
      <button onClick={handleLogout} className="action-card w-full text-left cursor-pointer">
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
  );
}
