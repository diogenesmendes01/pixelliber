"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Toast from "@/components/Toast";

type Employee = {
  id: string;
  fullName: string;
  corporateEmail: string;
  role: string | null;
  department: string | null;
  isActive: boolean;
  createdAt: string;
  user: { lastLoginAt: string | null; isActive: boolean } | null;
};

interface Props {
  companyName: string;
  userName: string | null;
}


export default function EquipeClient({ companyName, userName }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [formData, setFormData] = useState({
    fullName: "", corporateEmail: "", role: "", department: "", initialPassword: "",
  });
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  useEffect(() => { fetchEmployees(); }, []);

  async function fetchEmployees() {
    setLoading(true);
    try {
      const res = await fetch("/api/employees");
      if (res.ok) setEmployees(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isEdit = !!editingId;
    const body: Record<string, unknown> = {
      fullName: formData.fullName,
      corporateEmail: formData.corporateEmail,
      role: formData.role || null,
      department: formData.department || null,
    };
    if (!isEdit && formData.initialPassword) body.initialPassword = formData.initialPassword;

    const res = await fetch(isEdit ? `/api/employees/${editingId}` : "/api/employees", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.tempPassword) setTempPassword(data.tempPassword);
      resetForm();
      fetchEmployees();
      setToast(isEdit ? "Funcionário atualizado ✓" : "Funcionário adicionado ✓");
    } else {
      const err = await res.json();
      setToast(err.error || "Erro ao salvar");
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

  async function handleDelete(id: string) {
    if (!confirm("Desativar este funcionário?")) return;
    const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
    if (res.ok) { fetchEmployees(); setToast("Funcionário desativado ✓"); }
  }

  function startEdit(emp: Employee) {
    setEditingId(emp.id);
    setFormData({ fullName: emp.fullName, corporateEmail: emp.corporateEmail, role: emp.role ?? "", department: emp.department ?? "", initialPassword: "" });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ fullName: "", corporateEmail: "", role: "", department: "", initialPassword: "" });
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
        <div className="side-lbl">Administração</div>
        <Link href="/minha-conta/equipe" className="active">👥 Equipe</Link>
        <Link href="/minha-conta">⚙ Minha conta</Link>
        <button className="console-link" onClick={() => setToast("Plano & fatura estará disponível em breve.")}>💳 Plano &amp; fatura</button>
        <button className="console-link" onClick={() => setToast("Uso e relatórios estará disponível em breve.")}>📊 Uso e relatórios</button>
        <div className="side-foot">
          <strong style={{ color: "var(--paper)", fontWeight: 500 }}>{companyName}</strong>
          <br />
          {userName}
        </div>
      </aside>

      {/* Main */}
      <main className="console-main">
        <div className="console-top">
          <div>
            <div className="tag gold-text">Administração</div>
            <h1>Equipe</h1>
            <p>Gerencie os membros da sua equipe.</p>
          </div>
          {!showForm && (
            <button className="btn btn--ink btn--sm" onClick={() => setShowForm(true)}>
              + Adicionar funcionário
            </button>
          )}
        </div>

        {/* Temp password banner */}
        {tempPassword && (
          <div className="card-block" style={{ background: "oklch(0.95 0.05 120)", borderColor: "oklch(0.7 0.15 120)" }}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Senha temporária gerada</div>
            <div style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: 2 }}>{tempPassword}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Anote e forneça ao funcionário. Esta senha não será exibida novamente.</div>
            <button className="btn btn--ghost btn--sm" style={{ marginTop: 12 }} onClick={() => setTempPassword(null)}>Fechar</button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card-block">
            <h3>{editingId ? "Editar funcionário" : "Novo funcionário"}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 16 }}>
                <div>
                  <label className="label">Nome completo *</label>
                  <input className="input" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                </div>
                <div>
                  <label className="label">E-mail corporativo *</label>
                  <input className="input" type="email" required value={formData.corporateEmail} onChange={(e) => setFormData({ ...formData, corporateEmail: e.target.value })} />
                </div>
                <div>
                  <label className="label">Cargo</label>
                  <input className="input" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                </div>
                <div>
                  <label className="label">Departamento</label>
                  <input className="input" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                </div>
                {!editingId && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="label">Senha inicial (deixe em branco para gerar automaticamente)</label>
                    <input className="input" value={formData.initialPassword} onChange={(e) => setFormData({ ...formData, initialPassword: e.target.value })} style={{ maxWidth: 300 }} />
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" className="btn btn--ink btn--sm">{editingId ? "Salvar" : "Adicionar"}</button>
                <button type="button" className="btn btn--ghost btn--sm" style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }} onClick={resetForm}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* Employees List */}
        <div className="card-block">
          <h3>Membros ({employees.filter((e) => e.isActive).length} ativos)</h3>
          {loading ? (
            <div style={{ padding: "20px 0", color: "var(--muted)" }}>Carregando…</div>
          ) : employees.length === 0 ? (
            <div style={{ padding: "20px 0", color: "var(--muted)" }}>Nenhum funcionário cadastrado.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex-between"
                  style={{
                    padding: "14px 0",
                    borderTop: "1px solid var(--line-ink)",
                    flexWrap: "wrap",
                    gap: 12,
                    opacity: emp.isActive ? 1 : 0.5,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{emp.fullName}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                      {emp.corporateEmail}
                      {emp.role && ` · ${emp.role}`}
                      {emp.department && ` · ${emp.department}`}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
                      Último acesso: {emp.user?.lastLoginAt ? new Date(emp.user.lastLoginAt).toLocaleDateString("pt-BR") : "Nunca"}
                      {!emp.isActive && <span style={{ color: "oklch(0.55 0.18 25)", marginLeft: 8 }}>● Inativo</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn--ghost btn--sm" style={{ fontSize: 12, color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }} onClick={() => startEdit(emp)}>Editar</button>
                    <button className="btn btn--ghost btn--sm" style={{ fontSize: 12, color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }} onClick={() => handleResetPwd(emp.id)}>Resetar senha</button>
                    {emp.isActive && (
                      <button className="icon-btn-ink danger" style={{ fontSize: 12 }} onClick={() => handleDelete(emp.id)}>Desativar</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
    </div>
  );
}
