import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SupplyBadge from "../components/SupplyBadge";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XCoin — El otro lado del bloque",
  description: "Acumular hoy. Liberar mañana. Decidir entre todos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="bg-graphite text-silver">
      <head>
        <link rel="icon" href="/xcoin-logo.png" />
        <meta name="theme-color" content="#1B1B1B" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-[#f5c84b]/30`}>
        {/* NAVBAR */}
        <header className="sticky top-0 z-50 bg-[#0f0f10]/80 backdrop-blur border-b border-white/5 h-14">
          <div className="mx-auto max-w-6xl px-4 h-full flex items-center justify-between">
            {/* izquierda: brand + links */}
            <nav className="flex items-center gap-6">
              {/* ... */}
            </nav>

            {/* derecha: botones + Supply */}
            <div className="flex items-center gap-3">
              <SupplyBadge />
              {/* otros botones (idioma, whitelist, etc.) */}
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="text-center text-xs text-neutral-500 py-4 border-t border-neutral-800 mt-12">
          © {new Date().getFullYear()} XCoin Corporation — El otro lado del bloque.
        </footer>
      </body>
    </html>
  );
}
