"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { initials } from "@/lib/utils";
import { useLogout } from "@/hooks/useLogout";

type NotifType = "novo" | "alerta" | "equipe" | "livro" | "sistema";

interface Notification {
  id: number;
  tipo: NotifType;
  titulo: string;
  desc: string;
  quando: string;
  lida: boolean;
  link?: string;
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    tipo: "novo",
    titulo: "3 novos títulos no acervo",
    desc: "\"TikTok Marketing\", \"Orçamento familiar\" e mais 1 foram adicionados.",
    quando: "há 2h",
    lida: false,
    link: "/vitrine",
  },
  {
    id: 2,
    tipo: "alerta",
    titulo: "Seu plano expira em 18 dias",
    desc: "Renove antes de 10/ago pra manter os 10 acessos ativos.",
    quando: "há 1 dia",
    lida: false,
    link: "/admin",
  },
  {
    id: 3,
    tipo: "equipe",
    titulo: "Um funcionário aceitou o convite",
    desc: "Já tem acesso ao acervo completo.",
    quando: "há 2 dias",
    lida: false,
    link: "/minha-conta/equipe",
  },
  {
    id: 4,
    tipo: "livro",
    titulo: "\"Pai rico, pai pobre\" concluído",
    desc: "Leitura finalizada em 6 dias (268 páginas).",
    quando: "há 4 dias",
    lida: true,
  },
  {
    id: 5,
    tipo: "sistema",
    titulo: "Manutenção programada · 12/ago 02h",
    desc: "Indisponibilidade curta durante atualização do leitor.",
    quando: "há 1 semana",
    lida: true,
  },
];

const NOTIF_ICON: Record<NotifType, string> = {
  novo: "★",
  alerta: "!",
  equipe: "+",
  livro: "✓",
  sistema: "⚙",
};

interface HeaderProps {
  active?: string;
  role?: "guest" | "user" | "admin";
  userName?: string;
  userCompany?: string;
  userEmail?: string;
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("pl-notifications");
    if (saved) {
      try { setNotifications(JSON.parse(saved)); } catch { /* noop */ }
    }
  }, []);

  function persistNotifs(next: Notification[]) {
    setNotifications(next);
    localStorage.setItem("pl-notifications", JSON.stringify(next));
  }

  function markAllRead() {
    persistNotifs(notifications.map((n) => ({ ...n, lida: true })));
  }

  function handleNotifClick(n: Notification) {
    persistNotifs(notifications.map((x) => (x.id === n.id ? { ...x, lida: true } : x)));
    setNotifOpen(false);
    if (n.link) {
      window.location.href = n.link;
    }
  }

  const unreadCount = notifications.filter((n) => !n.lida).length;

  const isGuest = role === "guest";
  const isAdmin = role === "admin";

  const handleLogout = useLogout();

  return (
    <header className={`hdr hdr--${role}`} style={{ position: "relative" }}>
      <div className="container hdr-inner">
        <Logo href={isGuest ? "/" : "/vitrine"} className="logo" />

        <nav className="nav">
          {isGuest ? (
            <>
              <Link href="/#como" className={active === "como" ? "gold-text" : ""}>
                Como funciona
              </Link>
              <Link href="/#planos" className={active === "planos" ? "gold-text" : ""}>
                Planos
              </Link>
              <Link href="/#contato" className={active === "contato" ? "gold-text" : ""}>
                Contato
              </Link>
            </>
          ) : (
            <>
              <Link href="/vitrine" className={active === "catalogo" ? "gold-text" : ""}>
                Catálogo
              </Link>
              {isAdmin && (
                <>
                  <Link href="/minha-conta/equipe" className={active === "equipe" ? "gold-text" : ""}>
                    Equipe
                  </Link>
                  <Link href="/admin" className={active === "admin" ? "gold-text" : ""}>
                    Admin
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
              <button
                className="bell"
                aria-label="notificações"
                onClick={() => {
                  setNotifOpen((o) => !o);
                  setProfileOpen(false);
                }}
              >
                <span aria-hidden="true">🔔</span>
                <span className={`bell-dot${unreadCount > 0 ? " on" : ""}`} />
              </button>
              <div style={{ position: "relative" }}>
                <button
                  className="avatar-btn"
                  aria-label="perfil"
                  onClick={() => {
                    setProfileOpen((o) => !o);
                    setNotifOpen(false);
                  }}
                >
                  <span className="avatar">{initials(userName)}</span>
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
                        <span className="avatar avatar--lg">
                          {initials(userName)}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div className="profile-name">{userName}</div>
                          <div className="profile-sub">
                            {userCompany}
                            {isAdmin ? " · Administradora" : ""}
                          </div>
                          <div className="profile-email">{userEmail}</div>
                        </div>
                      </div>

                      <Link
                        href="/minha-conta"
                        className="profile-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <span className="profile-ico">👤</span> Minha conta
                      </Link>
                      {isAdmin ? (
                        <>
                          <Link
                            href="/admin"
                            className="profile-item"
                            onClick={() => setProfileOpen(false)}
                          >
                            <span className="profile-ico">💳</span> Plano e cobrança
                          </Link>
                          <Link
                            href="/minha-conta/equipe"
                            className="profile-item"
                            onClick={() => setProfileOpen(false)}
                          >
                            <span className="profile-ico">👥</span> Gerenciar equipe
                          </Link>
                        </>
                      ) : (
                        <Link
                          href="/minha-conta#marcadores"
                          className="profile-item"
                          onClick={() => setProfileOpen(false)}
                        >
                          <span className="profile-ico">★</span> Meus marcadores
                        </Link>
                      )}
                      <Link
                        href="/#contato"
                        className="profile-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <span className="profile-ico">?</span> Ajuda
                      </Link>

                      <div className="profile-sep" />
                      <button
                        className="profile-item profile-item--danger"
                        style={{
                          background: "none",
                          border: 0,
                          width: "100%",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
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
            <Link href="/#contato" onClick={() => setMenuOpen(false)}>Contato</Link>
            <Link href="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
            <Link href="/#planos" className="btn btn--gold" onClick={() => setMenuOpen(false)}>Assinar</Link>
          </>
        ) : (
          <>
            <Link href="/vitrine" onClick={() => setMenuOpen(false)}>Catálogo</Link>
            {isAdmin && (
              <>
                <Link href="/minha-conta/equipe" onClick={() => setMenuOpen(false)}>Equipe</Link>
                <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
              </>
            )}
            <Link href="/minha-conta" onClick={() => setMenuOpen(false)}>Minha conta</Link>
            <button
              style={{
                background: "none",
                border: 0,
                color: "var(--paper)",
                textAlign: "left",
                padding: "10px 4px",
                fontSize: 14,
                cursor: "pointer",
                borderBottom: "1px solid var(--line)",
              }}
              onClick={handleLogout}
            >
              Sair
            </button>
          </>
        )}
      </div>

      {notifOpen && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 199 }}
            onClick={() => setNotifOpen(false)}
          />
          <div className="notif-panel open">
            <div className="notif-head">
              <div>
                <div className="tag">Notificações</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 500 }}>
                  {unreadCount > 0 ? `${unreadCount} não lida${unreadCount === 1 ? "" : "s"}` : "Tudo em dia"}
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--line)",
                    color: "inherit",
                    fontSize: 11,
                    padding: "5px 10px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Marcar todas
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="notif-empty">Sem notificações por enquanto.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item${n.lida ? "" : " unread"}`}
                  onClick={() => handleNotifClick(n)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={`notif-icon ${n.tipo}`}>{NOTIF_ICON[n.tipo]}</div>
                  <div>
                    <div className="notif-title">{n.titulo}</div>
                    <div className="notif-desc">{n.desc}</div>
                  </div>
                  <div className="notif-when">{n.quando}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </header>
  );
}
