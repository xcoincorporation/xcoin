"use client";

import React from "react";

interface Props {
  marketCapUsd?: number | null;
  targetUsd?: number;
}

function formatUsd(value?: number | null) {
  if (!value || value <= 0) return "—";
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

export default function LandingOracleDashboard({
  marketCapUsd,
  targetUsd = 20_000_000,
}: Props) {
  const progressPct =
    marketCapUsd && marketCapUsd > 0 ? (marketCapUsd / targetUsd) * 100 : 0;

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[radial-gradient(circle_at_top,_#020617_0,_#020617_55%,_#000_100%)] px-6 py-10 shadow-[0_0_40px_rgba(56,189,248,0.25)] ring-1 ring-cyan-500/25 lg:px-10 lg:py-12">
        <header className="mb-6 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Dashboard en vivo
          </p>
          <h2 className="text-2xl font-semibold text-slate-50 drop-shadow-[0_0_30px_rgba(56,189,248,0.7)]">
            Oráculo, progreso y transparencia del motor de vesting en testnet.
          </h2>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          {/* MarketCap */}
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-5 shadow-[0_0_28px_rgba(56,189,248,0.55)]">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Ethereum Market Cap (oráculo)
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-50">
              ${formatUsd(marketCapUsd)}{" "}
              <span className="text-xs font-normal text-slate-400">USD</span>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Valor reportado por el endpoint{" "}
              <span className="text-cyan-200">/api/oracle</span>.
            </p>
          </div>

          {/* Objetivo */}
          <div className="rounded-2xl border border-emerald-400/25 bg-slate-950/90 p-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Objetivo XCoin
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-50">
              ${formatUsd(targetUsd)}{" "}
              <span className="text-xs font-normal text-slate-400">USD</span>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Objetivo configurado para el desbloqueo total del Vault.
            </p>
          </div>

          {/* Progreso */}
          <div className="rounded-2xl border border-indigo-400/30 bg-slate-950/90 p-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-indigo-300">
              Progreso hacia el objetivo
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-slate-50">
                {progressPct > 0 ? progressPct.toFixed(1) : "—"}
              </p>
              <span className="text-xs font-semibold text-indigo-300">%</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Se calcula con los mismos datos que alimentan a{" "}
              <span className="text-indigo-200">XCoinVault</span>.
            </p>

            {/* Barra de progreso */}
            <div className="mt-4 h-2 w-full rounded-full bg-slate-800/80">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400 shadow-[0_0_18px_rgba(56,189,248,0.9)]"
                style={{ width: `${Math.min(progressPct, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <p className="mt-5 text-[0.7rem] text-slate-500">
          Los valores mostrados corresponden al{" "}
          <span className="text-cyan-300">laboratorio en testnet</span>. No
          constituyen recomendación de inversión ni reflejan datos de mercado
          reales.
        </p>
      </div>
    </section>
  );
}
