"use client";

import { useState } from "react";
import Link from "next/link";
import { maskCNPJ } from "@/lib/utils";

interface LoginFormProps {
  onSuccess: (data: { firstAccess: boolean; password: string }) => void;
  onForgotPassword: () => void;
}

export default function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
  const [cnpj, setCnpj] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ssoMsg, setSsoMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!cnpj || !password) { setError("CNPJ e senha são obrigatórios"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj, password, rememberMe }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "CNPJ ou senha incorretos");
        return;
      }
      onSuccess({ firstAccess: !!data.firstAccess, password });
    } catch {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h3>Entrar</h3>
      <p className="sub">Para contas corporativas.</p>

      <div style={{ display: "grid", gap: 8, margin: "6px 0 18px" }}>
        <button
          className="btn btn--ghost"
          style={{ color: "var(--ink)", borderColor: "var(--line-ink)", justifyContent: "center", gap: 10, background: "#fff" }}
          onClick={() => setSsoMsg("Autenticação via Google estará disponível em breve.")}
        >
          <svg width={16} height={16} viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285f4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.614z"/>
            <path fill="#34a853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#fbbc05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#ea4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Entrar com Google
        </button>
        <button
          className="btn btn--ghost"
          style={{ color: "var(--ink)", borderColor: "var(--line-ink)", justifyContent: "center", gap: 10, background: "#fff" }}
          onClick={() => setSsoMsg("Autenticação via Microsoft estará disponível em breve.")}
        >
          <svg width={16} height={16} viewBox="0 0 21 21" aria-hidden="true">
            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
          </svg>
          Entrar com Microsoft
        </button>
      </div>

      {ssoMsg && (
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--gold)", marginTop: 8 }}>
          {ssoMsg}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 14px" }}>
        <div style={{ flex: 1, height: 1, background: "var(--line-ink)" }} />
        <span style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.14em" }}>ou com CNPJ</span>
        <div style={{ flex: 1, height: 1, background: "var(--line-ink)" }} />
      </div>

      <div className="hint">
        <span>✦</span>
        <div>
          <strong>1º acesso?</strong> Use o <strong>CNPJ</strong> como usuário <em>e</em> como senha.
          No próximo passo, você troca tudo.
        </div>
      </div>

      <form onSubmit={handleLogin} style={{ marginTop: 14 }}>
        <div className="field">
          <label className="label">CNPJ ou e-mail</label>
          <input
            className="input"
            placeholder="00.000.000/0000-00"
            value={cnpj}
            onChange={(e) => setCnpj(maskCNPJ(e.target.value))}
            maxLength={18}
            autoComplete="username"
          />
        </div>
        <div className="field">
          <label className="label">Senha</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
            No primeiro acesso, repita o CNPJ.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 8 }}>
          <label style={{ fontSize: 12, display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            Lembrar dispositivo
          </label>
          <button
            type="button"
            style={{ fontSize: 12, color: "var(--amber)", fontWeight: 500, background: "none", border: 0, cursor: "pointer" }}
            onClick={onForgotPassword}
          >
            Esqueci a senha
          </button>
        </div>

        {error && (
          <div className="alert alert--danger" style={{ marginTop: 14, marginBottom: 0 }}>
            <span className="alert-icon">!</span>
            <div><div className="alert-title">{error}</div></div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn--ink btn--block"
          style={{ marginTop: 20 }}
          disabled={loading}
        >
          {loading ? "Entrando…" : "Entrar →"}
        </button>
      </form>

      <div className="divider ink" />
      <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
        Ainda não tem acesso?{" "}
        <Link href="/contato" style={{ color: "var(--amber)", fontWeight: 500 }}>
          Fale com seu gestor
        </Link>
      </p>
    </>
  );
}
