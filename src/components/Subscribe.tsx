import Image from "next/image";
import Link from "next/link";

export default function Subscribe() {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row">
        <div className="flex-1">
          <Image
            src="/quero-assinar.png"
            alt="Quero assinar"
            width={601}
            height={496}
            className="mx-auto w-full max-w-md rounded-lg"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold md:text-4xl">
            Quer ter acesso a diversos e-books?
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Faça seu cadastro na página de contato.
          </p>
          <Link
            href="/contato"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-red-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-red-700"
          >
            Quero assinar!
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
