"use client";

import React from "react";

type VestingPhase = {
  id: number;
  label: string;
  thresholdUsd: number;
  unlockedBps: number;
};

type CurrentVestingState = {
  currentPhaseId: number;
  unlockedBps: number;
  marketCapUsd: number;
};

type Props = {
  phases: VestingPhase[];
  state: CurrentVestingState;
};

function formatUsd(value: number) {
  if (!Number.isFinite(value)) return "$ —";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export const VestingPhaseHero: React.FC<Props> = ({ phases, state }) => {
  const current = phases.find((p) => p.id === state.currentPhaseId);
  const next = phases.find((p) => p.id === state.currentPhaseId + 1);

  const unlockedPct = state.unlockedBps / 100;
  const nextThreshold = next?.thresholdUsd ?? current?.thresholdUsd ?? 0;
  const remaining = Math.max(0, nextThreshold - state.marketCapUsd);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-black via-[#0b0810] to-[#1a1020] p-6 md:p-8">
      {/* Glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between relative z-10">
        {/* Bloque principal */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-amber-100">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
            Motor de Vesting XCoin
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            {current ? current.label : "Fase desconocida"}
          </h2>
          <p className="max-w-xl text-sm text-neutral-300">
            La tesorería de XCoin se desbloquea en fases dinámicas según el
            MarketCap. A mayor adopción, mayor porcentaje del{" "}
            <span className="font-semibold text-amber-200">Vault 80%</span> se
            libera hacia los usuarios.
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 lg:grid-cols-4">
            <div className="rounded-2xl bg-white/5 px-4 py-3 border border-white/10 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                Fase actual
              </div>
              <div className="mt-1 text-lg font-semibold text-amber-200">
                #{state.currentPhaseId}
              </div>
              {current && (
                <div className="mt-0.5 text-[11px] text-neutral-400">
                  {current.label}
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white/5 px-4 py-3 border border-amber-500/30 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                Desbloqueado
              </div>
              <div className="mt-1 text-lg font-semibold text-amber-100">
                {unlockedPct.toFixed(2)}%
              </div>
              <div className="mt-0.5 text-[11px] text-neutral-400">
                ({state.unlockedBps} bps)
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 px-4 py-3 border border-purple-500/30 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                MarketCap actual
              </div>
              <div className="mt-1 text-lg font-semibold text-purple-100">
                {formatUsd(state.marketCapUsd)}
              </div>
              <div className="mt-0.5 text-[11px] text-neutral-400">
                Oráculo laboratorio
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 px-4 py-3 border border-emerald-500/30 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                Próximo umbral
              </div>
              <div className="mt-1 text-lg font-semibold text-emerald-100">
                {next ? formatUsd(next.thresholdUsd) : "—"}
              </div>
              <div className="mt-0.5 text-[11px] text-neutral-400">
                Faltan:{" "}
                {next
                  ? formatUsd(remaining)
                  : "Última fase alcanzada en laboratorio"}
              </div>
            </div>
          </div>
        </div>

        {/* Badge lateral “El otro lado del bloque” */}
        <div className="mt-2 flex flex-col items-end justify-between gap-4 md:mt-0">
          <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-right text-xs text-neutral-300 max-w-[220px]">
            <div className="text-[10px] uppercase tracking-[0.2em] text-amber-200">
              El otro lado del bloque
            </div>
            <div className="mt-1 font-medium text-neutral-100">
              Cuando el MarketCap cruza el umbral, el protocolo libera una
              nueva porción de XCoin desde el Vault hacia el ecosistema.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border border-amber-400/60 bg-gradient-to-br from-amber-500/40 to-fuchsia-500/40 shadow-[0_0_25px_rgba(251,191,36,0.55)]" />
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                XCoin Vesting Engine
              </div>
              <div className="text-xs text-neutral-300">
                80% supply bloqueado, liberado por fases on-chain.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
