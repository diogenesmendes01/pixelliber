import Image from "next/image";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Vitrine — CodeWave Technologies",
};

const ebooks = [
  {
    title: "A felicidade começa com você",
    cover: "/ebooks/livros-mais-vendidos-em-2022.jpg",
  },
  {
    title: "Autoridade no Youtube",
    cover: "/ebooks/Autoridade-no-Youtube-1.jpg",
  },
  {
    title: "Sucesso os negocios de coaching",
    cover: "/ebooks/sucesso-os-negocios-de-coaching-1.jpg",
  },
  {
    title: "COPYWRINTING destruindo objeções",
    cover: "/ebooks/COPYWRINTING-destruindo-objeções-1.jpg",
  },
  {
    title: "Como parar de se preocupar com que as pessoas pensam sobre você",
    cover:
      "/ebooks/Como-parar-de-se-preocupar-com-que-as-pessoas-pensam-sobre-você-1.jpg",
  },
  {
    title: "Do ponto zero a conversão",
    cover: "/ebooks/Do-ponto-zero-a-conversão-1.jpg",
  },
  {
    title:
      "10 maneiras de atrair as coisas que você realmente deseja na sua vida",
    cover:
      "/ebooks/10-maneiras-de-atrair-as-coisas-que-você-realmente-deseja-na-sua-vida-1.jpg",
  },
  {
    title: "Segredo da persuasão",
    cover: "/ebooks/Segredo-da-persuasão-1.jpg",
  },
  {
    title: "Controlando a Ansiedade",
    cover: "/ebooks/Controlando-a-Ansiedade-1.jpg",
  },
  {
    title: "ORGANIZZE Saia do vermelho",
    cover: "/ebooks/ORGANIZZE-Saia-do-vermelho.jpg",
  },
  {
    title: "Desenvolva seu QI financeiro",
    cover: "/ebooks/Desenvolva-seu-QI-financeiro.jpg",
  },
  {
    title: "Encontrando Dinheiro",
    cover: "/ebooks/Encontrando-Dinheiro.jpg",
  },
  {
    title: "Liberte o gigante financeiro interior",
    cover: "/ebooks/Liberte-o-gigante-financeiro-interior.png",
  },
  {
    title: "O poder do dinheiro extra",
    cover: "/ebooks/Dinheiro-o-poder-do-dinheiro-extra.jpg",
  },
  {
    title: "Tiktok Marketing",
    cover: "/ebooks/Tiktok-Marketing-como-o-usar-o-poder-do-1.jpg",
  },
  {
    title: "Orçamento Familiar",
    cover: "/ebooks/Orçamento-Familiar.png",
  },
  {
    title: "101 Maneiras de investir na bolsa",
    cover: "/ebooks/101-Maneiras-de-investir-na-bolsa.png",
  },
  {
    title: "Pai rico, Pai pobre",
    cover: "/ebooks/pai-rico-pai-pobre.jpg",
  },
];

function EbookCard({ title, cover }: { title: string; cover: string }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-lg bg-zinc-800 shadow-lg transition-transform group-hover:scale-105">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
        />
      </div>
      <h3 className="text-sm font-medium text-gray-300 transition group-hover:text-white line-clamp-2">
        {title}
      </h3>
    </div>
  );
}

export default function VitrinePage() {
  const populares = ebooks.slice(0, 9);
  const baixados = ebooks.slice(9);

  return (
    <>
      <Header />
      <main className="min-h-screen px-6 pt-28 pb-20">
        <div className="mx-auto max-w-6xl">
          {/* Profile section */}
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-purple-500">
              <Image
                src="/Avatar-perfil.png"
                alt="Avatar de perfil"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="mb-4 text-2xl font-bold md:text-3xl">
              Você tem acesso a todos os e-books, sem limite!
            </h1>
            <button className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              Aproveite a sua leitura
            </button>
          </div>

          {/* Os mais populares */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-bold">Os mais populares</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {populares.map((ebook, i) => (
                <EbookCard key={i} title={ebook.title} cover={ebook.cover} />
              ))}
            </div>
          </section>

          {/* Os mais baixados */}
          <section>
            <h2 className="mb-6 text-2xl font-bold">Os mais baixados</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {baixados.map((ebook, i) => (
                <EbookCard key={i} title={ebook.title} cover={ebook.cover} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
