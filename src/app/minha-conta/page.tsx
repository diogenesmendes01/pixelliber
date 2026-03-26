import Link from "next/link";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Minha Conta — CodeWave Technologies",
};

const menuItems = [
  { label: "Vitrine", href: "/vitrine", icon: "📚" },
  { label: "Minha Conta", href: "/minha-conta", icon: "👤", active: true },
  { label: "Sair", href: "/login", icon: "🚪" },
];

export default function MinhaContaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 md:w-64">
            <nav className="rounded-lg bg-zinc-900 p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition ${
                        item.active
                          ? "bg-purple-600/20 text-purple-400"
                          : "text-gray-300 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            <div className="rounded-lg bg-zinc-900 p-8">
              <h1 className="mb-4 text-2xl font-bold">Minha Conta</h1>
              <p className="text-gray-300">
                Esse é o painel da sua conta. Aqui você pode acessar a vitrine
                de e-books, gerenciar suas informações e acompanhar sua
                assinatura.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Link
                  href="/vitrine"
                  className="rounded-lg border border-zinc-700 p-6 transition hover:border-purple-500 hover:bg-zinc-800"
                >
                  <h3 className="mb-2 font-semibold">📚 Vitrine</h3>
                  <p className="text-sm text-gray-400">
                    Acesse todos os e-books disponíveis
                  </p>
                </Link>
                <div className="rounded-lg border border-zinc-700 p-6">
                  <h3 className="mb-2 font-semibold">👤 Dados da Conta</h3>
                  <p className="text-sm text-gray-400">
                    Gerencie suas informações pessoais
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
