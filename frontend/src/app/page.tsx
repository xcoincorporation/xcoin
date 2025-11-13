"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import HeaderStatsComponent from "../components/HeaderStats";
import TokenomicsCard from "../components/TokenomicsCard";
import HeaderStats from "../components/HeaderStats";
import dynamic from "next/dynamic";


// XCoin – Landing Mockup
// Nota: Este archivo está listo para integrarse en un proyecto Next.js (pages/app client) o CRA.
// Usa Tailwind para estilos. Puedes copiarlo como `app/page.tsx` o `src/App.tsx`.
// Paleta sugerida (tailwind.config.js -> extend colors si deseas):
// graphite: #1B1B1B, carbon: #2C2C2C, silver: #D9D9D9, steel: #4A7D9A, gold: #B98B2E

const navItems = [
  { label: "Whitepaper", href: "#whitepaper" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Oráculo", href: "#dashboard" },
  { label: "Roadmap", href: "#roadmap" },
];

export default function Page() {
  return <XCoinLanding />;
}

const TreasuryDonut = dynamic(() => import("../components/TreasuryDonut"), { ssr: false });

// NOTE: Header stats live in `src/components/HeaderStats.tsx` and are imported above as
// `HeaderStatsComponent`. A local `HeaderStats` was removed to avoid naming collisions
// and accidental client/server invocation issues in the app router.

function XCoinMark() {
  // Emblema SVG: moneda espejo con una "X" central
  return (
    <svg viewBox="0 0 400 400" className="w-64 h-64 drop-shadow-2xl">
      <defs>
        <linearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9AA0A6" />
          <stop offset="100%" stopColor="#D9D9D9" />
        </linearGradient>
        <linearGradient id="gradRight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E3C36C" />
          <stop offset="100%" stopColor="#B98B2E" />
        </linearGradient>
        <clipPath id="clipCircle">
          <circle cx="200" cy="200" r="180" />
        </clipPath>
      </defs>

      <circle cx="200" cy="200" r="190" fill="#212121" stroke="#B98B2E" strokeWidth="6" />

      <g clipPath="url(#clipCircle)">
        {/* Mitad izquierda (ruidosa) */}
        <rect x="0" y="0" width="200" height="400" fill="url(#gradLeft)" />
        {Array.from({ length: 14 }).map((_, i) => (
          <g key={`l-${i}`}>
            <path
              d={`M ${20 + i * 12} ${40 + (i % 5) * 12} C ${60 + i * 8} ${80 + i * 4}, ${40 + i * 10} ${140 + i * 6}, ${120 + i * 6} ${200 + i * 4}`}
              stroke="#3b3b3b"
              strokeWidth={2}
              fill="none"
              opacity={0.5}
            />
          </g>
        ))}

        {/* Mitad derecha (pulcra) */}
        <rect x="200" y="0" width="200" height="400" fill="url(#gradRight)" />
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={`r-${i}`}>
            <line x1={230 + i * 16} y1={80} x2={230 + i * 16} y2={320} stroke="#3A2D12" strokeWidth={2} opacity={0.35} />
            <circle cx={230 + i * 16} cy={120 + (i % 4) * 40} r={4} fill="#3A2D12" opacity={0.5} />
          </g>
        ))}
      </g>

      {/* X central */}
      <g>
        <path d="M110 110 L290 290" stroke="#111" strokeWidth="34" strokeLinecap="round" opacity={0.85} />
        <path d="M290 110 L110 290" stroke="#111" strokeWidth="34" strokeLinecap="round" opacity={0.85} />
        <path d="M110 110 L290 290" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" />
        <path d="M290 110 L110 290" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" />
      </g>
    </svg>
  );
}

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

export function XCoinLanding() {
// Dentro del JSX del Hero:
const prefersReduced = useReducedMotion();
  return (
    <main className="min-h-screen bg-graphite text-slate-100">
      {/* Navbar */}
      <header className="sticky top-0 backdrop-blur bg-black/40 border-b border-neutral-800 z-50">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-slate-200 to-amber-500" />
            <span className="font-semibold tracking-wide">XCoin</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((n) => (
              <a key={n.label} href={n.href} className="text-neutral-300 hover:text-white">
                {n.label}
              </a>
            ))}
          </nav>
          {/* Header stats (visible on md+ next to nav) */}
          <div className="hidden md:flex items-center gap-4">
            <HeaderStatsComponent />
          </div>
          <div className="flex items-center gap-3">
            <select aria-label="language" className="bg-carbon text-sm rounded-xl px-2 py-1 border border-neutral-700">
              <option>ES</option>
              <option>EN</option>
              <option>ZH</option>
              <option>JA</option>
              <option>KO</option>
              <option>DE</option>
              <option>IT</option>
              <option>FR</option>
              <option>PT</option>
              <option>AR</option>
              <option>RU</option>
            </select>
            <a href="#whitelist" className="rounded-2xl bg-amber-500 px-4 py-2 text-black font-semibold hover:bg-amber-400 transition">
              Whitelist
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
          {/* Texto (izquierda en desktop) */}
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
              <span className="font-medium">XCoin</span> es un experimento de acumulación disciplinada: <br />
              <span className="italic">Acumular hoy. Liberar mañana. Decidir entre todos.</span>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#whitepaper" className="rounded-2xl border border-neutral-700 px-4 py-2 hover:bg-white/5">
                Leer Whitepaper
              </a>
              <a href="#tokenomics" className="rounded-2xl bg-steel px-4 py-2 hover:opacity-90">
                Ver Tokenomics 80/20
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <Stat label="Precio de entrada" value="$1 USD" sub="Compra inicial" />
              <Stat label="Reserva Casa" value="20%" sub="Tesorería y estabilidad" />
              <Stat label="Bloqueo" value="Por hitos de MC" sub="Market Cap objetivo" />
            </div>
          </motion.div>

          {/* Moneda (derecha en desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center md:justify-end md:order-2 order-1"
          >
            <motion.div
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              animate={prefersReduced ? {} : { rotateY: [0, 360] }}
              transition={prefersReduced ? {} : { duration: 10, repeat: Infinity, ease: "linear" }}
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

      {/* Manifesto / About */}
      <section id="whitepaper" className="border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle k="Manifiesto" sub="Transparencia técnica y disciplina colectiva" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4 text-neutral-300 leading-relaxed">
              <p>
                XCoin propone una regla clara y auditable: los tokens adquiridos se
                bloquean por fases hasta que el proyecto alcance hitos de capitalización de mercado
                definidos en el whitepaper y verificados por oráculos públicos.
              </p>
              <p>
                La especulación temprana se transforma en acumulación genuina. Cada tenedor pasa a ser
                parte de una estrategia colectiva de largo plazo con visibilidad on-chain.
              </p>
              <p>
                Nuestro compromiso es con el código abierto, la gobernanza ética y la defensa contra prácticas
                predatorias: liberaciones escalonadas, tesorería estabilizadora y métricas públicas.
              </p>
            </div>
            <div className="bg-carbon p-5 rounded-2xl border border-neutral-700">
              <h3 className="font-semibold text-slate-100">Descargas</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="hover:underline" href="#">Whitepaper (PDF)</a></li>
                <li><a className="hover:underline" href="#">Repositorio (GitHub)</a></li>
                <li><a className="hover:underline" href="#">Auditoría (próximamente)</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section id="tokenomics" className="border-t border-neutral-800 bg-[#161616]">
          <section className="mx-auto max-w-6xl px-4 mt-10">
            <TreasuryDonut />
          </section>
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle k="Tokenomics 80/20" sub="Diseñado para acumulación responsable" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3 text-neutral-300">
              <div className="rounded-xl bg-carbon p-4 border border-neutral-700">
                <div className="text-slate-100 font-semibold">Distribución inicial</div>
                <p className="text-sm mt-1">80% Usuarios (bloqueado por fases) · 20% Tesorería (estabilidad, desarrollo, MM).</p>
              </div>
              <div className="rounded-xl bg-carbon p-4 border border-neutral-700">
                <div className="text-slate-100 font-semibold">Precio de lanzamiento</div>
                <p className="text-sm mt-1">Entrada fija a 1 USD por token.</p>
              </div>
              <div className="rounded-xl bg-carbon p-4 border border-neutral-700">
                <div className="text-slate-100 font-semibold">Oráculo</div>
                <p className="text-sm mt-1">Feed público que publica Market Cap objetivo y activa desbloqueos.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-700 p-6 bg-linear-to-br from-[#2C2C2C] to-[#1f1f1f]">
              <div className="text-slate-100 font-semibold mb-2">Fases de desbloqueo (ejemplo)</div>
              <ul className="space-y-3 text-neutral-300 text-sm">
                <li>• Fase 1 — 10% del objetivo: libera 10% de cada tenencia</li>
                <li>• Fase 2 — 25% del objetivo: libera +15%</li>
                <li>• Fase 3 — 50% del objetivo: libera +25%</li>
                <li>• Fase 4 — 75% del objetivo: libera +25%</li>
                <li>• Fase 5 — 100% del objetivo: libera el resto</li>
              </ul>
              <p className="mt-4 text-xs text-neutral-400">*Ejemplo de referencia. Los porcentajes finales se fijan en el whitepaper.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard (placeholder) */}
      <section id="dashboard" className="border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle k="Dashboard en vivo" sub="Oráculo, progreso y transparencia" />

          <div className="grid md:grid-cols-3 gap-6">
            <Stat label="BTC Market Cap (oracle)" value="$ —" sub="Feed pendiente de integrar" />
            <Stat label="Objetivo XCoin" value="$ —" sub="Definido en whitepaper" />
            <Stat label="Progreso" value="— %" sub="Promedio móvil anti-manipulación" />
          </div>

          <div className="mt-6 rounded-2xl border border-neutral-800 p-6 bg-[#121212] text-neutral-300">
            <p>
              Aquí conectaremos el contrato de oráculo y el smart contract de desbloqueo.
              Se mostrará el % alcanzado frente al objetivo, el historial de actualizaciones del oráculo
              y el estado de cada fase. También podremos exponer eventos on-chain en tiempo real.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="border-t border-neutral-800 bg-[#161616]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle k="Roadmap" sub="Del concepto al lanzamiento" />
          <ol className="relative border-l border-neutral-700 pl-6 space-y-8">
            <li>
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-amber-500" />
              <div className="text-slate-100 font-semibold">Fase 1 – Concepción</div>
              <div className="text-neutral-300 text-sm">Nombre, manifiesto, marca, tokenomics, registro.</div>
            </li>
            <li>
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-amber-500" />
              <div className="text-slate-100 font-semibold">Fase 2 – Whitepaper & Legal</div>
              <div className="text-neutral-300 text-sm">Documento técnico, reglas de desbloqueo, compliance.</div>
            </li>
            <li>
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-amber-500" />
              <div className="text-slate-100 font-semibold">Fase 3 – Smart Contracts</div>
              <div className="text-neutral-300 text-sm">Token ERC-20, Vault de bloqueo, oráculo integrado (testnet).</div>
            </li>
            <li>
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-amber-500" />
              <div className="text-slate-100 font-semibold">Fase 4 – Web + Dashboard</div>
              <div className="text-neutral-300 text-sm">Landing multilengua, panel en vivo, repos y docs.</div>
            </li>
            <li>
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-amber-500" />
              <div className="text-slate-100 font-semibold">Fase 5 – Lanzamiento</div>
              <div className="text-neutral-300 text-sm">Mainnet, comunicación internacional, apertura controlada.</div>
            </li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-3 gap-6 text-sm text-neutral-400">
          <div>
            <div className="font-semibold text-slate-100">XCoin</div>
            <p className="mt-2">El otro lado del bloque.</p>
          </div>
          <div>
            <div className="font-semibold text-slate-100">Recursos</div>
            <ul className="mt-2 space-y-1">
              <li><a className="hover:underline" href="#whitepaper">Whitepaper</a></li>
              <li><a className="hover:underline" href="#tokenomics">Tokenomics</a></li>
              <li><a className="hover:underline" href="#dashboard">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-100">Legal</div>
            <p className="mt-2">No es asesoramiento financiero. El uso de XCoin implica riesgos. Lea el whitepaper.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
