import LogoutButton from "./LogoutButton";
import BookCover from "@/components/BookCover";
import Logo from "@/components/Logo";
import { BOOKS } from "@/lib/books-data";

export const metadata = {
  title: "Acesso bloqueado — Pixel Liber",
};

export default function AcessoBloqueadoPage() {
  const stackBooks = BOOKS.slice(0, 9);

  return (
    <div className="auth-shell">
      <div
        className="auth-brand"
        style={{ background: "linear-gradient(160deg, oklch(0.28 0.12 25), var(--ink) 70%)" }}
      >
        <Logo variant="on-colored" size="sm" />
        <div className="stack-deco">
          {stackBooks.map((b) => (
            <BookCover key={b.id} book={b} href="#" style={{ width: 60 }} />
          ))}
        </div>
        <div>
          <h2>
            Acesso<br />
            temporariamente<br />
            pausado.
          </h2>
          <p>Assinatura inativa — fale com o suporte para reativar.</p>
        </div>
        <div className="tag" style={{ color: "var(--muted)" }}>EST. 2024 · PIXEL LIBER</div>
      </div>

      <div className="auth-form">
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "oklch(0.94 0.06 25)",
            color: "oklch(0.45 0.18 25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            marginBottom: 18,
            border: "1px solid oklch(0.85 0.1 25)",
          }}
        >
          ⛌
        </div>
        <h3>Acesso bloqueado</h3>
        <p className="sub">
          Sua assinatura corporativa está inativa. Para acessar o catálogo, reative o plano ou entre em contato com o suporte.
        </p>

        <div
          style={{
            background: "oklch(0.98 0.015 25)",
            border: "1px solid oklch(0.9 0.04 25)",
            borderRadius: 10,
            padding: 16,
            marginBottom: 14,
          }}
        >
          <div className="flex-between" style={{ fontSize: 12 }}>
            <span className="tag">Status</span>
            <span style={{ fontWeight: 500, color: "oklch(0.45 0.18 25)" }}>inativo</span>
          </div>
          <div className="flex-between" style={{ fontSize: 12, marginTop: 6 }}>
            <span className="tag">Suporte</span>
            <span style={{ fontWeight: 500 }}>suporte@pixelliber.com.br</span>
          </div>
          <div className="flex-between" style={{ fontSize: 12, marginTop: 6 }}>
            <span className="tag">Horário</span>
            <span style={{ fontWeight: 500 }}>Seg–Sex · 9h às 18h</span>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55, margin: "0 0 18px" }}>
          Se seu plano foi renovado recentemente, aguarde alguns minutos e recarregue. Se o problema persistir, fale conosco.
        </p>

        <div className="flex wrap" style={{ gap: 10 }}>
          <a
            href="https://wa.me/5519971273953?text=Olá!%20Meu%20acesso%20à%20Pixel%20Liber%20foi%20bloqueado%20por%20assinatura%20inativa."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ink"
          >
            Falar com suporte →
          </a>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
