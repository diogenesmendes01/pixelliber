-- CreateTable
CREATE TABLE "Ebook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "capa" TEXT NOT NULL,
    "pdf" TEXT NOT NULL,
    "dataPublicacao" DATETIME NOT NULL,
    "numeroPaginas" INTEGER NOT NULL,
    "tags" TEXT NOT NULL,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "contadorDownloads" INTEGER NOT NULL DEFAULT 0
);
