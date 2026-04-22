"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Toast from "@/components/Toast";
import Logo from "@/components/Logo";
import { initials } from "@/lib/utils";

type Employee = {
  id: string;
  fullName: string;
  corporateEmail: string;
  role: string | null;
  department: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  user: { lastLoginAt: string | null; isActive: boolean } | null;
};

type InviteMode = "single" | "wizard";

interface ActivityEntry {
  id: string;
  text: React.ReactNode;
  when: Date;
  tipo: "convite" | "aceite" | "remover";
}

function relativeTime(d: Date): string {
  const diffH = (Date.now() - d.getTime()) / (1000 * 60 * 60);
  if (diffH < 1) return "há pouco";
  if (diffH < 24) return "hoje";
  if (diffH < 48) return "ontem";
  if (diffH < 24 * 7) return `há ${Math.floor(diffH / 24)} dias`;
  if (diffH < 24 * 30) return `há ${Math.floor(diffH / 24 / 7)} semana${Math.floor(diffH / 24 / 7) === 1 ? "" : "s"}`;
  return d.toLocaleDateString("pt-BR");
}

interface Props {
  companyName: string;
  userName: string | null;
}

type FilterKey = "todos" | "ativos" | "pendentes" | "inativos";
type RoleKey = "leitor" | "gerente" | "admin";

const ROLE_CARDS: { key: RoleKey; title: string; desc: string }[] = [
  { key: "leitor", title: "Leitor", desc: "Acesso aos livros. Sem admin." },
  { key: "gerente", title: "Gerente", desc: "Leitor + convida/remove colegas." },
  { key: "admin", title: "Administrador", desc: "Controle total, inclusive plano." },
];

const AVATAR_PALETTE = [38, 280, 0, 210, 140, 60, 160, 340];

function statusOf(emp: Employee): FilterKey {
  if (!emp.isActive) return "inativos";
  if (!emp.user?.lastLoginAt) return "pendentes";
  return "ativos";
}

function statusPillClass(s: FilterKey): string {
  if (s === "ativos") return "ativo";
  if (s === "pendentes") return "pendente";
  return "inativo";
}

function lastAccessLabel(dt: string | null | undefined): string {
  if (!dt) return "—";
  const d = new Date(dt);
  const diffH = (Date.now() - d.getTime()) / (1000 * 60 * 60);
  if (diffH < 24) return "hoje";
  if (diffH < 48) return "ontem";
  if (diffH < 24 * 7) return `${Math.floor(diffH / 24)} dias`;
  if (diffH < 24 * 30) return `${Math.floor(diffH / 24 / 7)} semanas`;
  return d.toLocaleDateString("pt-BR");
}

export default function EquipeClient({ companyName, userName }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState<FilterKey>("todos");
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ fullName: "", corporateEmail: "", role: "gerente" as RoleKey });
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [inviteMode, setInviteMode] = useState<InviteMode>("single");
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("pl-invite-mode") as InviteMode | null;
    if (saved) setInviteMode(saved);
  }, []);

  function changeInviteMode(mode: InviteMode) {
    setInviteMode(mode);
    localStorage.setItem("pl-invite-mode", mode);
    setWizardStep(1);
  }

  function openInvite() {
    setInviteData({ fullName: "", corporateEmail: "", role: "gerente" });
    setWizardStep(1);
    setInviteOpen(true);
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    setLoading(true);
    try {
      const res = await fetch("/api/employees");
      if (res.ok) setEmployees(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: inviteData.fullName,
        corporateEmail: inviteData.corporateEmail,
        role:
          inviteData.role === "admin"
            ? "Administrador"
            : inviteData.role === "gerente"
              ? "Gerente"
              : "Leitor",
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.tempPassword) setTempPassword(data.tempPassword);
      setInviteOpen(false);
      setInviteData({ fullName: "", corporateEmail: "", role: "gerente" });
      fetchEmployees();
      setToast(`Convite enviado para ${inviteData.corporateEmail} ✓`);
    } else {
      const err = await res.json();
      setToast(err.error || "Erro ao enviar convite");
    }
  }

  async function handleResetPwd(id: string) {
    const res = await fetch(`/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetPassword: true }),
    });
    const data = await res.json();
    if (res.ok && data.tempPassword) {
      setTempPassword(data.tempPassword);
      setToast("Senha redefinida ✓");
    } else {
      setToast(data.error || "Erro ao redefinir senha");
    }
  }

  async function handleToggleActive(id: string, currentlyActive: boolean) {
    if (currentlyActive && !confirm("Desativar este funcionário?")) return;
    const res = await fetch(`/api/employees/${id}`, {
      method: currentlyActive ? "DELETE" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: currentlyActive ? undefined : JSON.stringify({ isActive: true }),
    });
    if (res.ok) {
      fetchEmployees();
      setToast(currentlyActive ? "Acesso removido ✓" : "Funcionário reativado ✓");
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/employees/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: editing.fullName,
        corporateEmail: editing.corporateEmail,
        role: editing.role,
        department: editing.department,
      }),
    });
    if (res.ok) {
      setEditing(null);
      fetchEmployees();
      setToast("Funcionário atualizado ✓");
    } else {
      const err = await res.json();
      setToast(err.error || "Erro ao salvar");
    }
  }

  // Counts
  const counts = useMemo(
    () => ({
      todos: employees.length,
      ativos: employees.filter((e) => statusOf(e) === "ativos").length,
      pendentes: employees.filter((e) => statusOf(e) === "pendentes").length,
      inativos: employees.filter((e) => statusOf(e) === "inativos").length,
    }),
    [employees],
  );

  // Filter + search
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((e) => {
      if (filter !== "todos" && statusOf(e) !== filter) return false;
      if (q && !e.fullName.toLowerCase().includes(q) && !e.corporateEmail.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [employees, filter, search]);

  const LIMIT_LICENCAS = 10;
  const usedLicenses = counts.ativos + counts.pendentes;
  const licPct = Math.min(100, (usedLicenses / LIMIT_LICENCAS) * 100);
  const availableLicenses = Math.max(0, LIMIT_LICENCAS - usedLicenses);

  // #8 Activity timeline derived from employees
  const activityEntries: ActivityEntry[] = useMemo(() => {
    const entries: ActivityEntry[] = [];
    const adminName = userName ?? "Admin";
    employees.forEach((emp) => {
      const created = new Date(emp.createdAt);
      entries.push({
        id: `${emp.id}-inv`,
        tipo: "convite",
        when: created,
        text: (
          <>
            <strong>{adminName}</strong> convidou <strong>{emp.fullName}</strong>
            {emp.role ? <> como {emp.role}.</> : "."}
          </>
        ),
      });
      if (emp.user?.lastLoginAt) {
        const accepted = new Date(emp.user.lastLoginAt);
        entries.push({
          id: `${emp.id}-accept`,
          tipo: "aceite",
          when: accepted,
          text: (
            <>
              <strong>{emp.fullName}</strong> aceitou o convite.
            </>
          ),
        });
      }
      if (!emp.isActive && emp.updatedAt) {
        const rem = new Date(emp.updatedAt);
        entries.push({
          id: `${emp.id}-off`,
          tipo: "remover",
          when: rem,
          text: (
            <>
              <strong>{adminName}</strong> desativou <strong>{emp.fullName}</strong>.
            </>
          ),
        });
      }
    });
    return entries.sort((a, b) => b.when.getTime() - a.when.getTime()).slice(0, 8);
  }, [employees, userName]);

  return (
    <div className="console" style={{ background: "var(--paper)", color: "var(--ink)" }}>
      {/* Sidebar */}
      <aside className="console-side">
        <Logo href="/vitrine" className="logo" size="sm" style={{ marginBottom: 20 }} />
        <div className="side-lbl">Leitura</div>
        <Link href="/vitrine">📚 Catálogo</Link>
        <div className="side-lbl">Administração</div>
        <Link href="/minha-conta/equipe" className="active">👥 Equipe</Link>
        <Link href="/minha-conta">⚙ Minha conta</Link>
        <div className="side-foot">
          <strong style={{ color: "var(--paper)", fontWeight: 500 }}>{companyName}</strong>
          <br />
          Admin: {userName}
        </div>
      </aside>

      {/* Main */}
      <main className="console-main">
        <div className="console-top">
          <div>
            <div className="tag gold-text">Administração</div>
            <h1>Equipe</h1>
            <p>Convide funcionários, atribua papéis e gerencie quem tem acesso aos livros.</p>
          </div>
          <button className="btn btn--ink" onClick={openInvite}>
            + Convidar pessoa
          </button>
        </div>

        {/* Temp password banner */}
        {tempPassword && (
          <div
            className="card-block"
            style={{ background: "oklch(0.95 0.05 120)", borderColor: "oklch(0.7 0.15 120)" }}
          >
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Senha temporária gerada</div>
            <div style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: 2 }}>{tempPassword}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
              Anote e forneça ao funcionário. Esta senha não será exibida novamente.
            </div>
            <button
              className="btn btn--ghost btn--sm"
              style={{ marginTop: 12, color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
              onClick={() => setTempPassword(null)}
            >
              Fechar
            </button>
          </div>
        )}

        {/* Licenças */}
        <div className="card-block">
          <div
            className="flex-between"
            style={{ alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 8 }}
          >
            <div>
              <div className="tag">Licenças do plano</div>
              <div
                style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 500, lineHeight: 1, marginTop: 4 }}
              >
                <span>{usedLicenses}</span>{" "}
                <span style={{ color: "var(--muted)", fontSize: 18 }}>
                  de {LIMIT_LICENCAS} em uso
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                {counts.ativos} ativos, {counts.pendentes} pendente{counts.pendentes === 1 ? "" : "s"}, {availableLicenses} vaga{availableLicenses === 1 ? "" : "s"} disponível{availableLicenses === 1 ? "" : "eis"}.
              </div>
            </div>
            <Link
              href="/#planos"
              className="btn btn--ghost btn--sm"
              style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
            >
              Aumentar licenças →
            </Link>
          </div>
          <div className="license-bar">
            <div className="license-bar-fill" style={{ width: `${licPct}%` }} />
          </div>
          <div className="flex" style={{ gap: 14, fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
            <span>
              <span
                style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "var(--gold)", marginRight: 4 }}
              />
              em uso ({usedLicenses})
            </span>
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: "oklch(0.94 0.015 85)",
                  marginRight: 4,
                  border: "1px solid var(--line-ink)",
                }}
              />
              disponíveis ({availableLicenses})
            </span>
          </div>
        </div>

        {/* Tabela */}
        <div className="card-block" style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "18px 20px",
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              borderBottom: "1px solid var(--line-ink)",
            }}
          >
            <div
              className="flex"
              style={{
                background: "rgba(0,0,0,0.03)",
                padding: "7px 12px",
                borderRadius: 999,
                flex: 1,
                minWidth: 200,
                maxWidth: 320,
              }}
            >
              <span style={{ opacity: 0.4 }}>🔍</span>
              <input
                placeholder="buscar por nome ou e-mail"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "transparent",
                  border: 0,
                  outline: "none",
                  fontFamily: "inherit",
                  fontSize: 13,
                  flex: 1,
                  color: "inherit",
                }}
              />
            </div>
            <div className="flex" style={{ gap: 6, flexWrap: "wrap" }}>
              {(["todos", "ativos", "pendentes", "inativos"] as const).map((key) => (
                <button
                  key={key}
                  className="icon-btn-ink"
                  onClick={() => setFilter(key)}
                  style={
                    filter === key
                      ? {
                          borderColor: "var(--ink)",
                          background: "var(--ink)",
                          color: "var(--paper)",
                          opacity: 1,
                        }
                      : undefined
                  }
                >
                  {key[0].toUpperCase() + key.slice(1)} · {counts[key]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="table" style={{ minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: 20 }}>Pessoa</th>
                  <th>Papel</th>
                  <th>Status</th>
                  <th>Último acesso</th>
                  <th style={{ paddingRight: 20 }}></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px 20px", textAlign: "center", color: "var(--muted)" }}>
                      Carregando…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px 20px", textAlign: "center", color: "var(--muted)" }}>
                      {employees.length === 0 ? "Nenhum funcionário cadastrado ainda." : "Nenhum resultado para este filtro."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp, i) => {
                    const status = statusOf(emp);
                    const hue = AVATAR_PALETTE[i % AVATAR_PALETTE.length];
                    return (
                      <tr key={emp.id}>
                        <td style={{ paddingLeft: 20 }}>
                          <div className="flex">
                            <div
                              className="avatar"
                              style={{
                                background: `linear-gradient(150deg,oklch(0.6 0.12 ${hue}),oklch(0.4 0.1 ${hue}))`,
                              }}
                            >
                              {initials(emp.fullName)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 500 }}>{emp.fullName}</div>
                              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{emp.corporateEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td>{emp.role ?? "—"}</td>
                        <td>
                          <span className={`status-pill ${statusPillClass(status)}`}>
                            {status === "ativos" ? "ativo" : status === "pendentes" ? "pendente" : "inativo"}
                          </span>
                        </td>
                        <td style={{ color: "var(--muted)", fontSize: 12 }}>
                          {lastAccessLabel(emp.user?.lastLoginAt ?? null)}
                        </td>
                        <td style={{ paddingRight: 20 }}>
                          <div className="tr-actions">
                            {status === "pendentes" && (
                              <button className="icon-btn-ink" onClick={() => handleResetPwd(emp.id)}>
                                Reenviar
                              </button>
                            )}
                            <button className="icon-btn-ink" onClick={() => setEditing(emp)}>
                              Editar
                            </button>
                            <button
                              className={`icon-btn-ink${emp.isActive ? " danger" : ""}`}
                              onClick={() => handleToggleActive(emp.id, emp.isActive)}
                            >
                              {emp.isActive ? "Remover" : "Reativar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Atividade recente */}
        <div className="card-block">
          <h3>Atividade recente</h3>
          <div className="card-sub">Últimas ações na gestão de equipe.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {activityEntries.length === 0 ? (
              <div style={{ padding: "10px 0", fontSize: 12.5, color: "var(--muted)" }}>
                Nada por aqui ainda.
              </div>
            ) : (
              activityEntries.map((a) => (
                <div
                  key={a.id}
                  className="flex-between"
                  style={{ padding: "10px 0", borderTop: "1px solid var(--line-ink)", fontSize: 12.5, gap: 10 }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 0, flexWrap: "wrap" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        width: 22,
                        height: 22,
                        borderRadius: 999,
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        flexShrink: 0,
                        background:
                          a.tipo === "convite"
                            ? "oklch(0.95 0.06 85)"
                            : a.tipo === "aceite"
                              ? "oklch(0.95 0.06 150)"
                              : "oklch(0.94 0.06 25)",
                        color:
                          a.tipo === "convite"
                            ? "oklch(0.45 0.15 70)"
                            : a.tipo === "aceite"
                              ? "oklch(0.4 0.14 150)"
                              : "oklch(0.5 0.18 25)",
                      }}
                    >
                      {a.tipo === "convite" ? "✉" : a.tipo === "aceite" ? "✓" : "✕"}
                    </span>
                    <div>{a.text}</div>
                  </div>
                  <span style={{ color: "var(--muted)", fontSize: 11, flexShrink: 0 }}>
                    {relativeTime(a.when)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal convidar */}
      {inviteOpen && (
        <div
          className="modal-backdrop open"
          onClick={(e) => { if (e.target === e.currentTarget) setInviteOpen(false); }}
        >
          <div className="modal" style={{ background: "#fff", color: "var(--ink)", borderColor: "var(--line-ink)" }}>
            <button className="modal-close" onClick={() => setInviteOpen(false)} style={{ color: "var(--ink)" }}>
              ✕
            </button>

            <div className="flex-between" style={{ marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
              <span className="tag gold-text">Convidar pessoa</span>
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  background: "rgba(0,0,0,0.04)",
                  padding: 3,
                  borderRadius: 999,
                  fontSize: 11,
                }}
              >
                <button
                  type="button"
                  onClick={() => changeInviteMode("single")}
                  style={{
                    padding: "5px 11px",
                    borderRadius: 999,
                    border: 0,
                    background: inviteMode === "single" ? "var(--ink)" : "transparent",
                    color: inviteMode === "single" ? "var(--paper)" : "var(--muted)",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Form único
                </button>
                <button
                  type="button"
                  onClick={() => changeInviteMode("wizard")}
                  style={{
                    padding: "5px 11px",
                    borderRadius: 999,
                    border: 0,
                    background: inviteMode === "wizard" ? "var(--ink)" : "transparent",
                    color: inviteMode === "wizard" ? "var(--paper)" : "var(--muted)",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Wizard
                </button>
              </div>
            </div>

            {inviteMode === "wizard" && (
              <div className="steps" style={{ marginBottom: 10 }}>
                <div className={`step-dot${wizardStep >= 1 ? (wizardStep > 1 ? " done" : " on") : ""}`} />
                <div className={`step-dot${wizardStep >= 2 ? " on" : ""}`} />
                <span className="steps-label">passo {wizardStep} de 2</span>
              </div>
            )}

            <h3 style={{ color: "var(--ink)" }}>
              {inviteMode === "wizard" && wizardStep === 2
                ? "Defina o papel"
                : "Convide alguém da sua equipe"}
            </h3>
            <p className="sub" style={{ color: "var(--muted)" }}>
              {inviteMode === "wizard" && wizardStep === 2
                ? "Cada papel tem permissões diferentes. Você pode mudar depois."
                : "A pessoa vai receber um e-mail com link para criar a senha."}
            </p>

            <form onSubmit={(e) => {
              if (inviteMode === "wizard" && wizardStep === 1) {
                e.preventDefault();
                if (!inviteData.fullName || !inviteData.corporateEmail) return;
                setWizardStep(2);
                return;
              }
              handleInviteSubmit(e);
            }}>
              {/* Step 1 fields OR single-form fields */}
              {(inviteMode === "single" || wizardStep === 1) && (
                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}
                >
                  <div>
                    <label className="label">Nome completo</label>
                    <input
                      className="input"
                      required
                      placeholder="Rafael Moura"
                      value={inviteData.fullName}
                      onChange={(e) => setInviteData({ ...inviteData, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">E-mail corporativo</label>
                    <input
                      className="input"
                      required
                      type="email"
                      placeholder="rafael@empresa.com.br"
                      value={inviteData.corporateEmail}
                      onChange={(e) => setInviteData({ ...inviteData, corporateEmail: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Step 2 fields OR single-form role */}
              {(inviteMode === "single" || wizardStep === 2) && (
                <>
                  {inviteMode === "wizard" && (
                    <div
                      style={{
                        background: "rgba(0,0,0,0.03)",
                        borderRadius: 8,
                        padding: "10px 12px",
                        marginBottom: 10,
                        fontSize: 12.5,
                      }}
                    >
                      <span className="tag" style={{ marginRight: 6 }}>Para:</span>
                      <strong>{inviteData.fullName}</strong>
                      <span style={{ color: "var(--muted)" }}> · {inviteData.corporateEmail}</span>
                    </div>
                  )}
                  <div className="field">
                    <label className="label">Papel</label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      {ROLE_CARDS.map((r) => (
                        <button
                          type="button"
                          key={r.key}
                          onClick={() => setInviteData({ ...inviteData, role: r.key })}
                          className={`role-card${inviteData.role === r.key ? " selected" : ""}`}
                        >
                          <div className="role-t">{r.title}</div>
                          <div className="role-s">{r.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="alert alert--info" style={{ margin: "18px 0 8px" }}>
                    <span className="alert-icon">i</span>
                    <div>
                      <div className="alert-title">Vai ocupar 1 licença do plano</div>
                      <div className="alert-msg">
                        Restam {availableLicenses} vaga{availableLicenses === 1 ? "" : "s"} no plano atual.
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex-between" style={{ marginTop: 14, gap: 10 }}>
                <button
                  type="button"
                  className="btn btn--ghost"
                  style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
                  onClick={() => {
                    if (inviteMode === "wizard" && wizardStep === 2) setWizardStep(1);
                    else setInviteOpen(false);
                  }}
                >
                  {inviteMode === "wizard" && wizardStep === 2 ? "← voltar" : "Cancelar"}
                </button>
                <button type="submit" className="btn btn--ink">
                  {inviteMode === "wizard" && wizardStep === 1 ? "Próximo →" : "Enviar convite →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal editar */}
      {editing && (
        <div
          className="modal-backdrop open"
          onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}
        >
          <div className="modal" style={{ background: "#fff", color: "var(--ink)", borderColor: "var(--line-ink)" }}>
            <button className="modal-close" onClick={() => setEditing(null)} style={{ color: "var(--ink)" }}>
              ✕
            </button>
            <span className="tag gold-text">Editar</span>
            <h3 style={{ color: "var(--ink)" }}>{editing.fullName}</h3>

            <form onSubmit={handleEditSubmit}>
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}
              >
                <div>
                  <label className="label">Nome completo</label>
                  <input
                    className="input"
                    required
                    value={editing.fullName}
                    onChange={(e) => setEditing({ ...editing, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">E-mail corporativo</label>
                  <input
                    className="input"
                    required
                    type="email"
                    value={editing.corporateEmail}
                    onChange={(e) => setEditing({ ...editing, corporateEmail: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Cargo</label>
                  <input
                    className="input"
                    value={editing.role ?? ""}
                    onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Departamento</label>
                  <input
                    className="input"
                    value={editing.department ?? ""}
                    onChange={(e) => setEditing({ ...editing, department: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex-between" style={{ marginTop: 18, gap: 10 }}>
                <button
                  type="button"
                  className="btn btn--ghost"
                  style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn--ink">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast("")} />}

      <style>{`
        .role-card{border:1px solid var(--line-ink);border-radius:10px;padding:11px 12px;cursor:pointer;transition:border-color .15s,background .15s;background:transparent;text-align:left;font-family:inherit;color:inherit;width:100%}
        .role-card:hover{border-color:var(--ink)}
        .role-card.selected{border-color:var(--ink);background:var(--ink);color:var(--paper)}
        .role-t{font-weight:600;font-size:13px}
        .role-s{font-size:11px;color:var(--muted);margin-top:3px}
        .role-card.selected .role-s{color:rgba(247,245,240,0.65)}
      `}</style>
    </div>
  );
}
