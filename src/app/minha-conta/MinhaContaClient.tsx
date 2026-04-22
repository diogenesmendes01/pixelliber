"use client";

import { useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  twoFaEnabled: boolean;
  notifSettings: string | null;
  assinaturaAtiva: boolean;
  company: {
    name: string;
    cnpj: string | null;
    statusAssinatura: string;
  } | null;
}

const DEFAULT_NOTIF = { novosLivros: true, equipe: true, plano: true, dicas: false };

function parseNotif(raw: string | null): typeof DEFAULT_NOTIF {
  try { return { ...DEFAULT_NOTIF, ...JSON.parse(raw ?? "{}") }; }
  catch { return DEFAULT_NOTIF; }
}

interface Props {
  user: User;
  isAdmin: boolean;
}

function initials(name: string | null) {
  if (!name) return "?";
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[p.length - 1]?.[0] ?? "")).toUpperCase();
}

function formatCNPJ(cnpj: string | null) {
  if (!cnpj) return "";
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  setTimeout(onDone, 3000);
  return (
    <div className="toast-slot">
      <div className="toast">{msg}</div>
    </div>
  );
}

export default function MinhaContaClient({ user, isAdmin }: Props) {
  const [toast, setToast] = useState("");
  const [pwFormOpen, setPwFormOpen] = useState(false);
  const [twoFA, setTwoFA] = useState(user.twoFaEnabled);
  const [notif, setNotif] = useState(parseNotif(user.notifSettings));

  // Profile form state
  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const cnpj = formatCNPJ(user.company?.cnpj ?? null);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

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
        setToast(data.error || "Erro ao salvar perfil");
      } else {
        setToast("Dados salvos ✓");
      }
    } catch {
      setToast("Erro de conexão");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSavePassword() {
    if (newPw !== confirmPw) { setToast("As senhas não coincidem"); return; }
    if (newPw.length < 8) { setToast("A nova senha deve ter pelo menos 8 caracteres"); return; }
    setSavingPw(true);
    try {
      const res = await fetch("/api/users/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw, confirmPassword: confirmPw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.error || "Erro ao alterar senha");
      } else {
        setToast("Senha atualizada ✓");
        setPwFormOpen(false);
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      }
    } catch {
      setToast("Erro de conexão");
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="console">
      {/* Sidebar */}
      <aside className="console-side">
        <Link href="/vitrine" className="logo">
          <span className="logo-dot" />
          <span>Pixel Liber</span>
        </Link>
        <div className="side-lbl">Leitura</div>
        <Link href="/vitrine">📚 Catálogo</Link>
        {isAdmin && (
          <>
            <div className="side-lbl">Administração</div>
            <Link href="/minha-conta/equipe">👥 Equipe</Link>
          </>
        )}
        <Link href="/minha-conta" className="active">⚙ Minha conta</Link>
        <button className="console-link" onClick={() => setToast("Plano & fatura estará disponível em breve.")}>💳 Plano &amp; fatura</button>
        {isAdmin && <button className="console-link" onClick={() => setToast("Uso e relatórios estará disponível em breve.")}>📊 Uso e relatórios</button>}
        <div className="side-foot">
          <strong style={{ color: "var(--paper)", fontWeight: 500 }}>{user.company?.name ?? "Empresa"}</strong>
          <br />
          {cnpj && <>{cnpj}<br /></>}
          {user.name}
        </div>
      </aside>

      {/* Main */}
      <main className="console-main">
        <div className="console-top">
          <div>
            <div className="tag gold-text">Conta</div>
            <h1>Minha conta</h1>
            <p>Seus dados, empresa, segurança e notificações.</p>
          </div>
          <Link href="/vitrine" className="btn btn--ghost btn--sm" style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}>
            ← voltar pro catálogo
          </Link>
        </div>

        {/* Perfil */}
        <div className="card-block">
          <div className="flex" style={{ gap: 16, marginBottom: 20 }}>
            <div
              className="avatar"
              style={{ width: 64, height: 64, fontSize: 22, background: "linear-gradient(150deg,oklch(0.6 0.12 38),oklch(0.4 0.1 38))", color: "#fff" }}
            >
              {initials(user.name)}
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex" style={{ gap: 8, flexWrap: "wrap" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 500 }}>{user.name ?? "—"}</div>
                {isAdmin && (
                  <span className="chip chip--gold" style={{ fontSize: 10, padding: "3px 9px" }}>Administrador</span>
                )}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>
                {user.email} · {user.company?.name}
              </div>
            </div>
          </div>

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
        </div>

        {/* Empresa */}
        <div className="card-block">
          <h3>Empresa</h3>
          <div className="card-sub">Dados do CNPJ. Para mudar a razão social, fale com o suporte.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
            <div><label className="label">CNPJ</label><input className="input" value={cnpj} disabled style={{ opacity: 0.6 }} readOnly /></div>
            <div><label className="label">Razão social</label><input className="input" defaultValue={user.company?.name ?? ""} disabled style={{ opacity: 0.6 }} /></div>
            <div>
              <label className="label">Status da assinatura</label>
              <input className="input" value={user.company?.statusAssinatura ?? "—"} disabled style={{ opacity: 0.6 }} readOnly />
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="card-block" id="seguranca">
          <h3>Segurança</h3>
          <div className="card-sub">Senha, sessões ativas e autenticação em duas etapas.</div>

          <div className="flex-between" style={{ padding: "14px 0", borderTop: "1px solid var(--line-ink)", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>Senha</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Troque periodicamente para manter sua conta segura.</div>
            </div>
            <button className="btn btn--ink btn--sm" onClick={() => setPwFormOpen((o) => !o)}>Trocar senha</button>
          </div>

          {pwFormOpen && (
            <div style={{ padding: "14px 0", borderTop: "1px solid var(--line-ink)" }}>
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

          <div className="flex-between" style={{ padding: "14px 0", borderTop: "1px solid var(--line-ink)", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="flex">
                <span style={{ fontWeight: 500, fontSize: 14 }}>Autenticação em 2 etapas</span>
                <span className={`status-pill ${twoFA ? "ativo" : "inativo"}`}>{twoFA ? "ativo" : "desativado"}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Recomendado para admins.</div>
            </div>
            <div
              className={`toggle${twoFA ? " on" : ""}`}
              onClick={async () => {
                const next = !twoFA;
                setTwoFA(next);
                await fetch("/api/users/settings", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ twoFaEnabled: next }),
                });
                setToast(next ? "2FA ativado" : "2FA desativado");
              }}
            />
          </div>
        </div>

        {/* Notificações */}
        <div className="card-block">
          <h3>Notificações</h3>
          <div className="card-sub">O que você quer receber por e-mail.</div>
          {([
            { key: "novosLivros", label: "Novos livros adicionados", desc: "Resumo semanal das novidades." },
            { key: "equipe", label: "Atividade da equipe", desc: "Convites aceitos, novos acessos (só admins)." },
            { key: "plano", label: "Aviso de plano expirando", desc: "15, 7 e 1 dia antes do vencimento." },
            { key: "dicas", label: "Dicas e recomendações", desc: "Sugestões curadas com base na leitura." },
          ] as const).map((n) => (
            <NotifRow
              key={n.key}
              label={n.label}
              desc={n.desc}
              defaultOn={notif[n.key]}
              onToggle={async (v) => {
                const next = { ...notif, [n.key]: v };
                setNotif(next);
                await fetch("/api/users/settings", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ notifSettings: next }),
                });
                setToast(`${n.label}: ${v ? "ativado" : "desativado"}`);
              }}
            />
          ))}
        </div>

        {/* Danger zone */}
        {isAdmin && (
          <div className="card-block" style={{ borderColor: "oklch(0.88 0.06 25)" }}>
            <h3 style={{ color: "oklch(0.45 0.18 25)" }}>Zona de atenção</h3>
            <div className="card-sub">Ações irreversíveis. Só o admin principal pode executar.</div>
            <div className="flex-between" style={{ padding: "14px 0", borderTop: "1px solid var(--line-ink)", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>Transferir administração</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Passa o papel de admin para outra pessoa.</div>
              </div>
              <button className="icon-btn-ink" onClick={() => setToast("Funcionalidade em breve")}>Transferir</button>
            </div>
            <div className="flex-between" style={{ padding: "14px 0", borderTop: "1px solid var(--line-ink)", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14, color: "oklch(0.45 0.18 25)" }}>Encerrar conta corporativa</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Remove todos os usuários e cancela o plano.</div>
              </div>
              <button className="icon-btn-ink danger" onClick={() => setToast("Entre em contato com o suporte para encerrar a conta")}>Encerrar conta</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn--ghost btn--sm" style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }} onClick={handleLogout}>
            Sair da conta
          </button>
        </div>
      </main>

      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
    </div>
  );
}

function NotifRow({ label, desc, defaultOn, onToggle }: { label: string; desc: string; defaultOn: boolean; onToggle: (v: boolean) => void }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid var(--line-ink)", gap: 10, flexWrap: "wrap" }}>
      <div>
        <div style={{ fontWeight: 500, fontSize: 13.5 }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{desc}</div>
      </div>
      <div
        className={`toggle${on ? " on" : ""}`}
        onClick={() => { const next = !on; setOn(next); onToggle(next); }}
      />
    </div>
  );
}
