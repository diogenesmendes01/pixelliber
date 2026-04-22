import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pixel Liber — Biblioteca digital corporativa",
  description: "Centenas de e-books de finanças, marketing e desenvolvimento pessoal. Leia online, salve offline, compartilhe trechos.",
  icons: {
    icon: "/Logo-CodeWave_Favicon.png",
  },
  openGraph: {
    title: "Pixel Liber — Biblioteca digital corporativa",
    description: "Centenas de e-books de finanças, marketing e desenvolvimento pessoal.",
    url: "https://pixelliberdigital.com",
    siteName: "Pixel Liber",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
