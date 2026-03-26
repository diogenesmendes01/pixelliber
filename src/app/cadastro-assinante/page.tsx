import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Cadastro de Assinante — CodeWave Technologies",
};

export default function CadastroAssinantePage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-4 pt-20 pb-20">
        <div className="w-full max-w-lg">
          <div className="rounded-lg bg-zinc-900 p-8 shadow-xl">
            <h4 className="mb-6 text-center text-2xl font-semibold">
              Cadastro de Assinante
            </h4>

            <form className="space-y-5">
              <div>
                <label
                  htmlFor="nome"
                  className="mb-1 block text-sm text-gray-300"
                >
                  Nome completo
                </label>
                <input
                  id="nome"
                  type="text"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm text-gray-300"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="cnpj"
                  className="mb-1 block text-sm text-gray-300"
                >
                  CNPJ
                </label>
                <input
                  id="cnpj"
                  type="text"
                  placeholder="00.000.000/0000-00"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className="mb-1 block text-sm text-gray-300"
                >
                  Senha
                </label>
                <input
                  id="senha"
                  type="password"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmar-senha"
                  className="mb-1 block text-sm text-gray-300"
                >
                  Confirmar senha
                </label>
                <input
                  id="confirmar-senha"
                  type="password"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                Cadastrar
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-400">
                Já tem uma conta?{" "}
                <a
                  href="/login"
                  className="text-white underline transition hover:text-gray-300"
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
