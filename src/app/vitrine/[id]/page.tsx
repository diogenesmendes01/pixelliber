"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";

const ebooks = [
  {
    id: "pai-rico-pai-pobre",
    title: "Pai rico, Pai pobre",
    cover: "/ebooks/pai-rico-pai-pobre.jpg",
    pdf: "/ebooks/pai-rico-pai-pobre.pdf",
    description: "Um dos livros mais influenceiros sobre finanças pessoais, ensina lecciones fundamentales sobre dinheiro e investimentos.",
    pages: 256,
    year: 2022,
  },
  {
    id: "a-felicidade-comeca-com-voce",
    title: "A felicidade começa com você",
    cover: "/ebooks/livros-mais-vendidos-em-2022.jpg",
    pdf: "/ebooks/a-felicidade-comeca-com-voce.pdf",
    description: "Descubra como a felicidade genuína vem de dentro e aprenda a construir uma vida mais plena e significativa.",
    pages: 180,
    year: 2022,
  },
  {
    id: "autoridade-no-youtube",
    title: "Autoridade no Youtube",
    cover: "/ebooks/Autoridade-no-Youtube-1.jpg",
    pdf: "/ebooks/autoridade-no-youtube.pdf",
    description: "Aprenda a construir autoridade eGrow seu canal no YouTube com estratégias comprovadas de conteúdo.",
    pages: 220,
    year: 2023,
  },
  {
    id: "sucesso-os-negocios-de-coaching",
    title: "Sucesso os negócios de coaching",
    cover: "/ebooks/sucesso-os-negocios-de-coaching-1.jpg",
    pdf: "/ebooks/sucesso-os-negocios-de-coaching.pdf",
    description: "Guia completo para transformer seu conhecimento em um negócio lucrativo de coaching.",
    pages: 198,
    year: 2023,
  },
  {
    id: "copywriting-destruindo-objecoes",
    title: "COPYWRINTING destruindo objeções",
    cover: "/ebooks/COPYWRINTING-destruindo-objeções-1.jpg",
    pdf: "/ebooks/copywriting-destruindo-objecoes.pdf",
    description: "Domine a arte do copywriting e-learn a eliminar objeções dos seus clientes de uma vez por todas.",
    pages: 240,
    year: 2023,
  },
  {
    id: "como-parar-de-se-preocupar",
    title: "Como parar de se preocupar",
    cover: "/ebooks/Como-parar-de-se-preocupar-com-que-as-pessoas-pensam-sobre-você-1.jpg",
    pdf: "/ebooks/como-parar-de-se-preocupar.pdf",
    description: "Técnicas práticas para superar a ansiedade e vivir sin preocupaciones.",
    pages: 165,
    year: 2022,
  },
  {
    id: "do-ponto-zero-a-conversao",
    title: "Do ponto zero a conversão",
    cover: "/ebooks/Do-ponto-zero-a-conversão-1.jpg",
    pdf: "/ebooks/do-ponto-zero-a-conversao.pdf",
    description: "O guia definitivo para iniciar seu negócio digital do zero e alcançar suas primeiras conversues.",
    pages: 300,
    year: 2023,
  },
  {
    id: "10-maneiras-de-atrair",
    title: "10 maneiras de atrair",
    cover: "/ebooks/10-maneiras-de-atrair-as-coisas-que-você-realmente-deseja-na-sua-vida-1.jpg",
    pdf: "/ebooks/10-maneiras-de-atrair.pdf",
    description: "Descubra 10 estratégias comprovadas para attract as coisas que você deseja na vida.",
    pages: 142,
    year: 2022,
  },
  {
    id: "segredo-da-persulsao",
    title: "Segredo da persuasão",
    cover: "/ebooks/Segredo-da-persuasão-1.jpg",
    pdf: "/ebooks/segredo-da-persulsao.pdf",
    description: "Os segredos psicológicos da persuasão que você pode aplicar em qualquer área da vida.",
    pages: 188,
    year: 2023,
  },
  {
    id: "controlando-a-ansiedade",
    title: "Controlando a Ansiedade",
    cover: "/ebooks/Controlando-a-Ansiedade-1.jpg",
    pdf: "/ebooks/controlando-a-ansiedade.pdf",
    description: "Ferramentas práticas para controlar a ansiedade e recuperar seu bem-estar emocional.",
    pages: 155,
    year: 2022,
  },
  {
    id: "organizze-saia-do-vermelho",
    title: "ORGANIZZE Saia do vermelho",
    cover: "/ebooks/ORGANIZZE-Saia-do-vermelho.jpg",
    pdf: "/ebooks/organizze-saia-do-vermelho.pdf",
    description: "Aprenda a organizar suas finanças, sair das dívidas e construir um futuro financeiro sólido.",
    pages: 210,
    year: 2022,
  },
  {
    id: "desenvolva-seu-qi-financeiro",
    title: "Desenvolva seu QI financeiro",
    cover: "/ebooks/Desenvolva-seu-QI-financeiro.jpg",
    pdf: "/ebooks/desenvolva-seu-qi-financeiro.pdf",
    description: "Desenvolva sua inteligência financeira e tome melhores decisões sobre seu dinheiro.",
    pages: 175,
    year: 2022,
  },
  {
    id: "encontrando-dinheiro",
    title: "Encontrando Dinheiro",
    cover: "/ebooks/Encontrando-Dinheiro.jpg",
    pdf: "/ebooks/encontrando-dinheiro.pdf",
    description: "Strategies para aumentar sua renda e encontrar novas oportunidades financeiras.",
    pages: 130,
    year: 2023,
  },
  {
    id: "extracao-de-dinheiro",
    title: "Extração de dinheiro",
    cover: "/ebooks/Extração-de-dinheiro.png",
    pdf: "/ebooks/extracao-de-dinheiro.pdf",
    description: "Técnicas avançadas de extração de valor do mercado para seus negócios.",
    pages: 195,
    year: 2023,
  },
  {
    id: "liberte-o-gigante-financeiro-interior",
    title: "Liberte o gigante financeiro interior",
    cover: "/ebooks/Liberte-o-gigante-financeiro-interior.png",
    pdf: "/ebooks/liberte-o-gigante-financeiro-interior.pdf",
    description: "Desperte seu potencial financeiro interior e alcance a liberdade que você merece.",
    pages: 225,
    year: 2023,
  },
  {
    id: "o-poder-do-dinheiro-extra",
    title: "O poder do dinheiro extra",
    cover: "/ebooks/Dinheiro-o-poder-do-dinheiro-extra.jpg",
    pdf: "/ebooks/o-poder-do-dinheiro-extra.pdf",
    description: "Descubra como cada real extra pode se transformar em riqueza ao longo do tempo.",
    pages: 168,
    year: 2022,
  },
  {
    id: "tiktok-marketing",
    title: "Tiktok Marketing",
    cover: "/ebooks/Tiktok-Marketing-como-o-usar-o-poder-do-1.jpg",
    pdf: "/ebooks/tiktok-marketing.pdf",
    description: "Como usar o poder do TikTok para Grow seu negócio e atrair novos clientes.",
    pages: 190,
    year: 2023,
  },
  {
    id: "orcamento-familiar",
    title: "Orçamento Familiar",
    cover: "/ebooks/Orçamento-Familiar.png",
    pdf: "/ebooks/orcamento-familiar.pdf",
    description: "Planeje suas finanças familiares de forma prática e eficiente com este guia completo.",
    pages: 145,
    year: 2022,
  },
  {
    id: "101-maneiras-de-investir-na-bolsa",
    title: "101 Maneiras de investir na bolsa",
    cover: "/ebooks/101-Maneiras-de-investir-na-bolsa.png",
    pdf: "/ebooks/101-maneiras-de-investir-na-bolsa.pdf",
    description: "101 estratégias diferentes para investir na bolsa de valores e fazer seu dinheiro trabalhar.",
    pages: 280,
    year: 2023,
  },
];

export default function VitrineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;
  const ebook = ebooks.find((e) => e.id === id);

  if (!ebook) {
    return (
      <>
        <main className="min-h-screen bg-[#121212] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">E-book não encontrado</h1>
            <Link href="/vitrine" className="text-[#D4AF37] hover:underline">
              Voltar para a Vitrine
            </Link>
          </div>
        </main>
        <WhatsAppButton />
      </>
    );
  }

  const handleReadNow = () => {
    // Ler Agora - opens PDF in new tab (inline)
    const pdfUrl = `/api/ebooks/${id}/pdf`;
    window.open(pdfUrl, "_blank");
  };

  const handleDownload = async () => {
    // Baixar PDF - triggers download
    setLoading(true);
    setError(null);
    try {
      const pdfUrl = `/api/ebooks/${id}/pdf?download=1`;
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        if (response.status === 403) {
          setError("Assinatura ativa necessária para baixar.");
          return;
        }
        throw new Error(data.error || "Falha ao baixar PDF.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao baixar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#121212]">
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

        <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/vitrine" className="text-[#D4AF37] hover:underline text-sm">
              ← Voltar para Vitrine
            </Link>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Cover */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={ebook.cover}
                alt={ebook.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <h1
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "'Flix-Sans', sans-serif" }}
              >
                {ebook.title}
              </h1>

              <div className="flex gap-4 text-sm text-gray-400 mb-6">
                <span>{ebook.pages} páginas</span>
                <span>•</span>
                <span>{ebook.year}</span>
              </div>

              <p className="text-gray-300 text-base leading-relaxed mb-8">
                {ebook.description}
              </p>

              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleReadNow}
                  className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-black transition hover:opacity-90"
                  style={{ backgroundColor: "#D4AF37", fontSize: "16px" }}
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
                </button>

                <button
                  onClick={handleDownload}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition border-2 hover:opacity-90"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#D4AF37",
                    color: "#D4AF37",
                    fontSize: "16px",
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
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
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {loading ? "Baixando..." : "Baixar PDF"}
                </button>
              </div>

              {/* Subscription note */}
              <p className="mt-4 text-xs text-gray-500 text-center">
                Disponível para assinantes ativos.{" "}
                <Link href="/cadastro-assinante" className="text-[#D4AF37] hover:underline">
                  Assine agora
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
