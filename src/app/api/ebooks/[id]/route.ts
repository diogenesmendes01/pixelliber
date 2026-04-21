import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ebookId = parseInt(id, 10);

    if (isNaN(ebookId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const ebook = await prisma.ebook.findUnique({
      where: { id: ebookId },
    });

    if (!ebook) {
      return NextResponse.json({ error: "E-book não encontrado" }, { status: 404 });
    }

    return NextResponse.json(ebook);
  } catch (error) {
    console.error("Error fetching ebook:", error);
    return NextResponse.json(
      { error: "Erro ao buscar e-book" },
      { status: 500 }
    );
  }
}
