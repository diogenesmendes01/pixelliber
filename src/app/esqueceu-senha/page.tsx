import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Recuperar Senha — CodeWave Technologies",
};

export default function EsqueceuSenhaPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-zinc-900 p-8 shadow-xl">
            <h4 className="mb-2 text-center text-2xl font-semibold">
              Recuperar senha
            </h4>
            <p className="mb-6 text-center text-sm text-gray-400">
              Informe seu nome de usuário ou e-mail para redefinir sua senha.
            </p>

            <form className="space-y-5">
              <div>
                <label
                  htmlFor="user"
                  className="mb-1 block text-sm text-gray-300"
                >
                  Nome de usuário ou endereço de e-mail
                </label>
                <input
                  id="user"
                  type="text"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                Recuperar senha
              </button>
            </form>

            <div className="mt-4 text-center">
              <a
                href="/login"
                className="text-sm text-gray-400 underline transition hover:text-white"
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
