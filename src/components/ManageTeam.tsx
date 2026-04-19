"use client";

import { useState, useEffect } from "react";

type Employee = {
  id: string;
  fullName: string;
  corporateEmail: string;
  role: string | null;
  department: string | null;
  isActive: boolean;
  createdAt: string;
  user: {
    lastLoginAt: string | null;
    isActive: boolean;
  } | null;
};

export default function ManageTeam() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    corporateEmail: "",
    role: "",
    department: "",
    initialPassword: "",
  });
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [resetPwdFor, setResetPwdFor] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isEdit = !!editingId;

    const body: any = {
      fullName: formData.fullName,
      corporateEmail: formData.corporateEmail,
      role: formData.role || null,
      department: formData.department || null,
    };

    if (isEdit && resetPwdFor) body.resetPassword = true;
    if (!isEdit && formData.initialPassword) body.initialPassword = formData.initialPassword;

    const res = await fetch(isEdit ? `/api/employees/${editingId}` : "/api/employees", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.tempPassword) setTempPassword(data.tempPassword);
      if (isEdit && resetPwdFor) {
        setTempPassword(data.tempPassword);
        setResetPwdFor(null);
      }
      resetForm();
      fetchEmployees();
      showMessage("success", isEdit ? "Funcionário atualizado!" : "Funcionário adicionado!");
    } else {
      const err = await res.json();
      showMessage("error", err.error || "Erro ao salvar");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Desativar este funcionário?")) return;
    const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchEmployees();
      showMessage("success", "Funcionário desativado!");
    }
  }

  function startEdit(emp: Employee) {
    setEditingId(emp.id);
    setFormData({
      fullName: emp.fullName,
      corporateEmail: emp.corporateEmail,
      role: emp.role || "",
      department: emp.department || "",
      initialPassword: "",
    });
    setShowForm(true);
    setResetPwdFor(null);
  }

  function startResetPwd(emp: Employee) {
    const newPassword = crypto.randomUUID().slice(0, 8);
    fetch(`/api/employees/${emp.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetPassword: true }),
    }).then((res) => res.json().then((data) => {
      if (data.tempPassword) setTempPassword(data.tempPassword);
    }));
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData({ fullName: "", corporateEmail: "", role: "", department: "", initialPassword: "" });
    setResetPwdFor(null);
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Gerenciar Equipe</h3>
        {!showForm && (
          <button className="btn-blue text-sm" onClick={() => setShowForm(true)}>
            + Adicionar Funcionário
          </button>
        )}
      </div>

      {message && (
        <div className={`p-3 rounded mb-4 text-sm ${message.type === "success" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}>
          {message.text}
          {tempPassword && message.type === "success" && (
            <div className="mt-2 p-2 bg-black/30 rounded">
              Senha temporária: <strong>{tempPassword}</strong> — anote e forneça ao funcionário.
              <button className="ml-2 underline text-xs" onClick={() => setTempPassword(null)}>Fechar</button>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Nome completo *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">E-mail corporativo *</label>
              <input
                type="email"
                required
                value={formData.corporateEmail}
                onChange={(e) => setFormData({ ...formData, corporateEmail: e.target.value })}
                className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Cargo</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Departamento</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500"
              />
            </div>
          </div>
          {!editingId && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Senha inicial (deixe em branco para gerar automaticamente)</label>
              <input
                type="text"
                value={formData.initialPassword}
                onChange={(e) => setFormData({ ...formData, initialPassword: e.target.value })}
                className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-500"
              />
            </div>
          )}
          {editingId && (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => setResetPwdFor(e.target.checked ? editingId : null)}
                />
                Redefinir senha
              </label>
            </div>
          )}
          <div className="flex gap-3">
            <button type="submit" className="btn-blue text-sm">
              {editingId ? "Salvar Alterações" : "Adicionar"}
            </button>
            <button type="button" className="btn-gray text-sm" onClick={resetForm}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Carregando...</p>
      ) : employees.length === 0 ? (
        <p className="text-gray-400">Nenhum funcionário cadastrado.</p>
      ) : (
        <div className="space-y-3">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className={`p-4 rounded-lg border ${
                emp.isActive ? "border-white/10 bg-white/5" : "border-white/5 bg-white/2 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white">{emp.fullName}</p>
                  <p className="text-sm text-gray-400">{emp.corporateEmail}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {emp.role && <span className="mr-3">📋 {emp.role}</span>}
                    {emp.department && <span>🏢 {emp.department}</span>}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Último login: {emp.user?.lastLoginAt ? new Date(emp.user.lastLoginAt).toLocaleDateString("pt-BR") : "Nunca"}
                    {!emp.isActive && <span className="ml-3 text-red-400">● Inativo</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(emp)}
                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => startResetPwd(emp)}
                    className="text-xs text-yellow-400 hover:text-yellow-300 underline"
                  >
                    Resetar Senha
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="text-xs text-red-400 hover:text-red-300 underline"
                  >
                    Desativar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
