import Link from "next/link";
import BookCover from "./BookCover";
import { BOOKS } from "@/lib/books-data";

export default function Hero() {
  const heroBooks = BOOKS.slice(0, 9);

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <span className="tag gold-text">Biblioteca digital</span>
            <h1 className="serif">
              Uma biblioteca <em>inteira</em> no navegador.
            </h1>
            <p>
              Centenas de e-books de finanças, marketing e desenvolvimento
              pessoal. Leia online, salve offline, compartilhe trechos.
            </p>
            <div className="hero-ctas">
              <Link href="/login" className="btn btn--gold">
                Começar agora →
              </Link>
              <Link href="/vitrine" className="btn btn--ghost">
                Ver catálogo
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="n">480+</div>
                <div className="tag">e-books</div>
              </div>
              <div>
                <div className="n">∞</div>
                <div className="tag">downloads</div>
              </div>
              <div>
                <div className="n">24h</div>
                <div className="tag">suporte</div>
              </div>
            </div>
          </div>
          <div className="hero-stack">
            {heroBooks.map((book) => (
              <BookCover key={book.id} book={book} href="/login" />
            ))}
          </div>
        </div>

        <div className="chips">
          <span className="tag" style={{ marginRight: 4 }}>Categorias</span>
          <span className="chip chip--gold">Finanças</span>
          <span className="chip">Marketing</span>
          <span className="chip">Mente</span>
          <span className="chip">Negócios</span>
          <span className="chip">Vendas</span>
          <span className="chip">Carreira</span>
        </div>
      </div>
    </section>
  );
}
