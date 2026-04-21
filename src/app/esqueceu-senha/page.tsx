"use client";

import { useState } from "react";
import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error ?? "Erro desconhecido.", type: "error" });
      } else {
        setMessage({
          text: "Se o email estiver cadastrado, você receberá um link de recuperação.",
          type: "success",
        });
        setEmail("");
      }
    } catch {
      setMessage({ text: "Erro de conexão. Tente novamente.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

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

        <div className="relative z-10 w-full" style={{ maxWidth: "400px" }}>
          {/* Card */}
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
              Digite seu email para recuperar sua senha:
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="email"
                  placeholder="E-mail..."
                  className="input-login"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
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
                {loading ? "Enviando..." : "Recuperar Senha"}
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
      </main>
      <WhatsAppButton />
    </>
  );
}