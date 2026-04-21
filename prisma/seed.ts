import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const adapter = new PrismaBetterSqlite3({
  url: `file:${path.join(__dirname, "..", "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("test123", 10);

  const company = await prisma.company.upsert({
    where: { cnpj: "12345678000190" },
    update: {},
    create: {
      cnpj: "12345678000190",
      name: "Empresa Teste Pixel Liber",
      email: "teste@pixelliber.com.br",
      user: {
        create: {
          passwordHash,
          name: "Usuário Teste",
          email: "teste@pixelliber.com.br",
        },
      },
    },
    include: { user: true },
  });

  console.log(`Created company: ${company.name} (CNPJ: ${company.cnpj})`);
  console.log(`User: ${company.user?.email ?? "N/A"}`);
  console.log(`Password: test123`);
  console.log("");
  console.log("Test credentials:");
  console.log("  CNPJ: 12.345.678/0001-90");
  console.log("  Senha: test123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
