"use client";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        color: "#7F7878",
        fontSize: "14px",
        textDecoration: "underline",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
      className="transition hover:opacity-80"
    >
      Sair da conta
    </button>
  );
}
