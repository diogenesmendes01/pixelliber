"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";

interface Ebook {
  id: string;
  titulo: string;
  autor: string | null;
  descricao: string | null;
  categoria: string | null;
  tags: string | null;
}

function parseTags(tags: string | null): { hue: number; label: string } {
  try {
    const t = JSON.parse(tags ?? "{}");
    return { hue: t.hue ?? 38, label: t.label ?? "geral" };
  } catch {
    return { hue: 38, label: "geral" };
  }
}

function coverBg(hue: number) {
  return `linear-gradient(150deg, oklch(0.42 0.1 ${hue}), oklch(0.22 0.08 ${(hue + 30) % 360}))`;
}

export default function VitrineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEbook() {
      try {
        const res = await fetch(`/api/ebooks/${id}`);
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) { setNotFound(true); return; }
        setEbook(await res.json());
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchEbook();
  }, [id]);

  const handleRead = () => {
    window.open(`/api/ebooks/${id}/pdf`, "_blank");
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ebooks/${id}/pdf?download=1`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) { router.push("/login"); return; }
        if (res.status === 403) { setError("Assinatura ativa necessária para baixar."); return; }
        throw new Error(data.error || "Falha ao baixar PDF.");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao baixar.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header active="catalogo" role="admin" />
        <main className="container" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <div className="skel" style={{ height: 400, borderRadius: 12 }} />
        </main>
      </>
    );
  }

  if (notFound || !ebook) {
    return (
      <>
        <Header active="catalogo" role="admin" />
        <main className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "var(--h2)", marginBottom: 16 }}>E-book não encontrado</h1>
          <Link href="/vitrine" className="btn btn--gold btn--sm">← Voltar para o catálogo</Link>
        </main>
      </>
    );
  }

  const { hue, label } = parseTags(ebook.tags);

  return (
    <>
      <Header active="catalogo" role="admin" />

      <main className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <nav style={{ marginBottom: 28 }}>
          <Link href="/vitrine" style={{ color: "var(--gold)", fontSize: 13 }}>← Voltar para o catálogo</Link>
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 48, alignItems: "start" }}>
          {/* Cover */}
          <div
            style={{
              background: coverBg(hue),
              borderRadius: 16,
              aspectRatio: "3/4",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 24,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <span className="cover-tag" style={{ marginBottom: 8 }}>{label}</span>
            <div className="cover-title" style={{ fontSize: 18 }}>{ebook.titulo}</div>
            {ebook.autor && <div className="cover-author" style={{ marginTop: 6 }}>{ebook.autor}</div>}
          </div>

          {/* Details */}
          <div style={{ paddingTop: 12 }}>
            <div className="tag gold-text" style={{ marginBottom: 12 }}>{ebook.categoria}</div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "var(--h2)", marginBottom: 8 }}>{ebook.titulo}</h1>
            {ebook.autor && (
              <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>por {ebook.autor}</div>
            )}

            {ebook.descricao && (
              <p style={{ color: "var(--ink)", lineHeight: 1.7, maxWidth: "54ch", marginBottom: 32 }}>
                {ebook.descricao}
              </p>
            )}

            {error && (
              <div style={{ marginBottom: 16, padding: "10px 14px", background: "oklch(0.92 0.06 25)", borderRadius: 8, fontSize: 13, color: "oklch(0.4 0.18 25)" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={handleRead} className="btn btn--gold">
                📖 Ler agora
              </button>
              <button onClick={handleDownload} disabled={downloading} className="btn btn--ghost btn--ink">
                {downloading ? "Baixando…" : "⬇ Baixar PDF"}
              </button>
            </div>

            <p style={{ marginTop: 16, fontSize: 12, color: "var(--muted)" }}>
              Disponível para assinantes ativos.{" "}
              <Link href="/login" style={{ color: "var(--gold)" }}>Assine agora →</Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="ft">
        <div className="container ft-inner">
          <div>© Pixel Liber · EST. 2024</div>
        </div>
      </footer>
    </>
  );
}
