"use client";

import { useState } from "react";

interface Props {
  onToast: (msg: string) => void;
}

export default function PasswordForm({ onToast }: Props) {
  const [pwFormOpen, setPwFormOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  async function handleSavePassword() {
    if (newPw !== confirmPw) { onToast("As senhas não coincidem"); return; }
    if (newPw.length < 8) { onToast("A nova senha deve ter pelo menos 8 caracteres"); return; }
    setSavingPw(true);
    try {
      const res = await fetch("/api/users/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw, confirmPassword: confirmPw }),
      });
      const data = await res.json();
      if (!res.ok) {
        onToast(data.error || "Erro ao alterar senha");
      } else {
        onToast("Senha atualizada ✓");
        setPwFormOpen(false);
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      }
    } catch {
      onToast("Erro de conexão");
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="flex-between" style={{ padding: "14px 0", borderTop: "1px solid var(--line-ink)", flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ fontWeight: 500, fontSize: 14 }}>Senha</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Troque periodicamente para manter sua conta segura.</div>
      </div>
      <button className="btn btn--ink btn--sm" onClick={() => setPwFormOpen((o) => !o)}>Trocar senha</button>
      {pwFormOpen && (
        <div style={{ width: "100%", padding: "14px 0", borderTop: "1px solid var(--line-ink)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
            <div><label className="label">Senha atual</label><input className="input" type="password" placeholder="••••••••" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} /></div>
            <div />
            <div><label className="label">Nova senha</label><input className="input" type="password" placeholder="••••••••" value={newPw} onChange={(e) => setNewPw(e.target.value)} /></div>
            <div><label className="label">Confirmar nova senha</label><input className="input" type="password" placeholder="••••••••" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} /></div>
          </div>
          <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button className="btn btn--ghost btn--sm" style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }} onClick={() => { setPwFormOpen(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }}>Cancelar</button>
            <button className="btn btn--ink btn--sm" onClick={handleSavePassword} disabled={savingPw}>
              {savingPw ? "Salvando…" : "Salvar nova senha"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
