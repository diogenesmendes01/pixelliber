import Image from "next/image";

export default function DownloadSection() {
  return (
    <section className="bg-[#1a1a1a] px-6 py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row">
        <div className="relative flex flex-1 items-center justify-center">
          <Image
            src="/ipad-90373262.png"
            alt="iPad com e-book"
            width={400}
            height={300}
            className="w-full max-w-sm"
          />
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-black/80 px-4 py-3 shadow-lg">
            <Image
              src="/download-icon.gif"
              alt="Download animação"
              width={40}
              height={40}
              unoptimized
              className="h-10 w-10"
            />
            <Image
              src="/download-bar.png"
              alt="Barra de download"
              width={200}
              height={20}
              className="h-5 w-auto"
            />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold md:text-4xl">
            Baixe para ler depois
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Você também pode baixar para ler depois, mesmo sem acesso a
            internet.
          </p>
        </div>
      </div>
    </section>
  );
}
