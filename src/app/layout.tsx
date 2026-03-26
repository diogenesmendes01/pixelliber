import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CodeWave Technologies — E-books sem limites",
  description:
    "Veja e baixe diversos e-books, sem limites. Leia onde quiser, quando quiser.",
  icons: {
    icon: "/cropped-Logo-CodeWave_Favicon-32x32.png",
  },
  openGraph: {
    title: "CodeWave Technologies — E-books sem limites",
    description:
      "Veja e baixe diversos e-books, sem limites. Leia onde quiser, quando quiser.",
    url: "https://codewavetechnologies.com.br",
    siteName: "CodeWave Technologies",
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
    <html lang="pt-BR" className={`${poppins.variable} antialiased`}>
      <body className="min-h-screen bg-black text-white">{children}</body>
    </html>
  );
}
