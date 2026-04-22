import Link from "next/link";

const HERO_BOOKS = [
  { hue: 38, tag: "finanças", title: "Pai rico, pai pobre", author: "R. Kiyosaki" },
  { hue: 340, tag: "mente", title: "A felicidade começa com você", author: "M. Oliveira" },
  { hue: 0, tag: "marketing", title: "Autoridade no YouTube", author: "C. Rocha" },
  { hue: 210, tag: "negócios", title: "O negócio do coaching", author: "P. Alves" },
  { hue: 20, tag: "vendas", title: "Copywriting: destruindo objeções", author: "A. Costa" },
  { hue: 160, tag: "mente", title: "Como parar de se preocupar", author: "D. Ramos" },
  { hue: 280, tag: "marketing", title: "Do ponto zero à conversão", author: "L. Souza" },
  { hue: 70, tag: "mente", title: "10 maneiras de atrair", author: "R. Dias" },
  { hue: 12, tag: "vendas", title: "Segredo da persuasão", author: "J. Leal" },
];

function BookCover({ book }: { book: typeof HERO_BOOKS[0] }) {
  const bg = `linear-gradient(150deg, oklch(0.42 0.1 ${book.hue}), oklch(0.22 0.08 ${(book.hue + 30) % 360}))`;
  return (
    <div
      className="cover"
      style={{ background: bg }}
      aria-label={`${book.title} — ${book.author}`}
    >
      <span className="cover-tag">{book.tag}</span>
      <span>
        <span className="cover-title">{book.title}</span>
        <span className="cover-author" style={{ display: "block" }}>{book.author}</span>
      </span>
    </div>
  );
}

export default function Hero() {
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
            {HERO_BOOKS.map((book, i) => (
              <BookCover key={i} book={book} />
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
