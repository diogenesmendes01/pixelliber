"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BookCover from "@/components/BookCover";
import Logo from "@/components/Logo";
import { BOOKS } from "@/lib/books-data";

function StackBrand() {
  const stackBooks = BOOKS.slice(0, 9);
  return (
    <div
      className="auth-brand"
      style={{ background: "linear-gradient(160deg, oklch(0.3 0.09 40), var(--ink) 70%)" }}
    >
      <Logo variant="on-colored" size="sm" />
      <div className="stack-deco" style={{ opacity: 0.25 }}>
        {stackBooks.map((b) => (
          <BookCover key={b.id} book={b} href="#" style={{ width: 60 }} />
        ))}
      </div>
      <div>
        <h2>
          Nova senha,<br />
          mesmo acesso.
        </h2>
        <p>Escolha uma senha forte e mantenha o acervo por perto.</p>
      </div>
      <div className="tag" style={{ color: "var(--muted)" }}>EST. 2024 · PIXEL LIBER</div>
    </div>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [done, setDone] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    if (!token) setTokenError(true);
  }, [token]);

  // Password validation / strength
  const checks = {
    len: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    num: /\d/.test(newPassword),
    special: /[^a-zA-Z0-9]/.test(newPassword),
  };
  const strength = Object.values(checks).filter(Boolean).length;
  const matches = newPassword.length > 0 && newPassword === confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorText("");
    if (!matches) {
      setErrorText("As senhas não coincidem.");
      return;
    }
    if (strength < 3) {
      setErrorText("A senha precisa atender pelo menos 3 requisitos.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorText(data.error ?? "Não foi possível alterar a senha.");
        return;
      }
      setDone(true);
    } catch {
      setErrorText("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // esq-4: pronto
  if (done) {
    return (
      <div className="auth-shell">
        <div
          className="auth-brand"
          style={{ background: "linear-gradient(160deg, oklch(0.3 0.09 140), var(--ink) 70%)" }}
        >
          <Logo variant="on-colored" size="sm" />
          <div className="stack-deco" style={{ opacity: 0.3 }}>
            {BOOKS.slice(0, 9).map((b) => (
              <BookCover key={b.id} book={b} href="#" style={{ width: 60 }} />
            ))}
          </div>
          <div>
            <h2>
              Senha<br />
              atualizada.
            </h2>
            <p>Já pode entrar com a nova.</p>
          </div>
          <div className="tag" style={{ color: "var(--muted)" }}>EST. 2024 · PIXEL LIBER</div>
        </div>
        <div className="auth-form">
          <div className="steps">
            <div className="step-dot done" />
            <div className="step-dot done" />
            <div className="step-dot on" />
            <span className="steps-label">passo 3 de 3 · recuperar senha</span>
          </div>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "oklch(0.92 0.08 150)",
              color: "oklch(0.4 0.14 150)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 600,
              marginTop: 22,
              border: "1px solid oklch(0.82 0.1 150)",
            }}
          >
            ✓
          </div>
          <h3 style={{ marginTop: 16 }}>
            Senha atualizada <em style={{ color: "var(--ok)", fontStyle: "italic" }}>com sucesso</em>.
          </h3>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Use a nova senha para entrar. Outros dispositivos serão desconectados por precaução.
          </p>

          <div
            style={{
              background: "rgba(0,0,0,0.04)",
              borderRadius: 10,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 8,
            }}
          >
            <div className="flex-between" style={{ fontSize: 12 }}>
              <span className="tag">Status</span>
              <span style={{ fontWeight: 500, color: "var(--ok)" }}>senha redefinida</span>
            </div>
            <div className="flex-between" style={{ fontSize: 12 }}>
              <span className="tag">Sessões revogadas</span>
              <span style={{ fontWeight: 500 }}>todos os outros dispositivos</span>
            </div>
          </div>

          <div className="flex wrap" style={{ gap: 10, marginTop: 18 }}>
            <button
              className="btn btn--gold"
              onClick={() => router.push("/login")}
              style={{ flex: 1, minWidth: 180 }}
            >
              Fazer login →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Token inválido
  if (tokenError) {
    return (
      <div className="auth-shell">
        <StackBrand />
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
          <h3>Link inválido ou expirado</h3>
          <p className="sub">
            Os links de redefinição duram 60 minutos. Solicite um novo para continuar.
          </p>
          <div className="flex wrap" style={{ gap: 10, marginTop: 8 }}>
            <Link href="/login?step=esq-1" className="btn btn--ink">
              Solicitar novo link →
            </Link>
            <Link
              href="/login"
              className="btn btn--ghost"
              style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
            >
              ← Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // esq-3: formulário nova senha
  return (
    <div className="auth-shell">
      <StackBrand />
      <div className="auth-form">
        <div className="steps">
          <div className="step-dot done" />
          <div className="step-dot on" />
          <div className="step-dot" />
          <span className="steps-label">passo 2 de 3 · recuperar senha</span>
        </div>
        <h3 style={{ marginTop: 14 }}>Criar nova senha</h3>
        <p className="sub">Escolha algo forte. Você será desconectado dos outros dispositivos.</p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 10,
              marginTop: 4,
            }}
          >
            <div>
              <label className="label">Nova senha</label>
              <input
                className="input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <div className="pw-bars">
                <div className={`pw-bar${strength >= 1 ? " on" : ""}`} />
                <div className={`pw-bar${strength >= 2 ? " on" : ""}`} />
                <div className={`pw-bar${strength >= 3 ? " on" : ""}`} />
                <div className={`pw-bar${strength >= 4 ? " on" : ""}`} />
              </div>
              <div
                style={{
                  fontSize: 11,
                  marginTop: 6,
                  fontWeight: 500,
                  color: strength >= 3 ? "var(--ok)" : "var(--muted)",
                }}
              >
                {strength === 0 && "digite uma senha"}
                {strength === 1 && "senha fraca"}
                {strength === 2 && "senha razoável"}
                {strength === 3 && "senha forte"}
                {strength === 4 && "senha muito forte"}
              </div>
            </div>
            <div>
              <label className="label">Confirmar nova senha</label>
              <input
                className="input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <div
                style={{
                  fontSize: 11,
                  marginTop: 14,
                  fontWeight: 500,
                  color: matches ? "var(--ok)" : confirmPassword ? "oklch(0.5 0.18 25)" : "var(--muted)",
                }}
              >
                {!confirmPassword
                  ? "repita a nova senha"
                  : matches
                    ? "✓ senhas coincidem"
                    : "senhas diferentes"}
              </div>
            </div>
          </div>

          <div className="req-grid">
            <div className={`req-row${checks.len ? " ok" : ""}`}>
              <span className="req-dot">{checks.len ? "✓" : "·"}</span>mínimo 8 caracteres
            </div>
            <div className={`req-row${checks.upper ? " ok" : ""}`}>
              <span className="req-dot">{checks.upper ? "✓" : "·"}</span>letra maiúscula
            </div>
            <div className={`req-row${checks.num ? " ok" : ""}`}>
              <span className="req-dot">{checks.num ? "✓" : "·"}</span>pelo menos 1 número
            </div>
            <div className={`req-row${checks.special ? " ok" : ""}`}>
              <span className="req-dot">{checks.special ? "✓" : "·"}</span>1 caractere especial
            </div>
          </div>

          {errorText && (
            <div className="alert alert--danger" style={{ marginTop: 14 }}>
              <span className="alert-icon">!</span>
              <div><div className="alert-title">{errorText}</div></div>
            </div>
          )}

          <div className="flex-between wrap" style={{ marginTop: 20, gap: 14 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              Você vai precisar logar de novo com a nova senha.
            </span>
            <button
              type="submit"
              className="btn btn--ink"
              disabled={loading || !matches || strength < 3}
            >
              {loading ? "Salvando…" : "Salvar e continuar →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--muted)",
          }}
        >
          Verificando link…
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
