import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Validate authentication
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Check active subscription
  const assinaturaAtiva = (session.user as any).assinaturaAtiva;
  if (!assinaturaAtiva) {
    return NextResponse.json(
      { error: "Assinatura inativa. Renov e seu plano para acessar." },
      { status: 403 }
    );
  }

  // 3. Parse ebook ID
  const { id } = await params;
  const ebookId = parseInt(id, 10);
  if (isNaN(ebookId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  // 4. Fetch ebook from database
  const ebook = await prisma.ebook.findUnique({
    where: { id: ebookId },
  });

  if (!ebook) {
    return NextResponse.json({ error: "E-book não encontrado" }, { status: 404 });
  }

  // 5. Resolve PDF path
  // The pdf field contains a filename (e.g. "ebook.pdf")
  // PDFs are served from /private/pdfs/ (outside public/)
  const pdfFilename = path.basename(ebook.pdf);
  const pdfPath = path.join(process.cwd(), "private", "pdfs", pdfFilename);

  // Security: ensure the resolved path is actually inside the pdfs directory
  const pdfsDir = path.join(process.cwd(), "private", "pdfs");
  if (!pdfPath.startsWith(pdfsDir)) {
    return NextResponse.json({ error: "Caminho inválido" }, { status: 400 });
  }

  // 6. Check if file exists
  let fileBuffer: Buffer;
  try {
    fileBuffer = await fs.readFile(pdfPath);
  } catch {
    // If file not found, return a structured JSON error instead of crashing
    return NextResponse.json(
      { error: "Arquivo PDF não encontrado no servidor. Entre em contato com o suporte." },
      { status: 404 }
    );
  }

  // 7. Increment download counter
  await prisma.ebook.update({
    where: { id: ebookId },
    data: { contadorDownloads: { increment: 1 } },
  });

  // 8. Serve the PDF with proper headers
  return new NextResponse(new Uint8Array(fileBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${pdfFilename}"`,
      "Content-Length": fileBuffer.length.toString(),
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
