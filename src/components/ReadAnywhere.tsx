export default function ReadAnywhere() {
  return (
    <section className="bg-[#121212] px-6 py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold md:text-4xl">Leia onde quiser</h2>
          <p className="mt-4 text-lg text-gray-300">
            Você pode ler em qualquer dispositivo que tenha acesso a um
            navegador.
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md overflow-hidden rounded-lg">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            >
              <source src="/videos/ebook.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
