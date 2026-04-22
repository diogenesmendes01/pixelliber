"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          subject: fd.get("company"),
          message: fd.get("message"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Falha ao enviar.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Falha de rede.");
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: "var(--ink-2)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <label
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--muted)",
        }}
      >
        Seu nome
        <input
          name="name"
          required
          style={{
            width: "100%",
            marginTop: 4,
            padding: "10px 12px",
            background: "var(--ink)",
            border: "1px solid var(--line)",
            color: "var(--paper)",
            borderRadius: 8,
            font: "inherit",
          }}
        />
      </label>

      <label
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--muted)",
        }}
      >
        E-mail
        <input
          name="email"
          required
          type="email"
          style={{
            width: "100%",
            marginTop: 4,
            padding: "10px 12px",
            background: "var(--ink)",
            border: "1px solid var(--line)",
            color: "var(--paper)",
            borderRadius: 8,
            font: "inherit",
          }}
        />
      </label>

      <label
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--muted)",
        }}
      >
        Empresa
        <input
          name="company"
          style={{
            width: "100%",
            marginTop: 4,
            padding: "10px 12px",
            background: "var(--ink)",
            border: "1px solid var(--line)",
            color: "var(--paper)",
            borderRadius: 8,
            font: "inherit",
          }}
        />
      </label>

      <label
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--muted)",
        }}
      >
        Mensagem
        <textarea
          name="message"
          required
          rows={3}
          style={{
            width: "100%",
            marginTop: 4,
            padding: "10px 12px",
            background: "var(--ink)",
            border: "1px solid var(--line)",
            color: "var(--paper)",
            borderRadius: 8,
            font: "inherit",
            resize: "vertical",
          }}
        />
      </label>

      {error && (
        <div style={{ fontSize: 12, color: "oklch(0.65 0.2 25)" }}>{error}</div>
      )}

      <button
        type="submit"
        className="btn btn--gold"
        style={{ marginTop: 6 }}
        disabled={status === "sending"}
      >
        {status === "sent"
          ? "Enviado ✓"
          : status === "sending"
            ? "Enviando..."
            : "Enviar mensagem →"}
      </button>
    </form>
  );
}
