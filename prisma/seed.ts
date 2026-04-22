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
          role: "ADMIN",
        },
      },
    },
    include: { user: true },
  });

  console.log(`Company: ${company.name} (${company.cnpj})`);

  let ebookCount = 0;
  for (const ebook of EBOOKS) {
    const existing = await prisma.ebook.findFirst({ where: { titulo: ebook.titulo } });
    if (!existing) {
      await prisma.ebook.create({ data: ebook });
      ebookCount++;
    }
  }
  console.log(`Seeded ${ebookCount} new ebooks (${EBOOKS.length - ebookCount} already existed).`);

  console.log("\nTest credentials:");
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
