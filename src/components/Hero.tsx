import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-black px-6 pt-20 text-center">
      <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
        Veja e baixe diversos e-books, sem limites
      </h1>
      <p className="mt-4 text-lg font-medium text-gray-300 md:text-xl">
        Veja onde quiser. Veja quando quiser.
      </p>
      <p className="mt-3 max-w-lg text-base text-gray-400">
        Quer ler? Faça seu login com as credenciais que você recebeu.
      </p>
      <Link
        href="/login"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-red-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-red-700"
      >
        Vamos ler
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
    </section>
  );
}
