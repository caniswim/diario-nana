import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diário de Reconexão",
  description: "Seu diário de alimentação consciente",
  manifest: "/manifest.json",
  themeColor: "#5B8DEF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Diário",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          {children}
        </div>
      </body>
    </html>
  );
}
