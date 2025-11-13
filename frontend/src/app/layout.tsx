import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SupplyBadge from "../components/SupplyBadge";
import { ToastProvider } from "@/hooks/useToast";
import Link from "next/link";


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
        {/* El provider debe envolver TODO para habilitar toasts en cualquier parte */}
        <ToastProvider>
          {/* NAVBAR */}
          <header className="sticky top-0 z-50 bg-[#0f0f10]/80 backdrop-blur border-b border-white/5 h-14">
            <div className="mx-auto max-w-6xl px-4 h-full flex items-center justify-between">
              {/* izquierda: brand + links */}
              <nav className="flex items-center gap-6 text-sm text-neutral-200">
                <Link href="#whitepaper" className="hover:text-gold transition">
                  Whitepaper
                </Link>
                <Link href="#tokenomics" className="hover:text-gold transition">
                  Tokenomics
                </Link>
                <Link href="/oraculo" className="hover:text-gold transition">
                  Oráculo
                </Link>
                <Link href="/dashboard" className="hover:text-gold transition">
                  Dashboard
                </Link>
                <Link href="#roadmap" className="hover:text-gold transition">
                  Roadmap
                </Link>
              </nav>

              {/* derecha: controles + Supply */}
              <div className="flex items-center gap-3">
                {/* idioma, whitelist, etc. */}
                {/* Supply anclado: su panel se posiciona relativo a este contenedor */}
                <SupplyBadge />
              </div>
            </div>
          </header>

          <main>{children}</main>

          <footer className="text-center text-xs text-neutral-500 py-4 border-t border-neutral-800 mt-12">
            © {new Date().getFullYear()} XCoin Corporation — El otro lado del bloque.
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
