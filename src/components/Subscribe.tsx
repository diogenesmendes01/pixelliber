import Link from "next/link";

export default function Subscribe() {
  return (
    <section className="section" style={{ background: "var(--ink-2)" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
          }}
        >
          <div>
            <span className="tag gold-text">Para empresas</span>
            <h2
              className="serif"
              style={{ fontSize: "var(--h2)", margin: "10px 0 14px", fontWeight: 500, lineHeight: 1.05 }}
            >
              Uma biblioteca inteira para toda a sua equipe.
            </h2>
            <p style={{ color: "rgba(247,245,240,0.65)", maxWidth: "44ch", margin: "0 0 24px", fontSize: "var(--fs-lg)" }}>
              Acervo completo com um único CNPJ. Gerencie acessos, acompanhe
              leituras e extraia relatórios de uso — tudo em um painel simples.
            </p>
            <div className="hero-ctas">
              <Link href="/contato" className="btn btn--gold">
                Quero assinar →
              </Link>
              <Link href="/#planos" className="btn btn--ghost">
                Ver planos
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {[
              { icon: "📚", title: "480+ e-books", desc: "Acervo curado de finanças, marketing e negócios." },
              { icon: "👥", title: "Gestão de equipe", desc: "Convide funcionários e controle acessos por CNPJ." },
              { icon: "📊", title: "Relatórios de uso", desc: "Veja quem lê o quê e acompanhe o progresso." },
              { icon: "⭳", title: "Leitura offline", desc: "Baixe e leia sem internet, em qualquer dispositivo." },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(247,245,240,0.04)",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  padding: "16px",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.45 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
