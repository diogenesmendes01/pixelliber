"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";

const BOOKS = [
  { id: 1,  title: "Pai rico, pai pobre",                   author: "Robert Kiyosaki",  tag: "finanças",    cat: "Finanças",      hue: 38 },
  { id: 2,  title: "A felicidade começa com você",          author: "M. Oliveira",      tag: "mente",       cat: "Mente",         hue: 340 },
  { id: 3,  title: "Autoridade no YouTube",                 author: "C. Rocha",         tag: "marketing",   cat: "Marketing",     hue: 0 },
  { id: 4,  title: "O negócio do coaching",                 author: "P. Alves",         tag: "negócios",    cat: "Negócios",      hue: 210 },
  { id: 5,  title: "Copywriting: destruindo objeções",      author: "A. Costa",         tag: "vendas",      cat: "Vendas",        hue: 20 },
  { id: 6,  title: "Como parar de se preocupar",            author: "D. Ramos",         tag: "mente",       cat: "Mente",         hue: 160 },
  { id: 7,  title: "Do ponto zero à conversão",             author: "L. Souza",         tag: "marketing",   cat: "Marketing",     hue: 280 },
  { id: 8,  title: "10 maneiras de atrair",                 author: "R. Dias",          tag: "mente",       cat: "Mente",         hue: 70 },
  { id: 9,  title: "Segredo da persuasão",                  author: "J. Leal",          tag: "vendas",      cat: "Vendas",        hue: 12 },
  { id: 10, title: "Controlando a ansiedade",               author: "F. Melo",          tag: "mente",       cat: "Mente",         hue: 185 },
  { id: 11, title: "Organizze: saia do vermelho",           author: "P. Moura",         tag: "finanças",    cat: "Finanças",      hue: 120 },
  { id: 12, title: "Desenvolva seu QI financeiro",          author: "T. Vaz",           tag: "finanças",    cat: "Finanças",      hue: 50 },
  { id: 13, title: "Encontrando dinheiro",                  author: "M. Nunes",         tag: "finanças",    cat: "Finanças",      hue: 100 },
  { id: 14, title: "Liberte o gigante financeiro",          author: "A. Lopes",         tag: "finanças",    cat: "Finanças",      hue: 260 },
  { id: 15, title: "TikTok Marketing",                      author: "V. Silva",         tag: "marketing",   cat: "Marketing",     hue: 330 },
  { id: 16, title: "Orçamento familiar",                    author: "B. Reis",          tag: "finanças",    cat: "Finanças",      hue: 195 },
];

const NEW_IDS = [15, 16, 13, 9];
const TOP_IDS = [1, 5, 12, 7, 3];
const CONTINUE_BOOKS = [
  { bookId: 1, cap: "Cap. 3", pag: 42, pct: 15.6, when: "hoje" },
  { bookId: 4, cap: "Cap. 1", pag: 18, pct: 8, when: "ontem" },
  { bookId: 7, cap: "Cap. 5", pag: 114, pct: 62, when: "há 3 dias" },
];

const CATS = ["Todos", "Finanças", "Marketing", "Mente", "Negócios", "Vendas", "Carreira", "Produtividade"];

function coverBg(b: (typeof BOOKS)[0]) {
  return `linear-gradient(150deg, oklch(0.42 0.1 ${b.hue}), oklch(0.22 0.08 ${(b.hue + 30) % 360}))`;
}

function BookCover({ book, small }: { book: (typeof BOOKS)[0]; small?: boolean }) {
  const isNew = NEW_IDS.includes(book.id);
  return (
    <Link
      href={`/vitrine/${book.id}`}
      className="cover"
      style={{ background: coverBg(book), ...(small ? { width: 90, flexShrink: 0 } : {}) }}
      aria-label={`${book.title} — ${book.author}`}
    >
      {isNew && <span className="cover-new">novo</span>}
      <span className="cover-tag">{book.tag}</span>
      <span>
        <span className="cover-title">{book.title}</span>
        <span className="cover-author" style={{ display: "block" }}>{book.author}</span>
      </span>
    </Link>
  );
}

export default function VitrinePage() {
  const [activeCat, setActiveCat] = useState("Todos");
  const [query, setQuery] = useState("");
  const [showSkel, setShowSkel] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return BOOKS.filter((b) => {
      const matchCat = activeCat === "Todos" || b.cat === activeCat;
      const matchQ = !q || (b.title + " " + b.author).toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [activeCat, query]);

  const newBooks = BOOKS.filter((b) => NEW_IDS.includes(b.id));
  const topBooks = BOOKS.filter((b) => TOP_IDS.includes(b.id));

  return (
    <>
      <Header active="catalogo" role="admin" userName="Marina Castro" userCompany="Horizonte Livros" userEmail="marina@horizontelivros.com.br" />

      <main className="container" style={{ paddingTop: 18, paddingBottom: 60 }}>
        {/* Page header */}
        <section className="section" style={{ paddingBottom: 0 }}>
          <span className="tag gold-text">Catálogo</span>
          <h1 className="serif" style={{ fontSize: "var(--h2)", margin: "8px 0 6px" }}>
            480+ e-books, um só acesso.
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: "52ch" }}>
            Filtre por categoria ou busque pelo título/autor.
          </p>

          <div style={{ marginTop: 18 }}>
            <input
              className="input"
              placeholder="buscar livros, autores, tópicos…"
              style={{ maxWidth: 480 }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="chips">
            {CATS.map((cat) => (
              <button
                key={cat}
                className={`chip${activeCat === cat ? " chip--gold" : ""}`}
                onClick={() => setActiveCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Continuar lendo */}
        {!query && activeCat === "Todos" && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="section-head">
              <h2 className="serif" style={{ fontSize: "var(--h3)" }}>Continuar lendo</h2>
            </div>
            <div className="continue-grid">
              {CONTINUE_BOOKS.map((c) => {
                const book = BOOKS.find((b) => b.id === c.bookId)!;
                return (
                  <div key={c.bookId} className="continue-card">
                    <BookCover book={book} small />
                    <div className="meta">
                      <div>
                        <div className="serif" style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {book.title}
                        </div>
                        <div className="tag">{c.cap} · pág. {c.pag}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>lido {c.when}</div>
                      </div>
                      <div>
                        <div style={{ height: 2, background: "rgba(247,245,240,0.1)", borderRadius: 2, marginBottom: 8 }}>
                          <div style={{ width: `${c.pct}%`, height: "100%", background: "var(--gold)", borderRadius: 2 }} />
                        </div>
                        <Link href={`/vitrine/${book.id}`} className="btn btn--gold btn--sm btn--block">
                          Retomar →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Recém-adicionados */}
        {!query && activeCat === "Todos" && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="section-head">
              <h2 className="serif" style={{ fontSize: "var(--h3)" }}>Recém-adicionados</h2>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>atualizado esta semana</span>
            </div>
            <div className="grid-books">
              {newBooks.map((b) => <BookCover key={b.id} book={b} />)}
            </div>
          </section>
        )}

        {/* Mais lidos */}
        {!query && activeCat === "Todos" && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="section-head">
              <h2 className="serif" style={{ fontSize: "var(--h3)" }}>Mais lidos na sua empresa</h2>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>últimos 30 dias</span>
            </div>
            <div className="grid-books">
              {topBooks.map((b) => <BookCover key={b.id} book={b} />)}
            </div>
          </section>
        )}

        {/* Todos / Filtered */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <h2 className="serif" style={{ fontSize: "var(--h3)" }}>
              {activeCat === "Todos" ? "Todos os títulos" : activeCat}
            </h2>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              {filtered.length} {filtered.length === 1 ? "título" : "títulos"}
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid-books">
              {filtered.map((b) => <BookCover key={b.id} book={b} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="e-icon">🔍</div>
              <h4>{query ? `Nada encontrado para "${query}"` : `Nenhum título em ${activeCat}`}</h4>
              <p>
                {query
                  ? "Tente outra palavra ou remova filtros de categoria."
                  : "Esta categoria ainda está sendo curada. Enquanto isso, explore as outras."}
              </p>
              <button
                className="btn btn--gold btn--sm"
                onClick={() => { setQuery(""); setActiveCat("Todos"); }}
              >
                Ver todos os títulos
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="ft">
        <div className="container ft-inner">
          <div>© Pixel Liber · EST. 2024</div>
          <div style={{ display: "flex", gap: 14 }}>
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
          </div>
        </div>
      </footer>
    </>
  );
}
