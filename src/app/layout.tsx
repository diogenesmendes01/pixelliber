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
  title: "Pixel Liber — E-books sem limites",
  description:
    "Veja e baixe diversos e-books, sem limites. Leia onde quiser, quando quiser.",
  icons: {
    icon: "/logo/vertical/vertical-dark.png",
  },
  openGraph: {
    title: "Pixel Liber — E-books sem limites",
    description:
      "Veja e baixe diversos e-books, sem limites. Leia onde quiser, quando quiser.",
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
    <html lang="pt-BR" className={`${poppins.variable} antialiased`}>
      <body className="min-h-screen bg-[#121212] text-[#E8E8E8]">{children}</body>
    </html>
  );
}
