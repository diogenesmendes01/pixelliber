"use client";

import { bookBg } from "@/components/BookCover";
import { parseTags } from "@/lib/utils";

interface Props {
  titulo: string;
  autor: string | null;
  tags: string | null;
  initialPage: number;
}

export default function ReaderLoading({ titulo, autor, tags, initialPage }: Props) {
  const { hue, label } = parseTags(tags);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        overflow: "hidden",
      }}
    >
      {/* Halo borrado atrás da capa */}
      <div
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: `radial-gradient(circle, oklch(0.5 0.15 ${hue} / 0.35), transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          padding: 24,
        }}
      >
        {/* Capa + reflexo 3D */}
        <div
          style={{
            perspective: 1000,
            animation: "readerBreathe 3s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: 240,
              height: 360,
              transform: "rotateY(-14deg) rotateX(4deg)",
              transformStyle: "preserve-3d",
              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05) inset",
              borderRadius: 4,
              overflow: "hidden",
              background: bookBg(hue),
              padding: 18,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: "#fff",
              fontFamily: "var(--serif)",
              position: "relative",
              isolation: "isolate",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(165deg, rgba(255,255,255,0.18), transparent 60%), radial-gradient(120% 80% at 0% 0%, rgba(255,255,255,0.1), transparent)",
                mixBlendMode: "overlay",
              }}
            />
            <span
              className="cover-tag"
              style={{ position: "relative", zIndex: 1 }}
            >
              {label}
            </span>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="cover-title" style={{ fontSize: 20 }}>{titulo}</div>
              {autor && (
                <div className="cover-author" style={{ display: "block", marginTop: 6 }}>
                  {autor}
                </div>
              )}
            </div>
          </div>

          {/* Reflexo mascarado */}
          <div
            style={{
              width: 240,
              height: 120,
              marginTop: 4,
              transform: "rotateY(-14deg) rotateX(4deg) scaleY(-1)",
              transformOrigin: "top",
              borderRadius: 4,
              background: bookBg(hue),
              opacity: 0.22,
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 70%)",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 70%)",
              filter: "blur(1px)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Barra de progresso shimmer */}
        <div style={{ width: 180, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: "100%",
              height: 3,
              background: "rgba(247,245,240,0.08)",
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%)",
                animation: "readerShimmer 1.4s ease-in-out infinite",
              }}
            />
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(247,245,240,0.6)",
              fontFamily: "var(--sans)",
              letterSpacing: "0.08em",
            }}
          >
            {initialPage > 1 ? `Retomando pág. ${initialPage}…` : "Abrindo livro…"}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes readerBreathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes readerShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
