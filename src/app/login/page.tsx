"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Step =
  | "login"
  | "primeiro"
  | "atualizar"
  | "pronto"
  | "esq-1"
  | "esq-2"
  | "esq-3"
  | "esq-4";

function formatCNPJ(value: string): string {
  const d = value.replace(/[^\d]/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
}

const COVER_BOOKS = [
  { hue: 38 }, { hue: 160 }, { hue: 280 },
  { hue: 20 }, { hue: 210 }, { hue: 50 },
  { hue: 340 }, { hue: 100 }, { hue: 0 },
];

function StackDeco() {
  return (
    <div className="auth-brand" style={{ position: "relative" }}>
      <div className="logo" style={{ color: "var(--paper)" }}>
        <span className="logo-dot" />
        <span>Pixel Liber</span>
      </div>
      <div className="stack-deco">
        {COVER_BOOKS.map((b, i) => (
          <div
            key={i}
            className="cover"
            style={{
              background: `linear-gradient(150deg, oklch(0.42 0.1 ${b.hue}), oklch(0.22 0.08 ${(b.hue + 30) % 360}))`,
              width: 60,
            }}
          />
        ))}
      </div>
      <div>
        <h2>Bem-vindo à sua<br />biblioteca.</h2>
        <p>Acesse com seu CNPJ e senha corporativa.</p>
      </div>
      <div className="tag" style={{ color: "var(--muted)" }}>EST. 2024 · PIXEL LIBER</div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("login");

  const [cnpj, setCnpj] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!cnpj || !password) { setError("CNPJ e senha são obrigatórios"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj, password, rememberMe }),
      });
      const data = await res.json();
      if (!res.ok) {
        const rawCnpj = cnpj.replace(/[^\d]/g, "");
        if (password === rawCnpj || data?.firstAccess) {
          setStep("primeiro");
        } else {
          setError(data.error ?? "CNPJ ou senha incorretos");
        }
        return;
      }
      router.push("/vitrine");
      router.refresh();
    } catch {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
    } catch {}
    setStep("esq-2");
  }

  const pwStrength = (() => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score;
  })();

  return (
    <div className="auth-shell">
      <StackDeco />

      <div className="auth-form">
        {/* ---- STEP: LOGIN ---- */}
        {step === "login" && (
          <>
            <h3>Entrar</h3>
            <p className="sub">Para contas corporativas.</p>

            <div style={{ display: "grid", gap: 8, margin: "6px 0 18px" }}>
              <button
                className="btn btn--ghost"
                style={{ color: "var(--ink)", borderColor: "var(--line-ink)", justifyContent: "center", gap: 10, background: "#fff" }}
                onClick={() => alert("SSO Google")}
              >
                <svg width={16} height={16} viewBox="0 0 18 18" aria-hidden="true">
                  <path fill="#4285f4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.614z"/>
                  <path fill="#34a853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                  <path fill="#fbbc05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#ea4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Entrar com Google
              </button>
              <button
                className="btn btn--ghost"
                style={{ color: "var(--ink)", borderColor: "var(--line-ink)", justifyContent: "center", gap: 10, background: "#fff" }}
                onClick={() => alert("SSO Microsoft")}
              >
                <svg width={16} height={16} viewBox="0 0 21 21" aria-hidden="true">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
                Entrar com Microsoft
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 14px" }}>
              <div style={{ flex: 1, height: 1, background: "var(--line-ink)" }} />
              <span style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.14em" }}>ou com CNPJ</span>
              <div style={{ flex: 1, height: 1, background: "var(--line-ink)" }} />
            </div>

            <div className="hint">
              <span>✦</span>
              <div>
                <strong>1º acesso?</strong> Use o <strong>CNPJ</strong> como usuário <em>e</em> como senha.
                No próximo passo, você troca tudo.
              </div>
            </div>

            <form onSubmit={handleLogin} style={{ marginTop: 14 }}>
              <div className="field">
                <label className="label">CNPJ ou e-mail</label>
                <input
                  className="input"
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                  maxLength={18}
                  autoComplete="username"
                />
              </div>
              <div className="field">
                <label className="label">Senha</label>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                  No primeiro acesso, repita o CNPJ.
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 8 }}>
                <label style={{ fontSize: 12, display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  Lembrar dispositivo
                </label>
                <button
                  type="button"
                  style={{ fontSize: 12, color: "var(--amber)", fontWeight: 500, background: "none", border: 0, cursor: "pointer" }}
                  onClick={() => setStep("esq-1")}
                >
                  Esqueci a senha
                </button>
              </div>

              {error && (
                <div className="alert alert--danger" style={{ marginTop: 14, marginBottom: 0 }}>
                  <span className="alert-icon">!</span>
                  <div><div className="alert-title">{error}</div></div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn--ink btn--block"
                style={{ marginTop: 20 }}
                disabled={loading}
              >
                {loading ? "Entrando…" : "Entrar →"}
              </button>
            </form>

            <div className="divider ink" />
            <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
              Ainda não tem acesso?{" "}
              <Link href="/contato" style={{ color: "var(--amber)", fontWeight: 500 }}>
                Fale com seu gestor
              </Link>
            </p>
          </>
        )}

        {/* ---- STEP: PRIMEIRO ACESSO AVISO ---- */}
        {step === "primeiro" && (
          <>
            <div className="steps" style={{ marginBottom: 20 }}>
              <span className="step-dot on" />
              <span className="step-dot" />
              <span className="step-dot" />
              <span className="steps-label">Passo 1 de 3</span>
            </div>
            <h3>Bem-vindo!</h3>
            <p className="sub">Identificamos que é seu primeiro acesso.</p>

            <div className="hint" style={{ marginBottom: 20 }}>
              <span>✦</span>
              <div>
                Antes de acessar a biblioteca, precisamos que você <strong>atualize seus dados</strong> e
                escolha uma <strong>senha segura</strong>. Leva menos de 2 minutos.
              </div>
            </div>

            <div style={{ background: "oklch(0.97 0.01 0)", borderRadius: 10, padding: "14px 16px", marginBottom: 20, border: "1px solid var(--line-ink)" }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Conta identificada</div>
              <div style={{ fontWeight: 600 }}>{cnpj || "14.572.881/0001-29"}</div>
            </div>

            <button
              className="btn btn--ink btn--block"
              onClick={() => setStep("atualizar")}
            >
              Atualizar meus dados →
            </button>
            <button
              className="btn btn--ghost btn--block btn--sm"
              style={{ marginTop: 8, borderColor: "var(--line-ink)", color: "var(--ink)" }}
              onClick={() => setStep("login")}
            >
              ← Voltar ao login
            </button>
          </>
        )}

        {/* ---- STEP: ATUALIZAR DADOS ---- */}
        {step === "atualizar" && (
          <>
            <div className="steps" style={{ marginBottom: 20 }}>
              <span className="step-dot done" />
              <span className="step-dot on" />
              <span className="step-dot" />
              <span className="steps-label">Passo 2 de 3</span>
            </div>
            <h3>Seus dados</h3>
            <p className="sub">Preencha para personalizar sua conta.</p>

            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label className="label">Nome completo</label>
                <input
                  className="input"
                  placeholder="Marina Castro"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label className="label">E-mail corporativo</label>
                <input
                  className="input"
                  type="email"
                  placeholder="marina@empresa.com.br"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Nova senha</label>
                <input
                  className="input"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="pw-bars">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`pw-bar${pwStrength > i ? " on" : ""}`} />
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Confirmar nova senha</label>
                <input
                  className="input"
                  type="password"
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <div className="err-msg">As senhas não coincidem</div>
                )}
                {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
                  <div style={{ fontSize: 11, color: "var(--ok)", marginTop: 6, fontWeight: 500 }}>✓ senhas coincidem</div>
                )}
              </div>
            </div>

            <div className="req-grid" style={{ marginTop: 14 }}>
              <div className={`req-row${newPassword.length >= 8 ? " ok" : ""}`}>
                <span className="req-dot">{newPassword.length >= 8 ? "✓" : "·"}</span>
                mínimo 8 caracteres
              </div>
              <div className={`req-row${/[A-Z]/.test(newPassword) ? " ok" : ""}`}>
                <span className="req-dot">{/[A-Z]/.test(newPassword) ? "✓" : "·"}</span>
                letra maiúscula
              </div>
              <div className={`req-row${/[0-9]/.test(newPassword) ? " ok" : ""}`}>
                <span className="req-dot">{/[0-9]/.test(newPassword) ? "✓" : "·"}</span>
                pelo menos 1 número
              </div>
              <div className={`req-row${/[^A-Za-z0-9]/.test(newPassword) ? " ok" : ""}`}>
                <span className="req-dot">{/[^A-Za-z0-9]/.test(newPassword) ? "✓" : "·"}</span>
                1 caractere especial
              </div>
            </div>

            <button
              className="btn btn--ink btn--block"
              style={{ marginTop: 20 }}
              disabled={!newName || !newEmail || newPassword.length < 8 || newPassword !== confirmPassword}
              onClick={() => setStep("pronto")}
            >
              Salvar e entrar →
            </button>
            <button
              className="btn btn--ghost btn--block btn--sm"
              style={{ marginTop: 8, borderColor: "var(--line-ink)", color: "var(--ink)" }}
              onClick={() => setStep("primeiro")}
            >
              ← Voltar
            </button>
          </>
        )}

        {/* ---- STEP: PRONTO ---- */}
        {step === "pronto" && (
          <>
            <div className="steps" style={{ marginBottom: 20 }}>
              <span className="step-dot done" />
              <span className="step-dot done" />
              <span className="step-dot on" />
              <span className="steps-label">Passo 3 de 3</span>
            </div>

            <div className="hint hint--ok" style={{ marginBottom: 24, fontSize: 14 }}>
              <span>✓</span>
              <div>
                <strong>Tudo certo!</strong> Seus dados foram salvos. Você já pode acessar
                a biblioteca completa.
              </div>
            </div>

            <h3 style={{ marginBottom: 6 }}>Conta configurada!</h3>
            <p className="sub">Bem-vindo ao Pixel Liber, {newName || "Marina"}.</p>

            <button
              className="btn btn--gold btn--block"
              style={{ marginTop: 24 }}
              onClick={() => router.push("/vitrine")}
            >
              Ir para a biblioteca →
            </button>
          </>
        )}

        {/* ---- STEP: ESQUECI SENHA 1 ---- */}
        {step === "esq-1" && (
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
              <button
                type="submit"
                className="btn btn--ink btn--block"
                style={{ marginTop: 20 }}
                disabled={!forgotEmail}
              >
                Enviar link →
              </button>
            </form>
            <button
              className="btn btn--ghost btn--block btn--sm"
              style={{ marginTop: 8, borderColor: "var(--line-ink)", color: "var(--ink)" }}
              onClick={() => setStep("login")}
            >
              ← Voltar ao login
            </button>
          </>
        )}

        {/* ---- STEP: ESQUECI SENHA 2 (email enviado) ---- */}
        {step === "esq-2" && (
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
              onClick={() => setStep("login")}
            >
              ← Voltar ao login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
