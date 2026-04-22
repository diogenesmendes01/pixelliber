"use client";

import { useState } from "react";
import Link from "next/link";

interface HeaderProps {
  active?: string;
  role?: "guest" | "user" | "admin";
  userName?: string;
  userCompany?: string;
  userEmail?: string;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

export default function Header({
  active,
  role = "guest",
  userName = "",
  userCompany = "",
  userEmail = "",
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isGuest = role === "guest";
  const isAdmin = role === "admin";
  const isUser = !isGuest;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <header className="hdr" style={{ position: "relative" }}>
      <div className="container hdr-inner">
        <Link href={isGuest ? "/" : "/vitrine"} className="logo">
          <span className="logo-dot" />
          <span>Pixel Liber</span>
        </Link>

        <nav className="nav">
          {isGuest ? (
            <>
              <Link href="/#como" style={active === "como" ? { color: "var(--gold)" } : {}}>
                Como funciona
              </Link>
              <Link href="/#planos" style={active === "planos" ? { color: "var(--gold)" } : {}}>
                Planos
              </Link>
              <Link href="/contato" style={active === "contato" ? { color: "var(--gold)" } : {}}>
                Contato
              </Link>
            </>
          ) : (
            <>
              <Link href="/vitrine" style={active === "catalogo" ? { color: "var(--gold)" } : {}}>
                Catálogo
              </Link>
              {isAdmin && (
                <>
                  <Link href="/minha-conta/equipe" style={active === "equipe" ? { color: "var(--gold)" } : {}}>
                    Equipe
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        <div className="hdr-actions">
          {isGuest ? (
            <>
              <Link href="/login" className="btn btn--ghost btn--sm">
                Entrar
              </Link>
              <Link href="/#planos" className="btn btn--gold btn--sm">
                Assinar
              </Link>
            </>
          ) : (
            <>
              <button className="bell" aria-label="notificações">
                <span aria-hidden="true">🔔</span>
              </button>
              <div style={{ position: "relative" }}>
                <button
                  className="avatar-btn"
                  aria-label="perfil"
                  onClick={() => setProfileOpen((o) => !o)}
                >
                  <span
                    className="avatar"
                    style={{
                      background: "linear-gradient(145deg, var(--gold-2), var(--gold))",
                      color: "var(--ink)",
                    }}
                  >
                    {initials(userName)}
                  </span>
                  {isAdmin && <span className="avatar-badge">Admin</span>}
                </button>

                {profileOpen && (
                  <>
                    <div
                      style={{ position: "fixed", inset: 0, zIndex: 55 }}
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="profile-menu open" style={{ zIndex: 60 }}>
                      <div className="profile-head">
                        <span
                          className="avatar avatar--lg"
                          style={{
                            background: "linear-gradient(145deg, var(--gold-2), var(--gold))",
                            color: "var(--ink)",
                          }}
                        >
                          {initials(userName)}
                        </span>
                        <div>
                          <div className="profile-name">{userName}</div>
                          <div className="profile-sub">
                            {userCompany}
                            {isAdmin ? " · Administrador" : ""}
                          </div>
                          <div className="profile-email">{userEmail}</div>
                        </div>
                      </div>

                      <Link href="/minha-conta" className="profile-item" onClick={() => setProfileOpen(false)}>
                        <span className="profile-ico">👤</span> Minha conta
                      </Link>
                      {isAdmin ? (
                        <>
                          <Link href="/minha-conta/equipe" className="profile-item" onClick={() => setProfileOpen(false)}>
                            <span className="profile-ico">👥</span> Gerenciar equipe
                          </Link>
                        </>
                      ) : (
                        <Link href="/minha-conta" className="profile-item" onClick={() => setProfileOpen(false)}>
                          <span className="profile-ico">★</span> Meus marcadores
                        </Link>
                      )}

                      <div className="profile-sep" />
                      <button
                        className="profile-item profile-item--danger"
                        style={{ background: "none", border: 0, width: "100%", textAlign: "left", cursor: "pointer" }}
                        onClick={handleLogout}
                      >
                        <span className="profile-ico">⎋</span> Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          <button
            className="hamburger"
            aria-label="menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            ≡
          </button>
        </div>
      </div>

      <div className={`m-menu${menuOpen ? " open" : ""}`}>
        {isGuest ? (
          <>
            <Link href="/#como" onClick={() => setMenuOpen(false)}>Como funciona</Link>
            <Link href="/#planos" onClick={() => setMenuOpen(false)}>Planos</Link>
            <Link href="/contato" onClick={() => setMenuOpen(false)}>Contato</Link>
            <Link href="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
            <Link href="/#planos" className="btn btn--gold" onClick={() => setMenuOpen(false)}>Assinar</Link>
          </>
        ) : (
          <>
            <Link href="/vitrine" onClick={() => setMenuOpen(false)}>Catálogo</Link>
            {isAdmin && (
              <Link href="/minha-conta/equipe" onClick={() => setMenuOpen(false)}>Equipe</Link>
            )}
            <Link href="/minha-conta" onClick={() => setMenuOpen(false)}>Minha conta</Link>
            <button
              style={{ background: "none", border: 0, color: "var(--paper)", textAlign: "left", padding: "10px 4px", fontSize: 14, cursor: "pointer", borderBottom: "1px solid var(--line)" }}
              onClick={handleLogout}
            >
              Sair
            </button>
          </>
        )}
      </div>
    </header>
  );
}
