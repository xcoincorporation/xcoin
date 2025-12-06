"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import LandingOracleDashboard from "@/components/LandingOracleDashboard";

import HeaderStatsComponent from "@/components/HeaderStats";
import InvestorCTA from "@/components/InvestorCTA";
// Si en algún momento usás TokenomicsCard, descomentalo y úsalo.
// import TokenomicsCard from "../components/TokenomicsCard";

const TreasuryDonut = dynamic(() => import("../components/TreasuryDonut"), {
  ssr: false,
});

const navItems = [
  { label: "Whitepaper", href: "#whitepaper" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Oráculo", href: "/oraculo" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Roadmap", href: "#roadmap" },
];

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-carbon p-4 shadow-xl border border-neutral-700">
      <div className="text-sm text-neutral-400">{label}</div>
      <div className="text-2xl font-semibold text-slate-100 tracking-tight">{value}</div>
      {sub && <div className="text-xs text-neutral-400 mt-1">{sub}</div>}
    </div>
  );
}

function SectionTitle({ k, sub }: { k: string; sub?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-100">{k}</h2>
      {sub && <p className="text-neutral-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function HomePage() {
  const prefersReduced = useReducedMotion();

  return (
  //<main className="min-h-screen bg-graphite text-slate-100">
    <main className="min-h-screen bg-[#020617] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),transparent_55%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.16),transparent_55%)] text-slate-50">
      {/* NAVBAR */}
      <header className="sticky top-0 backdrop-blur bg-black/40 border-b border-neutral-800 z-50">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-slate-200 to-amber-500" />
            <span className="font-semibold tracking-wide">XCoin</span>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-neutral-300 hover:text-white"
              >
                {n.label}
              </a>
            ))}
          </nav>

          {/* Stats on-chain (header) */}
          <div className="hidden md:flex items-center">
            <HeaderStatsComponent />
          </div>

          {/* Idioma + Whitelist */}
          <div className="flex items-center gap-3">
            <select
              aria-label="language"
              className="bg-carbon text-sm rounded-xl px-2 py-1 border border-neutral-700"
            >
              <option>ES</option>
              <option>EN</option>
            </select>

            <Link
              href="/whitelist"
              className="inline-flex items-center justify-center rounded-full bg-[#f5c84b] text-black text-sm font-semibold px-6 py-2.5 hover:brightness-95 transition"
            >
              Whitelist
            </Link>

          </div>
        </div>
      </header>

      {/* HERO */}
      
      <section className="py-16 border-t border-slate-800/70 bg-slate-900/40 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:order-1 order-2"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              El otro lado del <span className="text-amber-400">bloque</span>.
            </h1>

            <p className="mt-4 text-neutral-300 text-lg">
              <span className="font-medium">XCoin</span> es un experimento de
              acumulación disciplinada:
              <br />
              <span className="italic">
                Acumular hoy. Liberar mañana. Decidir entre todos.
              </span>
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#whitepaper"
                className="rounded-2xl border border-neutral-700 px-4 py-2 hover:bg-white/5"
              >
                Leer Whitepaper
              </a>
              <a
                href="#tokenomics"
                className="rounded-2xl bg-steel px-4 py-2 hover:opacity-90"
              >
                Ver Tokenomics 80/20
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Stat label="Precio de entrada" value="$1 USD" sub="Compra inicial" />
              <Stat label="Reserva Casa" value="20%" sub="Tesorería y estabilidad" />
              <Stat label="Bloqueo" value="Por hitos de MC" sub="Market Cap objetivo" />
            </div>
          </motion.div>

          {/* Moneda */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center md:justify-end md:order-2 order-1"
          >
            <motion.div
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              animate={prefersReduced ? {} : { rotateY: [0, 360] }}
              transition={
                prefersReduced
                  ? {}
                  : { duration: 10, repeat: Infinity, ease: "linear" }
              }
              whileHover={prefersReduced ? {} : { rotateY: "+=180" }}
              className="drop-shadow-2xl md:mr-6"
            >
              <Image
                src="/xcoin-logo.png"
                alt="XCoin Moneda Espejo"
                width={320}
                height={320}
                className="w-56 h-56 md:w-80 md:h-80 object-contain [backface-visibility:hidden]"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MANIFIESTO */}
      <section id="whitepaper" className="border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle
            k="Manifiesto"
            sub="Transparencia técnica y disciplina colectiva"
          />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4 text-neutral-300 leading-relaxed">
              <p>
                XCoin propone una regla clara y auditable: los tokens adquiridos se
                bloquean por fases hasta que el proyecto alcance hitos de capitalización
                de mercado definidos en el whitepaper y verificados por oráculos públicos.
              </p>
              <p>
                La especulación temprana se transforma en acumulación genuina. Cada
                tenedor pasa a ser parte de una estrategia colectiva de largo plazo con
                visibilidad on-chain.
              </p>
              <p>
                Nuestro compromiso es con el código abierto, la gobernanza ética y la
                defensa contra prácticas predatorias: liberaciones escalonadas, tesorería
                estabilizadora y métricas públicas.
              </p>
            </div>
            <div className="bg-carbon p-5 rounded-2xl border border-neutral-700">
              <h3 className="font-semibold text-slate-100">Descargas</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a className="hover:underline" href="#">
                    Whitepaper (PDF)
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href="#">
                    Repositorio (GitHub)
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href="#">
                    Auditoría (próximamente)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN ORIENTADA A INVERSORES */}
      <InvestorCTA />

      {/* TOKENOMICS */}
      <section id="tokenomics" className="border-t border-neutral-800 bg-[#161616]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle
            k="Tokenomics 80/20"
            sub="Diseñado para acumulación responsable"
          />

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Columna izquierda: tarjetas de texto */}
            <div className="space-y-3 text-neutral-300">
              <div className="rounded-xl bg-carbon p-4 border border-neutral-700">
                <div className="text-slate-100 font-semibold">Distribución inicial</div>
                <p className="text-sm mt-1">
                  80% Usuarios (bloqueado por fases) · 20% Tesorería (estabilidad,
                  desarrollo, MM).
                </p>
              </div>
              <div className="rounded-xl bg-carbon p-4 border border-neutral-700">
                <div className="text-slate-100 font-semibold">Precio de lanzamiento</div>
                <p className="text-sm mt-1">Entrada fija a 1 USD por token.</p>
              </div>
              <div className="rounded-xl bg-carbon p-4 border border-neutral-700">
                <div className="text-slate-100 font-semibold">Oráculo</div>
                <p className="text-sm mt-1">
                  Feed público que publica Market Cap objetivo y activa desbloqueos.
                </p>
              </div>
            </div>

            {/* Columna derecha: donut + fases */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-700 p-4 bg-carbon">
                <TreasuryDonut />
              </div>

              <div className="rounded-2xl border border-neutral-700 p-6 bg-linear-to-br from-[#2C2C2C] to-[#1f1f1f]">
                <div className="text-slate-100 font-semibold mb-2">
                  Fases de desbloqueo (ejemplo)
                </div>
                <ul className="space-y-3 text-neutral-300 text-sm">
                  <li>• Fase 1 — 10% del objetivo: libera 10% de cada tenencia</li>
                  <li>• Fase 2 — 25% del objetivo: libera +15%</li>
                  <li>• Fase 3 — 50% del objetivo: libera +25%</li>
                  <li>• Fase 4 — 75% del objetivo: libera +25%</li>
                  <li>• Fase 5 — 100% del objetivo: libera el resto</li>
                </ul>
                <p className="mt-4 text-xs text-neutral-400">
                  *Ejemplo de referencia. Los porcentajes finales se fijan en el whitepaper.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* DASHBOARD PLACEHOLDER */}
      
      <section className="border-t border-neutral-900 bg-black/40">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 md:px-0">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Dashboard en vivo
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Oráculo, progreso y transparencia del motor de vesting en testnet.
            </p>
          </div>

          <LandingOracleDashboard />
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="border-t border-neutral-800 bg-[#161616]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle k="Roadmap" sub="Del concepto al lanzamiento" />

          <ol className="relative border-l border-neutral-700 pl-6 space-y-8">
            <li>
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-amber-500" />
              <div className="text-slate-100 font-semibold">Fase 1 – Concepción</div>
              <div className="text-neutral-300 text-sm">
                Nombre, manifiesto, marca, tokenomics, registro.
              </div>
            </li>
            <li>
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-amber-500" />
              <div className="text-slate-100 font-semibold">
                Fase 2 – Whitepaper &amp; Legal
              </div>
              <div className="text-neutral-300 text-sm">
                Documento técnico, reglas de desbloqueo, compliance.
              </div>
            </li>
            <li>
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-amber-500" />
              <div className="text-slate-100 font-semibold">Fase 3 – Smart Contracts</div>
              <div className="text-neutral-300 text-sm">
                Token ERC-20, Vault de bloqueo, oráculo integrado (testnet).
              </div>
            </li>
            <li>
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-amber-500" />
              <div className="text-slate-100 font-semibold">
                Fase 4 – Web + Dashboard
              </div>
              <div className="text-neutral-300 text-sm">
                Landing multilengua, panel en vivo, repos y docs.
              </div>
            </li>
            <li>
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-amber-500" />
              <div className="text-slate-100 font-semibold">Fase 5 – Lanzamiento</div>
              <div className="text-neutral-300 text-sm">
                Mainnet, comunicación internacional, apertura controlada.
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-3 gap-6 text-sm text-neutral-400">
          <div>
            <div className="font-semibold text-slate-100">XCoin</div>
            <p className="mt-2">El otro lado del bloque.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-100">Recursos</div>
            <ul className="mt-2 space-y-1">
              <li>
                <a className="hover:underline" href="#whitepaper">
                  Whitepaper
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#tokenomics">
                  Tokenomics
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#dashboard">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-100">Legal</div>
            <p className="mt-2">
              No es asesoramiento financiero. El uso de XCoin implica riesgos. Lea el
              whitepaper.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
