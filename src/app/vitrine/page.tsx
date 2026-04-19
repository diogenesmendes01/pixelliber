"use client";

import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useRef, useState, useEffect } from "react";

interface Ebook {
  id: number;
  titulo: string;
  autor: string;
  descricao: string;
  categoria: string;
  capa: string;
  pdf: string;
  dataPublicacao: string;
  numeroPaginas: number;
  tags: string;
  destaque: boolean;
  contadorDownloads: number;
}

function EbookCarousel({ books }: { books: Ebook[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Anterior"
      >
        ‹
      </button>

      <div
        ref={scrollRef}
        className="carousel-scroll"
        style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}
      >
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/vitrine/${book.id}`}
            style={{ minWidth: "160px", textDecoration: "none" }}
          >
            <div
              style={{
                width: "160px",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              className="hover:scale-105"
            >
              <div
                className="relative aspect-[3/4]"
                style={{ borderRadius: "8px", overflow: "hidden" }}
              >
                <Image
                  src={book.capa}
                  alt={book.titulo}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <p
                style={{
                  color: "white",
                  fontSize: "12px",
                  marginTop: "6px",
                  fontWeight: 600,
                  lineHeight: 1.3,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {book.titulo}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Próximo"
      >
        ›
      </button>
    </div>
  );
}

export default function VitrinePage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [populares, setPopulares] = useState<Ebook[]>([]);
  const [maisBaixados, setMaisBaixados] = useState<Ebook[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEbooks();
  }, [categoria, search]);

  async function fetchEbooks() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoria !== "all") params.set("categoria", categoria);
      if (search) params.set("search", search);

      const res = await fetch(`/api/ebooks?${params.toString()}`);
      const data = await res.json();
      setEbooks(data.ebooks || []);
      setPopulares(data.populares || []);
      setMaisBaixados(data.maisBaixados || []);
      setCategorias(data.categorias || []);
    } catch (error) {
      console.error("Error fetching ebooks:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchEbooks();
  }

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Image
              src="/logo/horizontal/horizontal-200x40.png"
              alt="Pixel Liber"
              width={180}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>
          <Link href="/minha-conta">
            <Image
              src="/Avatar-perfil.png"
              alt="Minha conta"
              width={35}
              height={35}
              className="rounded-full"
              style={{ width: "35px", height: "35px", objectFit: "cover" }}
            />
          </Link>
        </div>
      </header>

      <main className="min-h-screen bg-[#121212]">
        {/* Video Banner */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/Books-Animation.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="px-8 md:px-16 max-w-2xl">
              <h1
                className="font-bold text-white leading-tight"
                style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
              >
                Você tem acesso a todos os e-books, sem limite!
              </h1>
              <a
                href="#populares"
                className="mt-6 inline-flex items-center gap-3 rounded-md px-8 py-3 font-semibold transition hover:opacity-90"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "16px",
                }}
              >
                <Image
                  src="/icons/abra-o-livro.svg"
                  alt=""
                  width={24}
                  height={24}
                  style={{ width: "24px", height: "24px" }}
                />
                Aproveite a sua leitura
              </a>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="px-6 md:px-12 py-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-wrap gap-3 items-center"
          >
            <input
              type="text"
              placeholder="Buscar por título ou autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/40"
              style={{ minWidth: "240px" }}
            />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40"
            >
              <option value="all">Todas as categorias</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-white text-black font-semibold hover:opacity-90 transition"
            >
              Buscar
            </button>
          </form>
        </section>

        {/* Results */}
        {(search || categoria !== "all") && (
          <section className="px-6 md:px-12 py-6">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Resultados{search ? ` para "${search}"` : ""}
            </h2>
            {loading ? (
              <p className="text-white/60">Carregando...</p>
            ) : ebooks.length === 0 ? (
              <p className="text-white/60">Nenhum e-book encontrado.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: "16px",
                }}
              >
                {ebooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/vitrine/${book.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{ cursor: "pointer", transition: "transform 0.2s" }}
                      className="hover:scale-105"
                    >
                      <div
                        className="relative aspect-[3/4]"
                        style={{ borderRadius: "8px", overflow: "hidden" }}
                      >
                        <Image
                          src={book.capa}
                          alt={book.titulo}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      </div>
                      <p
                        style={{
                          color: "white",
                          fontSize: "12px",
                          marginTop: "6px",
                          fontWeight: 600,
                          lineHeight: 1.3,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {book.titulo}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Os mais populares */}
        {!search && categoria === "all" && (
          <section id="populares" className="px-6 md:px-12 py-12">
            <h2 className="text-2xl font-bold mb-4 text-white">Os mais populares</h2>
            {loading ? (
              <p className="text-white/60">Carregando...</p>
            ) : (
              <EbookCarousel books={populares} />
            )}
          </section>
        )}

        {/* Os mais baixados */}
        {!search && categoria === "all" && (
          <section className="px-6 md:px-12 py-12">
            <h2 className="text-2xl font-bold mb-4 text-white">Os mais baixados</h2>
            {loading ? (
              <p className="text-white/60">Carregando...</p>
            ) : (
              <EbookCarousel books={maisBaixados} />
            )}
          </section>
        )}
      </main>
      <WhatsAppButton />
    </>
  );
}
