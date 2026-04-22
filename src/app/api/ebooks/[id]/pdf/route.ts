import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import path from "path";
import { readFile } from "fs/promises";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const isDownload = searchParams.get("download") === "1";

  // Validate session via JWT cookie
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado. Faça login." }, { status: 401 });
  }

  // Verify active subscription
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.userId },
    include: { company: true },
  });
  if (dbUser?.company?.statusAssinatura !== "ativa") {
    return NextResponse.json({ error: "Assinatura inativa." }, { status: 403 });
  }

  // Verify ebook exists
  const ebook = await prisma.ebook.findUnique({ where: { id } });
  if (!ebook) {
    return NextResponse.json({ error: "E-book não encontrado." }, { status: 404 });
  }

  // Increment download counter for actual downloads
  if (isDownload) {
    await prisma.ebook.update({
      where: { id },
      data: { contadorDownloads: { increment: 1 } },
    });
  }

  // Determine PDF path (stored path or fallback to slug from titulo)
  const pdfFilename = ebook.pdf ?? `${id}.pdf`;
  const pdfPath = path.join(process.cwd(), "public", pdfFilename.startsWith("/") ? pdfFilename.slice(1) : pdfFilename);

  try {
    const pdfBuffer = await readFile(pdfPath);
    const filename = path.basename(pdfFilename);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": isDownload
          ? `attachment; filename="${filename}"`
          : `inline; filename="${filename}"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json({ error: "PDF não encontrado." }, { status: 404 });
  }
}
