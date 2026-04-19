"use client";

import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function VitrineDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchEbook() {
      try {
        const res = await fetch(`/api/ebooks/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setEbook(data);
      } catch (error) {
        console.error("Error fetching ebook:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchEbook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <p className="text-white text-lg">Carregando...</p>
      </div>
    );
  }

  if (notFound || !ebook) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center">
        <h1 className="text-white text-3xl font-bold mb-4">
          E-book não encontrado
        </h1>
        <Link
          href="/vitrine"
          className="text-white underline hover:opacity-80"
        >
          Voltar para a vitrine
        </Link>
      </div>
    );
  }

  const tags = ebook.tags.split(",").map((t) => t.trim());

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
          <Link href="/vitrine" className="text-white hover:opacity-80">
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="min-h-screen bg-[#121212] pt-20">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div
            className="grid gap-12"
            style={{ gridTemplateColumns: "300px 1fr" }}
          >
            {/* Capa */}
            <div>
              <div
                className="relative aspect-[3/4]"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src={ebook.capa}
                  alt={ebook.titulo}
                  fill
                  className="object-cover"
                  sizes="400px"
                  priority
                />
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={`/api/ebooks/${id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition hover:opacity-90"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  Ler Agora
                </a>
                <a
                  href={`/api/ebooks/${id}/pdf`}
                  download
                  className="flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition hover:opacity-90"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Baixar PDF
                </a>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="mb-2">
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                  }}
                >
                  {ebook.categoria}
                </span>
              </div>

              <h1
                className="text-white font-bold leading-tight mb-4"
                style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
              >
                {ebook.titulo}
              </h1>

              <p className="text-white/60 text-lg mb-6">Por {ebook.autor}</p>

              <div className="flex flex-wrap gap-4 mb-8 text-white/50 text-sm">
                <span>{ebook.numeroPaginas} páginas</span>
                <span>•</span>
                <span>
                  {new Date(ebook.dataPublicacao).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span>•</span>
                <span>{ebook.contadorDownloads.toLocaleString("pt-BR")} downloads</span>
              </div>

              <p
                className="text-white/80 leading-relaxed mb-8"
                style={{ fontSize: "16px", lineHeight: 1.8 }}
              >
                {ebook.descricao}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full px-3 py-1 text-xs"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Related / Back */}
              <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <Link
                  href="/vitrine"
                  className="text-white hover:opacity-80 flex items-center gap-2"
                >
                  ← Ver todos os e-books
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
