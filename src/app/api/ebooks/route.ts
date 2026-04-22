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

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50")));
    const skip = (page - 1) * limit;

    const [ebooks, total, categorias, populares] = await Promise.all([
      prisma.ebook.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          titulo: true,
          autor: true,
          categoria: true,
          tags: true,
          contadorDownloads: true,
          createdAt: true,
        },
      }),
      prisma.ebook.count({ where }),
      prisma.ebook.findMany({
        select: { categoria: true },
        distinct: ["categoria"],
      }),
      prisma.ebook.findMany({
        orderBy: { contadorDownloads: "desc" },
        take: 10,
        select: { id: true, titulo: true, autor: true, categoria: true, tags: true, contadorDownloads: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      ebooks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      populares,
      maisBaixados: populares,
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
