"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function CadastroAssinantePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cnpj: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cnpj") {
      const formatted = formatCNPJInput(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatCNPJInput = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao realizar cadastro");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("company", JSON.stringify(data.company));
      router.push("/vitrine");
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <>
      <main
        className="relative flex min-h-screen items-center justify-center px-4 py-20"
        style={{
          backgroundImage: "url('/bg/CAPA-AREA-DE-MEMBROS-GCSArtboard-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        />

        <div className="relative z-10 w-full" style={{ maxWidth: "450px" }}>
          <div
            style={{
              backgroundColor: "rgba(18, 18, 18, 0.85)",
              padding: "60px 20px",
              borderRadius: "5px",
            }}
          >
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

            <h4
              className="mb-6 text-center text-2xl font-semibold"
              style={{ color: "#E7D7D7" }}
            >
              Cadastro de Assinante
            </h4>

            {error && (
              <div
                className="mb-4 rounded p-3 text-center text-sm"
                style={{ backgroundColor: "rgba(220, 38, 38, 0.2)", color: "#fca5a5" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-cadastro"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-cadastro"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="cnpj"
                  placeholder="CNPJ"
                  value={formData.cnpj}
                  onChange={handleChange}
                  maxLength={18}
                  required
                  className="input-cadastro"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                  className="input-cadastro"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar senha"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                  required
                  className="input-cadastro"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gradient w-full py-3 disabled:opacity-50"
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <span style={{ color: "#7F7878", fontSize: "14px" }}>
                Já tem uma conta?{" "}
                <a
                  href="/login"
                  style={{ color: "#D4AF37" }}
                  className="transition hover:opacity-80"
                >
                  Entrar
                </a>
              </span>
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}