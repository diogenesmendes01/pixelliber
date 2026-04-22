"use client";

import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure pdf.js worker from CDN to avoid bundling issues in Next.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  pdfUrl: string;
  pages: number[];
  watermark: string;
  chapter: string;
  onLoadSuccess: (n: number, doc: PDFDocumentProxy) => void;
  searchQuery?: string;
}

export function PdfViewer({
  pdfUrl,
  pages,
  watermark,
  chapter,
  onLoadSuccess,
  searchQuery,
}: PdfViewerProps) {
  const [width, setWidth] = useState(380);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    function onResize() {
      const spread = document.querySelector(".spread");
      if (spread) {
        const singleCol = window.matchMedia("(max-width: 880px)").matches;
        const w = singleCol ? spread.clientWidth - 8 : (spread.clientWidth - 8) / 2;
        setWidth(Math.max(220, Math.min(480, w)));
      }
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Highlight search matches in rendered text layer
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) return;
    const q = searchQuery.toLowerCase();

    const timer = setTimeout(() => {
      containerRefs.current.forEach((container) => {
        if (!container) return;
        const textLayer = container.querySelector(".react-pdf__Page__textContent");
        if (!textLayer) return;

        textLayer.querySelectorAll("span").forEach((span) => {
          const text = span.textContent ?? "";
          const lower = text.toLowerCase();
          if (!lower.includes(q)) {
            // Remove existing mark if any
            if (span.querySelector("mark.search-hit")) {
              span.innerHTML = text;
            }
            return;
          }
          const idx = lower.indexOf(q);
          const before = text.slice(0, idx);
          const match = text.slice(idx, idx + q.length);
          const after = text.slice(idx + q.length);
          span.innerHTML = `${escapeHtml(before)}<mark class="search-hit">${escapeHtml(match)}</mark>${escapeHtml(after)}`;
        });
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery, pages]);

  return (
    <Document
      file={pdfUrl}
      onLoadSuccess={(doc) => onLoadSuccess(doc.numPages, doc as unknown as PDFDocumentProxy)}
      loading={
        <div style={{ display: "contents" }}>
          {pages.map((p, i) => (
            <PageFrame key={i} chapter={chapter} watermark={watermark}>
              <div className="skel" style={{ width: "100%", height: 400 }} />
            </PageFrame>
          ))}
        </div>
      }
      error={
        <div style={{ display: "contents" }}>
          {pages.map((p, i) => (
            <PageFrame key={i} chapter={chapter} watermark={watermark}>
              <div
                style={{
                  padding: 20,
                  color: "var(--pg-ink-muted, #888)",
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                }}
              >
                Não foi possível carregar o PDF.
              </div>
            </PageFrame>
          ))}
        </div>
      }
      externalLinkTarget="_blank"
      className="pdf-doc-wrap"
    >
      {pages.map((p, i) => (
        <PageFrame
          key={`${p}-${i}`}
          chapter={chapter}
          watermark={watermark}
          setRef={(el) => { containerRefs.current[i] = el; }}
        >
          <Page
            pageNumber={p}
            width={width}
            renderAnnotationLayer={false}
            renderTextLayer={true}
            loading={<div className="skel" style={{ width: "100%", height: 400 }} />}
            error="Página indisponível"
          />
        </PageFrame>
      ))}
    </Document>
  );
}

function PageFrame({
  children,
  chapter,
  watermark,
  setRef,
}: {
  children: React.ReactNode;
  chapter: string;
  watermark: string;
  setRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div className="page" ref={setRef}>
      <div className="page-head">
        <span>{chapter}</span>
        <span>Pixel Liber</span>
      </div>
      <div
        className="page-body"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: 10,
        }}
      >
        {children}
      </div>
      <div className="page-watermark">{watermark}</div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
