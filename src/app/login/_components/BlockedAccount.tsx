"use client";

import { useState, useEffect } from "react";
import BookCover from "@/components/BookCover";
import Logo from "@/components/Logo";
import { BOOKS } from "@/lib/books-data";

interface Props {
  cnpj?: string;
  releaseAt: number;
  onRecover: () => void;
  onBack: () => void;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00";
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function BlockedAccount({ cnpj, releaseAt, onRecover, onBack }: Props) {
  const [remaining, setRemaining] = useState(releaseAt - Date.now());

  useEffect(() => {
    const t = setInterval(() => {
      setRemaining(releaseAt - Date.now());
    }, 1000);
    return () => clearInterval(t);
  }, [releaseAt]);

  const stackBooks = BOOKS.slice(0, 9);
  const unblocked = remaining <= 0;

  return (
    <div className="auth-shell">
      <div
        className="auth-brand"
        style={{ background: "linear-gradient(160deg, oklch(0.28 0.12 25), var(--ink) 70%)" }}
      >
        <Logo variant="on-colored" size="sm" />
        <div className="stack-deco">
          {stackBooks.map((b) => (
            <BookCover key={b.id} book={b} href="#" style={{ width: 60 }} />
          ))}
        </div>
        <div>
          <h2>
            Conta<br />
            temporariamente<br />
            pausada.
          </h2>
          <p>Proteção automática após várias tentativas.</p>
        </div>
        <div className="tag" style={{ color: "var(--muted)" }}>EST. 2024 · PIXEL LIBER</div>
      </div>

      <div className="auth-form">
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "oklch(0.94 0.06 25)",
            color: "oklch(0.45 0.18 25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            marginBottom: 18,
            border: "1px solid oklch(0.85 0.1 25)",
          }}
        >
          ⛌
        </div>
        <h3>Conta bloqueada</h3>
        <p className="sub">
          Por segurança, bloqueamos o login neste CNPJ após 5 tentativas incorretas.
        </p>

        <div
          style={{
            background: "oklch(0.98 0.015 25)",
            border: "1px solid oklch(0.9 0.04 25)",
            borderRadius: 10,
            padding: 16,
            marginBottom: 14,
          }}
        >
          {cnpj && (
            <div className="flex-between" style={{ fontSize: 12 }}>
              <span className="tag">CNPJ</span>
              <span style={{ fontWeight: 500 }}>{cnpj}</span>
            </div>
          )}
          <div className="flex-between" style={{ fontSize: 12, marginTop: 6 }}>
            <span className="tag">Libera em</span>
            <span
              className="mono"
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: unblocked ? "var(--ok)" : "oklch(0.45 0.18 25)",
              }}
            >
              {unblocked ? "desbloqueada ✓" : formatCountdown(remaining)}
            </span>
          </div>
          <div className="flex-between" style={{ fontSize: 12, marginTop: 6 }}>
            <span className="tag">Motivo</span>
            <span style={{ fontWeight: 500 }}>5 tentativas incorretas</span>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55, margin: "0 0 18px" }}>
          Se não foi você quem tentou entrar,{" "}
          <strong style={{ color: "var(--ink)" }}>recupere a senha agora</strong> — vamos invalidar
          a antiga por precaução.
        </p>

        <div className="flex wrap" style={{ gap: 10 }}>
          <button className="btn btn--ink" onClick={onRecover}>
            Recuperar senha agora →
          </button>
          {unblocked ? (
            <button
              className="btn btn--gold"
              onClick={onBack}
            >
              Tentar entrar →
            </button>
          ) : (
            <button
              className="btn btn--ghost"
              style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
              onClick={onBack}
            >
              ← Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
