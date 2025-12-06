"use client";

import React from "react";

export default function TreasuryDonut() {
  return (
    <section className="w-full py-12 lg:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 rounded-3xl bg-[radial-gradient(circle_at_top,_#0f172a_0,_#020617_55%,_#000_100%)] px-6 py-10 shadow-[0_0_40px_rgba(56,189,248,0.25)] ring-1 ring-cyan-500/20 lg:flex-row lg:items-center lg:px-10 lg:py-12">
        {/* Donut */}
        <div className="flex w-full flex-1 items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Círculo principal */}
            <div className="h-52 w-52 rounded-full bg-[conic-gradient(from_220deg,_#22d3ee_0,_#22d3ee_22%,_rgba(15,23,42,0.85)_22%,_rgba(15,23,42,0.85)_100%)] shadow-[0_0_60px_rgba(56,189,248,0.55)]" />

            {/* Agujero central */}
            <div className="absolute h-28 w-28 rounded-full bg-slate-950/95 ring-2 ring-cyan-400/40" />

            {/* Etiqueta central */}
            <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center text-xs uppercase tracking-[0.15em] text-slate-400">
              <span className="text-[0.65rem] text-cyan-300/80">
                Distribución
              </span>
              <span className="mt-1 text-[0.7rem] font-semibold text-slate-50">
                80 / 20
              </span>
            </div>
          </div>
        </div>

        {/* Texto + leyenda */}
        <div className="flex flex-1 flex-col gap-6 text-sm text-slate-300">
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Tokenomics 80/20
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-50 drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]">
              Distribución actual del supply
            </h2>
            <p className="mt-3 max-w-xl text-sm text-slate-300/80">
              El laboratorio mantiene un modelo simple:{" "}
              <span className="font-semibold text-cyan-200">
                80% usuarios (bloqueado en XCoinVault)
              </span>{" "}
              y{" "}
              <span className="font-semibold text-amber-200">
                20% tesorería
              </span>{" "}
              para liquidez, desarrollo y market making.
            </p>
          </header>

          {/* Leyenda */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-900/70 px-4 py-3 ring-1 ring-cyan-500/30">
              <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(56,189,248,0.9)]" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                  Tesorería
                </span>
                <span className="text-sm text-slate-100">
                  20% del supply – estabilidad, MM, reservas.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-900/70 px-4 py-3 ring-1 ring-emerald-400/25">
              <div className="h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                  Usuarios / Circulante
                </span>
                <span className="text-sm text-slate-100">
                  80% del supply, liberado por fases desde XCoinVault.
                </span>
              </div>
            </div>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Todos los datos mostrados pertenecen al{" "}
            <span className="text-cyan-300">entorno de laboratorio</span> sobre
            testnet Sepolia. No representan una emisión en mainnet ni una
            oferta pública.
          </p>
        </div>
      </div>
    </section>
  );
}
