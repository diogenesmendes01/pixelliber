"use client";

import { useState } from "react";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
    } catch {
      // ignore network errors — show confirmation regardless (email enumeration protection)
    } finally {
      setForgotLoading(false);
    }
    setForgotSent(true);
  }

  if (forgotSent) {
    // esq-2: email enviado
    return (
      <>
        <div className="steps">
          <div className="step-dot done" />
          <div className="step-dot on" />
          <div className="step-dot" />
          <span className="steps-label">passo 2 de 3 · recuperar senha</span>
        </div>

        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "oklch(0.95 0.06 150)",
            color: "oklch(0.35 0.12 150)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            margin: "16px 0 14px",
            border: "1px solid oklch(0.82 0.1 150)",
          }}
        >
          ✉
        </div>

        <h3>Verifique o seu e-mail</h3>
        <p className="sub">
          Se há uma conta com <strong style={{ color: "var(--ink)" }}>{forgotEmail}</strong>, você receberá um link em breve. Pode levar até 5 minutos.
        </p>

        <div
          style={{
            background: "rgba(0,0,0,0.03)",
            border: "1px solid var(--line-ink)",
            borderRadius: 10,
            padding: 14,
            margin: "8px 0 16px",
          }}
        >
          <div className="flex-between" style={{ fontSize: 12 }}>
            <span className="tag">Destinatário</span>
            <span style={{ fontWeight: 500 }}>{forgotEmail}</span>
          </div>
          <div className="flex-between" style={{ fontSize: 12, marginTop: 6 }}>
            <span className="tag">Validade</span>
            <span style={{ fontWeight: 500 }}>60 minutos</span>
          </div>
          <div className="flex-between" style={{ fontSize: 12, marginTop: 6 }}>
            <span className="tag">Status</span>
            <span style={{ fontWeight: 500, color: "var(--ok)" }}>link enviado ✓</span>
          </div>
        </div>

        <div className="hint hint--ok">
          <span>✓</span>
          <div>
            Verifique também a caixa de spam. Se não encontrar, tente reenviar em alguns minutos.
          </div>
        </div>

        <div className="flex wrap" style={{ gap: 10, marginTop: 18 }}>
          <button
            className="btn btn--ink"
            onClick={() => {
              setForgotSent(false);
            }}
          >
            Reenviar
          </button>
          <button
            className="btn btn--ghost"
            style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
            onClick={onBack}
          >
            ← Voltar ao login
          </button>
        </div>
      </>
    );
  }

  // esq-1: solicitar
  return (
    <>
      <div className="steps">
        <div className="step-dot on" />
        <div className="step-dot" />
        <div className="step-dot" />
        <span className="steps-label">passo 1 de 3 · recuperar senha</span>
      </div>
      <h3 style={{ marginTop: 14 }}>Esqueci a senha</h3>
      <p className="sub">
        Informe o e-mail da conta corporativa. Mandamos um link pra criar uma nova senha.
      </p>

      <form onSubmit={handleForgotPassword} style={{ marginTop: 14 }}>
        <div className="field">
          <label className="label">E-mail corporativo</label>
          <input
            className="input"
            type="email"
            placeholder="marina@empresa.com.br"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn--ink btn--block"
          style={{ marginTop: 20 }}
          disabled={!forgotEmail || forgotLoading}
        >
          {forgotLoading ? "Enviando…" : "Enviar link →"}
        </button>
      </form>
      <button
        className="btn btn--ghost btn--block btn--sm"
        style={{ marginTop: 8, borderColor: "var(--line-ink)", color: "var(--ink)" }}
        onClick={onBack}
      >
        ← Voltar ao login
      </button>
    </>
  );
}
