import Link from "next/link";

const PLAN_ITEMS = [
  {
    id: "starter",
    name: "Starter",
    price: "R$ 149",
    period: "/mês",
    users: "Até 3 acessos",
    features: ["Acervo completo (480+ títulos)", "Leitura offline 30 dias", "Suporte por e-mail"],
    cta: "Começar",
    highlight: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: "R$ 299",
    period: "/mês",
    users: "Até 10 acessos",
    features: ["Acervo completo", "Leitura offline 30 dias", "Marca d'água por CNPJ", "Suporte por e-mail"],
    cta: "Mais popular",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 599",
    period: "/mês",
    users: "Até 25 acessos",
    features: ["Acervo completo", "PDF original com marca d'água", "Relatórios de uso", "Suporte prioritário", "SSO (Google/Microsoft)"],
    cta: "Fazer upgrade",
    highlight: false,
  },
];

export default function DownloadSection() {
  return (
    <section className="section" id="planos">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 48px)" }}>
          <span className="tag gold-text">Planos</span>
          <h2
            className="serif"
            style={{ fontSize: "var(--h2)", margin: "10px 0 12px", fontWeight: 500 }}
          >
            Escolha o plano da sua empresa
          </h2>
          <p style={{ color: "rgba(247,245,240,0.6)", maxWidth: "44ch", margin: "0 auto" }}>
            Pague mensalmente. Mude de plano quando precisar. Sem fidelidade.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {PLAN_ITEMS.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: plan.highlight ? "var(--ink-2)" : "rgba(247,245,240,0.03)",
                border: plan.highlight ? "1px solid var(--gold)" : "1px solid var(--line)",
                borderRadius: 14,
                padding: "clamp(20px, 3vw, 28px)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: plan.highlight ? "0 0 0 1px var(--gold), 0 10px 30px -10px oklch(0.78 0.11 85 / 0.3)" : "none",
              }}
            >
              {plan.highlight && (
                <span
                  style={{
                    position: "absolute", top: -9, right: 14,
                    background: "var(--gold)", color: "var(--ink)",
                    fontSize: 10, fontWeight: 600, padding: "3px 10px",
                    borderRadius: 999, letterSpacing: "0.06em", textTransform: "uppercase",
                  }}
                >
                  recomendado
                </span>
              )}
              <div className="serif" style={{ fontSize: 22, fontWeight: 500, marginBottom: 2 }}>{plan.name}</div>
              <div
                className="serif"
                style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 2 }}
              >
                {plan.price}
                <small style={{ fontSize: 13, color: "var(--muted)", fontWeight: 400 }}>{plan.period}</small>
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                {plan.users}
              </div>
              <ul
                style={{
                  listStyle: "none", padding: 0, margin: "0 0 20px",
                  fontSize: 12.5, display: "flex", flexDirection: "column", gap: 7, flex: 1,
                }}
              >
                {plan.features.map((f, i) => (
                  <li key={i} style={{ paddingLeft: 18, position: "relative", lineHeight: 1.45 }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--ok)", fontWeight: 600 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contato"
                className={`btn btn--sm btn--block ${plan.highlight ? "btn--gold" : "btn--ghost"}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--muted)" }}>
          Precisa de mais de 25 acessos?{" "}
          <Link href="/contato" style={{ color: "var(--gold)", fontWeight: 500 }}>
            Fale com a gente sobre Enterprise →
          </Link>
        </p>
      </div>
    </section>
  );
}
