"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";

interface EbookRaw {
  id: string;
  titulo: string;
  autor: string | null;
  categoria: string | null;
  tags: string | null;
  contadorDownloads: number;
  createdAt: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  tag: string;
  cat: string;
  hue: number;
}

function parseBook(e: EbookRaw): Book {
  let hue = 38;
  let tag = e.categoria?.toLowerCase() ?? "geral";
  try {
    const t = JSON.parse(e.tags ?? "{}");
    if (typeof t.hue === "number") hue = t.hue;
    if (t.label) tag = t.label;
  } catch {
    // use defaults
  }
  return {
    id: e.id,
    title: e.titulo,
    author: e.autor ?? "",
    tag,
    cat: e.categoria ?? "Geral",
    hue,
  };
}

const CATS = ["Todos", "Finanças", "Marketing", "Mente", "Negócios", "Vendas"];

function coverBg(hue: number) {
  return `linear-gradient(150deg, oklch(0.42 0.1 ${hue}), oklch(0.22 0.08 ${(hue + 30) % 360}))`;
}

function BookCover({ book, small }: { book: Book; small?: boolean }) {
  return (
    <Link
      href={`/vitrine/${book.id}`}
      className="cover"
      style={{ background: coverBg(book.hue), ...(small ? { width: 90, flexShrink: 0 } : {}) }}
      aria-label={`${book.title} — ${book.author}`}
    >
      <span className="cover-tag">{book.tag}</span>
      <span>
        <span className="cover-title">{book.title}</span>
        <span className="cover-author" style={{ display: "block" }}>{book.author}</span>
      </span>
    </Link>
  );
}

function BookSkeleton({ small }: { small?: boolean }) {
  return (
    <div
      className="cover skel"
      style={small ? { width: 90, flexShrink: 0 } : {}}
    />
  );
}

export default function VitrinePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("Todos");
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const res = await fetch("/api/ebooks");
        if (res.ok) {
          const data = await res.json();
          setBooks((data.ebooks as EbookRaw[]).map(parseBook));
        }
      } catch {
        // silently fail — show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return books.filter((b) => {
      const matchCat = activeCat === "Todos" || b.cat === activeCat;
      const matchQ = !q || (b.title + " " + b.author).toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [books, activeCat, query]);

  // Top 5 by downloads (API already returns sorted by contadorDownloads desc)
  const topBooks = books.slice(0, 5);
  // Newest 4 (last in list tend to have lower downloads = newer)
  const newBooks = books.slice(-4).reverse();

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

        {/* Mais lidos */}
        {!query && activeCat === "Todos" && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="section-head">
              <h2 className="serif" style={{ fontSize: "var(--h3)" }}>Mais lidos na sua empresa</h2>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>últimos 30 dias</span>
            </div>
            <div className="grid-books">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <BookSkeleton key={i} />)
                : topBooks.map((b) => <BookCover key={b.id} book={b} />)}
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
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <BookSkeleton key={i} />)
                : newBooks.map((b) => <BookCover key={b.id} book={b} />)}
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
              {loading ? "carregando…" : `${filtered.length} ${filtered.length === 1 ? "título" : "títulos"}`}
            </span>
          </div>

          {loading ? (
            <div className="grid-books">
              {Array.from({ length: 8 }).map((_, i) => <BookSkeleton key={i} />)}
            </div>
          ) : filtered.length > 0 ? (
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
