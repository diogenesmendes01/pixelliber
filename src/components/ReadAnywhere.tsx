export default function ReadAnywhere() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 48px)" }}>
          <span className="tag gold-text">Multiplataforma</span>
          <h2
            className="serif"
            style={{ fontSize: "var(--h2)", margin: "10px 0 12px", fontWeight: 500 }}
          >
            Leia onde e quando quiser
          </h2>
          <p style={{ color: "rgba(247,245,240,0.6)", maxWidth: "44ch", margin: "0 auto", fontSize: "var(--fs-lg)" }}>
            O acesso é pelo navegador — sem apps, sem downloads obrigatórios.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "clamp(16px, 3vw, 32px)",
            textAlign: "center",
          }}
        >
          {[
            { icon: "💻", title: "No navegador", desc: "Acesse de qualquer computador sem instalar nada." },
            { icon: "📱", title: "No celular", desc: "Leia no smartphone ou tablet onde estiver." },
            { icon: "⭳", title: "Modo offline", desc: "Baixe e leia sem internet pelos planos Standard e Pro." },
            { icon: "🔖", title: "Com marcadores", desc: "Salve trechos favoritos e retome de onde parou." },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "rgba(247,245,240,0.03)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: "clamp(20px, 3vw, 28px)",
              }}
            >
              <div
                style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "rgba(247,245,240,0.06)", border: "1px solid var(--line)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, marginBottom: 14,
                }}
              >
                {item.icon}
              </div>
              <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
