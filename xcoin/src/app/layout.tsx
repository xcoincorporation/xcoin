import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// === Tipografías ===
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// === Metadatos globales ===
export const metadata: Metadata = {
  title: "XCoin — El otro lado del bloque",
  description: "Acumular hoy. Liberar mañana. Decidir entre todos.",
  keywords: [
    "XCoin",
    "Blockchain",
    "Criptomoneda",
    "MarketCap Lock",
    "Tokenomics 80/20",
    "El otro lado del bloque",
  ],
  authors: [{ name: "XCoin Corporation", url: "https://xcoin.io" }],
  openGraph: {
    title: "XCoin — El otro lado del bloque",
    description: "Acumular hoy. Liberar mañana. Decidir entre todos.",
    url: "https://xcoin.io",
    siteName: "XCoin",
    images: [
      {
        url: "/xcoin-logo.png",
        width: 800,
        height: 800,
        alt: "XCoin Moneda Espejo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  icons: {
    icon: "/xcoin-logo.png",
    shortcut: "/favicon.ico",
  },
  metadataBase: new URL("https://xcoin.io"),
};

// === RootLayout ===
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="bg-graphite text-silver">
      <head>
        <link rel="icon" href="/xcoin-logo.png" />
        <meta name="theme-color" content="#1B1B1B" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-gold/30`}
      >
        {children}
        <footer className="text-center text-xs text-neutral-500 py-4 border-t border-neutral-800 mt-12">
          © {new Date().getFullYear()} XCoin Corporation — El otro lado del
          bloque.
        </footer>
      </body>
    </html>
  );
}
