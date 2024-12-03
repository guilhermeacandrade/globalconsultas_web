import type { Metadata } from "next";
import { inter } from "@/app/fonts/GoogleFonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Consultas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className}  antialiased`}>{children}</body>
    </html>
  );
}
