import type { BookData } from "@/components/BookCover";

export const BOOKS: BookData[] = [
  { id: 1, t: "Pai rico, pai pobre", a: "Robert Kiyosaki", tag: "finanças", hue: 38 },
  { id: 2, t: "A felicidade começa com você", a: "M. Oliveira", tag: "mente", hue: 340 },
  { id: 3, t: "Autoridade no YouTube", a: "C. Rocha", tag: "marketing", hue: 0 },
  { id: 4, t: "O negócio do coaching", a: "P. Alves", tag: "negócios", hue: 210 },
  { id: 5, t: "Copywriting: destruindo objeções", a: "A. Costa", tag: "vendas", hue: 20 },
  { id: 6, t: "Como parar de se preocupar", a: "D. Ramos", tag: "mente", hue: 160 },
  { id: 7, t: "Do ponto zero à conversão", a: "L. Souza", tag: "marketing", hue: 280 },
  { id: 8, t: "10 maneiras de atrair", a: "R. Dias", tag: "mente", hue: 70 },
  { id: 9, t: "Segredo da persuasão", a: "J. Leal", tag: "vendas", hue: 12 },
  { id: 10, t: "Controlando a ansiedade", a: "F. Melo", tag: "mente", hue: 185 },
  { id: 11, t: "Organizze: saia do vermelho", a: "P. Moura", tag: "finanças", hue: 120 },
  { id: 12, t: "Desenvolva seu QI financeiro", a: "T. Vaz", tag: "finanças", hue: 50 },
  { id: 13, t: "Encontrando dinheiro", a: "M. Nunes", tag: "finanças", hue: 100 },
  { id: 14, t: "Liberte o gigante financeiro", a: "A. Lopes", tag: "finanças", hue: 260 },
  { id: 15, t: "TikTok Marketing", a: "V. Silva", tag: "marketing", hue: 330 },
  { id: 16, t: "Orçamento familiar", a: "B. Reis", tag: "finanças", hue: 195 },
];

export const NEW_IDS = [15, 16, 13, 9];
export const TOP_IDS = [1, 5, 12, 7, 3];
export const RECOMMEND_IDS = [2, 6, 10, 14];

export const CATEGORIES = ["finanças", "marketing", "mente", "negócios", "vendas"];

export interface Plan {
  id: string;
  nome: string;
  preco: number | null;
  periodo: string;
  usuarios: number | "ilimitado";
  features: string[];
  cta: string;
  atual?: boolean;
  destaque?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    nome: "Starter",
    preco: 149,
    periodo: "mês",
    usuarios: 3,
    features: ["Acervo completo", "Até 3 acessos", "Leitura offline 30 dias"],
    cta: "Começar",
  },
  {
    id: "standard",
    nome: "Standard",
    preco: 299,
    periodo: "mês",
    usuarios: 10,
    features: ["Acervo completo", "Até 10 acessos", "Leitura offline 30 dias", "Marca d'água por CNPJ"],
    cta: "Plano atual",
    atual: true,
  },
  {
    id: "pro",
    nome: "Pro",
    preco: 599,
    periodo: "mês",
    usuarios: 25,
    features: [
      "Acervo completo",
      "Até 25 acessos",
      "PDF original com marca d'água",
      "Relatórios de uso",
      "Suporte prioritário",
      "SSO (Google/Microsoft)",
    ],
    cta: "Fazer upgrade",
    destaque: true,
  },
  {
    id: "custom",
    nome: "Enterprise",
    preco: null,
    periodo: "sob consulta",
    usuarios: "ilimitado",
    features: [
      "Plano sob medida",
      "Domínio próprio",
      "SAML/SSO",
      "Curadoria dedicada",
      "SLA 99.9%",
    ],
    cta: "Falar com vendas",
  },
];

export function booksByTag(tag: string): BookData[] {
  return BOOKS.filter((b) => b.tag === tag);
}

export function booksByTags(tags: string[]): BookData[] {
  return BOOKS.filter((b) => tags.includes(b.tag));
}

export function booksWithNew(books: BookData[]): BookData[] {
  return books.map((b) => ({ ...b, isNew: NEW_IDS.includes(Number(b.id)) }));
}
