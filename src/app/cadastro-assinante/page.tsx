import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Cadastro de Assinante — Pixel Liber",
};

export default function CadastroAssinantePage() {
  return (
    <>
      <main
        className="relative flex min-h-screen items-center justify-center px-4 py-20"
        style={{
          backgroundImage: "url('/bg/covers-ebooks-9363.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        />

        <div className="relative z-10 w-full" style={{ maxWidth: "450px" }}>
          <div
            style={{
              backgroundColor: "rgba(0, 0, 1, 0.8)",
              padding: "60px 20px",
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

            <h4
              className="mb-6 text-center text-2xl font-semibold"
              style={{ color: "#E7D7D7" }}
            >
              Cadastro de Assinante
            </h4>

            <form className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder="Nome completo"
                  className="input-cadastro"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="E-mail"
                  className="input-cadastro"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="CNPJ"
                  className="input-cadastro"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Senha"
                  className="input-cadastro"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirmar senha"
                  className="input-cadastro"
                />
              </div>

              <button type="submit" className="btn-gradient w-full py-3">
                Cadastrar
              </button>
            </form>

            <div className="mt-4 text-center">
              <span style={{ color: "#7F7878", fontSize: "14px" }}>
                Já tem uma conta?{" "}
                <a
                  href="/login"
                  style={{ color: "#D4AF37" }}
                  className="transition hover:opacity-80"
                >
                  Entrar
                </a>
              </span>
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
