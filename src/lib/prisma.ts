import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import path from "path";

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (dbUrl && dbUrl.startsWith("postgres")) {
    // PostgreSQL production
    const libsqlUrl = dbUrl.replace("postgres://", "libsql://");
    const client = createClient({ url: libsqlUrl });
    const adapter = new PrismaLibSQL(client);
    return new PrismaClient({ adapter });
  }
  
  if (dbUrl && dbUrl.startsWith("file:")) {
    // SQLite with custom path
    const adapter = new PrismaBetterSqlite3({ url: dbUrl });
    return new PrismaClient({ adapter });
  }
  
  // Default: SQLite in dev.db
  const devDbPath = path.join(process.cwd(), "dev.db");
  const adapter = new PrismaBetterSqlite3({ url: `file:${devDbPath}` });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
