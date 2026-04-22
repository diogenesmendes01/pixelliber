import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findUserWithCompany, subscriptionActive } from "@/lib/user-company";
import path from "path";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";

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

  // Verify active subscription (company pode vir de User.company OU de Employee.company)
  const dbUser = await findUserWithCompany(session.user.userId);
  if (!subscriptionActive(dbUser?.company)) {
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

  const fileStat = await stat(pdfPath).catch(() => null);
  if (!fileStat) {
    return NextResponse.json({ error: "PDF não encontrado." }, { status: 404 });
  }

  const nodeStream = createReadStream(pdfPath);
  const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(fileStat.size),
      "Content-Disposition": isDownload
        ? `attachment; filename="${ebook.id}.pdf"`
        : `inline; filename="${ebook.id}.pdf"`,
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
