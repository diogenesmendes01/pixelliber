import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Subscribe from "@/components/Subscribe";
import ReadAnywhere from "@/components/ReadAnywhere";
import DownloadSection from "@/components/DownloadSection";
import FAQ from "@/components/FAQ";

const BOOK_ROWS = [
  {
    title: "Destaques da semana",
    books: [
      { hue: 38, tag: "finanças", title: "Pai rico, pai pobre", author: "R. Kiyosaki" },
      { hue: 20, tag: "vendas", title: "Copywriting: destruindo objeções", author: "A. Costa" },
      { hue: 50, tag: "finanças", title: "Desenvolva seu QI financeiro", author: "T. Vaz" },
      { hue: 280, tag: "marketing", title: "Do ponto zero à conversão", author: "L. Souza" },
      { hue: 160, tag: "mente", title: "Como parar de se preocupar", author: "D. Ramos" },
      { hue: 0, tag: "marketing", title: "Autoridade no YouTube", author: "C. Rocha" },
      { hue: 210, tag: "negócios", title: "O negócio do coaching", author: "P. Alves" },
      { hue: 12, tag: "vendas", title: "Segredo da persuasão", author: "J. Leal" },
    ],
  },
  {
    title: "Finanças pessoais",
    books: [
      { hue: 38, tag: "finanças", title: "Pai rico, pai pobre", author: "R. Kiyosaki" },
      { hue: 50, tag: "finanças", title: "Desenvolva seu QI financeiro", author: "T. Vaz" },
      { hue: 120, tag: "finanças", title: "Organizze: saia do vermelho", author: "P. Moura" },
      { hue: 100, tag: "finanças", title: "Encontrando dinheiro", author: "M. Nunes" },
      { hue: 260, tag: "finanças", title: "Liberte o gigante financeiro", author: "A. Lopes" },
      { hue: 195, tag: "finanças", title: "Orçamento familiar", author: "B. Reis" },
    ],
  },
  {
    title: "Marketing & vendas",
    books: [
      { hue: 0, tag: "marketing", title: "Autoridade no YouTube", author: "C. Rocha" },
      { hue: 280, tag: "marketing", title: "Do ponto zero à conversão", author: "L. Souza" },
      { hue: 330, tag: "marketing", title: "TikTok Marketing", author: "V. Silva" },
      { hue: 20, tag: "vendas", title: "Copywriting: destruindo objeções", author: "A. Costa" },
      { hue: 12, tag: "vendas", title: "Segredo da persuasão", author: "J. Leal" },
    ],
  },
];

function BookCover({ book }: { book: (typeof BOOK_ROWS)[0]["books"][0] }) {
  const bg = `linear-gradient(150deg, oklch(0.42 0.1 ${book.hue}), oklch(0.22 0.08 ${(book.hue + 30) % 360}))`;
  return (
    <a href="/login" className="cover" style={{ background: bg }} aria-label={`${book.title} — ${book.author}`}>
      <span className="cover-tag">{book.tag}</span>
      <span>
        <span className="cover-title">{book.title}</span>
        <span className="cover-author" style={{ display: "block" }}>{book.author}</span>
      </span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <Header active="home" role="guest" />
      <main>
        <Hero />

        {BOOK_ROWS.map((row) => (
          <section key={row.title} className="section" style={{ paddingTop: 0 }}>
            <div className="container">
              <div className="section-head">
                <h2 className="serif" style={{ fontSize: "var(--h3)" }}>{row.title}</h2>
                <a href="/vitrine" className="tag" style={{ cursor: "pointer" }}>
                  Ver tudo →
                </a>
              </div>
              <div className="row-scroll">
                {row.books.map((book, i) => (
                  <BookCover key={i} book={book} />
                ))}
              </div>
            </div>
          </section>
        ))}

        <Subscribe />
        <ReadAnywhere />
        <DownloadSection />
        <FAQ />
      </main>

      <footer className="ft">
        <div className="container ft-inner">
          <div>© Pixel Liber · EST. 2024</div>
          <div style={{ display: "flex", gap: 14 }}>
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
            <a href="/contato">Contato</a>
          </div>
        </div>
      </footer>
    </>
  );
}
