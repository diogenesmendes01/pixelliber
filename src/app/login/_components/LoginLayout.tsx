"use client";

import type { ReactNode } from "react";

const COVER_BOOKS = [
  { hue: 38 }, { hue: 160 }, { hue: 280 },
  { hue: 20 }, { hue: 210 }, { hue: 50 },
  { hue: 340 }, { hue: 100 }, { hue: 0 },
];

function StackDeco() {
  return (
    <div className="auth-brand" style={{ position: "relative" }}>
      <div className="logo" style={{ color: "var(--paper)" }}>
        <span className="logo-dot" />
        <span>Pixel Liber</span>
      </div>
      <div className="stack-deco">
        {COVER_BOOKS.map((b, i) => (
          <div
            key={i}
            className="cover"
            style={{
              background: `linear-gradient(150deg, oklch(0.42 0.1 ${b.hue}), oklch(0.22 0.08 ${(b.hue + 30) % 360}))`,
              width: 60,
            }}
          />
        ))}
      </div>
      <div>
        <h2>Bem-vindo à sua<br />biblioteca.</h2>
        <p>Acesse com seu CNPJ e senha corporativa.</p>
      </div>
      <div className="tag" style={{ color: "var(--muted)" }}>EST. 2024 · PIXEL LIBER</div>
    </div>
  );
}

interface LoginLayoutProps {
  children: ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="auth-shell">
      <StackDeco />
      <div className="auth-form">
        {children}
      </div>
    </div>
  );
}
