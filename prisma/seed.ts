import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EBOOKS = [
  { titulo: "Pai rico, pai pobre", autor: "Robert Kiyosaki", categoria: "Finanças", tags: JSON.stringify({ hue: 38, label: "finanças" }), descricao: "Um dos livros mais influentes sobre finanças pessoais, ensina lições fundamentais sobre dinheiro e investimentos.", contadorDownloads: 320 },
  { titulo: "A felicidade começa com você", autor: "M. Oliveira", categoria: "Mente", tags: JSON.stringify({ hue: 340, label: "mente" }), descricao: "Descubra como a felicidade genuína vem de dentro e construa uma vida mais plena e significativa.", contadorDownloads: 215 },
  { titulo: "Autoridade no YouTube", autor: "C. Rocha", categoria: "Marketing", tags: JSON.stringify({ hue: 0, label: "marketing" }), descricao: "Aprenda a construir autoridade e fazer crescer seu canal no YouTube com estratégias comprovadas.", contadorDownloads: 180 },
  { titulo: "O negócio do coaching", autor: "P. Alves", categoria: "Negócios", tags: JSON.stringify({ hue: 210, label: "negócios" }), descricao: "Guia completo para transformar seu conhecimento em um negócio lucrativo de coaching.", contadorDownloads: 140 },
  { titulo: "Copywriting: destruindo objeções", autor: "A. Costa", categoria: "Vendas", tags: JSON.stringify({ hue: 20, label: "vendas" }), descricao: "Domine a arte do copywriting e elimine objeções dos seus clientes de uma vez por todas.", contadorDownloads: 290 },
  { titulo: "Como parar de se preocupar", autor: "D. Ramos", categoria: "Mente", tags: JSON.stringify({ hue: 160, label: "mente" }), descricao: "Técnicas práticas para superar a ansiedade e viver sem preocupações excessivas.", contadorDownloads: 175 },
  { titulo: "Do ponto zero à conversão", autor: "L. Souza", categoria: "Marketing", tags: JSON.stringify({ hue: 280, label: "marketing" }), descricao: "O guia definitivo para iniciar seu negócio digital do zero e alcançar suas primeiras conversões.", contadorDownloads: 230 },
  { titulo: "10 maneiras de atrair", autor: "R. Dias", categoria: "Mente", tags: JSON.stringify({ hue: 70, label: "mente" }), descricao: "Descubra 10 estratégias comprovadas para atrair o que você deseja na vida.", contadorDownloads: 120 },
  { titulo: "Segredo da persuasão", autor: "J. Leal", categoria: "Vendas", tags: JSON.stringify({ hue: 12, label: "vendas" }), descricao: "Os segredos psicológicos da persuasão que você pode aplicar em qualquer área da vida.", contadorDownloads: 265 },
  { titulo: "Controlando a ansiedade", autor: "F. Melo", categoria: "Mente", tags: JSON.stringify({ hue: 185, label: "mente" }), descricao: "Ferramentas práticas para controlar a ansiedade e recuperar seu bem-estar emocional.", contadorDownloads: 195 },
  { titulo: "Organizze: saia do vermelho", autor: "P. Moura", categoria: "Finanças", tags: JSON.stringify({ hue: 120, label: "finanças" }), descricao: "Aprenda a organizar suas finanças, sair das dívidas e construir um futuro financeiro sólido.", contadorDownloads: 245 },
  { titulo: "Desenvolva seu QI financeiro", autor: "T. Vaz", categoria: "Finanças", tags: JSON.stringify({ hue: 50, label: "finanças" }), descricao: "Desenvolva sua inteligência financeira e tome melhores decisões sobre seu dinheiro.", contadorDownloads: 200 },
  { titulo: "Encontrando dinheiro", autor: "M. Nunes", categoria: "Finanças", tags: JSON.stringify({ hue: 100, label: "finanças" }), descricao: "Estratégias para aumentar sua renda e encontrar novas oportunidades financeiras.", contadorDownloads: 155 },
  { titulo: "Liberte o gigante financeiro", autor: "A. Lopes", categoria: "Finanças", tags: JSON.stringify({ hue: 260, label: "finanças" }), descricao: "Desperte seu potencial financeiro interior e alcance a liberdade que você merece.", contadorDownloads: 170 },
  { titulo: "TikTok Marketing", autor: "V. Silva", categoria: "Marketing", tags: JSON.stringify({ hue: 330, label: "marketing" }), descricao: "Como usar o poder do TikTok para fazer crescer seu negócio e atrair novos clientes.", contadorDownloads: 310 },
  { titulo: "Orçamento familiar", autor: "B. Reis", categoria: "Finanças", tags: JSON.stringify({ hue: 195, label: "finanças" }), descricao: "Planeje suas finanças familiares de forma prática e eficiente com este guia completo.", contadorDownloads: 185 },
];

interface EmployeeSeed {
  fullName: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "pending" | "inactive";
  lastLoginDaysAgo: number | null;
  readingCount: number;
}

const EMPLOYEES: EmployeeSeed[] = [
  { fullName: "Rafael Moura", email: "rafael@horizontelivros.com.br", role: "Gerente", department: "Vendas", status: "active", lastLoginDaysAgo: 1, readingCount: 5 },
  { fullName: "Camila Souza", email: "camila@horizontelivros.com.br", role: "Vendedora", department: "Vendas", status: "active", lastLoginDaysAgo: 3, readingCount: 4 },
  { fullName: "Thiago Alves", email: "thiago@horizontelivros.com.br", role: "Vendedor", department: "Vendas", status: "pending", lastLoginDaysAgo: null, readingCount: 0 },
  { fullName: "Beatriz Nunes", email: "beatriz@horizontelivros.com.br", role: "Estoquista", department: "Operações", status: "active", lastLoginDaysAgo: 7, readingCount: 2 },
  { fullName: "Paulo Reis", email: "paulo@horizontelivros.com.br", role: "—", department: "—", status: "inactive", lastLoginDaysAgo: 60, readingCount: 0 },
];

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log("Seeding database...");

  // ============ COMPANY + ADMIN ============
  const adminHash = await bcrypt.hash("test123", 10);

  const company = await prisma.company.upsert({
    where: { cnpj: "12345678000190" },
    update: { statusAssinatura: "ativa" },
    create: {
      cnpj: "12345678000190",
      name: "Horizonte Livros",
      email: "contato@horizontelivros.com.br",
      statusAssinatura: "ativa",
      user: {
        create: {
          passwordHash: adminHash,
          name: "Marina Castro",
          email: "marina@horizontelivros.com.br",
          role: "ADMIN",
          lastLoginAt: new Date(),
        },
      },
    },
    include: { user: true },
  });
  console.log(`Company: ${company.name} (${company.cnpj})`);

  // ============ EBOOKS ============
  let ebookCount = 0;
  const ebookIds: string[] = [];
  for (const ebook of EBOOKS) {
    const existing = await prisma.ebook.findFirst({ where: { titulo: ebook.titulo } });
    if (existing) {
      ebookIds.push(existing.id);
    } else {
      const created = await prisma.ebook.create({ data: ebook });
      ebookIds.push(created.id);
      ebookCount++;
    }
  }
  console.log(`Seeded ${ebookCount} new ebooks (${EBOOKS.length - ebookCount} already existed).`);

  // ============ EMPLOYEES + READING HISTORY ============
  let empCreated = 0;
  for (const emp of EMPLOYEES) {
    const existing = await prisma.user.findUnique({ where: { email: emp.email } });
    if (existing) continue;

    const pwHash = await bcrypt.hash("test123", 10);
    // Note: User.companyId is @unique (só o admin tem). Funcionários ligam via Employee.companyId.
    const user = await prisma.user.create({
      data: {
        email: emp.email,
        name: emp.fullName,
        passwordHash: pwHash,
        role: "USER",
        isActive: emp.status !== "inactive",
        lastLoginAt: emp.lastLoginDaysAgo !== null ? daysAgo(emp.lastLoginDaysAgo) : null,
      },
    });

    await prisma.employee.create({
      data: {
        fullName: emp.fullName,
        corporateEmail: emp.email,
        role: emp.role,
        department: emp.department,
        isActive: emp.status !== "inactive",
        companyId: company.id,
        userId: user.id,
      },
    });

    // Reading history for active employees
    for (let i = 0; i < emp.readingCount; i++) {
      const ebookId = ebookIds[(i * 3 + empCreated * 2) % ebookIds.length];
      const progressPct =
        i === 0 ? 100 : i === 1 ? 72 : i === 2 ? 48 : 16 + Math.floor(Math.random() * 20);
      const lastReadDays = (emp.lastLoginDaysAgo ?? 0) + i * 2;
      try {
        await prisma.readingHistory.create({
          data: {
            userId: user.id,
            ebookId,
            progressPct,
            lastPage: Math.floor((progressPct / 100) * 268),
            lastReadAt: daysAgo(lastReadDays),
          },
        });
      } catch {
        // unique constraint may fire on seed re-run; ignore
      }
    }

    empCreated++;
  }
  console.log(`Created ${empCreated} new employees with reading history.`);

  // Admin reading history (Marina)
  if (company.user) {
    const marinaId = company.user.id;
    const marinaBooks = [
      { pct: 100, daysAgo: 2 },
      { pct: 58, daysAgo: 1 },
      { pct: 22, daysAgo: 0 },
    ];
    for (let i = 0; i < marinaBooks.length; i++) {
      const { pct, daysAgo: d } = marinaBooks[i];
      const ebookId = ebookIds[i];
      try {
        await prisma.readingHistory.upsert({
          where: { userId_ebookId: { userId: marinaId, ebookId } },
          update: { progressPct: pct, lastPage: Math.floor((pct / 100) * 268), lastReadAt: daysAgo(d) },
          create: {
            userId: marinaId,
            ebookId,
            progressPct: pct,
            lastPage: Math.floor((pct / 100) * 268),
            lastReadAt: daysAgo(d),
          },
        });
      } catch { /* noop */ }
    }
  }

  console.log("\nTest credentials:");
  console.log("  Admin CNPJ: 12.345.678/0001-90");
  console.log("  Admin senha: test123");
  console.log("  Funcionários: {primeiro-nome}@horizontelivros.com.br / test123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
