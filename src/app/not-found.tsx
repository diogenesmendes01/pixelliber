import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header role="guest" />
      <main className="container">
        <section className="section" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <div className="empty-state" style={{ maxWidth: 560, margin: "0 auto" }}>
            <div className="e-icon">📖</div>
            <h4>Página não encontrada</h4>
            <p>
              O link pode ter mudado ou o conteúdo não existe mais. Volte ao catálogo ou
              à página inicial para continuar.
            </p>
            <div className="flex wrap" style={{ justifyContent: "center", gap: 10 }}>
              <Link href="/" className="btn btn--gold btn--sm">
                ← Voltar ao início
              </Link>
              <Link
                href="/vitrine"
                className="btn btn--ghost btn--sm"
              >
                Ver catálogo
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
