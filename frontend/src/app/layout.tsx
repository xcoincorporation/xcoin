import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SupplyBadge from "@/components/SupplyBadge";
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
    <html lang="es" className="bg-[#05060a] text-silver">
      <head>
        <link rel="icon" href="/xcoin-logo.png" />
        <meta name="theme-color" content="#05060a" />
      </head>

      <body
        className="min-h-screen bg-[#020617] bg-[radial-gradient(circle_at_top,_#0f172a_0,_#020617_45%,_#000_100%)] text-slate-50 antialiased"
      >
        {/* Glow de fondo global */}
        <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-64 bg-gradient-to-b from-blue-500/25 via-cyan-400/10 to-transparent blur-3xl" />
        <div className="pointer-events-none fixed inset-y-0 right-[-20%] z-0 w-72 bg-blue-500/10 blur-3xl" />

        <ToastProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            {/* NAVBAR */}
            <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl shadow-[0_0_40px_rgba(15,23,42,0.9)]">
              <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
                {/* izquierda: brand + links */}
                <div className="flex items-center gap-8">
                  {/* Brand / Inicio */}
                  <Link
                    href="/"
                    className="bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-400 bg-clip-text text-sm font-semibold text-transparent drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                  >
                    XCoin
                  </Link>

                  <nav className="flex items-center gap-6 text-sm text-neutral-200">
                    <Link href="/whitepaper" className="hover:text-[#38bdf8] transition">
                      Whitepaper
                    </Link>
                    <Link href="/tokenomics" className="hover:text-[#38bdf8] transition">
                      Tokenomics
                    </Link>
                    <Link href="/oraculo" className="hover:text-[#38bdf8] transition">
                      Oráculo
                    </Link>
                    <Link href="/dashboard" className="hover:text-[#38bdf8] transition">
                      Dashboard
                    </Link>
                    <Link href="/buy" className="hover:text-[#38bdf8] transition">
                      Comprar (demo)
                    </Link>
                    <Link href="/roadmap" className="hover:text-[#38bdf8] transition">
                      Roadmap
                    </Link>
                    <Link href="/whitelist" className="hover:text-[#38bdf8] transition">
                      Whitelist
                    </Link>
                    <Link href="/analytics" className="hover:text-[#38bdf8] transition">
                      Analytics
                    </Link>
                  </nav>
                </div>

                {/* derecha: badge de supply / controles */}
                <div className="hidden items-center gap-3 md:flex">
                  <SupplyBadge />
                </div>
              </div>
            </header>

            {/* CONTENIDO */}
            <main className="pb-12">{children}</main>

            {/* FOOTER */}
            <footer className="mt-16 border-t border-slate-800/60 bg-black/40 pt-8 pb-10 px-4 text-center text-[0.7rem] text-slate-500/80 leading-relaxed">
              <p>
                © {new Date().getFullYear()} XCoin Corporation — El otro lado del bloque.
              </p>
              <p className="mt-2 max-w-4xl mx-auto">
                XCoin es un experimento técnico de laboratorio desplegado sobre la red de
                pruebas Sepolia. Ningún elemento del presente sitio constituye oferta de
                inversión, asesoramiento financiero ni promesa de retorno. El acceso a
                fases futuras, whitelists o pruebas técnicas dependerá de criterios de
                elegibilidad, requisitos de cumplimiento y del marco regulatorio vigente en
                cada jurisdicción. El proyecto podrá modificarse o cancelarse sin previo
                aviso.
              </p>
            </footer>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
