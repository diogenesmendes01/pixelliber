import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const ebook = await prisma.ebook.findUnique({
      where: { id },
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
