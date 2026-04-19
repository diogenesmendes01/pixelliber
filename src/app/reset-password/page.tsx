"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenError(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ text: "As senhas não coincidem.", type: "error" });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: "A senha deve ter pelo menos 6 caracteres.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error ?? "Erro desconhecido.", type: "error" });
      } else {
        setMessage({ text: "Senha alterada com sucesso! Redirecionando...", type: "success" });
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setMessage({ text: "Erro de conexão. Tente novamente.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className="relative z-10 w-full" style={{ maxWidth: "400px" }}>
        <div
          style={{
            backgroundColor: "rgba(18, 18, 18, 0.85)",
            padding: "80px 20px",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          <div className="mb-6 flex justify-center">
            <Image
              src="/logo/horizontal/horizontal-640x128.png"
              alt="Pixel Liber"
              width={140}
              height={24}
              priority
              style={{ width: "110px", height: "auto" }}
            />
          </div>
          <p style={{ color: "#f88", fontSize: "16px", marginBottom: "8px" }}>
            Link inválido ou expirado.
          </p>
          <p style={{ color: "#E7D7D7", fontSize: "14px", marginBottom: "24px" }}>
            Solicite uma nova recuperação de senha.
          </p>
          <a href="/esqueceu-senha" className="btn-gradient inline-block px-8 py-3">
            Solicitar novo link
          </a>
          <div className="mt-4">
            <a href="/login" style={{ color: "#7F7878", fontSize: "14px" }}>
              Voltar para o login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full" style={{ maxWidth: "400px" }}>
      <div
        style={{
          backgroundColor: "rgba(18, 18, 18, 0.85)",
          padding: "80px 20px",
          borderRadius: "5px",
        }}
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo/horizontal/horizontal-640x128.png"
            alt="Pixel Liber"
            width={140}
            height={24}
            priority
            style={{ width: "110px", height: "auto" }}
          />
        </div>

        <p
          className="mb-6 text-center"
          style={{ color: "#E7D7D7", fontSize: "14px" }}
        >
          Digite sua nova senha:
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="password"
              placeholder="Nova senha"
              className="input-login"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirmar nova senha"
              className="input-login"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {message && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "5px",
                fontSize: "13px",
                textAlign: "center",
                backgroundColor: message.type === "error" ? "rgba(220, 50, 50, 0.2)" : "rgba(50, 180, 80, 0.2)",
                color: message.type === "error" ? "#f88" : "#8f8",
                border: `1px solid ${message.type === "error" ? "rgba(220,50,50,0.4)" : "rgba(50,180,80,0.4)"}`,
              }}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            className="btn-gradient w-full py-3"
            disabled={loading}
          >
            {loading ? "Alterando..." : "Alterar Senha"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/login"
            style={{ color: "#7F7878", fontSize: "14px" }}
            className="transition hover:opacity-80"
          >
            Voltar para o login
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <main
        className="relative flex min-h-screen items-center justify-center px-4"
        style={{
          backgroundImage: "url('/bg/CAPA-AREA-DE-MEMBROS-GCSArtboard-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        />

        <Suspense fallback={
          <div className="relative z-10" style={{ color: "#E7D7D7" }}>
            Verificando link...
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </main>
      <WhatsAppButton />
    </>
  );
}