"use client";

import { useState } from "react";

type SubStep = "aviso" | "form" | "pronto";

interface FirstAccessWizardProps {
  initialPassword: string;
  onComplete: () => void;
  onBack: () => void;
}

function calcPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function FirstAccessWizard({ initialPassword, onComplete, onBack }: FirstAccessWizardProps) {
  const [subStep, setSubStep] = useState<SubStep>("aviso");

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingFirstAccess, setSavingFirstAccess] = useState(false);
  const [firstAccessError, setFirstAccessError] = useState("");

  const pwStrength = calcPasswordStrength(newPassword);

  async function handleSaveFirstAccess() {
    setSavingFirstAccess(true);
    setFirstAccessError("");
    try {
      const [profileRes, passwordRes] = await Promise.all([
        fetch("/api/users/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName, email: newEmail }),
        }),
        fetch("/api/users/password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: initialPassword,
            newPassword,
            confirmPassword,
          }),
        }),
      ]);
      if (!profileRes.ok || !passwordRes.ok) {
        const err = await (profileRes.ok ? passwordRes : profileRes).json();
        setFirstAccessError(err.error || "Erro ao salvar dados");
        return;
      }
      setSubStep("pronto");
    } catch {
      setFirstAccessError("Erro de conexão");
    } finally {
      setSavingFirstAccess(false);
    }
  }

  if (subStep === "aviso") {
    return (
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
          <div style={{ fontWeight: 600 }}>{initialPassword || "14.572.881/0001-29"}</div>
        </div>

        <button
          className="btn btn--ink btn--block"
          onClick={() => setSubStep("form")}
        >
          Atualizar meus dados →
        </button>
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

  if (subStep === "form") {
    return (
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

        {firstAccessError && (
          <div className="err-msg" style={{ marginTop: 8 }}>{firstAccessError}</div>
        )}
        <button
          className="btn btn--ink btn--block"
          style={{ marginTop: 20 }}
          disabled={savingFirstAccess || !newName || !newEmail || newPassword.length < 8 || newPassword !== confirmPassword}
          onClick={handleSaveFirstAccess}
        >
          {savingFirstAccess ? "Salvando…" : "Salvar e entrar →"}
        </button>
        <button
          className="btn btn--ghost btn--block btn--sm"
          style={{ marginTop: 8, borderColor: "var(--line-ink)", color: "var(--ink)" }}
          onClick={() => setSubStep("aviso")}
        >
          ← Voltar
        </button>
      </>
    );
  }

  // subStep === "pronto"
  return (
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
        onClick={onComplete}
      >
        Ir para a biblioteca →
      </button>
    </>
  );
}
