import type { Metadata } from "next";
import { Roboto, Inter } from "next/font/google"; // Helvetica geralmente é fonte de sistema
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: '--font-roboto' });
// Usando Inter como fallback próximo de Helvetica para Google Fonts, ou configure localmente
const inter = Inter({ subsets: ["latin"], variable: '--font-helvetica' });

export const metadata: Metadata = {
  title: "Bemzao Landing Page",
  description: "Soluções modernas para seu negócio",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.variable} ${inter.variable} antialiased bg-[var(--ast-color-5)]`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}