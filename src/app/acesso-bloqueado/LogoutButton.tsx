"use client";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="btn btn--ghost"
      style={{ justifyContent: "center", fontSize: "var(--fs-sm)", color: "var(--muted)" }}
    >
      Sair da conta
    </button>
  );
}
