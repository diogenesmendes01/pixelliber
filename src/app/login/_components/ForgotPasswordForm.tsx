"use client";

import { useState } from "react";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotError("");
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
    } catch {
      // ignore network errors — show confirmation regardless
    } finally {
      setForgotLoading(false);
    }
    setForgotSent(true);
  }

  if (forgotSent) {
    return (
      <>
        <h3>Verifique o seu e-mail</h3>
        <p className="sub">
          Se há uma conta com <strong>{forgotEmail}</strong>, você receberá um link em
          breve. Pode levar até 5 minutos.
        </p>

        <div className="hint hint--ok" style={{ marginTop: 20 }}>
          <span>✓</span>
          <div>Link enviado! Verifique também a caixa de spam.</div>
        </div>

        <button
          className="btn btn--ghost btn--block btn--sm"
          style={{ marginTop: 24, borderColor: "var(--line-ink)", color: "var(--ink)" }}
          onClick={onBack}
        >
          ← Voltar ao login
        </button>
      </>
    );
  }

  return (
    <>
      <h3>Recuperar senha</h3>
      <p className="sub">Informe o e-mail da conta e enviaremos um link de redefinição.</p>

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
          />
        </div>
        {forgotError && (
          <div className="err-msg" style={{ marginTop: 8 }}>{forgotError}</div>
        )}
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
