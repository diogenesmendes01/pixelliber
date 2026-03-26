import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Image
            src="/Logo-CodeWave-06.png"
            alt="CodeWave Technologies"
            width={180}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </Link>
        <Link
          href="/login"
          className="rounded-md bg-white/10 px-6 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
