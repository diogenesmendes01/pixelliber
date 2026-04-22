import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Acesso Bloqueado — Pixel Liber",
};

// Client component so it can call the logout API before redirecting
import LogoutButton from "./LogoutButton";

export default function AcessoBloqueadoPage() {
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
          style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
        />

        <div className="relative z-10 w-full" style={{ maxWidth: "460px" }}>
          {/* Card */}
          <div
            style={{
              backgroundColor: "rgba(18, 18, 18, 0.95)",
              padding: "60px 30px",
              borderRadius: "5px",
              border: "1px solid rgba(212, 175, 55, 0.3)",
            }}
          >
            {/* Lock icon */}
            <div className="mb-6 flex justify-center">
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(212, 175, 55, 0.15)",
                  border: "2px solid #D4AF37",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#D4AF37"
                  style={{ width: "36px", height: "36px" }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.5 4A4.5 4.5 0 005 8.5v3.357H3.5a.5.5 0 000 1H5v2.643A4.5 4.5 0 009.5 20h5a4.5 4.5 0 004.5-3.5V13.5a.5.5 0 001 0v3.357A4.5 4.5 0 0014.5 8.5V8a4 4 0 00-5 0v-.5C8.5 5.015 8.5 4 9.5 4zm0 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM6 8.5a3 3 0 016 0v3.357H6V8.5z"
                  />
                </svg>
              </div>
            </div>

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

            <h2
              className="mb-4 text-center text-2xl font-bold"
              style={{ color: "#D4AF37" }}
            >
              Acesso Suspenso
            </h2>

            <p
              className="mb-8 text-center"
              style={{ color: "#E7D7D7", fontSize: "15px", lineHeight: "1.7" }}
            >
              Sua assinatura está inativa. Para acessar a vitrine de e-books,
              é necessário ter uma assinatura ativa. Entre em contato com nosso
              suporte para mais informações.
            </p>

            {/* Support button */}
            <a
              href="https://wa.me/5519971273953?text=Olá!%20Meu%20acesso%20à%20vitrine%20Pixel%20Liber%20foi%20bloqueado%20por%20assinatura%20inativa.%20Gostaria%20de%20mais%20informações."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient w-full flex items-center justify-center gap-3 py-3 mb-4"
              style={{ textDecoration: "none" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="h-5 w-5 fill-white"
              >
                <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.914 15.914 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.608c-.39 1.1-1.932 2.014-3.164 2.282-.844.178-1.946.322-5.656-1.216-4.748-1.966-7.806-6.78-8.04-7.094-.226-.314-1.888-2.516-1.888-4.798s1.194-3.404 1.618-3.87c.39-.426.912-.62 1.218-.62.148 0 .28.008.4.014.424.018.636.042.916.71.35.834 1.204 2.934 1.31 3.148.106.214.212.504.066.79-.14.292-.264.422-.478.672-.214.25-.418.44-.632.712-.196.236-.416.488-.178.916.238.424 1.058 1.748 2.272 2.83 1.562 1.392 2.878 1.824 3.288 2.024.312.152.684.128.93-.128.31-.328.694-.87 1.084-1.406.278-.382.628-.43.97-.292.346.13 2.188 1.032 2.564 1.22.376.188.626.28.718.438.09.156.09.904-.302 2.004z" />
              </svg>
              Falar com Suporte
            </a>

            {/* Logout link */}
            <div className="text-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
