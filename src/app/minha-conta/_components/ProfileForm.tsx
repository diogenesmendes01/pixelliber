"use client";

import { useState } from "react";

interface Props {
  user: { name: string | null; email: string | null };
  onToast: (msg: string) => void;
}

export default function ProfileForm({ user, onToast }: Props) {
  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  async function handleSaveProfile() {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        onToast(data.error || "Erro ao salvar perfil");
      } else {
        onToast("Dados salvos ✓");
      }
    } catch {
      onToast("Erro de conexão");
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <>
      <h3>Dados pessoais</h3>
      <div className="card-sub">Como aparece na plataforma e em confirmações por e-mail.</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
        <div>
          <label className="label">Nome completo</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label">E-mail</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button className="btn btn--ghost btn--sm" style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }} onClick={() => { setName(user.name ?? ""); setEmail(user.email ?? ""); }}>Cancelar</button>
        <button className="btn btn--ink btn--sm" onClick={handleSaveProfile} disabled={savingProfile}>
          {savingProfile ? "Salvando…" : "Salvar alterações"}
        </button>
      </div>
    </>
  );
}
