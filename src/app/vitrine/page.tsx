"use client";

import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useRef } from "react";

const populares = [
  { title: "Pai rico, Pai pobre", cover: "/ebooks/pai-rico-pai-pobre.jpg" },
  { title: "A felicidade começa com você", cover: "/ebooks/livros-mais-vendidos-em-2022.jpg" },
  { title: "Autoridade no Youtube", cover: "/ebooks/Autoridade-no-Youtube-1.jpg" },
  { title: "Sucesso os negocios de coaching", cover: "/ebooks/sucesso-os-negocios-de-coaching-1.jpg" },
  { title: "COPYWRINTING destruindo objeções", cover: "/ebooks/COPYWRINTING-destruindo-objeções-1.jpg" },
  { title: "Como parar de se preocupar", cover: "/ebooks/Como-parar-de-se-preocupar-com-que-as-pessoas-pensam-sobre-você-1.jpg" },
  { title: "Do ponto zero a conversão", cover: "/ebooks/Do-ponto-zero-a-conversão-1.jpg" },
  { title: "10 maneiras de atrair", cover: "/ebooks/10-maneiras-de-atrair-as-coisas-que-você-realmente-deseja-na-sua-vida-1.jpg" },
  { title: "Segredo da persuasão", cover: "/ebooks/Segredo-da-persuasão-1.jpg" },
  { title: "Controlando a Ansiedade", cover: "/ebooks/Controlando-a-Ansiedade-1.jpg" },
];

const baixados = [
  { title: "ORGANIZZE Saia do vermelho", cover: "/ebooks/ORGANIZZE-Saia-do-vermelho.jpg" },
  { title: "Desenvolva seu QI financeiro", cover: "/ebooks/Desenvolva-seu-QI-financeiro.jpg" },
  { title: "Encontrando Dinheiro", cover: "/ebooks/Encontrando-Dinheiro.jpg" },
  { title: "Extração de dinheiro", cover: "/ebooks/Extração-de-dinheiro.png" },
  { title: "Liberte o gigante financeiro interior", cover: "/ebooks/Liberte-o-gigante-financeiro-interior.png" },
  { title: "O poder do dinheiro extra", cover: "/ebooks/Dinheiro-o-poder-do-dinheiro-extra.jpg" },
  { title: "Tiktok Marketing", cover: "/ebooks/Tiktok-Marketing-como-o-usar-o-poder-do-1.jpg" },
  { title: "Orçamento Familiar", cover: "/ebooks/Orçamento-Familiar.png" },
  { title: "101 Maneiras de investir na bolsa", cover: "/ebooks/101-Maneiras-de-investir-na-bolsa.png" },
];

function EbookCarousel({ books }: { books: { title: string; cover: string }[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Anterior"
      >
        ‹
      </button>

      <div ref={scrollRef} className="carousel-scroll">
        {books.map((book, i) => (
          <div
            key={i}
            className="ebook-card"
            style={{
              width: "calc((100% - 60px) / 6)",
              minWidth: "160px",
            }}
          >
            <div className="relative aspect-[3/4]">
              <Image
                src={book.cover}
                alt={book.title}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Right arrow */}
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
  return (
    <>
      {/* Header */}
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
          {/* Gradient overlay */}
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

        {/* Os mais populares */}
        <section id="populares" className="px-6 md:px-12 py-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Os mais populares</h2>
          <EbookCarousel books={populares} />
        </section>

        {/* Os mais baixados */}
        <section className="px-6 md:px-12 py-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Os mais baixados</h2>
          <EbookCarousel books={baixados} />
        </section>
      </main>
      <WhatsAppButton />
    </>
  );
}
