"use client";

import { useState } from "react";
import Link from "next/link";
import Toast from "@/components/Toast";
import { initials, formatCNPJ } from "@/lib/utils";
import { useLogout } from "@/hooks/useLogout";
import ProfileForm from "./_components/ProfileForm";
import PasswordForm from "./_components/PasswordForm";

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


export default function MinhaContaClient({ user, isAdmin }: Props) {
  const [toast, setToast] = useState("");
  const [twoFA, setTwoFA] = useState(user.twoFaEnabled);
  const [notif, setNotif] = useState(parseNotif(user.notifSettings));

  const cnpj = formatCNPJ(user.company?.cnpj ?? null);

  const handleLogout = useLogout();

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

          <ProfileForm user={{ name: user.name, email: user.email }} onToast={setToast} />
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

          <PasswordForm onToast={setToast} />

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
