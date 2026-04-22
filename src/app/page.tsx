import Link from "next/link";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import BookCover from "@/components/BookCover";
import ContactForm from "@/components/ContactForm";
import { BOOKS, PLANS, booksByTag, booksByTags, booksWithNew } from "@/lib/books-data";

export default function Home() {
  const destaques = booksWithNew(BOOKS.slice(0, 10));
  const financas = booksWithNew(booksByTag("finanças"));
  const marketingVendas = booksWithNew(booksByTags(["marketing", "vendas"]));

  return (
    <>
      <Header active="home" role="guest" />
      <main className="container">
        <Hero />

        <section className="section">
          <div className="section-head">
            <h2 className="serif">Destaques da semana</h2>
            <Link href="/vitrine" className="tag" style={{ cursor: "pointer" }}>
              Ver tudo →
            </Link>
          </div>
          <div className="row-scroll">
            {destaques.map((book) => (
              <BookCover key={book.id} book={book} />
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2 className="serif">Finanças pessoais</h2>
          </div>
          <div className="row-scroll">
            {financas.map((book) => (
              <BookCover key={book.id} book={book} />
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2 className="serif">Marketing &amp; vendas</h2>
          </div>
          <div className="row-scroll">
            {marketingVendas.map((book) => (
              <BookCover key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* ========== Como funciona ========== */}
        <section className="section" id="como" style={{ padding: "60px 0" }}>
          <div className="section-head">
            <h2 className="serif">Como funciona</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
              marginTop: 12,
            }}
          >
            <div
              style={{
                background: "var(--ink-2)",
                border: "1px solid var(--line)",
                borderRadius: 14,
                padding: 24,
              }}
            >
              <div className="tag gold-text">Passo 1</div>
              <h3 className="serif" style={{ fontSize: 22, margin: "8px 0 6px" }}>
                Contrate um plano
              </h3>
              <p style={{ color: "var(--muted)", margin: 0, fontSize: 13.5, lineHeight: 1.6 }}>
                Escolha a quantidade de acessos. A gente cadastra sua empresa pelo CNPJ e libera em minutos.
              </p>
            </div>
            <div
              style={{
                background: "var(--ink-2)",
                border: "1px solid var(--line)",
                borderRadius: 14,
                padding: 24,
              }}
            >
              <div className="tag gold-text">Passo 2</div>
              <h3 className="serif" style={{ fontSize: 22, margin: "8px 0 6px" }}>
                Convide a equipe
              </h3>
              <p style={{ color: "var(--muted)", margin: 0, fontSize: 13.5, lineHeight: 1.6 }}>
                Cada funcionário recebe um convite por e-mail. Admin gerencia tudo pelo painel.
              </p>
            </div>
            <div
              style={{
                background: "var(--ink-2)",
                border: "1px solid var(--line)",
                borderRadius: 14,
                padding: 24,
              }}
            >
              <div className="tag gold-text">Passo 3</div>
              <h3 className="serif" style={{ fontSize: 22, margin: "8px 0 6px" }}>
                Leia em qualquer lugar
              </h3>
              <p style={{ color: "var(--muted)", margin: 0, fontSize: 13.5, lineHeight: 1.6 }}>
                480+ títulos curados. Leitura online, offline, e relatórios de uso pro admin.
              </p>
            </div>
          </div>
        </section>

        {/* ========== Planos (faixa clara) ========== */}
        <section
          className="section"
          id="planos"
          style={{
            padding: "60px 0",
            background: "var(--paper)",
            color: "var(--ink)",
            margin: "0 calc(-1 * var(--gutter))",
            paddingLeft: "var(--gutter)",
            paddingRight: "var(--gutter)",
          }}
        >
          <div style={{ maxWidth: "var(--maxw)", margin: "0 auto" }}>
            <span className="tag gold-text">Planos</span>
            <h2
              className="serif"
              style={{ fontSize: "var(--h2)", margin: "6px 0 8px", color: "var(--ink)" }}
            >
              Um plano pra cada tamanho
            </h2>
            <p style={{ color: "var(--muted)", margin: "0 0 24px" }}>
              Mensal, sem fidelidade. Troque quando quiser.
            </p>

            <div className="plan-grid">
              {PLANS.map((p) => (
                <div key={p.id} className={`plan-card${p.destaque ? " destaque" : ""}`}>
                  {p.destaque && <span className="ribbon">recomendado</span>}
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
                  <Link
                    href="/login"
                    className={`btn ${p.destaque ? "btn--gold" : "btn--ink"} btn--sm btn--block`}
                  >
                    {p.id === "custom" ? "Falar com vendas" : "Começar →"}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== Contato ========== */}
        <section className="section" id="contato" style={{ padding: "60px 0" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
              alignItems: "start",
            }}
            className="contato-grid"
          >
            <div>
              <span className="tag gold-text">Contato</span>
              <h2 className="serif" style={{ fontSize: "var(--h2)", margin: "6px 0 14px" }}>
                Fale com a gente
              </h2>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 14,
                  lineHeight: 1.7,
                  margin: "0 0 20px",
                }}
              >
                Dúvidas sobre o plano, acervo ou integração com o RH da sua empresa? Mandamos uma resposta em até 1 dia útil.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13.5 }}>
                <div>
                  <div className="tag">E-mail comercial</div>
                  <div style={{ marginTop: 2 }}>contato@pixelliber.com.br</div>
                </div>
                <div>
                  <div className="tag">Suporte</div>
                  <div style={{ marginTop: 2 }}>suporte@pixelliber.com.br</div>
                </div>
                <div>
                  <div className="tag">Horário</div>
                  <div style={{ marginTop: 2 }}>Seg–Sex · 9h às 18h (BRT)</div>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 720px){
          .contato-grid{grid-template-columns:1fr !important}
        }
      `}</style>
    </>
  );
}
