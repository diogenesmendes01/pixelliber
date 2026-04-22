import LogoutButton from "./LogoutButton";

export const metadata = {
  title: "Acesso Bloqueado — Pixel Liber",
};

export default function AcessoBloqueadoPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--ink)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--gutter)",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div className="logo" style={{ color: "var(--paper)", marginBottom: 32 }}>
          <span className="logo-dot" />
          <span>Pixel Liber</span>
        </div>

        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid var(--line)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h2 className="serif" style={{ fontSize: "var(--h3)", margin: "0 0 10px", color: "var(--paper)" }}>
          Acesso suspenso
        </h2>
        <p style={{ fontSize: "var(--fs-md)", color: "var(--muted)", margin: "0 0 28px", lineHeight: 1.6, maxWidth: 340 }}>
          Sua assinatura está inativa. Para acessar a vitrine de e-books,
          entre em contato com o suporte para reativar.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a
            href="https://wa.me/5519971273953?text=Olá!%20Meu%20acesso%20à%20vitrine%20Pixel%20Liber%20foi%20bloqueado%20por%20assinatura%20inativa.%20Gostaria%20de%20mais%20informações."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--gold"
            style={{ justifyContent: "center", textDecoration: "none" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 32 32" fill="currentColor">
              <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.914 15.914 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.608c-.39 1.1-1.932 2.014-3.164 2.282-.844.178-1.946.322-5.656-1.216-4.748-1.966-7.806-6.78-8.04-7.094-.226-.314-1.888-2.516-1.888-4.798s1.194-3.404 1.618-3.87c.39-.426.912-.62 1.218-.62.148 0 .28.008.4.014.424.018.636.042.916.71.35.834 1.204 2.934 1.31 3.148.106.214.212.504.066.79-.14.292-.264.422-.478.672-.214.25-.418.44-.632.712-.196.236-.416.488-.178.916.238.424 1.058 1.748 2.272 2.83 1.562 1.392 2.878 1.824 3.288 2.024.312.152.684.128.93-.128.31-.328.694-.87 1.084-1.406.278-.382.628-.43.97-.292.346.13 2.188 1.032 2.564 1.22.376.188.626.28.718.438.09.156.09.904-.302 2.004z"/>
            </svg>
            Falar com suporte
          </a>

          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
