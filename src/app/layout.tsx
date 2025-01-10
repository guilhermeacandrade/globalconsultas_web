import type { Metadata } from "next";
import { inter } from "@/app/fonts/GoogleFonts";
import "./globals.css";
import SessionProvider from "@/providers/session";
import { Toaster } from "@/components/ui/toaster";

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
      <body className={`${inter.className}  antialiased`}>
        <Toaster />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
