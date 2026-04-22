"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Toast from "@/components/Toast";
import Logo from "@/components/Logo";
import { parseTags, initials } from "@/lib/utils";
import { PLANS } from "@/lib/books-data";

interface User {
  name: string | null;
  email: string | null;
  role: string;
  company: {
    id: string;
    name: string;
    cnpj: string;
    statusAssinatura: string | null;
  } | null;
}

interface Employee {
  id: string;
  fullName: string;
  corporateEmail: string;
  role: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
}

interface Ebook {
  id: string;
  titulo: string;
  autor: string | null;
  categoria: string | null;
  tags: string | null;
  contadorDownloads: number;
}

interface HistoryEntry {
  ebookId: string;
  ebookTitulo: string;
  ebookCategoria: string | null;
  ebookTags: string | null;
  userId: string;
  userName: string | null;
  progressPct: number;
  lastReadAt: string;
}

interface Props {
  user: User;
  employees: Employee[];
  ebooks: Ebook[];
  historyCount: number;
  historyEntries: HistoryEntry[];
}

type TabKey = "dashboard" | "plano" | "relatorios" | "acesso";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "plano", label: "Plano & fatura", icon: "💳" },
  { key: "relatorios", label: "Relatórios", icon: "📈" },
  { key: "acesso", label: "Acesso & SSO", icon: "🔐" },
];

// Mock invoice history
const MOCK_INVOICES = [
  { data: "10/jul/2025", valor: 299, num: "INV-0208" },
  { data: "10/jun/2025", valor: 299, num: "INV-0184" },
  { data: "10/mai/2025", valor: 299, num: "INV-0161" },
  { data: "10/abr/2025", valor: 299, num: "INV-0139" },
  { data: "10/mar/2025", valor: 149, num: "INV-0118" },
];

export default function AdminClient({ user, employees, ebooks, historyCount, historyEntries }: Props) {
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [toast, setToast] = useState("");
  const [ssoGoogle, setSsoGoogle] = useState(false);
  const [ssoMicrosoft, setSsoMicrosoft] = useState(false);
  const [pwRules, setPwRules] = useState({ min8: true, upper: true, number: true, special: false });
  const [selectedPlan, setSelectedPlan] = useState<string>("standard");

  // ============ COMPUTED METRICS ============
  const activeEmployees = employees.filter((e) => e.isActive && e.lastLoginAt).length;
  const pendingEmployees = employees.filter((e) => e.isActive && !e.lastLoginAt).length;
  const totalReaders = employees.filter((e) => e.isActive).length + 1; // +1 admin
  const avgMinutes = 42;
  const completedBooks = historyEntries.filter((h) => h.progressPct >= 95).length;
  const inProgressBooks = historyEntries.filter((h) => h.progressPct > 0 && h.progressPct < 95).length;

  // Top 5 books by download count
  const topBooks = useMemo(() => ebooks.slice(0, 5), [ebooks]);

  // Top 5 readers by entries count
  const topReaders = useMemo(() => {
    const counts = new Map<string, { name: string; count: number; completed: number }>();
    historyEntries.forEach((h) => {
      const cur = counts.get(h.userId) ?? { name: h.userName ?? "—", count: 0, completed: 0 };
      cur.count += 1;
      if (h.progressPct >= 95) cur.completed += 1;
      counts.set(h.userId, cur);
    });
    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [historyEntries]);

  // Categories distribution
  const categoriesDist = useMemo(() => {
    const map = new Map<string, number>();
    historyEntries.forEach((h) => {
      const cat = h.ebookCategoria ?? "Geral";
      map.set(cat, (map.get(cat) ?? 0) + 1);
    });
    const total = [...map.values()].reduce((a, b) => a + b, 0) || 1;
    return Array.from(map.entries())
      .map(([cat, n]) => ({ cat, n, pct: (n / total) * 100 }))
      .sort((a, b) => b.n - a.n);
  }, [historyEntries]);

  // Daily activity (30-day mock)
  const dailyActivity = useMemo(() => {
    const base = [3, 6, 8, 12, 9, 4, 2, 5, 10, 14, 11, 15, 7, 3, 8, 12, 18, 22, 16, 9, 5, 10, 14, 20, 24, 19, 11, 7, 12, 16];
    return base;
  }, []);

  return (
    <div className="console" style={{ background: "var(--paper)", color: "var(--ink)" }}>
      {/* Sidebar */}
      <aside className="console-side">
        <Logo href="/vitrine" className="logo" size="sm" style={{ marginBottom: 20 }} />
        <div className="side-lbl">Leitura</div>
        <Link href="/vitrine">📚 Catálogo</Link>
        <div className="side-lbl">Administração</div>
        <Link href="/minha-conta/equipe">👥 Equipe</Link>
        <Link href="/minha-conta">⚙ Minha conta</Link>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={tab === t.key ? "active" : ""}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 8,
              fontSize: 13,
              opacity: tab === t.key ? 1 : 0.75,
              background: tab === t.key ? "rgba(247,245,240,0.08)" : "transparent",
              color: tab === t.key ? "var(--gold)" : "inherit",
              border: 0,
              fontFamily: "inherit",
              textAlign: "left",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
        <div className="side-foot">
          <strong style={{ color: "var(--paper)", fontWeight: 500 }}>{user.company?.name}</strong>
          <br />
          CNPJ {user.company?.cnpj}
          <br />
          Admin: {user.name}
        </div>
      </aside>

      {/* Main */}
      <main className="console-main">
        <div className="console-top">
          <div>
            <div className="tag gold-text">Administração</div>
            <h1>{TABS.find((t) => t.key === tab)?.label}</h1>
            <p>
              {tab === "dashboard" && "Métricas e atividade do acervo da sua empresa."}
              {tab === "plano" && "Plano atual, histórico de faturas e mudanças de assinatura."}
              {tab === "relatorios" && "Top livros, categorias e exportações."}
              {tab === "acesso" && "SSO, política de senha e sessões ativas."}
            </p>
          </div>
          <Link
            href="/vitrine"
            className="btn btn--ghost btn--sm"
            style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
          >
            ← voltar pro catálogo
          </Link>
        </div>

        {/* ============ DASHBOARD ============ */}
        {tab === "dashboard" && (
          <div>
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-label">Licenças em uso</div>
                <div className="stat-value">
                  {activeEmployees + pendingEmployees + 1}
                  <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 400 }}> /10</span>
                </div>
                <div className="stat-trend up">
                  {pendingEmployees} pendente{pendingEmployees === 1 ? "" : "s"}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Leitores ativos</div>
                <div className="stat-value">{totalReaders}</div>
                <div className="stat-trend up">↑ 3 esta semana</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Horas lidas (30d)</div>
                <div className="stat-value">{avgMinutes}h</div>
                <div className="stat-trend up">↑ 18% vs mês anterior</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Livros concluídos</div>
                <div className="stat-value">{completedBooks || 4}</div>
                <div className="stat-trend">
                  +{inProgressBooks || 11} em andamento
                </div>
              </div>
            </div>

            <div className="dash-grid-2">
              <div className="dash-card">
                <div className="flex-between" style={{ marginBottom: 14 }}>
                  <h3>Atividade diária</h3>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>últimos 30 dias</span>
                </div>
                <div className="bar-chart">
                  {dailyActivity.map((v, i) => (
                    <div
                      key={i}
                      className="bar"
                      style={{ height: `${(v / Math.max(...dailyActivity)) * 100}%` }}
                      title={`${v} min`}
                    />
                  ))}
                </div>
                <div className="chart-legend">
                  <span>-30d</span>
                  <span>-15d</span>
                  <span>hoje</span>
                </div>
              </div>

              <div className="dash-card">
                <h3>Top leitores</h3>
                {topReaders.length === 0 ? (
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>Sem leituras ainda.</p>
                ) : (
                  topReaders.map((r, i) => (
                    <div key={i} className="rank-item">
                      <span className="rank-num">#{i + 1}</span>
                      <div
                        className="avatar"
                        style={{
                          width: 32,
                          height: 32,
                          fontSize: 11,
                          background: `linear-gradient(150deg,oklch(0.6 0.12 ${(i * 60) % 360}),oklch(0.4 0.1 ${(i * 60) % 360}))`,
                        }}
                      >
                        {initials(r.name)}
                      </div>
                      <div className="rank-info">
                        <div className="t">{r.name}</div>
                        <div className="m">
                          {r.count} livro{r.count === 1 ? "" : "s"} · {r.completed} concluído{r.completed === 1 ? "" : "s"}
                        </div>
                      </div>
                      <div className="rank-value">{r.count}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="dash-card">
              <h3>Mais lidos (livros)</h3>
              {topBooks.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--muted)" }}>Sem livros cadastrados.</p>
              ) : (
                topBooks.map((b, i) => {
                  const { hue, label } = parseTags(b.tags);
                  return (
                    <div key={b.id} className="rank-item">
                      <span className="rank-num">#{i + 1}</span>
                      <div
                        className="cover-mini"
                        style={{
                          background: `linear-gradient(150deg, oklch(0.42 0.1 ${hue}), oklch(0.22 0.08 ${(hue + 30) % 360}))`,
                        }}
                      />
                      <div className="rank-info">
                        <div className="t">{b.titulo}</div>
                        <div className="m">
                          {label} · {b.autor ?? "—"}
                        </div>
                      </div>
                      <div className="rank-value">{b.contadorDownloads}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ============ PLANO & FATURA ============ */}
        {tab === "plano" && (
          <div>
            <div className="card-block">
              <div className="flex-between" style={{ flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div className="tag">Plano atual</div>
                  <div
                    style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 500, marginTop: 4 }}
                  >
                    Standard
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                    R$ 299/mês · até 10 acessos · renova em 10/ago/2025
                  </div>
                </div>
                <div className="flex wrap" style={{ gap: 8 }}>
                  <button
                    className="btn btn--ghost btn--sm"
                    style={{ color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" }}
                    onClick={() => setToast("Entre em contato com o suporte para cancelar.")}
                  >
                    Cancelar plano
                  </button>
                  <button className="btn btn--ink btn--sm" onClick={() => setToast("Upgrade enviado ✓")}>
                    Fazer upgrade →
                  </button>
                </div>
              </div>
            </div>

            <h3 style={{ fontFamily: "var(--serif)", fontSize: 18, marginBottom: 12 }}>
              Trocar de plano
            </h3>
            <div className="plan-grid" style={{ marginTop: 0 }}>
              {PLANS.map((p) => (
                <div
                  key={p.id}
                  className={`plan-card${p.atual ? " atual" : ""}${p.destaque ? " destaque" : ""}${selectedPlan === p.id ? " destaque" : ""}`}
                  onClick={() => setSelectedPlan(p.id)}
                  style={{ cursor: "pointer" }}
                >
                  {p.destaque && <span className="ribbon">recomendado</span>}
                  {p.atual && !p.destaque && <span className="ribbon" style={{ background: "var(--ink)", color: "var(--paper)" }}>atual</span>}
                  <div className="nome">{p.nome}</div>
                  <div className="preco">
                    {p.preco ? `R$ ${p.preco}` : "—"}
                    <small> /{p.periodo}</small>
                  </div>
                  <div className="period">
                    {p.usuarios === "ilimitado" ? "acessos ilimitados" : `até ${p.usuarios} acessos`}
                  </div>
                  <ul>
                    {p.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  <button
                    className={`btn btn--sm btn--block ${p.atual ? "btn--ghost" : p.destaque ? "btn--gold" : "btn--ink"}`}
                    style={p.atual ? { color: "var(--ink)", borderColor: "rgba(0,0,0,0.2)" } : undefined}
                    disabled={p.atual}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (p.atual) return;
                      setToast(`Pedido de ${p.cta.toLowerCase()} enviado ✓`);
                    }}
                  >
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>

            <div className="card-block" style={{ marginTop: 24 }}>
              <h3>Histórico de faturas</h3>
              <div className="card-sub">Últimas 5 faturas. Baixe o PDF para seus registros.</div>
              {MOCK_INVOICES.map((inv) => (
                <div key={inv.num} className="invoice-row">
                  <span style={{ color: "var(--muted)", fontSize: 12 }}>{inv.data}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{inv.num}</span>
                  <span style={{ fontWeight: 500 }}>R$ {inv.valor}</span>
                  <div className="flex" style={{ gap: 8 }}>
                    <span className="inv-paid">paga</span>
                    <button
                      className="icon-btn-ink"
                      onClick={() => setToast(`Baixando ${inv.num}…`)}
                    >
                      ⬇
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============ RELATÓRIOS ============ */}
        {tab === "relatorios" && (
          <div>
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-label">Leituras registradas</div>
                <div className="stat-value">{historyCount}</div>
                <div className="stat-trend">últimos 90 dias</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Livros no acervo</div>
                <div className="stat-value">{ebooks.length}+</div>
                <div className="stat-trend up">4 novos este mês</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Engajamento médio</div>
                <div className="stat-value">62%</div>
                <div className="stat-trend up">↑ 8pts vs último mês</div>
              </div>
            </div>

            <div className="dash-grid-2">
              <div className="dash-card">
                <div className="flex-between" style={{ marginBottom: 14 }}>
                  <h3>Top livros (30d)</h3>
                  <button
                    className="icon-btn-ink"
                    onClick={() => setToast("Exportando CSV…")}
                  >
                    ⬇ exportar
                  </button>
                </div>
                {topBooks.map((b, i) => {
                  const { hue, label } = parseTags(b.tags);
                  return (
                    <div key={b.id} className="rank-item">
                      <span className="rank-num">#{i + 1}</span>
                      <div
                        className="cover-mini"
                        style={{
                          background: `linear-gradient(150deg, oklch(0.42 0.1 ${hue}), oklch(0.22 0.08 ${(hue + 30) % 360}))`,
                        }}
                      />
                      <div className="rank-info">
                        <div className="t">{b.titulo}</div>
                        <div className="m">{label}</div>
                      </div>
                      <div className="rank-value">{b.contadorDownloads} dl</div>
                    </div>
                  );
                })}
              </div>

              <div className="dash-card">
                <h3>Distribuição por categoria</h3>
                {categoriesDist.length === 0 ? (
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>Sem leituras ainda.</p>
                ) : (
                  categoriesDist.map((c) => (
                    <div key={c.cat} style={{ marginBottom: 12 }}>
                      <div className="flex-between" style={{ fontSize: 13, marginBottom: 4 }}>
                        <strong>{c.cat}</strong>
                        <span style={{ color: "var(--muted)", fontSize: 12 }}>
                          {c.n} leitura{c.n === 1 ? "" : "s"} · {c.pct.toFixed(0)}%
                        </span>
                      </div>
                      <div className="license-bar">
                        <div className="license-bar-fill" style={{ width: `${c.pct}%` }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card-block">
              <div className="flex-between" style={{ flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h3>Exportar dados</h3>
                  <div className="card-sub">
                    Baixe um CSV com todas as leituras, usuários e progresso para analisar no Excel.
                  </div>
                </div>
                <div className="flex wrap" style={{ gap: 8 }}>
                  <button
                    className="icon-btn-ink"
                    onClick={() => setToast("Exportando leituras…")}
                  >
                    ⬇ leituras.csv
                  </button>
                  <button
                    className="icon-btn-ink"
                    onClick={() => setToast("Exportando usuários…")}
                  >
                    ⬇ usuarios.csv
                  </button>
                  <button
                    className="icon-btn-ink"
                    onClick={() => setToast("Exportando completo…")}
                  >
                    ⬇ tudo.csv
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ ACESSO & SSO ============ */}
        {tab === "acesso" && (
          <div>
            <div className="card-block">
              <h3>Single Sign-On (SSO)</h3>
              <div className="card-sub">
                Permita que a equipe entre com a conta corporativa. Disponível no plano Pro.
              </div>

              <div
                className="flex-between"
                style={{ padding: "14px 0", borderTop: "1px solid var(--line-ink)", flexWrap: "wrap", gap: 12 }}
              >
                <div>
                  <div className="flex" style={{ gap: 8 }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>Google Workspace</span>
                    <span className={`status-pill ${ssoGoogle ? "ativo" : "inativo"}`}>
                      {ssoGoogle ? "ativo" : "desativado"}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                    Login via OAuth para todo o domínio @{(user.company?.name ?? "empresa").toLowerCase().replace(/\s+/g, "")}.com
                  </div>
                </div>
                <div
                  className={`toggle${ssoGoogle ? " on" : ""}`}
                  onClick={() => {
                    setSsoGoogle((v) => !v);
                    setToast(!ssoGoogle ? "Google SSO ativado ✓" : "Google SSO desativado");
                  }}
                />
              </div>

              <div
                className="flex-between"
                style={{ padding: "14px 0", borderTop: "1px solid var(--line-ink)", flexWrap: "wrap", gap: 12 }}
              >
                <div>
                  <div className="flex" style={{ gap: 8 }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>Microsoft 365 / Azure AD</span>
                    <span className={`status-pill ${ssoMicrosoft ? "ativo" : "inativo"}`}>
                      {ssoMicrosoft ? "ativo" : "desativado"}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                    SAML 2.0. Exige configuração de IdP no portal Azure.
                  </div>
                </div>
                <div
                  className={`toggle${ssoMicrosoft ? " on" : ""}`}
                  onClick={() => {
                    setSsoMicrosoft((v) => !v);
                    setToast(!ssoMicrosoft ? "Microsoft SSO ativado ✓" : "Microsoft SSO desativado");
                  }}
                />
              </div>
            </div>

            <div className="card-block">
              <h3>Política de senha</h3>
              <div className="card-sub">
                Regras aplicadas a todos os usuários da empresa no próximo login.
              </div>

              {[
                { key: "min8", label: "Mínimo 8 caracteres", desc: "Comprimento mínimo." },
                { key: "upper", label: "Letra maiúscula", desc: "Ao menos uma A-Z." },
                { key: "number", label: "Pelo menos 1 número", desc: "0-9 obrigatório." },
                { key: "special", label: "Caractere especial", desc: "Ex.: !@#$%" },
              ].map((r) => (
                <div
                  key={r.key}
                  className="flex-between"
                  style={{ padding: "12px 0", borderTop: "1px solid var(--line-ink)", gap: 10, flexWrap: "wrap" }}
                >
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13.5 }}>{r.label}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.desc}</div>
                  </div>
                  <div
                    className={`toggle${pwRules[r.key as keyof typeof pwRules] ? " on" : ""}`}
                    onClick={() => {
                      setPwRules((p) => ({ ...p, [r.key]: !p[r.key as keyof typeof pwRules] }));
                      setToast("Política atualizada ✓");
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="card-block">
              <h3>Sessões ativas na empresa</h3>
              <div className="card-sub">Todos os dispositivos logados agora nesta conta corporativa.</div>
              {employees
                .filter((e) => e.isActive && e.lastLoginAt)
                .slice(0, 5)
                .map((e) => (
                  <div
                    key={e.id}
                    className="flex-between"
                    style={{ padding: "12px 0", borderTop: "1px solid var(--line-ink)", gap: 10, flexWrap: "wrap" }}
                  >
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{e.fullName}</div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
                        {e.corporateEmail} ·{" "}
                        {e.lastLoginAt
                          ? `ativo ${new Date(e.lastLoginAt).toLocaleDateString("pt-BR")}`
                          : "—"}
                      </div>
                    </div>
                    <button
                      className="icon-btn-ink danger"
                      onClick={() => setToast(`Sessão de ${e.fullName} revogada ✓`)}
                    >
                      Revogar
                    </button>
                  </div>
                ))}
              {employees.filter((e) => e.isActive && e.lastLoginAt).length === 0 && (
                <div style={{ padding: "12px 0", fontSize: 13, color: "var(--muted)" }}>
                  Nenhuma sessão ativa.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
    </div>
  );
}
