"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import Logo from "@/components/Logo";
import { BOOKS } from "@/lib/books-data";

interface Props {
  token: string;
  invitedName: string;
  invitedEmail: string;
  companyName: string;
  invitedRole: string;
}

type Step = "conv-1" | "conv-2" | "conv-3";

function BrandSide({ hue = 85, title, sub }: { hue?: number; title: React.ReactNode; sub: string }) {
  const stackBooks = BOOKS.slice(0, 9);
  return (
    <div
      className="auth-brand"
      style={{ background: `linear-gradient(160deg, oklch(0.3 0.09 ${hue}), var(--ink) 70%)` }}
    >
      <Logo variant="on-colored" size="sm" />
      <div className="stack-deco" style={{ opacity: 0.25 }}>
        {stackBooks.map((b) => (
          <BookCover key={b.id} book={b} href="#" style={{ width: 60 }} />
        ))}
      </div>
      <div>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
      <div className="tag" style={{ color: "var(--muted)" }}>EST. 2024 · PIXEL LIBER</div>
    </div>
  );
}

export default function ConviteClient({ token, invitedName, invitedEmail, companyName, invitedRole }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("conv-1");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const checks = {
    len: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    num: /\d/.test(newPassword),
    special: /[^a-zA-Z0-9]/.test(newPassword),
  };
  const strength = Object.values(checks).filter(Boolean).length;
  const matches = newPassword.length > 0 && newPassword === confirmPassword;

  async function handleAcceptSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorText("");
    if (!matches) { setErrorText("As senhas não coincidem."); return; }
    if (strength < 3) { setErrorText("Senha precisa atender pelo menos 3 requisitos."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email: invitedEmail, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorText(data.error ?? "Não foi possível aceitar o convite.");
        setLoading(false);
        return;
      }
      setStep("conv-3");
    } catch {
      setErrorText("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // conv-1: convite
  if (step === "conv-1") {
    return (
      <div className="auth-shell">
        <BrandSide
          title={<>Bem-vindo,<br />{invitedName.split(" ")[0]}.</>}
          sub={`${companyName} convidou você para o acervo.`}
        />
        <div className="auth-form">
          <div className="steps">
            <div className="step-dot on" />
            <div className="step-dot" />
            <div className="step-dot" />
            <span className="steps-label">passo 1 de 3 · convite</span>
          </div>
          <span
            className="chip"
            style={{
              background: "oklch(0.95 0.06 85)",
              borderColor: "oklch(0.82 0.08 85)",
              color: "oklch(0.35 0.08 60)",
              marginTop: 18,
              alignSelf: "flex-start",
            }}
          >
            ✉ Convite recebido
          </span>
          <h3 style={{ marginTop: 12 }}>
            Você foi convidado para a biblioteca da{" "}
            <em style={{ color: "var(--amber)", fontStyle: "italic" }}>{companyName}</em>.
          </h3>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Um acervo com 480+ e-books curados em finanças, marketing, mente e negócios. Leitura online, offline, e compartilhamento de trechos.
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
              <span className="tag">Para</span>
              <span style={{ fontWeight: 500 }}>{invitedEmail || "seu e-mail"}</span>
            </div>
            <div className="flex-between" style={{ fontSize: 12 }}>
              <span className="tag">Empresa</span>
              <span style={{ fontWeight: 500 }}>{companyName}</span>
            </div>
            <div className="flex-between" style={{ fontSize: 12 }}>
              <span className="tag">Papel</span>
              <span style={{ fontWeight: 500 }}>{invitedRole}</span>
            </div>
          </div>

          <div className="flex wrap" style={{ gap: 10, marginTop: 18 }}>
            <button className="btn btn--ink" onClick={() => setStep("conv-2")}>
              Aceitar e criar senha →
            </button>
            <Link
              href="/"
              className="btn btn--ghost"
              style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
            >
              Recusar
            </Link>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 12 }}>
            Se não reconhece este convite, ignore este e-mail.
          </div>
        </div>
      </div>
    );
  }

  // conv-2: criar senha
  if (step === "conv-2") {
    return (
      <div className="auth-shell">
        <BrandSide
          title={<>Crie sua<br />senha.</>}
          sub="Depois a estante está aberta."
        />
        <div className="auth-form" style={{ overflow: "auto" }}>
          <div className="steps">
            <div className="step-dot done" />
            <div className="step-dot on" />
            <div className="step-dot" />
            <span className="steps-label">passo 2 de 3 · convite</span>
          </div>
          <h3 style={{ marginTop: 14 }}>Crie sua senha</h3>
          <p className="sub">Use algo forte. Só você vai conhecer.</p>

          <form onSubmit={handleAcceptSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: 10,
                marginTop: 4,
              }}
            >
              <div>
                <label className="label">E-mail</label>
                <input
                  className="input"
                  value={invitedEmail}
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>
              <div>
                <label className="label">Nome</label>
                <input
                  className="input"
                  value={invitedName}
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>
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
                <label className="label">Confirmar senha</label>
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
                    ? "repita a senha"
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

            <label style={{ display: "flex", gap: 10, marginTop: 18, fontSize: 12, color: "var(--muted)" }}>
              <input type="checkbox" defaultChecked />
              <span>
                Li e aceito os <u>Termos de uso</u> e a <u>Política de privacidade</u>.
              </span>
            </label>

            {errorText && (
              <div className="alert alert--danger" style={{ marginTop: 14 }}>
                <span className="alert-icon">!</span>
                <div><div className="alert-title">{errorText}</div></div>
              </div>
            )}

            <div className="flex-between wrap" style={{ marginTop: 20, gap: 14 }}>
              <button
                type="button"
                className="btn btn--ghost"
                style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
                onClick={() => setStep("conv-1")}
              >
                ← voltar
              </button>
              <button
                type="submit"
                className="btn btn--ink"
                disabled={loading || !matches || strength < 3}
              >
                {loading ? "Salvando…" : "Criar senha e entrar →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // conv-3: boas-vindas
  return (
    <div className="auth-shell">
      <BrandSide
        hue={140}
        title={<>Bem-vindo<br />à biblioteca.</>}
        sub="A estante está aberta."
      />
      <div className="auth-form">
        <div className="steps">
          <div className="step-dot done" />
          <div className="step-dot done" />
          <div className="step-dot on" />
          <span className="steps-label">passo 3 de 3 · convite</span>
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
          Tudo certo,{" "}
          <em style={{ color: "var(--ok)", fontStyle: "italic" }}>{invitedName.split(" ")[0]}</em>.
          <br />
          Boa leitura.
        </h3>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
          Sua conta está ativa. Comece explorando o catálogo — ou salve títulos pra ler depois.
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
            <span className="tag">Empresa</span>
            <span style={{ fontWeight: 500 }}>{companyName}</span>
          </div>
          <div className="flex-between" style={{ fontSize: 12 }}>
            <span className="tag">E-mail</span>
            <span style={{ fontWeight: 500 }}>{invitedEmail}</span>
          </div>
          <div className="flex-between" style={{ fontSize: 12 }}>
            <span className="tag">Papel</span>
            <span style={{ fontWeight: 500 }}>{invitedRole}</span>
          </div>
        </div>

        <div className="flex wrap" style={{ marginTop: 18, gap: 10 }}>
          <button
            className="btn btn--gold"
            style={{ flex: 1, minWidth: 180 }}
            onClick={() => router.push("/vitrine")}
          >
            Ir para o catálogo →
          </button>
          <Link
            href="/minha-conta"
            className="btn btn--ghost"
            style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
          >
            Minha conta
          </Link>
        </div>
      </div>
    </div>
  );
}
