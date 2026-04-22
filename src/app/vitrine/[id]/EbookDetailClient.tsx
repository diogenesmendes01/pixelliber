"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookCover, { bookBg } from "@/components/BookCover";
import { parseTags } from "@/lib/utils";
import { BOOKS, booksWithNew } from "@/lib/books-data";

interface Ebook {
  id: string;
  titulo: string;
  autor: string | null;
  descricao: string | null;
  categoria: string | null;
  tags: string | null;
}

interface SessionUser {
  name: string | null;
  email: string | null;
  companyName: string | null;
  role: string;
}

export default function EbookDetailClient({ ebook, user }: { ebook: Ebook; user: SessionUser }) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const { hue, label } = parseTags(ebook.tags);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const favs: string[] = JSON.parse(localStorage.getItem("pl-favs") || "[]");
    setFavorited(favs.includes(ebook.id));
  }, [ebook.id]);

  function toggleFavorite() {
    const favs: string[] = JSON.parse(localStorage.getItem("pl-favs") || "[]");
    const idx = favs.indexOf(ebook.id);
    if (idx >= 0) {
      favs.splice(idx, 1);
      setFavorited(false);
      showToast("Removido dos favoritos");
    } else {
      favs.push(ebook.id);
      setFavorited(true);
      showToast("Adicionado aos favoritos ✓");
    }
    localStorage.setItem("pl-favs", JSON.stringify(favs));
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  const handleRead = () => {
    router.push(`/vitrine/${ebook.id}/ler`);
  };

  const handleDownload = async () => {
    setShowOfflineModal(false);
    setDownloading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ebooks/${ebook.id}/pdf?download=1`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) { router.push("/login"); return; }
        if (res.status === 403) { setError("Assinatura ativa necessária para baixar."); return; }
        throw new Error(data.error || "Falha ao baixar PDF.");
      }
      await fetch(`/api/reading-history/${ebook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progressPct: 0 }),
      }).catch(() => undefined);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${ebook.titulo}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast("Download iniciado ✓");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao baixar.");
    } finally {
      setDownloading(false);
    }
  };

  // Related books (same category, excluding current). Fallback to all except current.
  const related = booksWithNew(
    BOOKS.filter((b) => b.tag === label || b.cat === ebook.categoria)
      .slice(0, 8)
      .concat(BOOKS.slice(0, 8))
      .slice(0, 8)
  );

  return (
    <>
      <Header
        active="catalogo"
        role={user.role === "ADMIN" ? "admin" : "user"}
        userName={user.name ?? undefined}
        userCompany={user.companyName ?? undefined}
        userEmail={user.email ?? undefined}
      />

      <main className="container">
        <nav style={{ marginTop: 20, marginBottom: 8 }}>
          <Link href="/vitrine" style={{ color: "var(--gold)", fontSize: 13 }}>← Voltar para o catálogo</Link>
        </nav>

        <section className="ebook-hero">
          <div style={{ maxWidth: 260, width: "100%" }}>
            <div
              className="cover"
              style={{ background: bookBg(hue) }}
              aria-label={`${ebook.titulo} — ${ebook.autor ?? ""}`}
            >
              <span className="cover-tag">{label}</span>
              <span>
                <span className="cover-title">{ebook.titulo}</span>
                {ebook.autor && (
                  <span className="cover-author" style={{ display: "block" }}>{ebook.autor}</span>
                )}
              </span>
            </div>
          </div>

          <div>
            <span className="tag gold-text">{ebook.categoria ?? label}</span>
            <h1>{ebook.titulo}</h1>
            <div className="ebook-meta">
              {ebook.autor && <span>por <strong>{ebook.autor}</strong></span>}
              <span>268 páginas</span>
              <span>PDF · 4.2 MB</span>
              <span>★ 4.8 (1.2k)</span>
            </div>
            <p style={{ color: "rgba(247,245,240,0.75)", maxWidth: "58ch", fontSize: "var(--fs-lg)", lineHeight: 1.55 }}>
              {ebook.descricao ??
                "Um guia prático sobre como pensar o assunto de forma clara. Ideal pra quem quer começar a aplicar passos concretos."}
            </p>

            <div className="flex wrap" style={{ marginTop: 22 }}>
              <button onClick={handleRead} className="btn btn--gold">
                Ler agora →
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => setShowOfflineModal(true)}
              >
                ⭳ Salvar offline
              </button>
              <button
                className="btn btn--ghost"
                onClick={toggleFavorite}
                style={favorited ? { borderColor: "var(--gold)", color: "var(--gold)" } : undefined}
              >
                {favorited ? "★" : "☆"} {favorited ? "Favoritado" : "Favoritar"}
              </button>
            </div>

            {error && (
              <div className="alert alert--danger" style={{ marginTop: 14 }}>
                <span className="alert-icon">!</span>
                <div><div className="alert-title">{error}</div></div>
              </div>
            )}

            <div className="divider" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              <div>
                <span className="tag">Capítulos</span>
                <div className="serif" style={{ fontSize: 18, marginTop: 4 }}>9 capítulos</div>
              </div>
              <div>
                <span className="tag">Última atualização</span>
                <div className="serif" style={{ fontSize: 18, marginTop: 4 }}>Mar · 2026</div>
              </div>
              <div>
                <span className="tag">Idioma</span>
                <div className="serif" style={{ fontSize: 18, marginTop: 4 }}>Português</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2 className="serif" style={{ fontSize: "var(--h3)" }}>Leitores também gostaram</h2>
          </div>
          <div className="row-scroll">
            {related.map((b) => (
              <BookCover key={b.id} book={b} />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {showOfflineModal && (
        <div className="modal-backdrop open" onClick={(e) => { if (e.target === e.currentTarget) setShowOfflineModal(false); }}>
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setShowOfflineModal(false)}
              aria-label="fechar"
            >
              ✕
            </button>
            <span className="tag gold-text">Leitura offline</span>
            <h3>Salvar pra ler sem internet</h3>
            <p className="sub">
              Esse livro fica disponível no navegador por 30 dias. A marca d&apos;água do seu CNPJ acompanha cada página.
            </p>
            <div style={{ background: "rgba(247,245,240,0.04)", border: "1px solid var(--line)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div className="flex-between" style={{ fontSize: 12 }}>
                <span className="tag">Tamanho</span>
                <span style={{ fontWeight: 500 }}>PDF · 4.2 MB</span>
              </div>
              <div className="flex-between" style={{ fontSize: 12, marginTop: 6 }}>
                <span className="tag">Validade</span>
                <span style={{ fontWeight: 500 }}>30 dias</span>
              </div>
              <div className="flex-between" style={{ fontSize: 12, marginTop: 6 }}>
                <span className="tag">Marca d&apos;água</span>
                <span style={{ fontWeight: 500 }}>
                  {user.name ?? "leitor"} · CNPJ
                </span>
              </div>
            </div>
            <div className="flex wrap" style={{ gap: 10 }}>
              <button className="btn btn--gold" onClick={handleDownload} disabled={downloading}>
                {downloading ? "Baixando…" : "Baixar PDF →"}
              </button>
              <button className="btn btn--ghost" onClick={() => setShowOfflineModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="reader-toast">
          <span className="t-icon">✓</span> {toast}
        </div>
      )}
    </>
  );
}
