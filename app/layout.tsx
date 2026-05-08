import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mangas Controll",
  description: "Controle pessoal de colecao de mangas"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
