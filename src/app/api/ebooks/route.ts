import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get("categoria");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "destaque";
    const ordem = searchParams.get("ordem") || "desc";

    const where: Record<string, unknown> = {};

    if (categoria && categoria !== "all") {
      where.categoria = categoria;
    }

    if (search) {
      where.OR = [
        { titulo: { contains: search } },
        { autor: { contains: search } },
      ];
    }

    const orderBy: Record<string, string> = {};
    if (sort === "downloads") {
      orderBy.contadorDownloads = ordem;
    } else if (sort === "data") {
      orderBy.createdAt = ordem;
    } else {
      orderBy.contadorDownloads = "desc";
    }

    const ebooks = await prisma.ebook.findMany({
      where,
      orderBy,
    });

    const categorias = await prisma.ebook.findMany({
      select: { categoria: true },
      distinct: ["categoria"],
    });

    const populares = await prisma.ebook.findMany({
      orderBy: { contadorDownloads: "desc" },
      take: 10,
    });

    const maisBaixados = await prisma.ebook.findMany({
      orderBy: { contadorDownloads: "desc" },
      take: 10,
    });

    return NextResponse.json({
      ebooks,
      populares,
      maisBaixados,
      categorias: categorias.map((c) => c.categoria),
    });
  } catch (error) {
    console.error("Error fetching ebooks:", error);
    return NextResponse.json(
      { error: "Erro ao buscar e-books" },
      { status: 500 }
    );
  }
}
