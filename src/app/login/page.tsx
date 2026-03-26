import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Entrar — CodeWave Technologies",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-zinc-900 p-8 shadow-xl">
            <h4 className="mb-6 text-center text-2xl font-semibold">Entrar</h4>

            <form className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm text-gray-300"
                >
                  Nome de usuário ou endereço de e-mail
                </label>
                <input
                  id="username"
                  type="text"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm text-gray-300"
                >
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-purple-500 focus:ring-purple-500"
                />
                <label htmlFor="remember" className="text-sm text-gray-300">
                  Lembrar-me
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                Entrar
              </button>
            </form>

            <div className="mt-4 text-center">
              <a
                href="/esqueceu-senha"
                className="text-sm text-gray-400 underline transition hover:text-white"
              >
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Dica: Se esse é o seu primeiro acesso, use o seu CNPJ para o usuário
            e senha.*
          </p>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
