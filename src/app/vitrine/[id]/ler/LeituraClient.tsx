"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ReaderLoading from "./ReaderLoading";

// React-pdf is loaded dynamically (client only, needs window).
const PdfDocument = dynamic(
  () => import("./PdfViewer").then((m) => m.PdfViewer),
  { ssr: false }
);

interface Ebook {
  id: string;
  titulo: string;
  autor: string | null;
  tags: string | null;
  categoria: string | null;
}

interface Reader {
  name: string;
  cnpj: string;
  company: string;
}

interface Props {
  ebook: Ebook;
  initialPage: number;
  reader: Reader;
}

type Theme = "light" | "sepia" | "dark";
type FontSize = "sm" | "md" | "lg" | "xl";

interface Bookmark {
  id: string;
  page: number;
  when: string;
  excerpt: string;
}

interface SearchResult {
  page: number;
  snippet: string;
  startIdx: number;
}

function highlightSnippet(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function LeituraClient({ ebook, initialPage, reader }: Props) {
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [numPages, setNumPages] = useState<number | null>(null);
  // Lazy readers do localStorage — rodam uma vez no client (SSR já passou)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("pl-reader-theme") as Theme | null) ?? "light";
  });
  const [fsize, setFsize] = useState<FontSize>(() => {
    if (typeof window === "undefined") return "md";
    return (localStorage.getItem("pl-reader-fsize") as FontSize | null) ?? "md";
  });
  const [aaOpen, setAaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(`pl-bookmarks-${ebook.id}`);
    try {
      return saved ? (JSON.parse(saved) as Bookmark[]) : [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState<string | null>(null);
  const [turning, setTurning] = useState<"next" | "prev" | null>(null);
  const progressSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // #1 mobile tap-to-reveal controls
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // #3 PDF search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResultIdx, setCurrentResultIdx] = useState(0);
  const [searching, setSearching] = useState(false);
  const pdfRefForSearch = useRef<unknown>(null);

  // #4 selected text for quote sharing
  const [selectedQuote, setSelectedQuote] = useState("");

  // Apply reader body class (separado da leitura do localStorage que foi pra useState lazy)
  useEffect(() => {
    document.body.classList.add("reader");
    return () => { document.body.classList.remove("reader"); };
  }, []);

  useEffect(() => { localStorage.setItem("pl-reader-theme", theme); }, [theme]);
  useEffect(() => { localStorage.setItem("pl-reader-fsize", fsize); }, [fsize]);

  // Detect mobile on mount + resize
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(max-width: 720px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-hide controls on mobile after inactivity
  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (!isMobile) return;
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && controlsVisible) scheduleHide();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isMobile, controlsVisible, scheduleHide]);

  // Selection capture for quote share
  useEffect(() => {
    const onSelect = () => {
      const text = window.getSelection()?.toString().trim() ?? "";
      if (text.length >= 10 && text.length <= 600) {
        setSelectedQuote(text);
      }
    };
    document.addEventListener("mouseup", onSelect);
    document.addEventListener("touchend", onSelect);
    return () => {
      document.removeEventListener("mouseup", onSelect);
      document.removeEventListener("touchend", onSelect);
    };
  }, []);

  // Auto-save reading progress (debounced)
  useEffect(() => {
    if (progressSaveTimer.current) clearTimeout(progressSaveTimer.current);
    progressSaveTimer.current = setTimeout(() => {
      const pct = numPages ? (page / numPages) * 100 : 0;
      fetch(`/api/reading-history/${ebook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progressPct: pct, lastPage: page }),
      }).catch(() => undefined);
    }, 800);
    return () => {
      if (progressSaveTimer.current) clearTimeout(progressSaveTimer.current);
    };
  }, [page, numPages, ebook.id]);

  const totalPages = numPages ?? 1;
  const progressPct = numPages ? (page / numPages) * 100 : 0;

  const goNext = useCallback(() => {
    if (page >= totalPages) return;
    setTurning("next");
    setTimeout(() => setTurning(null), 350);
    setPage((p) => Math.min(totalPages, p + 2));
  }, [page, totalPages]);

  const goPrev = useCallback(() => {
    if (page <= 1) return;
    setTurning("prev");
    setTimeout(() => setTurning(null), 350);
    setPage((p) => Math.max(1, p - 2));
  }, [page]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") {
        setAaOpen(false);
        setSearchOpen(false);
        setTocOpen(false);
        setBookmarksOpen(false);
        setShareOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // Touch handling — distinguish tap (< 20px) from swipe
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 20) {
      // Tap — toggle controls on mobile
      if (isMobile) setControlsVisible((v) => !v);
    } else if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      // Swipe
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStart.current = null;
  };

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function addBookmark() {
    const bm: Bookmark = {
      id: Math.random().toString(36).slice(2),
      page,
      when: new Date().toLocaleDateString("pt-BR"),
      excerpt: `Página ${page}`,
    };
    const next = [bm, ...bookmarks];
    setBookmarks(next);
    localStorage.setItem(`pl-bookmarks-${ebook.id}`, JSON.stringify(next));
    showToast("Marcador salvo ✓");
  }

  function removeBookmark(id: string) {
    const next = bookmarks.filter((b) => b.id !== id);
    setBookmarks(next);
    localStorage.setItem(`pl-bookmarks-${ebook.id}`, JSON.stringify(next));
  }

  function jumpToPage(p: number) {
    setPage(Math.max(1, Math.min(totalPages, p)));
    setTocOpen(false);
    setBookmarksOpen(false);
  }

  // #3 Real PDF search
  async function performSearch(query: string) {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setCurrentResultIdx(0);
      return;
    }
    const doc = pdfRefForSearch.current as
      | { numPages: number; getPage: (n: number) => Promise<unknown> }
      | null;
    if (!doc) return;
    setSearching(true);
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    const maxPages = Math.min(doc.numPages, 60);
    try {
      for (let p = 1; p <= maxPages; p++) {
        const pageObj = (await doc.getPage(p)) as {
          getTextContent: () => Promise<{ items: { str: string }[] }>;
        };
        const tc = await pageObj.getTextContent();
        const text = tc.items.map((i) => i.str).join(" ");
        const lower = text.toLowerCase();
        let from = 0;
        while (true) {
          const idx = lower.indexOf(q, from);
          if (idx < 0) break;
          const start = Math.max(0, idx - 40);
          const end = Math.min(text.length, idx + q.length + 40);
          const snippet = (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
          results.push({ page: p, snippet, startIdx: idx });
          from = idx + q.length;
          if (results.length >= 100) break;
        }
        if (results.length >= 100) break;
      }
    } catch (e) {
      console.error("search error", e);
    }

    setSearchResults(results);
    setCurrentResultIdx(0);
    setSearching(false);
  }

  function navigateSearch(dir: 1 | -1) {
    if (searchResults.length === 0) return;
    let next = currentResultIdx + dir;
    if (next < 0) next = searchResults.length - 1;
    if (next >= searchResults.length) next = 0;
    setCurrentResultIdx(next);
    jumpToPage(searchResults[next].page);
    // Keep search panel open
    setSearchOpen(true);
  }

  const chapters = [
    { num: "1", title: "Introdução", page: 1 },
    { num: "2", title: "Fundamentos", page: 20 },
    { num: "3", title: "Aplicação prática", page: 45 },
    { num: "4", title: "Estratégias avançadas", page: 78 },
    { num: "5", title: "Estudos de caso", page: 110 },
    { num: "6", title: "Erros comuns", page: 150 },
    { num: "7", title: "Próximos passos", page: 195 },
    { num: "8", title: "Referências", page: 240 },
  ];
  const activeChapter = [...chapters].reverse().find((c) => c.page <= page) ?? chapters[0];

  const pdfUrl = `/api/ebooks/${ebook.id}/pdf`;

  const controlsHidden = isMobile && !controlsVisible;
  const controlsStyle: React.CSSProperties = controlsHidden
    ? { opacity: 0, pointerEvents: "none", transition: "opacity .25s" }
    : { opacity: 1, transition: "opacity .25s" };

  return (
    <div className="reader" data-theme={theme} data-fsize={fsize}>
      {numPages === null && (
        <ReaderLoading
          titulo={ebook.titulo}
          autor={ebook.autor}
          tags={ebook.tags}
          initialPage={initialPage}
        />
      )}
      <div className="reader-shell" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* ============ TOP BAR ============ */}
        <header className="reader-top" style={controlsStyle}>
          <div className="tbar-left">
            <button
              className="icon-btn"
              onClick={() => router.push(`/vitrine/${ebook.id}`)}
              aria-label="voltar"
              title="voltar"
            >
              ←
            </button>
            <div style={{ minWidth: 0 }}>
              <span className="book-title">{ebook.titulo}</span>
              {ebook.autor && <span className="book-author">· {ebook.autor}</span>}
            </div>
          </div>
          <div className="tbar-right">
            <button
              className={`icon-btn hide-sm${tocOpen ? " active" : ""}`}
              onClick={() => { setTocOpen((o) => !o); setBookmarksOpen(false); }}
              title="sumário"
            >
              ☰ <span className="lbl">Sumário</span>
            </button>
            <button
              className={`icon-btn hide-sm${bookmarksOpen ? " active" : ""}`}
              onClick={() => { setBookmarksOpen((o) => !o); setTocOpen(false); }}
              title="marcadores"
            >
              ★ <span className="lbl">Marcadores</span>
            </button>
            <button
              className="icon-btn hide-sm"
              onClick={addBookmark}
              title="marcar esta página"
            >
              + pág
            </button>
            <button
              className={`icon-btn${searchOpen ? " active" : ""}`}
              onClick={() => { setSearchOpen((o) => !o); setAaOpen(false); }}
              title="buscar"
            >
              🔍
            </button>
            <button
              className={`icon-btn${aaOpen ? " active" : ""}`}
              onClick={() => { setAaOpen((o) => !o); setSearchOpen(false); }}
              title="aparência"
            >
              Aa
            </button>
            <button
              className="icon-btn"
              onClick={() => setShareOpen(true)}
              title="compartilhar trecho"
            >
              ⎙
            </button>
            <button
              className="icon-btn hide-sm"
              onClick={() => {
                if (document.fullscreenElement) document.exitFullscreen();
                else document.documentElement.requestFullscreen?.();
              }}
              title="tela cheia"
            >
              ⛶
            </button>
          </div>
        </header>

        {/* ============ STAGE ============ */}
        <div className="reader-stage">
          <button
            className="reader-arrow prev"
            onClick={goPrev}
            disabled={page <= 1}
            aria-label="página anterior"
            style={page <= 1 ? { opacity: 0.3, cursor: "not-allowed" } : undefined}
          >
            ‹
          </button>

          <div className={`spread${turning ? ` turning-${turning}` : ""}`}>
            <PdfDocument
              pdfUrl={pdfUrl}
              pages={[page, Math.min(page + 1, totalPages)]}
              onLoadSuccess={(n, doc) => {
                setNumPages(n);
                pdfRefForSearch.current = doc;
              }}
              watermark={`Licenciado para ${reader.name}${reader.cnpj ? ` · CNPJ ${reader.cnpj}` : ""}`}
              chapter={activeChapter.title}
              searchQuery={searchQuery}
            />
          </div>

          <button
            className="reader-arrow next"
            onClick={goNext}
            disabled={page >= totalPages}
            aria-label="próxima página"
            style={page >= totalPages ? { opacity: 0.3, cursor: "not-allowed" } : undefined}
          >
            ›
          </button>
        </div>

        {/* ============ BOTTOM BAR ============ */}
        <div className="reader-bottom" style={controlsStyle}>
          <div className="progress-row">
            <span className="progress-label mono">
              {page}/{totalPages || "?"}
            </span>
            <div className="progress-track" aria-label="progresso de leitura">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              {chapters.map((c) => (
                <div
                  key={c.num}
                  className="progress-tick"
                  style={{ left: `${(c.page / Math.max(totalPages, 1)) * 100}%` }}
                />
              ))}
            </div>
            <span className="progress-label" style={{ textAlign: "right" }}>
              {Math.round(progressPct)}%
            </span>
          </div>
        </div>
      </div>

      {/* ============ DRAWERS ============ */}
      <div
        className={`drawer-backdrop${tocOpen || bookmarksOpen ? " open" : ""}`}
        onClick={() => { setTocOpen(false); setBookmarksOpen(false); }}
      />
      <aside className={`drawer left${tocOpen ? " open" : ""}`}>
        <div className="drawer-head">
          <div>
            <div className="tag">Sumário</div>
            <div className="serif" style={{ fontSize: 18, marginTop: 2 }}>{ebook.titulo}</div>
          </div>
          <button className="icon-btn" onClick={() => setTocOpen(false)} aria-label="fechar">✕</button>
        </div>
        <div>
          {chapters.map((c) => (
            <div
              key={c.num}
              className={`toc-item${c.num === activeChapter.num ? " active" : ""}`}
              onClick={() => jumpToPage(c.page)}
              role="button"
              tabIndex={0}
            >
              <span className="toc-num">{c.num}</span>
              <span className="toc-title">{c.title}</span>
              <span className="toc-page">p. {c.page}</span>
            </div>
          ))}
        </div>
      </aside>

      <aside className={`drawer right${bookmarksOpen ? " open" : ""}`}>
        <div className="drawer-head">
          <div>
            <div className="tag">Marcadores</div>
            <div className="serif" style={{ fontSize: 18, marginTop: 2 }}>
              {bookmarks.length} {bookmarks.length === 1 ? "marcador" : "marcadores"}
            </div>
          </div>
          <button className="icon-btn" onClick={() => setBookmarksOpen(false)} aria-label="fechar">✕</button>
        </div>
        <div>
          {bookmarks.length === 0 ? (
            <div className="empty-state" style={{ padding: "28px 16px" }}>
              <div className="e-icon">★</div>
              <h4>Sem marcadores ainda</h4>
              <p>Use o botão &quot;+ pág&quot; no topo pra salvar sua página atual.</p>
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                className={`bookmark${bm.page === page ? " active" : ""}`}
                onClick={() => jumpToPage(bm.page)}
              >
                <div className="flex-between">
                  <div className="bookmark-meta">pág. {bm.page} · {bm.when}</div>
                  <button
                    className="icon-btn"
                    onClick={(e) => { e.stopPropagation(); removeBookmark(bm.id); }}
                    aria-label="remover marcador"
                    style={{ padding: 2, fontSize: 12 }}
                  >
                    ✕
                  </button>
                </div>
                <div className="bookmark-text">{bm.excerpt}</div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ============ AA PANEL ============ */}
      {aaOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 59 }} onClick={() => setAaOpen(false)} />
          <div className="aa-panel open">
            <div className="aa-group">
              <div className="tag">Tema</div>
              <div className="aa-row">
                {(["light", "sepia", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    className={`aa-opt${theme === t ? " on" : ""}`}
                    onClick={() => setTheme(t)}
                  >
                    <span
                      className="aa-swatch"
                      style={{
                        background: t === "light" ? "#faf7f1" : t === "sepia" ? "#f3e9d1" : "#1c1b1a",
                      }}
                    />
                    <span style={{ textTransform: "capitalize" }}>{t}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="aa-group">
              <div className="tag">Tamanho do texto</div>
              <div className="aa-size-row">
                {(["sm", "md", "lg", "xl"] as const).map((s) => (
                  <button
                    key={s}
                    className={`aa-opt${fsize === s ? " on" : ""}`}
                    onClick={() => setFsize(s)}
                  >
                    <span
                      className="serif"
                      style={{
                        fontSize: s === "sm" ? 13 : s === "md" ? 15 : s === "lg" ? 17 : 20,
                      }}
                    >
                      Aa
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============ SEARCH PANEL ============ */}
      {searchOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 59 }} onClick={() => setSearchOpen(false)} />
          <div className="search-panel open">
            <div className="search-input-wrap">
              <span style={{ opacity: 0.6 }}>🔍</span>
              <input
                autoFocus
                placeholder="buscar no livro…"
                value={searchQuery}
                onChange={(e) => performSearch(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => performSearch("")}
                  style={{
                    background: "transparent",
                    border: 0,
                    color: "var(--muted)",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {searching ? (
              <div className="search-summary">
                <span>buscando…</span>
              </div>
            ) : searchQuery.length < 2 ? (
              <div className="search-empty">
                <div className="s-icon">🔍</div>
                Digite pelo menos 2 caracteres para buscar no texto do livro.
              </div>
            ) : searchResults.length === 0 ? (
              <div className="search-empty">
                <div className="s-icon">🔍</div>
                Nada encontrado para <strong>&quot;{searchQuery}&quot;</strong>.
              </div>
            ) : (
              <>
                <div className="search-summary">
                  <span>
                    {searchResults.length} ocorrência{searchResults.length === 1 ? "" : "s"}
                    {" · "}
                    {currentResultIdx + 1}/{searchResults.length}
                  </span>
                  <div className="search-nav">
                    <button onClick={() => navigateSearch(-1)} aria-label="anterior">‹</button>
                    <button onClick={() => navigateSearch(1)} aria-label="próximo">›</button>
                  </div>
                </div>
                {searchResults.slice(0, 30).map((r, i) => (
                  <div
                    key={`${r.page}-${r.startIdx}`}
                    className={`search-result${i === currentResultIdx ? " current" : ""}`}
                    onClick={() => {
                      setCurrentResultIdx(i);
                      jumpToPage(r.page);
                    }}
                  >
                    <div className="search-result-meta">página {r.page}</div>
                    <div className="search-result-text">
                      {highlightSnippet(r.snippet, searchQuery)}
                    </div>
                  </div>
                ))}
                {searchResults.length > 30 && (
                  <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", padding: 8 }}>
                    …mostrando as primeiras 30 de {searchResults.length}.
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* ============ SHARE MODAL ============ */}
      {shareOpen && (
        <div className="modal-backdrop open" onClick={(e) => { if (e.target === e.currentTarget) setShareOpen(false); }}>
          <div className="modal">
            <button className="modal-close" onClick={() => setShareOpen(false)} aria-label="fechar">✕</button>
            <span className="tag gold-text">Compartilhar</span>
            <h3>Um trecho pra levar</h3>
            <p className="sub">
              {selectedQuote
                ? "Trecho capturado da sua seleção. Compartilhe como imagem ou link."
                : "Selecione um texto na página antes de abrir esse modal para capturar automaticamente."}
            </p>
            <div className="share-card">
              <div className="q">
                {selectedQuote || `Um trecho marcante de "${ebook.titulo}" aparece aqui quando você seleciona texto numa página.`}
              </div>
              <div className="attrib">
                <span>
                  {ebook.titulo}
                  {ebook.autor ? ` · ${ebook.autor}` : ""}
                </span>
                <span>Pixel Liber</span>
              </div>
            </div>
            <div className="flex wrap" style={{ gap: 8 }}>
              <button
                className="btn btn--gold btn--sm"
                onClick={() => {
                  const text = selectedQuote
                    ? `"${selectedQuote}"\n\n— ${ebook.titulo}${ebook.autor ? `, ${ebook.autor}` : ""}\nvia Pixel Liber`
                    : `Lendo "${ebook.titulo}" no Pixel Liber`;
                  navigator.clipboard?.writeText(text);
                  showToast("Copiado ✓");
                  setShareOpen(false);
                }}
              >
                Copiar
              </button>
              <a
                className="btn btn--ghost btn--sm"
                href={`https://wa.me/?text=${encodeURIComponent(`Lendo "${ebook.titulo}" no Pixel Liber`)}`}
                target="_blank"
                rel="noopener"
              >
                WhatsApp
              </a>
              <a
                className="btn btn--ghost btn--sm"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="reader-toast">
          <span className="t-icon">✓</span> {toast}
        </div>
      )}
    </div>
  );
}
