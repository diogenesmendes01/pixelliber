import { PrismaClient } from "../src/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "prisma/dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter } as any);

const ebooks = [
  {
    titulo: "Pai Rico, Pai Pobre",
    autor: "Robert T. Kiyosaki",
    descricao:
      "Uma das obras mais influentes sobre educação financeira, que desafia a sabedoria convencional sobre dinheiro e ensina como alcançar a independência financeira.",
    categoria: "Finanças Pessoais",
    capa: "/ebooks/pai-rico-pai-pobre.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2017-03-15"),
    numeroPaginas: 207,
    tags: "finanças,poupança,investimentos,negócios",
    destaque: true,
    contadorDownloads: 5420,
  },
  {
    titulo: "A Felicidade Começa Com Você",
    autor: "Autor Desconhecido",
    descricao:
      "Descubra que a verdadeira felicidade não depende de circunstâncias externas, mas de escolhas internas. Um guia prático para transformar sua perspectiva de vida.",
    categoria: "Desenvolvimento Pessoal",
    capa: "/ebooks/livros-mais-vendidos-em-2022.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2022-01-10"),
    numeroPaginas: 156,
    tags: "felicidade,desenvolvimento pessoal,mindset,realização",
    destaque: true,
    contadorDownloads: 4210,
  },
  {
    titulo: "Autoridade no YouTube",
    autor: "Thiago dos Reis",
    descricao:
      "Aprenda a construir autoridade e relevância no YouTube, atraindo milhares de inscritos e construindo um canal monetizável.",
    categoria: "Marketing Digital",
    capa: "/ebooks/Autoridade-no-Youtube-1.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2021-06-20"),
    numeroPaginas: 189,
    tags: "youtube,marketing digital,tráfego,monetização",
    destaque: true,
    contadorDownloads: 3850,
  },
  {
    titulo: "Sucesso nos Negócios de Coaching",
    autor: "Tarley Lana",
    descricao:
      "O guia definitivo para construir um negócio lucrativo como coach. Estratégias comprovadas para atrair clientes e escalar seus resultados.",
    categoria: "Coaching",
    capa: "/ebooks/sucesso-os-negocios-de-coaching-1.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2021-09-05"),
    numeroPaginas: 234,
    tags: "coaching,negócios,carreira,mentoria",
    destaque: true,
    contadorDownloads: 3670,
  },
  {
    titulo: "Copywriting: Destruindo Objeções",
    autor: "Autor Desconhecido",
    descricao:
      "Técnicas avançadas de copywriting para eliminar objeções e aumentar suas conversões. Aprenda a escrever textos que vendem.",
    categoria: "Copywriting",
    capa: "/ebooks/COPYWRINTING-destruindo-objeções-1.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2022-04-12"),
    numeroPaginas: 178,
    tags: "copywriting,marketing,vendas,conversão",
    destaque: true,
    contadorDownloads: 3440,
  },
  {
    titulo: "Como Parar de se Preocupar com o Que as Pessoas Pensam",
    autor: "Autor Desconhecido",
    descricao:
      "Liberte-se da necessidade de aprovação alheia e viva com mais autenticidade e confiança. Estratégias práticas para superar a preocupação social.",
    categoria: "Desenvolvimento Pessoal",
    capa: "/ebooks/Como-parar-de-se-preocupar-com-que-as-pessoas-pensam-sobre-você-1.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2020-11-30"),
    numeroPaginas: 145,
    tags: "ansiedade,autoestima,desenvolvimento pessoal,liberdade",
    destaque: true,
    contadorDownloads: 3200,
  },
  {
    titulo: "Do Ponto Zero a Conversão",
    autor: "Autor Desconhecido",
    descricao:
      "O roteiro completo para transformar visitantes em compradores. Funis de conversão, landing pages e estratégias de persuasão.",
    categoria: "Marketing Digital",
    capa: "/ebooks/Do-ponto-zero-a-conversão-1.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2021-03-18"),
    numeroPaginas: 201,
    tags: "conversão,funil,marketing digital,vendas",
    destaque: true,
    contadorDownloads: 2980,
  },
  {
    titulo: "10 Maneiras de Atrair as Coisas Que Você Deseja",
    autor: "Autor Desconhecido",
    descricao:
      "Descubra os segredos da lei da atração e aprenda a manifestar a vida que você deseja. Um guia prático e objetivo.",
    categoria: "Desenvolvimento Pessoal",
    capa: "/ebooks/10-maneiras-de-atrair-as-coisas-que-você-realmente-deseja-na-sua-vida-1.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2020-08-22"),
    numeroPaginas: 132,
    tags: "lei da atração,manifestação,desenvolvimento pessoal,mentalidade",
    destaque: true,
    contadorDownloads: 4100,
  },
  {
    titulo: "Segredo da Persuasão",
    autor: "Autor Desconhecido",
    descricao:
      "Dominando a arte da persuasão: técnicas psicológicas para influenciar decisões e alcançar seus objetivos.",
    categoria: "Persuasão",
    capa: "/ebooks/Segredo-da-persuasão-1.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2021-07-14"),
    numeroPaginas: 167,
    tags: "persuasão,influência,psicologia,vendas",
    destaque: true,
    contadorDownloads: 2760,
  },
  {
    titulo: "Controlando a Ansiedade",
    autor: "Autor Desconhecido",
    descricao:
      "Ferramentas práticas para controlar a ansiedade e recuperar a paz interior. Técnicas comprovadas de gestão do estresse.",
    categoria: "Saúde Mental",
    capa: "/ebooks/Controlando-a-Ansiedade-1.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2020-05-09"),
    numeroPaginas: 143,
    tags: "ansiedade,saúde mental,meditação,bem-estar",
    destaque: false,
    contadorDownloads: 5100,
  },
  {
    titulo: "ORGANIZZE: Saia do Vermelho",
    autor: "Conrado Schiler",
    descricao:
      "O guia prático para organizar suas finanças, sair das dívidas e construir riqueza. Método testado por milhares de brasileiros.",
    categoria: "Finanças Pessoais",
    capa: "/ebooks/ORGANIZZE-Saia-do-vermelho.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2019-02-28"),
    numeroPaginas: 188,
    tags: "finanças,dívidas,organização,orçamento",
    destaque: false,
    contadorDownloads: 6230,
  },
  {
    titulo: "Desenvolva Seu QI Financeiro",
    autor: "Autor Desconhecido",
    descricao:
      "Aumente sua inteligência financeira e tome melhores decisões sobre dinheiro. Conceitos essenciais para sua independência financeira.",
    categoria: "Finanças Pessoais",
    capa: "/ebooks/Desenvolva-seu-QI-financeiro.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2020-10-15"),
    numeroPaginas: 195,
    tags: "qi financeiro,finanças,investimentos,decisões",
    destaque: false,
    contadorDownloads: 4890,
  },
  {
    titulo: "Encontrando Dinheiro",
    autor: "Autor Desconhecido",
    descricao:
      "Estratégias práticas para aumentar sua renda e encontrar novas fontes de dinheiro. Ideias concretas para melhorar sua situação financeira.",
    categoria: "Finanças Pessoais",
    capa: "/ebooks/Encontrando-Dinheiro.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2021-01-25"),
    numeroPaginas: 134,
    tags: "renda,finanças,negócios,lucro",
    destaque: false,
    contadorDownloads: 4560,
  },
  {
    titulo: "Extração de Dinheiro",
    autor: "Autor Desconhecido",
    descricao:
      "Técnicas avançadas de extração de valor e monetização. Como transformar qualquer negócio em uma máquina de gerar dinheiro.",
    categoria: "Negócios",
    capa: "/ebooks/Extração-de-dinheiro.png",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2021-08-03"),
    numeroPaginas: 212,
    tags: "monetização,negócios,lucro,estratégia",
    destaque: false,
    contadorDownloads: 3980,
  },
  {
    titulo: "Liberte o Gigante Financeiro Interior",
    autor: "Autor Desconhecido",
    descricao:
      "Desperte seu potencial financeiro máximo e conquiste a liberdade que você merece. Um livro transformador sobre mentalidade de riqueza.",
    categoria: "Finanças Pessoais",
    capa: "/ebooks/Liberte-o-gigante-financeiro-interior.png",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2020-12-01"),
    numeroPaginas: 176,
    tags: "mentalidade,riqueza,finanças,liberdade",
    destaque: false,
    contadorDownloads: 4120,
  },
  {
    titulo: "O Poder do Dinheiro Extra",
    autor: "Autor Desconhecido",
    descricao:
      "Como usar cada centavo extra para construir riqueza. Estratégias simples e eficazes para multiplicar seu dinheiro.",
    categoria: "Finanças Pessoais",
    capa: "/ebooks/Dinheiro-o-poder-do-dinheiro-extra.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2021-04-20"),
    numeroPaginas: 158,
    tags: "investimentos,poupança,finanças,crescimento",
    destaque: false,
    contadorDownloads: 3760,
  },
  {
    titulo: "TikTok Marketing: Como Usar o Poder do TikTok",
    autor: "Autor Desconhecido",
    descricao:
      "Domine o TikTok e atraia milhões de visualizações. Guia completo para usar a plataforma a seu favor no marketing digital.",
    categoria: "Marketing Digital",
    capa: "/ebooks/Tiktok-Marketing-como-o-usar-o-poder-do-1.jpg",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2021-11-08"),
    numeroPaginas: 182,
    tags: "tiktok,marketing digital,redes sociais,tráfego",
    destaque: false,
    contadorDownloads: 4340,
  },
  {
    titulo: "Orçamento Familiar",
    autor: "Autor Desconhecido",
    descricao:
      "Planeje seu orçamento familiar de forma simples e eficiente. Controle seus gastos e alcance seus objetivos financeiros.",
    categoria: "Finanças Pessoais",
    capa: "/ebooks/Orçamento-Familiar.png",
    pdf: "/ebooks/sample.pdf",
    dataPublicacao: new Date("2019-07-15"),
    numeroPaginas: 124,
    tags: "orçamento,família,finanças,organização",
    destaque: false,
    contadorDownloads: 5670,
  },
];

const EXPECTED_COUNT = 18;

async function main() {
  console.log("Seeding database...");

  await prisma.ebook.deleteMany({});

  for (const ebook of ebooks) {
    await prisma.ebook.create({ data: ebook as any });
  }

  console.log(`Seeded ${ebooks.length} ebooks.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
