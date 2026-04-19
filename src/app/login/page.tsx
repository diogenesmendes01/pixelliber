"use client";

import { useState } from "react";
import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <>
      <main
        className="relative flex min-h-screen items-center justify-center px-4"
        style={{
          backgroundImage: "url('/bg/covers-ebooks-9363.jpg')",
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
          {/* Login card */}
          <div
            style={{
              backgroundColor: "rgba(0, 0, 1, 0.8)",
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

            <form className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder="CNPJ"
                  className="input-login"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Senha"
                  className="input-login"
                />
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`toggle-switch ${rememberMe ? "active" : ""}`}
                  onClick={() => setRememberMe(!rememberMe)}
                  role="switch"
                  aria-checked={rememberMe}
                />
                <span style={{ color: "#E7D7D7", fontSize: "14px" }}>
                  Mantenha-me logado
                </span>
              </div>

              <button type="submit" className="btn-gradient w-full py-3">
                Entrar
              </button>
            </form>

            <div className="mt-4 text-center">
              <a
                href="/esqueceu-senha"
                style={{ color: "#7F7878", fontSize: "14px" }}
                className="transition hover:opacity-80"
              >
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          {/* CNPJ hint card */}
          <div
            className="mt-4"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <p
              style={{
                color: "#E7D7D7",
                fontSize: "14px",
                textAlign: "center",
                lineHeight: "1.6",
              }}
            >
              Dica: Se esse é o seu primeiro acesso, use o seu CNPJ para o
              usuário e senha.*
            </p>
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
