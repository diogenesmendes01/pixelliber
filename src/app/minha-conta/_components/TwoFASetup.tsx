"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";

interface Props {
  email: string;
  onClose: () => void;
  onComplete: () => void;
}

type Step = 1 | 2 | 3;

function generateBase32Secret(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let out = "";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) out += chars[bytes[i] % chars.length];
  return out;
}

function generateRecoveryCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 6; i++) {
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    codes.push(`${hex.slice(0, 5)}-${hex.slice(5, 10)}`);
  }
  return codes;
}

export default function TwoFASetup({ email, onClose, onComplete }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [secret] = useState(() => generateBase32Secret());
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [recoveryCodes] = useState(generateRecoveryCodes());
  const [codesDownloaded, setCodesDownloaded] = useState(false);

  const otpauthUri = `otpauth://totp/Pixel%20Liber:${encodeURIComponent(email)}?secret=${secret}&issuer=Pixel%20Liber&algorithm=SHA1&digits=6&period=30`;

  useEffect(() => {
    QRCode.toDataURL(otpauthUri, { width: 220, margin: 1, color: { dark: "#0f0f10", light: "#ffffff" } })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [otpauthUri]);

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setVerifyError("");
    // Stubbed verification: accept any 6-digit code (real TOTP check requires server-side)
    if (!/^\d{6}$/.test(code)) {
      setVerifyError("Digite os 6 dígitos do app.");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setStep(3);
    }, 400);
  }

  function downloadRecoveryCodes() {
    const blob = new Blob(
      [`Pixel Liber — Códigos de recuperação 2FA\n\nE-mail: ${email}\nGerado em: ${new Date().toLocaleString("pt-BR")}\n\n${recoveryCodes.join("\n")}\n\nGuarde este arquivo em local seguro.\nCada código pode ser usado apenas uma vez.\n`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pixel-liber-2fa-recovery.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setCodesDownloaded(true);
  }

  return (
    <div
      className="modal-backdrop open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal"
        style={{
          background: "#fff",
          color: "var(--ink)",
          borderColor: "var(--line-ink)",
          width: "min(520px, 100%)",
        }}
      >
        <button className="modal-close" onClick={onClose} style={{ color: "var(--ink)" }}>✕</button>

        <div className="steps" style={{ marginBottom: 10 }}>
          <div className={`step-dot${step >= 1 ? (step > 1 ? " done" : " on") : ""}`} />
          <div className={`step-dot${step >= 2 ? (step > 2 ? " done" : " on") : ""}`} />
          <div className={`step-dot${step >= 3 ? " on" : ""}`} />
          <span className="steps-label">passo {step} de 3 · 2FA</span>
        </div>

        {step === 1 && (
          <>
            <span className="tag gold-text">Autenticação em 2 etapas</span>
            <h3 style={{ color: "var(--ink)" }}>Escaneie o QR code</h3>
            <p className="sub" style={{ color: "var(--muted)" }}>
              Use o Google Authenticator, Authy, 1Password ou outro app TOTP.
            </p>

            <div
              style={{
                display: "flex",
                gap: 20,
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: 8,
              }}
            >
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="QR code"
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: 8,
                    border: "1px solid var(--line-ink)",
                  }}
                />
              ) : (
                <div
                  className="skel"
                  style={{ width: 180, height: 180, borderRadius: 8 }}
                />
              )}

              <div style={{ flex: 1, minWidth: 220 }}>
                <div className="tag">Não consegue escanear?</div>
                <p style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 8px", lineHeight: 1.5 }}>
                  Digite este código manualmente no app:
                </p>
                <div
                  style={{
                    padding: "10px 12px",
                    background: "rgba(0,0,0,0.04)",
                    borderRadius: 8,
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    wordBreak: "break-all",
                    letterSpacing: "0.05em",
                  }}
                >
                  {secret.match(/.{1,4}/g)?.join(" ")}
                </div>
                <button
                  className="icon-btn-ink"
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    navigator.clipboard?.writeText(secret);
                  }}
                >
                  Copiar código
                </button>
              </div>
            </div>

            <div className="flex-between" style={{ marginTop: 20, gap: 10 }}>
              <button
                className="btn btn--ghost"
                style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button className="btn btn--ink" onClick={() => setStep(2)}>
                Já escaneei →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <span className="tag gold-text">Verificar</span>
            <h3 style={{ color: "var(--ink)" }}>Digite o código do app</h3>
            <p className="sub" style={{ color: "var(--muted)" }}>
              O código tem 6 dígitos e muda a cada 30 segundos.
            </p>

            <form onSubmit={handleVerify}>
              <div className="field">
                <label className="label">Código do autenticador</label>
                <input
                  className={`input${verifyError ? " input--err" : ""}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 24,
                    textAlign: "center",
                    letterSpacing: "0.3em",
                    maxWidth: 240,
                  }}
                  autoFocus
                />
                {verifyError && <div className="err-msg">{verifyError}</div>}
              </div>

              <div className="flex-between" style={{ marginTop: 20, gap: 10 }}>
                <button
                  type="button"
                  className="btn btn--ghost"
                  style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
                  onClick={() => setStep(1)}
                >
                  ← voltar
                </button>
                <button
                  type="submit"
                  className="btn btn--ink"
                  disabled={verifying || code.length !== 6}
                >
                  {verifying ? "Verificando…" : "Verificar →"}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 999,
                background: "oklch(0.92 0.08 150)",
                color: "oklch(0.4 0.14 150)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                marginBottom: 14,
                border: "1px solid oklch(0.82 0.1 150)",
              }}
            >
              ✓
            </div>
            <span className="tag gold-text">Códigos de recuperação</span>
            <h3 style={{ color: "var(--ink)" }}>Guarde estes códigos em local seguro</h3>
            <p className="sub" style={{ color: "var(--muted)" }}>
              Se você perder o acesso ao app autenticador, use um destes códigos para entrar. Cada código funciona uma única vez.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                padding: 14,
                background: "rgba(0,0,0,0.04)",
                borderRadius: 8,
                fontFamily: "var(--mono)",
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              {recoveryCodes.map((c) => (
                <div key={c} style={{ letterSpacing: "0.04em" }}>{c}</div>
              ))}
            </div>

            <div className="flex wrap" style={{ gap: 8, marginBottom: 14 }}>
              <button
                className="icon-btn-ink"
                onClick={downloadRecoveryCodes}
              >
                ⬇ Baixar .txt
              </button>
              <button
                className="icon-btn-ink"
                onClick={() => {
                  navigator.clipboard?.writeText(recoveryCodes.join("\n"));
                }}
              >
                Copiar todos
              </button>
            </div>

            {!codesDownloaded && (
              <div className="alert alert--warn" style={{ marginBottom: 14 }}>
                <span className="alert-icon">⚠</span>
                <div>
                  <div className="alert-title">Salve antes de continuar</div>
                  <div className="alert-msg">
                    Você não verá esses códigos novamente. Baixe ou copie antes de fechar.
                  </div>
                </div>
              </div>
            )}

            <div className="flex-between" style={{ gap: 10 }}>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                Salvos em local seguro?
              </span>
              <button className="btn btn--ink" onClick={onComplete}>
                Concluir →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
