import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Minha Conta — CodeWave Technologies",
};

export default function MinhaContaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          {/* 3 Action Cards */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <Link href="/vitrine" className="action-card">
              <Image
                src="/icons/home-icon-silhouette.svg"
                alt="Vitrine"
                width={40}
                height={40}
                style={{ width: "40px", height: "40px", filter: "invert(1)" }}
              />
              <span className="font-semibold text-sm">Vitrine</span>
            </Link>
            <Link href="/minha-conta" className="action-card" style={{ border: "2px solid #57E4FF" }}>
              <Image
                src="/icons/user.svg"
                alt="Minha Conta"
                width={40}
                height={40}
                style={{ width: "40px", height: "40px", filter: "invert(1)" }}
              />
              <span className="font-semibold text-sm">Minha Conta</span>
            </Link>
            <Link href="/login" className="action-card">
              <Image
                src="/icons/logout.svg"
                alt="Sair"
                width={40}
                height={40}
                style={{ width: "40px", height: "40px", filter: "invert(1)" }}
              />
              <span className="font-semibold text-sm">Sair</span>
            </Link>
          </div>

          {/* Account Section */}
          <div className="account-section">
            <h2 className="text-2xl font-bold mb-2">Minha Conta</h2>
            <p className="text-gray-300 mb-8">
              Esse é o painel da sua conta. Aqui você pode acessar a vitrine de
              e-books, gerenciar suas informações e acompanhar sua assinatura.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Nome completo</label>
                <input type="text" placeholder="Seu nome" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">E-mail</label>
                <input type="email" placeholder="Seu e-mail" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Senha atual (deixe em branco para não alterar)</label>
                <input type="password" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Nova senha (deixe em branco para não alterar)</label>
                <input type="password" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Confirmar nova senha</label>
                <input type="password" />
              </div>
              <button className="btn-blue">Salvar alterações</button>
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
