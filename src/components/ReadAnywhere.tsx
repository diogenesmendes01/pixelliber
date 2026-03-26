export default function ReadAnywhere() {
  return (
    <section className="bg-black px-6 py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold md:text-4xl">Leia onde quiser</h2>
          <p className="mt-4 text-lg text-gray-300">
            Você pode ler em qualquer dispositivo que tenha acesso a um
            navegador.
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex h-56 w-full max-w-md items-center justify-center rounded-lg bg-gray-800/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
