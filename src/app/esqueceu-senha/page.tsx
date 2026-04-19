import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Recuperar Senha — Pixel Liber",
};

export default function EsqueceuSenhaPage() {
  return (
    <>
      <main
        className="relative flex min-h-screen items-center justify-center px-4"
        style={{
          backgroundImage: "url('/bg/CAPA-AREA-DE-MEMBROS-GCSArtboard-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        />

        <div className="relative z-10 w-full" style={{ maxWidth: "400px" }}>
          {/* Card */}
          <div
            style={{
              backgroundColor: "rgba(18, 18, 18, 0.85)",
              padding: "80px 20px",
              borderRadius: "5px",
            }}
          >
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo/horizontal/horizontal-640x128.png"
                alt="Pixel Liber"
                width={140}
                height={24}
                priority
                style={{ width: "110px", height: "auto" }}
              />
            </div>

            <p
              className="mb-6 text-center"
              style={{ color: "#E7D7D7", fontSize: "14px" }}
            >
              Digite seu email para recuperar sua senha:
            </p>

            <form className="space-y-5">
              <div>
                <input
                  type="email"
                  placeholder="E-mail..."
                  className="input-login"
                />
              </div>

              <button type="submit" className="btn-gradient w-full py-3">
                Recuperar Senha
              </button>
            </form>

            <div className="mt-4 text-center">
              <a
                href="/login"
                style={{ color: "#7F7878", fontSize: "14px" }}
                className="transition hover:opacity-80"
              >
                Voltar para o login
              </a>
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
